import '@fontsource-variable/schibsted-grotesk/index.css';
import '@fontsource-variable/martian-mono/wdth.css';
import './hoxen.css';
import { Link, Route, Routes } from 'react-router-dom';
import { CONCEPTS } from '../registry.js';
import ConceptShell from '../ConceptShell.jsx';
import HoxenProvider from './HoxenProvider.jsx';
import Layout from './Layout.jsx';
import { BASE } from './site.js';
import Home from './pages/Home.jsx';
import Charger from './pages/Charger.jsx';
import Compare from './pages/Compare.jsx';
import Compatibility from './pages/Compatibility.jsx';
import Cart from './pages/Cart.jsx';

const concept = CONCEPTS.find((entry) => entry.slug === 'hoxen');

const page = (element) => <Layout>{element}</Layout>;

function NotFound() {
  return (
    <Layout>
      <section className="hx-band grid min-h-[70svh] content-center gap-8">
        <h1 className="hx-h1">Nothing plugged in here.</h1>
        <p className="hx-lede">The page you asked for does not exist on this site.</p>
        <Link to={BASE} className="hx-btn w-fit">
          Back to the home page
        </Link>
      </section>
    </Layout>
  );
}

export default function Hoxen() {
  return (
    <ConceptShell concept={concept}>
      <HoxenProvider>
        <Routes>
          <Route index element={page(<Home />)} />
          <Route path="charger" element={page(<Charger />)} />
          <Route path="compare" element={page(<Compare />)} />
          <Route path="compatibility" element={page(<Compatibility />)} />
          <Route path="cart" element={page(<Cart />)} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HoxenProvider>
    </ConceptShell>
  );
}
