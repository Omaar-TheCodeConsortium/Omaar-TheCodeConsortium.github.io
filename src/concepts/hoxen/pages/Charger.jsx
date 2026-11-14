import { useState, useSyncExternalStore } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Case, Cut } from '../Media.jsx';
import { cutout } from '../cutouts.js';
import {
  CABLES,
  CASE_COLOURS,
  CASE_MODELS,
  CASE_PRICE,
  CASE_PRICE_WITH_CHARGER,
  CHARGERS,
  PLUGS,
  chargerByWatts,
  deviceById,
  formatPrice,
  minutesToHalf,
} from '../catalog.js';
import { useHoxen } from '../hoxenContext.js';
import { BASE } from '../site.js';

const tallest = Math.max(...CHARGERS.map((charger) => cutout(`charger-${charger.watts}`).h));
const SAMPLE_DEVICES = ['iphone-17-pro', 'ipad-pro-13', 'macbook-air-13', 'macbook-pro-16'].map(deviceById);

const subscribeToNothing = () => () => {};

const sharing = (charger) =>
  Object.entries(charger.splits)
    .filter(([count]) => Number(count) > 1)
    .map(([, split]) => split.join(' + '))
    .join(', or ');

export default function Charger() {
  const { add } = useHoxen();
  const [params] = useSearchParams();
  const [pickedWatts, setWatts] = useState(null);
  const [plug, setPlug] = useState('us');
  const [cable, setCable] = useState('c2');
  const [withCase, setWithCase] = useState(false);
  const [model, setModel] = useState(CASE_MODELS[1]);
  const [colour, setColour] = useState('graphite');
  const [added, setAdded] = useState(false);

  // A link from elsewhere on the site can name the size to start on. It is honoured only once the
  // page is running in the browser, so the pre-rendered page and the first paint agree.
  const inBrowser = useSyncExternalStore(subscribeToNothing, () => true, () => false);
  const asked = Number(params.get('w'));
  const fromLink = inBrowser && CHARGERS.some((item) => item.watts === asked) ? asked : 65;
  const watts = pickedWatts ?? fromLink;

  const charger = chargerByWatts(watts);
  const cableChoice = CABLES.find((item) => item.id === cable);
  const colourChoice = CASE_COLOURS.find((item) => item.id === colour);
  const total = charger.price + cableChoice.price + (withCase ? CASE_PRICE_WITH_CHARGER : 0);
  const cableHoldsBack = cableChoice.limit !== null && cableChoice.limit < charger.watts;

  const change = (setter) => (value) => {
    setter(value);
    setAdded(false);
  };

  const addToBag = () => {
    add({ kind: 'charger', watts, plug, cable });
    if (withCase) add({ kind: 'case', model, colour, bundled: true });
    setAdded(true);
  };

  return (
    <>
      <div className="hx-config">
        <div className="hx-config-stage">
          <p className="hx-config-watt" aria-hidden="true">
            {watts}
          </p>
          <div className="hx-config-product">
            <Cut
              key={watts}
              name={`charger-${watts}`}
              eager
              className="hx-swap"
              alt={`${charger.name}, front view, ${charger.ports} USB-C ${charger.ports === 1 ? 'port' : 'ports'} lined in orange`}
              // Beside a phone case the charger is shown at its true size relative to the phone.
              style={{ '--tall': (cutout(`charger-${watts}`).h / tallest) * (withCase ? 0.56 : 1) }}
            />
            {withCase && (
              <Case view="case-back" tint={colourChoice.tint} alt={`Case for ${model} in ${colourChoice.name}, back view`} className="hx-swap" />
            )}
          </div>
        </div>

        <form className="hx-config-form" onSubmit={(event) => event.preventDefault()}>
          <div>
            <h1 className="hx-h2">Build your charger</h1>
            <p className="hx-lede mt-4">Four choices. The price and what it will charge update as you go.</p>
          </div>

          <fieldset>
            <legend>
              <span className="hx-mono">01</span>Power
            </legend>
            <div className="hx-opts sm:grid-cols-2">
              {CHARGERS.map((item) => (
                <label key={item.id} className="hx-opt">
                  <input type="radio" name="watts" value={item.watts} checked={watts === item.watts} onChange={() => change(setWatts)(item.watts)} />
                  <span className="hx-opt-name">{item.watts} W</span>
                  <span className="hx-opt-detail">
                    {item.ports} {item.ports === 1 ? 'port' : 'ports'} · {item.weight} g
                  </span>
                  <span className="hx-opt-price">{formatPrice(item.price)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <span className="hx-mono">02</span>Plug
            </legend>
            <div className="hx-opts grid-cols-3">
              {PLUGS.map((item) => (
                <label key={item.id} className="hx-opt">
                  <input type="radio" name="plug" value={item.id} checked={plug === item.id} onChange={() => change(setPlug)(item.id)} />
                  <span className="hx-opt-name">{item.name}</span>
                  <span className="hx-opt-detail">{item.detail}</span>
                </label>
              ))}
            </div>
            <p className="hx-muted mt-3 text-[0.9rem]">Photographs show the US plug.</p>
          </fieldset>

          <fieldset>
            <legend>
              <span className="hx-mono">03</span>Cable
            </legend>
            <div className="hx-opts sm:grid-cols-3">
              {CABLES.map((item) => (
                <label key={item.id} className="hx-opt">
                  <input type="radio" name="cable" value={item.id} checked={cable === item.id} onChange={() => change(setCable)(item.id)} />
                  <span className="hx-opt-name">{item.name}</span>
                  <span className="hx-opt-detail">{item.detail}</span>
                  {item.price > 0 && <span className="hx-opt-price">+{formatPrice(item.price)}</span>}
                </label>
              ))}
            </div>
            {cableHoldsBack && (
              <p className="mt-3 rounded-[18px] bg-[var(--hx-orange)] px-[18px] py-3 text-[0.95rem] font-semibold" role="status">
                The 1 m cable carries {cableChoice.limit} W, so one port of the {charger.name} would be held to that.
                The 2 m cable carries the full {charger.watts} W.
              </p>
            )}
          </fieldset>

          <fieldset>
            <legend>
              <span className="hx-mono">04</span>Case
            </legend>
            <label className="hx-opt">
              <input type="checkbox" checked={withCase} onChange={(event) => change(setWithCase)(event.target.checked)} />
              <span className="hx-opt-name">Add a phone case</span>
              <span className="hx-opt-detail">
                {formatPrice(CASE_PRICE_WITH_CHARGER)} with a charger, {formatPrice(CASE_PRICE)} on its own
              </span>
              <span className="hx-opt-price">+{formatPrice(CASE_PRICE_WITH_CHARGER)}</span>
            </label>

            {withCase && (
              <div className="mt-4 grid gap-5">
                <div role="radiogroup" aria-label="Phone">
                  <p className="hx-k mb-2">Phone</p>
                  <div className="flex flex-wrap gap-2">
                    {CASE_MODELS.map((name) => (
                      <button key={name} type="button" role="radio" aria-checked={model === name} aria-pressed={model === name} className="hx-chip" onClick={() => change(setModel)(name)}>
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="hx-k mb-3">Colour: {colourChoice.name}</p>
                  <div className="hx-swatches" role="radiogroup" aria-label="Case colour">
                    {CASE_COLOURS.map((item) => (
                      <label key={item.id} className="hx-swatch" style={{ '--sw': item.hex }}>
                        <input type="radio" name="colour" value={item.id} checked={colour === item.id} onChange={() => change(setColour)(item.id)} aria-label={item.name} />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </fieldset>

          <div className="hx-total">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="hx-k">
                  {charger.name} · {PLUGS.find((item) => item.id === plug).name} plug
                  {cable !== 'none' && ` · ${cableChoice.name} cable`}
                  {withCase && ' · case'}
                </p>
                <p className="hx-total-price mt-2" aria-live="polite">
                  {formatPrice(total)}
                </p>
              </div>
              <button type="button" className="hx-btn hx-btn--go" onClick={addToBag}>
                Add to bag
              </button>
            </div>
            <p className="text-[0.92rem] text-[#c3c7cd]" role="status">
              {added ? (
                <>
                  Added.{' '}
                  <Link to={`${BASE}cart/`} className="font-bold text-white underline underline-offset-4">
                    See your bag
                  </Link>
                </>
              ) : total >= 50 ? (
                'Ships free.'
              ) : (
                `Shipping is $6, or free once the bag reaches $50.`
              )}
            </p>
          </div>
        </form>
      </div>

      <section aria-labelledby="hx-does" className="hx-band">
        <div className="hx-band-head">
          <h2 id="hx-does" className="hx-h2">
            What {charger.watts} watts does
          </h2>
          <p className="hx-lede">
            One device on one port, from empty to half full.{' '}
            <Link to={`${BASE}compatibility/`} className="hx-link">
              Check your own devices
            </Link>
          </p>
        </div>
        <ul className="hx-rows">
          {SAMPLE_DEVICES.map((device) => {
            const drawn = Math.min(device.max, charger.watts);
            const full = charger.watts >= device.max;
            return (
              <li key={device.id} className="hx-row md:grid-cols-[1.1fr_2fr_8rem_9rem]">
                <p className="hx-opt-name">{device.name}</p>
                <div>
                  <div className="hx-meter" data-full={full ? '' : undefined} aria-hidden="true">
                    <span style={{ '--fill': `${(drawn / device.max) * 100}%` }} />
                  </div>
                </div>
                <p className="hx-row-fig">{minutesToHalf(device, charger.watts)} min</p>
                <p className="hx-muted text-[0.92rem]">
                  {full ? 'Full speed' : `${drawn} of ${device.max} W`}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="hx-spec" className="hx-band hx-band--pale">
        <div className="hx-band-head">
          <h2 id="hx-spec" className="hx-h2">
            {charger.name}, in full
          </h2>
        </div>
        <dl className="hx-rows md:grid-cols-2">
          {[
            ['Output', `${charger.watts} W from one port`],
            ['Ports', `${charger.ports} × USB-C`],
            ['Sharing', charger.ports > 1 ? `${sharing(charger)} W` : 'One device at a time'],
            ['Standards', charger.pd],
            ['Size', `${charger.size.join(' × ')} mm`],
            ['Weight', `${charger.weight} g`],
            ['Input', '100 to 240 V, 50/60 Hz'],
            ['In the box', `Charger${cable !== 'none' ? `, ${cableChoice.name} cable` : ''}, card sleeve`],
          ].map(([label, value]) => (
            <div key={label} className="hx-row grid-cols-[7rem_1fr]">
              <dt className="hx-k">{label}</dt>
              <dd className="font-bold">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
