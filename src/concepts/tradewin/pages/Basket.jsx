import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../Card.jsx';
import FlipLink from '../FlipLink.jsx';
import { Meter, Shot, Stepper } from '../Media.jsx';
import {
  ACCOUNT,
  FREE_POSTAGE_FROM,
  FREIGHT,
  MAX_CARTONS,
  MAX_QTY,
  PRODUCTS,
  TIER_FROM,
  DELIVERY_DAYS,
  formatCount,
  formatPrice,
  linePrice,
  lineSaving,
  percent,
  productBySlug,
  tierIndex,
  tradeLine,
  unitPrice,
} from '../catalog.js';
import { formatLeft, formatSpan, packingRun, useNow } from '../clock.js';
import { useTradewin } from '../tradewinContext.js';
import { baseOf, pathOf, productPath } from '../site.js';

function Thumb({ product, side }) {
  return (
    <Link to={productPath(product.slug, side)} className="tw-line-art" style={{ '--tw-tint': product.tint }} tabIndex={-1} aria-hidden="true">
      <Shot name={product.photo} alt="" />
    </Link>
  );
}

// The Direct basket. Two things pull the total up honestly: a second one costs less, and
// postage disappears at $35. Both are shown as distances, not as pressure.
function DirectBasket() {
  const { lines, setQty, basket, empty } = useTradewin();
  const now = useNow();
  const run = now ? packingRun(now) : null;
  const [placed, setPlaced] = useState(null);

  const held = lines.map((line) => line.slug);
  const nearest = PRODUCTS.filter((product) => !held.includes(product.slug))
    .sort((a, b) => Math.abs(a.retail - basket.toFree) - Math.abs(b.retail - basket.toFree))
    .slice(0, 4);

  const place = () => {
    setPlaced({ total: basket.total, count: basket.count, span: run ? formatSpan(run.from, run.to) : null });
    empty('lines');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  if (placed) {
    return (
      <section className="tw-done" aria-labelledby="tw-bag-title">
        <p className="tw-tag">Order TW-D-88241 · {placed.count} {placed.count === 1 ? 'item' : 'items'} · {formatPrice(placed.total)}</p>
        <h1 id="tw-bag-title" className="tw-display">
          It is in today&rsquo;s packing run.
        </h1>
        <p className="tw-lede">
          {placed.span ? `It should reach you ${placed.span}. ` : `It should reach you in ${DELIVERY_DAYS[0]} to ${DELIVERY_DAYS[1]} days. `}
          Nothing was charged and nothing will be posted: Tradewin is a demonstration.
        </p>
        <p className="tw-done-act">
          <Link to={pathOf('direct', 'orders')} className="tw-btn tw-btn--loud">
            Follow a parcel through its five stops
          </Link>
          <Link to={baseOf('direct')} className="tw-btn tw-btn--line">
            Back to the shop
          </Link>
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="tw-bag-page" aria-labelledby="tw-bag-title">
        <div className="tw-bag-main">
          <h1 id="tw-bag-title" className="tw-display">
            {basket.count === 0 ? 'Your basket is empty.' : `Your basket: ${basket.count} ${basket.count === 1 ? 'item' : 'items'}`}
          </h1>

          {basket.count === 0 ? (
            <p className="tw-lede">
              Postage is free from ${FREE_POSTAGE_FROM}, and a second one of anything is 10% less. <Link to={baseOf('direct')}>See all twelve</Link>.
            </p>
          ) : (
            <ul className="tw-lines">
              {lines.map((line) => {
                const product = productBySlug(line.slug);
                const saving = lineSaving(product, line.qty);
                const second = linePrice(product, line.qty + 1) - linePrice(product, line.qty);
                return (
                  <li key={line.slug}>
                    <Thumb product={product} side="direct" />
                    <div className="tw-line-what">
                      <h2>
                        <Link to={productPath(product.slug)}>{product.name}</Link>
                      </h2>
                      <p className="tw-note">
                        {product.pack} · {formatPrice(unitPrice(product, line.qty))} each
                        {saving > 0 ? `, ${formatPrice(saving)} off for buying ${line.qty}` : ''}
                      </p>
                      {line.qty < 3 ? (
                        <p className="tw-nudge">
                          One more is <strong>{formatPrice(second)}</strong>, not {formatPrice(product.retail)}
                        </p>
                      ) : null}
                    </div>
                    <div className="tw-line-qty">
                      <Stepper value={line.qty} max={MAX_QTY} onChange={(qty) => setQty(line.slug, qty)} label={`Quantity of ${product.name}`} unit="item" />
                      <button type="button" className="tw-link" onClick={() => setQty(line.slug, 0)}>
                        Remove<span className="tw-hide"> {product.name}</span>
                      </button>
                    </div>
                    <p className="tw-line-sum">{formatPrice(linePrice(product, line.qty))}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {basket.count > 0 ? (
          <aside className="tw-total" aria-label="Order total">
            <div className="tw-free" data-done={basket.toFree === 0 ? '' : undefined}>
              <p>
                {basket.toFree > 0 ? (
                  <>
                    <strong>{formatPrice(basket.toFree)}</strong> more and postage is free
                  </>
                ) : (
                  <strong>Postage is free on this order</strong>
                )}
              </p>
              <Meter share={basket.goods / FREE_POSTAGE_FROM} label={`${formatPrice(basket.goods)} of the $${FREE_POSTAGE_FROM} that makes postage free`} />
            </div>
            <dl className="tw-sum">
              <div>
                <dt>Goods</dt>
                <dd>{formatPrice(basket.goods)}</dd>
              </div>
              {basket.saved > 0 ? (
                <div>
                  <dt>Already taken off for twos and threes</dt>
                  <dd>{formatPrice(basket.saved)}</dd>
                </div>
              ) : null}
              <div>
                <dt>Postage, duties paid</dt>
                <dd>{basket.postage ? formatPrice(basket.postage) : 'Free'}</dd>
              </div>
              <div className="tw-sum-keep">
                <dt>To pay</dt>
                <dd>
                  <strong>{formatPrice(basket.total)}</strong>
                </dd>
              </div>
            </dl>
            <button type="button" className="tw-btn tw-btn--loud tw-btn--big" onClick={place}>
              Place the order: {formatPrice(basket.total)}
            </button>
            <p className="tw-note" role="status">
              {run
                ? `Ordered in the next ${formatLeft(run)}, it is packed today and arrives ${formatSpan(run.from, run.to)}.`
                : `Packed the day you order if it is in by 4 pm Yiwu time. Arrives ${DELIVERY_DAYS[0]} to ${DELIVERY_DAYS[1]} days later.`}{' '}
              Nothing is charged: this shop is a demonstration.
            </p>
          </aside>
        ) : null}
      </section>

      <section className="tw-shelf" aria-labelledby="tw-near-title">
        <div className="tw-shelf-bar">
          <h2 id="tw-near-title" className="tw-title">
            {basket.count === 0 ? 'The four that sell most' : basket.toFree > 0 ? `Closest to the ${formatPrice(basket.toFree)} you are short of` : 'Also on the shelf'}
          </h2>
        </div>
        <div className="tw-grid">
          {(basket.count === 0 ? [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 4) : nearest).map((product) => (
            <Card key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}

// The trade order sheet, which is also the margin calculator: set what you will sell each line
// for and how it travels, and the sheet says what the order keeps.
function TradeOrder() {
  const { order, setCartons, trade, empty } = useTradewin();
  const [sell, setSell] = useState({});
  const [lane, setLane] = useState('sea');
  const [sent, setSent] = useState(null);
  const freight = FREIGHT.find((entry) => entry.id === lane);

  const rows = Object.entries(order).map(([slug, cartons]) => {
    const product = productBySlug(slug);
    const line = tradeLine(product, cartons);
    const asked = Number.parseFloat(sell[slug]);
    const price = Number.isFinite(asked) && asked > 0 ? asked : product.retail;
    return { product, cartons, line, price, resale: line.units * price };
  });

  const resale = rows.reduce((sum, row) => sum + row.resale, 0);
  const haul = trade.kg * freight.perKg;
  const landed = trade.cost + haul;
  const keep = resale - landed;

  const send = () => {
    setSent({ cartons: trade.cartons, landed, lane: freight });
    empty('order');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  if (sent) {
    return (
      <section className="tw-done" aria-labelledby="tw-bag-title">
        <p className="tw-tag">
          Order TW-W-60431 · {sent.cartons} {sent.cartons === 1 ? 'carton' : 'cartons'} · {formatPrice(sent.landed)} landed
        </p>
        <h1 id="tw-bag-title" className="tw-display">
          Sent to the Yiwu warehouse.
        </h1>
        <p className="tw-lede">
          It would leave in 3 working days and reach {ACCOUNT.place.split(',')[0]} by {sent.lane.name.toLowerCase()} in {sent.lane.days[0]} to{' '}
          {sent.lane.days[1]} days. Nothing was charged and nothing will ship: Tradewin is a demonstration.
        </p>
        <p className="tw-done-act">
          <Link to={pathOf('trade', 'orders')} className="tw-btn tw-btn--loud">
            See it with your other orders
          </Link>
          <Link to={baseOf('trade')} className="tw-btn tw-btn--line">
            Back to the catalogue
          </Link>
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="tw-bag-page" aria-labelledby="tw-bag-title">
        <div className="tw-bag-main">
          <h1 id="tw-bag-title" className="tw-display">
            {rows.length === 0 ? 'No cartons on the order yet.' : `Order sheet: ${trade.cartons} ${trade.cartons === 1 ? 'carton' : 'cartons'}`}
          </h1>

          {rows.length === 0 ? (
            <p className="tw-lede">
              Add a carton of anything from <Link to={baseOf('trade')}>the catalogue</Link>. This sheet then works out what the order keeps at your
              selling prices, with freight taken off.
            </p>
          ) : (
            <ul className="tw-lines tw-lines--trade">
              {rows.map(({ product, cartons, line, price, resale: sells }) => {
                const tier = tierIndex(cartons);
                const next = TIER_FROM[tier + 1];
                const gain = next ? (product.trade[tier] - product.trade[tier + 1]) * product.carton * next : 0;
                return (
                  <li key={product.slug}>
                    <Thumb product={product} side="trade" />
                    <div className="tw-line-what">
                      <h2>
                        <Link to={productPath(product.slug, 'trade')}>{product.name}</Link>
                      </h2>
                      <p className="tw-note">
                        {formatCount(line.units)} units at {formatPrice(line.each)} · {line.kg.toFixed(1)} kg
                      </p>
                      {next ? (
                        <p className="tw-nudge">
                          {next - cartons} more {next - cartons === 1 ? 'carton' : 'cartons'}: <strong>{formatPrice(product.trade[tier + 1])}</strong> a
                          unit, {formatPrice(gain)} less on the line
                        </p>
                      ) : (
                        <p className="tw-nudge">On the lowest price a unit</p>
                      )}
                    </div>
                    <div className="tw-line-qty">
                      <Stepper
                        value={cartons}
                        max={MAX_CARTONS}
                        onChange={(value) => setCartons(product.slug, value)}
                        label={`Cartons of ${product.name}`}
                        unit="carton"
                      />
                      <button type="button" className="tw-link" onClick={() => setCartons(product.slug, 0)}>
                        Remove<span className="tw-hide"> {product.name}</span>
                      </button>
                    </div>
                    <label className="tw-line-sell">
                      <span>You sell at</span>
                      <span className="tw-money">
                        $
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.1"
                          value={sell[product.slug] ?? product.retail.toFixed(2)}
                          onChange={(event) => setSell({ ...sell, [product.slug]: event.target.value })}
                        />
                      </span>
                    </label>
                    <p className="tw-line-sum">
                      {formatPrice(line.cost)}
                      <span>
                        keeps {formatPrice(sells - line.cost)} ({percent(sells > 0 ? (sells - line.cost) / sells : 0)}) at {formatPrice(price)}
                      </span>
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {rows.length > 0 ? (
          <aside className="tw-total" aria-label="What the order keeps">
            <div className="tw-lanes" role="group" aria-label="Freight">
              {FREIGHT.map((entry) => (
                <button key={entry.id} type="button" aria-pressed={entry.id === lane} onClick={() => setLane(entry.id)}>
                  <strong>{entry.name}</strong>
                  <span>
                    {entry.days[0]} to {entry.days[1]} days
                  </span>
                  <em>{formatPrice(trade.kg * entry.perKg)}</em>
                </button>
              ))}
            </div>
            <dl className="tw-sum">
              <div>
                <dt>
                  Goods, {formatCount(trade.units)} units
                </dt>
                <dd>{formatPrice(trade.cost)}</dd>
              </div>
              <div>
                <dt>
                  Freight, {trade.kg.toFixed(1)} kg by {freight.name.toLowerCase()}
                </dt>
                <dd>{formatPrice(haul)}</dd>
              </div>
              <div>
                <dt>Landed cost</dt>
                <dd>{formatPrice(landed)}</dd>
              </div>
              <div>
                <dt>Sells for, at your prices</dt>
                <dd>{formatPrice(resale)}</dd>
              </div>
              <div className="tw-sum-keep">
                <dt>You keep</dt>
                <dd>
                  <strong>{formatPrice(keep)}</strong> {percent(resale > 0 ? keep / resale : 0)} of the sale
                </dd>
              </div>
            </dl>
            <button type="button" className="tw-btn tw-btn--loud tw-btn--big" onClick={send}>
              Send the order: {formatPrice(landed)}
            </button>
            <p className="tw-note">
              Payment is taken on dispatch, 3 working days after the order. Your own postage and marketplace fees are not counted. Nothing is
              charged: this is a demonstration.
            </p>
          </aside>
        ) : null}
      </section>

      {rows.length === 0 ? (
        <section className="tw-shelf" aria-labelledby="tw-near-title">
          <div className="tw-shelf-bar">
            <h2 id="tw-near-title" className="tw-title">
              Running low on your shelf
            </h2>
          </div>
          <div className="tw-grid" data-few="">
            {ACCOUNT.shelf.map(({ slug }) => (
              <Card key={slug} product={productBySlug(slug)} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

export default function Basket() {
  const { side } = useTradewin();
  return (
    <>
      {side === 'trade' ? <TradeOrder /> : <DirectBasket />}
      <p className="tw-aside-flip">
        {side === 'trade' ? 'Buying one, not a carton? ' : 'Buying to resell? '}
        <FlipLink>{side === 'trade' ? 'Open the Direct basket' : 'Open the trade order sheet'}</FlipLink>
      </p>
    </>
  );
}
