import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE } from '../site.js';

const FACTS = [
  { label: 'Customer', value: 'E-bike drive maker, Bavaria' },
  { label: 'Part', value: 'Motor controller lid' },
  { label: 'Size', value: '186 × 94 × 22 mm' },
  { label: 'Material', value: 'PA66 GF30, black' },
  { label: 'Tool', value: '2-cavity H13, 250 t press' },
  { label: 'Volume', value: '9,000 parts a month' },
];

// Flatness of the seal face, measured at nine stations along the 186 mm axis (mm from datum plane).
const STATIONS = [0, 23, 46, 70, 93, 116, 140, 163, 186];
const PROFILE = {
  before: [0.0, 0.21, 0.4, 0.55, 0.61, 0.56, 0.42, 0.2, 0.0],
  after: [0.0, 0.07, 0.12, 0.16, 0.18, 0.15, 0.13, 0.06, 0.0],
};
const SPEC = 0.25;

const RESULTS = [
  { measure: 'Seal-face flatness, mean', before: '0.61 mm', after: '0.18 mm', target: '≤ 0.25 mm' },
  { measure: 'Process capability on flatness', before: 'Cpk 0.41', after: 'Cpk 1.72', target: '≥ 1.33' },
  { measure: 'Scrap at leak test', before: '6.1%', after: '0.9%', target: '< 1.5%' },
  { measure: 'Cycle time', before: '41 s', after: '33 s', target: 'No target set' },
];

const TIMELINE = [
  { date: '3 March 2025', title: 'Tool arrives', text: 'The mould was transferred from the customer’s previous supplier. We ran 30 shots at their settings and scanned every part to fix a baseline.' },
  { date: '7 March', title: 'Cause found', text: 'Fill simulation matched the scans. A single gate on the short edge was laying the glass fibres along the lid, so it shrank less lengthwise than across and bowed.' },
  { date: '12 March', title: 'Proposal signed off', text: 'Move the gate to the centre through a short hot drop, add two ribs across the lid, and replace the steel core insert with a copper-alloy one on its own cooling circuit.' },
  { date: '26 March', title: 'First trial after rework', text: 'Flatness came in at 0.22 mm, inside the limit. The ribs, at 6 mm tall, left faint sink lines on the outer face.' },
  { date: '2 April', title: 'Second trial', text: 'Ribs cut down to 4 mm, which removed the sink. A sixteen-run study on packing pressure and mould temperature settled the process at 0.18 mm.' },
  { date: '14 April', title: 'Production released', text: 'PPAP level 3 approved by the customer. The first 9,000 parts shipped by sea on 28 April.' },
];

const CHART = { width: 600, height: 300, left: 52, right: 16, top: 20, bottom: 40, max: 0.7 };

function FlatnessChart({ view }) {
  const { width, height, left, right, top, bottom, max } = CHART;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const band = plotW / STATIONS.length;
  const y = (value) => top + plotH * (1 - value / max);
  const values = PROFILE[view];
  const peak = Math.max(...values);

  return (
    <svg
      className="gs-chart"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Seal-face deviation at nine stations along the lid, ${view} the rework. Peak ${peak.toFixed(2)} millimetres against a limit of ${SPEC} millimetres.`}
    >
      {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7].map((tick) => (
        <g key={tick}>
          <line className="grid" x1={left} x2={width - right} y1={y(tick)} y2={y(tick)} />
          <text className="axis-text" x={left - 8} y={y(tick) + 3} textAnchor="end">
            {tick.toFixed(1)}
          </text>
        </g>
      ))}

      {STATIONS.map((station, index) => (
        <g key={station}>
          {/* Bars are full height and scaled, so the change between views can be animated. */}
          <rect
            x={left + band * index + band * 0.2}
            y={top}
            width={band * 0.6}
            height={plotH}
            fill={values[index] > SPEC ? '#d62b1f' : '#101b2d'}
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'bottom',
              transform: `scaleY(${Math.max(values[index] / max, 0.004)})`,
              transition: 'transform 500ms cubic-bezier(0.25, 0.1, 0.25, 1), fill 300ms linear',
            }}
          />
          <text className="axis-text" x={left + band * index + band / 2} y={height - bottom + 16} textAnchor="middle">
            {station}
          </text>
        </g>
      ))}

      <line x1={left} x2={width - right} y1={y(SPEC)} y2={y(SPEC)} stroke="#101b2d" strokeWidth="1.2" strokeDasharray="6 4" />
      <text className="cross-text" x={width - right} y={y(SPEC) - 6} textAnchor="end">
        LIMIT 0.25
      </text>
      <text className="axis-text" x={width - right} y={height - 4} textAnchor="end">
        POSITION ALONG LID, MM
      </text>
      <text className="axis-text" x={left} y={12}>
        DEVIATION, MM
      </text>
    </svg>
  );
}

export default function CaseStudy() {
  const [view, setView] = useState('before');

  return (
    <>
      <section className="gs-wrap py-12 md:py-20">
        <p className="gs-label">Case study · E-mobility · 2025</p>
        <h1 className="gs-h1 mt-4 max-w-[20ch]">A glass-filled lid that would not lie flat.</h1>
        <p className="gs-lede mt-6">
          A controller lid has to seal to IP67. This one bowed by 0.61 mm across its seal face, and one part in sixteen
          failed the leak test. Six weeks after the tool reached us it measured 0.18 mm.
        </p>

        <dl className="mt-10 grid grid-cols-2 border-t border-[color:var(--gs-line-strong)] md:grid-cols-3 lg:grid-cols-6">
          {FACTS.map((fact) => (
            <div key={fact.label} className="border-b border-[color:var(--gs-line)] py-4 pr-4">
              <dt className="gs-label">{fact.label}</dt>
              <dd className="mt-1 text-[0.98rem] font-medium leading-snug">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="gs-flatness" className="border-y border-[color:var(--gs-line-strong)] bg-[var(--gs-sheet)]">
        <div className="gs-wrap grid items-start gap-10 py-16 md:py-24 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div>
            <h2 id="gs-flatness" className="gs-h2">
              The bow, measured
            </h2>
            <p className="gs-muted mt-5 max-w-[44ch]">
              Each bar is the height of the seal face above its datum plane at one of nine stations along the lid.
              Anything above the dashed line leaks.
            </p>
            <div role="group" aria-label="Choose measurement set" className="mt-7 flex gap-2">
              <button type="button" className="gs-chip" aria-pressed={view === 'before'} onClick={() => setView('before')}>
                As received
              </button>
              <button type="button" className="gs-chip" aria-pressed={view === 'after'} onClick={() => setView('after')}>
                After rework
              </button>
            </div>
            <p className="gs-data mt-6 text-[0.9rem]" aria-live="polite">
              Peak deviation {Math.max(...PROFILE[view]).toFixed(2)} mm ·{' '}
              {PROFILE[view].filter((value) => value > SPEC).length} of 9 stations over the limit
            </p>
          </div>

          <figure className="gs-sheet !bg-white p-4 md:p-6">
            <FlatnessChart view={view} />
            <figcaption className="gs-label mt-3 border-t border-[color:var(--gs-line)] pt-3">
              Fig. 4 · Seal-face deviation, mean of 30 parts, blue-light scan
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="gs-what-we-did" className="gs-wrap grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <h2 id="gs-what-we-did" className="gs-h2">
            Six weeks, two trials
          </h2>
          <p className="gs-muted mt-5 max-w-[42ch]">
            The first rework fixed the flatness and created a cosmetic fault. We include it because that is how tool
            development usually goes.
          </p>
        </div>
        <ol className="border-t border-[color:var(--gs-line-strong)]">
          {TIMELINE.map((step) => (
            <li
              key={step.date}
              className="grid gap-x-8 gap-y-1 border-b border-[color:var(--gs-line)] py-5 sm:grid-cols-[9.5rem_1fr]"
            >
              <p className="gs-data pt-0.5 text-[0.88rem] text-[color:var(--gs-ink-2)]">{step.date}</p>
              <div>
                <h3 className="gs-h3">{step.title}</h3>
                <p className="gs-muted mt-1 max-w-[62ch]">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="gs-results" className="border-y border-[color:var(--gs-line-strong)] bg-[var(--gs-sheet)]">
        <div className="gs-wrap py-16 md:py-24">
          <h2 id="gs-results" className="gs-h2">
            Results
          </h2>
          <div className="gs-table-scroll mt-8">
            <table className="gs-table min-w-[640px]">
              <caption className="gs-label">Before and after, against the customer’s targets</caption>
              <thead>
                <tr>
                  <th scope="col">Measure</th>
                  <th scope="col" className="gs-num">
                    As received
                  </th>
                  <th scope="col" className="gs-num">
                    After rework
                  </th>
                  <th scope="col" className="gs-num">
                    Target
                  </th>
                </tr>
              </thead>
              <tbody>
                {RESULTS.map((row) => (
                  <tr key={row.measure}>
                    <th scope="row">{row.measure}</th>
                    <td className="gs-num">{row.before}</td>
                    <td className="gs-num font-medium">{row.after}</td>
                    <td className="gs-num text-[color:var(--gs-ink-2)]">{row.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <figure>
              <blockquote className="text-[clamp(1.25rem,2.2vw,1.7rem)] font-medium leading-[1.3] tracking-[-0.01em]">
                “We expected to be told the tool was scrap and to pay for a new one. They sent us the scan data, three
                options with prices, and said which one they would choose. The sink marks on the first trial were
                annoying, but they told us before we saw the parts.”
              </blockquote>
              <figcaption className="gs-muted mt-5">
                Head of purchasing at the customer, quoted with permission. The company is not named under our NDA.
              </figcaption>
            </figure>
            <dl className="border-t border-[color:var(--gs-line-strong)]">
              <div className="border-b border-[color:var(--gs-line)] py-4">
                <dt className="gs-label">Cost of the rework</dt>
                <dd className="gs-data mt-1 text-2xl font-medium">$4,850</dd>
              </div>
              <div className="border-b border-[color:var(--gs-line)] py-4">
                <dt className="gs-label">Scrap saved each month</dt>
                <dd className="gs-data mt-1 text-2xl font-medium">468 parts</dd>
              </div>
              <div className="border-b border-[color:var(--gs-line)] py-4">
                <dt className="gs-label">Paid back in</dt>
                <dd className="gs-data mt-1 text-2xl font-medium">Under 4 months</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="gs-next" className="gs-wrap flex flex-col justify-between gap-8 py-16 md:flex-row md:items-end md:py-20">
        <h2 id="gs-next" className="gs-h2 max-w-[22ch]">
          Have a tool that is giving you trouble, or a part that needs one?
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link to={`${BASE}quote/`} className="gs-btn gs-btn--primary">
            Price a part
          </Link>
          <Link to={`${BASE}quality/`} className="gs-btn">
            How we inspect
          </Link>
        </div>
      </section>
    </>
  );
}
