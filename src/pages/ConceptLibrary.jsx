import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CONCEPTS, pad2 } from '../concepts/registry.js';
import { usePortal } from '../concepts/portal/portalContext.js';

const STANDARD = [
  {
    term: 'Pre-rendered pages',
    detail: 'Every page ships as complete HTML, so search engines and AI assistants can read it without running scripts.',
  },
  {
    term: 'Page structure',
    detail: 'One H1 per page, headings in order, and real links and buttons underneath the styling.',
  },
  {
    term: 'Structured data',
    detail: 'Products, prices and page hierarchy described in the format search engines parse.',
  },
  {
    term: 'Motion',
    detail: 'Animation is there to explain something. Visitors who ask their device for less motion get less.',
  },
  {
    term: 'Access',
    detail: 'Usable from the keyboard, readable contrast, and touch targets of at least 44 pixels.',
  },
];

const liveCount = CONCEPTS.filter((concept) => concept.status === 'live').length;

export default function ConceptLibrary() {
  const { enter } = usePortal();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleClick = (event, concept) => {
    // Leave new-tab and modified clicks to the browser.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    enter(concept, event.currentTarget);
  };

  const preload = (concept) => {
    concept.load().catch(() => null);
  };

  return (
    <div className="font-sans text-black bg-gray-50 min-h-screen flex flex-col relative selection:bg-black selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-screen-2xl mx-auto border-l border-r border-gray-300 bg-white pt-20 w-full">
        <header className="grid grid-cols-1 lg:grid-cols-12 border-b border-gray-300">
          <div className="p-6 md:p-16 lg:col-span-8 lg:border-r border-gray-300">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black">Concept Builds</h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl text-gray-500 leading-relaxed">
              The six companies below do not exist. We invented them to show the range of sites we build for
              manufacturers and sellers who export to Europe and North America. The names, products, prices and
              reviews are fictional. The engineering is real.
            </p>
          </div>
          <dl className="lg:col-span-4 grid grid-cols-[auto_1fr] content-center gap-x-8 gap-y-3 p-6 md:p-16 font-mono text-xs uppercase tracking-widest border-t lg:border-t-0 border-gray-300">
            <dt className="text-gray-500">Index</dt>
            <dd>{pad2(CONCEPTS.length)} concepts</dd>
            <dt className="text-gray-500">Scope</dt>
            <dd>Front end, mock data</dd>
            <dt className="text-gray-500">Status</dt>
            <dd>
              {pad2(liveCount)} live / {pad2(CONCEPTS.length - liveCount)} in build
            </dd>
          </dl>
        </header>

        <section aria-labelledby="concept-index">
          <h2 id="concept-index" className="sr-only">
            Concept index
          </h2>
          <ol>
            {CONCEPTS.map((concept) => (
              <li key={concept.slug} className="border-b border-gray-300">
                <Link
                  to={concept.path}
                  onClick={(event) => handleClick(event, concept)}
                  onPointerEnter={() => preload(concept)}
                  onFocus={() => preload(concept)}
                  style={{ '--loud': concept.palette.loud, '--on-loud': concept.palette.onLoud }}
                  className="group grid grid-cols-[3rem_1fr_auto] md:grid-cols-[5rem_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_2.5rem] items-baseline gap-x-4 md:gap-x-8 gap-y-2 px-6 md:px-16 py-8 md:py-10 text-black transition-colors duration-200 hover:bg-[var(--loud)] hover:text-[color:var(--on-loud)] focus-visible:bg-[var(--loud)] focus-visible:text-[color:var(--on-loud)] focus-visible:outline-none active:scale-[0.995]"
                >
                  <span className="font-mono text-sm text-gray-500 transition-colors duration-200 group-hover:text-[color:var(--on-loud)] group-focus-visible:text-[color:var(--on-loud)]">
                    {pad2(concept.order)}
                  </span>

                  <span className="min-w-0">
                    <span className="block text-3xl md:text-5xl font-bold tracking-tight">{concept.name}</span>
                    <span className="mt-3 block max-w-xl text-base text-gray-500 transition-colors duration-200 group-hover:text-[color:var(--on-loud)] group-focus-visible:text-[color:var(--on-loud)]">
                      {concept.summary}
                    </span>
                  </span>

                  <span className="col-start-2 md:col-start-auto font-mono text-xs uppercase tracking-widest text-gray-500 transition-colors duration-200 group-hover:text-[color:var(--on-loud)] group-focus-visible:text-[color:var(--on-loud)]">
                    {concept.category}
                    <span className="mt-1 block">{concept.audience}</span>
                  </span>

                  <span className="col-start-2 md:col-start-auto font-mono text-xs uppercase tracking-widest text-gray-500 transition-colors duration-200 group-hover:text-[color:var(--on-loud)] group-focus-visible:text-[color:var(--on-loud)]">
                    {concept.city}
                    <span className="mt-1 block">{concept.status === 'live' ? 'Live' : 'In build'}</span>
                  </span>

                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined row-start-1 col-start-3 md:row-start-auto md:col-start-auto justify-self-end text-gray-300 transition-all duration-300 group-hover:text-[color:var(--on-loud)] group-hover:translate-x-1 group-hover:-translate-y-1 group-focus-visible:text-[color:var(--on-loud)]"
                  >
                    arrow_outward
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="build-standard" className="grid grid-cols-1 lg:grid-cols-12 border-b border-gray-300">
          <div className="p-6 md:p-16 lg:col-span-4 lg:border-r border-gray-300">
            <h2 id="build-standard" className="text-3xl md:text-4xl font-bold tracking-tight">
              What every concept is built to
            </h2>
          </div>
          <dl className="lg:col-span-8">
            {STANDARD.map((item) => (
              <div
                key={item.term}
                className="grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-x-8 gap-y-2 px-6 md:px-16 py-6 border-t border-gray-300 lg:first:border-t-0"
              >
                <dt className="font-mono text-xs uppercase tracking-widest pt-1">{item.term}</dt>
                <dd className="text-gray-500 leading-relaxed">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="concept-inquire" className="p-6 md:p-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <h2 id="concept-inquire" className="text-3xl md:text-4xl font-bold tracking-tight max-w-xl">
            Want a site like one of these for your company?
          </h2>
          <Link
            to="/#contact"
            className="inline-flex items-center justify-center min-h-[44px] px-8 py-3 font-mono uppercase text-sm bg-black text-white border border-black transition-all duration-200 hover:bg-white hover:text-black active:scale-[0.98]"
          >
            Start an inquiry
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
