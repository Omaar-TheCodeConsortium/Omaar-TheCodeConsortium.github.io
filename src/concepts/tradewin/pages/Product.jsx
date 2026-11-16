import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Carton, Shot, Stepper } from '../Media.jsx';
import {
  DELIVERY_DAYS,
  FREE_POSTAGE_FROM,
  MAX_CARTONS,
  MAX_QTY,
  POSTAGE,
  TIER_FROM,
  cartonKg,
  categoryOf,
  formatCount,
  formatPrice,
  percent,
  tierIndex,
  tierLabel,
  tradeLine,
} from '../catalog.js';
import { useTradewin } from '../tradewinContext.js';
import { baseOf, productPath } from '../site.js';

const plain = (event) => event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

function Stars({ value }) {
  return (
    <span className="tw-stars" role="img" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((step) => (
        <span key={step} data-on={step <= value ? '' : undefined} />
      ))}
    </span>
  );
}

// Buying one, or a few.
function BuyDirect({ product }) {
  const { add, lines, flip } = useTradewin();
  const [qty, setQty] = useState(1);
  const held = lines.find((line) => line.slug === product.slug)?.qty ?? 0;

  return (
    <>
      <p className="tw-item-price">
        <strong>{formatPrice(product.retail)}</strong>
        <span>{product.pack}</span>
      </p>
      <div className="tw-item-act">
        <Stepper value={qty} max={MAX_QTY} onChange={setQty} label="Quantity" unit="item" />
        <button type="button" className="tw-btn tw-btn--loud" onClick={() => add(product.slug, qty)}>
          Add to basket: {formatPrice(product.retail * qty)}
        </button>
      </div>
      <p className="tw-note" role="status">
        {held > 0 ? `${held} in your basket. ` : ''}
        Posted from Yiwu in {DELIVERY_DAYS[0]} to {DELIVERY_DAYS[1]} days. Postage {formatPrice(POSTAGE)}, free over ${FREE_POSTAGE_FROM}.
      </p>
      <p className="tw-item-flip">
        Buying {product.carton} or more?{' '}
        <a
          href={productPath(product.slug, 'trade')}
          onClick={(event) => {
            if (!plain(event)) return;
            event.preventDefault();
            flip();
          }}
        >
          They are {formatPrice(product.trade[0])} each by the carton
        </a>
      </p>
    </>
  );
}

// Buying by the carton. The price a unit steps down at 5 and at 25 cartons.
function BuyTrade({ product }) {
  const { order, setCartons } = useTradewin();
  const on = order[product.slug] ?? 0;
  const [cartons, setLocal] = useState(null);
  const count = cartons ?? (on || 1);
  const tier = tierIndex(count);
  const line = tradeLine(product, count);

  return (
    <>
      <ol className="tw-tiers" aria-label="Price a unit, by cartons ordered">
        {TIER_FROM.map((from, index) => (
          <li key={from} aria-current={index === tier ? 'true' : undefined}>
            <button type="button" onClick={() => setLocal(from)} aria-label={`${tierLabel(index)}: ${formatPrice(product.trade[index])} a unit. Set the order to ${from}.`}>
              <span>{tierLabel(index)}</span>
              <strong>{formatPrice(product.trade[index])}</strong>
            </button>
          </li>
        ))}
      </ol>

      <div className="tw-item-act">
        <Stepper value={count} max={MAX_CARTONS} onChange={setLocal} label="Cartons" unit="carton" />
        <button type="button" className="tw-btn tw-btn--loud" onClick={() => setCartons(product.slug, count)}>
          Put {count} {count === 1 ? 'carton' : 'cartons'} on the order
        </button>
      </div>
      <p className="tw-note" role="status">
        {on > 0 ? `${on} ${on === 1 ? 'carton' : 'cartons'} of these on your order.` : 'None of these on your order yet.'}
      </p>

      <dl className="tw-sum">
        <div>
          <dt>You get</dt>
          <dd>
            {formatCount(line.units)} units, {line.kg.toFixed(1)} kg
          </dd>
        </div>
        <div>
          <dt>You pay</dt>
          <dd>{formatPrice(line.cost)}</dd>
        </div>
        <div>
          <dt>Sells for, at {formatPrice(product.retail)}</dt>
          <dd>{formatPrice(line.resale)}</dd>
        </div>
        <div className="tw-sum-keep">
          <dt>You keep</dt>
          <dd>
            <strong>{formatPrice(line.resale - line.cost)}</strong> {percent((line.resale - line.cost) / line.resale)} of the sale
          </dd>
        </div>
      </dl>
    </>
  );
}

// One product page for both front doors. The route gives it a key by product only, so flipping
// between Direct and Wholesale keeps the page in place and changes what it shows.
export default function Product({ product }) {
  const { side } = useTradewin();
  const trade = side === 'trade';
  const category = categoryOf(product);
  const average = product.reviews.reduce((sum, review) => sum + review.stars, 0) / product.reviews.length;

  return (
    <>
      <article className="tw-item">
        <div className="tw-stage">
          {trade ? <Carton product={product} className="tw-morph" /> : <Shot name={product.photo} alt={product.alt} eager className="tw-morph" />}
          <p className="tw-stage-note">
            {trade
              ? `One carton: ${product.carton} units, ${cartonKg(product).toFixed(1)} kg`
              : `One of the ${formatCount(product.sold)} sold in the last 30 days`}
          </p>
        </div>

        <div className="tw-buy">
          <p className="tw-tag">
            <Link to={baseOf(side)}>{trade ? 'Trade catalogue' : 'Shop'}</Link> · {category.name} · {product.sku}
          </p>
          <h1 className="tw-display tw-item-name">{product.name}</h1>
          <p className="tw-lede">{product.blurb}</p>
          {trade ? <BuyTrade product={product} /> : <BuyDirect product={product} />}
        </div>
      </article>

      <section className="tw-more" aria-labelledby="tw-spec-title">
        <div>
          <h2 id="tw-spec-title" className="tw-title">
            {trade ? 'What is in the carton' : 'What you get'}
          </h2>
          <dl className="tw-specs">
            <div>
              <dt>{trade ? 'Each unit' : 'In the pack'}</dt>
              <dd>{product.pack}</dd>
            </div>
            <div>
              <dt>Made of</dt>
              <dd>{product.made}</dd>
            </div>
            {product.specs.map(([term, detail]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
            {trade ? (
              <>
                <div>
                  <dt>Carton</dt>
                  <dd>
                    {product.carton} units, {cartonKg(product).toFixed(1)} kg gross
                  </dd>
                </div>
                <div>
                  <dt>In stock in Yiwu</dt>
                  <dd>{formatCount(product.stock)} units, leaves in 3 working days</dd>
                </div>
              </>
            ) : (
              <div>
                <dt>Weighs</dt>
                <dd>{product.grams} g</dd>
              </div>
            )}
          </dl>
        </div>

        <div>
          <h2 className="tw-title">{trade ? 'How it sells on Direct' : `Rated ${average.toFixed(1)} by ${product.reviews.length} buyers`}</h2>
          {trade ? (
            <p className="tw-lede">
              {formatCount(product.sold)} sold in the last 30 days at {formatPrice(product.retail)}, rated {average.toFixed(1)} out of 5. What buyers
              say, complaints included:
            </p>
          ) : null}
          <ul className="tw-reviews">
            {product.reviews.map((review) => (
              <li key={review.name}>
                <Stars value={review.stars} />
                <p>{review.text}</p>
                <p className="tw-note">
                  {review.name}, {review.place}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
