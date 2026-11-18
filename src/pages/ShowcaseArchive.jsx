import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LABEL, TEXT_LINK } from '../components/ProductBits.jsx';
import { PROTOTYPES } from '../company.js';

// Working demos built to test ideas outside hospitality. Kept apart from the products so
// nobody mistakes them for something on sale.
export default function ShowcaseArchive() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50 font-sans text-black selection:bg-black selection:text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-screen-2xl flex-grow border-l border-r border-gray-300 bg-white pt-20">
        <div className="grid gap-6 border-b border-gray-300 p-6 md:grid-cols-2 md:p-16">
          <div>
            <p className={`${LABEL} mb-4`}>Prototypes</p>
            <h1 className="text-5xl font-bold tracking-tight md:text-6xl">Ideas we tested</h1>
          </div>
          <p className="self-end text-gray-600 md:text-lg">
            Working prototypes with made-up data, built to try out ideas outside hospitality. They are not on sale and nobody runs a business on
            them. Our products are{' '}
            <Link to="/#products" className="underline underline-offset-4">
              Spear OS and Spear Tea OS
            </Link>
            .
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3 md:gap-8 md:p-8">
          {PROTOTYPES.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className="group flex h-full flex-col border border-gray-300 bg-white transition-colors hover:border-black">
                <span className="block aspect-[16/10] overflow-hidden border-b border-gray-300 bg-gray-50">
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-left-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </span>
                <span className="flex flex-1 flex-col gap-3 p-6 md:p-8">
                  <span className={LABEL}>Prototype · On hold</span>
                  <h2 className="text-2xl font-bold tracking-tight">{item.name}</h2>
                  <span className="text-sm text-gray-600">{item.line}</span>
                  <span className={`${TEXT_LINK} mt-auto pt-3`}>Open the prototype →</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
