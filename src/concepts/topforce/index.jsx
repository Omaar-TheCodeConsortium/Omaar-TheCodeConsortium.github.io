import '@fontsource-variable/big-shoulders/opsz.css';
import '@fontsource-variable/archivo/wdth.css';
import './topforce.css';
import { Link, Route, Routes } from 'react-router-dom';
import { CONCEPTS } from '../registry.js';
import ConceptShell from '../ConceptShell.jsx';
import TopforceProvider from './TopforceProvider.jsx';
import Layout from './Layout.jsx';
import { PRODUCTS } from './catalog.js';
import { BASE } from './site.js';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import Product from './pages/Product.jsx';
import Build from './pages/Build.jsx';
import Cart from './pages/Cart.jsx';

const concept = CONCEPTS.find((entry) => entry.slug === 'topforce');

const page = (element) => <Layout>{element}</Layout>;

function NotFound() {
  return (
    <Layout>
      <section className="tf-empty">
        <h1 className="tf-mega">No lift.</h1>
        <p className="tf-lede">The page you asked for does not exist on this site.</p>
        <Link to={BASE} className="tf-btn tf-btn--volt">
          Back to the home page
        </Link>
      </section>
    </Layout>
  );
}

export default function Topforce() {
  return (
    <ConceptShell concept={concept}>
      <TopforceProvider>
        <Routes>
          <Route index element={page(<Home />)} />
          <Route path="shop" element={page(<Shop />)} />
          {/* One route per product, each keyed, so the chosen size resets from one product to the next. */}
          {PRODUCTS.map((product) => (
            <Route key={product.slug} path={`shop/${product.slug}`} element={page(<Product key={product.slug} product={product} />)} />
          ))}
          <Route path="build" element={page(<Build />)} />
          <Route path="cart" element={page(<Cart />)} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TopforceProvider>
    </ConceptShell>
  );
}
