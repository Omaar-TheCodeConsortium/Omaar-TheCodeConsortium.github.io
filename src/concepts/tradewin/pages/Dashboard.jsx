import { Link } from 'react-router-dom';
import { Shot } from '../Media.jsx';
import { ACCOUNT, ORDER_STAGES, PRODUCTS, formatCount, formatPrice, margin, percent, productBySlug } from '../catalog.js';
import { useTradewin } from '../tradewinContext.js';
import { productPath } from '../site.js';

const RANKED = [...PRODUCTS].sort((a, b) => margin(b).each - margin(a).each);
const BEST = margin(RANKED[0]).each;

export default function Dashboard() {
  const { order, setCartons } = useTradewin();
  const { month } = ACCOUNT;

  return (
    <>
      <section className="tw-dash-head" aria-labelledby="tw-dash-title">
        <p className="tw-tag">
          Trade account · {ACCOUNT.company}, {ACCOUNT.place}
        </p>
        <h1 id="tw-dash-title" className="tw-display">
          You kept <em>{formatPrice(month.kept)}</em> this month.
        </h1>
        <dl className="tw-dash-figs">
          <div>
            <dt>Units delivered</dt>
            <dd>{formatCount(month.units)}</dd>
          </div>
          <div>
            <dt>Paid to Tradewin</dt>
            <dd>{formatPrice(month.spend)}</dd>
          </div>
          <div>
            <dt>Orders placed</dt>
            <dd>{month.orders}</dd>
          </div>
          <div>
            <dt>Kept of every dollar sold</dt>
            <dd>{percent(month.kept / (month.kept + month.spend))}</dd>
          </div>
        </dl>
        <p className="tw-note">Kept means your sales at Tradewin Direct's prices, less what you paid for the goods. Your own postage and fees are not counted.</p>
      </section>

      <section className="tw-dash-block" aria-labelledby="tw-orders-title">
        <h2 id="tw-orders-title" className="tw-title">
          Three orders, two still moving
        </h2>
        <ul className="tw-orders">
          {ACCOUNT.orders.map((entry) => (
            <li key={entry.ref}>
              <p className="tw-orders-ref">
                <strong>{entry.ref}</strong>
                <span>
                  {entry.cartons} cartons · {formatPrice(entry.value)} · placed {entry.placed}
                </span>
              </p>
              <ol className="tw-track" aria-label={`Progress: ${ORDER_STAGES[entry.stage - 1]}`}>
                {ORDER_STAGES.map((stage, index) => (
                  <li key={stage} data-done={index < entry.stage ? '' : undefined} aria-current={index === entry.stage - 1 ? 'step' : undefined}>
                    {stage}
                  </li>
                ))}
              </ol>
              <p className="tw-orders-due">
                <span>{entry.lane}</span>
                <strong>{entry.due}</strong>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="tw-dash-block" aria-labelledby="tw-low-title">
        <h2 id="tw-low-title" className="tw-title">
          Running low on your shelf
        </h2>
        <ul className="tw-low">
          {ACCOUNT.shelf.map(({ slug, days }) => {
            const product = productBySlug(slug);
            const on = order[slug] ?? 0;
            return (
              <li key={slug}>
                <Link to={productPath(slug, 'trade')} className="tw-low-art">
                  <Shot name={product.photo} alt={product.alt} />
                </Link>
                <p className="tw-low-days">
                  <strong>{days}</strong> days left
                </p>
                <h3>
                  <Link to={productPath(slug, 'trade')}>{product.name}</Link>
                </h3>
                <p className="tw-note">
                  {product.carton} to a carton at {formatPrice(product.trade[0])} each
                </p>
                <button type="button" className="tw-btn tw-btn--loud" onClick={() => setCartons(slug, on + 1)}>
                  Add a carton
                </button>
                <p className="tw-note" role="status">
                  {on > 0 ? `${on} ${on === 1 ? 'carton' : 'cartons'} on the order` : 'None on the order yet'}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="tw-dash-block" aria-labelledby="tw-keep-title">
        <h2 id="tw-keep-title" className="tw-title">
          What each line keeps
        </h2>
        <p className="tw-note">What is left from one unit sold at the retail price, when you buy a single carton. Dollars first, then the share of the sale.</p>
        <ol className="tw-keep">
          {RANKED.map((product) => {
            const kept = margin(product);
            return (
              <li key={product.slug}>
                <Link to={productPath(product.slug, 'trade')}>
                  <span className="tw-keep-name">{product.name}</span>
                  <span className="tw-keep-bar" aria-hidden="true">
                    <span style={{ width: `${(kept.each / BEST) * 100}%` }} />
                  </span>
                  <span className="tw-keep-fig">
                    <strong>{formatPrice(kept.each)}</strong> {percent(kept.share)} of {formatPrice(product.retail)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
