import { Link } from 'react-router-dom';
import { Shot, Sticker } from '../Media.jsx';
import { DELIVERY_DAYS, FREE_POSTAGE_FROM, POSTAGE, PRODUCTS, formatPrice, productBySlug } from '../catalog.js';
import { useTradewin } from '../tradewinContext.js';
import { TRADE, productPath } from '../site.js';

// How a parcel travels, with the day each stage usually happens on.
const ROUTE = [
  { day: 'Day 0', what: 'Packed in Yiwu', note: 'Orders placed before 4 pm China time are packed the same day.' },
  { day: 'Day 1', what: 'Leaves the warehouse', note: 'Your tracking number starts working here.' },
  { day: 'Day 2 to 4', what: 'Flies from Hangzhou', note: 'Air freight to Liège, East Midlands or Chicago.' },
  { day: 'Day 5 to 9', what: 'Clears customs', note: 'Duties are already paid. Nothing to settle at the door.' },
  { day: `Day ${DELIVERY_DAYS[0]} to ${DELIVERY_DAYS[1]}`, what: 'At your door', note: 'Handed to your usual postal service for the last mile.' },
];

const LIDS = productBySlug('stretch-lids');

export default function Home() {
  const { flip } = useTradewin();

  const onFlip = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    flip();
  };

  return (
    <>
      <section className="tw-table" aria-labelledby="tw-home-title">
        <div className="tw-table-head">
          <h1 id="tw-home-title" className="tw-display">
            Small things, sent straight.
          </h1>
          <p className="tw-lede">
            Twelve useful things from the workshops round Yiwu, posted to your door in {DELIVERY_DAYS[0]} to {DELIVERY_DAYS[1]} days. No
            importer, no distributor, no shop in between.
          </p>
        </div>
        {PRODUCTS.map((product, index) => (
          <Link key={product.slug} to={productPath(product.slug)} className="tw-thing">
            <Shot name={product.photo} alt={product.alt} eager={index < 6} />
            <Sticker>{formatPrice(product.retail)}</Sticker>
            <span className="tw-thing-name">
              <strong>{product.name}</strong>
              <span>{product.pack}</span>
            </span>
          </Link>
        ))}
      </section>

      <section className="tw-say" aria-label="Delivery and postage">
        <p>
          Packed within <mark>24 hours</mark>. At your door in{' '}
          <mark>
            {DELIVERY_DAYS[0]} to {DELIVERY_DAYS[1]} days
          </mark>
          , tracked all the way. Postage is <mark>{formatPrice(POSTAGE)}</mark>, or nothing at all over{' '}
          <mark>${FREE_POSTAGE_FROM}</mark>.
        </p>
      </section>

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

      <section className="tw-invite" aria-labelledby="tw-invite-title">
        <h2 id="tw-invite-title" className="tw-title">
          Selling these yourself?
        </h2>
        <p>
          The stretch lids are <strong>{formatPrice(LIDS.retail)}</strong> here and <strong>{formatPrice(LIDS.trade[0])}</strong> by the carton
          of {LIDS.carton}. Every page of this shop has a trade side: same product, carton prices.
        </p>
        <a href={TRADE} className="tw-btn tw-btn--loud" onClick={onFlip}>
          Flip this page to Wholesale
        </a>
      </section>
    </>
  );
}
