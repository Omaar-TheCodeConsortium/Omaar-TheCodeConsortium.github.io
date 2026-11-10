import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Fabric } from '../Fabric.jsx';
import { FREE_SHIPPING_FROM, dyeById, formatPrice, productBySlug } from '../products.js';
import { BASE, productPath } from '../site.js';
import { lineKey, useSunloom } from '../sunloomContext.js';

export default function Cart() {
  const { lines, setQty, remove, count, subtotal, shipping, priceOf } = useSunloom();
  const [checkout, setCheckout] = useState(false);

  if (lines.length === 0) {
    return (
      <section className="grid min-h-[100svh] content-center gap-8 px-[var(--pad)] py-[clamp(120px,13vw,220px)]">
        <h1 className="sl-display text-[clamp(3rem,11vw,13rem)]">
          Your bag <em>is empty.</em>
        </h1>
        <Link to={`${BASE}collection/`} className="sl-btn sl-btn--dye w-fit">
          Shop the linen
        </Link>
      </section>
    );
  }

  const toFree = FREE_SHIPPING_FROM - subtotal;

  return (
    <div className="sl-bag">
      <section className="sl-bag-lines" aria-labelledby="sl-bag-title">
        <h1 id="sl-bag-title" className="sl-display mb-[clamp(24px,3vw,50px)] text-[clamp(3rem,9vw,10.5rem)]">
          Your bag
        </h1>
        <ul>
          {lines.map((line) => {
            const product = productBySlug(line.slug);
            const dye = dyeById(line.dye);
            const size = product.sizes.find((item) => item.id === line.size);
            const key = lineKey(line);
            return (
              <li key={key} className="sl-bag-line">
                <Fabric dye={line.dye} variant="flat" aria-hidden="true" />
                <div>
                  <Link to={productPath(product.slug)} className="sl-serif sl-link text-[clamp(1.3rem,2.2vw,2.3rem)]">
                    {product.name}
                  </Link>
                  <p className="sl-soft">
                    {dye.name} · {size.label}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <div className="sl-qty" role="group" aria-label={`Quantity of ${product.name}`}>
                      <button type="button" aria-label="One fewer" onClick={() => setQty(key, line.qty - 1)} disabled={line.qty <= 1}>
                        −
                      </button>
                      <output aria-live="polite">{line.qty}</output>
                      <button type="button" aria-label="One more" onClick={() => setQty(key, line.qty + 1)}>
                        +
                      </button>
                    </div>
                    <button type="button" className="sl-link min-h-[44px]" onClick={() => remove(key)}>
                      Remove<span className="sr-only"> {product.name}</span>
                    </button>
                  </div>
                </div>
                <p className="sl-serif self-start pt-1 text-[clamp(1.2rem,1.8vw,1.9rem)]">{formatPrice(priceOf(line) * line.qty)}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <Fabric variant="deep" className="sl-bag-sum" aria-live="polite">
        <dl className="grid gap-3 text-[1.1em]">
          <div className="flex justify-between gap-6">
            <dt>
              {count} {count === 1 ? 'piece' : 'pieces'}
            </dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-6">
            <dt>Shipping</dt>
            <dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
          </div>
          <div className="flex justify-between gap-6">
            <dt>Duties and taxes</dt>
            <dd>Included</dd>
          </div>
        </dl>
        {toFree > 0 && <p className="sl-small">{formatPrice(toFree)} more for free shipping.</p>}
        <p className="sl-display text-[clamp(3.4rem,8vw,9.5rem)]">{formatPrice(subtotal + shipping)}</p>
        {checkout ? (
          <p role="status" className="max-w-[40ch]">
            This is where checkout would begin. Sunloom International is a concept site, so no order has been placed
            and no payment can be taken.
          </p>
        ) : (
          <button type="button" className="sl-btn sl-btn--on-dye sl-btn--wide" onClick={() => setCheckout(true)}>
            Check out
          </button>
        )}
      </Fabric>
    </div>
  );
}
