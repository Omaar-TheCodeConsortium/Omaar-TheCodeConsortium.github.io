import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Barbell, Ends, Tray } from '../Loader.jsx';
import { useCount } from '../useCount.js';
import {
  BARS,
  SET_FROM_KG,
  formatKg,
  formatPrice,
  lineKey,
  linePrice,
  linesForLoad,
  loadKg,
  productBySlug,
  roomOnSleeve,
  shipsAs,
  sideForTarget,
  sizeLabel,
  toLb,
  totals,
} from '../catalog.js';
import { useTopforce } from '../topforceContext.js';
import { BASE } from '../site.js';

const BAR = productBySlug('olympic-bar');
const EXTRAS = [
  { slug: 'collars', kg: 0.21, text: 'A pair. Keeps the plates where you put them.' },
  { slug: 'bench', kg: 38, text: 'Seven back angles, flat to 85°.' },
  { slug: 'half-rack', kg: 96, text: 'Hooks, safety arms and a pull-up bar.' },
];
const TARGETS = [60, 100, 140, 180];

export default function Build() {
  const { load, loadPlate, unloadPlate, strip, setBar, loadTo, add } = useTopforce();
  const [target, setTarget] = useState('');
  const [note, setNote] = useState('');
  const [extras, setExtras] = useState({ collars: true, bench: false, 'half-rack': false });
  const [added, setAdded] = useState(false);

  const kg = loadKg(load.bar, load.side);
  const shown = useCount(kg);
  const lines = [
    ...linesForLoad(load.bar, load.side, { collars: extras.collars }),
    ...EXTRAS.filter((extra) => extra.slug !== 'collars' && extras[extra.slug]).map(({ slug, kg: weight }) => ({ slug, kg: weight, qty: 1 })),
  ];
  const sum = totals(lines);
  const toSet = SET_FROM_KG - sum.plateKg;

  const touch = (action) => (value) => {
    setAdded(false);
    setNote('');
    action(value);
  };

  const aim = (value) => {
    const wanted = Number(value);
    const lightest = BARS[load.bar].kg;
    setAdded(false);
    if (!Number.isFinite(wanted) || wanted < lightest) {
      setNote(`The bar alone is ${lightest} kg. Type a weight above that.`);
      return;
    }
    const reached = loadKg(load.bar, sideForTarget(load.bar, wanted));
    loadTo(load.bar, wanted);
    setTarget(String(wanted));
    setNote(
      reached === wanted
        ? `Loaded to ${formatKg(reached)} kg.`
        : `The plates make ${formatKg(reached)} kg, the nearest under ${formatKg(wanted)}.`,
    );
  };

  return (
    <div className="tf-build">
      <header className="tf-page-head">
        <h1 className="tf-mega">Build a set.</h1>
        <div className="tf-page-head-side">
          <p className="tf-lede">
            Type the weight you want on the bar, or tap plates on one pair at a time. The price and the freight follow
            the weight.
          </p>
        </div>
      </header>

      <section className="tf-build-stage" aria-label="The loaded bar">
        <p className="tf-build-kg" aria-hidden="true">
          {formatKg(Math.round(shown * 2) / 2)}
          <small>kg</small>
        </p>
        <p className="sr-only" role="status">
          {formatKg(kg)} kilograms on the bar, {toLb(kg)} pounds.
        </p>
        <Barbell bar={load.bar} side={load.side} onUnload={touch(unloadPlate)} />
        <p className="tf-build-under">
          <span>{toLb(kg)} lb</span>
          <span>
            {formatKg((kg - BARS[load.bar].kg) / 2)} kg on each end of a {load.bar} kg bar
          </span>
        </p>
      </section>

      <div className="tf-build-cols">
        <div className="tf-steps">
          <section className="tf-step" aria-labelledby="tf-step-bar">
            <h2 id="tf-step-bar" className="tf-step-name">
              <span aria-hidden="true">1</span> Pick the bar
            </h2>
            <div className="tf-options" role="group" aria-label="Bar">
              {BAR.sizes.map((size) => (
                <button
                  key={size.kg}
                  type="button"
                  className="tf-option"
                  aria-pressed={load.bar === size.kg}
                  onClick={() => touch(setBar)(size.kg)}
                >
                  <span className="tf-option-fig">
                    {size.kg}
                    <small>kg</small>
                  </span>
                  <span className="tf-option-text">
                    <strong>{formatPrice(size.price).replace(/\.00$/, '')}</strong>
                    {size.dims}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="tf-step" aria-labelledby="tf-step-load">
            <h2 id="tf-step-load" className="tf-step-name">
              <span aria-hidden="true">2</span> Load it
            </h2>
            <form
              className="tf-target"
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                aim(target);
              }}
            >
              <label htmlFor="tf-target-kg" className="tf-label">
                Weight you want on the bar, in kg
              </label>
              <div className="tf-target-row">
                <input
                  id="tf-target-kg"
                  type="number"
                  inputMode="decimal"
                  min={BARS[load.bar].kg}
                  max="400"
                  step="0.5"
                  placeholder={String(kg)}
                  value={target}
                  onChange={(event) => setTarget(event.target.value)}
                />
                <button type="submit" className="tf-btn">
                  Load to this weight
                </button>
              </div>
              <div className="tf-target-quick" role="group" aria-label="Common weights">
                {TARGETS.map((value) => (
                  <button key={value} type="button" className="tf-chip" onClick={() => aim(value)}>
                    {value} kg
                  </button>
                ))}
              </div>
              <p className="tf-target-note" role="status">
                {note}
              </p>
            </form>

            <Tray bar={load.bar} side={load.side} onLoad={touch(loadPlate)} label="Or load a plate on each end" />
            <Ends side={load.side} onUnload={touch(unloadPlate)} onStrip={touch(strip)} />
            {roomOnSleeve(load.bar, load.side) < 15 && (
              <p className="tf-step-hint">The sleeves are full. A {load.bar} kg bar holds no more than this in these plates.</p>
            )}
          </section>

          <section className="tf-step" aria-labelledby="tf-step-extras">
            <h2 id="tf-step-extras" className="tf-step-name">
              <span aria-hidden="true">3</span> Add what goes round it
            </h2>
            <ul className="tf-extras">
              {EXTRAS.map((extra) => {
                const product = productBySlug(extra.slug);
                return (
                  <li key={extra.slug}>
                    <label className="tf-extra">
                      <input
                        type="checkbox"
                        checked={extras[extra.slug]}
                        onChange={(event) => {
                          setExtras({ ...extras, [extra.slug]: event.target.checked });
                          setAdded(false);
                        }}
                      />
                      <span className="tf-extra-box" aria-hidden="true" />
                      <span className="tf-extra-text">
                        <strong>{product.name}</strong>
                        {extra.text}
                      </span>
                      <span className="tf-extra-price">{formatPrice(product.sizes[0].price).replace(/\.00$/, '')}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <aside className="tf-ticket" aria-labelledby="tf-ticket-title">
          <h2 id="tf-ticket-title" className="tf-step-name">
            Your set
          </h2>
          <ul className="tf-ticket-lines">
            {lines.map((line) => {
              const product = productBySlug(line.slug);
              return (
                <li key={lineKey(line)}>
                  <span>
                    {line.qty > 1 ? `${line.qty} × ` : ''}
                    {product.name}
                    <small>{product.sizes.length > 1 ? sizeLabel(product, line.kg) : `One ${product.unit}`}</small>
                  </span>
                  <span>{formatPrice(linePrice(line))}</span>
                </li>
              );
            })}
          </ul>
          <dl className="tf-ticket-sums">
            {sum.isSet && (
              <div>
                <dt>Set price, 8% off {formatKg(sum.plateKg)} kg of plates</dt>
                <dd>−{formatPrice(sum.discount)}</dd>
              </div>
            )}
            <div>
              <dt>Freight, {formatKg(Math.round(sum.kg))} kg</dt>
              <dd>{sum.freight === 0 ? 'Free' : formatPrice(sum.freight)}</dd>
            </div>
          </dl>
          <p className="tf-ticket-total" aria-live="polite">
            {formatPrice(sum.total)}
          </p>
          <p className="tf-ticket-note">
            {!sum.isSet && toSet > 0 && `Add ${formatKg(toSet)} kg more plates and all the plates cost 8% less. `}
            {shipsAs(sum.pallet)}.
          </p>
          {added ? (
            <Link to={`${BASE}cart/`} className="tf-btn tf-btn--iron">
              In the cart. Open it
            </Link>
          ) : (
            <button
              type="button"
              className="tf-btn tf-btn--iron"
              onClick={() => {
                add(...lines);
                setAdded(true);
              }}
            >
              Add the set to the cart
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
