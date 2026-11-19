import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Fill from '../components/Fill.jsx';
import { BUTTON_DARK, BUTTON_LIGHT, ExternalLink, LABEL, Phone, Screen, Stage, TEXT_LINK } from '../components/ProductBits.jsx';
import SpearPreview from '../components/SpearPreview.jsx';
import { COMPANY, FOUNDERS, FOUNDER_NOTE, LAB, PRODUCTS, TIMELINE } from '../company.js';
import { LISTED } from '../concepts/registry.js';
import { usePortal } from '../concepts/portal/portalContext.js';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MOTTO = 'Software built to solve, not just run.';
const FRAME = 'max-w-screen-2xl mx-auto border-l border-r border-gray-300 bg-white scroll-mt-20';
const DOTS = 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]';
const PAD = 'px-6 py-20 md:px-16 md:py-28';
const H2 = 'text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl';
const MOTION = '(prefers-reduced-motion: no-preference)';

const SECTIONS = [
  { id: 'hero', label: 'The Code Consortium' },
  { id: 'products', label: 'Products' },
  { id: 'approach', label: 'How we build' },
  { id: 'lab', label: 'Lab' },
  { id: 'concepts', label: 'Concept builds' },
  { id: 'journey', label: 'So far' },
  { id: 'people', label: 'People' },
  { id: 'contact', label: 'Contact' },
];

function Gap() {
  return <div aria-hidden="true" className="h-16 w-full border-b border-t border-gray-300 bg-gray-50 md:h-24" />;
}

function Heading({ label, title, id, children, dark = false }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-end" data-reveal>
      <div>
        <p className={`${LABEL} mb-5 ${dark ? 'text-gray-400' : ''}`}>{label}</p>
        <h2 id={id} className={H2}>
          {title}
        </h2>
      </div>
      {children ? <p className={`max-w-xl md:text-lg ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{children}</p> : null}
    </div>
  );
}

function ScrollTracker() {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: '-50% 0px -50% 0px' },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Sections" className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-5 pr-4 xl:flex">
      {SECTIONS.map(({ id, label }) => (
        <a key={id} href={`#${id}`} className="group relative flex items-center justify-end py-1" aria-current={active === id ? 'true' : undefined}>
          <span className="pointer-events-none absolute right-7 translate-x-2 whitespace-nowrap border border-gray-300 bg-white px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest opacity-0 shadow-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100">
            {label}
          </span>
          <span className={`h-[2px] transition-all duration-300 ${active === id ? 'w-6 bg-black' : 'w-4 bg-gray-300 group-hover:bg-black'}`} />
        </a>
      ))}
    </nav>
  );
}

// ---------------------------------------------------------------- Hero

function Hero() {
  const scope = useRef(null);

  // The words rise out of their lines, then the rest follows. index.html hides the block
  // (only when motion is allowed and scripts run) until this has set it up.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.set('[data-intro]', { opacity: 1 });
        gsap
          .timeline({ defaults: { ease: 'power4.out' } })
          .from('[data-word]', { yPercent: 115, duration: 1.1, stagger: 0.07 })
          .from('[data-intro-after]', { y: 18, opacity: 0, duration: 0.9, stagger: 0.1 }, '-=0.7');
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section id="hero" ref={scope} aria-labelledby="home-title" className={`${FRAME} relative overflow-hidden`}>
      <div aria-hidden="true" className={`absolute inset-0 opacity-70 ${DOTS}`} />
      <div data-intro className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-20 pt-20 text-center md:pb-28 md:pt-32">
        <Link
          to="/products/tea-os/"
          data-intro-after
          className="group relative mb-10 inline-flex overflow-hidden rounded-full bg-gray-300 p-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          <span
            aria-hidden="true"
            className="absolute inset-[-200%] animate-[spin_4s_linear_infinite] motion-reduce:animate-none"
            style={{ background: 'conic-gradient(from 0deg, transparent 70%, #000 100%)' }}
          />
          <span className="relative z-10 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 font-mono text-xs uppercase tracking-widest text-gray-600 transition-colors group-hover:text-black">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-black" />
            Spear Tea OS is out now
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </Link>

        <h1 id="home-title" className="text-[2.9rem] font-extrabold leading-[1.02] tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
          {MOTTO.split(' ').map((word, index) => (
            <span key={index} className="inline-block overflow-hidden pb-[0.1em] align-top">
              <span data-word className="inline-block">
                {word}
              </span>
              {index < MOTTO.split(' ').length - 1 ? ' ' : null}
            </span>
          ))}
        </h1>

        <p data-intro-after className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl">
          {COMPANY.name} builds and runs its own software. Each product is made for the industry it serves, and every one of them is ours.
        </p>
        <div data-intro-after className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <a className={BUTTON_DARK} href="#products">
            See our products
          </a>
          <a className={BUTTON_LIGHT} href="#people">
            Meet the founders
          </a>
        </div>
      </div>
      <ProductWall />
    </section>
  );
}

// Real screens from everything we have built, drifting past in two rows. Each picture is made
// at the exact heights it is shown at (public/wall/<id>-h<height>.webp), so the browser never
// has to shrink a large screenshot on the fly: shrinking it while it moves is what shimmers.
const WALL = [
  [
    { id: 'tccos-command', ratio: 454 / 224, name: 'TCCOS', what: 'Command centre' },
    { id: 'tea-home', ratio: 101 / 218, name: 'Spear Tea OS', what: 'Open tabs', phone: true },
    { id: 'tccos-rota', ratio: 457 / 224, name: 'TCCOS', what: 'Master rota' },
    { id: 'salon-warehouse', ratio: 496 / 224, name: 'Bespoke Salon', what: 'Retail stock' },
    { id: 'tea-close', ratio: 101 / 218, name: 'Spear Tea OS', what: 'Closing a tab', phone: true },
  ],
  [
    { id: 'tccos-transport', ratio: 456 / 224, name: 'TCCOS', what: 'Staff transport' },
    { id: 'bakery-notifications', ratio: 472 / 224, name: 'BakeryOS', what: 'Shift alerts' },
    { id: 'tea-tab', ratio: 101 / 218, name: 'Spear Tea OS', what: 'A tab', phone: true },
    { id: 'tccos-hierarchy', ratio: 454 / 224, name: 'TCCOS', what: 'Organisation chart' },
    { id: 'salon-services', ratio: 493 / 224, name: 'Bespoke Salon', what: 'Treatments' },
  ],
];

const WALL_HEIGHTS = [144, 224, 288, 448];

function WallTile({ tile, hidden }) {
  // A phone sits inside a 3 px frame, so its picture is 6 px shorter than the tile.
  const inner = (height) => (tile.phone ? height - 6 : height);
  const widthAt = (height) => Math.round(inner(height) * tile.ratio);
  return (
    <figure className="m-0 flex shrink-0 flex-col gap-2" aria-hidden={hidden || undefined}>
      <span
        className={`block h-[var(--h)] overflow-hidden bg-white/5 [--h:9rem] md:[--h:14rem] ${tile.phone ? 'rounded-[1.25rem] border-[3px] border-white/20' : 'rounded-md outline outline-1 -outline-offset-1 outline-white/15'}`}
        style={{ width: tile.phone ? `calc((var(--h) - 6px) * ${tile.ratio} + 6px)` : `calc(var(--h) * ${tile.ratio})` }}
      >
        <img
          src={`/wall/${tile.id}-h224.webp`}
          srcSet={WALL_HEIGHTS.map((height) => `/wall/${tile.id}-h${height}.webp ${widthAt(height)}w`).join(', ')}
          sizes={`(min-width: 768px) ${widthAt(224)}px, ${widthAt(144)}px`}
          alt=""
          width={widthAt(224)}
          height={inner(224)}
          loading="lazy"
          decoding="async"
          className="block h-full w-full object-cover object-left-top [backface-visibility:hidden]"
        />
      </span>
      <figcaption className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
        <span className="text-gray-300">{tile.name}</span> · {tile.what}
      </figcaption>
    </figure>
  );
}

function ProductWall() {
  const scope = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const rows = gsap.utils.toArray('[data-row]');
        const tweens = rows.map((row, index) =>
          gsap.fromTo(row, { xPercent: index ? -50 : 0 }, { xPercent: index ? 0 : -50, duration: 70 + index * 12, ease: 'none', repeat: -1 }),
        );
        // Slow right down while someone is looking at a screen.
        const slow = () => tweens.forEach((tween) => gsap.to(tween, { timeScale: 0.15, duration: 0.6 }));
        const resume = () => tweens.forEach((tween) => gsap.to(tween, { timeScale: 1, duration: 0.6 }));
        scope.current.addEventListener('pointerenter', slow);
        scope.current.addEventListener('pointerleave', resume);
        return () => {
          scope.current?.removeEventListener('pointerenter', slow);
          scope.current?.removeEventListener('pointerleave', resume);
        };
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className="relative overflow-hidden border-t border-gray-300 bg-black py-10 md:py-14" role="region" aria-label="Screens from our products">
      <div className="flex flex-col gap-6 md:gap-8">
        {WALL.map((row, rowIndex) => (
          <div key={rowIndex} data-row className="flex w-max gap-4 pr-4 [will-change:transform] md:gap-6 md:pr-6">
            {[...row, ...row].map((tile, index) => (
              <WallTile key={index} tile={tile} hidden={index >= row.length} />
            ))}
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent md:w-40" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent md:w-40" />
    </div>
  );
}

// ---------------------------------------------------------------- Products

function ProductVisual({ product }) {
  if (product.preview) return <SpearPreview />;
  if (product.slug === 'tea-os') {
    return (
      <span className="flex items-end justify-center gap-3 md:gap-5">
        {product.shots.map((shot, index) => (
          <Phone key={shot.src} shot={shot} className={`w-[30%] max-w-[210px] ${index === 1 ? 'mb-8' : ''}`} />
        ))}
      </span>
    );
  }
  if (product.shots.length > 1) {
    return (
      <span className="relative block pb-[12%] pr-[10%]">
        <span className="absolute bottom-0 right-0 w-[78%] opacity-90">
          <Screen shot={product.shots[1]} label="" />
        </span>
        <span className="relative block w-[90%]">
          <Screen shot={product.shots[0]} label="" />
        </span>
      </span>
    );
  }
  return <Screen shot={product.shots[0]} label={`${product.name} screenshot from the pilot build`} />;
}

function ProductLinks({ product }) {
  return (
    <p className="flex flex-wrap items-center gap-x-8 gap-y-4">
      {product.app ? (
        <ExternalLink className={BUTTON_DARK} href={product.app}>
          Open the app
        </ExternalLink>
      ) : null}
      <Link className={TEXT_LINK} to={product.path}>
        About {product.name} →
      </Link>
      {product.site ? (
        <ExternalLink className={TEXT_LINK} href={product.site}>
          {product.siteLabel}
        </ExternalLink>
      ) : null}
      {product.demo ? (
        <Link className={TEXT_LINK} to={product.demo}>
          See an early build →
        </Link>
      ) : null}
    </p>
  );
}

function Products() {
  const scope = useRef(null);
  const [active, setActive] = useState(0);

  // On wide screens the picture stays put while the chapters scroll past it.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        gsap.utils.toArray('[data-chapter]').forEach((chapter, index) => {
          ScrollTrigger.create({ trigger: chapter, start: 'top center', end: 'bottom center', onToggle: (self) => self.isActive && setActive(index) });
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  const industries = [...new Set(PRODUCTS.map((product) => product.industry))];

  return (
    <section id="products" ref={scope} aria-labelledby="products-title" className={FRAME}>
      <div className={`${PAD} border-b border-gray-300`}>
        <Heading label="Products" id="products-title" title={`${PRODUCTS.length} products, ${industries.length} industries`}>
          Each one has its own name and its own customers. All of them are designed, built and run here.
        </Heading>
      </div>

      <div className="lg:grid lg:grid-cols-2">
        <ol>
          {PRODUCTS.map((product, index) => (
            <li
              key={product.slug}
              data-chapter
              aria-labelledby={`product-${product.slug}`}
              className={`flex flex-col justify-center gap-6 border-b border-gray-300 px-6 py-16 transition-opacity duration-500 md:px-16 lg:min-h-[85vh] lg:border-r ${
                active === index ? 'lg:opacity-100' : 'lg:opacity-35'
              }`}
            >
              <p className={`${LABEL} flex items-center gap-3`}>
                <span className="text-black">{String(index + 1).padStart(2, '0')}</span>
                <span aria-hidden="true" className="h-px w-8 bg-gray-300" />
                {product.industry}
              </p>
              <Stage product={product} />
              <h3 id={`product-${product.slug}`} className="text-5xl font-bold tracking-tighter md:text-7xl">
                {product.name}
              </h3>
              <p className="max-w-lg text-xl leading-snug text-gray-700 md:text-2xl">{product.line}</p>
              <ul className="flex flex-wrap gap-2" aria-label="In short">
                {product.tags.map((tag) => (
                  <li key={tag} className="rounded-full border border-gray-300 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-gray-600">
                    {tag}
                  </li>
                ))}
              </ul>
              <div className={`my-4 -mx-6 px-6 py-10 md:-mx-16 md:px-16 lg:hidden ${DOTS}`}>
                <ProductVisual product={product} />
              </div>
              <ProductLinks product={product} />
            </li>
          ))}
        </ol>
        <div className={`relative hidden border-b border-gray-300 lg:block ${DOTS}`}>
          <div className="sticky top-20 flex h-[calc(100vh-5rem)] items-center justify-center p-12 xl:p-16">
            {PRODUCTS.map((product, index) => (
              <div
                key={product.slug}
                aria-hidden={active !== index}
                className={`absolute inset-12 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] xl:inset-16 ${
                  active === index ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-6 scale-[0.97] opacity-0'
                }`}
              >
                <div className="w-full">
                  <ProductVisual product={product} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- How we build

const APPROACH = [
  {
    title: 'Ours, end to end.',
    text: 'We write every product, own the code, host it and answer the support line.',
    icon: <path d="M8 8h32v32H8z M16 16h16v16H16z" pathLength="1" />,
  },
  {
    title: 'Each product stands alone.',
    text: 'Its own name, its own site and its own customers, built by one team.',
    icon: <path d="M6 30h14v12H6z M28 6h14v12H28z M20 36h8V12h0" pathLength="1" />,
  },
  {
    title: 'Made for where it’s used.',
    text: 'Software that keeps working when the connection doesn’t, in the languages people speak.',
    icon: <path d="M4 30c6-10 12-10 20 0s14 10 20 0 M4 20c6-10 12-10 20 0s14 10 20 0" pathLength="1" />,
  },
  {
    title: 'Paid for as a service.',
    text: 'Customers subscribe or buy a licence, and we keep it running and up to date.',
    icon: <path d="M24 6a18 18 0 1 1-17 12 M7 6v12h12" pathLength="1" />,
  },
];

function Approach() {
  const scope = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.fromTo(
          '[data-draw]',
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.18, scrollTrigger: { trigger: scope.current, start: 'top 70%', once: true } },
        );
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section id="approach" ref={scope} aria-labelledby="approach-title" className="mx-auto max-w-screen-2xl scroll-mt-20 border-l border-r border-gray-300 bg-black text-white">
      <div className={`${PAD} border-b border-white/15`}>
        <Heading label="How we build" id="approach-title" title="Different industries. One way of building." dark />
      </div>
      <ol className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {APPROACH.map((item, index) => (
          <li key={item.title} className="flex flex-col gap-6 border-b border-white/15 p-8 md:p-12 sm:[&:nth-child(odd)]:border-r xl:border-b-0 xl:border-r xl:last:border-r-0" data-reveal>
            <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <g data-draw style={{ strokeDasharray: 1 }}>
                {item.icon}
              </g>
            </svg>
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl">{item.title}</h3>
            <p className="text-gray-400">{item.text}</p>
          </li>
        ))}
      </ol>
      <p className="border-t border-white/15 px-8 py-6 font-mono text-xs uppercase tracking-widest text-gray-500 md:px-12">
        We build with AI coding tools, Claude among them.
      </p>
    </section>
  );
}

// ---------------------------------------------------------------- Lab

function Lab() {
  return (
    <section id="lab" aria-labelledby="lab-title" className={FRAME}>
      <div className={`${PAD} border-b border-gray-300`}>
        <Heading label="Lab" id="lab-title" title="Experiments, ready to deploy">
          Ideas we built to test. Each one works, and we can set it up for a business that wants it.
        </Heading>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2">
        {LAB.map((item) => (
          <li key={item.path} className="border-b border-gray-300 md:border-b-0 md:[&:first-child]:border-r" data-reveal>
            <Link to={item.path} className="group flex h-full flex-col gap-6 p-6 md:p-12">
              <span className={`block overflow-hidden p-6 md:p-10 ${DOTS}`}>
                <span className="block transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:scale-[1.01]">
                  <Screen shot={{ src: item.image, alt: item.alt, width: 1600, height: 740 }} />
                </span>
              </span>
              <span className={`${LABEL} flex items-center gap-2`}>
                <span aria-hidden="true" className="h-2 w-2 rounded-full border border-black" />
                Experiment · Ready to deploy
              </span>
              <h3 className="text-3xl font-bold tracking-tight md:text-4xl">{item.name}</h3>
              <span className="max-w-md text-gray-600">{item.line}</span>
              <span className={`${TEXT_LINK} mt-auto`}>Open the demo →</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------- Concept builds

function Concepts() {
  const { enter } = usePortal();

  // The same colour fill the concept library uses, grown from the card that was clicked.
  const openConcept = (event, concept) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    enter(concept, event.currentTarget);
  };

  return (
    <section id="concepts" aria-labelledby="concepts-title" className={FRAME}>
      <div className={`${PAD} border-b border-gray-300`}>
        <Heading label="Concept builds" id="concepts-title" title="We design and build websites, too.">
          Five complete sites for fictional export companies, each with its own brand, photography and shop. If your company needs one, talk to us.
        </Heading>
      </div>
      <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 py-10 md:grid md:snap-none md:grid-cols-3 md:gap-6 md:overflow-visible md:p-12 xl:grid-cols-5">
        {LISTED.map((concept) => {
          const id = concept.path.split('/').filter(Boolean)[1];
          return (
            <li key={concept.path} className="w-[78%] shrink-0 snap-start md:w-auto" data-reveal>
              <Link
                to={concept.path}
                onClick={(event) => openConcept(event, concept)}
                onPointerEnter={() => concept.load().catch(() => null)}
                onFocus={() => concept.load().catch(() => null)}
                className="group flex flex-col gap-3"
              >
                <span className="block overflow-hidden rounded-md border border-gray-300 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.5)]">
                  <img
                    src={`/studio/${id}.webp`}
                    alt={`The ${concept.name} home page`}
                    width="1200"
                    height="750"
                    loading="lazy"
                    decoding="async"
                    className="block aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                </span>
                <span className="font-semibold">{concept.name}</span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-gray-500">{concept.category}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="flex flex-col gap-4 border-t border-gray-300 px-6 py-8 sm:flex-row sm:items-center md:px-12">
        <Link className={BUTTON_DARK} to="/concepts/">
          See the concept builds
        </Link>
        <a className={BUTTON_LIGHT} href="#contact">
          Ask about a website
        </a>
      </p>
    </section>
  );
}

// ---------------------------------------------------------------- So far

function Journey() {
  const scope = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.fromTo(
          '[data-line]',
          { scaleX: 0, scaleY: 0 },
          { scaleX: 1, scaleY: 1, ease: 'none', scrollTrigger: { trigger: scope.current, start: 'top 75%', end: 'bottom 60%', scrub: 0.6 } },
        );
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section id="journey" ref={scope} aria-labelledby="journey-title" className={FRAME}>
      <div className={`${PAD} border-b border-gray-300`}>
        <Heading label="So far" id="journey-title" title="Where we are" />
      </div>
      <div className={`relative px-6 py-16 md:px-16 md:py-24 ${DOTS}`}>
        <span aria-hidden="true" data-line className="absolute bottom-16 left-[calc(1.5rem+0.5rem-0.5px)] top-16 w-px origin-top bg-black md:hidden" />
        <span aria-hidden="true" data-line className="absolute left-16 right-16 top-[9.25rem] hidden h-px origin-left bg-black md:block" />
        <ol className="relative grid gap-10 md:grid-cols-5 md:gap-6">
          {TIMELINE.map((step, index) => (
            <li key={step.what} className="flex gap-6 md:flex-col md:gap-0" data-reveal>
              <span className="hidden font-mono text-xs uppercase tracking-widest text-gray-500 md:mb-6 md:block md:h-5">
                <span>
                  <Fill value={step.when} label={index === TIMELINE.length - 1 ? 'What comes next' : 'Date'} />
                </span>
              </span>
              <span
                aria-hidden="true"
                className={`relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-black md:mb-6 md:mt-0 ${index < 2 ? 'bg-black' : 'bg-white'}`}
              />
              <span className="flex flex-col gap-1">
                <span className="font-mono text-xs uppercase tracking-widest text-gray-500 md:hidden">
                  <Fill value={step.when} label={index === TIMELINE.length - 1 ? 'What comes next' : 'Date'} />
                </span>
                <strong className="text-lg font-semibold leading-snug md:text-xl">{step.what}</strong>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- People

// The founders' portraits sit side by side as one strip, colour-matched by scripts/team-photos.mjs,
// with each person's name, role and links underneath.
function FounderPortrait({ person }) {
  return person.photo ? (
    <img src={person.photo} alt={`Portrait of ${person.name}`} width={640} height={800} loading="lazy" decoding="async" className="block aspect-[4/5] h-auto w-full object-cover" />
  ) : (
    <span className={`flex aspect-[4/5] items-center justify-center border border-gray-300 font-mono text-xs uppercase tracking-widest ${DOTS}`}>
      <Fill value={null} label="Portrait" />
    </span>
  );
}

function Founder({ person, index }) {
  return (
    <li className="flex flex-col items-center gap-2 text-center" data-reveal>
      <h3 className="text-2xl font-bold tracking-tight">
        <Fill value={person.name} label={`Founder ${index + 1}`} />
      </h3>
      <p className={LABEL}>
        <Fill value={person.role} label="Role" />
      </p>
      <p className="max-w-xs text-sm leading-relaxed text-gray-600">
        <Fill value={person.bio} label="A line on their background" />
      </p>
      <p className="mt-auto flex flex-wrap justify-center gap-x-6 gap-y-2 pt-2">
        {person.linkedin ? (
          <ExternalLink className={TEXT_LINK} href={person.linkedin}>
            LinkedIn
          </ExternalLink>
        ) : null}
        {person.github ? (
          <ExternalLink className={TEXT_LINK} href={person.github}>
            GitHub
          </ExternalLink>
        ) : null}
        {person.linkedin || person.github ? null : <Fill value={null} label="LinkedIn or GitHub" />}
      </p>
    </li>
  );
}

function People() {
  return (
    <section id="people" aria-labelledby="people-title" className={FRAME}>
      <div className={`${PAD} border-b border-gray-300`}>
        <Heading label="People" id="people-title" title="The founders">
          Everyone who builds our products works for {COMPANY.name}. Right now that is the three of us.
        </Heading>
      </div>
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-16 md:py-20">
        <div className="grid grid-cols-3 overflow-hidden bg-black" data-reveal>
          {FOUNDERS.map((person, index) => (
            <FounderPortrait key={person.name ?? index} person={person} />
          ))}
        </div>
        <ul className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6 md:mt-10">
          {FOUNDERS.map((person, index) => (
            <Founder key={person.name ?? index} person={person} index={index} />
          ))}
        </ul>
      </div>
      <figure className="m-0 border-t border-gray-300 px-6 py-16 md:px-16 md:py-24" data-reveal>
        <blockquote className="max-w-4xl text-2xl font-semibold leading-snug tracking-tight md:text-4xl">
          <Fill value={FOUNDER_NOTE ? `“${FOUNDER_NOTE}”` : null} label="A few sentences from the founders: why you started, and what you are building towards" />
        </blockquote>
        <figcaption className={`${LABEL} mt-8`}>The founders</figcaption>
      </figure>
      <div className="flex flex-col gap-4 border-t border-gray-300 bg-gray-50 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-16">
        <p className="max-w-xl text-gray-600">As the team grows, everyone who works on our products will be here.</p>
        <a className={TEXT_LINK} href="#contact">
          Want to build with us? Get in touch →
        </a>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Contact

const FIELD =
  'w-full rounded-none border border-gray-300 bg-white p-3 text-base outline-none transition-colors focus:border-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black';

function Contact() {
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    try {
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(event.target) });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      setStatus('sent');
      event.target.reset();
    } catch (error) {
      console.error(error);
      setStatus('failed');
    }
  };

  const facts = [
    ['Registered as', <Fill key="legal" value={COMPANY.legalName} label="Company name" />],
    ['Registration', <Fill key="reg" value={COMPANY.registration} label="Number" />],
    ['Based in', <span key="city"><Fill value={COMPANY.city} label="City" />, {COMPANY.country}</span>],
    ['Email', COMPANY.email ? <a key="mail" href={`mailto:${COMPANY.email}`} className="underline underline-offset-4">{COMPANY.email}</a> : <Fill key="mail" value={null} label="Address" />],
    [
      'Elsewhere',
      <span key="links" className="flex gap-4">
        <ExternalLink className="underline decoration-gray-300 underline-offset-4 hover:decoration-black" href={COMPANY.github}>
          GitHub
        </ExternalLink>
        {COMPANY.linkedin ? (
          <ExternalLink className="underline decoration-gray-300 underline-offset-4 hover:decoration-black" href={COMPANY.linkedin}>
            LinkedIn
          </ExternalLink>
        ) : (
          <Fill value={null} label="LinkedIn" />
        )}
      </span>,
    ],
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className={FRAME}>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className={`flex flex-col justify-center gap-8 border-b border-gray-300 md:border-b-0 md:border-r ${PAD}`} data-reveal>
          <h2 id="contact-title" className={H2}>
            Get in touch
          </h2>
          <p className="max-w-md text-gray-600 md:text-lg">
            Investors, partners, people who want to work with us, and businesses that want one of our products or a website of their own.
          </p>
          <dl className="max-w-md">
            {facts.map(([term, value]) => (
              <div key={term} className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-gray-300 py-3 last:border-b-0">
                <dt className={LABEL}>{term}</dt>
                <dd className="text-sm">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className={`${PAD} ${DOTS}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="access_key" value="ee215dd3-7169-4d3b-9de9-596561d47a29" />
            <input type="hidden" name="subject" value="Message from thecodeconsortium.com" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <label className="block">
                <span className={`${LABEL} mb-2 block text-black`}>Name</span>
                <input name="name" className={FIELD} type="text" autoComplete="name" required />
              </label>
              <label className="block">
                <span className={`${LABEL} mb-2 block text-black`}>Email</span>
                <input name="email" className={FIELD} type="email" autoComplete="email" required />
              </label>
            </div>
            <label className="block">
              <span className={`${LABEL} mb-2 block text-black`}>About</span>
              <select name="topic" className={FIELD} defaultValue="Investing">
                <option>Investing</option>
                <option>Partnering</option>
                <option>Working with us</option>
                <option>One of our products</option>
                <option>A website</option>
                <option>Something else</option>
              </select>
            </label>
            <label className="block">
              <span className={`${LABEL} mb-2 block text-black`}>Message</span>
              <textarea name="message" className={`${FIELD} resize-none`} rows="5" required />
            </label>
            <button className={`${BUTTON_DARK} w-full rounded-none disabled:cursor-not-allowed disabled:opacity-50`} type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
            <p role="status" className="min-h-[1.5rem] font-mono text-xs uppercase tracking-widest">
              {status === 'sent' ? 'Sent. We’ll reply by email.' : null}
              {status === 'failed' ? 'That didn’t send. Please try again.' : null}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-gray-50 font-sans text-black antialiased selection:bg-black selection:text-white">
      <Navbar />
      <ScrollTracker />
      <main className="flex-grow pt-20">
        <Hero />
        <Gap />
        <Products />
        <Gap />
        <Approach />
        <Gap />
        <Lab />
        <Gap />
        <Concepts />
        <Gap />
        <Journey />
        <Gap />
        <People />
        <Gap />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
