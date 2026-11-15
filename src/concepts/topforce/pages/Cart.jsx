import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shot } from '../Media.jsx';
import {
  FREE_FREIGHT_FROM,
  MAX_QTY,
  SET_FROM_KG,
  formatKg,
  formatPrice,
  lineKey,
  lineKg,
  linePrice,
  productBySlug,
  shipsAs,
  sizeLabel,
  toLb,
} from '../catalog.js';
import { useTopforce } from '../topforceContext.js';
import { BASE, productPath } from '../site.js';

export default function Cart() {
  const { lines, setQty, remove, subtotal, kg, discount, isSet, hasBar, plateKg, freight, total, pallet } = useTopforce();
  const [checkout, setCheckout] = useState(false);

  if (lines.length === 0) {
    return (
      <section className="tf-empty">
        <h1 className="tf-mega">Nothing on the bar yet.</h1>
        <p className="tf-lede">
          Your cart is empty. A 20 kg bar is $189 and bumper plates are $3.18 a kilo, with free freight over $
          {FREE_FREIGHT_FROM}.
        </p>
        <div className="tf-hero-actions">
          <Link to={`${BASE}build/`} className="tf-btn tf-btn--volt">
            Build a set
          </Link>
          <Link to={`${BASE}shop/`} className="tf-btn">
            See all eight products
          </Link>
        </div>
      </section>
    );
  }

  const goods = subtotal - discount;
  const toFree = FREE_FREIGHT_FROM - goods;
  const toSet = SET_FROM_KG - plateKg;

  return (
    <div className="tf-cart">
      <header className="tf-cart-head">
        <h1 className="tf-mega">Your cart.</h1>
        <p className="tf-cart-kg">
          <span className="tf-label">It weighs</span>
          <span className="tf-fig">
            {formatKg(Math.round(kg * 10) / 10)}
            <small>kg</small>
          </span>
          <span className="tf-label">
            {toLb(kg)} lb. {shipsAs(pallet)}.
          </span>
        </p>
      </header>

      <div className="tf-cart-cols">
        <section aria-label="Items in your cart">
          <ul className="tf-cart-lines">
            {lines.map((line) => {
              const key = lineKey(line);
              const product = productBySlug(line.slug);
              const title = `${product.name}${product.sizes.length > 1 ? `, ${sizeLabel(product, line.kg)}` : ''}`;
              return (
                <li key={key} className="tf-cart-line">
                  <Link to={productPath(product.slug)} className="tf-cart-art" tabIndex={-1} aria-hidden="true">
                    <Shot name={product.photo} alt="" cut />
                  </Link>
                  <div className="tf-cart-what">
                    <h2 className="tf-shelf-name">
                      <Link to={productPath(product.slug)}>{title}</Link>
                    </h2>
                    <p className="tf-label">
                      {formatKg(Math.round(lineKg(line) * 100) / 100)} kg
                      {product.rate ? ` at ${formatPrice(product.rate)} per kg` : ''}
                    </p>
                  </div>
                  <div className="tf-cart-qty">
                    <div className="tf-stepper" role="group" aria-label={`Quantity of ${title}`}>
                      <button type="button" aria-label="One fewer" disabled={line.qty <= 1} onClick={() => setQty(key, line.qty - 1)}>
                        −
                      </button>
                      <span aria-live="polite">{line.qty}</span>
                      <button type="button" aria-label="One more" disabled={line.qty >= MAX_QTY} onClick={() => setQty(key, line.qty + 1)}>
                        +
                      </button>
                    </div>
                    <button type="button" className="tf-text-btn" onClick={() => remove(key)}>
                      Remove<span className="sr-only"> {title}</span>
                    </button>
                  </div>
                  <p className="tf-cart-price">{formatPrice(linePrice(line))}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <aside className="tf-ticket" aria-labelledby="tf-cart-sum">
          <h2 id="tf-cart-sum" className="tf-step-name">
            Order
          </h2>
          <dl className="tf-ticket-sums">
            <div>
              <dt>Goods</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            {isSet && (
              <div>
                <dt>Set price, 8% off {formatKg(plateKg)} kg of plates</dt>
                <dd>−{formatPrice(discount)}</dd>
              </div>
            )}
            <div>
              <dt>Freight, {formatKg(Math.round(kg))} kg</dt>
              <dd>{freight === 0 ? 'Free' : formatPrice(freight)}</dd>
            </div>
          </dl>
          <p className="tf-ticket-total" aria-live="polite">
            {formatPrice(total)}
          </p>
          <p className="tf-ticket-note">
            {toFree > 0 && `${formatPrice(toFree)} more and the freight is free. `}
            {hasBar && !isSet && toSet > 0 && `${formatKg(toSet)} kg more plates and the plates cost 8% less. `}
            Returns within 30 days; we pay the freight back.
          </p>
          {checkout ? (
            <div className="tf-ticket-done" role="status">
              <p>
                <strong>This is where you would pay.</strong>
              </p>
              <p>
                Topforce Sports is a concept site, so nothing has been ordered or charged. On a live shop this button
                opens the checkout.
              </p>
            </div>
          ) : (
            <button type="button" className="tf-btn tf-btn--iron" onClick={() => setCheckout(true)}>
              Check out
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
