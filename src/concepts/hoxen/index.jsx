import '@fontsource-variable/schibsted-grotesk/index.css';
import { CONCEPTS } from '../registry.js';
import ConceptShell from '../ConceptShell.jsx';
import HoldingPage from '../HoldingPage.jsx';

const concept = CONCEPTS.find((entry) => entry.slug === 'hoxen');

export default function Hoxen() {
  return (
    <ConceptShell concept={concept}>
      <HoldingPage concept={concept} />
    </ConceptShell>
  );
}
