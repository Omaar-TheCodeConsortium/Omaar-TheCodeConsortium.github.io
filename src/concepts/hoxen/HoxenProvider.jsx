import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { HoxenContext } from './hoxenContext.js';
import { FREE_SHIPPING_FROM, SHIPPING_FLAT, lineKey, linePrice, validLine } from './catalog.js';

const STORAGE_KEY = 'hoxen-bag';

function lineReducer(lines, action) {
  switch (action.type) {
    case 'add': {
      const key = lineKey(action.line);
      if (lines.some((line) => lineKey(line) === key)) {
        return lines.map((line) => (lineKey(line) === key ? { ...line, qty: Math.min(line.qty + action.line.qty, 20) } : line));
      }
      return [...lines, action.line];
    }
    case 'qty':
      return lines.map((line) => (lineKey(line) === action.key ? { ...line, qty: Math.max(1, Math.min(action.qty, 20)) } : line));
    case 'remove':
      return lines.filter((line) => lineKey(line) !== action.key);
    default:
      return lines;
  }
}

// `ready` turns true once the saved bag has been read, and nothing is written back before then.
// Without it the empty starting bag would overwrite the saved one.
function reducer(state, action) {
  if (action.type === 'load') return { ready: true, lines: action.lines };
  return { ...state, lines: lineReducer(state.lines, action) };
}

export default function HoxenProvider({ children }) {
  const [{ ready, lines }, dispatch] = useReducer(reducer, { ready: false, lines: [] });

  // The bag lives in session storage: it survives a reload but is read only after the first
  // render, so the pre-rendered page and the browser's first paint agree.
  useEffect(() => {
    let saved = [];
    try {
      saved = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      // Storage can be unavailable (private windows, blocked site data). The bag then lasts for the visit.
    }
    dispatch({ type: 'load', lines: Array.isArray(saved) ? saved.filter(validLine) : [] });
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // See above.
    }
  }, [ready, lines]);

  const add = useCallback((line) => dispatch({ type: 'add', line: { qty: 1, ...line } }), []);
  const setQty = useCallback((key, qty) => dispatch({ type: 'qty', key, qty }), []);
  const remove = useCallback((key) => dispatch({ type: 'remove', key }), []);

  const value = useMemo(() => {
    const count = lines.reduce((sum, line) => sum + line.qty, 0);
    const subtotal = lines.reduce((sum, line) => sum + linePrice(line) * line.qty, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FLAT;
    return { lines, add, setQty, remove, count, subtotal, shipping };
  }, [lines, add, setQty, remove]);

  return <HoxenContext.Provider value={value}>{children}</HoxenContext.Provider>;
}
