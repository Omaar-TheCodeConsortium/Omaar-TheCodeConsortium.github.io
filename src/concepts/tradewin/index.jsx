import '@fontsource-variable/bricolage-grotesque/wdth.css';
import '@fontsource-variable/figtree/index.css';
import './store.css';
import { Link, Route, Routes } from 'react-router-dom';
import { CONCEPTS } from '../registry.js';
import ConceptShell from '../ConceptShell.jsx';
import TradewinProvider from './TradewinProvider.jsx';
import Layout from './Layout.jsx';
import { CATEGORIES, PRODUCTS } from './catalog.js';
import { useTradewin } from './tradewinContext.js';
import { baseOf } from './site.js';
import Store from './pages/Store.jsx';
import Product from './pages/Product.jsx';
import Basket from './pages/Basket.jsx';
import Track from './pages/Track.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Terms from './pages/Terms.jsx';

// One company, two sets of prices. The consumer shop and the trade counter are one module and one
// mounted tree, so the switch in the header changes the page in place.
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
          Back to the {side === 'trade' ? 'catalogue' : 'shop'}
        </Link>
      </section>
    </Layout>
  );
}

// Direct and trade routes hold the same elements with the same keys, so React keeps a page mounted
// across a flip and only what it shows changes.
const shelves = (prefix) => [
  <Route key="home" path={prefix || undefined} index={!prefix} element={page(<Store key="home" />)} />,
  ...CATEGORIES.map((category) => (
    <Route key={category.id} path={`${prefix}${category.id}`} element={page(<Store key={category.id} category={category.id} />)} />
  )),
  ...PRODUCTS.map((product) => (
    <Route key={product.slug} path={`${prefix}item/${product.slug}`} element={page(<Product key={product.slug} product={product} />)} />
  )),
];

export default function Tradewin() {
  return (
    <ConceptShell concept={concept}>
      <TradewinProvider>
        <Routes>
          {shelves('')}
          <Route path="basket" element={page(<Basket />)} />
          <Route path="track" element={page(<Track />)} />
          <Route path="delivery" element={page(<Terms />)} />
          {shelves('wholesale/')}
          <Route path="wholesale/order" element={page(<Basket />)} />
          <Route path="wholesale/account" element={page(<Dashboard />)} />
          <Route path="wholesale/terms" element={page(<Terms />)} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TradewinProvider>
    </ConceptShell>
  );
}
