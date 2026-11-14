import { cutout, photoUrl } from './cutouts.js';

const SIZES = { wide: [2400, 1340], standard: [2400, 1792], square: [1600, 1600], tall: [1200, 1600] };

// A photograph on its own studio backdrop.
export function Photo({ name, shape = 'wide', alt, eager = false, className = '', position }) {
  const [width, height] = SIZES[shape];
  return (
    <img
      className={`hx-photo ${className}`}
      src={photoUrl(name)}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      style={position ? { objectPosition: position } : undefined}
    />
  );
}

// A product cut out of its backdrop. Sized by its container; keeps its own proportions.
export function Cut({ name, alt = '', eager = false, className = '', style }) {
  const piece = cutout(name);
  return (
    <img
      className={`hx-cut ${className}`}
      src={piece.src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      style={{ aspectRatio: piece.ratio, ...style }}
    />
  );
}

// The phone case, re-coloured. The photograph is off-white; a grey light-and-shade layer of the
// case material is multiplied with the chosen colour and laid over it.
export function Case({ view = 'case-back', tint, alt, className = '' }) {
  const piece = cutout(view);
  return (
    <span className={`hx-case ${className}`} style={{ aspectRatio: piece.ratio }} role="img" aria-label={alt}>
      <img src={piece.src} alt="" loading="lazy" decoding="async" />
      <span
        className="hx-case-tint"
        data-on={tint ? '' : undefined}
        style={{ '--tint': tint ?? 'transparent', '--shade': `url(${piece.shade})` }}
      />
    </span>
  );
}

// The wordmark's O is a USB-C port, lined in orange like the ports on every charger.
export function Wordmark({ className = '' }) {
  return (
    <span className={`hx-wordmark ${className}`}>
      H
      <svg viewBox="0 0 34 44" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="28" height="38" rx="14" fill="none" stroke="currentColor" strokeWidth="6" />
        <rect x="13.5" y="13" width="7" height="18" rx="3.5" fill="#ff5a00" />
      </svg>
      XEN
    </span>
  );
}
