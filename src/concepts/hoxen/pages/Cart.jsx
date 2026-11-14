import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Case, Cut } from '../Media.jsx';
import { CASE_COLOURS, FREE_SHIPPING_FROM, formatPrice, lineDetail, lineKey, linePrice, lineTitle } from '../catalog.js';
import { useHoxen } from '../hoxenContext.js';
import { BASE } from '../site.js';

function Thumb({ line }) {
  if (line.kind === 'case') {
    const colour = CASE_COLOURS.find((item) => item.id === line.colour) ?? CASE_COLOURS[0];
    return <Case view="case-back" tint={colour.tint} alt="" />;
  }
  return <Cut name={`charger-${line.watts}`} />;
}

export default function Cart() {
  const { lines, setQty, remove, count, subtotal, shipping } = useHoxen();
  const [checkout, setCheckout] = useState(false);

  if (lines.length === 0) {
    return (
      <section className="hx-band grid min-h-[72svh] content-center gap-7">
        <h1 className="hx-h1">Your bag is empty.</h1>
        <p className="hx-lede">Chargers start at $19, and shipping is free over ${FREE_SHIPPING_FROM}.</p>
        <div className="flex flex-wrap gap-3">
          <Link to={`${BASE}charger/`} className="hx-btn hx-btn--go">
            Build a charger
          </Link>
          <Link to={`${BASE}compatibility/`} className="hx-btn">
            Check my devices
          </Link>
        </div>
      </section>
    );
  }

  const toFree = FREE_SHIPPING_FROM - subtotal;

  return (
    <div className="hx-bag">
      <section aria-labelledby="hx-bag-title">
        <h1 id="hx-bag-title" className="hx-h1 mb-[clamp(24px,3vw,44px)]">
          Your bag
        </h1>
        <ul className="grid gap-2">
          {lines.map((line) => {
            const key = lineKey(line);
            return (
              <li key={key} className="hx-bag-line">
                <span className="hx-bag-thumb" aria-hidden="true">
                  <Thumb line={line} />
                </span>
                <div>
                  <h2 className="hx-opt-name !text-[1.2rem]">{lineTitle(line)}</h2>
                  <p className="hx-muted text-[0.95rem]">{lineDetail(line)}</p>
                </div>
                <div className="col-span-2 flex items-center justify-between gap-4 lg:col-span-1">
                  <div className="hx-stepper" role="group" aria-label={`Quantity of ${lineTitle(line)}`}>
                    <button type="button" aria-label="One fewer" disabled={line.qty <= 1} onClick={() => setQty(key, line.qty - 1)}>
                      −
                    </button>
                    <span aria-live="polite">{line.qty}</span>
                    <button type="button" aria-label="One more" disabled={line.qty >= 20} onClick={() => setQty(key, line.qty + 1)}>
                      +
                    </button>
                  </div>
                  <button type="button" className="hx-plain" onClick={() => remove(key)}>
                    Remove<span className="sr-only"> {lineTitle(line)}</span>
                  </button>
                </div>
                <p className="hx-row-fig col-span-2 text-right lg:col-span-1 lg:min-w-[5.5rem]">{formatPrice(linePrice(line) * line.qty)}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <aside className="hx-bag-side" aria-label="Order summary">
        <div className="hx-total">
          <dl className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-2">
            <dt className="text-[#c3c7cd]">
              {count} {count === 1 ? 'item' : 'items'}
            </dt>
            <dd className="hx-mono">{formatPrice(subtotal)}</dd>
            <dt className="text-[#c3c7cd]">Shipping</dt>
            <dd className="hx-mono">{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
          </dl>
          <div>
            <p className="hx-k">Total</p>
            <p className="hx-total-price mt-1" aria-live="polite">
              {formatPrice(subtotal + shipping)}
            </p>
          </div>
          {toFree > 0 && (
            <p className="text-[0.92rem] text-[#c3c7cd]">
              {formatPrice(toFree)} more and shipping is free.
            </p>
          )}
          {checkout ? (
            <div className="rounded-[18px] bg-white p-5 text-[var(--hx-ink)]" role="status">
              <p className="hx-opt-name">This is where you would pay.</p>
              <p className="mt-2 text-[0.95rem] text-[#4a4e55]">
                Hoxen is a concept site, so nothing has been ordered or charged. On a live shop this button opens the
                checkout.
              </p>
            </div>
          ) : (
            <button type="button" className="hx-btn hx-btn--go" onClick={() => setCheckout(true)}>
              Check out
            </button>
          )}
        </div>
        <p className="hx-muted mt-4 text-[0.92rem]">30-day returns. 24-month warranty on every charger and cable.</p>
      </aside>
    </div>
  );
}
