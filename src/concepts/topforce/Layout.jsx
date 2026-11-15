import { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { PlateFace, Wordmark } from './Media.jsx';
import { CATEGORIES, FREE_FREIGHT_FROM, formatKg } from './catalog.js';
import { useTopforce } from './topforceContext.js';
import { BASE, COMPANY, categoryPath, pageByKey } from './site.js';

const BUILD = pageByKey('build');
const CART = pageByKey('cart');
const SHORT = { racks: 'Racks' };

export default function Layout({ children }) {
  const { pathname, hash } = useLocation();
  const { kg, count } = useTopforce();
  const foot = useRef(null);

  // Each page starts at the top with focus on its content, as a full page load would.
  // A link to a category lands on that category instead.
  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) {
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById('concept-main')?.focus({ preventScroll: true });
  }, [pathname, hash]);

  // The plate at the foot of the page rolls as it comes into view.
  useEffect(() => {
    const el = foot.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const seen = window.innerHeight - el.getBoundingClientRect().top;
      if (seen > 0) el.style.setProperty('--roll', `${(seen * 0.12).toFixed(1)}deg`);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="tf min-h-[100dvh]">
      <a
        href="#concept-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-[#d4f000] focus:px-5 focus:py-3 focus:font-bold focus:text-[#121212]"
      >
        Skip to content
      </a>

      <header className="tf-top">
        <Link to={BASE} className="tf-top-brand" aria-label={`${COMPANY.name} home`}>
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="tf-top-nav">
          {CATEGORIES.map((category) => (
            <Link key={category.id} to={categoryPath(category.id)}>
              {SHORT[category.id] ?? category.name}
            </Link>
          ))}
          <NavLink to={BUILD.path}>{BUILD.nav}</NavLink>
        </nav>
        <NavLink
          to={CART.path}
          className="tf-top-cart"
          aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}, ${formatKg(kg)} kilograms`}
        >
          Cart
          <span className="tf-top-kg" data-full={count > 0 ? '' : undefined} aria-hidden="true">
            {formatKg(kg)} kg
          </span>
        </NavLink>
      </header>

      <main id="concept-main" tabIndex={-1}>
        {children}
      </main>

      <footer ref={foot} className="tf-foot">
        <div className="tf-foot-plate" aria-hidden="true">
          <PlateFace />
        </div>

        <div className="tf-foot-body">
          <p className="tf-foot-call">
            Know your number?
            <br />
            <Link to={BUILD.path}>Build the set</Link>
          </p>

          <nav aria-label="Footer" className="tf-foot-nav">
            {CATEGORIES.map((category) => (
              <Link key={category.id} to={categoryPath(category.id)}>
                {category.name}
              </Link>
            ))}
            <Link to={BUILD.path}>{BUILD.nav}</Link>
            <Link to={CART.path}>Cart</Link>
          </nav>

          <div className="tf-foot-meta">
            <address className="not-italic">
              <strong>{COMPANY.legalName}</strong>
              <br />
              88 Jianghai Avenue, Development Area
              <br />
              Nantong 226009, Jiangsu, China
            </address>
            <p>
              <strong>Stock held in</strong>
              <br />
              Los Angeles, California
              <br />
              Rotterdam, Netherlands
            </p>
            <p>
              <strong>Terms</strong>
              <br />
              Free freight over ${FREE_FREIGHT_FROM}
              <br />
              30-day returns, freight refunded
            </p>
          </div>

          <p className="tf-foot-small">
            Topforce Sports is a fictional company, created by The Code Consortium as a concept build. Its products,
            prices, test figures and reviews are invented, and nothing ordered here is charged or shipped.
          </p>
        </div>
      </footer>
    </div>
  );
}
