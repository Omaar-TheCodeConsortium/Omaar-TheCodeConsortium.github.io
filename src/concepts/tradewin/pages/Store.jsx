import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Card, { AddButton } from '../Card.jsx';
import FlipLink from '../FlipLink.jsx';
import { Rating, Shot } from '../Media.jsx';
import { hasPhoto } from '../photos.js';
import {
  ACCOUNT,
  CATEGORIES,
  DELIVERY_DAYS,
  FREE_POSTAGE_FROM,
  POSTAGE,
  PRODUCTS,
  TIER_FROM,
  daysOfStock,
  formatCount,
  formatPrice,
  margin,
  productBySlug,
} from '../catalog.js';
import { formatLeft, formatSpan, packingRun, useNow } from '../clock.js';
import { useTradewin } from '../tradewinContext.js';
import { baseOf, pathOf, productPath } from '../site.js';

// Ways to order the shelf. Each side sorts by what its buyer is deciding on.
const SORTS = {
  direct: [
    { id: 'best', label: 'Best sellers', by: (a, b) => b.sold - a.sold },
    { id: 'price', label: 'Lowest price', by: (a, b) => a.retail - b.retail },
    { id: 'rated', label: 'Top rated', by: (a, b) => b.rating - a.rating || b.ratings - a.ratings },
    { id: 'low', label: 'Nearly gone', by: (a, b) => daysOfStock(a) - daysOfStock(b) },
  ],
  trade: [
    { id: 'best', label: 'Sells fastest', by: (a, b) => b.sold - a.sold },
    { id: 'keep', label: 'Keeps most a unit', by: (a, b) => margin(b).each - margin(a).each },
    { id: 'price', label: 'Cheapest carton', by: (a, b) => a.trade[0] * a.carton - b.trade[0] * b.carton },
    { id: 'low', label: 'Nearly gone', by: (a, b) => daysOfStock(a) - daysOfStock(b) },
  ],
};

const TOP = [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 3);

// How a parcel travels, with the day each stage usually happens on.
const ROUTE = [
  { day: 'Day 0', what: 'Packed in Yiwu', note: 'Orders in by 4 pm China time are packed the same day.' },
  { day: 'Day 1', what: 'Leaves the warehouse', note: 'Your tracking number starts working here.' },
  { day: 'Day 2 to 4', what: 'Flies from Hangzhou', note: 'Air freight to Liège, East Midlands or Chicago.' },
  { day: 'Day 5 to 9', what: 'Clears customs', note: 'Duties are already paid. Nothing to settle at the door.' },
  { day: `Day ${DELIVERY_DAYS[0]} to ${DELIVERY_DAYS[1]}`, what: 'At your door', note: 'Handed to your usual postal service for the last mile.' },
];

const matches = (product, words) => {
  const text = `${product.name} ${product.pack} ${product.blurb} ${product.category}`.toLowerCase();
  return words
    .toLowerCase()
    .split(/\s+/)
    .every((word) => text.includes(word.replace(/s$/, '')));
};

// The top of the Direct home page: the three best sellers, ranked, with today's deadline.
function Podium() {
  const now = useNow();
  const run = now ? packingRun(now) : null;

  return (
    <section className="tw-podium" aria-labelledby="tw-home-title">
      <div className="tw-podium-say">
        <h1 id="tw-home-title" className="tw-display">
          Small useful things, posted straight from Yiwu.
        </h1>
        <p className="tw-lede">
          Twelve of them, from the workshops that make them. No importer, no distributor and no shop in between, which is why the prices look
          like this.
        </p>
        <p className="tw-clock" role="status">
          {run ? (
            <>
              <strong>{formatLeft(run)}</strong>
              <span>
                left in today&rsquo;s packing run. Order inside it and your parcel arrives <b>{formatSpan(run.from, run.to)}</b>.
              </span>
            </>
          ) : (
            <>
              <strong>4 pm</strong>
              <span>
                Yiwu time is when the day&rsquo;s parcels are packed. They arrive {DELIVERY_DAYS[0]} to {DELIVERY_DAYS[1]} days later.
              </span>
            </>
          )}
        </p>
      </div>

      <ol className="tw-podium-top" aria-label="The three that sold most in the last 30 days">
        {TOP.map((product, index) => (
          <li key={product.slug} style={{ '--tw-tint': product.tint }}>
            <Link to={productPath(product.slug)} className="tw-podium-art">
              <Shot name={product.photo} alt={product.alt} eager />
            </Link>
            <p className="tw-podium-rank">
              <b>{index + 1}</b>
              <span>{formatCount(product.sold)} sold in 30 days</span>
            </p>
            <h2 className="tw-podium-name">
              <Link to={productPath(product.slug)}>{product.name}</Link>
            </h2>
            <Rating product={product} />
            <p className="tw-podium-buy">
              <strong className="tw-price">{formatPrice(product.retail)}</strong>
              <AddButton product={product} />
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

// The top of the trade catalogue: who is signed in, and how the prices work.
function Counter() {
  const { month, orders } = ACCOUNT;
  const moving = orders.filter((entry) => entry.stage < 4).length;

  return (
    <section className="tw-counter" aria-labelledby="tw-home-title">
      <div className="tw-counter-say">
        <p className="tw-tag">
          Signed in as {ACCOUNT.company}, {ACCOUNT.place}
        </p>
        <h1 id="tw-home-title" className="tw-display">
          The same twelve, by the carton.
        </h1>
        <p className="tw-lede">
          Every line in the shop, at the price you pay for it. One carton is the minimum. The price a unit drops at {TIER_FROM[1]} cartons of a
          line and again at {TIER_FROM[2]}.
        </p>
      </div>
      <dl className="tw-counter-figs">
        <div>
          <dt>Kept this month</dt>
          <dd>{formatPrice(month.kept)}</dd>
        </div>
        <div>
          <dt>Units delivered</dt>
          <dd>{formatCount(month.units)}</dd>
        </div>
        <div>
          <dt>Orders still moving</dt>
          <dd>{moving}</dd>
        </div>
        <div>
          <dt>
            <Link to={pathOf('trade', 'orders')}>Open your account</Link>
          </dt>
          <dd aria-hidden="true">→</dd>
        </div>
      </dl>
    </section>
  );
}

// One shelf of products. Serves the home page, the four categories and search, on both sides.
export default function Store({ category = null }) {
  const { side } = useTradewin();
  const trade = side === 'trade';
  const [params] = useSearchParams();
  const words = (params.get('q') ?? '').trim();
  const sorts = SORTS[side];
  const [sortId, setSortId] = useState('best');
  const sort = sorts.find((entry) => entry.id === sortId) ?? sorts[0];
  const group = CATEGORIES.find((entry) => entry.id === category) ?? null;

  const shelf = PRODUCTS.filter((product) => (group ? product.category === group.id : true))
    .filter((product) => (words ? matches(product, words) : true))
    .sort(sort.by);

  const home = !group && !words;
  const seen = home && !trade ? PRODUCTS.filter((product) => hasPhoto(product.use)) : [];
  const lids = productBySlug('stretch-lids');

  let shelfTitle = trade ? 'Every line, at one carton' : 'All twelve';
  if (group) shelfTitle = `${shelf.length} ${shelf.length === 1 ? 'line' : 'lines'} on this shelf`;
  if (words) shelfTitle = `${shelf.length} of ${PRODUCTS.length} match`;

  return (
    <>
      {home ? (
        trade ? (
          <Counter />
        ) : (
          <Podium />
        )
      ) : (
        <section className="tw-shelf-head" aria-labelledby="tw-shelf-h1" style={{ '--tw-tint': shelf[0]?.tint }}>
          <p className="tw-tag">
            <Link to={baseOf(side)}>{trade ? 'Trade catalogue' : 'Shop'}</Link> · {words ? 'Search' : 'Shelf'}
          </p>
          <h1 id="tw-shelf-h1" className="tw-display">
            {words ? <>Looking for &ldquo;{words}&rdquo;</> : group.name}
          </h1>
          {group && !words ? <p className="tw-lede">{group.line}</p> : null}
        </section>
      )}

      {home && !trade ? (
        <section className="tw-facts" aria-label="Delivery and postage">
          <ul>
            <li>
              <strong>
                {DELIVERY_DAYS[0]} to {DELIVERY_DAYS[1]} days
              </strong>
              <span>door to door, tracked at every stop</span>
            </li>
            <li>
              <strong>{formatPrice(POSTAGE)} postage</strong>
              <span>and nothing at all over ${FREE_POSTAGE_FROM}</span>
            </li>
            <li>
              <strong>Duties paid</strong>
              <span>by us, before the parcel leaves China</span>
            </li>
            <li>
              <strong>30 days</strong>
              <span>to send anything back, on our label</span>
            </li>
          </ul>
        </section>
      ) : null}

      <section className="tw-shelf" aria-labelledby="tw-shelf-title">
        <div className="tw-shelf-bar">
          <h2 id="tw-shelf-title" className="tw-title">
            {shelfTitle}
          </h2>
          <div className="tw-sort" role="group" aria-label="Sort by">
            {sorts.map((entry) => (
              <button key={entry.id} type="button" aria-pressed={entry.id === sort.id} onClick={() => setSortId(entry.id)}>
                {entry.label}
              </button>
            ))}
          </div>
        </div>

        {shelf.length > 0 ? (
          <div className="tw-grid" data-few={shelf.length <= 4 ? '' : undefined}>
            {shelf.map((product, index) => (
              <Card key={product.slug} product={product} eager={index < 4 && !home} />
            ))}
          </div>
        ) : (
          <p className="tw-empty">
            Nothing on the shelf matches &ldquo;{words}&rdquo;. There are only twelve things here: <Link to={baseOf(side)}>see all of them</Link>.
          </p>
        )}
      </section>

      {seen.length > 0 ? (
        <section className="tw-seen" aria-labelledby="tw-seen-title">
          <h2 id="tw-seen-title" className="tw-title">
            Where they end up
          </h2>
          <ul>
            {seen.map((product) => (
              <li key={product.slug}>
                <Link to={productPath(product.slug)}>
                  <Shot name={product.use} alt={product.useAlt} />
                  <span>
                    <strong>{product.name}</strong>
                    <b className="tw-price">{formatPrice(product.retail)}</b>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {home && !trade ? (
        <section className="tw-route" aria-labelledby="tw-route-title">
          <h2 id="tw-route-title" className="tw-title">
            8,900 km, five stops
          </h2>
          <ol className="tw-route-line">
            {ROUTE.map((stop) => (
              <li key={stop.what}>
                <span className="tw-tag">{stop.day}</span>
                <strong>{stop.what}</strong>
                <span>{stop.note}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="tw-invite" aria-labelledby="tw-invite-title">
        <h2 id="tw-invite-title" className="tw-title">
          {trade ? 'Want to see what your customers see?' : 'Selling these yourself?'}
        </h2>
        <p>
          {trade ? (
            <>
              Tradewin Direct sells every one of these lines singly. The stretch lids you buy at <strong>{formatPrice(lids.trade[0])}</strong> are{' '}
              <strong>{formatPrice(lids.retail)}</strong> there.
            </>
          ) : (
            <>
              The stretch lids are <strong>{formatPrice(lids.retail)}</strong> here and <strong>{formatPrice(lids.trade[0])}</strong> by the carton
              of {lids.carton}. Every page of this shop has a trade side: same product, carton prices.
            </>
          )}
        </p>
        <FlipLink className="tw-btn tw-btn--line">{trade ? 'Show this page at shop prices' : 'Show this page at carton prices'}</FlipLink>
      </section>
    </>
  );
}
