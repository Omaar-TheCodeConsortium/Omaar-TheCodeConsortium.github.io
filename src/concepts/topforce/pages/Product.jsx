import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Score, Shelf, Shot } from '../Media.jsx';
import {
  CATEGORIES,
  FREE_FREIGHT_FROM,
  MAX_QTY,
  PALLET_FROM_KG,
  PRODUCTS,
  formatKg,
  formatPrice,
  saleKg,
  salePrice,
  shipsAs,
  sizeLabel,
  sizeOf,
  toLb,
} from '../catalog.js';
import { useTopforce } from '../topforceContext.js';
import { BASE, categoryPath } from '../site.js';

// What sits next to a product on the bar or in the room.
const WITH = {
  'olympic-bar': ['bumper-plates', 'collars'],
  'bumper-plates': ['olympic-bar', 'change-plates'],
  'change-plates': ['bumper-plates', 'collars'],
  'hex-dumbbells': ['bench', 'kettlebell'],
  kettlebell: ['hex-dumbbells', 'bench'],
  'half-rack': ['olympic-bar', 'bench'],
  bench: ['half-rack', 'hex-dumbbells'],
  collars: ['olympic-bar', 'bumper-plates'],
};

export default function Product({ product }) {
  const { add } = useTopforce();
  const [kg, setKg] = useState(product.start);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const category = CATEGORIES.find((item) => item.id === product.category);
  const size = sizeOf(product, kg);
  const price = salePrice(product, kg);
  const weight = saleKg(product, kg);
  const sized = product.sizes.length > 1;
  const average = product.reviews.reduce((sum, review) => sum + review.score, 0) / product.reviews.length;
  const others = WITH[product.slug].map((slug) => PRODUCTS.find((item) => item.slug === slug));

  const pick = (next) => {
    setKg(next);
    setAdded(false);
  };

  return (
    <article className="tf-prod">
      <header className="tf-prod-head">
        <nav aria-label="Breadcrumb" className="tf-crumb">
          <Link to={`${BASE}shop/`}>Shop</Link>
          <span aria-hidden="true">/</span>
          <Link to={categoryPath(category.id)}>{category.name}</Link>
        </nav>
        <h1 className="tf-mega">{product.name}</h1>
      </header>

      <div className="tf-prod-main">
        <div className="tf-prod-stage">
          <Shot name={product.photo} alt={product.alt} cut eager />
          <p className="tf-prod-tag" aria-hidden="true">
            {formatKg(kg)}
            <small>kg</small>
          </p>
        </div>

        <div className="tf-prod-buy">
          <p className="tf-lede">{product.blurb}</p>

          {sized && (
            <div className="tf-pick" role="group" aria-labelledby="tf-pick-label">
              <p id="tf-pick-label" className="tf-label">
                {product.per > 1 ? 'Weight of each, in kg' : 'Weight, in kg'}
              </p>
              <div className="tf-pick-grid">
                {product.sizes.map((item) => (
                  <button key={item.kg} type="button" className="tf-pick-cell" aria-pressed={item.kg === kg} onClick={() => pick(item.kg)}>
                    {formatKg(item.kg)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <dl className="tf-prod-facts">
            <div>
              <dt>You get</dt>
              <dd>
                {sizeLabel(product, kg)}
                {product.per > 1 ? `, ${formatKg(weight)} kg in all` : ''} ({toLb(weight)} lb)
              </dd>
            </div>
            <div>
              <dt>Size</dt>
              <dd>{size.dims}</dd>
            </div>
            <div>
              <dt>Code</dt>
              <dd>{size.sku ?? `${product.sku}-${String(Math.round(kg * 100)).padStart(4, '0')}`}</dd>
            </div>
          </dl>

          <div className="tf-prod-price" aria-live="polite">
            <p className="tf-prod-total">{formatPrice(price * qty)}</p>
            <p className="tf-label">
              {product.rate
                ? `${formatPrice(product.rate)} per kg × ${formatKg(weight * qty)} kg`
                : `Price per ${product.unit}`}
            </p>
          </div>

          <div className="tf-prod-actions">
            <div className="tf-stepper" role="group" aria-label="Quantity">
              <button
                type="button"
                aria-label="One fewer"
                disabled={qty <= 1}
                onClick={() => {
                  setQty(qty - 1);
                  setAdded(false);
                }}
              >
                −
              </button>
              <span aria-live="polite">{qty}</span>
              <button
                type="button"
                aria-label="One more"
                disabled={qty >= MAX_QTY}
                onClick={() => {
                  setQty(qty + 1);
                  setAdded(false);
                }}
              >
                +
              </button>
            </div>
            {added ? (
              <Link to={`${BASE}cart/`} className="tf-btn tf-btn--volt">
                In the cart. Open it
              </Link>
            ) : (
              <button
                type="button"
                className="tf-btn tf-btn--volt"
                onClick={() => {
                  add({ slug: product.slug, kg, qty });
                  setAdded(true);
                }}
              >
                Add {qty > 1 ? `${qty} ` : ''}to the cart
              </button>
            )}
          </div>

          <p className="tf-prod-ship">
            {shipsAs(weight * qty >= PALLET_FROM_KG)} from Los Angeles or Rotterdam. Freight is free over $
            {FREE_FREIGHT_FROM}.
          </p>
        </div>
      </div>

      <section className="tf-proof" aria-labelledby="tf-proof-title">
        <h2 id="tf-proof-title" className="tf-proof-fig">
          {product.proof.figure}
          <span>{product.proof.unit}</span>
        </h2>
        <div className="tf-proof-text">
          <p className="tf-lede">{product.proof.text}</p>
          {product.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="tf-spec" aria-labelledby="tf-spec-title">
        <h2 id="tf-spec-title" className="tf-h2">
          The numbers
        </h2>
        <dl className="tf-spec-list">
          {product.specs.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="tf-reviews" aria-labelledby="tf-reviews-title">
        <div className="tf-reviews-head">
          <h2 id="tf-reviews-title" className="tf-h2">
            From people who bought it
          </h2>
          <p className="tf-reviews-avg">
            <span className="tf-fig">{average.toFixed(1)}</span>
            <span className="tf-label">out of 5, from {product.reviews.length} reviews</span>
          </p>
        </div>
        <ul className="tf-reviews-list">
          {product.reviews.map((review) => (
            <li key={review.who}>
              <Score value={review.score} />
              <blockquote>{review.text}</blockquote>
              <p className="tf-label">
                {review.who}, {review.where}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="tf-cat" aria-labelledby="tf-with-title">
        <header className="tf-cat-head">
          <h2 id="tf-with-title" className="tf-cat-name">
            Goes with it
          </h2>
        </header>
        <ul>
          {others.map((item) => (
            <li key={item.slug}>
              <Shelf product={item} />
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
