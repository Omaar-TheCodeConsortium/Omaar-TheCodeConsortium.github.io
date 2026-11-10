import '@fontsource-variable/bricolage-grotesque/index.css';
import { useLocation } from 'react-router-dom';
import { CONCEPTS, findConceptByPath } from '../registry.js';
import ConceptShell from '../ConceptShell.jsx';
import HoldingPage from '../HoldingPage.jsx';

const direct = CONCEPTS.find((entry) => entry.slug === 'tradewin-direct');

// One company with two front doors: the consumer shop and the trade portal share this module.
export default function Tradewin() {
  const { pathname } = useLocation();
  const concept = findConceptByPath(pathname) ?? direct;

  return (
    <ConceptShell concept={concept}>
      <HoldingPage concept={concept} />
    </ConceptShell>
  );
}
