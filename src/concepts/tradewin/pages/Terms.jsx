import FlipLink from '../FlipLink.jsx';
import { DELIVERY_DAYS, FREE_POSTAGE_FROM, FREIGHT, MULTI, POSTAGE, TIER_FROM, formatPrice, percent } from '../catalog.js';
import { useTradewin } from '../tradewinContext.js';
import { COMPANY } from '../site.js';

const [AIR, SEA] = FREIGHT;

// The same questions answered twice: once for someone buying one, once for someone buying cartons.
const TERMS = {
  direct: {
    title: 'Delivery, duties and returns',
    lede: 'Seven things people ask before they buy from a shop 8,900 km away, answered with the numbers.',
    rows: [
      ['Postage', `${formatPrice(POSTAGE)} on any order`, `Free once the goods come to $${FREE_POSTAGE_FROM}. The basket shows how far off you are.`],
      ['How long', `${DELIVERY_DAYS[0]} to ${DELIVERY_DAYS[1]} days`, 'Door to door. Orders in by 4 pm Yiwu time are packed the same day and fly from Hangzhou within three.'],
      ['Tracking', 'Five stops, all scanned', 'Your number starts working when the parcel leaves the warehouse, usually the day after you order.'],
      ['Duties and tax', 'Paid by us', 'We settle import duty and sales tax before the parcel leaves China. The courier asks you for nothing.'],
      ['More than one', `${percent(MULTI[0].off)} off two, ${percent(MULTI[1].off)} off three`, 'Of the same product, taken off each one. It costs us less to pack them together.'],
      ['Returns', '30 days, our label', 'Send anything back unused within 30 days of delivery. We email a prepaid label and refund when it is scanned.'],
      ['Late or missing', 'Refund on day 21', 'If tracking has not moved for seven days, or the parcel has not arrived 21 days after packing, we refund or resend. Your choice.'],
    ],
  },
  trade: {
    title: 'Supplier terms',
    lede: 'How Tradewin Wholesale trades, in nine lines. No account manager is needed to read them.',
    rows: [
      ['Minimum', 'One carton of one line', 'Cartons are sealed at the workshop and are not split. Mix as many lines as you like on an order.'],
      ['Prices', `Step down at ${TIER_FROM[1]} and ${TIER_FROM[2]} cartons`, 'Counted per line, per order. The catalogue and the order sheet both show the price you have reached.'],
      ['Payment', 'On dispatch', 'Card or bank transfer, taken when the order leaves Yiwu, three working days after you send it.'],
      ['Air freight', `${formatPrice(AIR.perKg)} a kilo, ${AIR.days[0]} to ${AIR.days[1]} days`, 'Door to door, duties paid, to any of the 41 countries we ship to.'],
      ['Sea freight', `${formatPrice(SEA.perKg)} a kilo, ${SEA.days[0]} to ${SEA.days[1]} days`, 'Consolidated weekly from Ningbo. Delivered duty paid to your door, not to the port.'],
      ['Samples', 'One of each, at the Direct price', 'Order singles from Tradewin Direct. We credit them against your first carton of that line.'],
      ['Your label', 'From 25 cartons of a line', 'Your logo on the pack insert and the carton, at no charge, with ten working days added.'],
      ['Claims', '60 days from delivery', 'Photograph the fault and the carton label. Faulty units are credited at what you paid, without being sent back.'],
      ['Who you are buying from', COMPANY.legalName, `${COMPANY.address.join(', ')}. Trading since ${COMPANY.founded}.`],
    ],
  },
};

export default function Terms() {
  const { side } = useTradewin();
  const { title, lede, rows } = TERMS[side];

  return (
    <section className="tw-terms" aria-labelledby="tw-terms-title">
      <div className="tw-terms-head">
        <h1 id="tw-terms-title" className="tw-display">
          {title}
        </h1>
        <p className="tw-lede">{lede}</p>
      </div>
      <ol className="tw-terms-rows">
        {rows.map(([term, short, long]) => (
          <li key={term}>
            <h2>{term}</h2>
            <p className="tw-terms-short">{short}</p>
            <p>{long}</p>
          </li>
        ))}
      </ol>
      <p className="tw-aside-flip">
        {side === 'trade' ? 'Buying one for yourself? ' : 'Buying by the carton? '}
        <FlipLink>{side === 'trade' ? 'Read the delivery and returns terms' : 'Read the supplier terms'}</FlipLink>
      </p>
    </section>
  );
}
