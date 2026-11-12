import '@fontsource-variable/mona-sans/wdth.css';
import './grandstar.css';
import { Link, Route, Routes } from 'react-router-dom';
import { CONCEPTS } from '../registry.js';
import ConceptShell from '../ConceptShell.jsx';
import Layout from './Layout.jsx';
import { BASE } from './site.js';
import Home from './pages/Home.jsx';
import Capabilities from './pages/Capabilities.jsx';
import Materials from './pages/Materials.jsx';
import Quote from './pages/Quote.jsx';
import CaseStudy from './pages/CaseStudy.jsx';
import Quality from './pages/Quality.jsx';

const concept = CONCEPTS.find((entry) => entry.slug === 'grandstar');

const page = (element) => <Layout>{element}</Layout>;

function NotFound() {
  return (
    <Layout>
      <section className="gs-hero gs-hero--plain gs-on-navy" style={{ minHeight: '80svh' }}>
        <div className="gs-hero-copy">
          <h1 className="gs-h1">That page is not in the set.</h1>
          <p className="gs-lede">The page you asked for does not exist on this site.</p>
          <div className="gs-hero-actions">
            <Link to={BASE} className="gs-btn">
              Back to the home page
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default function Grandstar() {
  return (
    <ConceptShell concept={concept}>
      <Routes>
        <Route index element={page(<Home />)} />
        <Route path="capabilities" element={page(<Capabilities />)} />
        <Route path="materials" element={page(<Materials />)} />
        <Route path="quote" element={page(<Quote />)} />
        <Route path="case-study" element={page(<CaseStudy />)} />
        <Route path="quality" element={page(<Quality />)} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ConceptShell>
  );
}
