import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Barbell, Tray } from '../Loader.jsx';
import { Shot } from '../Media.jsx';
import { useCount } from '../useCount.js';
import {
  CATEGORIES,
  PRODUCTS,
  formatKg,
  formatPrice,
  fromPrice,
  linesForLoad,
  loadKg,
  productBySlug,
  productsIn,
  salePrice,
  sizeLabel,
  toLb,
  totals,
} from '../catalog.js';
import { useTopforce } from '../topforceContext.js';
import { BASE, categoryPath, productPath } from '../site.js';

const RATED = PRODUCTS.filter((product) => product.rate).sort((a, b) => a.rate - b.rate);
const BAR = productBySlug('olympic-bar');

function Hero() {
  const { load, loadPlate, unloadPlate, strip, add } = useTopforce();
  const [added, setAdded] = useState(false);
  const kg = loadKg(load.bar, load.side);
  const shown = useCount(kg);
  const lines = linesForLoad(load.bar, load.side);
  const set = totals(lines);
  const price = set.subtotal - set.discount;

  const change = (action) => (value) => {
    setAdded(false);
    action(value);
  };

  return (
    <section className="tf-hero" aria-labelledby="tf-hero-title">
      <h1 id="tf-hero-title" className="tf-mega tf-hero-title">
        Load <br />
        the bar.
      </h1>

      <Barbell view="end" className="tf-hero-bar" bar={load.bar} side={load.side} onUnload={change(unloadPlate)} />

      <div className="tf-hero-mid">
        <div className="tf-hero-read">
          <p className="tf-label">
            On the bar, {toLb(kg)} lb
          </p>
          <p className="tf-hero-kg" aria-hidden="true">
            {formatKg(Math.round(shown * 2) / 2)}
            <small>kg</small>
          </p>
          <p className="sr-only" role="status">
            {formatKg(kg)} kilograms on the bar, {toLb(kg)} pounds. This set costs {formatPrice(price)}.
          </p>
        </div>

        <div className="tf-hero-buy">
          <div className="tf-hero-cost">
            <p className="tf-label">{set.isSet ? 'Set price, plates 8% off' : 'Bar, plates and collars'}</p>
            <p className="tf-hero-price">{formatPrice(price)}</p>
          </div>
          {added ? (
            <Link to={`${BASE}cart/`} className="tf-btn tf-btn--volt">
              In the cart. Open it
            </Link>
          ) : (
            <button
              type="button"
              className="tf-btn tf-btn--volt"
              onClick={() => {
                add(...lines);
                setAdded(true);
              }}
            >
              Add this set to the cart
            </button>
          )}
        </div>
      </div>

      <div className="tf-hero-rack">
        <Tray bar={load.bar} side={load.side} onLoad={change(loadPlate)} quiet />
      </div>

      <div className="tf-hero-hint">
          <p>Tap a plate to load a pair. Tap one on the bar to take it off.</p>
          <p>
            <button type="button" className="tf-text-btn" onClick={() => change(strip)()}>
              Strip the bar
            </button>
            <Link to={`${BASE}build/`} className="tf-text-btn">
              Type a target weight
            </Link>
          </p>
      </div>

      <p className="tf-hero-caption tf-label" aria-hidden="true">
        {load.side.length > 0 ? `Each end: ${load.side.map(formatKg).join(' + ')} kg` : `The ${load.bar} kg bar alone`}
      </p>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />

      <section className="tf-kilo" aria-labelledby="tf-kilo-title">
        <div className="tf-kilo-head">
          <h2 id="tf-kilo-title" className="tf-h2">
            Iron is iron. We sell it by the kilo.
          </h2>
          <p className="tf-lede">
            Every price here is a rate multiplied by a weight, and the rate is printed beside it. Hold it up against
            anyone’s.
          </p>
        </div>
        <ul className="tf-rates">
          {RATED.map((product) => (
            <li key={product.slug}>
              <Link to={productPath(product.slug)} className="tf-rate">
                <span className="tf-rate-name">{product.name}</span>
                <span className="tf-rate-eg">
                  {sizeLabel(product, product.start)} is {formatPrice(salePrice(product, product.start))}
                </span>
                <span className="tf-rate-fig">
                  {formatPrice(product.rate)}
                  <small>/kg</small>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="tf-floor" aria-labelledby="tf-floor-title">
        <div className="tf-band-head">
          <h2 id="tf-floor-title" className="tf-h2">
            Eight products. That is the range.
          </h2>
          <p className="tf-lede">
            We make what a strength room needs, and nothing we cannot put on our own test rigs.{' '}
            <Link to={`${BASE}shop/`} className="tf-link">
              See all eight
            </Link>
          </p>
        </div>
        <ul className="tf-lanes">
          {CATEGORIES.map((category) => {
            const products = productsIn(category.id);
            const lead = products[0];
            return (
              <li key={category.id}>
                <Link to={categoryPath(category.id)} className="tf-lane">
                  <Shot name={lead.photo} alt={lead.alt} cut />
                  <span className="tf-lane-text">
                    <span className="tf-lane-name">{category.id === 'racks' ? 'Racks' : category.name}</span>
                    <span className="tf-lane-line">{category.line}</span>
                    <span className="tf-label">
                      {lead.rate
                        ? `${formatPrice(lead.rate)} per kg`
                        : `From ${formatPrice(Math.min(...products.filter((item) => item.slug !== 'collars').map(fromPrice))).replace(/\.00$/, '')}`}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="tf-drop" aria-labelledby="tf-drop-title">
        <Shot
          name="drop"
          alt="A loaded barbell with black bumper plates bouncing a hand's width off a rubber platform, chalk dust hanging in the air"
        />
        <div className="tf-drop-text">
          <h2 id="tf-drop-title" className="tf-h2">
            Dropped 30,000 times before you drop it once.
          </h2>
          <p className="tf-lede">
            One plate from every batch goes on the rig. If its steel insert has moved more than 0.3 mm by the end, the
            whole batch is scrapped.
          </p>
          <dl className="tf-tally">
            <div>
              <dt>Drop height</dt>
              <dd>2.3 m</dd>
            </div>
            <div>
              <dt>Load on the bar</dt>
              <dd>140 kg</dd>
            </div>
            <div>
              <dt>Insert movement allowed</dt>
              <dd>0.3 mm</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="tf-grip" aria-labelledby="tf-grip-title">
        <div className="tf-grip-art">
          <Shot name="knurl" alt="A chalked hand closed around the knurled black shaft of a barbell, seen close up" />
        </div>
        <div className="tf-grip-text">
          <h2 id="tf-grip-title" className="tf-h2">
            The bar is the part you hold on every rep.
          </h2>
          <p className="tf-lede">
            So it gets the most attention. Alloy steel, a knurl that holds without chalk, and sleeves that keep turning
            when the plates do not want to.
          </p>
          <dl className="tf-facts">
            <div>
              <dt>Tensile strength of the shaft</dt>
              <dd>190,000 PSI</dd>
            </div>
            <div>
              <dt>Knurl depth, volcano pattern</dt>
              <dd>1.2 mm</dd>
            </div>
            <div>
              <dt>Unloaded sleeve spin, by hand</dt>
              <dd>11 s</dd>
            </div>
            <div>
              <dt>Static load, held for a minute</dt>
              <dd>680 kg</dd>
            </div>
          </dl>
          <Link to={productPath(BAR.slug)} className="tf-btn">
            See the Olympic bar, ${BAR.sizes[0].price}
          </Link>
        </div>
      </section>

      <section className="tf-origin" aria-labelledby="tf-origin-title">
        <Shot
          name="foundry"
          alt="Molten iron pouring from a ladle into a row of sand moulds on a foundry floor, throwing sparks"
        />
        <div className="tf-origin-text">
          <h2 id="tf-origin-title" className="tf-h2">
            Poured in Nantong since 2009.
          </h2>
          <div className="tf-origin-cols">
            <p>
              For eleven years we cast plates and kettlebells that left the factory under other companies’ names. In
              2020 we put our own on them and started selling direct.
            </p>
            <p>
              The foundry, the machine shop and the rubber press are on one site, which is why we can tell you what a
              kilo costs. In 2025 we poured 11,400 tonnes of iron.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
