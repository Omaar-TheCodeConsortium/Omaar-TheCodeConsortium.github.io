import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { SunloomContext, lineKey } from './sunloomContext.js';
import { FREE_SHIPPING_FROM, SHIPPING_FLAT, productBySlug } from './products.js';

const STORAGE_KEY = 'sunloom-bag';

function reducer(lines, action) {
  switch (action.type) {
    case 'load':
      return action.lines;
    case 'add': {
      const key = lineKey(action.line);
      const existing = lines.find((line) => lineKey(line) === key);
      if (existing) {
        return lines.map((line) => (lineKey(line) === key ? { ...line, qty: Math.min(line.qty + action.line.qty, 99) } : line));
      }
      return [...lines, action.line];
    }
    case 'qty':
      return lines.map((line) => (lineKey(line) === action.key ? { ...line, qty: Math.max(1, Math.min(action.qty, 99)) } : line));
    case 'remove':
      return lines.filter((line) => lineKey(line) !== action.key);
    case 'clear':
      return [];
    default:
      return lines;
  }
}

const priceOf = (line) => productBySlug(line.slug)?.sizes.find((size) => size.id === line.size)?.price ?? 0;

export default function SunloomProvider({ children }) {
  const [dye, setDye] = useState('indigo');
  const [lines, dispatch] = useReducer(reducer, []);
  const loaded = useRef(false);

  // The bag lives in session storage: it survives a reload but is read only after the first
  // render, so the pre-rendered page and the browser's first paint agree.
  useEffect(() => {
    try {
      const saved = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? '[]');
      if (Array.isArray(saved)) dispatch({ type: 'load', lines: saved.filter((line) => productBySlug(line.slug)) });
    } catch {
      // Storage can be unavailable (private windows, blocked site data). The bag then lasts for the visit.
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // See above.
    }
  }, [lines]);

  const add = useCallback((line) => dispatch({ type: 'add', line }), []);
  const setQty = useCallback((key, qty) => dispatch({ type: 'qty', key, qty }), []);
  const remove = useCallback((key) => dispatch({ type: 'remove', key }), []);
  const clear = useCallback(() => dispatch({ type: 'clear' }), []);

  const value = useMemo(() => {
    const count = lines.reduce((sum, line) => sum + line.qty, 0);
    const subtotal = lines.reduce((sum, line) => sum + priceOf(line) * line.qty, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FLAT;
    return { dye, setDye, lines, add, setQty, remove, clear, count, subtotal, shipping, priceOf };
  }, [dye, lines, add, setQty, remove, clear]);

  return <SunloomContext.Provider value={value}>{children}</SunloomContext.Provider>;
}
