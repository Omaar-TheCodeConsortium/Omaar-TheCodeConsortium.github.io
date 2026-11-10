import { useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BASE, COMPANY, PAGES, pageByKey } from './site.js';
import { Mark } from './drawings.jsx';

const NAV = PAGES.filter((page) => page.nav && page.key !== 'quote');
const QUOTE = pageByKey('quote');

export default function Layout({ page, children }) {
  const { pathname } = useLocation();

  // Each page starts at the top with focus on its content, as a full page load would.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById('concept-main')?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="gs flex min-h-[100dvh] flex-col">
      <a
        href="#concept-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-white focus:px-4 focus:py-3"
      >
        Skip to content
      </a>

      <header className="gs-header">
        <div className="gs-wrap flex items-center justify-between gap-6 py-2">
          <Link to={BASE} className="flex min-h-[44px] items-center gap-3" aria-label={`${COMPANY.name} home`}>
            <Mark />
            <span className="text-[1.05rem] font-semibold leading-none tracking-[-0.01em]">
              Grandstar <span className="font-normal">Precision</span>
            </span>
          </Link>

          <nav aria-label="Main" className="gs-nav hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <NavLink key={item.key} to={item.path}>
                {item.nav}
              </NavLink>
            ))}
          </nav>

          <Link to={QUOTE.path} className="gs-btn gs-btn--primary">
            Get a quote
          </Link>
        </div>

        <nav aria-label="Sections" className="gs-nav gs-nav-scroll border-t border-[color:var(--gs-line)] lg:hidden">
          <div className="gs-wrap flex gap-7">
            {NAV.map((item) => (
              <NavLink key={item.key} to={item.path}>
                {item.nav}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main id="concept-main" tabIndex={-1} className="flex-1">
        {children}
      </main>

      <footer className="bg-[var(--gs-ink)] text-white">
        <div className="gs-wrap grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
          <div>
            <p className="max-w-[20ch] text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.1] tracking-[-0.015em]">
              Send a drawing. Get a DFM report in 48 hours.
            </p>
            <Link to={QUOTE.path} className="gs-btn gs-btn--light mt-7">
              Price a part now
            </Link>
          </div>

          <nav aria-label="Footer">
            <p className="gs-label !text-white/60">Site</p>
            <ul className="mt-3 grid gap-1">
              {PAGES.filter((item) => item.nav).map((item) => (
                <li key={item.key}>
                  <Link to={item.path} className="inline-flex min-h-[36px] items-center hover:underline">
                    {item.nav}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="gs-label !text-white/60">Works</p>
            <address className="mt-3 not-italic leading-relaxed text-white/85">
              {COMPANY.legalName}
              <br />
              Building 4, Jinsha Industrial Park
              <br />
              Chang’an Town, Dongguan 523850
              <br />
              Guangdong, China
            </address>
            <p className="mt-4 text-white/85">Monday to Saturday, 08:00 to 18:00 (UTC+8)</p>
          </div>
        </div>

        <div className="gs-wrap pb-28">
          <dl className="gs-titleblock">
            <div>
              <dt>Title</dt>
              <dd>{page.drawingTitle}</dd>
            </div>
            <div>
              <dt>Drawing no.</dt>
              <dd>GSP-WEB-{String(page.sheet).padStart(3, '0')}</dd>
            </div>
            <div>
              <dt>Sheet</dt>
              <dd>
                {page.sheet} of {PAGES.length}
              </dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>2026-11</dd>
            </div>
            <div>
              <dt>Rev</dt>
              <dd>C</dd>
            </div>
            <div>
              <dt>Scale</dt>
              <dd>1:1</dd>
            </div>
          </dl>
          <p className="mt-6 max-w-[80ch] text-sm leading-relaxed text-white/70">
            Grandstar Precision is a fictional company, created by The Code Consortium as a concept build. Its plant,
            people, customers and figures are invented, and no enquiry sent from this site goes anywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}
