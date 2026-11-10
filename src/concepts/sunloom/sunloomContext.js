import { createContext, useContext } from 'react';

// dye: the colour the whole site is currently dyed in. cart: lines of { slug, size, dye, qty }.
export const SunloomContext = createContext(null);

export const useSunloom = () => useContext(SunloomContext);

export const lineKey = (line) => `${line.slug}|${line.size}|${line.dye}`;
