// Technical drawings, drawn in code. PartDrawing is parametric: the quote page feeds it
// live dimensions, the home page uses it as the hero.

import { MOULD_PARTS } from './data.js';

const fmt = (value) => (Number.isInteger(value) ? `${value}.0` : value.toFixed(1));

export function Mark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="15" cy="15" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15 7a8 8 0 0 1 8 8h-8z" fill="#d62b1f" />
      <path d="M15 3v24M3 15h24" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}

function Arrow({ x, y, dir }) {
  const points = {
    left: `${x},${y} ${x + 8},${y - 2.6} ${x + 8},${y + 2.6}`,
    right: `${x},${y} ${x - 8},${y - 2.6} ${x - 8},${y + 2.6}`,
    up: `${x},${y} ${x - 2.6},${y + 8} ${x + 2.6},${y + 8}`,
    down: `${x},${y} ${x - 2.6},${y - 8} ${x + 2.6},${y - 8}`,
  }[dir];
  return <polygon className="arrow" points={points} />;
}

// Horizontal dimension between x1 and x2, drawn at height y with extension lines from `from`.
function HDim({ x1, x2, y, from, label }) {
  const side = y > from ? 1 : -1;
  return (
    <g data-dim>
      <path className="dim" pathLength="1" d={`M${x1} ${from + side * 4}V${y + side * 6}M${x2} ${from + side * 4}V${y + side * 6}M${x1} ${y}H${x2}`} />
      <Arrow x={x1} y={y} dir="left" />
      <Arrow x={x2} y={y} dir="right" />
      <text className="dim-text" x={(x1 + x2) / 2} y={y - 5} textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

// Vertical dimension between y1 and y2, drawn at x with extension lines from `from`.
function VDim({ y1, y2, x, from, label }) {
  const side = x > from ? 1 : -1;
  const mid = (y1 + y2) / 2;
  return (
    <g data-dim>
      <path className="dim" pathLength="1" d={`M${from + side * 4} ${y1}H${x + side * 6}M${from + side * 4} ${y2}H${x + side * 6}M${x} ${y1}V${y2}`} />
      <Arrow x={x} y={y1} dir="up" />
      <Arrow x={x} y={y2} dir="down" />
      <text className="dim-text" x={x - 6} y={mid} textAnchor="middle" transform={`rotate(-90 ${x - 6} ${mid})`}>
        {label}
      </text>
    </g>
  );
}

// Three views of an open housing in third-angle projection: plan above, front below, side to the right.
export function PartDrawing({ length, width, height, wall, title }) {
  const VIEW_W = 560;
  const VIEW_H = 400;
  const GAP = 52;
  const scale = Math.min((VIEW_W - 150 - GAP) / (length + width), (VIEW_H - 96 - GAP) / (width + height));

  const L = length * scale;
  const W = width * scale;
  const H = height * scale;
  const t = Math.max(wall * scale, 1.5);

  const x0 = (VIEW_W - (L + GAP + W)) / 2 + 12;
  const y0 = (VIEW_H - (W + GAP + H)) / 2 - 10;
  const frontY = y0 + W + GAP;
  const sideX = x0 + L + GAP;
  const radius = Math.min(10, W / 6, L / 6);
  const boss = Math.max(Math.min(W, L) * 0.055, 2.2);
  const inset = Math.max(Math.min(W, L) * 0.14, t + boss + 2);
  const bosses = [
    [x0 + inset, y0 + inset],
    [x0 + L - inset, y0 + inset],
    [x0 + inset, y0 + W - inset],
    [x0 + L - inset, y0 + W - inset],
  ];

  return (
    <svg
      className="gs-drawing"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label={
        title ??
        `Dimensioned drawing of a housing ${fmt(length)} by ${fmt(width)} by ${fmt(height)} millimetres with ${fmt(wall)} millimetre walls`
      }
    >
      {/* Plan view */}
      <rect className="outline" pathLength="1" x={x0} y={y0} width={L} height={W} rx={radius} />
      <rect className="thin" x={x0 + t} y={y0 + t} width={L - 2 * t} height={W - 2 * t} rx={Math.max(radius - t, 1)} />
      {bosses.map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <circle className="thin" cx={cx} cy={cy} r={boss * 1.9} />
          <circle className="thin" cx={cx} cy={cy} r={boss} />
        </g>
      ))}
      <path className="centre" d={`M${x0 - 12} ${y0 + W / 2}H${x0 + L + 12}M${x0 + L / 2} ${y0 - 12}V${y0 + W + 12}`} />

      {/* Front view */}
      <rect className="outline" pathLength="1" x={x0} y={frontY} width={L} height={H} />
      <path className="hidden-line" d={`M${x0 + t} ${frontY}V${frontY + H - t}H${x0 + L - t}V${frontY}`} />
      <path className="centre" d={`M${x0 + L / 2} ${frontY - 10}V${frontY + H + 10}`} />

      {/* Side view */}
      <rect className="outline" pathLength="1" x={sideX} y={frontY} width={W} height={H} />
      <path className="hidden-line" d={`M${sideX + t} ${frontY}V${frontY + H - t}H${sideX + W - t}V${frontY}`} />

      <HDim x1={x0} x2={x0 + L} y={frontY + H + 30} from={frontY + H} label={fmt(length)} />
      <VDim y1={y0} y2={y0 + W} x={x0 - 30} from={x0} label={fmt(width)} />
      <VDim y1={frontY} y2={frontY + H} x={sideX + W + 34} from={sideX + W} label={fmt(height)} />

      {/* Wall thickness leader */}
      <g data-dim>
        <path className="dim" pathLength="1" d={`M${x0 + L - t / 2} ${y0 + W * 0.3}L${sideX + 6} ${y0 + W * 0.3 - 22}H${sideX + 30}`} />
        <circle className="arrow" cx={x0 + L - t / 2} cy={y0 + W * 0.3} r="2.2" />
        <text className="dim-text" x={sideX + 34} y={y0 + W * 0.3 - 18}>
          {`WALL ${fmt(wall)}`}
        </text>
      </g>

      <text className="note" x={sideX} y={y0 + W - 16}>
        4× M3 BOSS
      </text>
      <text className="note" x={sideX} y={y0 + W - 2}>
        DIMENSIONS IN MM
      </text>
    </svg>
  );
}

const CALLOUTS = {
  sprue: [260, 44, 300, 14],
  fixed: [420, 100, 486, 84],
  cavity: [348, 140, 486, 140],
  moving: [420, 240, 486, 232],
  cooling: [400, 215, 486, 276],
  ejector: [315, 292, 486, 320],
  guide: [101, 200, 34, 200],
};

// Schematic cross-section through a two-plate mould. `active` dims everything except one region.
export function MouldSection({ active }) {
  return (
    <svg
      className="gs-drawing gs-mould"
      viewBox="0 0 520 400"
      role="img"
      aria-label="Cross-section through a two-plate injection mould, with seven numbered regions"
      data-active={active ?? undefined}
    >
      <defs>
        <pattern id="gs-hatch-a" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="#101b2d" strokeWidth="0.7" />
        </pattern>
        <pattern id="gs-hatch-b" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="#101b2d" strokeWidth="0.7" />
        </pattern>
      </defs>

      <g className="part" data-part="fixed">
        <rect className="outline" x="60" y="30" width="400" height="25" fill="#f5f6f7" />
        <rect className="outline" x="80" y="55" width="360" height="115" fill="url(#gs-hatch-a)" />
      </g>

      <g className="part" data-part="moving">
        <rect className="outline" x="80" y="170" width="360" height="115" fill="url(#gs-hatch-b)" />
        <rect x="170" y="120" width="180" height="50" fill="#f5f6f7" />
        <rect className="outline" x="178" y="128" width="164" height="42" fill="url(#gs-hatch-b)" />
        <rect className="outline" x="80" y="285" width="50" height="60" fill="#f5f6f7" />
        <rect className="outline" x="390" y="285" width="50" height="60" fill="#f5f6f7" />
        <rect className="outline" x="60" y="345" width="400" height="25" fill="#f5f6f7" />
      </g>

      <g className="part" data-part="guide">
        <rect className="outline" x="95" y="55" width="12" height="200" fill="#f5f6f7" />
        <rect className="outline" x="413" y="55" width="12" height="200" fill="#f5f6f7" />
      </g>

      <g className="part" data-part="cooling">
        {[125, 150, 370, 395].map((cx) => (
          <circle key={`f${cx}`} className="outline" cx={cx} cy="88" r="7" fill="#f5f6f7" />
        ))}
        {[130, 215, 260, 305, 400].map((cx) => (
          <circle key={`m${cx}`} className="outline" cx={cx} cy="215" r="7" fill="#f5f6f7" />
        ))}
      </g>

      <g className="part" data-part="ejector">
        <rect className="outline" x="150" y="305" width="220" height="14" fill="#f5f6f7" />
        <rect className="outline" x="150" y="319" width="220" height="14" fill="#f5f6f7" />
        {[202, 237, 283, 318].map((x) => (
          <rect key={x} className="outline" x={x} y="128" width="5" height="177" fill="#f5f6f7" />
        ))}
      </g>

      <g className="part" data-part="cavity">
        <path d="M170 170V120H350V170H342V128H178V170Z" fill="#d62b1f" />
      </g>

      <g className="part" data-part="sprue">
        <polygon points="254,30 266,30 263,120 257,120" fill="#d62b1f" />
      </g>

      {/* Parting line */}
      <path className="centre" d="M40 170H480" />
      <text className="note" x="40" y="164">
        PL
      </text>

      {MOULD_PARTS.map((part, index) => {
        const [x1, y1, x2, y2] = CALLOUTS[part.id];
        return (
          <g key={part.id} className="part" data-part={part.id}>
            <path className="thin" d={`M${x1} ${y1}L${x2} ${y2}`} />
            <circle cx={x1} cy={y1} r="2" fill="#101b2d" />
            <circle cx={x2} cy={y2} r="11" fill="#f5f6f7" stroke="#101b2d" strokeWidth="1" />
            <text x={x2} y={y2 + 4} textAnchor="middle" fontSize="11" fill="#101b2d">
              {index + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
