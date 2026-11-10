import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Photo, Swatches } from '../Fabric.jsx';
import { PRODUCTS, REVIEWS, averageRating, basePrice, dyeById, formatPrice } from '../products.js';
import { BASE, productPath } from '../site.js';
import { useSunloom } from '../sunloomContext.js';

function Rating({ value }) {
  return (
    <span className="sl-stars" role="img" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((step) => (
        <i key={step} data-on={step <= value} />
      ))}
    </span>
  );
}

export default function Product({ product }) {
  const { dye, setDye, add } = useSunloom();
  const [size, setSize] = useState(product.sizes[Math.min(1, product.sizes.length - 1)].id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // Opening a product dyes the whole site in that product's colour.
  useEffect(() => {
    setDye(product.dye);
  }, [product, setDye]);

  // Until the effect above has run, or if the site is dyed in a colour this piece is not made in,
  // show the product's own colour.
  const shown = product.dyes.includes(dye) ? dye : product.dye;
  const shownDye = dyeById(shown);
  const price = product.sizes.find((item) => item.id === size).price;
  const reviews = REVIEWS[product.slug] ?? [];
  const average = averageRating(reviews);
  const others = PRODUCTS.filter((item) => item.slug !== product.slug && item.category === product.category)
    .concat(PRODUCTS.filter((item) => item.category !== product.category))
    .slice(0, 3);

  const pick = (id) => {
    setDye(id);
    setAdded(false);
  };

  const addToBag = () => {
    add({ slug: product.slug, size, dye: shown, qty });
    setAdded(true);
  };

  return (
    <>
      <div className="sl-product">
        <div className="sl-product-media">
          <Photo
            name={product.photo}
            dye={shown}
            tint
            loading="eager"
            alt={`${product.name} in ${shownDye.name}`}
            stack={product.dyes.filter((id) => id !== shown).slice(0, 5)}
          />
        </div>

        <div className="sl-product-body">
          <nav aria-label="Breadcrumb" className="sl-small sl-soft">
            <Link to={`${BASE}collection/`} className="sl-link">
              Shop
            </Link>{' '}
            / {product.category}
          </nav>

          <div>
            <h1 className="sl-display">{product.name}</h1>
            <p className="sl-serif mt-4 text-[clamp(1.5rem,2.2vw,2.3rem)]">{formatPrice(price)}</p>
          </div>

          <p className="max-w-[46ch] text-[1.1em]">{product.blurb}</p>

          <div>
            <p className="mb-2 flex items-baseline justify-between">
              <span className="font-medium">Colour</span>
              <span aria-live="polite">{shownDye.name}</span>
            </p>
            <Swatches ids={product.dyes} value={shown} onPick={pick} label="Colour" size="lg" />
          </div>

          <fieldset>
            <legend className="mb-1 font-medium">Size</legend>
            {product.sizes.map((item) => (
              <label key={item.id} className="sl-choice">
                <input type="radio" name="size" value={item.id} checked={size === item.id} onChange={() => setSize(item.id)} />
                <span className="flex items-center gap-4">
                  <span className="sl-choice-mark" aria-hidden="true" />
                  {item.label}
                </span>
                <span>{formatPrice(item.price)}</span>
              </label>
            ))}
          </fieldset>

          <div className="flex flex-wrap items-center gap-4">
            <div className="sl-qty" role="group" aria-label="Quantity">
              <button type="button" aria-label="One fewer" onClick={() => setQty(Math.max(1, qty - 1))}>
                −
              </button>
              <output aria-live="polite">{qty}</output>
              <button type="button" aria-label="One more" onClick={() => setQty(Math.min(20, qty + 1))}>
                +
              </button>
            </div>
            <button type="button" className="sl-btn sl-btn--dye min-w-[14rem] flex-1" onClick={addToBag}>
              Add to bag · {formatPrice(price * qty)}
            </button>
          </div>
          <p role="status" className="-mt-2 min-h-[1.5em]">
            {added && (
              <>
                Added in {shownDye.name}.{' '}
                <Link to={`${BASE}cart/`} className="sl-link">
                  View your bag
                </Link>
              </>
            )}
          </p>

          <div className="sl-details border-t border-[color:color-mix(in_srgb,var(--ink)_22%,transparent)]">
            <details open>
              <summary>What you get</summary>
              <div>
                {product.includes}. {product.weight} g/m² washed linen, woven and sewn in our mill in Shaoxing.
              </div>
            </details>
            <details>
              <summary>Care</summary>
              <div>
                Machine wash at 40 °C, or 60 °C when it needs it. Tumble dry low or line dry. No ironing needed, and
                no fabric softener: it coats the fibre and makes linen less absorbent. Wash indigo and madder alone the
                first time.
              </div>
            </details>
            <details>
              <summary>Shipping and returns</summary>
              <div>
                Ships from our mill in two working days, duties and taxes paid, in 7 to 11 days to Europe, the United
                Kingdom, the United States and Canada. Free over $150, otherwise $14. Return anything unwashed within 30
                days.
              </div>
            </details>
            <details>
              <summary>Buying for a shop or hotel</summary>
              <div>
                Wholesale starts at {product.wholesaleFrom} pieces of this item.{' '}
                <Link to={`${BASE}wholesale/`} className="sl-link text-[color:var(--ink)]">
                  See wholesale terms
                </Link>
              </div>
            </details>
          </div>

          <section aria-labelledby="sl-reviews">
            <h2 id="sl-reviews" className="sl-serif text-[clamp(1.6rem,2.4vw,2.5rem)]">
              {reviews.length ? `${average.toFixed(1)} out of 5, from ${reviews.length} reviews` : 'No reviews yet'}
            </h2>
            {reviews.length === 0 && (
              <p className="sl-soft mt-2 max-w-[44ch]">
                This piece is new this season. Reviews appear here once buyers have had it for a month.
              </p>
            )}
            <ul className="mt-5">
              {reviews.map((review) => (
                <li key={review.name} className="sl-review">
                  <p className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
                    <span>
                      <Rating value={review.rating} /> <span className="ml-2 font-medium">{review.name}</span>,{' '}
                      {review.place}
                    </span>
                    <span className="sl-small sl-soft">
                      {review.dye} · {review.date}
                    </span>
                  </p>
                  <p className="mt-2 max-w-[56ch]">{review.text}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section aria-labelledby="sl-with" className="pt-[clamp(50px,7vw,120px)]">
        <h2 id="sl-with" className="sl-display px-[var(--pad)] pb-[clamp(18px,2vw,30px)] text-[clamp(2.2rem,5.6vw,6.4rem)]">
          Goes with
        </h2>
        <div className="sl-grid" style={{ gridAutoRows: 'min(56vh, 620px)' }}>
          {others.map((item, index) => {
            const itemDye = item.dyes.includes(shown) ? shown : item.dye;
            return (
              <article key={item.slug} className="sl-tile" style={{ '--span': [5, 3, 4][index] }}>
                <Photo
                  name={item.photo}
                  dye={itemDye}
                  tint
                  alt={`${item.name} in ${dyeById(itemDye).name}`}
                  stack={item.dyes.filter((id) => id !== itemDye).slice(0, 3)}
                  variant={index % 2 ? 'deep' : 'drape'}
                />
                <div className="sl-tile-cap" style={{ color: dyeById(itemDye).on }}>
                  <h3 className="sl-serif text-[clamp(1.4rem,2.3vw,2.6rem)]">{item.short}</h3>
                  <span className="shrink-0">from {formatPrice(basePrice(item))}</span>
                </div>
                <Link to={productPath(item.slug)} aria-label={`${item.name}, from ${formatPrice(basePrice(item))}`} />
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
