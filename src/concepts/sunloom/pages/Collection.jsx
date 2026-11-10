import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Photo, Swatches } from '../Fabric.jsx';
import { CATEGORIES, PRODUCTS, basePrice, dyeById, formatPrice } from '../products.js';
import { productPath } from '../site.js';

// Tile widths, out of twelve columns, so no two rows have the same rhythm.
const SPANS = [7, 5, 4, 4, 4, 5, 7, 12];

export default function Collection() {
  const [category, setCategory] = useState('All');
  const [dye, setDye] = useState(null);

  const visible = PRODUCTS.filter(
    (product) => (category === 'All' || product.category === category) && (!dye || product.dyes.includes(dye)),
  );
  // Spans are dealt out over whatever is showing, and the last row is always filled.
  const spans = visible.map((_, index) => SPANS[index % SPANS.length]);
  const used = spans.reduce((sum, span) => sum + span, 0) % 12;
  if (spans.length && used !== 0) spans[spans.length - 1] += 12 - used;

  return (
    <>
      <section className="grid gap-[var(--pad)] px-[var(--pad)] pb-[clamp(24px,3vw,50px)] pt-[clamp(120px,13vw,220px)]">
        <h1 className="sl-display text-[clamp(3rem,10.2vw,12rem)]">
          Linen for bed, <em>table and bath.</em>
        </h1>

        <div className="flex flex-wrap items-end justify-between gap-x-[var(--pad)] gap-y-6">
          <div role="group" aria-label="Filter by room" className="flex flex-wrap gap-x-7 gap-y-1 text-[1.15em]">
            {CATEGORIES.map((name) => (
              <button
                key={name}
                type="button"
                aria-pressed={category === name}
                onClick={() => setCategory(name)}
                className={`min-h-[44px] border-b transition-colors duration-300 ${category === name ? 'border-current' : 'border-transparent text-[color:var(--ink-soft)] hover:text-[color:var(--ink)]'}`}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="sl-small" aria-live="polite">
              {dye
                ? `${visible.length} of ${PRODUCTS.length} pieces come in ${dyeById(dye).name}`
                : `${visible.length} pieces. Pick a colour to see them dyed in it`}
            </span>
            <Swatches value={dye} onPick={(id) => setDye(dye === id ? null : id)} label="Show pieces in a colour" />
          </div>
        </div>
      </section>

      <section aria-label="Products" className="sl-grid">
        {visible.map((product, index) => {
          const shown = dye ?? product.dye;
          return (
            <article key={product.slug} className="sl-tile" style={{ '--span': spans[index] }}>
              <Photo
                name={product.photo}
                dye={shown}
                tint
                alt={`${product.name} in ${dyeById(shown).name}`}
                stack={product.dyes.filter((id) => id !== shown).slice(0, spans[index] > 5 ? 5 : 3)}
                variant={index % 2 ? 'deep' : 'drape'}
              />
              <div className="sl-dots" aria-hidden="true">
                {product.dyes.map((id) => (
                  <i key={id} style={{ '--c': dyeById(id).hex }} />
                ))}
              </div>
              <div className="sl-tile-cap" style={{ color: dyeById(shown).on }}>
                <h2 className="sl-serif">{product.short}</h2>
                <span className="shrink-0 text-right">
                  from {formatPrice(basePrice(product))}
                  <span className="sl-small block opacity-80">{product.dyes.length} colours</span>
                </span>
              </div>
              <Link to={productPath(product.slug)} aria-label={`${product.name}, from ${formatPrice(basePrice(product))}`} />
            </article>
          );
        })}
      </section>

      {visible.length === 0 && (
        <p className="sl-serif px-[var(--pad)] py-[clamp(60px,10vw,160px)] text-[clamp(1.6rem,3vw,3.2rem)]">
          Nothing in that room comes in {dyeById(dye).name} yet.{' '}
          <button type="button" className="sl-link" onClick={() => setDye(null)}>
            Show every colour
          </button>
        </p>
      )}
    </>
  );
}
