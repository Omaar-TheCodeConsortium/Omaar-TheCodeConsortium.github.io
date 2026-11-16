import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../Card.jsx';
import FlipLink from '../FlipLink.jsx';
import { Carton, Meter, Rating, Shot, Stepper } from '../Media.jsx';
import { hasPhoto } from '../photos.js';
import {
  DELIVERY_DAYS,
  FREE_POSTAGE_FROM,
  LOW_DAYS,
  MAX_CARTONS,
  MAX_QTY,
  POSTAGE,
  TIER_FROM,
  cartonKg,
  categoryOf,
  daysOfStock,
  formatCount,
  formatPrice,
  isLow,
  linePrice,
  lineSaving,
  percent,
  productsIn,
  tierIndex,
  tierLabel,
  tradeLine,
  unitPrice,
} from '../catalog.js';
import { formatLeft, formatSpan, packingRun, useNow } from '../clock.js';
import { useTradewin } from '../tradewinContext.js';
import { baseOf, categoryPath, pathOf } from '../site.js';

const OFFERS = [
  { qty: 1, label: 'One' },
  { qty: 2, label: 'Two' },
  { qty: 3, label: 'Three' },
];

function Stars({ value }) {
  return (
    <span className="tw-stars" role="img" aria-label={`${value} out of 5`} style={{ '--tw-rate': value / 5 }}>
      ★★★★★
    </span>
  );
}

// Buying one, or a few. Two or three of the same thing cost less each.
function BuyDirect({ product }) {
  const { add, lines } = useTradewin();
  const now = useNow();
  const run = now ? packingRun(now) : null;
  const [qty, setQty] = useState(1);
  const held = lines.find((line) => line.slug === product.slug)?.qty ?? 0;
  const low = isLow(product);

  return (
    <>
      <div className="tw-offers" role="group" aria-label="How many">
        {OFFERS.map((offer) => {
          const saving = lineSaving(product, offer.qty);
          const picked = offer.qty === 3 ? qty >= 3 : qty === offer.qty;
          return (
            <button key={offer.qty} type="button" aria-pressed={picked} onClick={() => setQty(offer.qty)}>
              <span>{offer.label}</span>
              <strong>{formatPrice(linePrice(product, offer.qty))}</strong>
              <em>{saving > 0 ? `${formatPrice(unitPrice(product, offer.qty))} each, save ${formatPrice(saving)}` : product.pack}</em>
            </button>
          );
        })}
      </div>

      <div className="tw-item-act">
        <Stepper value={qty} max={MAX_QTY} onChange={setQty} label="Quantity" unit="item" />
        <button type="button" className="tw-btn tw-btn--loud tw-btn--big" onClick={() => add(product.slug, qty)}>
          Add {qty > 1 ? `${qty} ` : ''}to basket: {formatPrice(linePrice(product, qty))}
        </button>
      </div>
      <p className="tw-note" role="status">
        {held > 0 ? (
          <>
            {held} in your basket. <Link to={pathOf('direct', 'basket')}>Open the basket</Link>
          </>
        ) : (
          'Nothing is charged: this shop is a demonstration.'
        )}
      </p>

      <ul className="tw-sure">
        <li data-kind="clock">
          {run ? (
            <>
              <strong>Order in the next {formatLeft(run)}</strong> and it is packed today. Arrives {formatSpan(run.from, run.to)}.
            </>
          ) : (
            <>
              <strong>In by 4 pm Yiwu time, packed the same day.</strong> Arrives {DELIVERY_DAYS[0]} to {DELIVERY_DAYS[1]} days later.
            </>
          )}
        </li>
        <li data-kind={low ? 'low' : 'stock'}>
          {low ? (
            <>
              <strong>{formatCount(product.stock)} left in Yiwu.</strong> About {daysOfStock(product)} days of stock at the rate these are selling.
              <Meter share={daysOfStock(product) / LOW_DAYS} label={`About ${daysOfStock(product)} days of stock left`} />
            </>
          ) : (
            <>
              <strong>{formatCount(product.stock)} in stock in Yiwu.</strong> {formatCount(product.sold)} sold in the last 30 days.
            </>
          )}
        </li>
        <li data-kind="post">
          <strong>
            Postage {formatPrice(POSTAGE)}, free over ${FREE_POSTAGE_FROM}.
          </strong>{' '}
          Duties are paid before it leaves, so there is nothing to settle at the door.
        </li>
        <li data-kind="back">
          <strong>30 days to send it back,</strong> on a label we pay for.
        </li>
      </ul>

      <p className="tw-item-flip">
        Buying {product.carton} or more? <FlipLink>They are {formatPrice(product.trade[0])} each by the carton</FlipLink>
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
  const next = TIER_FROM[tier + 1];

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
        <button type="button" className="tw-btn tw-btn--loud tw-btn--big" onClick={() => setCartons(product.slug, count)}>
          Put {count} {count === 1 ? 'carton' : 'cartons'} on the order
        </button>
      </div>
      <p className="tw-note" role="status">
        {on > 0 ? (
          <>
            {on} {on === 1 ? 'carton' : 'cartons'} of these on your order. <Link to={pathOf('trade', 'basket')}>Open the order sheet</Link>
          </>
        ) : (
          'None of these on your order yet.'
        )}
        {next ? ` ${next - count} more ${next - count === 1 ? 'carton' : 'cartons'} brings the price to ${formatPrice(product.trade[tier + 1])} a unit.` : ''}
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

// One product page for both sides. The route gives it a key by product only, so flipping between
// Direct and Wholesale keeps the page in place and changes what it shows.
export default function Product({ product }) {
  const { side } = useTradewin();
  const trade = side === 'trade';
  const category = categoryOf(product);
  const inUse = hasPhoto(product.use);
  const [view, setView] = useState('photo');
  const showing = inUse && view === 'use' ? 'use' : 'photo';
  const others = productsIn(product.category).filter((entry) => entry.slug !== product.slug);

  return (
    <>
      <article className="tw-item">
        <div className="tw-stage" style={{ '--tw-tint': product.tint }}>
          <div className="tw-stage-art" data-view={trade ? 'carton' : showing}>
            {trade ? (
              <Carton product={product} className="tw-morph" />
            ) : showing === 'use' ? (
              <Shot name={product.use} alt={product.useAlt} eager className="tw-stage-use" />
            ) : (
              <Shot name={product.photo} alt={product.alt} eager className="tw-morph" />
            )}
          </div>
          {!trade && inUse ? (
            <div className="tw-thumbs" role="group" aria-label="Photographs">
              <button type="button" aria-pressed={showing === 'photo'} onClick={() => setView('photo')} aria-label="The product on its own">
                <Shot name={product.photo} alt="" />
              </button>
              <button type="button" aria-pressed={showing === 'use'} onClick={() => setView('use')} aria-label="The product in use">
                <Shot name={product.use} alt="" />
              </button>
            </div>
          ) : null}
          {trade ? (
            <p className="tw-stage-note">
              One carton: {product.carton} units, {cartonKg(product).toFixed(1)} kg
            </p>
          ) : null}
        </div>

        <div className="tw-buy">
          <p className="tw-tag">
            <Link to={baseOf(side)}>{trade ? 'Trade catalogue' : 'Shop'}</Link> · <Link to={categoryPath(category.id, side)}>{category.name}</Link> ·{' '}
            {product.sku}
          </p>
          <h1 className="tw-display tw-item-name">{product.name}</h1>
          <p className="tw-item-proof">
            <Rating product={product} full />
            <span>
              {formatCount(product.sold)} sold {trade ? 'on Direct ' : ''}in the last 30 days
            </span>
          </p>
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
                  <dd>
                    {formatCount(product.stock)} units, {formatCount(Math.floor(product.stock / product.carton))} cartons
                  </dd>
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
          <h2 className="tw-title">
            {trade ? 'How it sells on Direct' : `Rated ${product.rating.toFixed(1)} by ${formatCount(product.ratings)} buyers`}
          </h2>
          <p className="tw-note">
            {trade
              ? `${formatCount(product.sold)} sold in the last 30 days at ${formatPrice(product.retail)}, rated ${product.rating.toFixed(1)} out of 5 by ${formatCount(
                  product.ratings,
                )} buyers. Two recent reviews, complaints included:`
              : 'Two recent reviews, complaints included:'}
          </p>
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

      {others.length > 0 ? (
        <section className="tw-shelf" aria-labelledby="tw-with-title">
          <div className="tw-shelf-bar">
            <h2 id="tw-with-title" className="tw-title">
              Also on the {category.name.toLowerCase()} shelf
            </h2>
          </div>
          <div className="tw-grid" data-few="">
            {others.map((entry) => (
              <Card key={entry.slug} product={entry} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
