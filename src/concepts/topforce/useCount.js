import { useEffect, useRef, useState } from 'react';

// A number that runs to its new value instead of jumping, like a scale settling.
export function useCount(value, duration = 420) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = from.current;
    if (start === value) return undefined;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    const began = performance.now();
    const tick = (now) => {
      const t = still ? 1 : Math.min(1, (now - began) / duration);
      const eased = 1 - (1 - t) ** 3;
      const current = start + (value - start) * eased;
      from.current = current;
      setShown(t === 1 ? value : current);
      if (t < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [value, duration]);

  return shown;
}
