import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { PartDrawing } from '../drawings.jsx';
import {
  CAVITIES,
  COMPLEXITY,
  DEFAULT_INPUT,
  FINISHES,
  LIMITS,
  MOULDING_MATERIALS,
  PRINT_MATERIALS,
  QUOTE_PROCESSES,
  costCurve,
  costPerPart,
  crossover,
  dfmNotes,
  formatInt,
  formatUsd,
  quote,
} from '../quoteModel.js';

const usd0 = (value) => formatUsd(value, 0);
const usdAuto = (value) => formatUsd(value);
const days = (value) => formatInt(value);

// A figure that counts to its new value instead of jumping. The rendered text is set once and
// then driven by the tween, so React never overwrites it mid-count.
function Figure({ value, format }) {
  const ref = useRef(null);
  const shown = useRef(value);
  const [initial] = useState(() => format(value));

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      shown.current = value;
      el.textContent = format(value);
      return undefined;
    }
    const state = { v: shown.current };
    const tween = gsap.to(state, {
      v: value,
      duration: 0.35,
      ease: 'power2.out',
      onUpdate: () => {
        shown.current = state.v;
        el.textContent = format(state.v);
      },
    });
    return () => tween.kill();
  }, [value, format]);

  return <span ref={ref}>{initial}</span>;
}

// Quantity runs from 1 to 200,000, so its slider works on a log scale.
const SLIDER_STEPS = 1000;
const qtySpan = Math.log10(LIMITS.quantity.max / LIMITS.quantity.min);
const sliderToQty = (position) => {
  const raw = LIMITS.quantity.min * 10 ** ((position / SLIDER_STEPS) * qtySpan);
  if (raw < 100) return Math.round(raw);
  const magnitude = 10 ** (Math.floor(Math.log10(raw)) - 1);
  return Math.round(raw / magnitude) * magnitude;
};
const qtyToSlider = (quantity) => Math.round((Math.log10(quantity / LIMITS.quantity.min) / qtySpan) * SLIDER_STEPS);

const clamp = (value, { min, max }) => Math.min(max, Math.max(min, value));

function DimensionField({ id, label, value, limits, onChange }) {
  return (
    <div className="gs-field">
      <label htmlFor={id} className="gs-label">
        {label}, mm
      </label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        className="gs-input"
        min={limits.min}
        max={limits.max}
        step={limits.step}
        value={value}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (Number.isFinite(next) && event.target.value !== '') onChange(clamp(next, limits));
        }}
      />
      <input
        type="range"
        className="gs-range"
        aria-label={`${label} slider`}
        min={limits.min}
        max={limits.max}
        step={limits.step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

const CHART = { width: 600, height: 320, left: 54, right: 18, top: 18, bottom: 38 };
const X_TICKS = [1, 10, 100, 1000, 10000, 100000];
const tickLabel = (value) => (value >= 1000 ? `${value / 1000}k` : `${value}`);

function CostChart({ curve, quantity, selected, crossAt, printName }) {
  const { width, height, left, right, top, bottom } = CHART;
  const values = curve.flatMap((point) => [point.moulding, point.printing]).filter((value) => value !== null);
  const yMin = 10 ** Math.floor(Math.log10(Math.max(Math.min(...values), 0.01)));
  const yMax = 10 ** Math.ceil(Math.log10(Math.min(Math.max(...values), 100000)));

  const x = (q) => left + (Math.log10(q) / Math.log10(LIMITS.quantity.max)) * (width - left - right);
  const y = (cost) => {
    const clamped = Math.min(Math.max(cost, yMin), yMax);
    return top + (1 - (Math.log10(clamped) - Math.log10(yMin)) / (Math.log10(yMax) - Math.log10(yMin))) * (height - top - bottom);
  };
  const path = (key) =>
    curve
      .filter((point) => point[key] !== null)
      .map((point, index) => `${index === 0 ? 'M' : 'L'}${x(point.quantity).toFixed(1)} ${y(point[key]).toFixed(1)}`)
      .join('');

  const yTicks = [];
  for (let tick = yMin; tick <= yMax * 1.001; tick *= 10) yTicks.push(tick);

  const crossCost = crossAt ? costPerPart({ ...selected.input }, crossAt).moulding : null;

  return (
    <svg
      className="gs-chart"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Cost per part against order quantity, on logarithmic axes, for injection moulding with tooling included and for ${printName} printing`}
    >
      {yTicks.map((tick) => (
        <g key={tick}>
          <line className="grid" x1={left} x2={width - right} y1={y(tick)} y2={y(tick)} />
          <text className="axis-text" x={left - 8} y={y(tick) + 3} textAnchor="end">
            {tick >= 1 ? `$${formatInt(tick)}` : `$${tick}`}
          </text>
        </g>
      ))}
      {X_TICKS.map((tick) => (
        <g key={tick}>
          <line className="grid" x1={x(tick)} x2={x(tick)} y1={top} y2={height - bottom} />
          <text className="axis-text" x={x(tick)} y={height - bottom + 16} textAnchor="middle">
            {tickLabel(tick)}
          </text>
        </g>
      ))}
      <text className="axis-text" x={width - right} y={height - 4} textAnchor="end">
        ORDER QUANTITY, PIECES
      </text>

      <path className="curve-printing" d={path('printing')} />
      <path className="curve-moulding" d={path('moulding')} />

      {crossAt && crossAt > 1 && crossCost !== null && (
        <g>
          <circle cx={x(crossAt)} cy={y(crossCost)} r="5" fill="none" stroke="#101b2d" strokeWidth="1.4" />
          <text
            className="cross-text"
            x={x(crossAt) + (x(crossAt) > width * 0.6 ? -10 : 10)}
            y={y(crossCost) - 10}
            textAnchor={x(crossAt) > width * 0.6 ? 'end' : 'start'}
          >
            {`Break-even: ${formatInt(crossAt)} pcs`}
          </text>
        </g>
      )}

      <line className="marker-line" x1={x(quantity)} x2={x(quantity)} y1={top} y2={height - bottom} />
      {selected.cost !== null && <circle className="marker-dot" cx={x(quantity)} cy={y(selected.cost)} r="5.5" />}
    </svg>
  );
}

// A stable reference for the mock request, derived from the configuration.
function referenceFor(input) {
  const text = JSON.stringify(input);
  let hash = 7;
  for (let index = 0; index < text.length; index += 1) hash = (hash * 31 + text.charCodeAt(index)) % 9000;
  return `GQ-2611-${String(hash + 1000)}`;
}

export default function Quote() {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [sent, setSent] = useState(false);

  const set = (patch) => {
    setInput((current) => ({ ...current, ...patch }));
    setSent(false);
  };

  const process = QUOTE_PROCESSES.find((item) => item.id === input.process);
  const isMoulding = process.kind === 'moulding';

  const result = useMemo(() => quote(input), [input]);
  const curve = useMemo(() => costCurve(input), [input]);
  const crossAt = useMemo(() => crossover(input), [input]);
  const notes = useMemo(() => dfmNotes(input, result), [input, result]);
  const perPart = useMemo(() => costPerPart(input, input.quantity), [input]);

  const printName = perPart.printProcess.toUpperCase();
  const orderTotal = result.tooling + result.unitPrice * input.quantity;
  const selectedCost = isMoulding ? perPart.moulding : perPart.printing;

  const verdict = (() => {
    if (perPart.moulding === null) return 'This part is too large to mould in the cavity count chosen, so only the printed price is shown.';
    if (crossAt === null) return `Across the whole range, ${printName} printing stays cheaper per part than moulding for this part.`;
    if (crossAt <= 1) return 'Moulding is cheaper per part at any quantity for this part.';
    const cheaper = input.quantity >= crossAt ? 'moulding' : `${printName} printing`;
    return `Moulding becomes cheaper than ${printName} printing from ${formatInt(crossAt)} pieces. At ${formatInt(input.quantity)}, ${cheaper} is the lower-cost route.`;
  })();

  return (
    <>
      <section className="gs-wrap py-12 md:py-16">
        <h1 className="gs-h1 max-w-[16ch]">Price a part in two minutes.</h1>
        <p className="gs-lede mt-6">
          Describe the part as a box with walls. The estimate updates as you type and is usually within 15% of our
          formal quotation, which we send after an engineer has seen your CAD.
        </p>
      </section>

      <section aria-labelledby="gs-configure" className="border-t border-[color:var(--gs-line-strong)] bg-[var(--gs-sheet)]">
        <div className="gs-wrap grid items-start gap-12 py-12 md:py-16 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <form onSubmit={(event) => event.preventDefault()} className="grid gap-10">
            <h2 id="gs-configure" className="sr-only">
              Configure the part
            </h2>

            <fieldset>
              <legend className="gs-h3">1. Process</legend>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {QUOTE_PROCESSES.map((item) => (
                  <label key={item.id} className="gs-option">
                    <input
                      type="radio"
                      name="process"
                      value={item.id}
                      checked={input.process === item.id}
                      onChange={() => set({ process: item.id })}
                    />
                    <span className="font-medium">{item.name}</span>
                    <span className="gs-muted text-[0.88rem]">{item.hint}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="gs-h3">2. Size</legend>
              <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3">
                <DimensionField id="gs-length" label="Length" value={input.length} limits={LIMITS.length} onChange={(length) => set({ length })} />
                <DimensionField id="gs-width" label="Width" value={input.width} limits={LIMITS.width} onChange={(width) => set({ width })} />
                <DimensionField id="gs-height" label="Height" value={input.height} limits={LIMITS.height} onChange={(height) => set({ height })} />
                <DimensionField id="gs-wall" label="Wall" value={input.wall} limits={LIMITS.wall} onChange={(wall) => set({ wall })} />
              </div>
            </fieldset>

            <fieldset>
              <legend className="gs-h3">3. Material{isMoulding ? ' and tool' : ''}</legend>
              {isMoulding ? (
                <div className="mt-4 grid gap-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="gs-field">
                      <label htmlFor="gs-material" className="gs-label">
                        Resin
                      </label>
                      <select
                        id="gs-material"
                        className="gs-select"
                        value={input.material}
                        onChange={(event) => set({ material: event.target.value })}
                      >
                        {MOULDING_MATERIALS.map((material) => (
                          <option key={material.id} value={material.id}>
                            {material.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="gs-field">
                      <label htmlFor="gs-finish" className="gs-label">
                        Surface finish
                      </label>
                      <select
                        id="gs-finish"
                        className="gs-select"
                        value={input.finish}
                        onChange={(event) => set({ finish: event.target.value })}
                      >
                        {FINISHES.map((finish) => (
                          <option key={finish.id} value={finish.id}>
                            {finish.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div role="radiogroup" aria-labelledby="gs-complexity-label">
                    <p id="gs-complexity-label" className="gs-label">
                      Tool complexity
                    </p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      {COMPLEXITY.map((item) => (
                        <label key={item.id} className="gs-option">
                          <input
                            type="radio"
                            name="complexity"
                            value={item.id}
                            checked={input.complexity === item.id}
                            onChange={() => set({ complexity: item.id })}
                          />
                          <span className="font-medium">{item.name}</span>
                          <span className="gs-muted text-[0.88rem]">{item.hint}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div role="radiogroup" aria-labelledby="gs-cavities-label">
                    <p id="gs-cavities-label" className="gs-label">
                      Cavities
                    </p>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {CAVITIES.map((item) => (
                        <label key={item.n} className="gs-option justify-items-center">
                          <input
                            type="radio"
                            name="cavities"
                            value={item.n}
                            checked={input.cavities === item.n}
                            onChange={() => set({ cavities: item.n })}
                          />
                          <span className="gs-data font-medium">{item.n}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-4">
                  {process.name} parts are printed in <strong className="font-medium">{PRINT_MATERIALS[input.process].name}</strong>. No tool is needed, so there is nothing else to choose here.
                </p>
              )}
            </fieldset>

            <fieldset>
              <legend className="gs-h3">4. Quantity</legend>
              <div className="mt-4 grid items-end gap-x-5 gap-y-2 sm:grid-cols-[10rem_1fr]">
                <div className="gs-field">
                  <label htmlFor="gs-quantity" className="gs-label">
                    Pieces
                  </label>
                  <input
                    id="gs-quantity"
                    type="number"
                    inputMode="numeric"
                    className="gs-input"
                    min={LIMITS.quantity.min}
                    max={LIMITS.quantity.max}
                    value={input.quantity}
                    onChange={(event) => {
                      const next = Math.round(Number(event.target.value));
                      if (Number.isFinite(next) && event.target.value !== '') set({ quantity: clamp(next, LIMITS.quantity) });
                    }}
                  />
                </div>
                <input
                  type="range"
                  className="gs-range"
                  aria-label="Quantity slider"
                  aria-valuetext={`${formatInt(input.quantity)} pieces`}
                  min={0}
                  max={SLIDER_STEPS}
                  value={qtyToSlider(input.quantity)}
                  onChange={(event) => set({ quantity: sliderToQty(Number(event.target.value)) })}
                />
              </div>
            </fieldset>
          </form>

          <div className="grid gap-6 lg:sticky lg:top-24">
            <figure className="gs-sheet !bg-white p-3 md:p-4">
              <PartDrawing length={input.length} width={input.width} height={input.height} wall={input.wall} />
              <figcaption className="gs-label mt-2 flex flex-wrap justify-between gap-x-6 gap-y-1 border-t border-[color:var(--gs-line)] pt-2">
                <span>Your part, to scale</span>
                <span>
                  {result.volume} cm³ · {result.weightG} g
                </span>
              </figcaption>
            </figure>

            <div className="gs-sheet !bg-white" aria-live="polite" aria-atomic="false">
              <dl className="grid grid-cols-2">
                <div className="border-b border-r border-[color:var(--gs-line)] p-4 md:p-5">
                  <dt className="gs-label">Unit price</dt>
                  <dd className="gs-data mt-1 text-[clamp(1.7rem,3.2vw,2.5rem)] font-medium leading-none">
                    <Figure value={result.unitPrice} format={usdAuto} />
                  </dd>
                </div>
                <div className="border-b border-[color:var(--gs-line)] p-4 md:p-5">
                  <dt className="gs-label">Tooling, one-off</dt>
                  <dd className="gs-data mt-1 text-[clamp(1.7rem,3.2vw,2.5rem)] font-medium leading-none">
                    {isMoulding ? <Figure value={result.tooling} format={usd0} /> : 'None'}
                  </dd>
                </div>
                <div className="border-r border-[color:var(--gs-line)] p-4 md:p-5">
                  <dt className="gs-label">Order total</dt>
                  <dd className="gs-data mt-1 text-xl font-medium">
                    <Figure value={orderTotal} format={usd0} />
                  </dd>
                </div>
                <div className="p-4 md:p-5">
                  <dt className="gs-label">Lead time</dt>
                  <dd className="gs-data mt-1 text-xl font-medium">
                    <Figure value={result.leadDays} format={days} /> working days
                  </dd>
                </div>
              </dl>

              <dl className="gs-data grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 border-t border-[color:var(--gs-line-strong)] p-4 text-[0.85rem] md:p-5">
                {isMoulding ? (
                  <>
                    <dt className="text-[color:var(--gs-ink-2)]">Press</dt>
                    <dd>{result.press ? `${result.press} t` : `over 850 t (needs ${result.tonnageNeeded} t)`}</dd>
                    <dt className="text-[color:var(--gs-ink-2)]">Tool steel</dt>
                    <dd>{result.steel}</dd>
                    <dt className="text-[color:var(--gs-ink-2)]">Cycle</dt>
                    <dd>{result.cycleSeconds} s</dd>
                    <dt className="text-[color:var(--gs-ink-2)]">Schedule</dt>
                    <dd>
                      {result.toolDays} days to T1, {result.productionDays} to mould and pack
                    </dd>
                  </>
                ) : (
                  <>
                    <dt className="text-[color:var(--gs-ink-2)]">Material</dt>
                    <dd>{result.materialName}</dd>
                    <dt className="text-[color:var(--gs-ink-2)]">Capacity</dt>
                    <dd>{formatInt(result.partsPerDay)} parts per day</dd>
                  </>
                )}
                <dt className="text-[color:var(--gs-ink-2)]">Terms</dt>
                <dd>FOB Shenzhen, USD, valid 30 days</dd>
              </dl>
            </div>

            {notes.length > 0 && (
              <ul className="grid gap-2" aria-label="Design notes">
                {notes.map((note) => (
                  <li key={note.text} className={`gs-note gs-note--${note.level}`}>
                    <span className="gs-label !text-[color:var(--gs-ink)]">
                      {note.level === 'info' ? 'Note' : note.level === 'warn' ? 'Check' : 'Stop'}
                    </span>
                    <span>{note.text}</span>
                  </li>
                ))}
              </ul>
            )}

            {sent ? (
              <div className="gs-sheet !bg-white p-5" role="status">
                <p className="gs-label">Reference {referenceFor(input)}</p>
                <p className="mt-2 text-lg font-medium">This is where your request would be on its way.</p>
                <p className="gs-muted mt-2">
                  Grandstar Precision is a concept site, so nothing has been sent. On a live site an engineer would
                  receive this configuration and reply with a DFM report and a formal quotation within 48 hours.
                </p>
                <button type="button" className="gs-btn mt-4" onClick={() => setSent(false)}>
                  Change the configuration
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="gs-btn gs-btn--primary justify-self-start"
                disabled={!result.feasible}
                onClick={() => setSent(true)}
              >
                Request a formal quote
              </button>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="gs-breakeven" className="gs-wrap grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <h2 id="gs-breakeven" className="gs-h2">
            Mould it or print it?
          </h2>
          <p className="mt-5 max-w-[46ch] text-[1.1rem]">{verdict}</p>
          <p className="gs-muted mt-4 max-w-[46ch]">
            The solid line spreads the cost of the mould across the order, which is why it falls so steeply. The dashed
            line has no tool to pay for, so it starts low and barely moves.
          </p>
          <p className="gs-label mt-6 grid gap-2">
            <span className="inline-flex items-center gap-3">
              <svg width="34" height="6" aria-hidden="true">
                <line x1="0" y1="3" x2="34" y2="3" stroke="#101b2d" strokeWidth="2.2" />
              </svg>
              Injection moulding, tooling included
            </span>
            <span className="inline-flex items-center gap-3">
              <svg width="34" height="6" aria-hidden="true">
                <line x1="0" y1="3" x2="34" y2="3" stroke="#101b2d" strokeWidth="1.6" strokeDasharray="5 4" />
              </svg>
              {printName} printing
            </span>
            <span className="inline-flex items-center gap-3">
              <svg width="34" height="12" aria-hidden="true">
                <circle cx="17" cy="6" r="5" fill="#d62b1f" />
              </svg>
              Your order
            </span>
          </p>
        </div>

        <figure className="gs-sheet p-4 md:p-6">
          <CostChart
            curve={curve}
            quantity={input.quantity}
            selected={{ cost: selectedCost, input }}
            crossAt={crossAt}
            printName={printName}
          />
          <figcaption className="gs-label mt-3 border-t border-[color:var(--gs-line)] pt-3">
            Fig. 3 · Cost per part against quantity, both axes logarithmic
          </figcaption>
        </figure>
      </section>
    </>
  );
}
