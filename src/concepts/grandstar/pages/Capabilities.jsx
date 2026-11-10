import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MouldSection } from '../drawings.jsx';
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
  { label: 'Floor area', value: '11,400 m²' },
  { label: 'People', value: '186' },
  { label: 'Tool makers', value: '41' },
  { label: 'Shifts', value: '2 × 10 h' },
  { label: 'New tools in 2025', value: '131' },
];

const totalPresses = PRESSES.reduce((sum, row) => sum + row.count, 0);

export default function Capabilities() {
  const [activePart, setActivePart] = useState(null);
  const [dept, setDept] = useState('All');

  const equipment = dept === 'All' ? EQUIPMENT : EQUIPMENT.filter((row) => row.dept === dept);

  return (
    <>
      <section className="gs-wrap py-12 md:py-20">
        <h1 className="gs-h1 max-w-[18ch]">Tool room, moulding hall and print lab on one site.</h1>
        <p className="gs-lede mt-6">
          Nothing is subcontracted except painting. When a part is out of tolerance, the people who cut the steel are
          forty metres from the press that moulded it.
        </p>
        <dl className="mt-10 grid grid-cols-2 border-t border-[color:var(--gs-line-strong)] sm:grid-cols-3 lg:grid-cols-5">
          {PLANT.map((fact) => (
            <div key={fact.label} className="border-b border-[color:var(--gs-line)] py-5 pr-4">
              <dt className="gs-label">{fact.label}</dt>
              <dd className="gs-data mt-1 text-2xl font-medium">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="gs-moulding" className="border-t border-[color:var(--gs-line-strong)] bg-[var(--gs-sheet)]">
        <div className="gs-wrap grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <h2 id="gs-moulding" className="gs-h2">
              Injection moulding
            </h2>
            <p className="gs-muted mt-5 max-w-[42ch]">
              {totalPresses} presses from 50 to 850 tonnes. Six run inside an ISO class 8 clean cell for medical and
              optical parts, and two have a rotary platen for two-shot moulding.
            </p>
            <p className="gs-muted mt-4 max-w-[42ch]">
              Every press above 180 tonnes has a robot, so cycle time and part handling stay the same from the first
              shot to the last.
            </p>
          </div>
          <div className="gs-table-scroll">
            <table className="gs-table min-w-[640px]">
              <caption className="gs-label">Press list</caption>
              <thead>
                <tr>
                  <th scope="col">Clamping force</th>
                  <th scope="col" className="gs-num">
                    Qty
                  </th>
                  <th scope="col">Shot weight (PS)</th>
                  <th scope="col">Make</th>
                  <th scope="col">Notes</th>
                </tr>
              </thead>
              <tbody>
                {PRESSES.map((row) => (
                  <tr key={row.range}>
                    <th scope="row" className="gs-data whitespace-nowrap">
                      {row.range}
                    </th>
                    <td className="gs-num">{row.count}</td>
                    <td className="gs-data whitespace-nowrap">{row.shot}</td>
                    <td>{row.makes}</td>
                    <td className="gs-muted">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">Total</th>
                  <td className="gs-num font-medium">{totalPresses}</td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="gs-tooling" className="gs-wrap py-16 md:py-24">
        <h2 id="gs-tooling" className="gs-h2">
          Mould making
        </h2>
        <p className="gs-lede mt-5">
          A mould is two blocks of steel with your part missing from the middle. Select a region to see what it does and
          why it matters to your part.
        </p>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <figure className="gs-sheet p-4 md:p-6">
            <MouldSection active={activePart} />
            <figcaption className="gs-label mt-3 border-t border-[color:var(--gs-line)] pt-3">
              Fig. 2 · Section through a two-plate mould, closed
            </figcaption>
          </figure>

          <ol className="gs-legend border-t border-[color:var(--gs-line-strong)]">
            {MOULD_PARTS.map((part, index) => (
              <li key={part.id}>
                <button
                  type="button"
                  aria-pressed={activePart === part.id}
                  onClick={() => setActivePart(activePart === part.id ? null : part.id)}
                  onPointerEnter={(event) => event.pointerType === 'mouse' && setActivePart(part.id)}
                  onPointerLeave={(event) => event.pointerType === 'mouse' && setActivePart(null)}
                >
                  <span className="gs-legend-no">{index + 1}</span>
                  <span className="font-medium">{part.name}</span>
                  <span className="gs-muted col-start-2 text-[0.95rem]">{part.text}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="gs-table-scroll mt-14">
          <table className="gs-table min-w-[640px]">
            <caption className="gs-label">Mould classes we build</caption>
            <thead>
              <tr>
                <th scope="col">Class</th>
                <th scope="col">Steel</th>
                <th scope="col">Guaranteed life</th>
                <th scope="col">Typical use</th>
              </tr>
            </thead>
            <tbody>
              {MOULD_CLASSES.map((row) => (
                <tr key={row.cls}>
                  <th scope="row" className="gs-data whitespace-nowrap">
                    {row.cls}
                  </th>
                  <td>{row.steel}</td>
                  <td className="gs-data whitespace-nowrap">{row.life}</td>
                  <td className="gs-muted">{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="gs-muted mt-4 max-w-[70ch] text-[0.95rem]">
          Cavity and core steel is held to ±0.02 mm. Tools can be built to DME, Hasco or LKM standards, and to your own
          tooling specification if you have one.
        </p>
      </section>

      <section aria-labelledby="gs-printing" className="border-y border-[color:var(--gs-line-strong)] bg-[var(--gs-sheet)]">
        <div className="gs-wrap grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <h2 id="gs-printing" className="gs-h2">
              3D printing
            </h2>
            <p className="gs-muted mt-5 max-w-[42ch]">
              Six industrial printers. Most of their work is bridge production: a few hundred printed parts that keep
              your launch on schedule while the mould is being cut.
            </p>
            <p className="mt-6">
              <Link to={`${BASE}quote/`} className="gs-link">
                Find where moulding overtakes printing for your part
              </Link>
            </p>
          </div>
          <div className="gs-table-scroll">
            <table className="gs-table min-w-[640px]">
              <caption className="gs-label">Print processes</caption>
              <thead>
                <tr>
                  <th scope="col">Process</th>
                  <th scope="col">Materials</th>
                  <th scope="col">Build volume</th>
                  <th scope="col">Layer</th>
                  <th scope="col">Tolerance</th>
                </tr>
              </thead>
              <tbody>
                {PRINTERS.map((row) => (
                  <tr key={row.process}>
                    <th scope="row">{row.process}</th>
                    <td>{row.material}</td>
                    <td className="gs-data whitespace-nowrap">{row.volume}</td>
                    <td className="gs-data whitespace-nowrap">{row.layer}</td>
                    <td className="gs-data">{row.tolerance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="gs-secondary" className="gs-wrap grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <h2 id="gs-secondary" className="gs-h2">
          After moulding
        </h2>
        <ul className="grid border-t border-[color:var(--gs-line-strong)] sm:grid-cols-2 sm:gap-x-10">
          {SECONDARY_OPS.map((op) => (
            <li key={op} className="border-b border-[color:var(--gs-line)] py-4">
              {op}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="gs-equipment" className="border-t border-[color:var(--gs-line-strong)] bg-[var(--gs-sheet)]">
        <div className="gs-wrap py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="gs-equipment" className="gs-h2">
              Equipment register
            </h2>
            <div role="group" aria-label="Filter by department" className="flex flex-wrap gap-2">
              {EQUIPMENT_DEPTS.map((name) => (
                <button
                  key={name}
                  type="button"
                  className="gs-chip"
                  aria-pressed={dept === name}
                  onClick={() => setDept(name)}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="gs-table-scroll mt-8">
            <table className="gs-table min-w-[720px]">
              <caption className="gs-label" aria-live="polite">
                {equipment.length} of {EQUIPMENT.length} entries
              </caption>
              <thead>
                <tr>
                  <th scope="col">Department</th>
                  <th scope="col">Equipment</th>
                  <th scope="col">Make and model</th>
                  <th scope="col" className="gs-num">
                    Qty
                  </th>
                  <th scope="col">Specification</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((row) => (
                  <tr key={`${row.dept}-${row.item}`}>
                    <td className="gs-muted whitespace-nowrap">{row.dept}</td>
                    <th scope="row">{row.item}</th>
                    <td>{row.make}</td>
                    <td className="gs-num">{row.qty}</td>
                    <td className="gs-data text-[0.88rem]">{row.spec}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
