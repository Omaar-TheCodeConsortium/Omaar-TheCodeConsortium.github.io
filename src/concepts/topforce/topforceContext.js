import { createContext, useContext } from 'react';

export const TopforceContext = createContext(null);

export const useTopforce = () => useContext(TopforceContext);
