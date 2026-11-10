import '@fontsource-variable/newsreader/opsz.css';
import '@fontsource-variable/newsreader/opsz-italic.css';
import '@fontsource-variable/hanken-grotesk/wght.css';
import './sunloom.css';
import { Link, Route, Routes } from 'react-router-dom';
import { CONCEPTS } from '../registry.js';
import ConceptShell from '../ConceptShell.jsx';
import SunloomProvider from './SunloomProvider.jsx';
import Layout from './Layout.jsx';
import { PRODUCTS } from './products.js';
import { BASE } from './site.js';
import Home from './pages/Home.jsx';
import Collection from './pages/Collection.jsx';
import Product from './pages/Product.jsx';
import Mill from './pages/Mill.jsx';
import Wholesale from './pages/Wholesale.jsx';
import Cart from './pages/Cart.jsx';

const concept = CONCEPTS.find((entry) => entry.slug === 'sunloom');

function NotFound() {
  return (
    <Layout>
      <section className="grid min-h-[100svh] content-center gap-8 px-[var(--pad)]">
        <h1 className="sl-display text-[clamp(3rem,11vw,13rem)]">
          Nothing <em>on this shelf.</em>
        </h1>
        <Link to={BASE} className="sl-btn w-fit">
          Back to the home page
        </Link>
      </section>
    </Layout>
  );
}

export default function Sunloom() {
  return (
    <ConceptShell concept={concept}>
      <SunloomProvider>
        <Routes>
          <Route index element={<Layout over="all" tone="ink"><Home /></Layout>} />
          <Route path="collection" element={<Layout><Collection /></Layout>} />
          {PRODUCTS.map((product) => (
            <Route
              key={product.slug}
              path={`product/${product.slug}`}
              element={<Layout over="start"><Product key={product.slug} product={product} /></Layout>}
            />
          ))}
          <Route path="mill" element={<Layout over="all" tone="ink"><Mill /></Layout>} />
          <Route path="wholesale" element={<Layout><Wholesale /></Layout>} />
          <Route path="cart" element={<Layout><Cart /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SunloomProvider>
    </ConceptShell>
  );
}
