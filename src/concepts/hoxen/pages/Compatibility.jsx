import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cut } from '../Media.jsx';
import { CHARGERS, DEVICES, DEVICE_KINDS, deviceById, recommend, shares } from '../catalog.js';
import { BASE } from '../site.js';

const LIMIT = 2;

export default function Compatibility() {
  const [chosenIds, setChosenIds] = useState([]);
  const [kind, setKind] = useState(DEVICE_KINDS[0]);
  const [query, setQuery] = useState('');

  const chosen = chosenIds.map(deviceById);
  const best = useMemo(() => recommend(chosenIds.map(deviceById)), [chosenIds]);
  const bestShares = best ? shares(best, chosen) : null;
  const covered = bestShares?.every((share) => share.full);
  const needsBigCable = bestShares?.some((share) => share.drawn > 60);
  const caseFor = chosen.find((device) => device.hasCase);

  const needle = query.trim().toLowerCase();
  const list = DEVICES.filter((device) => (needle ? device.name.toLowerCase().includes(needle) : device.kind === kind));

  const toggle = (id) =>
    setChosenIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      // A third pick replaces the older of the two.
      return [...current, id].slice(-LIMIT);
    });

  return (
    <>
      <section className="hx-band !pb-[clamp(36px,4vw,64px)] !pt-[clamp(36px,5vw,80px)]">
        <div className="hx-band-head">
          <h1 className="hx-h1">Will it charge my device?</h1>
          <p className="hx-lede">
            Pick one device, or two you would charge together. You get the smallest Hoxen charger that gives each its
            full speed.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div role="group" aria-label="Kind of device" className="flex flex-wrap gap-2">
            {DEVICE_KINDS.map((name) => (
              <button
                key={name}
                type="button"
                className="hx-chip"
                aria-pressed={!needle && kind === name}
                onClick={() => {
                  setKind(name);
                  setQuery('');
                }}
              >
                {name}
              </button>
            ))}
          </div>
          <label className="grid gap-2">
            <span className="hx-k">Or search all devices</span>
            <input type="search" className="hx-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. MacBook, Galaxy" />
          </label>
        </div>

        <ul className="hx-opts mt-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="Devices">
          {list.map((device) => (
            <li key={device.id}>
              <button type="button" className="hx-opt w-full text-left" aria-pressed={chosenIds.includes(device.id)} onClick={() => toggle(device.id)}>
                <span className="hx-opt-name">{device.name}</span>
                <span className="hx-opt-detail">Takes up to {device.max} W</span>
              </button>
            </li>
          ))}
          {list.length === 0 && <li className="hx-muted py-4">No device by that name. Try a shorter search.</li>}
        </ul>
      </section>

      <section aria-labelledby="hx-answer" className="hx-band hx-band--pale" aria-live="polite">
        {!best ? (
          <div className="grid gap-4">
            <h2 id="hx-answer" className="hx-h2 max-w-[16ch]">
              Pick a device to see the answer.
            </h2>
            <p className="hx-lede">Nothing is sent anywhere. The sums are done in your browser.</p>
          </div>
        ) : (
          <>
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              <div>
                <p className="hx-k !text-base">
                  For {chosen.map((device) => device.name).join(' and ')}
                </p>
                <h2 id="hx-answer" className="hx-h1 mt-3">
                  {covered ? `The ${best.name}.` : `The ${best.name} comes closest.`}
                </h2>
                <p className="hx-lede mt-5">
                  {covered
                    ? chosen.length === 1
                      ? `It is the smallest Hoxen charger that gives the ${chosen[0].name} its full ${chosen[0].max} W.`
                      : `It is the smallest Hoxen charger that gives both their full speed at the same time: ${bestShares.map((share) => `${share.drawn} W`).join(' and ')}.`
                    : `Together these ask for more than any one Hoxen charger shares across two ports. The ${best.name} gives ${bestShares.map((share) => `${share.drawn} W to the ${share.device.name}`).join(' and ')}.`}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link to={`${BASE}charger/?w=${best.watts}`} className="hx-btn hx-btn--go">
                    Configure the {best.watts} W
                  </Link>
                  <Link to={`${BASE}compare/`} className="hx-btn">
                    Compare all four
                  </Link>
                </div>
              </div>
              <div className="hx-stand mx-auto w-[min(60%,260px)]">
                <Cut key={best.id} name={`charger-${best.watts}`} className="hx-swap" alt={`${best.name}, front view`} />
              </div>
            </div>

            <h3 className="hx-k mb-3 mt-[clamp(40px,5vw,72px)] !text-base">Every charger, with {chosen.length === 1 ? 'this device' : 'these two'}</h3>
            <ul className="hx-rows">
              {CHARGERS.map((charger) => {
                const result = shares(charger, chosen);
                return (
                  <li
                    key={charger.id}
                    className={`hx-row md:grid-cols-[9rem_1fr] ${charger.id === best.id ? '!bg-[var(--hx-ink)] text-white [--hx-ink-2:#c3c7cd]' : ''}`}
                  >
                    <p className="hx-row-fig">{charger.watts} W</p>
                    {result ? (
                      <ul className="grid gap-3">
                        {result.map((share) => (
                          <li key={share.device.id} className="grid items-center gap-x-5 gap-y-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_6.5rem_8.5rem]">
                            <span className="font-bold">{share.device.name}</span>
                            <span
                              className={`hx-meter ${charger.id === best.id ? '!bg-white/25 [&>span]:bg-white' : ''}`}
                              data-full={share.full ? '' : undefined}
                              aria-hidden="true"
                            >
                              <span style={{ '--fill': `${(share.drawn / share.device.max) * 100}%` }} />
                            </span>
                            <span className="hx-mono text-[1.05rem]">{share.minutes} min</span>
                            <span className="hx-muted text-[0.92rem]">
                              {share.full ? 'Full speed' : `${share.drawn} of ${share.device.max} W`}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="hx-muted">One port, so one device at a time.</p>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="hx-muted mt-4 max-w-[76ch] text-[0.92rem]">
              Minutes are from empty to half full. Device figures are typical published maximums and vary with
              temperature, battery age and what the device is doing.
            </p>

            <ul className="mt-[clamp(32px,4vw,56px)] grid gap-2 md:grid-cols-2">
              <li className="hx-row !items-start">
                <p className="hx-opt-name">{needsBigCable ? 'Use the 2 m cable' : 'Either cable works'}</p>
                <p className="hx-muted">
                  {needsBigCable
                    ? 'One of these draws more than 60 W, which the 1 m cable cannot carry. The 2 m cable carries 240 W.'
                    : 'Nothing here draws more than 60 W, so the 1 m and 2 m cables charge at the same speed.'}
                </p>
              </li>
              <li className="hx-row !items-start">
                <p className="hx-opt-name">{caseFor ? `A case fits the ${caseFor.name}` : 'No Hoxen case for these yet'}</p>
                <p className="hx-muted">
                  {caseFor
                    ? 'Six colours, and $5 less when it is ordered with a charger. Add it in the last step of the configurator.'
                    : 'Cases are made for iPhone 17, iPhone 17 Pro, Galaxy S25 and Pixel 10.'}
                </p>
              </li>
            </ul>
          </>
        )}
      </section>
    </>
  );
}
