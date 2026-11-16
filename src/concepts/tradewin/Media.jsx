// Photographs are picked up by file name from ./photos: one square picture per product, named by
// its slug, on a white ground that the page multiplies away. See docs/tradewin-shot-list.md.
const files = import.meta.glob('./photos/*.{jpg,webp}', { eager: true, query: '?url', import: 'default' });
const URLS = Object.fromEntries(Object.entries(files).map(([path, url]) => [path.replace('./photos/', '').replace(/\.[a-z]+$/, ''), url]));

const SIZE = 1000;

// A product photograph. Until one has been supplied, a labelled block holds its place.
export function Shot({ name, alt, eager = false, className = '' }) {
  if (!URLS[name]) {
    return (
      <span className={`tw-photo tw-photo--todo ${className}`} role="img" aria-label={alt}>
        <span aria-hidden="true">{name}.jpg</span>
      </span>
    );
  }
  return (
    <img
      className={`tw-photo ${className}`}
      src={URLS[name]}
      alt={alt}
      width={SIZE}
      height={SIZE}
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
  const url = URLS[product.photo];
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
        '--cols': cols,
        '--rows': rows,
      }}
    />
  );
}

// The mark is two sheets, one behind the other: the shop and the trade counter.
export function Wordmark() {
  return (
    <span className="tw-wordmark">
      <svg viewBox="0 0 30 30" aria-hidden="true" focusable="false">
        <rect x="9" y="1" width="20" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2.6" />
        <rect x="1" y="9" width="20" height="20" rx="4" fill="#ff4f5e" />
      </svg>
      Tradewin
    </span>
  );
}

// A price on a round sticker, as on a market stall.
export function Sticker({ children, className = '' }) {
  return <span className={`tw-sticker ${className}`}>{children}</span>;
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
