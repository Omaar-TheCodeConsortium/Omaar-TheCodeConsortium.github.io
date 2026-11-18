import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LABEL, Screen, TEXT_LINK } from '../components/ProductBits.jsx';
import { LAB, productBySlug } from '../company.js';

const DOTS = 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]';

// The Lab: experiments built to test an idea, each finished enough to deploy.
export default function ShowcaseArchive() {
  const tccos = productBySlug('tccos');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50 font-sans text-black selection:bg-black selection:text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-screen-2xl flex-grow border-l border-r border-gray-300 bg-white pt-20">
        <div className="grid gap-6 border-b border-gray-300 px-6 py-20 md:grid-cols-2 md:items-end md:px-16 md:py-28">
          <div>
            <p className={`${LABEL} mb-5`}>Lab</p>
            <h1 className="text-5xl font-bold tracking-tight md:text-7xl">Experiments, ready to deploy</h1>
          </div>
          <p className="max-w-xl text-gray-600 md:text-lg">
            Ideas we built to test. Each one works with sample data, and we can set it up for a business that wants it.
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2">
          {LAB.map((item, index) => (
            <li key={item.path} className={`border-b border-gray-300 ${index % 2 === 0 ? 'md:border-r' : ''}`}>
              <Link to={item.path} className="group flex h-full flex-col gap-5 p-6 md:p-12">
                <span className={`block p-6 md:p-10 ${DOTS}`}>
                  <span className="block transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1">
                    <Screen shot={{ src: item.image, alt: item.alt, width: 1600, height: 740 }} />
                  </span>
                </span>
                <span className={LABEL}>Experiment · Ready to deploy</span>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{item.name}</h2>
                <span className="max-w-md text-gray-600">{item.line}</span>
                <span className={`${TEXT_LINK} mt-auto`}>Open the demo →</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-16">
          <p className="max-w-2xl text-gray-600">
            Looking for the workforce system? {tccos.name} has grown out of the Lab into a product of its own.
          </p>
          <Link className={TEXT_LINK} to={tccos.path}>
            About {tccos.name} →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
