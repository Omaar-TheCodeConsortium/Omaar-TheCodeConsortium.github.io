import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cut } from '../Media.jsx';
import { cutout } from '../cutouts.js';
import { CHARGERS, density, deviceById, formatPrice, minutesToHalf, volumeCm3 } from '../catalog.js';
import { BASE } from '../site.js';

const tallest = Math.max(...CHARGERS.map((charger) => cutout(`charger-${charger.watts}`).h));
const split = (count) => (charger) => (charger.splits[count] ? `${charger.splits[count].join(' + ')} W` : 'n/a');
const half = (id) => (charger) => minutesToHalf(deviceById(id), charger.watts);

// `best` marks the winning cell: 'low' or 'high' compares the row's `rank` across the four chargers.
const ROWS = [
  { label: 'Price', value: (c) => formatPrice(c.price), rank: (c) => c.price, best: 'low' },
  { label: 'Ports', value: (c) => `${c.ports} × USB-C` },
  { label: 'One device', value: (c) => `${c.watts} W` },
  { label: 'Two devices', value: split(2) },
  { label: 'Three devices', value: split(3) },
  { label: 'Four devices', value: split(4) },
  { label: 'Size', value: (c) => `${c.size.join(' × ')} mm` },
  { label: 'Volume', value: (c) => `${volumeCm3(c).toFixed(0)} cm³` },
  { label: 'Weight', value: (c) => `${c.weight} g`, rank: (c) => c.weight, best: 'low' },
  { label: 'Power for its size', value: (c) => `${density(c).toFixed(2)} W/cm³`, rank: density, best: 'high' },
  { label: 'Standards', value: (c) => c.pd },
  { label: 'iPhone 17 Pro to 50%', value: (c) => `${half('iphone-17-pro')(c)} min`, rank: half('iphone-17-pro'), best: 'low' },
  { label: 'MacBook Air 13-inch to 50%', value: (c) => `${half('macbook-air-13')(c)} min`, rank: half('macbook-air-13'), best: 'low' },
  { label: 'MacBook Pro 16-inch to 50%', value: (c) => `${half('macbook-pro-16')(c)} min`, rank: half('macbook-pro-16'), best: 'low' },
];

// Where several chargers tie for best, the smallest of them wins: more power would be wasted.
const bestIndex = (row) => {
  if (!row.best) return -1;
  const ranks = CHARGERS.map(row.rank);
  const target = row.best === 'low' ? Math.min(...ranks) : Math.max(...ranks);
  return ranks.indexOf(target);
};

export default function Compare() {
  const [picked, setPicked] = useState(65);
  const chosen = CHARGERS.find((charger) => charger.watts === picked);

  return (
    <section className="hx-band !pt-[clamp(36px,5vw,80px)]">
      <div className="hx-band-head">
        <h1 className="hx-h1">Four chargers, side by side.</h1>
        <p className="hx-lede">
          Select one to follow it down the table. An orange dot marks the best figure in a row; where chargers tie, it
          goes to the smallest.
        </p>
      </div>

      <div className="hx-compare-scroll">
        <table className="hx-compare">
          <caption className="sr-only">Hoxen chargers compared</caption>
          <thead>
            <tr>
              <td />
              {CHARGERS.map((charger) => (
                <th key={charger.id} scope="col">
                  <button type="button" className="hx-compare-pick" aria-pressed={picked === charger.watts} onClick={() => setPicked(charger.watts)}>
                    <span className="hx-shelf-stand">
                      <Cut name={`charger-${charger.watts}`} eager style={{ '--tall': cutout(`charger-${charger.watts}`).h / tallest }} />
                    </span>
                    <span className="hx-shelf-watt">
                      {charger.watts}
                      <small>W</small>
                    </span>
                    <span className="sr-only">{charger.name}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => {
              const best = bestIndex(row);
              return (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {CHARGERS.map((charger, index) => (
                    <td key={charger.id} data-picked={picked === charger.watts ? '' : undefined} data-best={best === index ? '' : undefined}>
                      {row.value(charger)}
                      {best === index && <span className="sr-only"> (best)</span>}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-[clamp(32px,4vw,56px)] flex flex-wrap items-center justify-between gap-6">
        <p className="hx-h3 max-w-[30ch]" aria-live="polite">
          {chosen.name}: {chosen.blurb}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to={`${BASE}charger/?w=${chosen.watts}`} className="hx-btn hx-btn--go">
            Configure the {chosen.watts} W
          </Link>
          <Link to={`${BASE}compatibility/`} className="hx-btn">
            Check my devices
          </Link>
        </div>
      </div>
    </section>
  );
}
