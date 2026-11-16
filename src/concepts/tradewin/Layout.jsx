import { useEffect, useLayoutEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Barcode, Wordmark } from './Media.jsx';
import { FREE_POSTAGE_FROM, POSTAGE, formatPrice } from './catalog.js';
import { useTradewin } from './tradewinContext.js';
import { COMPANY, DIRECT, DIRECT_PAGES, TRADE, TRADE_PAGES, baseOf, pageByKey, twinOf } from './site.js';

const TABS = [
  { side: 'direct', label: 'Direct', note: 'One at a time' },
  { side: 'trade', label: 'Wholesale', note: 'By the carton' },
];

const plain = (event) => event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

export default function Layout({ children }) {
  const { pathname, state } = useLocation();
  const { side, flip, landed, basket, trade } = useTradewin();
  const pages = (side === 'trade' ? TRADE_PAGES : DIRECT_PAGES).filter((page) => page.nav);
  const basketPage = pageByKey(side, side === 'trade' ? 'order' : 'basket');
  const flipped = Boolean(state?.flipped);

  // A flip between Direct and Wholesale holds its transition open until the new page is in place.
  useLayoutEffect(() => landed(), [pathname, landed]);

  // Each page starts at the top with focus on its content, as a full page load would.
  // A flip is the exception: you stay where you were, looking at the same thing.
  useEffect(() => {
    if (flipped) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById('concept-main')?.focus({ preventScroll: true });
  }, [pathname, flipped]);

  const onFlip = (event) => {
    if (!plain(event)) return;
    event.preventDefault();
    flip();
  };

  const summary =
    side === 'trade'
      ? `Order: ${trade.cartons} ${trade.cartons === 1 ? 'carton' : 'cartons'}`
      : `Basket: ${basket.count}${basket.count ? `, ${formatPrice(basket.goods)}` : ''}`;
  const full = side === 'trade' ? trade.cartons > 0 : basket.count > 0;

  return (
    <div className="tw" data-side={side}>
      <a href="#concept-main" className="tw-skip">
        Skip to content
      </a>

      <header className="tw-top">
        <div className="tw-band">
          <div className="tw-tabs" role="group" aria-label="Buying as">
            {TABS.map((tab) =>
              tab.side === side ? (
                <Link key={tab.side} to={baseOf(tab.side)} className="tw-tab" aria-current="true">
                  <strong>{tab.label}</strong>
                  <span>{tab.note}</span>
                </Link>
              ) : (
                <Link key={tab.side} to={twinOf(pathname)} className="tw-tab" onClick={onFlip}>
                  <strong>{tab.label}</strong>
                  <span>{tab.note}</span>
                </Link>
              ),
            )}
          </div>
          <Link to={baseOf(side)} className="tw-brand" aria-label={`${COMPANY.name} ${side === 'trade' ? 'Wholesale' : 'Direct'} home`}>
            <Wordmark />
          </Link>
        </div>

        <div className="tw-bar">
          <nav aria-label="Main" className="tw-nav">
            {pages.map((page) => (
              <NavLink key={page.key} to={page.path} end>
                {page.nav}
              </NavLink>
            ))}
          </nav>
          {basketPage ? (
            <NavLink to={basketPage.path} className="tw-count" data-full={full ? '' : undefined}>
              {summary}
            </NavLink>
          ) : (
            <span className="tw-count" data-full={full ? '' : undefined} role="status">
              {summary}
            </span>
          )}
        </div>
      </header>

      <main id="concept-main" tabIndex={-1}>
        {children}
      </main>

      <footer className="tw-foot">
        <div className="tw-label">
          <div className="tw-label-from">
            <p className="tw-tag">From</p>
            <address>
              <strong>{COMPANY.legalName}</strong>
              <br />
              {COMPANY.address[0]}
              <br />
              {COMPANY.address[1]}
            </address>
          </div>
          <div className="tw-label-to">
            <p className="tw-tag">To</p>
            <p className="tw-label-you">{side === 'trade' ? 'Your stockroom' : 'Your front door'}</p>
            <p>
              {side === 'trade'
                ? 'By air in 6 to 9 days or by sea in 32 to 38, to any of 41 countries.'
                : `In 7 to 12 days, tracked. Postage ${formatPrice(POSTAGE)}, free over $${FREE_POSTAGE_FROM}.`}
            </p>
          </div>
          <nav aria-label="Footer" className="tw-label-nav">
            <p className="tw-tag">Contents</p>
            {pages.map((page) => (
              <Link key={page.key} to={page.path}>
                {page.nav}
              </Link>
            ))}
            <Link to={side === 'trade' ? DIRECT : TRADE}>{side === 'trade' ? 'Tradewin Direct, the shop' : 'Tradewin Wholesale, for resellers'}</Link>
          </nav>
          <div className="tw-label-code">
            <Barcode />
            <p>TW 4471 9026 0318 CN</p>
          </div>
          <p className="tw-label-small">
            Tradewin is a fictional company, created by The Code Consortium as a concept build. Its products, prices,
            stock figures, reseller account and reviews are invented, and nothing ordered here is charged or shipped.
          </p>
        </div>
      </footer>
    </div>
  );
}
