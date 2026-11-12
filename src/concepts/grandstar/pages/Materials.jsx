import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shot } from '../Shot.jsx';
import { MATERIALS, MATERIAL_FAMILIES } from '../data.js';
import { BASE } from '../site.js';

const SORTS = [
  { key: 'tensile', label: 'Tensile strength' },
  { key: 'hdt', label: 'Heat deflection' },
  { key: 'density', label: 'Density' },
];

// The colour each resin comes out of the tool in, before any pigment: [plaque, text on it].
const NATURAL = {
  abs: ['#efe6cf', '#101b2d'],
  'pp-h': ['#f1f1ea', '#101b2d'],
  'pp-c': ['#e6e6dc', '#101b2d'],
  hdpe: ['#f4f3ee', '#101b2d'],
  pmma: ['#dcebf0', '#101b2d'],
  pc: ['#d3e2ea', '#101b2d'],
  'pc-abs': ['#c9cdd1', '#101b2d'],
  pa6: ['#e9e1c6', '#101b2d'],
  'pa66-gf30': ['#1f2226', '#ffffff'],
  pom: ['#fafaf7', '#101b2d'],
  'pbt-gf30': ['#ddd6c1', '#101b2d'],
  tpu: ['#ecdfb4', '#101b2d'],
  tpe: ['#2c2e33', '#ffffff'],
  peek: ['#b9a888', '#101b2d'],
  'pps-gf40': ['#5a4a3a', '#ffffff'],
  pei: ['#c98a1e', '#101b2d'],
  'sls-pa12': ['#f3f2ee', '#101b2d'],
  'mjf-pa12': ['#676b71', '#ffffff'],
  'sla-resin': ['#eeeadf', '#101b2d'],
};

const HERO_PINS = [
  { x: 14, y: 31, dir: 'up', len: 2, value: 'PC', text: 'Dried below 0.02% moisture' },
  { x: 32, y: 31, dir: 'up', len: 2, value: 'POM', text: 'Low friction, for gears' },
  { x: 50, y: 31, dir: 'up', len: 2, value: 'PA66 GF30', text: 'Needs hardened steel' },
  { x: 68, y: 31, dir: 'up', len: 2, value: 'PC/ABS', text: 'V-0 grade also stocked' },
  { x: 86, y: 31, dir: 'up', len: 2, value: 'PEI', text: 'Naturally amber' },
];

export default function Materials() {
  const [family, setFamily] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(null);
  const [open, setOpen] = useState(null);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = MATERIALS.filter(
      (material) =>
        (family === 'All' || material.family === family) &&
        (!needle ||
          `${material.name} ${material.grade} ${material.uses} ${material.family} ${material.flame}`.toLowerCase().includes(needle)),
    );
    if (!sort) return filtered;
    // Highest first. Materials without a value for the sorted property go last.
    return [...filtered].sort((a, b) => {
      if (a[sort] === null) return 1;
      if (b[sort] === null) return -1;
      return b[sort] - a[sort];
    });
  }, [family, query, sort]);

  return (
    <>
      <section className="gs-hero gs-hero--plain gs-on-navy">
        <div className="gs-band-head !mb-0 w-full">
          <h1 className="gs-h1">Materials library</h1>
          <p className="gs-lede">
            The {MATERIALS.length} materials we run most often, with the properties that usually decide the choice.{' '}
            {MATERIALS.filter((material) => material.stock).length} are held in stock. If your drawing calls out a grade
            that is not here, we buy it for the job.
          </p>
        </div>
      </section>

      <div className="gs-on-navy">
        <Shot
          eager
          name="materials"
          anchor={[0.5, 0.45]}
          className="lg:[&_.gs-shot]:!aspect-[16/9]"
          alt="Five steel trays of plastic pellets, clear, white, black, grey and amber, on a brushed steel bench with matching moulded sample plaques fanned out below"
          pins={HERO_PINS}
        />
      </div>

      <section aria-labelledby="gs-material-wall" className="gs-band gs-band--tight gs-paper-chips">
        <h2 id="gs-material-wall" className="sr-only">
          Material properties
        </h2>

        <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
          <div className="grid gap-5">
            <div role="group" aria-label="Filter by family" className="flex flex-wrap gap-2">
              {MATERIAL_FAMILIES.map((name) => (
                <button key={name} type="button" className="gs-chip" aria-pressed={family === name} onClick={() => setFamily(name)}>
                  {name}
                </button>
              ))}
            </div>
            <div role="group" aria-label="Put the highest first" className="flex flex-wrap items-center gap-2">
              <span className="gs-k mr-2">Highest first</span>
              {SORTS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className="gs-chip"
                  aria-pressed={sort === item.key}
                  onClick={() => setSort(sort === item.key ? null : item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <label className="gs-field w-full xl:w-80">
            <span className="gs-k">Search name, grade or use</span>
            <input
              type="search"
              className="gs-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="e.g. gears, Makrolon, V-0"
            />
          </label>
        </div>

        <p className="gs-k mb-3 mt-8" aria-live="polite">
          {rows.length} of {MATERIALS.length} materials
        </p>

        <ul className="gs-wall">
          {rows.map((material) => {
            const expanded = open === material.id;
            const [chip, onChip] = NATURAL[material.id];
            return (
              <li key={material.id} className="gs-plaque">
                <div className="gs-plaque-chip" style={{ '--chip': chip, '--on-chip': onChip }}>
                  <h3 className="gs-plaque-name">{material.name}</h3>
                  <span className="gs-plaque-stock">{material.stock ? 'In stock' : 'To order'}</span>
                </div>
                <div className="gs-plaque-body">
                  <p className="text-[0.9rem] text-[color:var(--gs-ink-2)]">
                    {material.grade} · {material.family}
                  </p>
                  <dl className="gs-plaque-props">
                    <div>
                      <dt className="gs-k">Tensile, MPa</dt>
                      <dd>{material.tensile}</dd>
                    </div>
                    <div>
                      <dt className="gs-k">HDT, °C</dt>
                      <dd>{material.hdt ?? 'n/a'}</dd>
                    </div>
                    <div>
                      <dt className="gs-k">Density, g/cm³</dt>
                      <dd>{material.density.toFixed(2)}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="gs-k">Shrinkage, %</dt>
                      <dd>{material.shrink ?? 'n/a'}</dd>
                    </div>
                    <div>
                      <dt className="gs-k">UL 94</dt>
                      <dd>{material.flame}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <button
                    type="button"
                    className="gs-plaque-toggle"
                    aria-expanded={expanded}
                    aria-controls={`gs-material-${material.id}`}
                    onClick={() => setOpen(expanded ? null : material.id)}
                  >
                    <span>
                      Typical parts and notes<span className="sr-only"> for {material.name}</span>
                    </span>
                  </button>
                  {expanded && (
                    <dl id={`gs-material-${material.id}`} className="gs-plaque-notes">
                      <div>
                        <dt className="gs-k">Typical parts</dt>
                        <dd>{material.uses}</dd>
                      </div>
                      <div>
                        <dt className="gs-k">What to know</dt>
                        <dd>{material.note}</dd>
                      </div>
                    </dl>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {rows.length === 0 && (
          <p className="gs-sheet px-6 py-12 text-center text-[1.1rem]">
            No material matches. Clear the search, or{' '}
            <Link to={`${BASE}quote/`} className="gs-link">
              ask us to source the grade
            </Link>
            .
          </p>
        )}

        <p className="gs-bars-note">
          Tensile strength is at yield, except for elastomers, where it is at break. HDT is at 1.8 MPa. Nylon values
          are dry as moulded. These are typical figures from the manufacturers’ datasheets and are for comparison
          only: design against the current datasheet for the exact grade. Plaque colours show each resin unpigmented.
        </p>
      </section>
    </>
  );
}
