import { createContext, useContext } from 'react';

export const HoxenContext = createContext(null);

export const useHoxen = () => useContext(HoxenContext);
