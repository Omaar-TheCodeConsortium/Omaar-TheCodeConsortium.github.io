import { Link } from 'react-router-dom';
import { Meter, Rating, Shot } from './Media.jsx';
import { hasPhoto } from './photos.js';
import {
  MULTI,
  TIER_FROM,
  daysOfStock,
  formatCount,
  formatPrice,
  isBestSeller,
  isLow,
  linePrice,
  margin,
  percent,
  LOW_DAYS,
} from './catalog.js';
import { useTradewin } from './tradewinContext.js';
import { productPath } from './site.js';

// The one button that spends money. On Direct it adds one item to the basket; on the trade side
// it adds one carton to the order. Either way it then says how many are there.
export function AddButton({ product, className = '' }) {
  const { side, add, lines, order, setCartons } = useTradewin();
  const trade = side === 'trade';
  const held = trade ? (order[product.slug] ?? 0) : (lines.find((line) => line.slug === product.slug)?.qty ?? 0);
  const onClick = () => (trade ? setCartons(product.slug, held + 1) : add(product.slug, 1));
  const what = trade ? 'carton' : 'basket';

  return (
    <button type="button" className={`tw-btn tw-btn--loud ${className}`} onClick={onClick} data-held={held > 0 ? '' : undefined}>
      {held > 0 ? (
        <>
          <span className="tw-btn-held">{held}</span>
          <span className="tw-hide">{trade ? 'on the order.' : 'in the basket.'}</span> {trade ? 'Add a carton' : 'Add another'}
        </>
      ) : trade ? (
        `Add a ${what}`
      ) : (
        `Add to ${what}`
      )}
      <span className="tw-hide">: {product.name}</span>
    </button>
  );
}

// Why this one, in two or three words. Only shown when the figures behind it say so.
function flagOf(product) {
  if (isLow(product)) return { text: `${formatCount(product.stock)} left`, kind: 'low' };
  if (isBestSeller(product)) return { text: 'Best seller', kind: 'best' };
  return null;
}

// A product as it appears in a grid. The same card serves both sides: Direct shows the price of
// one and what a second takes off; the trade side shows the carton, the tiers and what a unit keeps.
export default function Card({ product, eager = false, heading: Heading = 'h3' }) {
  const { side } = useTradewin();
  const trade = side === 'trade';
  const flag = flagOf(product);
  const kept = margin(product);
  const inUse = hasPhoto(product.use);

  return (
    <article className="tw-card" style={{ '--tw-tint': product.tint }}>
      <Link to={productPath(product.slug, side)} className="tw-card-link">
        <span className="tw-card-art" data-swap={inUse ? '' : undefined}>
          <Shot name={product.photo} alt={product.alt} eager={eager} />
          {inUse ? <Shot name={product.use} alt="" className="tw-card-use" /> : null}
          {flag ? (
            <span className="tw-flag" data-kind={flag.kind}>
              {flag.text}
            </span>
          ) : null}
        </span>
        <Heading className="tw-card-name">{product.name}</Heading>
      </Link>

      {trade ? (
        <>
          <p className="tw-card-pack">
            {product.pack} · {product.carton} to a carton
          </p>
          <p className="tw-card-price">
            <strong className="tw-price">{formatPrice(product.trade[0])}</strong>
            <span>a unit · {formatPrice(product.trade[0] * product.carton)} a carton</span>
          </p>
          <ol className="tw-card-tiers" aria-label="Price a unit by cartons ordered">
            {TIER_FROM.map((from, index) => (
              <li key={from}>
                <span>{from}+</span> {formatPrice(product.trade[index])}
              </li>
            ))}
          </ol>
          <p className="tw-card-keep">
            Keeps <strong>{formatPrice(kept.each)}</strong> of {formatPrice(product.retail)} ({percent(kept.share)})
          </p>
        </>
      ) : (
        <>
          <p className="tw-card-pack">{product.pack}</p>
          <p className="tw-card-proof">
            <Rating product={product} />
            <span>{formatCount(product.sold)} sold this month</span>
          </p>
          <p className="tw-card-price">
            <strong className="tw-price">{formatPrice(product.retail)}</strong>
            <span>
              {MULTI[0].qty} for {formatPrice(linePrice(product, MULTI[0].qty))}
            </span>
          </p>
        </>
      )}

      {isLow(product) ? (
        <p className="tw-card-low">
          <Meter share={daysOfStock(product) / LOW_DAYS} label={`About ${daysOfStock(product)} days of stock left`} />
          About {daysOfStock(product)} days of stock at this rate
        </p>
      ) : null}

      <AddButton product={product} className="tw-card-add" />
    </article>
  );
}
