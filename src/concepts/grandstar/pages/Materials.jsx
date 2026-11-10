import { Fragment, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MATERIALS, MATERIAL_FAMILIES } from '../data.js';
import { BASE } from '../site.js';

const SORTS = [
  { key: 'tensile', label: 'Tensile', unit: 'MPa' },
  { key: 'hdt', label: 'HDT', unit: '°C' },
  { key: 'density', label: 'Density', unit: 'g/cm³' },
];

export default function Materials() {
  const [family, setFamily] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState({ key: null, dir: 'desc' });
  const [open, setOpen] = useState(null);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = MATERIALS.filter(
      (material) =>
        (family === 'All' || material.family === family) &&
        (!needle ||
          `${material.name} ${material.grade} ${material.uses} ${material.family}`.toLowerCase().includes(needle)),
    );
    if (!sort.key) return filtered;
    const sign = sort.dir === 'asc' ? 1 : -1;
    // Materials without a value for the sorted property go last either way.
    return [...filtered].sort((a, b) => {
      if (a[sort.key] === null) return 1;
      if (b[sort.key] === null) return -1;
      return (a[sort.key] - b[sort.key]) * sign;
    });
  }, [family, query, sort]);

  const toggleSort = (key) =>
    setSort((current) => (current.key === key ? { key, dir: current.dir === 'desc' ? 'asc' : 'desc' } : { key, dir: 'desc' }));

  const ariaSort = (key) => (sort.key !== key ? 'none' : sort.dir === 'asc' ? 'ascending' : 'descending');

  return (
    <>
      <section className="gs-wrap py-12 md:py-20">
        <h1 className="gs-h1 max-w-[16ch]">Materials library</h1>
        <p className="gs-lede mt-6">
          The {MATERIALS.length} materials we run most often, with the properties that usually decide the choice.{' '}
          {MATERIALS.filter((material) => material.stock).length} are held in stock. If your drawing calls out a grade that is not here, we buy it for the job.
        </p>
      </section>

      <section aria-labelledby="gs-material-table" className="border-t border-[color:var(--gs-line-strong)] bg-[var(--gs-sheet)]">
        <div className="gs-wrap py-10 md:py-14">
          <h2 id="gs-material-table" className="sr-only">
            Material properties
          </h2>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div role="group" aria-label="Filter by family" className="flex flex-wrap gap-2">
              {MATERIAL_FAMILIES.map((name) => (
                <button
                  key={name}
                  type="button"
                  className="gs-chip"
                  aria-pressed={family === name}
                  onClick={() => setFamily(name)}
                >
                  {name}
                </button>
              ))}
            </div>
            <label className="gs-field w-full sm:w-72">
              <span className="gs-label">Search name, grade or use</span>
              <input
                type="search"
                className="gs-input !font-[inherit]"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="e.g. gears, Makrolon, V-0"
              />
            </label>
          </div>

          <div className="gs-table-scroll mt-8">
            <table className="gs-table min-w-[860px]">
              <caption className="gs-label" aria-live="polite">
                {rows.length} of {MATERIALS.length} materials
              </caption>
              <thead>
                <tr>
                  <th scope="col">Material</th>
                  <th scope="col">Family</th>
                  {SORTS.map((column) => (
                    <th key={column.key} scope="col" className="gs-num" aria-sort={ariaSort(column.key)}>
                      <button
                        type="button"
                        className="gs-sort"
                        aria-pressed={sort.key === column.key}
                        onClick={() => toggleSort(column.key)}
                      >
                        {column.label}, {column.unit}
                        <span aria-hidden="true">{sort.key !== column.key ? '↕' : sort.dir === 'asc' ? '↑' : '↓'}</span>
                      </button>
                    </th>
                  ))}
                  <th scope="col" className="gs-num">
                    Shrinkage, %
                  </th>
                  <th scope="col">UL 94</th>
                  <th scope="col">Stock</th>
                  <th scope="col">
                    <span className="sr-only">Details</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((material) => {
                  const expanded = open === material.id;
                  return (
                    <Fragment key={material.id}>
                      <tr>
                        <th scope="row">
                          {material.name}
                          <span className="gs-muted block text-[0.85rem] font-normal">{material.grade}</span>
                        </th>
                        <td className="gs-muted whitespace-nowrap">{material.family}</td>
                        <td className="gs-num">{material.tensile}</td>
                        <td className="gs-num">{material.hdt ?? 'n/a'}</td>
                        <td className="gs-num">{material.density.toFixed(2)}</td>
                        <td className="gs-num">{material.shrink ?? 'n/a'}</td>
                        <td className="gs-data">{material.flame}</td>
                        <td className="whitespace-nowrap">{material.stock ? 'In stock' : 'To order'}</td>
                        <td className="!py-1 text-right">
                          <button
                            type="button"
                            className="gs-chip !min-h-[44px] !px-3"
                            aria-expanded={expanded}
                            aria-controls={`gs-material-${material.id}`}
                            onClick={() => setOpen(expanded ? null : material.id)}
                          >
                            {expanded ? 'Hide' : 'Notes'}
                            <span className="sr-only"> for {material.name}</span>
                          </button>
                        </td>
                      </tr>
                      {expanded && (
                        <tr id={`gs-material-${material.id}`}>
                          <td colSpan={9} className="!border-b-[color:var(--gs-line-strong)] bg-[rgb(16_27_45_/_0.04)]">
                            <dl className="grid gap-x-10 gap-y-3 py-2 md:grid-cols-[1fr_1.4fr]">
                              <div>
                                <dt className="gs-label">Typical parts</dt>
                                <dd className="mt-1">{material.uses}</dd>
                              </div>
                              <div>
                                <dt className="gs-label">What to know</dt>
                                <dd className="mt-1">{material.note}</dd>
                              </div>
                            </dl>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-10 text-center">
                      No material matches. Clear the search, or{' '}
                      <Link to={`${BASE}quote/`} className="gs-link">
                        ask us to source the grade
                      </Link>
                      .
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="gs-muted mt-6 max-w-[80ch] text-[0.92rem]">
            Tensile strength is at yield, except for elastomers, where it is at break. HDT is at 1.8 MPa. Nylon values
            are dry as moulded. These are typical figures from the manufacturers’ datasheets and are for comparison
            only: design against the current datasheet for the exact grade.
          </p>
        </div>
      </section>
    </>
  );
}
