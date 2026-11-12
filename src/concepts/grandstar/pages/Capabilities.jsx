import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MouldSection } from '../drawings.jsx';
import { Shot } from '../Shot.jsx';
import {
  EQUIPMENT,
  EQUIPMENT_DEPTS,
  MOULD_CLASSES,
  MOULD_PARTS,
  PRESSES,
  PRINTERS,
  SECONDARY_OPS,
} from '../data.js';
import { BASE } from '../site.js';

const PLANT = [
  { label: 'Floor area', value: '11,400', unit: 'm²' },
  { label: 'People', value: '186' },
  { label: 'Tool makers', value: '41' },
  { label: 'Shifts', value: '2 × 10', unit: 'h' },
  { label: 'New tools in 2025', value: '131' },
];

const totalPresses = PRESSES.reduce((sum, row) => sum + row.count, 0);

export default function Capabilities() {
  const [activePart, setActivePart] = useState(null);
  const [dept, setDept] = useState('All');

  const equipment = dept === 'All' ? EQUIPMENT : EQUIPMENT.filter((row) => row.dept === dept);

  return (
    <>
      <section className="gs-hero gs-on-navy">
        <Shot
          fill
          eager
          name="press-hall"
          alt="A long row of off-white and navy injection-moulding machines, each with a hopper and a part-removal robot, down a clean factory aisle"
          pins={[
            { x: 25.5, y: 17, dir: 'right', len: 4, value: '19 robots', text: 'One on every press above 180 tonnes' },
            { x: 88, y: 46, dir: 'left', len: 4, value: `${totalPresses} presses`, text: '50 to 850 tonnes clamping force' },
          ]}
        />
        <div className="gs-hero-copy">
          <h1 className="gs-h1">Tool room, moulding hall and print lab on one site.</h1>
          <p className="gs-lede">
            Nothing is subcontracted except painting. When a part is out of tolerance, the people who cut the steel are
            forty metres from the press that moulded it.
          </p>
        </div>
      </section>

      <section aria-labelledby="gs-plant" className="gs-band gs-band--tight gs-on-deep">
        <h2 id="gs-plant" className="sr-only">
          The plant in figures
        </h2>
        <dl className="gs-figs gs-figs--5">
          {PLANT.map((fact) => (
            <div key={fact.label} className="flex flex-col">
              <dt className="gs-fig-note order-2">{fact.label}</dt>
              <dd className="gs-fig-value order-1 !text-[clamp(2.2rem,4.6vw,4.8rem)]">
                {fact.value}
                {fact.unit && <small>{fact.unit}</small>}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="gs-moulding" className="gs-band">
        <div className="gs-band-head">
          <h2 id="gs-moulding" className="gs-h2">
            Injection moulding
          </h2>
          <div className="grid gap-4">
            <p className="gs-lede">
              {totalPresses} presses from 50 to 850 tonnes. Six run inside an ISO class 8 clean cell for medical and
              optical parts, and two have a rotary platen for two-shot moulding.
            </p>
            <p className="gs-muted max-w-[54ch]">
              Every press above 180 tonnes has a robot, so cycle time and part handling stay the same from the first
              shot to the last.
            </p>
          </div>
        </div>

        <h3 className="gs-k mb-3 !text-base">Press list</h3>
        <ul className="gs-bars">
          {PRESSES.map((row) => (
            <li key={row.range} className="gs-bar md:grid-cols-[5.5rem_1fr_1fr_1.2fr_1.6fr]">
              <p className="gs-bar-fig" aria-label={`${row.count} presses`}>
                {row.count}
              </p>
              <p className="gs-bar-title gs-num">{row.range}</p>
              <p className="gs-num">
                <span className="gs-k">Shot weight (PS)</span>
                {row.shot}
              </p>
              <p>
                <span className="gs-k">Make</span>
                {row.makes}
              </p>
              <p className="gs-muted">{row.notes}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="gs-tooling" className="gs-band gs-on-navy">
        <div className="gs-band-head">
          <h2 id="gs-tooling" className="gs-h2">
            Mould making
          </h2>
          <p className="gs-lede">
            A mould is two blocks of steel with your part missing from the middle. Select a region to see what it does
            and why it matters to your part.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-[5px]">
          <figure className="gs-sheet p-4 md:p-8">
            <MouldSection active={activePart} />
            <figcaption className="gs-k mt-3 !text-[color:var(--gs-ink-2)]">Section through a two-plate mould, closed</figcaption>
          </figure>

          <ol className="gs-legend">
            {MOULD_PARTS.map((part, index) => (
              <li key={part.id}>
                <button
                  type="button"
                  aria-pressed={activePart === part.id}
                  onClick={() => setActivePart(activePart === part.id ? null : part.id)}
                  onPointerEnter={(event) => event.pointerType === 'mouse' && setActivePart(part.id)}
                  onPointerLeave={(event) => event.pointerType === 'mouse' && setActivePart(null)}
                >
                  <span className="gs-pin-no">{index + 1}</span>
                  <span className="gs-bar-title !text-base">{part.name}</span>
                  <span className="col-start-2 text-[0.94rem] text-[color:var(--fg2)]">{part.text}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-[5px] grid gap-[5px] md:grid-cols-[1fr_1fr_1.79fr]">
          <Shot
            name="edm"
            className="[&_.gs-shot]:!aspect-square"
            alt="A copper electrode with a row of thin ribs lowered into a steel mould insert under clear dielectric oil"
            pins={[{ x: 50, y: 44, dir: 'up', len: 5, value: 'Ra 0.1 µm', text: 'Sinker EDM, to a mirror finish' }]}
          />
          <Shot
            name="polish"
            className="[&_.gs-shot]:!aspect-square"
            alt="Two gloved hands polishing a mirror-bright mould cavity with a wooden stick under a magnifier lamp"
            pins={[{ x: 50, y: 51, dir: 'down', len: 6, value: 'Days 12 to 14', text: 'Bench fitting and hand polish' }]}
          />
          <Shot
            name="mould-store"
            className="[&_.gs-shot]:!aspect-square md:[&_.gs-shot]:!aspect-auto md:[&_.gs-shot]:h-full"
            alt="Steel racking holding rows of closed mould tools, each with lifting eyes and a blank metal tag"
            pins={[{ x: 50, y: 62, dir: 'right', len: 3, value: 'Your asset number', text: 'Stored and maintained at no charge' }]}
          />
        </div>

        <h3 className="gs-k mb-3 mt-14 !text-base">Mould classes we build</h3>
        <ul className="gs-bars">
          {MOULD_CLASSES.map((row) => (
            <li key={row.cls} className="gs-bar md:grid-cols-[9rem_1.4fr_1fr_1.4fr]">
              <p className="gs-bar-title gs-num !text-[1.35rem]" style={{ fontStretch: '125%', fontWeight: 800 }}>
                {row.cls}
              </p>
              <p>
                <span className="gs-k">Steel</span>
                {row.steel}
              </p>
              <p className="gs-num">
                <span className="gs-k">Guaranteed life</span>
                {row.life}
              </p>
              <p>
                <span className="gs-k">Typical use</span>
                {row.use}
              </p>
            </li>
          ))}
        </ul>
        <p className="gs-bars-note">
          Cavity and core steel is held to ±0.02 mm. Tools can be built to DME, Hasco or LKM standards, and to your own
          tooling specification if you have one.
        </p>
      </section>

      <section aria-labelledby="gs-printing" className="gs-on-sheet grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)]">
        <div className="relative min-h-[70svh] lg:min-h-[92svh]">
          <Shot
            fill
            name="printer"
            alt="A resin 3D printer with its door open, the build platform carrying six translucent white prototype housings"
            pins={[
              { x: 47, y: 44, dir: 'up', len: 7, value: '0.05 mm layers', text: 'SLA, ABS-like resin' },
              { x: 60, y: 69, dir: 'down', len: 5, value: '800 × 800 × 550 mm', text: 'Largest build volume' },
            ]}
          />
        </div>
        <div className="gs-band !py-[clamp(48px,6vw,96px)] lg:!pl-[clamp(32px,4vw,76px)]">
          <h2 id="gs-printing" className="gs-h2">
            3D printing
          </h2>
          <p className="gs-lede mt-6">
            Six industrial printers. Most of their work is bridge production: a few hundred printed parts that keep your
            launch on schedule while the mould is being cut.
          </p>
          <p className="mt-6">
            <Link to={`${BASE}quote/`} className="gs-link">
              Find where moulding overtakes printing for your part
            </Link>
          </p>

          <h3 className="gs-k mb-3 mt-12 !text-base">Print processes</h3>
          <ul className="gs-bars">
            {PRINTERS.map((row) => (
              <li key={row.process} className="gs-bar sm:grid-cols-[5rem_1fr_1fr]">
                <p className="gs-bar-fig !text-[1.9rem] sm:row-span-2 sm:self-start">{row.process}</p>
                <p>
                  <span className="gs-k">Materials</span>
                  {row.material}
                </p>
                <p className="gs-num">
                  <span className="gs-k">Build volume</span>
                  {row.volume}
                </p>
                <p className="gs-num">
                  <span className="gs-k">Layer</span>
                  {row.layer}
                </p>
                <p className="gs-num">
                  <span className="gs-k">Tolerance</span>
                  {row.tolerance}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="gs-secondary" className="gs-band">
        <div className="gs-band-head">
          <h2 id="gs-secondary" className="gs-h2">
            After moulding
          </h2>
        </div>
        <ul className="gs-list-xl gs-list-xl--3">
          {SECONDARY_OPS.map((op) => (
            <li key={op} className="gs-h3">
              {op}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="gs-equipment" className="gs-band gs-on-deep">
        <div className="gs-band-head">
          <h2 id="gs-equipment" className="gs-h2">
            Equipment register
          </h2>
          <div role="group" aria-label="Filter by department" className="flex flex-wrap gap-2 lg:justify-end">
            {EQUIPMENT_DEPTS.map((name) => (
              <button key={name} type="button" className="gs-chip" aria-pressed={dept === name} onClick={() => setDept(name)}>
                {name}
              </button>
            ))}
          </div>
        </div>

        <p className="gs-k mb-3" aria-live="polite">
          {equipment.length} of {EQUIPMENT.length} entries
        </p>
        <ul className="gs-bars">
          {equipment.map((row) => (
            <li key={`${row.dept}-${row.item}`} className="gs-bar md:grid-cols-[5.5rem_1.3fr_1.2fr_1.3fr_7rem]">
              <p className="gs-bar-fig" aria-label={`Quantity ${row.qty}`}>
                {row.qty}
              </p>
              <p className="gs-bar-title">{row.item}</p>
              <p>
                <span className="gs-k">Make and model</span>
                {row.make}
              </p>
              <p className="gs-num">
                <span className="gs-k">Specification</span>
                {row.spec}
              </p>
              <p className="text-[0.9rem] text-[color:var(--fg2)] md:text-right">{row.dept}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
