import { Link } from 'react-router-dom';
import { formatKg, formatPrice, fromPrice } from './catalog.js';
import { productPath } from './site.js';

// Photographs are picked up by file name from ./photos. See docs/topforce-shot-list.md.
const files = import.meta.glob('./photos/*.{jpg,webp}', { eager: true, query: '?url', import: 'default' });
const URLS = Object.fromEntries(Object.entries(files).map(([path, url]) => [path.replace('./photos/', '').replace(/\.[a-z]+$/, ''), url]));

const SIZES = { wide: [2400, 1340], standard: [2400, 1792], square: [1600, 1600], tall: [1200, 1600] };

// Shot number and shape of every photograph, as in the shot list.
const SHOTS = {
  bar: [1, 'standard'],
  bumpers: [2, 'standard'],
  'change-plates': [3, 'standard'],
  dumbbells: [4, 'standard'],
  kettlebell: [5, 'standard'],
  rack: [6, 'tall'],
  bench: [7, 'standard'],
  collars: [8, 'standard'],
  drop: [9, 'wide'],
  knurl: [10, 'tall'],
  foundry: [11, 'wide'],
  garage: [12, 'wide'],
};

// A photograph. `cut` is for the products, which are shot on black: the picture's own black is
// dropped so the product stands on the page. Until a photograph has been supplied, a labelled
// block of the same shape holds its place.
export function Shot({ name, alt, cut = false, eager = false, className = '', position }) {
  const [number, shape] = SHOTS[name];
  const [width, height] = SIZES[shape];
  const classes = `tf-photo ${cut ? 'tf-photo--cut' : ''} ${className}`;

  if (!URLS[name]) {
    return (
      <span className={`${classes} tf-photo--todo`} role="img" aria-label={alt} style={{ aspectRatio: `${width} / ${height}` }}>
        <span aria-hidden="true">
          Photo {String(number).padStart(2, '0')}
          <br />
          {name}.jpg
        </span>
      </span>
    );
  }

  return (
    <img
      className={classes}
      src={URLS[name]}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      style={position ? { objectPosition: position } : undefined}
    />
  );
}

// The mark is a loaded sleeve seen from the front: three plates, heaviest inside.
export function Wordmark({ className = '' }) {
  return (
    <span className={`tf-wordmark ${className}`}>
      <svg viewBox="0 0 30 32" aria-hidden="true" focusable="false">
        <rect x="0" y="0" width="11" height="32" rx="1.5" fill="currentColor" />
        <rect x="13" y="0" width="8" height="32" rx="1.5" fill="currentColor" />
        <rect x="23" y="7" width="7" height="18" rx="1.5" fill="#d4f000" />
      </svg>
      Topforce
    </span>
  );
}

// A 25 kg bumper plate, face on. Used once, very large, at the foot of every page.
export function PlateFace() {
  const lettering = 'Topforce Sports · 25 kg · 55 lb · Nantong · ';
  return (
    <svg className="tf-plate-face" viewBox="-228 -228 456 456" aria-hidden="true" focusable="false">
      <defs>
        <path id="tf-face-ring" d="M0 158a158 158 0 1 1 0-316a158 158 0 1 1 0 316" />
        <radialGradient id="tf-face-hub">
          <stop offset="0.38" stopColor="#8f8f88" />
          <stop offset="0.41" stopColor="#4f4f4a" />
          <stop offset="0.47" stopColor="#d2d2cb" />
          <stop offset="0.88" stopColor="#b7b7af" />
          <stop offset="0.95" stopColor="#f2f2ec" />
          <stop offset="1" stopColor="#6e6e67" />
        </radialGradient>
      </defs>
      <circle r="225" fill="#161615" />
      <circle r="218" fill="none" stroke="#2f2f2c" strokeWidth="3" />
      <circle r="200" fill="none" stroke="#d4f000" strokeWidth="7" />
      <text className="tf-plate-face-text" fill="#f1efe9">
        <textPath href="#tf-face-ring" textLength="986" lengthAdjust="spacing">
          {lettering}
          {lettering}
        </textPath>
      </text>
      <circle r="128" fill="#101010" stroke="#2f2f2c" strokeWidth="3" />
      <circle r="66" fill="url(#tf-face-hub)" />
      <circle r="25.2" fill="var(--tf-chalk)" />
    </svg>
  );
}

// A score out of five, drawn as plates on a sleeve.
export function Score({ value }) {
  return (
    <span className="tf-score" role="img" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((step) => (
        <span key={step} data-on={step <= value ? '' : undefined} />
      ))}
    </span>
  );
}

const range = (product) => {
  const first = product.sizes[0];
  const last = product.sizes.at(-1);
  if (product.sizes.length === 1) return first.dims;
  const [low, high] = [Math.min(first.kg, last.kg), Math.max(first.kg, last.kg)];
  return `${product.sizes.length} sizes, ${formatKg(low)} to ${formatKg(high)} kg`;
};

// One product as a full-width shelf: photograph, name, and the figure you would compare.
export function Shelf({ product, heading: Heading = 'h3' }) {
  return (
    <Link to={productPath(product.slug)} className="tf-shelf">
      <span className="tf-shelf-art">
        <Shot name={product.photo} alt={product.alt} cut />
      </span>
      <span className="tf-shelf-text">
        <Heading className="tf-shelf-name">{product.name}</Heading>
        <span className="tf-shelf-blurb">{product.blurb}</span>
        <span className="tf-label">{range(product)}</span>
      </span>
      <span className="tf-shelf-fig">
        {product.rate ? (
          <>
            <span className="tf-fig">{formatPrice(product.rate)}</span>
            <span className="tf-label">per kilogram</span>
          </>
        ) : (
          <>
            <span className="tf-fig">{formatPrice(fromPrice(product)).replace(/\.00$/, '')}</span>
            <span className="tf-label">
              {product.sizes.length > 1 ? 'from, per' : 'per'} {product.unit}
            </span>
          </>
        )}
      </span>
    </Link>
  );
}
