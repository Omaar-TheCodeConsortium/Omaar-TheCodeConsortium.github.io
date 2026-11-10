import { useEffect, useLayoutEffect } from 'react';
import { LIBRARY_PATH } from './registry.js';
import { usePortal } from './portal/portalContext.js';
import './concepts.css';

// Wraps every concept site: applies the brand palette, switches off the main site's page zoom,
// moves focus to the new page and provides the way back to the library.
export default function ConceptShell({ concept, children }) {
  const { exit } = usePortal();

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add('concept-root');
    return () => root.classList.remove('concept-root');
  }, []);

  // Each concept renders its own <main id="concept-main" tabIndex={-1}>; focus moves there on arrival.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById('concept-main')?.focus({ preventScroll: true });
  }, [concept.slug]);

  const handleReturn = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    exit();
  };

  const { paper, ink, loud, onLoud } = concept.palette;

  return (
    <div
      className="concept"
      data-concept={concept.slug}
      style={{
        '--c-paper': paper,
        '--c-ink': ink,
        '--c-loud': loud,
        '--c-on-loud': onLoud,
        '--c-display': concept.display,
      }}
    >
      {children}

      <a className="concept-return" href={LIBRARY_PATH} onClick={handleReturn}>
        <span aria-hidden="true">←</span>
        <span>Concept build by The Code Consortium</span>
      </a>
    </div>
  );
}
