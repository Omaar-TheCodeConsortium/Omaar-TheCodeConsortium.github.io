import { useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BASE, COMPANY, PAGES, pageByKey } from './site.js';
import { Mark } from './drawings.jsx';

const NAV = PAGES.filter((page) => page.nav && page.key !== 'quote');
const QUOTE = pageByKey('quote');

export default function Layout({ children }) {
  const { pathname } = useLocation();

  // Each page starts at the top with focus on its content, as a full page load would.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById('concept-main')?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="gs min-h-[100dvh]">
      <a
        href="#concept-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-white focus:px-4 focus:py-3 focus:text-[color:var(--gs-ink)]"
      >
        Skip to content
      </a>

      {/* One header: a rail down the left edge on wide screens, a top bar and a tab bar on narrow ones. */}
      <header className="gs-rail">
        <Link to={BASE} className="gs-rail-brand" aria-label={`${COMPANY.name} home`}>
          <Mark size={34} />
          <span className="gs-rail-name">
            Grandstar <span>Precision</span>
          </span>
        </Link>

        <nav aria-label="Main" className="gs-rail-nav">
          {NAV.map((item, index) => (
            <NavLink key={item.key} to={item.path}>
              <span className="gs-rail-no" aria-hidden="true">
                0{index + 1}
              </span>
              {item.nav}
            </NavLink>
          ))}
        </nav>

        <span className="gs-rail-scale" aria-hidden="true">
          <span className="gs-rail-index" />
        </span>

        <NavLink to={QUOTE.path} className="gs-rail-quote">
          Price a part
        </NavLink>
      </header>

      <main id="concept-main" tabIndex={-1} className="gs-main">
        <p className="gs-wordmark" aria-hidden="true">
          Grandstar <span>Precision</span>
        </p>
        {children}
      </main>

      <footer className="gs-foot gs-on-deep">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <p className="gs-display gs-h2 max-w-[17ch]">Send a drawing. Get a DFM report in 48 hours.</p>
          <Link to={QUOTE.path} className="gs-btn gs-btn--primary shrink-0 self-start lg:self-auto">
            Price a part now
          </Link>
        </div>

        <p className="gs-foot-word" aria-hidden="true">
          Grandstar <span>Precision</span>
        </p>

        <div className="gs-foot-meta">
          <address className="not-italic">
            <strong className="font-semibold text-white">{COMPANY.legalName}</strong>
            <br />
            Building 4, Jinsha Industrial Park
            <br />
            Chang’an Town, Dongguan 523850, Guangdong, China
          </address>
          <p>
            Monday to Saturday
            <br />
            08:00 to 18:00 (UTC+8)
          </p>
          <nav aria-label="Footer" className="gs-foot-nav">
            {PAGES.filter((item) => item.nav).map((item) => (
              <Link key={item.key} to={item.path}>
                {item.nav}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-10 max-w-[80ch] text-sm leading-relaxed text-[color:var(--gs-steel)]">
          Grandstar Precision is a fictional company, created by The Code Consortium as a concept build. Its plant,
          people, customers and figures are invented, and no enquiry sent from this site goes anywhere.
        </p>
      </footer>
    </div>
  );
}
