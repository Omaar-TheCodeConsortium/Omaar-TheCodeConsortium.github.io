import { useEffect, useRef, useState } from 'react';
import { BARS, COLLAR_WIDTH, LOADER_PLATES, fits, formatKg, loaderPlate, roomOnSleeve, sideThickness } from './catalog.js';

// The barbell is drawn in millimetres, seen from the front: the bar runs across and every plate
// is edge-on. Both bars are 1,310 mm between the shoulders; the sleeves start 685 mm from the middle.
const SHOULDER = 655;
const SLEEVE_FROM = 685;
const HALF_VIEW = 1140;
const FLOOR = 225;

// Each plate keeps its key while others are added or removed, so only a new plate slides on.
// `at` is how far along the sleeve the plate starts, in millimetres.
function keyed(side) {
  const seen = new Map();
  let at = 0;
  return side.map((kg, index) => {
    const nth = seen.get(kg) ?? 0;
    seen.set(kg, nth + 1);
    const plate = { kg, index, at, key: `${kg}-${nth}` };
    at += loaderPlate(kg).thick;
    return plate;
  });
}

function Plate({ plate, at, dir, order, intro, onUnload }) {
  const { kg, thick, dia } = plate;
  const steel = dia < 450;
  const left = dir > 0 ? 0 : -thick;
  const round = steel ? 2.5 : Math.min(9, thick * 0.3);
  return (
    <g className="tf-plate-seat" style={{ transform: `translateX(${dir * at}px)` }}>
      <g
        className="tf-plate"
        style={{ '--dir': dir, animationDelay: intro ? `${180 + order * 90}ms` : undefined }}
        onClick={onUnload}
      >
        <rect x={left} y={-dia / 2} width={thick} height={dia} rx={round} fill={steel ? 'url(#tf-g-steel)' : 'url(#tf-g-rubber)'} />
        <rect
          x={left + 1}
          y={-dia / 2 + 1}
          width={thick - 2}
          height={dia - 2}
          rx={round}
          fill="none"
          stroke={steel ? 'rgb(255 255 255 / 0.5)' : 'rgb(241 239 233 / 0.16)'}
          strokeWidth="2"
        />
        <text
          className="tf-plate-no"
          transform={`translate(${left + thick / 2} 0) rotate(-90)`}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={Math.min(thick * 0.78, 48)}
          fill={steel ? '#121212' : '#d4f000'}
        >
          {kg}
        </text>
      </g>
    </g>
  );
}

function End({ bar, side, dir, intro, onUnload }) {
  const spec = BARS[bar];
  const tip = spec.length / 2;
  const x = (from, to) => (dir > 0 ? from : -to);
  const plates = keyed(side);

  return (
    <g>
      {/* Sleeve, with the turned grooves near its end */}
      <rect x={x(SLEEVE_FROM, tip)} y={-25} width={tip - SLEEVE_FROM} height={50} rx="3" fill="url(#tf-g-chrome)" />
      {[18, 30, 42].map((inset) => (
        <rect key={inset} x={x(tip - inset - 2, tip - inset)} y={-25} width={2} height={50} fill="rgb(0 0 0 / 0.28)" />
      ))}
      {/* Shoulder, and the one yellow-green ring every Topforce product carries */}
      <rect x={x(SHOULDER, SLEEVE_FROM)} y={-38} width={SLEEVE_FROM - SHOULDER} height={76} rx="4" fill="url(#tf-g-chrome)" />
      <rect x={x(SHOULDER - 9, SHOULDER)} y={-spec.shaft / 2 - 2} width={9} height={spec.shaft + 4} fill="#d4f000" />

      {plates.map(({ kg, index, at, key }) => (
        <Plate
          key={key}
          plate={loaderPlate(kg)}
          at={SLEEVE_FROM + at}
          dir={dir}
          order={index}
          intro={intro}
          onUnload={onUnload ? () => onUnload(index) : undefined}
        />
      ))}

      <g className="tf-plate-seat" style={{ transform: `translateX(${dir * (SLEEVE_FROM + sideThickness(side))}px)` }}>
        <rect x={dir > 0 ? 0 : -COLLAR_WIDTH} y={-46} width={COLLAR_WIDTH} height={92} rx="5" fill="url(#tf-g-volt)" />
        <rect x={dir > 0 ? 11 : -27} y={-60} width={16} height={18} rx="3" fill="#0d0d0c" />
      </g>
    </g>
  );
}

// The bar itself. Decorative: the same information is in the text beside it, and plates come
// off through the buttons in <Ends />. Clicking a plate with a mouse takes it off too.
export function Barbell({ bar, side, onUnload, className = '' }) {
  const spec = BARS[bar];
  const group = useRef(null);
  const count = useRef(side.length);
  const [intro, setIntro] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntro(false), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  // A plate landing shakes the bar; one coming off does not.
  useEffect(() => {
    const landed = side.length > count.current;
    count.current = side.length;
    if (!landed || !group.current?.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    group.current.animate(
      [
        { transform: 'translateY(0)' },
        { transform: 'translateY(7px)', offset: 0.55 },
        { transform: 'translateY(-2px)', offset: 0.8 },
        { transform: 'translateY(0)' },
      ],
      { duration: 380, delay: 170, easing: 'cubic-bezier(0.3, 0, 0.3, 1)' },
    );
  }, [side.length]);

  const half = spec.shaft / 2;

  return (
    <svg
      className={`tf-barbell ${className}`}
      viewBox={`${-HALF_VIEW} -244 ${HALF_VIEW * 2} 488`}
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="tf-g-rubber" gradientUnits="userSpaceOnUse" x1="0" y1="-225" x2="0" y2="225">
          <stop offset="0" stopColor="#35352f" />
          <stop offset="0.14" stopColor="#5b5b53" />
          <stop offset="0.4" stopColor="#3a3a35" />
          <stop offset="1" stopColor="#1d1d1b" />
        </linearGradient>
        <linearGradient id="tf-g-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9c9c95" />
          <stop offset="0.2" stopColor="#ecece6" />
          <stop offset="0.55" stopColor="#aeaea7" />
          <stop offset="1" stopColor="#62625c" />
        </linearGradient>
        <linearGradient id="tf-g-chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8d8d86" />
          <stop offset="0.24" stopColor="#f6f6f1" />
          <stop offset="0.5" stopColor="#b4b4ad" />
          <stop offset="1" stopColor="#55554f" />
        </linearGradient>
        <linearGradient id="tf-g-shaft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a36" />
          <stop offset="0.26" stopColor="#77776f" />
          <stop offset="0.55" stopColor="#3b3b37" />
          <stop offset="1" stopColor="#1b1b19" />
        </linearGradient>
        <linearGradient id="tf-g-volt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b4cc00" />
          <stop offset="0.22" stopColor="#e9ff5c" />
          <stop offset="0.55" stopColor="#d4f000" />
          <stop offset="1" stopColor="#8fa300" />
        </linearGradient>
        <pattern id="tf-knurl" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="5" height="5" fill="none" />
          <path d="M0 0H5M0 0V5" stroke="rgb(0 0 0 / 0.55)" strokeWidth="1.6" />
        </pattern>
      </defs>

      <line className="tf-barbell-floor" x1={-HALF_VIEW} x2={HALF_VIEW} y1={FLOOR + 1.5} y2={FLOOR + 1.5} />

      <g ref={group}>
        <rect x={-SHOULDER} y={-half} width={SHOULDER * 2} height={spec.shaft} fill="url(#tf-g-shaft)" />
        {/* Knurling: both grips and, on the 20 kg bar, the centre */}
        {[[-610, -215], [215, 610], ...(bar === 20 ? [[-60, 60]] : [])].map(([from, to]) => (
          <rect key={from} x={from} y={-half} width={to - from} height={spec.shaft} fill="url(#tf-knurl)" />
        ))}
        {[-455, 455].map((ring) => (
          <rect key={ring} x={ring - 4} y={-half} width={8} height={spec.shaft} fill="url(#tf-g-shaft)" />
        ))}

        <End bar={bar} side={side} dir={-1} intro={intro} onUnload={onUnload} />
        <End bar={bar} side={side} dir={1} intro={intro} onUnload={onUnload} />
      </g>
    </svg>
  );
}

// The plates you can tap on. Each tap puts one on each end.
// `quiet` leaves out the running count of sleeve left and speaks up only when a plate will not fit.
export function Tray({ bar, side, onLoad, quiet = false, label = 'Load a plate on each end' }) {
  // The last plate that was refused. The message stays only while that plate still does not fit.
  const [refused, setRefused] = useState(null);
  const room = Math.max(0, roomOnSleeve(bar, side));
  const full = refused !== null && !fits(bar, side, refused);

  return (
    <div className="tf-tray">
      <div className="tf-tray-plates" role="group" aria-label={label}>
        {LOADER_PLATES.map((plate) => {
          const ok = fits(bar, side, plate.kg);
          return (
            <button
              key={plate.kg}
              type="button"
              className="tf-tray-plate"
              aria-disabled={ok ? undefined : 'true'}
              aria-label={`Load two ${formatKg(plate.kg)} kilogram plates`}
              onClick={() => {
                setRefused(ok ? null : plate.kg);
                if (ok) onLoad(plate.kg);
              }}
            >
              <span aria-hidden="true">{plate.kg}</span>
            </button>
          );
        })}
      </div>
      <p className="tf-tray-note" role="status">
        {full && `A ${formatKg(refused)} kg plate is ${loaderPlate(refused).thick} mm thick and there is ${room} mm of sleeve left.`}
        {!full && !quiet && `${room} mm of sleeve left on each end`}
      </p>
    </div>
  );
}

// What is on each end, inside to outside, with a way to take each plate off.
export function Ends({ side, onUnload, onStrip }) {
  if (side.length === 0) return <p className="tf-ends tf-ends--bare">Nothing on the sleeves. The bar alone.</p>;
  return (
    <div className="tf-ends">
      <span className="tf-label">Each end</span>
      <ul>
        {keyed(side).map(({ kg, index, key }) => (
          <li key={key}>
            <button type="button" className="tf-chip" onClick={() => onUnload(index)} aria-label={`Take off the ${formatKg(kg)} kilogram plates`}>
              {kg}
              <span aria-hidden="true">×</span>
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="tf-text-btn" onClick={onStrip}>
        Strip the bar
      </button>
    </div>
  );
}
