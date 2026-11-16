import { useEffect, useLayoutEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Barcode, Wordmark } from './Media.jsx';
import FlipLink from './FlipLink.jsx';
import { FREE_POSTAGE_FROM, POSTAGE, formatPrice } from './catalog.js';
import { formatLeft, packingRun, useNow } from './clock.js';
import { useTradewin } from './tradewinContext.js';
import { COMPANY, baseOf, pagesOf, pathOf } from './site.js';

const MODES = [
  { side: 'direct', label: 'For myself', note: 'One at a time' },
  { side: 'trade', label: 'To resell', note: 'By the carton' },
];

// The thin strip above the header: three facts that are true today.
function Strip({ side }) {
  const now = useNow();
  if (side === 'trade') {
    return (
      <p className="tw-strip">
        <span>One carton is the minimum</span>
        <span>The price a unit drops at 5 and at 25 cartons</span>
        <span>Air in 6 to 9 days, sea in 32 to 38</span>
      </p>
    );
  }
  return (
    <p className="tw-strip">
      <span>{now ? <>Today&rsquo;s packing run closes in <strong>{formatLeft(packingRun(now))}</strong></> : 'In by 4 pm Yiwu time, packed the same day'}</span>
      <span>Free postage over ${FREE_POSTAGE_FROM}</span>
      <span>Duties paid before it leaves</span>
    </p>
  );
}

export default function Layout({ children }) {
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { side, landed, basket, trade } = useTradewin();
  const pages = pagesOf(side);
  const shop = pages.filter((page) => page.nav === 'shop');
  const help = pages.filter((page) => page.nav === 'help');
  const flipped = Boolean(state?.flipped);
  const query = params.get('q') ?? '';

  // A flip between Direct and Wholesale holds its transition open until the new page is in place.
  useLayoutEffect(() => landed(), [pathname, landed]);

  // Each page starts at the top with focus on its content, as a full page load would.
  // A flip is the exception: you stay where you were, looking at the same thing.
  useEffect(() => {
    if (flipped) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById('concept-main')?.focus({ preventScroll: true });
  }, [pathname, flipped]);

  const onSearch = (event) => {
    event.preventDefault();
    const words = new FormData(event.currentTarget).get('q').trim();
    navigate(words ? `${baseOf(side)}?q=${encodeURIComponent(words)}` : baseOf(side));
  };

  const count = side === 'trade' ? trade.cartons : basket.count;
  const sum = side === 'trade' ? trade.cost : basket.goods;

  return (
    <div className="tw" data-side={side}>
      <a href="#concept-main" className="tw-skip">
        Skip to content
      </a>

      <header className="tw-top">
        <Strip side={side} />

        <div className="tw-head">
          <Link to={baseOf(side)} className="tw-brand" aria-label={`${COMPANY.name} ${side === 'trade' ? 'Wholesale' : 'Direct'} home`}>
            <Wordmark side={side} />
          </Link>

          <form className="tw-search" role="search" onSubmit={onSearch}>
            <label htmlFor="tw-q" className="tw-hide">
              Search the {side === 'trade' ? 'catalogue' : 'shop'}
            </label>
            <input id="tw-q" key={query} name="q" type="search" defaultValue={query} placeholder="Lids, clips, cubes…" autoComplete="off" enterKeyHint="search" />
            <button type="submit">Search</button>
          </form>

          <div className="tw-mode" role="group" aria-label="I am buying">
            <span className="tw-mode-ask" aria-hidden="true">
              I&rsquo;m buying
            </span>
            {MODES.map((mode) =>
              mode.side === side ? (
                <span key={mode.side} className="tw-mode-opt" aria-current="true">
                  <strong>{mode.label}</strong>
                  <span>{mode.note}</span>
                </span>
              ) : (
                <FlipLink key={mode.side} className="tw-mode-opt">
                  <strong>{mode.label}</strong>
                  <span>{mode.note}</span>
                </FlipLink>
              ),
            )}
          </div>

          <NavLink to={pathOf(side, 'basket')} className="tw-bag" data-full={count > 0 ? '' : undefined}>
            <span className="tw-bag-count" aria-hidden="true">
              {count}
            </span>
            <span>
              <strong>{side === 'trade' ? 'Order sheet' : 'Basket'}</strong>
              <span>
                {side === 'trade'
                  ? `${count} ${count === 1 ? 'carton' : 'cartons'}${count ? `, ${formatPrice(sum)}` : ''}`
                  : `${count} ${count === 1 ? 'item' : 'items'}${count ? `, ${formatPrice(sum)}` : ''}`}
              </span>
            </span>
          </NavLink>
        </div>

        <nav aria-label="Main" className="tw-cats">
          {shop.map((page) => (
            <NavLink key={page.key} to={page.path} end>
              {page.label}
            </NavLink>
          ))}
          <span className="tw-cats-gap" aria-hidden="true" />
          {help.map((page) => (
            <NavLink key={page.key} to={page.path} end>
              {page.label}
            </NavLink>
          ))}
        </nav>
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
                ? `By air in 6 to 9 days or by sea in 32 to 38, to any of ${COMPANY.countries} countries.`
                : `In 7 to 12 days, tracked. Postage ${formatPrice(POSTAGE)}, free over $${FREE_POSTAGE_FROM}.`}
            </p>
          </div>
          <nav aria-label="Footer" className="tw-label-nav">
            <p className="tw-tag">Contents</p>
            {[...shop, ...help].map((page) => (
              <Link key={page.key} to={page.path}>
                {page.label}
              </Link>
            ))}
            <FlipLink>{side === 'trade' ? 'This page on Tradewin Direct' : 'This page at carton prices'}</FlipLink>
          </nav>
          <div className="tw-label-code">
            <Barcode />
            <p>TW 4471 9026 0318 CN</p>
          </div>
          <p className="tw-label-small">
            Tradewin is a fictional company, created by The Code Consortium as a concept build. Its products, prices,
            stock figures, ratings, reseller account and reviews are invented, and nothing ordered here is charged or shipped.
          </p>
        </div>
      </footer>
    </div>
  );
}
