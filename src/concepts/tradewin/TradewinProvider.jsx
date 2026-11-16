import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TradewinContext } from './tradewinContext.js';
import { MAX_CARTONS, MAX_QTY, basketTotals, orderTotals, productBySlug, validLine } from './catalog.js';
import { sideOf, twinOf } from './site.js';

const STORAGE_KEY = 'tradewin';
const clamp = (value, max) => Math.max(0, Math.min(Math.round(value), max));

// `lines` is the Direct basket, `order` the trade order in cartons. `ready` turns true once the
// saved state has been read; nothing is written back before then.
function reducer(state, action) {
  switch (action.type) {
    case 'restore':
      return { ready: true, lines: action.lines, order: action.order };
    case 'add': {
      const found = state.lines.find((line) => line.slug === action.slug);
      const qty = clamp((found?.qty ?? 0) + action.qty, MAX_QTY);
      const lines = found
        ? state.lines.map((line) => (line === found ? { ...line, qty } : line))
        : [...state.lines, { slug: action.slug, qty }];
      return { ...state, lines };
    }
    case 'qty':
      return {
        ...state,
        lines: state.lines.map((line) => (line.slug === action.slug ? { ...line, qty: clamp(action.qty, MAX_QTY) } : line)).filter((line) => line.qty > 0),
      };
    case 'cartons': {
      const order = { ...state.order, [action.slug]: clamp(action.cartons, MAX_CARTONS) };
      if (!order[action.slug]) delete order[action.slug];
      return { ...state, order };
    }
    default:
      return state;
  }
}

const validOrder = (order) =>
  Object.fromEntries(
    Object.entries(order && typeof order === 'object' ? order : {}).filter(
      ([slug, cartons]) => productBySlug(slug) && Number.isInteger(cartons) && cartons > 0 && cartons <= MAX_CARTONS,
    ),
  );

export default function TradewinProvider({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const side = sideOf(pathname);
  const [{ ready, lines, order }, dispatch] = useReducer(reducer, { ready: false, lines: [], order: {} });

  // Basket and order live in session storage. They are read only after the first render, so the
  // pre-rendered page and the browser's first paint agree.
  useEffect(() => {
    let saved = {};
    try {
      saved = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? '{}') ?? {};
    } catch {
      // Storage can be unavailable (private windows, blocked site data). The basket then lasts for the visit.
    }
    dispatch({ type: 'restore', lines: Array.isArray(saved.lines) ? saved.lines.filter(validLine) : [], order: validOrder(saved.order) });
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ lines, order }));
    } catch {
      // See above.
    }
  }, [ready, lines, order]);

  // Flipping between Direct and Wholesale keeps you on the same page and at the same scroll
  // position. Where the browser can, the new sheet slides over the old one: the view transition
  // is held open until the new page has been committed (see `landed`).
  const waiting = useRef(null);
  const flip = useCallback(() => {
    const to = twinOf(pathname);
    const go = () => navigate(to, { state: { flipped: true } });
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || still) return go();
    const root = document.documentElement;
    root.dataset.twFlip = sideOf(to);
    const transition = document.startViewTransition(
      () =>
        new Promise((resolve) => {
          waiting.current = resolve;
          go();
          window.setTimeout(resolve, 600);
        }),
    );
    transition.finished.finally(() => delete root.dataset.twFlip);
    return undefined;
  }, [navigate, pathname]);

  const landed = useCallback(() => {
    waiting.current?.();
    waiting.current = null;
  }, []);

  const add = useCallback((slug, qty = 1) => dispatch({ type: 'add', slug, qty }), []);
  const setQty = useCallback((slug, qty) => dispatch({ type: 'qty', slug, qty }), []);
  const setCartons = useCallback((slug, cartons) => dispatch({ type: 'cartons', slug, cartons }), []);

  const value = useMemo(
    () => ({ side, flip, landed, lines, add, setQty, basket: basketTotals(lines), order, setCartons, trade: orderTotals(order) }),
    [side, flip, landed, lines, add, setQty, order, setCartons],
  );

  return <TradewinContext.Provider value={value}>{children}</TradewinContext.Provider>;
}
