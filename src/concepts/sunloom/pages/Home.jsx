import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Fabric, Photo, Redye, Swatches } from '../Fabric.jsx';
import { DYES, PRODUCTS, WHOLESALE_TIERS, basePrice, formatPrice } from '../products.js';
import { BASE, productPath } from '../site.js';
import { useSunloom } from '../sunloomContext.js';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// The lookbook: which pieces, in what order, and how wide each panel is.
const LOOK = [
  ['duvet-cover-set', '46vw'],
  ['pillowcase-pair', '27vw'],
  ['heavy-linen-throw', '36vw'],
  ['linen-tablecloth', '52vw'],
  ['fitted-sheet', '30vw'],
  ['waffle-bath-towel', '40vw'],
].map(([slug, width]) => ({ product: PRODUCTS.find((item) => item.slug === slug), width }));

const FIGURES = [
  { value: '165', label: 'grams per square metre. Heavy enough to last, light enough for August.' },
  { value: '46', label: 'looms in our own weaving shed in Keqiao.' },
  { value: '2', label: 'washes before the cloth is cut, so it shrinks here and not on your bed.' },
];

// Two made-up beds, shown side by side after the lookbook.
const ROOMS = [
  {
    photo: 'bed-madder',
    dye: 'madder',
    caption: 'Madder, with oat pillowcases',
    alt: 'A low bed made up in rust-red madder linen with undyed oat pillowcases, seen from the side',
    position: '70% 60%',
  },
  {
    photo: 'bed-sage',
    dye: 'sage',
    caption: 'Sage, top to bottom',
    alt: 'A bed made up entirely in grey-green sage linen, seen from above at an angle',
    position: '45% 55%',
  },
];

export default function Home() {
  const root = useRef(null);
  const { dye, setDye } = useSunloom();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // The headline rises line by line. Skipped when the page was already painted from the
        // pre-rendered HTML, where hiding it again would make it blink.
        if (!window.__TCC_FIRST_PAINT__) {
          gsap.from(root.current.querySelectorAll('.sl-line > span'), {
            yPercent: 112,
            duration: 1.3,
            ease: 'expo.out',
            stagger: 0.11,
            delay: 0.15,
          });
        }

        // The statement drifts up a little slower than the page, like something heavier.
        gsap.from(root.current.querySelector('[data-statement]'), {
          y: 90,
          ease: 'none',
          scrollTrigger: { trigger: root.current.querySelector('.sl-statement'), start: 'top bottom', end: 'top 30%', scrub: true },
        });
      });

      // On wide screens the lookbook is pinned and vertical scrolling pulls it sideways.
      mm.add('(min-width: 821px) and (prefers-reduced-motion: no-preference)', () => {
        const section = root.current.querySelector('.sl-look');
        const track = section.querySelector('.sl-look-track');
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        section.dataset.native = 'false';
        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        return () => {
          section.dataset.native = 'true';
        };
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <section className="sl-hero">
        <div className="sl-hero-media">
          <Photo
            name="hero-bed"
            tall="hero-bed-tall"
            alt="A low wooden bed made up in washed linen, the duvet pulled back on one side"
            loading="eager"
          />
          <Redye name="hero-bed" tall="hero-bed-tall" dye={dye} shotIn="indigo" />
        </div>
        <div className="sl-hero-body">
          <div className="sl-hero-copy">
            <h1 className="sl-display">
              <span className="sl-line">
                <span>Washed linen,</span>
              </span>
              <span className="sl-line">
                <span>
                  <em>made to be</em>
                </span>
              </span>
              <span className="sl-line">
                <span>lived in.</span>
              </span>
            </h1>
            <div className="mt-[clamp(20px,2.4vw,40px)] flex flex-wrap items-center gap-x-[clamp(20px,3vw,56px)] gap-y-5">
              <p className="max-w-[40ch] text-[1.08em]">
                Bed, table and bath linen in eight dyes, woven, washed and sewn in our own mill, and shipped duty-paid
                to Europe and North America.
              </p>
              <Link to={`${BASE}collection/`} className="sl-btn sl-btn--ink">
                Shop the linen
              </Link>
            </div>
          </div>
          <div className="sl-rail">
            <span className="sl-rail-label">Dye the page</span>
            <Swatches value={dye} onPick={setDye} label="Dye the page" size="rail" />
          </div>
        </div>
      </section>

      <section className="sl-statement" aria-labelledby="sl-statement-title">
        <h2 id="sl-statement-title" className="sr-only">
          What we make
        </h2>
        <p className="sl-display" data-statement>
          We weave flax linen on forty-six looms, wash every metre <em>twice</em> in soft water, and sell it under our
          own name instead of someone else’s label.
        </p>
        <p className="sl-soft max-w-[30ch] justify-self-end">
          For twenty years Sunloom wove for European bedding brands. In 2019 we started selling the same cloth
          ourselves.{' '}
          <Link to={`${BASE}mill/`} className="sl-link text-[color:var(--ink)]">
            See how it is made
          </Link>
        </p>
      </section>

      <section className="sl-look" data-native="true" aria-labelledby="sl-look-title">
        <div className="sl-look-head">
          <h2 id="sl-look-title" className="sl-display">
            The range, <em>laid end to end</em>
          </h2>
          <Link to={`${BASE}collection/`} className="sl-link shrink-0">
            All {PRODUCTS.length} pieces
          </Link>
        </div>
        <div className="sl-look-scroller">
          <ol className="sl-look-track">
            {LOOK.map(({ product, width }, index) => (
              <li key={product.slug} className="sl-panel" style={{ '--w': width }}>
                <Photo
                  name={product.photo}
                  dye={product.dye}
                  tint
                  alt={`${product.name} in ${product.dye}`}
                  stack={product.dyes.filter((id) => id !== product.dye).slice(0, 4)}
                  variant={index % 2 ? 'deep' : 'drape'}
                />
                <span className="sl-panel-no sl-small">
                  {String(index + 1).padStart(2, '0')} / {String(LOOK.length).padStart(2, '0')}
                </span>
                <div className="sl-panel-cap" style={{ color: DYES.find((item) => item.id === product.dye).on }}>
                  <h3 className="sl-serif">{product.short}</h3>
                  <span className="shrink-0">from {formatPrice(basePrice(product))}</span>
                </div>
                <Link to={productPath(product.slug)} aria-label={`${product.name}, from ${formatPrice(basePrice(product))}`} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sl-rooms" aria-labelledby="sl-rooms-title">
        <h2 id="sl-rooms-title" className="sr-only">
          The linen at home
        </h2>
        {ROOMS.map((room) => (
          <figure key={room.photo} className="sl-room">
            <Photo name={room.photo} dye={room.dye} alt={room.alt} position={room.position} />
            <figcaption>
              <span className="sl-serif">{room.caption}</span>
              <button type="button" className="sl-link" onClick={() => setDye(room.dye)}>
                Dye the page {room.dye}
              </button>
            </figcaption>
          </figure>
        ))}
      </section>

      <section className="sl-split" aria-labelledby="sl-cloth-title">
        <Photo
          name="weave"
          dye="oat"
          variant="deep"
          alt="Close-up of undyed washed linen lying in soft folds, the weave and slubs visible"
        />
        <Fabric className="sl-figures" variant="flat">
          <h2 id="sl-cloth-title" className="sl-serif mb-[clamp(20px,3vw,50px)] max-w-[16ch] text-[clamp(1.8rem,3.2vw,3.6rem)]">
            The cloth, in three numbers
          </h2>
          <dl>
            {FIGURES.map((figure) => (
              <div key={figure.value} className="sl-figure">
                <dt>{figure.label}</dt>
                <dd>{figure.value}</dd>
              </div>
            ))}
          </dl>
        </Fabric>
      </section>

      <section className="sl-split" aria-labelledby="sl-trade-title">
        <Fabric dye="soot" variant="flat" className="grid content-between gap-10 p-[var(--pad)] py-[clamp(40px,6vw,110px)]">
          <h2 id="sl-trade-title" className="sl-display text-[clamp(2.6rem,6.6vw,7.6rem)]">
            Stock it <em>in your shop.</em>
          </h2>
          <div>
            <dl className="grid gap-1">
              {WHOLESALE_TIERS.map((tier) => (
                <div key={tier.from} className="flex items-baseline justify-between gap-6 border-t border-white/20 py-3">
                  <dt>
                    From {tier.from.toLocaleString('en-US')} pieces
                    <span className="block text-[0.86em] opacity-70">{tier.note}</span>
                  </dt>
                  <dd className="sl-serif shrink-0 text-[clamp(1.6rem,2.6vw,2.8rem)]">{tier.off}% off</dd>
                </div>
              ))}
            </dl>
            <Link to={`${BASE}wholesale/`} className="sl-btn sl-btn--on-dye mt-8">
              Wholesale terms
            </Link>
          </div>
        </Fabric>
        <Photo
          name="stack"
          dye="chalk"
          variant="flat"
          alt="Seven folded linen sheets stacked on a stool, one in each colour"
          stack={['soot', 'indigo', 'lake', 'sage', 'ochre', 'madder', 'oat']}
        />
      </section>
    </div>
  );
}
