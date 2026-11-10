import { useCallback, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { PortalContext } from './portalContext.js';
import { CONCEPTS, LIBRARY_PATH, pad2 } from '../registry.js';
import './portal.css';

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Clip the overlay down to the element the visitor clicked, as percentages of the overlay's own box.
// Both rectangles come from the same call, so page zoom cannot skew the result.
function insetFrom(overlay, origin) {
  if (!origin) return 'inset(100% 0% 0% 0%)';
  const o = overlay.getBoundingClientRect();
  const r = origin.getBoundingClientRect();
  const pct = (value, total) => `${Math.max(0, Math.min(100, (value / total) * 100)).toFixed(3)}%`;
  return `inset(${pct(r.top - o.top, o.height)} ${pct(o.right - r.right, o.width)} ${pct(o.bottom - r.bottom, o.height)} ${pct(r.left - o.left, o.width)})`;
}

const sceneFor = (concept) => ({
  background: concept.palette.loud,
  color: concept.palette.onLoud,
  kicker: `Concept ${pad2(concept.order)} / ${concept.category}`,
  title: concept.name,
  footer: `${concept.city} · ${concept.coords}`,
  font: concept.display,
  weight: concept.displayWeight,
});

const HOME_SCENE = {
  background: '#000000',
  color: '#ffffff',
  kicker: 'Returning to',
  title: 'The Code Consortium',
  footer: `Concept Builds · ${pad2(CONCEPTS.length)} concepts`,
  font: "Inter, 'Helvetica Neue', Arial, sans-serif",
  weight: 700,
};

export default function PortalProvider({ children }) {
  const navigate = useNavigate();
  const overlayRef = useRef(null);
  const busyRef = useRef(false);
  const [scene, setScene] = useState(null);

  const travel = useCallback(
    async ({ next, to, origin, load }) => {
      if (busyRef.current) return;
      busyRef.current = true;

      // Start fetching the destination while the overlay is still growing.
      const loading = load ? load().catch(() => null) : Promise.resolve();

      try {
        flushSync(() => setScene(next));
        const overlay = overlayRef.current;
        const chars = overlay.querySelectorAll('[data-portal-char]');
        const lines = overlay.querySelectorAll('[data-portal-line]');
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const { gsap } = await import('gsap');

        if (reduceMotion) {
          gsap.set(overlay, { clipPath: 'none', autoAlpha: 0 });
          await gsap.to(overlay, { autoAlpha: 1, duration: 0.2, ease: 'none' });
          await loading;
          navigate(to);
          await frame();
          await frame();
          await gsap.to(overlay, { autoAlpha: 0, duration: 0.2, ease: 'none' });
          return;
        }

        gsap.set(chars, { yPercent: 115 });
        gsap.set(lines, { autoAlpha: 0 });
        gsap.set(overlay, { autoAlpha: 1, clipPath: insetFrom(overlay, origin) });
        await gsap.to(overlay, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'expo.inOut' });

        await loading;
        // The destination's stylesheet has arrived; give its display face a moment to load
        // so the name is set in the brand's own type.
        const family = next.font.split(',')[0];
        await Promise.race([document.fonts.load(`${next.weight} 1em ${family}`).catch(() => null), wait(900)]);

        gsap.to(lines, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' });
        await gsap.to(chars, { yPercent: 0, duration: 0.7, stagger: 0.022, ease: 'expo.out' });

        navigate(to);
        await frame();
        await frame();
        await wait(320);
        await gsap.to(overlay, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.85, ease: 'expo.inOut' });
      } finally {
        flushSync(() => setScene(null));
        busyRef.current = false;
      }
    },
    [navigate],
  );

  const value = useMemo(
    () => ({
      enter: (concept, origin) => travel({ next: sceneFor(concept), to: concept.path, origin, load: concept.load }),
      exit: () => travel({ next: HOME_SCENE, to: LIBRARY_PATH, origin: null }),
    }),
    [travel],
  );

  return (
    <PortalContext.Provider value={value}>
      {children}
      <div
        ref={overlayRef}
        className="portal-overlay"
        aria-hidden="true"
        style={scene ? { background: scene.background, color: scene.color } : undefined}
      >
        {scene && (
          <div className="portal-inner">
            <p className="portal-meta" data-portal-line>
              {scene.kicker}
            </p>
            <p className="portal-title" style={{ fontFamily: scene.font, fontWeight: scene.weight }}>
              {scene.title.split(' ').map((word, wordIndex) => (
                <span className="portal-word" key={wordIndex}>
                  {word.split('').map((char, charIndex) => (
                    <span className="portal-mask" key={charIndex}>
                      <span data-portal-char>{char}</span>
                    </span>
                  ))}
                </span>
              ))}
            </p>
            <p className="portal-meta" data-portal-line>
              {scene.footer}
            </p>
          </div>
        )}
      </div>
    </PortalContext.Provider>
  );
}
