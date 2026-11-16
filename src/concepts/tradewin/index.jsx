import '@fontsource-variable/bricolage-grotesque/wdth.css';
import '@fontsource-variable/figtree/index.css';
import './tradewin.css';
import { Link, Route, Routes } from 'react-router-dom';
import { CONCEPTS } from '../registry.js';
import ConceptShell from '../ConceptShell.jsx';
import TradewinProvider from './TradewinProvider.jsx';
import Layout from './Layout.jsx';
import { PRODUCTS } from './catalog.js';
import { useTradewin } from './tradewinContext.js';
import { baseOf } from './site.js';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Product from './pages/Product.jsx';

// One company with two front doors. The consumer shop and the trade counter are one module and
// one mounted tree, so flipping between them changes the page in place.
const concept = CONCEPTS.find((entry) => entry.slug === 'tradewin-direct');

const page = (element) => <Layout>{element}</Layout>;

function NotFound() {
  const { side } = useTradewin();
  return (
    <Layout>
      <section className="tw-lost">
        <h1 className="tw-display">Not on the shelf.</h1>
        <p className="tw-lede">The page you asked for does not exist on this site.</p>
        <Link to={baseOf(side)} className="tw-btn tw-btn--loud">
          Back to the {side === 'trade' ? 'dashboard' : 'shop'}
        </Link>
      </section>
    </Layout>
  );
}

// Direct and trade product routes share a key, so React keeps the page mounted across a flip.
const items = (prefix) =>
  PRODUCTS.map((product) => (
    <Route key={product.slug} path={`${prefix}item/${product.slug}`} element={page(<Product key={product.slug} product={product} />)} />
  ));

export default function Tradewin() {
  return (
    <ConceptShell concept={concept}>
      <TradewinProvider>
        <Routes>
          <Route index element={page(<Home />)} />
          {items('')}
          <Route path="wholesale" element={page(<Dashboard />)} />
          {items('wholesale/')}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TradewinProvider>
    </ConceptShell>
  );
}
