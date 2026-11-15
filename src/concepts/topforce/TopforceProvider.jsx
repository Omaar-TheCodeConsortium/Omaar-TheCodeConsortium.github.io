import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { TopforceContext } from './topforceContext.js';
import { BARS, DEFAULT_LOAD, MAX_QTY, fits, lineKey, loaderPlate, sideForTarget, sortSide, totals, validLine } from './catalog.js';

const STORAGE_KEY = 'topforce-cart';

function lineReducer(lines, action) {
  switch (action.type) {
    case 'add': {
      let next = lines;
      for (const line of action.lines) {
        const key = lineKey(line);
        next = next.some((item) => lineKey(item) === key)
          ? next.map((item) => (lineKey(item) === key ? { ...item, qty: Math.min(item.qty + line.qty, MAX_QTY) } : item))
          : [...next, line];
      }
      return next;
    }
    case 'qty':
      return lines.map((line) => (lineKey(line) === action.key ? { ...line, qty: Math.max(1, Math.min(action.qty, MAX_QTY)) } : line));
    case 'remove':
      return lines.filter((line) => lineKey(line) !== action.key);
    default:
      return lines;
  }
}

// The barbell on the home page and in the set builder is one bar: what you load on one page is
// still on it when you reach the other. `side` lists the plates on one end, inside to outside.
function loadReducer(load, action) {
  switch (action.type) {
    case 'plate':
      return fits(load.bar, load.side, action.kg) ? { ...load, side: sortSide([...load.side, action.kg]) } : load;
    case 'unload':
      return { ...load, side: load.side.filter((_, index) => index !== action.index) };
    case 'strip':
      return { ...load, side: [] };
    case 'side':
      return { ...load, side: action.side };
    case 'bar': {
      // A shorter sleeve may not hold everything: plates come off from the outside until it does.
      const side = [];
      for (const kg of load.side) if (fits(action.bar, side, kg)) side.push(kg);
      return { bar: action.bar, side };
    }
    default:
      return load;
  }
}

// `ready` turns true once the saved cart has been read, and nothing is written back before then.
// Without it the empty starting cart would overwrite the saved one.
function reducer(state, action) {
  if (action.type === 'restore') return { ...state, ready: true, lines: action.lines, load: action.load ?? state.load };
  return { ...state, lines: lineReducer(state.lines, action), load: loadReducer(state.load, action) };
}

const validLoad = (load) =>
  Boolean(load) && Boolean(BARS[load.bar]) && Array.isArray(load.side) && load.side.every((kg) => Boolean(loaderPlate(kg)));

export default function TopforceProvider({ children }) {
  const [{ ready, lines, load }, dispatch] = useReducer(reducer, { ready: false, lines: [], load: DEFAULT_LOAD });

  // Cart and bar live in session storage: they survive a reload but are read only after the
  // first render, so the pre-rendered page and the browser's first paint agree.
  useEffect(() => {
    let saved = {};
    try {
      saved = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? '{}') ?? {};
    } catch {
      // Storage can be unavailable (private windows, blocked site data). The cart then lasts for the visit.
    }
    dispatch({
      type: 'restore',
      lines: Array.isArray(saved.lines) ? saved.lines.filter(validLine) : [],
      load: validLoad(saved.load) ? saved.load : null,
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ lines, load }));
    } catch {
      // See above.
    }
  }, [ready, lines, load]);

  const add = useCallback((...items) => dispatch({ type: 'add', lines: items.map((line) => ({ qty: 1, ...line })) }), []);
  const setQty = useCallback((key, qty) => dispatch({ type: 'qty', key, qty }), []);
  const remove = useCallback((key) => dispatch({ type: 'remove', key }), []);
  const loadPlate = useCallback((kg) => dispatch({ type: 'plate', kg }), []);
  const unloadPlate = useCallback((index) => dispatch({ type: 'unload', index }), []);
  const strip = useCallback(() => dispatch({ type: 'strip' }), []);
  const setBar = useCallback((bar) => dispatch({ type: 'bar', bar }), []);
  const loadTo = useCallback((bar, target) => dispatch({ type: 'side', side: sideForTarget(bar, target) }), []);

  const value = useMemo(
    () => ({ lines, add, setQty, remove, ...totals(lines), load, loadPlate, unloadPlate, strip, setBar, loadTo }),
    [lines, add, setQty, remove, load, loadPlate, unloadPlate, strip, setBar, loadTo],
  );

  return <TopforceContext.Provider value={value}>{children}</TopforceContext.Provider>;
}
