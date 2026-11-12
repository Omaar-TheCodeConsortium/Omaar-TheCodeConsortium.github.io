import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shot } from '../Shot.jsx';
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
            className="bar"
            data-over={values[index] > SPEC ? '' : undefined}
            x={left + band * index + band * 0.2}
            y={top}
            width={band * 0.6}
            height={plotH}
            style={{ transform: `scaleY(${Math.max(values[index] / max, 0.004)})` }}
          />
          <text className="axis-text" x={left + band * index + band / 2} y={height - bottom + 16} textAnchor="middle">
            {station}
          </text>
        </g>
      ))}

      <line x1={left} x2={width - right} y1={y(SPEC)} y2={y(SPEC)} stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 4" />
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
      <section className="gs-hero gs-on-deep !content-start lg:!content-center">
        <Shot
          fill
          eager
          name="case-lid"
          anchor={[0.85, 0.5]}
          alt="A black glass-filled controller lid lying on a granite surface plate with a steel straight edge across its rim"
          pins={[{ x: 63, y: 55.5, dir: 'down', len: 7, value: '0.61 mm', text: 'Bow across the seal face, as the tool arrived' }]}
        />
        <div className="gs-hero-copy">
          <p className="gs-k !text-[0.95rem] !text-[color:var(--accent)]">Case study · E-mobility · 2025</p>
          <h1 className="gs-h1 mt-4 max-w-[13ch]">A glass-filled lid that would not lie flat.</h1>
          <p className="gs-lede max-w-[44ch]">
            A controller lid has to seal to IP67. This one bowed by 0.61 mm across its seal face, and one part in sixteen
            failed the leak test. Six weeks after the tool reached us it measured 0.18 mm.
          </p>
        </div>
      </section>

      <section aria-labelledby="gs-facts" className="gs-band gs-band--tight">
        <h2 id="gs-facts" className="sr-only">
          The job
        </h2>
        <dl className="gs-figs gs-figs--6 gs-figs--small">
          {FACTS.map((fact) => (
            <div key={fact.label} className="border-t-[3px] border-[color:var(--gs-ink)] pt-3">
              <dt className="gs-k">{fact.label}</dt>
              <dd className="gs-bar-title mt-1">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="gs-flatness" className="gs-band gs-on-navy">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div>
            <h2 id="gs-flatness" className="gs-h2">
              The bow, measured
            </h2>
            <p className="gs-lede mt-6 max-w-[44ch]">
              Each bar is the height of the seal face above its datum plane at one of nine stations along the lid.
              Anything above the dashed line leaks.
            </p>
            <div role="group" aria-label="Choose measurement set" className="mt-8 flex flex-wrap gap-2">
              <button type="button" className="gs-chip" aria-pressed={view === 'before'} onClick={() => setView('before')}>
                As received
              </button>
              <button type="button" className="gs-chip" aria-pressed={view === 'after'} onClick={() => setView('after')}>
                After rework
              </button>
            </div>
            <dl className="gs-readout mt-8 max-w-[26rem]" aria-live="polite">
              <div className="!bg-[var(--bar)] !p-[16px_18px_18px]">
                <dt className="gs-k">Peak deviation</dt>
                <dd className="!text-[clamp(2.6rem,4.6vw,4.4rem)]">{Math.max(...PROFILE[view]).toFixed(2)} mm</dd>
              </div>
              <div className="col-span-2">
                <dt className="gs-k">Stations over the limit</dt>
                <dd>{PROFILE[view].filter((value) => value > SPEC).length} of 9</dd>
              </div>
            </dl>
          </div>

          <figure>
            <FlatnessChart view={view} />
            <figcaption className="gs-k mt-4">Seal-face deviation, mean of 30 parts, blue-light scan</figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="gs-what-we-did" className="gs-band">
        <div className="gs-band-head">
          <h2 id="gs-what-we-did" className="gs-h2">
            Six weeks, two trials
          </h2>
          <p className="gs-lede">
            The first rework fixed the flatness and created a cosmetic fault. We include it because that is how tool
            development usually goes.
          </p>
        </div>
        <ol className="gs-bars">
          {TIMELINE.map((step, index) => (
            <li key={step.date} className="gs-bar !items-start md:grid-cols-[4.5rem_11rem_1fr]">
              <p className="gs-bar-fig" aria-hidden="true">
                {index + 1}
              </p>
              <p className="gs-bar-title gs-num md:pt-1">{step.date}</p>
              <div>
                <h3 className="gs-h3">{step.title}</h3>
                <p className="gs-muted mt-2 max-w-[66ch]">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="gs-results" className="gs-band gs-on-deep">
        <div className="gs-band-head">
          <h2 id="gs-results" className="gs-h2">
            Results
          </h2>
          <p className="gs-lede">Before and after, against the customer’s targets.</p>
        </div>
        <ul className="gs-bars">
          {RESULTS.map((row) => (
            <li key={row.measure} className="gs-bar md:grid-cols-[1.5fr_1fr_1.2fr_1fr]">
              <p className="gs-bar-title">{row.measure}</p>
              <p className="gs-num text-[color:var(--fg2)]">
                <span className="gs-k">As received</span>
                {row.before}
              </p>
              <p>
                <span className="gs-k !text-[color:var(--accent)]">After rework</span>
                <span className="gs-bar-fig">{row.after}</span>
              </p>
              <p className="gs-num">
                <span className="gs-k">Target</span>
                {row.target}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-[clamp(48px,6vw,96px)] grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <figure>
            <blockquote className="gs-display !text-[clamp(1.35rem,2.3vw,2.1rem)] !leading-[1.22] !tracking-[-0.015em]" style={{ fontStretch: '110%', fontWeight: 600 }}>
              “We expected to be told the tool was scrap and to pay for a new one. They sent us the scan data, three
              options with prices, and said which one they would choose. The sink marks on the first trial were
              annoying, but they told us before we saw the parts.”
            </blockquote>
            <figcaption className="gs-muted mt-6">
              Head of purchasing at the customer, quoted with permission. The company is not named under our NDA.
            </figcaption>
          </figure>
          <dl className="grid content-start gap-[5px]">
            <div className="gs-bar">
              <dt className="gs-k">Cost of the rework</dt>
              <dd className="gs-bar-fig">$4,850</dd>
            </div>
            <div className="gs-bar">
              <dt className="gs-k">Scrap saved each month</dt>
              <dd className="gs-bar-fig">468 parts</dd>
            </div>
            <div className="gs-bar">
              <dt className="gs-k">Paid back in</dt>
              <dd className="gs-bar-fig">Under 4 months</dd>
            </div>
          </dl>
        </div>
      </section>

      <section aria-labelledby="gs-next" className="gs-band gs-band--tight gs-on-red">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <h2 id="gs-next" className="gs-h2 max-w-[20ch]">
            Have a tool that is giving you trouble, or a part that needs one?
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link to={`${BASE}quote/`} className="gs-btn">
              Price a part
            </Link>
            <Link to={`${BASE}quality/`} className="gs-btn">
              How we inspect
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
