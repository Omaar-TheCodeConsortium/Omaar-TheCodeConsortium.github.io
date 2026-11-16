import { PHOTOS } from './photos.js';
import { formatCount } from './catalog.js';

// Studio pictures are square; pictures of a product in use are 4 by 3.
const sizeOf = (name) => (name.endsWith('-use') ? [1600, 1200] : [1200, 1200]);

// A photograph. Until one has been supplied, a labelled block holds its place.
export function Shot({ name, alt, eager = false, className = '' }) {
  if (!PHOTOS[name]) {
    return (
      <span className={`tw-photo tw-photo--todo ${className}`} role="img" aria-label={alt}>
        <span aria-hidden="true">{name}.jpg</span>
      </span>
    );
  }
  return (
    <img
      className={`tw-photo ${className}`}
      src={PHOTOS[name]}
      alt={alt}
      width={sizeOf(name)[0]}
      height={sizeOf(name)[1]}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
    />
  );
}

// The widest grid of whole rows that holds exactly `count` units: 48 is 8 by 6, 100 is 10 by 10.
function gridFor(count) {
  let cols = count;
  for (let rows = 1; rows * rows <= count; rows += 1) if (count % rows === 0) cols = count / rows;
  return [cols, count / cols];
}

// One carton, laid out flat: the product's photograph repeated once for every unit in it.
export function Carton({ product, className = '' }) {
  const [cols, rows] = gridFor(product.carton);
  const url = PHOTOS[product.photo];
  return (
    <span
      className={`tw-carton ${className}`}
      role="img"
      aria-label={`One carton: ${product.carton} of ${product.name.toLowerCase()}, laid out ${cols} by ${rows}`}
      data-todo={url ? undefined : ''}
      style={{
        aspectRatio: `${cols} / ${rows}`,
        backgroundImage: url ? `url(${url})` : undefined,
        backgroundSize: `${100 / cols}% ${100 / rows}%`,
      }}
    />
  );
}

// The mark is one square behind another: the single item and the carton.
export function Wordmark({ side }) {
  return (
    <span className="tw-wordmark">
      <svg viewBox="0 0 30 30" aria-hidden="true" focusable="false">
        <rect x="9" y="1" width="20" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2.6" />
        <rect x="1" y="9" width="20" height="20" rx="4" fill="#ff4f5e" />
      </svg>
      <span>
        Tradewin <em>{side === 'trade' ? 'Wholesale' : 'Direct'}</em>
      </span>
    </span>
  );
}

// Five stars filled to the average, then the average and how many buyers it comes from.
export function Rating({ product, full = false }) {
  return (
    <span className="tw-rating">
      <span className="tw-stars" role="img" aria-label={`Rated ${product.rating} out of 5`} style={{ '--tw-rate': product.rating / 5 }}>
        ★★★★★
      </span>
      <strong>{product.rating.toFixed(1)}</strong>
      <span>{full ? `${formatCount(product.ratings)} ratings` : `(${formatCount(product.ratings)})`}</span>
    </span>
  );
}

// How much of something is left, or how far along something is, as a bar.
export function Meter({ share, label, className = '' }) {
  return (
    <span className={`tw-meter ${className}`} role="img" aria-label={label}>
      <span style={{ width: `${Math.max(0, Math.min(1, share)) * 100}%` }} />
    </span>
  );
}

const BARS = '31121322113123112213311221132112312213112231121332112213';

// The barcode on the shipping label. Decorative: it encodes nothing.
export function Barcode() {
  let x = 0;
  const bars = [];
  [...BARS].forEach((width, index) => {
    if (index % 2 === 0) bars.push(<rect key={index} x={x} y="0" width={Number(width)} height="40" />);
    x += Number(width);
  });
  return (
    <svg className="tw-barcode" viewBox={`0 0 ${x} 40`} preserveAspectRatio="none" aria-hidden="true" focusable="false" fill="currentColor">
      {bars}
    </svg>
  );
}

export function Stepper({ value, min = 1, max, onChange, label, unit }) {
  return (
    <span className="tw-stepper" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`One ${unit} fewer`}>
        −
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`One ${unit} more`}>
        +
      </button>
    </span>
  );
}
