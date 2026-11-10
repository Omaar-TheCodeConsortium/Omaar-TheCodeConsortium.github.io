import '@fontsource/ibm-plex-sans/latin-400.css';
import '@fontsource/ibm-plex-sans/latin-500.css';
import '@fontsource/ibm-plex-sans/latin-600.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import './grandstar.css';
import { Link, Route, Routes } from 'react-router-dom';
import { CONCEPTS } from '../registry.js';
import ConceptShell from '../ConceptShell.jsx';
import Layout from './Layout.jsx';
import { BASE, pageByKey } from './site.js';
import Home from './pages/Home.jsx';
import Capabilities from './pages/Capabilities.jsx';
import Materials from './pages/Materials.jsx';
import Quote from './pages/Quote.jsx';
import CaseStudy from './pages/CaseStudy.jsx';
import Quality from './pages/Quality.jsx';

const concept = CONCEPTS.find((entry) => entry.slug === 'grandstar');

const page = (key, element) => <Layout page={pageByKey(key)}>{element}</Layout>;

function NotFound() {
  return (
    <Layout page={{ drawingTitle: 'Sheet not found', sheet: 0 }}>
      <section className="gs-wrap py-24">
        <h1 className="gs-h1">That sheet is not in the set.</h1>
        <p className="gs-lede mt-6">The page you asked for does not exist on this site.</p>
        <Link to={BASE} className="gs-btn mt-8">
          Back to the home page
        </Link>
      </section>
    </Layout>
  );
}

export default function Grandstar() {
  return (
    <ConceptShell concept={concept}>
      <Routes>
        <Route index element={page('home', <Home />)} />
        <Route path="capabilities" element={page('capabilities', <Capabilities />)} />
        <Route path="materials" element={page('materials', <Materials />)} />
        <Route path="quote" element={page('quote', <Quote />)} />
        <Route path="case-study" element={page('case-study', <CaseStudy />)} />
        <Route path="quality" element={page('quality', <Quality />)} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ConceptShell>
  );
}
