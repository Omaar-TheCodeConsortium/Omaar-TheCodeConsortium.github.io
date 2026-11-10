import '@fontsource-variable/big-shoulders/index.css';
import { CONCEPTS } from '../registry.js';
import ConceptShell from '../ConceptShell.jsx';
import HoldingPage from '../HoldingPage.jsx';

const concept = CONCEPTS.find((entry) => entry.slug === 'topforce');

export default function Topforce() {
  return (
    <ConceptShell concept={concept}>
      <HoldingPage concept={concept} />
    </ConceptShell>
  );
}
