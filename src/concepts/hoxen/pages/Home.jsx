import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Case, Cut, Photo } from '../Media.jsx';
import { cutout } from '../cutouts.js';
import { CASE_COLOURS, CASE_MODELS, CASE_PRICE, CHARGERS, formatPrice } from '../catalog.js';
import { BASE } from '../site.js';

const HERO = CHARGERS[1];

// The four parts the exploded photograph was cut into, back to front. `dx` and `dy` are how far
// each part travels to sit closed inside the shell, in hundredths of the photograph's width.
const PARTS = [
  {
    id: 'part-shell',
    dx: 0,
    dy: 0,
    figure: '58 °C',
    unit: 'at the surface, at full load',
    title: 'Shell and heat spreader',
    text: 'A flame-rated polycarbonate shell with 1.8 mm walls. The aluminium plate behind it carries heat away from the board, so the outside stays cool enough to hold.',
  },
  {
    id: 'part-power',
    dx: -9.2,
    dy: -2.1,
    figure: '93.2%',
    unit: 'efficient at 65 W',
    title: 'Power stage',
    text: 'A copper-wound transformer and three capacitors turn mains voltage into what your devices take. Less than seven per cent of it is lost as heat.',
  },
  {
    id: 'part-ports',
    dx: -17.5,
    dy: -4.4,
    figure: '45 + 20 W',
    unit: 'to two devices at once',
    title: 'Port board',
    text: 'Gallium-nitride switches do the work silicon needed three times the space for. Plug in a second device and the board re-shares the power in under a second.',
  },
  {
    id: 'part-face',
    dx: -27.4,
    dy: -6.3,
    figure: '10,000',
    unit: 'insertions per port',
    title: 'Front plate',
    text: 'Each port has a glass-filled nylon tongue, moulded in orange so you can find it in a dark room. The plate is welded, not glued.',
  },
].map((part) => ({ ...part, box: cutout(part.id) }));

const clamp = (value) => Math.min(1, Math.max(0, value));
const ease = (t) => t * t * (3 - 2 * t);
const OPEN_BY = 0.2; // share of the scroll spent opening the charger

function Teardown() {
  const root = useRef(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const el = root.current;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      const box = el.getBoundingClientRect();
      const progress = clamp(-box.top / (box.height - window.innerHeight));
      el.style.setProperty('--e', still ? '1' : ease(clamp(progress / OPEN_BY)).toFixed(4));
      const after = progress - OPEN_BY - 0.02;
      setStep(after < 0 ? 0 : Math.min(PARTS.length, 1 + Math.floor(after / ((1 - OPEN_BY - 0.02) / PARTS.length))));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={root} className="hx-tear" data-step={step} aria-labelledby="hx-inside">
      <div className="hx-tear-stage">
        <div className="hx-tear-head">
          <h2 id="hx-inside" className="hx-h2">
            What is inside 104 grams
          </h2>
          <p className="hx-tear-count" aria-hidden="true">
            {step === 0 ? 'Scroll to open' : `0${step} / 0${PARTS.length}`}
          </p>
        </div>

        <div className="hx-tear-view" aria-hidden="true">
          <div className="hx-tear-frame">
            {PARTS.map((part, index) => (
              <img
                key={part.id}
                className="hx-part"
                data-part={index + 1}
                src={part.box.src}
                alt=""
                decoding="async"
                style={{
                  '--x': `${part.box.x * 100}%`,
                  '--y': `${part.box.y * 100}%`,
                  '--w': `${part.box.w * 100}%`,
                  '--dx': part.dx,
                  '--dy': part.dy,
                  zIndex: index + 1,
                }}
              />
            ))}
          </div>
        </div>

        <ol className="hx-tear-notes">
          {PARTS.map((part, index) => (
            <li key={part.id} data-on={step === index + 1 ? '' : undefined}>
              <p className="hx-fig">
                {part.figure}
                <small>{part.unit}</small>
              </p>
              <h3 className="hx-h3">{part.title}</h3>
              <p className="hx-muted">{part.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const tallest = Math.max(...CHARGERS.map((charger) => cutout(`charger-${charger.watts}`).h));

const DETAILS = [
  {
    photo: 'port-macro',
    shape: 'square',
    alt: 'Close-up of two USB-C ports with bright orange tongues, set in a textured graphite face',
    value: 'Orange inside',
    text: 'So you can find the port without turning the light on.',
  },
  {
    photo: 'travel',
    shape: 'standard',
    alt: 'A hand dropping the charger into the front pocket of a grey backpack',
    value: '104 g',
    text: 'The prongs fold flat, so it goes in a pocket without tearing it.',
    position: '60% 50%',
  },
  {
    photo: 'wall',
    shape: 'tall',
    alt: 'The charger plugged into the upper outlet of a white wall socket, with one braided cable hanging straight down',
    value: 'One outlet',
    text: 'It sits flush and leaves the socket below it free.',
  },
  {
    photo: 'pcb-macro',
    shape: 'standard',
    alt: 'A black circuit board seen from above, with one square chip at its centre',
    value: '1 chip',
    text: 'One gallium-nitride controller does the switching.',
  },
  {
    photo: 'box',
    shape: 'standard',
    alt: 'The charger in a moulded tray inside a small unprinted grey card box, lid beside it',
    value: '0 g plastic',
    text: 'Ships in unprinted card with a moulded pulp tray.',
  },
];

export default function Home() {
  const [colour, setColour] = useState('signal');
  const chosen = CASE_COLOURS.find((item) => item.id === colour);

  return (
    <>
      <section className="hx-hero">
        <p className="hx-hero-watt" aria-hidden="true">
          <span>65</span>
          <span>W</span>
        </p>
        <div className="hx-hero-product hx-stand">
          <Cut name="charger" eager alt="The Hoxen 65: a compact graphite wall charger with two USB-C ports lined in orange" />
        </div>

        <div className="hx-hero-foot">
          <div>
            <h1 className="hx-h1">
              65 watts.
              <br />
              104 grams.
            </h1>
            <p className="hx-lede mt-5">
              A wall charger that runs a laptop and a phone at the same time, then folds flat and disappears into a
              pocket.
            </p>
          </div>
          <div className="hx-hero-side">
            <p className="hx-hero-specs">
              <span>2 × USB-C</span>
              <span>PD 3.0 + PPS</span>
              <span>52 × 46 × 30 mm</span>
            </p>
            <div className="hx-hero-buy">
              <p className="hx-hero-price">{formatPrice(HERO.price)}</p>
              <Link to={`${BASE}charger/`} className="hx-btn hx-btn--go">
                Configure yours
              </Link>
              <Link to={`${BASE}compatibility/`} className="hx-btn">
                Will it charge mine?
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Teardown />

      <section aria-labelledby="hx-range" className="hx-band hx-band--pale">
        <div className="hx-band-head">
          <h2 id="hx-range" className="hx-h2">
            Four sizes. One design.
          </h2>
          <p className="hx-lede">
            Every Hoxen charger is the same block, grown by one port at a time. Shown here at their true sizes relative
            to each other.{' '}
            <Link to={`${BASE}compare/`} className="hx-link">
              Compare all four
            </Link>
          </p>
        </div>

        <ul className="hx-shelf">
          {CHARGERS.map((charger) => (
            <li key={charger.id}>
              <Link to={`${BASE}charger/?w=${charger.watts}`} className="hx-shelf-item">
                <span className="hx-shelf-stand">
                  <Cut
                    name={`charger-${charger.watts}`}
                    alt={`${charger.name}, front view, ${charger.ports} USB-C ${charger.ports === 1 ? 'port' : 'ports'}`}
                    style={{ '--tall': cutout(`charger-${charger.watts}`).h / tallest }}
                  />
                </span>
                <span className="hx-shelf-label">
                  <span className="hx-shelf-watt">
                    {charger.watts}
                    <small>W</small>
                  </span>
                  <span className="mt-2 block font-bold">
                    {charger.ports} {charger.ports === 1 ? 'port' : 'ports'} · {charger.weight} g · {formatPrice(charger.price)}
                  </span>
                  <span className="hx-muted block text-[0.95rem]">{charger.blurb}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="hx-extras" className="hx-band">
        <div className="hx-band-head">
          <h2 id="hx-extras" className="hx-h2">
            What goes with it
          </h2>
        </div>
        <div className="hx-pair">
          <article className="hx-tile">
            <div className="hx-tile-art">
              <Cut name="cable" alt="A braided graphite USB-C cable in a loose coil, with an orange ring at each connector" />
            </div>
            <div className="grid gap-3 md:grid-cols-[auto_1fr] md:items-end md:gap-10">
              <p className="hx-fig">
                240<small className="text-[0.4em] tracking-normal"> W</small>
              </p>
              <div>
                <h3 className="hx-h3">Braided cable, 1 m or 2 m</h3>
                <p className="hx-muted mt-2 max-w-[44ch]">
                  Nylon braid over a chip-marked 240 W core, bend-tested 30,000 times at the collar. The orange ring
                  tells you which end you are holding. From $9.
                </p>
              </div>
            </div>
          </article>

          <article className="hx-tile">
            <div className="hx-tile-art">
              <Case view="case-angle" tint={chosen.tint} alt={`Hoxen phone case in ${chosen.name}, on a phone, seen from the back`} />
            </div>
            <div className="grid gap-4">
              <div>
                <h3 className="hx-h3">Case in {chosen.name}</h3>
                <p className="hx-muted mt-2">
                  1.4 mm soft-touch shell with a raised lip round the cameras. For {CASE_MODELS.slice(0, -1).join(', ')} and{' '}
                  {CASE_MODELS.at(-1)}. {formatPrice(CASE_PRICE)}.
                </p>
              </div>
              <div className="hx-swatches" role="group" aria-label="Case colour">
                {CASE_COLOURS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="hx-swatch"
                    style={{ '--sw': item.hex }}
                    aria-pressed={colour === item.id}
                    aria-label={item.name}
                    onClick={() => setColour(item.id)}
                  />
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>

      <section aria-labelledby="hx-desk" className="hx-scene">
        <Photo
          name="desk"
          alt="The charger in a white power strip on an oak desk, with braided cables running to a closed laptop and a phone"
        />
        <div className="hx-plate">
          <h2 id="hx-desk" className="hx-h2 !text-[clamp(1.8rem,3.2vw,3.2rem)]">
            45 W to the laptop. 20 W to the phone. One socket.
          </h2>
          <p className="hx-muted mt-4">
            Alone, either port gives the full 65 W. Together they share it, with the larger share going to whichever
            device asks for more.
          </p>
        </div>
      </section>

      <section aria-labelledby="hx-details" className="hx-band">
        <div className="hx-band-head">
          <h2 id="hx-details" className="hx-h2">
            Small things, measured
          </h2>
        </div>
        <ul className="hx-details">
          {DETAILS.map((detail) => (
            <li key={detail.photo} className="hx-detail">
              <Photo name={detail.photo} shape={detail.shape} alt={detail.alt} position={detail.position} />
              <p className="hx-detail-cap">
                <strong>{detail.value}</strong>
                {detail.text}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
