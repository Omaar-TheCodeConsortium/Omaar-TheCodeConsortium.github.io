import { Link } from 'react-router-dom';
import { Barcode, Shot } from '../Media.jsx';
import { formatPrice, linePrice, productBySlug } from '../catalog.js';
import { formatDay, useNow } from '../clock.js';
import { COMPANY, pathOf, productPath } from '../site.js';

const DAY = 86400000;

// A sample parcel, four days into its journey. `day` counts from the day it was packed.
const PARCEL = {
  ref: 'TW-D-88107',
  code: 'TW 4471 9026 0318 CN',
  lines: [
    { slug: 'stretch-lids', qty: 2 },
    { slug: 'night-light', qty: 1 },
  ],
  packedDaysAgo: 4,
  at: 2,
  stops: [
    { what: 'Packed in Yiwu', where: 'Warehouse 7, Chouzhou North Road', day: 0 },
    { what: 'Left the warehouse', where: 'Yiwu sorting centre', day: 1 },
    { what: 'In the air', where: 'Hangzhou Xiaoshan to East Midlands', day: 3 },
    { what: 'Customs', where: 'East Midlands Airport, duties already paid', day: 6 },
    { what: 'At your door', where: 'Handed to Royal Mail for the last mile', day: 9 },
  ],
};

export default function Track() {
  const now = useNow();
  const packed = now ? now - PARCEL.packedDaysAgo * DAY : null;
  const when = (day) => (packed ? formatDay(new Date(packed + day * DAY)) : `Day ${day}`);
  const current = PARCEL.stops[PARCEL.at];
  const last = PARCEL.stops[PARCEL.stops.length - 1];
  const total = PARCEL.lines.reduce((sum, line) => sum + linePrice(productBySlug(line.slug), line.qty), 0);

  return (
    <>
      <section className="tw-track-head" aria-labelledby="tw-track-title">
        <p className="tw-tag">
          Sample parcel {PARCEL.ref} · stop {PARCEL.at + 1} of {PARCEL.stops.length}
        </p>
        <h1 id="tw-track-title" className="tw-display">
          {current.what}, due {packed ? formatDay(new Date(packed + last.day * DAY)) : 'on day 9'}.
        </h1>
        <p className="tw-lede">
          Every Tradewin Direct parcel makes the same five stops, and the tracking number works from the second. This is what one looks like
          four days after it was packed.
        </p>
      </section>

      <section className="tw-track-body" aria-labelledby="tw-stops-title">
        <div>
          <h2 id="tw-stops-title" className="tw-title">
            Five stops
          </h2>
          <ol className="tw-stops">
            {PARCEL.stops.map((stop, index) => (
              <li key={stop.what} data-done={index < PARCEL.at ? '' : undefined} aria-current={index === PARCEL.at ? 'step' : undefined}>
                <span className="tw-stops-day">{when(stop.day)}</span>
                <strong>{stop.what}</strong>
                <span>{stop.where}</span>
                {index > PARCEL.at ? <span className="tw-note">Expected</span> : null}
              </li>
            ))}
          </ol>
        </div>

        <div className="tw-parcel">
          <h2 className="tw-title">What is in it</h2>
          <ul className="tw-parcel-lines">
            {PARCEL.lines.map((line) => {
              const product = productBySlug(line.slug);
              return (
                <li key={line.slug} style={{ '--tw-tint': product.tint }}>
                  <span className="tw-line-art">
                    <Shot name={product.photo} alt={product.alt} />
                  </span>
                  <span>
                    <Link to={productPath(product.slug)}>{product.name}</Link>
                    <span className="tw-note">
                      {line.qty} × {product.pack.toLowerCase()}
                    </span>
                  </span>
                  <strong>{formatPrice(linePrice(product, line.qty))}</strong>
                </li>
              );
            })}
          </ul>
          <p className="tw-parcel-sum">
            <span>Goods {formatPrice(total)} · postage free · duties paid</span>
          </p>
          <div className="tw-parcel-label">
            <p className="tw-tag">From</p>
            <p>{COMPANY.legalName}</p>
            <Barcode />
            <p className="tw-parcel-code">{PARCEL.code}</p>
          </div>
          <p className="tw-note">
            Something late or missing? <Link to={pathOf('direct', 'terms')}>Delivery and returns</Link> says what we do about it.
          </p>
        </div>
      </section>
    </>
  );
}
