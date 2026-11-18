import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Fill from '../components/Fill.jsx';
import { BUTTON_DARK, BUTTON_LIGHT, ExternalLink, LABEL, ModuleList, Phone, Screen, Stage, TEXT_LINK } from '../components/ProductBits.jsx';
import { COMPANY, PRODUCTS, productBySlug } from '../company.js';

const FRAME = 'max-w-screen-2xl mx-auto w-full border-l border-r border-gray-300 bg-white';
const DOTS = 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]';

// One page per product on the company site. The product's own site has the sales pitch;
// this page says what it is, where it stands and who makes it.
export default function ProductPage({ slug }) {
  const product = productBySlug(slug);
  const other = PRODUCTS.find((entry) => entry.slug !== slug);
  const phones = product.shots.length > 0 && product.shots[0].height > product.shots[0].width;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-gray-50 font-sans text-black antialiased selection:bg-black selection:text-white">
      <Navbar />
      <main className="flex-grow pt-20">
        <section aria-labelledby="product-title" className={`${FRAME} grid grid-cols-1 lg:grid-cols-2`}>
          <div className="flex flex-col gap-6 border-b border-gray-300 p-6 md:p-16 lg:border-b-0 lg:border-r">
            <p className={LABEL}>
              <Link to="/#products" className="underline decoration-gray-300 underline-offset-4 hover:decoration-black">
                Products
              </Link>{' '}
              · Made by {COMPANY.name}
            </p>
            <Stage product={product} />
            <h1 id="product-title" className="text-5xl font-extrabold tracking-tighter md:text-7xl">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold leading-snug tracking-tight md:text-3xl">{product.line}</p>
            <p className="max-w-xl text-gray-600 md:text-lg">{product.summary}</p>
            <p className="flex flex-col gap-3 pt-2 sm:flex-row">
              {product.app ? (
                <ExternalLink className={BUTTON_DARK} href={product.app}>
                  Open the app
                </ExternalLink>
              ) : null}
              <ExternalLink className={product.app ? BUTTON_LIGHT : BUTTON_DARK} href={product.site}>
                {product.siteLabel}
              </ExternalLink>
            </p>
          </div>
          <div className={`flex items-end justify-center gap-4 overflow-hidden px-6 pt-10 md:px-12 ${phones ? '' : 'items-center pb-10'} ${DOTS}`}>
            {phones ? (
              product.shots.map((shot, index) => (
                <Phone key={shot.src} shot={shot} eager className={`w-1/3 max-w-[230px] ${index === 1 ? 'mb-12' : '-mb-6'}`} />
              ))
            ) : (
              <Screen shot={product.shots[0]} label={`${product.name} screenshot from the pilot build`} />
            )}
          </div>
        </section>

        <div aria-hidden="true" className="h-16 w-full border-b border-t border-gray-300 bg-gray-50" />

        <section aria-labelledby="does-title" className={`${FRAME} grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]`}>
          <div className="border-b border-gray-300 p-6 md:border-b-0 md:border-r md:p-16">
            <h2 id="does-title" className="text-4xl font-bold tracking-tight md:text-5xl">
              What it does
            </h2>
          </div>
          <div className="p-6 md:p-16">
            <ModuleList modules={product.modules} />
          </div>
        </section>

        <div aria-hidden="true" className="h-16 w-full border-b border-t border-gray-300 bg-gray-50" />

        <section aria-labelledby="facts-title" className={FRAME}>
          <h2 id="facts-title" className="border-b border-gray-300 p-6 text-4xl font-bold tracking-tight md:p-16 md:text-5xl">
            Where it stands
          </h2>
          <dl className="grid grid-cols-1 md:grid-cols-3">
            <div className="border-b border-gray-300 p-6 md:border-b-0 md:border-r md:p-12">
              <dt className={LABEL}>Who it’s for</dt>
              <dd className="mt-3 text-lg">{product.audience}</dd>
            </div>
            <div className="border-b border-gray-300 p-6 md:border-b-0 md:border-r md:p-12">
              <dt className={LABEL}>How it’s paid for</dt>
              <dd className="mt-3 text-lg">{product.pricing}</dd>
            </div>
            <div className={`p-6 md:p-12 ${DOTS}`}>
              <dt className={LABEL}>Dates</dt>
              <dd className="mt-3">
                <ol className="space-y-2">
                  {product.milestones.map((step) => (
                    <li key={step.what} className="flex justify-between gap-4 border-b border-gray-300 pb-2 last:border-b-0">
                      <span>{step.what}</span>
                      <span className="font-mono text-sm">
                        <Fill value={step.when} label="Month and year" />
                      </span>
                    </li>
                  ))}
                </ol>
              </dd>
            </div>
          </dl>
        </section>

        <div aria-hidden="true" className="h-16 w-full border-b border-t border-gray-300 bg-gray-50" />

        <section aria-label="Who makes it" className={`${FRAME} flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-16`}>
          <p className="max-w-2xl text-gray-600 md:text-lg">
            {product.name} is designed, built, hosted and supported by {COMPANY.name}, and the code is ours.
          </p>
          <p className="flex flex-wrap gap-x-8 gap-y-3">
            <Link className={TEXT_LINK} to="/#company">
              Meet the team →
            </Link>
            <Link className={TEXT_LINK} to={other.path}>
              {other.name} →
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
