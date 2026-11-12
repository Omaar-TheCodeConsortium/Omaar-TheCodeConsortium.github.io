import { useEffect, useRef } from 'react';

// Photographs are picked up by file name from ./photos. See docs/grandstar-shot-list.md.
const files = import.meta.glob('./photos/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' });
const PHOTOS = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.replace('./photos/', '').replace(/\.[a-z]+$/, ''), url]),
);

// Pixel size of each processed photograph. Balloons are placed in percent of these.
const SHAPES = { wide: [2400, 1340], standard: [2400, 1792], square: [1600, 1600], tall: [1195, 1600] };
const SHAPE_OF = {
  'hero-mould': 'wide',
  'hero-mould-tall': 'tall',
  toolroom: 'standard',
  'press-hall': 'wide',
  ejection: 'tall',
  cmm: 'standard',
  materials: 'standard',
  'case-lid': 'wide',
  dock: 'wide',
  edm: 'square',
  printer: 'tall',
  'lab-bench': 'standard',
  polish: 'square',
  'mould-store': 'wide',
};

// A photograph with numbered balloons, as on a first-article inspection drawing.
// Each pin is { x, y, value, text, dir, len }: x and y in percent of the picture, `dir` the way
// its leader line runs (right, left, up or down) and `len` the line's length in percent of the
// frame's width. `tx` and `ty` place the pin on the portrait version named by `tall`.
// On wide screens the labels sit on the picture; on narrow ones they move to a key beneath it.
export function Shot({ name, tall, alt, pins = [], anchor, fill = false, eager = false, showKey = true, className = '' }) {
  const frame = useRef(null);
  const hasPins = pins.length > 0;

  useEffect(() => {
    const el = frame.current;
    if (!hasPins || !el || !('IntersectionObserver' in window)) return undefined;
    el.dataset.armed = '';
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.in = '';
        observer.disconnect();
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasPins]);

  const [width, height] = SHAPES[SHAPE_OF[name]];
  const tallSize = tall ? SHAPES[SHAPE_OF[tall]] : null;

  return (
    <figure className={`gs-fig ${fill ? 'gs-fig--fill' : ''} ${className}`}>
      <div
        ref={frame}
        className="gs-shot"
        data-tall={tall ? '' : undefined}
        style={{
          '--ar-wide': width / height,
          '--ar-tall': tallSize ? tallSize[0] / tallSize[1] : undefined,
          '--ax': anchor?.[0],
          '--ay': anchor?.[1],
        }}
      >
        <div className="gs-shot-stage">
          <picture>
            {tall && <source media="(max-width: 700px)" srcSet={PHOTOS[tall]} />}
            <img
              src={PHOTOS[name]}
              alt={alt}
              width={width}
              height={height}
              loading={eager ? 'eager' : 'lazy'}
              fetchPriority={eager ? 'high' : undefined}
              decoding="async"
            />
          </picture>
          {pins.map((pin, index) => (
            <span
              key={pin.value}
              className="gs-pin"
              data-dir={pin.dir ?? 'right'}
              aria-hidden="true"
              style={{
                '--x': `${pin.x}%`,
                '--y': `${pin.y}%`,
                '--tx': pin.tx === undefined ? undefined : `${pin.tx}%`,
                '--ty': pin.ty === undefined ? undefined : `${pin.ty}%`,
                '--len': `${pin.len ?? 5}cqw`,
                '--i': index,
              }}
            >
              <span className="gs-pin-no">{index + 1}</span>
              <span className="gs-pin-line" />
              <span className="gs-pin-label">
                <strong>{pin.value}</strong>
                {pin.text}
              </span>
            </span>
          ))}
        </div>
      </div>

      {hasPins && showKey && (
        <figcaption>
          <ol className="gs-shot-key">
            {pins.map((pin, index) => (
              <li key={pin.value}>
                <span className="gs-pin-no" aria-hidden="true">
                  {index + 1}
                </span>
                <span>
                  <strong>{pin.value}.</strong> {pin.text}
                </span>
              </li>
            ))}
          </ol>
        </figcaption>
      )}
    </figure>
  );
}
