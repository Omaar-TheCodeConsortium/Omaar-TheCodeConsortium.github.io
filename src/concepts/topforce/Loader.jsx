import { useEffect, useRef, useState } from 'react';
import { BARS, COLLAR_WIDTH, LOADER_PLATES, fits, formatKg, loaderPlate, roomOnSleeve, sideThickness, toLb } from './catalog.js';

// The barbell is drawn in millimetres, seen from the front: the bar runs across and every plate
// is edge-on. Both bars are 1,310 mm between the shoulders; the sleeves start 685 mm from the middle.
const SHOULDER = 655;
const SLEEVE_FROM = 685;
const FLOOR = 225;

// Two framings of the same drawing. `whole` shows the bar from tip to tip. `end` stands you next
// to the right-hand sleeve: the frame is as tall as a plate and a bit, and however wide the
// screen allows, so the plates are the size of the screen and the shaft runs out to the left.
const VIEWS = {
  whole: { x: -1140, y: -244, w: 2280, h: 488 },
  end: { x: -1882, y: -290, w: 3000, h: 580 },
};

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

// One plate, edge-on. Rubber plates carry their weight moulded into the rim in kilograms, and in
// pounds a third of the way round; steel change plates have it stamped once.
function Plate({ plate, at, dir, order, intro, onUnload, live }) {
  const { kg, thick, dia } = plate;
  const steel = dia < 450;
  const left = dir > 0 ? 0 : -thick;
  const mid = left + thick / 2;
  const round = steel ? 2 : Math.min(8, thick * 0.26);
  const size = steel ? thick * 0.62 : Math.min(thick * 0.66, 44);
  const wide = thick >= 30;

  const act = onUnload
    ? {
        onClick: onUnload,
        onKeyDown: (event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          onUnload();
        },
      }
    : {};

  return (
    <g className="tf-plate-seat" style={{ transform: `translateX(${dir * at}px)` }}>
      <g
        className="tf-plate"
        style={{ '--dir': dir, animationDelay: intro ? `${260 + order * 110}ms` : undefined }}
        {...(live
          ? { role: 'button', tabIndex: 0, 'aria-label': `Take the ${formatKg(kg)} kilogram plates off`, ...act }
          : { 'aria-hidden': 'true', onClick: onUnload })}
      >
        <rect className="tf-plate-body" x={left} y={-dia / 2} width={thick} height={dia} rx={round} fill={steel ? 'url(#tf-g-steel)' : 'url(#tf-g-rubber)'} />
        {steel && <rect x={left} y={-dia / 2} width={thick} height={dia} rx={round} fill="url(#tf-lathe)" />}
        {/* The rim rounds away at both faces */}
        <rect x={left} y={-dia / 2} width={thick} height={dia} rx={round} fill="url(#tf-g-round)" />
        <text
          className="tf-plate-no"
          transform={`translate(${mid} ${steel ? 0 : -dia * 0.25}) rotate(-90)`}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={size}
          fill={steel ? '#121212' : '#d4f000'}
        >
          {kg}
          {wide && <tspan fontSize={size * 0.46} dx={size * 0.14}>KG</tspan>}
        </text>
        {wide && (
          <text
            className="tf-plate-no"
            transform={`translate(${mid} ${dia * 0.27}) rotate(-90)`}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={size * 0.46}
            fill="rgb(241 239 233 / 0.6)"
          >
            {toLb(kg)} LB
          </text>
        )}
      </g>
    </g>
  );
}

function End({ bar, side, dir, intro, onUnload }) {
  const spec = BARS[bar];
  const tip = spec.length / 2;
  const x = (from, to) => (dir > 0 ? from : -to);
  const stack = sideThickness(side);
  const big = side.some((kg) => loaderPlate(kg).dia === 450);

  return (
    <g>
      {/* Where the stack stands on the floor */}
      {big && <ellipse cx={dir * (SLEEVE_FROM + stack / 2)} cy={FLOOR + 2} rx={stack / 2 + 26} ry="6" fill="url(#tf-g-contact)" />}

      {/* Sleeve: chrome, with fine grooves along it and a snap ring near the tip */}
      <rect x={x(SLEEVE_FROM, tip)} y={-25} width={tip - SLEEVE_FROM} height={50} rx="2.5" fill="url(#tf-g-chrome)" />
      <rect x={x(SLEEVE_FROM, tip - 34)} y={-25} width={tip - 34 - SLEEVE_FROM} height={50} fill="url(#tf-grooves)" />
      <rect x={x(tip - 24, tip - 21)} y={-25} width={3} height={50} fill="rgb(0 0 0 / 0.42)" />
      <rect x={x(tip - 5, tip)} y={-25} width={5} height={50} rx="2.5" fill="rgb(0 0 0 / 0.3)" />

      {/* Shoulder, and the one yellow-green ring every Topforce product carries */}
      <rect x={x(SHOULDER, SLEEVE_FROM)} y={-38} width={SLEEVE_FROM - SHOULDER} height={76} rx="3.5" fill="url(#tf-g-chrome)" />
      <rect x={x(SHOULDER + 13, SHOULDER + 16)} y={-38} width={3} height={76} fill="rgb(0 0 0 / 0.26)" />
      <rect x={x(SHOULDER - 10, SHOULDER)} y={-spec.shaft / 2 - 2.5} width={10} height={spec.shaft + 5} rx="1" fill="url(#tf-g-volt)" />

      {keyed(side).map(({ kg, index, at, key }) => (
        <Plate
          key={key}
          plate={loaderPlate(kg)}
          at={SLEEVE_FROM + at}
          dir={dir}
          order={index}
          intro={intro}
          live={dir > 0 && Boolean(onUnload)}
          onUnload={onUnload ? () => onUnload(index) : undefined}
        />
      ))}

      {/* Collar: a yellow-green clamp with a black lever */}
      <g className="tf-plate-seat" style={{ transform: `translateX(${dir * (SLEEVE_FROM + stack)}px)` }}>
        <rect x={dir > 0 ? 0 : -COLLAR_WIDTH} y={-46} width={COLLAR_WIDTH} height={92} rx="5" fill="url(#tf-g-volt)" />
        <rect x={dir > 0 ? 0 : -COLLAR_WIDTH} y={-46} width={COLLAR_WIDTH} height={92} rx="5" fill="url(#tf-g-round)" opacity="0.5" />
        <rect x={dir > 0 ? 17.5 : -20.5} y={-46} width={3} height={92} fill="rgb(0 0 0 / 0.3)" />
        <rect x={dir > 0 ? 9 : -29} y={-63} width={20} height={21} rx="3" fill="#0b0b0a" />
        <rect x={dir > 0 ? 12 : -26} y={-60} width={14} height={3} rx="1.5" fill="rgb(255 255 255 / 0.22)" />
      </g>
    </g>
  );
}

// The bar. Each plate on the right-hand sleeve is a button that takes that pair off; the same
// can be done from <Ends />, and the weight is always given in text beside the drawing.
export function Barbell({ bar, side, onUnload, view = 'whole', className = '' }) {
  const spec = BARS[bar];
  const frame = VIEWS[view];
  const group = useRef(null);
  const count = useRef(side.length);
  const [intro, setIntro] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntro(false), 1700);
    return () => window.clearTimeout(timer);
  }, []);

  // A plate landing knocks the bar towards the middle and it hops on the floor; one coming off does not.
  useEffect(() => {
    const landed = side.length > count.current;
    count.current = side.length;
    if (!landed || !group.current?.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    group.current.animate(
      [
        { transform: 'translate(0, 0)' },
        { transform: 'translate(-9px, 5px)', offset: 0.3 },
        { transform: 'translate(3px, -3px)', offset: 0.62 },
        { transform: 'translate(-1px, 1px)', offset: 0.84 },
        { transform: 'translate(0, 0)' },
      ],
      { duration: 460, delay: 300, easing: 'cubic-bezier(0.2, 0, 0.3, 1)' },
    );
  }, [side.length]);

  const half = spec.shaft / 2;

  return (
    <svg
      className={`tf-barbell tf-barbell--${view} ${className}`}
      viewBox={`${frame.x} ${frame.y} ${frame.w} ${frame.h}`}
      preserveAspectRatio="xMaxYMid slice"
      role="group"
      aria-label={onUnload ? 'The loaded bar. Choose a plate to take that pair off.' : 'The loaded bar'}
      focusable="false"
    >
      <defs>
        <linearGradient id="tf-g-rubber" gradientUnits="userSpaceOnUse" x1="0" y1="-225" x2="0" y2="225">
          <stop offset="0" stopColor="#2f2f2b" />
          <stop offset="0.045" stopColor="#7a7a6f" />
          <stop offset="0.15" stopColor="#505048" />
          <stop offset="0.5" stopColor="#363631" />
          <stop offset="0.88" stopColor="#222220" />
          <stop offset="1" stopColor="#141413" />
        </linearGradient>
        <linearGradient id="tf-g-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8e8e87" />
          <stop offset="0.14" stopColor="#f4f4ee" />
          <stop offset="0.5" stopColor="#b9b9b1" />
          <stop offset="1" stopColor="#5d5d57" />
        </linearGradient>
        <linearGradient id="tf-g-chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7d7d76" />
          <stop offset="0.2" stopColor="#fbfbf7" />
          <stop offset="0.36" stopColor="#c9c9c2" />
          <stop offset="0.62" stopColor="#8c8c85" />
          <stop offset="0.82" stopColor="#b3b3ac" />
          <stop offset="1" stopColor="#4d4d48" />
        </linearGradient>
        <linearGradient id="tf-g-shaft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2b28" />
          <stop offset="0.22" stopColor="#8a8a81" />
          <stop offset="0.4" stopColor="#4a4a45" />
          <stop offset="0.78" stopColor="#242421" />
          <stop offset="1" stopColor="#151514" />
        </linearGradient>
        <linearGradient id="tf-g-volt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9bf00" />
          <stop offset="0.18" stopColor="#efff7a" />
          <stop offset="0.45" stopColor="#d4f000" />
          <stop offset="1" stopColor="#869900" />
        </linearGradient>
        {/* Darkens both faces of a plate so its rim reads as round, and parts it from its neighbour */}
        <linearGradient id="tf-g-round" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.62" />
          <stop offset="0.16" stopColor="#000" stopOpacity="0" />
          <stop offset="0.84" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.62" />
        </linearGradient>
        <radialGradient id="tf-g-contact">
          <stop offset="0.3" stopColor="#000" stopOpacity="0.85" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tf-g-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e1e1c" />
          <stop offset="1" stopColor="#121212" />
        </linearGradient>
        <pattern id="tf-knurl" width="4.6" height="4.6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0H4.6M0 0V4.6" stroke="rgb(0 0 0 / 0.62)" strokeWidth="1.5" />
          <path d="M0 1.5H4.6M1.5 0V4.6" stroke="rgb(255 255 255 / 0.09)" strokeWidth="0.6" />
        </pattern>
        <pattern id="tf-grooves" width="9" height="50" patternUnits="userSpaceOnUse">
          <rect x="0" width="1.1" height="50" fill="rgb(0 0 0 / 0.13)" />
          <rect x="1.1" width="0.8" height="50" fill="rgb(255 255 255 / 0.28)" />
        </pattern>
        <pattern id="tf-lathe" width="6" height="3.4" patternUnits="userSpaceOnUse">
          <rect width="6" height="0.8" fill="rgb(0 0 0 / 0.1)" />
        </pattern>
      </defs>

      {/* The platform the bar stands on */}
      <rect x={frame.x} y={FLOOR} width={frame.w} height={frame.y + frame.h - FLOOR} fill="url(#tf-g-floor)" />
      <rect className="tf-barbell-floor" x={frame.x} y={FLOOR} width={frame.w} height="2" />

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

// The plates you can load, standing in a row like plates in a storage rack. Each tap puts one on
// each end. `quiet` leaves out the running count of sleeve left and speaks up only when a plate
// will not fit.
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
              data-steel={plate.dia < 450 ? '' : undefined}
              style={{ '--tall': plate.dia === 450 ? 1 : plate.dia / 330, '--thick': plate.thick }}
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
        {full &&
          (quiet
            ? `Sleeve full: a ${formatKg(refused)} kg plate needs ${loaderPlate(refused).thick} mm, ${room} mm left.`
            : `A ${formatKg(refused)} kg plate is ${loaderPlate(refused).thick} mm thick and there is ${room} mm of sleeve left.`)}
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
