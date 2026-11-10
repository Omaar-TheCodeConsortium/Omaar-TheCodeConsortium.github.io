import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Fabric, Swatches } from './Fabric.jsx';
import { TEXTURES } from './textures.js';
import { dyeById } from './products.js';
import { useSunloom } from './sunloomContext.js';
import { BASE, COMPANY, PAGES } from './site.js';

const NAV = PAGES.filter((page) => ['collection', 'mill', 'wholesale'].includes(page.key));
const CART_PATH = `${BASE}cart/`;

// `tone`: 'ink' where the page opens on a pale photograph, so the header stays dark.
// `over`: where the page opens on fabric ('all', or 'start' for the left half only),
// so the header there is set in the dye's text colour.
export default function Layout({ over, tone, children }) {
  const { pathname } = useLocation();
  const { dye, setDye, count } = useSunloom();
  const [menuOpen, setMenuOpen] = useState(false);
  const [docked, setDocked] = useState(false);
  const rootRef = useRef(null);
  const menuButtonRef = useRef(null);
  const closeRef = useRef(null);
  const current = dyeById(dye);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById('concept-main')?.focus({ preventScroll: true });
  }, [pathname]);

  // The header scrolls away with the page; past that point the dock takes over.
  useEffect(() => {
    const onScroll = () => setDocked(window.scrollY > 320);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // The sheen on every fabric field follows the pointer, as light would across cloth.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return undefined;
    let frame = 0;
    const onMove = (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty('--mx', `${((event.clientX / window.innerWidth) * 100).toFixed(1)}%`);
        root.style.setProperty('--my', `${((event.clientY / window.innerHeight) * 100).toFixed(1)}%`);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const opener = menuButtonRef.current;
    closeRef.current?.focus();
    const onKey = (event) => event.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      opener?.focus();
    };
  }, [menuOpen]);

  const bagLabel = `Bag (${count})`;

  return (
    <div
      ref={rootRef}
      className="sl"
      style={{ ...TEXTURES, '--dye': current.hex, '--on-dye': current.on }}
    >
      <a
        href="#concept-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-white focus:px-4 focus:py-3 focus:text-black"
      >
        Skip to content
      </a>

      <header className="sl-head" data-over={over} data-tone={tone}>
        <nav aria-label="Main">
          {NAV.map((item) => (
            <Link key={item.key} to={item.path} className="sl-link" aria-current={pathname.startsWith(item.path) ? 'page' : undefined}>
              {item.nav}
            </Link>
          ))}
        </nav>
        <button type="button" className="sl-menu-open sl-link" ref={menuButtonRef} onClick={() => setMenuOpen(true)}>
          Menu
        </button>
        <Link to={BASE} className="sl-wordmark" aria-label={`${COMPANY.name} home`}>
          Sunloom
        </Link>
        <div className="sl-head-end">
          <Link to={CART_PATH} className="sl-link">
            {bagLabel}
          </Link>
        </div>
      </header>

      <div className="sl-dock" data-shown={docked && !menuOpen} aria-hidden={!docked}>
        <Link to={BASE} className="sl-dock-mark" tabIndex={docked ? 0 : -1} aria-label={`${COMPANY.name} home`}>
          Sunloom
        </Link>
        <button type="button" tabIndex={docked ? 0 : -1} onClick={() => setMenuOpen(true)}>
          Menu
        </button>
        <Link to={CART_PATH} tabIndex={docked ? 0 : -1}>
          {bagLabel}
        </Link>
      </div>

      {menuOpen && (
        <Fabric variant="deep" className="sl-menu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex items-center justify-between">
            <span className="sl-wordmark">Sunloom</span>
            <button type="button" ref={closeRef} className="sl-link min-h-[44px]" onClick={() => setMenuOpen(false)}>
              Close
            </button>
          </div>
          <nav aria-label="Menu" className="sl-menu-links sl-display">
            {[...NAV, { key: 'cart', path: CART_PATH, nav: bagLabel }].map((item) => (
              <Link key={item.key} to={item.path} onClick={() => setMenuOpen(false)}>
                {item.nav}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <Swatches value={dye} onPick={setDye} label="Dye the site" />
            <span className="sl-small">Dyed in {current.name}</span>
          </div>
        </Fabric>
      )}

      <main id="concept-main" tabIndex={-1}>
        {children}
      </main>

      <Fabric variant="deep" className="sl-foot">
        <footer>
          <div className="sl-foot-top">
            <p className="sl-serif max-w-[22ch] text-[clamp(1.5rem,2.6vw,2.8rem)]">
              Washed linen from our own looms in Keqiao, since {COMPANY.founded}.
            </p>
            <nav aria-label="Footer" className="grid content-start gap-1">
              {NAV.map((item) => (
                <Link key={item.key} to={item.path} className="sl-link w-fit">
                  {item.nav}
                </Link>
              ))}
              <Link to={CART_PATH} className="sl-link w-fit">
                {bagLabel}
              </Link>
            </nav>
            <div className="grid content-start gap-3">
              <span className="sl-small">Dye the site</span>
              <Swatches value={dye} onPick={setDye} label="Dye the site" />
            </div>
          </div>

          <span className="sl-foot-mark" aria-hidden="true">
            Sunloom
          </span>

          <div className="sl-foot-legal sl-small">
            <span>{COMPANY.legalName}</span>
            <span>{COMPANY.address}</span>
            <span className="basis-full max-w-[90ch]">
              Sunloom International is a fictional company, created by The Code Consortium as a concept build. Its
              products, prices and reviews are invented, and nothing can be bought or sent from this site.
            </span>
          </div>
        </footer>
      </Fabric>
    </div>
  );
}
