import { useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Wordmark } from './Media.jsx';
import { useHoxen } from './hoxenContext.js';
import { BASE, COMPANY, PAGES, pageByKey } from './site.js';

const NAV = PAGES.filter((page) => page.nav);
const CART = pageByKey('cart');

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const { count } = useHoxen();

  // Each page starts at the top with focus on its content, as a full page load would.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById('concept-main')?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="hx min-h-[100dvh]">
      <a
        href="#concept-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-white focus:px-5 focus:py-3"
      >
        Skip to content
      </a>

      <header className="hx-bar">
        <nav aria-label="Main" className="hx-bar-nav">
          {NAV.map((item) => (
            <NavLink key={item.key} to={item.path}>
              {item.nav}
            </NavLink>
          ))}
        </nav>
        <Link to={BASE} className="hx-bar-brand" aria-label={`${COMPANY.name} home`}>
          <Wordmark />
        </Link>
        <NavLink to={CART.path} className="hx-bar-bag" aria-label={`Bag, ${count} ${count === 1 ? 'item' : 'items'}`}>
          Bag
          <span className="hx-bar-count" data-full={count > 0 ? '' : undefined} aria-hidden="true">
            {count}
          </span>
        </NavLink>
      </header>

      <main id="concept-main" tabIndex={-1}>
        {children}
      </main>

      <footer className="hx-foot">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <p className="hx-display hx-h2 max-w-[16ch]">Not sure which one? Tell us what you charge.</p>
          <Link to={pageByKey('compatibility').path} className="hx-btn shrink-0 self-start lg:self-auto">
            Check my devices
          </Link>
        </div>

        <p className="hx-foot-word" aria-hidden="true">
          <Wordmark />
        </p>

        <div className="hx-foot-meta">
          <address className="not-italic">
            <strong className="font-extrabold">{COMPANY.legalName}</strong>
            <br />
            Building 7, Zhigu Innovation Park, Xixiang
            <br />
            Bao’an District, Shenzhen 518102, China
          </address>
          <p>
            Free shipping over $50
            <br />
            30-day returns, 24-month warranty
          </p>
          <nav aria-label="Footer" className="hx-foot-nav">
            {NAV.map((item) => (
              <Link key={item.key} to={item.path}>
                {item.nav}
              </Link>
            ))}
            <Link to={CART.path}>Bag</Link>
          </nav>
        </div>

        <p className="mt-10 max-w-[80ch] text-sm font-medium leading-relaxed">
          Hoxen is a fictional company, created by The Code Consortium as a concept build. Its products, prices and
          test figures are invented, device figures are illustrative, and nothing ordered here is charged or shipped.
        </p>
      </footer>
    </div>
  );
}
