import { Suspense, lazy } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BakeryDashboard from './pages/BakeryDashboard';
import HrisDashboard from './pages/HrisDashboard';
import BespokeSalon from './pages/BespokeSalon';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ShowcaseArchive from './pages/ShowcaseArchive';
import ProductPage from './pages/ProductPage';
import PortalProvider from './concepts/portal/PortalProvider.jsx';
import { CONCEPTS, LIBRARY_PATH } from './concepts/registry.js';
import { useSeo } from './seo/useSeo.js';

// The concept section is loaded on demand so the main site's bundle does not grow with it.
const ConceptLibrary = lazy(() => import('./pages/ConceptLibrary.jsx'));
// The project brief is only reached by a link we send, so it is not part of the main bundle either.
const Brief = lazy(() => import('./pages/Brief.jsx'));
// A concept that sits `within` another is served by that concept's own routes.
const conceptRoutes = CONCEPTS.filter((concept) => !concept.within).map((concept) => ({ path: concept.path, Page: lazy(concept.load) }));

// The router itself is supplied by the caller: BrowserRouter in src/main.jsx,
// StaticRouter in src/entry-server.jsx when pages are pre-rendered at build time.
export default function App() {
  useSeo();

  return (
    <PortalProvider>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/spear-os/" element={<ProductPage slug="spear-os" />} />
          <Route path="/products/tea-os/" element={<ProductPage slug="tea-os" />} />
          <Route path="/products/tccos/" element={<ProductPage slug="tccos" />} />
          <Route path="/lab/" element={<ShowcaseArchive />} />
          <Route path="/prototypes" element={<Navigate to="/lab/" replace />} />
          <Route path="/project/bakery-os" element={<BakeryDashboard />} />
          <Route path="/project/hris-command-center" element={<HrisDashboard />} />
          <Route path="/project/bespoke-salon" element={<BespokeSalon />} />
          {/* Old addresses: Spear used to leave for its own site; the project archive is now the Lab. */}
          <Route path="/project/spear" element={<Navigate to="/products/spear-os/" replace />} />
          <Route path="/showcase" element={<Navigate to="/lab/" replace />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/brief/" element={<Brief />} />
          <Route path={LIBRARY_PATH} element={<ConceptLibrary />} />
          {conceptRoutes.map(({ path, Page }) => (
            <Route key={path} path={`${path}*`} element={<Page />} />
          ))}
        </Routes>
      </Suspense>
    </PortalProvider>
  );
}
