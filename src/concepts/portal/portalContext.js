import { createContext, useContext } from 'react';

// enter(concept, originElement): travel from the library into a concept site.
// exit(): travel from a concept site back to the library.
export const PortalContext = createContext({
  enter: () => {},
  exit: () => {},
});

export const usePortal = () => useContext(PortalContext);
