import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Fill from '../components/Fill.jsx';
import { BUTTON_DARK, BUTTON_LIGHT, ExternalLink, LABEL, ModuleList, Phone, Screen, Stage, TEXT_LINK } from '../components/ProductBits.jsx';
import { COMPANY, FOUNDERS, FOUNDER_NOTE, productBySlug } from '../company.js';

const SECTIONS = [
  { id: 'hero', label: 'The Code Consortium' },
  { id: 'products', label: 'Products' },
  { id: 'model', label: 'How we work' },
  { id: 'company', label: 'Team' },
  { id: 'contact', label: 'Contact' },
];

const FRAME = 'max-w-screen-2xl mx-auto border-l border-r border-gray-300 bg-white scroll-mt-20';
const DOTS = 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]';

function Gap() {
  return <div aria-hidden="true" className="h-16 w-full border-b border-t border-gray-300 bg-gray-50 md:h-24" />;
}

// How the company makes its money and looks after what it sells.
const MODEL = [
  {
    title: 'We own everything we sell.',
    text: `Every line of Spear OS and Spear Tea OS is written by our team, and the code belongs to ${COMPANY.name}. Customers pay for the right to use it.`,
  },
  {
    title: 'Customers pay for the product.',
    text: 'Spear OS is a monthly or yearly subscription. Spear Tea OS is a licence, activated on the shop’s phone. A new customer gets the same product, set up for them.',
  },
  {
    title: 'We run it.',
    text: 'We host Spear OS, ship the updates for both products and answer support ourselves. We don’t take over other companies’ systems or look after code we didn’t write.',
  },
  {
    title: 'Built for a bad connection.',
    text: 'Hotels and tea shops lose their internet. Spear Tea OS runs with none at all, and the Spear OS till is being built to keep taking orders when the line drops.',
  },
  {
    title: 'Built with AI tools.',
    text: 'We use AI coding assistants, Claude among them, to write and test code faster. Spear Tea OS was built that way.',
  },
];

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

function Hero() {
  const tea = productBySlug('tea-os');
  const spear = productBySlug('spear-os');
  return (
    <section id="hero" aria-labelledby="home-title" className={`${FRAME} relative flex min-h-[calc(100svh-5rem)] flex-col justify-center overflow-hidden`}>
      <div aria-hidden="true" className={`absolute inset-0 opacity-60 ${DOTS}`} />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-16 text-center md:px-12">
        <p className={`${LABEL} mb-8`}>
          Software company · <Fill value={COMPANY.city} label="City" />, {COMPANY.country}
        </p>
        <h1 id="home-title" className="max-w-5xl text-5xl font-extrabold leading-[1.04] tracking-tighter md:text-7xl lg:text-[5.25rem]">
          We build Spear, software for hotels, restaurants and tea shops.
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-gray-600 md:text-xl">
          We write it, own it and support it. Spear Tea OS is out now. Spear OS, for hotels and their restaurants, is being built with its first
          customer.
        </p>
        <div className="mt-10 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
          <a className={BUTTON_DARK} href="#products">
            See the products
          </a>
          <ExternalLink className={BUTTON_LIGHT} href={tea.app}>
            Try Spear Tea OS
          </ExternalLink>
        </div>
      </div>

      <dl className="relative z-10 grid grid-cols-1 border-t border-gray-300 bg-white sm:grid-cols-3">
        {[
          [tea.name, tea.stage],
          [spear.name, spear.stage],
          ['Founded', <Fill key="year" value={COMPANY.founded} label="Year" />],
        ].map(([term, value], index) => (
          <div key={term} className={`flex items-baseline justify-between gap-4 px-6 py-5 md:px-12 ${index ? 'border-t border-gray-300 sm:border-l sm:border-t-0' : ''}`}>
            <dt className={LABEL}>{term}</dt>
            <dd className="font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function SpearPanel() {
  const product = productBySlug('spear-os');
  return (
    <article className="grid grid-cols-1 border-b border-gray-300 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)]" aria-labelledby="spear-title">
      <div className="flex flex-col gap-6 border-b border-gray-300 p-6 md:p-12 lg:border-b-0 lg:border-r" data-reveal>
        <p className={LABEL}>01 · Flagship</p>
        <Stage product={product} />
        <h3 id="spear-title" className="text-4xl font-bold tracking-tight md:text-6xl">
          {product.name}
        </h3>
        <p className="text-2xl font-semibold leading-snug tracking-tight md:text-3xl">{product.line}</p>
        <p className="max-w-2xl text-gray-600">{product.summary}</p>
        <ModuleList modules={product.modules} />
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className={LABEL}>For</dt>
            <dd className="mt-1 text-sm">{product.audience}</dd>
          </div>
          <div>
            <dt className={LABEL}>Pricing</dt>
            <dd className="mt-1 text-sm">{product.pricing}</dd>
          </div>
        </dl>
        <p className="flex flex-wrap gap-x-8 gap-y-3">
          <Link className={TEXT_LINK} to={product.path}>
            More about {product.name} →
          </Link>
          <ExternalLink className={TEXT_LINK} href={product.site}>
            {product.siteLabel}
          </ExternalLink>
        </p>
      </div>
      <div className={`flex items-center p-6 md:p-12 ${DOTS}`} data-reveal>
        <Screen shot={product.shots[0]} label="Spear OS screenshot from the pilot build" />
      </div>
    </article>
  );
}

function TeaPanel() {
  const product = productBySlug('tea-os');
  return (
    <article className="grid grid-cols-1 border-b border-gray-300 lg:grid-cols-[minmax(0,9fr)_minmax(0,11fr)]" aria-labelledby="tea-title">
      <div className={`order-2 flex items-end justify-center gap-3 overflow-hidden px-6 pt-10 md:gap-5 md:px-12 lg:order-1 lg:border-r lg:border-gray-300 ${DOTS}`} data-reveal>
        {product.shots.map((shot, index) => (
          <Phone key={shot.src} shot={shot} className={`w-1/3 max-w-[220px] ${index === 1 ? 'mb-10' : '-mb-6'}`} />
        ))}
      </div>
      <div className="order-1 flex flex-col gap-6 border-b border-gray-300 p-6 md:p-12 lg:order-2 lg:border-b-0" data-reveal>
        <p className={LABEL}>02 · Out now</p>
        <Stage product={product} />
        <h3 id="tea-title" className="text-4xl font-bold tracking-tight md:text-6xl">
          {product.name}
        </h3>
        <p className="text-2xl font-semibold leading-snug tracking-tight md:text-3xl">{product.line}</p>
        <p className="max-w-2xl text-gray-600">{product.summary}</p>
        <ul className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
          {product.modules.map((module) => (
            <li key={module.name} className="border-l-2 border-black pl-3">
              <strong className="block font-semibold">{module.name}</strong>
              <span className="text-gray-600">{module.detail}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm">
          <span className={LABEL}>Pricing </span> {product.pricing}
        </p>
        <p className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <ExternalLink className={BUTTON_DARK} href={product.app}>
            Open the app
          </ExternalLink>
          <Link className={TEXT_LINK} to={product.path}>
            More about {product.name} →
          </Link>
          <ExternalLink className={TEXT_LINK} href={product.site}>
            {product.siteLabel}
          </ExternalLink>
        </p>
      </div>
    </article>
  );
}

function Products() {
  return (
    <section id="products" aria-labelledby="products-title" className={FRAME}>
      <div className="grid gap-6 border-b border-gray-300 p-6 md:grid-cols-2 md:p-16" data-reveal>
        <div>
          <p className={`${LABEL} mb-4`}>Products</p>
          <h2 id="products-title" className="text-5xl font-bold tracking-tight md:text-6xl">
            What we make
          </h2>
        </div>
        <p className="self-end text-gray-600 md:text-lg">
          Both products are sold under the Spear name and each has its own website. One is out; the other is being built with the business that
          will use it first.
        </p>
      </div>
      <SpearPanel />
      <TeaPanel />
      <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-12">
        <p className="max-w-2xl text-gray-600">
          We have also built working prototypes for a bakery, a hair salon and a large HR team. They were for testing ideas and are not on sale.
        </p>
        <Link className={TEXT_LINK} to="/prototypes/">
          See the prototypes →
        </Link>
      </div>
    </section>
  );
}

function Model() {
  return (
    <section id="model" aria-labelledby="model-title" className={FRAME}>
      <div className="border-b border-gray-300 p-6 md:p-16" data-reveal>
        <p className={`${LABEL} mb-4`}>How we work</p>
        <h2 id="model-title" className="max-w-4xl text-5xl font-bold tracking-tight md:text-6xl">
          A product company, from code to support desk
        </h2>
      </div>
      <ol>
        {MODEL.map((row, index) => (
          <li key={row.title} className="grid grid-cols-1 border-b border-gray-300 last:border-b-0 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="flex gap-6 p-6 md:border-r md:border-gray-300 md:p-12" data-reveal>
              <span className={`${LABEL} pt-2`}>{String(index + 1).padStart(2, '0')}</span>
              <h3 className="text-3xl font-bold tracking-tight md:text-4xl">{row.title}</h3>
            </div>
            <p className={`px-6 pb-8 text-gray-600 md:p-12 md:text-lg ${DOTS}`} data-reveal>
              {row.text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Founder({ person, index }) {
  return (
    <li className="flex flex-col border-b border-gray-300 md:border-b-0 md:border-r md:last:border-r-0" data-reveal>
      <span className={`flex aspect-[5/4] items-center justify-center border-b border-gray-300 ${DOTS}`}>
        {person.photo ? (
          <img src={person.photo} alt={person.name ?? ''} loading="lazy" decoding="async" className="h-full w-full object-cover grayscale" />
        ) : (
          <span className="font-mono text-xs uppercase tracking-widest">
            <Fill value={null} label={`Photo of founder ${index + 1}`} />
          </span>
        )}
      </span>
      <div className="flex flex-1 flex-col gap-3 p-6 md:p-8">
        <h3 className="text-2xl font-bold tracking-tight">
          <Fill value={person.name} label={`Founder ${index + 1} name`} />
        </h3>
        <p className={LABEL}>
          <Fill value={person.role} label="Role" />
        </p>
        <p className="text-sm text-gray-600">
          <Fill value={person.bio} label="One or two sentences on their background" />
        </p>
        <p className="mt-auto pt-2">
          {person.linkedin ? (
            <ExternalLink className={TEXT_LINK} href={person.linkedin}>
              LinkedIn
            </ExternalLink>
          ) : (
            <span className="font-mono text-xs uppercase">
              <Fill value={null} label="LinkedIn link" />
            </span>
          )}
        </p>
      </div>
    </li>
  );
}

function Company() {
  const facts = [
    ['Registered as', <Fill key="legal" value={COMPANY.legalName} label="Registered company name" />],
    ['Registration no.', <Fill key="reg" value={COMPANY.registration} label="Number" />],
    ['Founded', <Fill key="year" value={COMPANY.founded} label="Year" />],
    ['Based in', <span key="city"><Fill value={COMPANY.city} label="City" />, {COMPANY.country}</span>],
    [
      'GitHub',
      <ExternalLink key="gh" className="underline decoration-gray-300 underline-offset-4 hover:decoration-black" href={COMPANY.github}>
        {COMPANY.github.replace('https://', '')}
      </ExternalLink>,
    ],
    [
      'LinkedIn',
      COMPANY.linkedin ? (
        <ExternalLink key="li" className="underline decoration-gray-300 underline-offset-4 hover:decoration-black" href={COMPANY.linkedin}>
          Company page
        </ExternalLink>
      ) : (
        <Fill key="li" value={null} label="Company page link" />
      ),
    ],
  ];

  return (
    <section id="company" aria-labelledby="company-title" className={FRAME}>
      <div className="border-b border-gray-300 p-6 md:p-16" data-reveal>
        <p className={`${LABEL} mb-4`}>Team</p>
        <h2 id="company-title" className="text-5xl font-bold tracking-tight md:text-6xl">
          The people behind Spear
        </h2>
      </div>
      <ul className="grid grid-cols-1 border-b border-gray-300 md:grid-cols-3">
        {FOUNDERS.map((person, index) => (
          <Founder key={person.name ?? index} person={person} index={index} />
        ))}
      </ul>
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="border-b border-gray-300 p-6 md:border-b-0 md:border-r md:p-12" data-reveal>
          <h3 className="mb-6 text-3xl font-bold tracking-tight">Why we’re building Spear</h3>
          <p className="max-w-2xl text-lg leading-relaxed text-gray-700">
            <Fill value={FOUNDER_NOTE} label="A short note from the founders, in your own words: what you saw in hotels and shops, and why you started" />
          </p>
        </div>
        <dl className={`p-6 md:p-12 ${DOTS}`} data-reveal>
          {facts.map(([term, value]) => (
            <div key={term} className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-gray-300 bg-white/70 py-3 last:border-b-0">
              <dt className={LABEL}>{term}</dt>
              <dd className="text-sm">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

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

  return (
    <section id="contact" aria-labelledby="contact-title" className={FRAME}>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center gap-6 border-b border-gray-300 p-6 md:border-b-0 md:border-r md:p-16" data-reveal>
          <h2 id="contact-title" className="text-5xl font-bold tracking-tight md:text-6xl">
            Talk to us
          </h2>
          <p className="max-w-md text-gray-600 md:text-lg">
            About Spear OS, Spear Tea OS, a partnership, or anything else. We reply by email.
          </p>
          <p className="font-mono text-sm">
            {COMPANY.email ? <a href={`mailto:${COMPANY.email}`} className="underline underline-offset-4">{COMPANY.email}</a> : <Fill value={null} label="Contact email" />}
          </p>
        </div>
        <div className={`p-6 md:p-16 ${DOTS}`}>
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
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-gray-50 font-sans text-black antialiased selection:bg-black selection:text-white">
      <Navbar />
      <ScrollTracker />
      <main className="flex-grow pt-20">
        <Hero />
        <Gap />
        <Products />
        <Gap />
        <Model />
        <Gap />
        <Company />
        <Gap />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
