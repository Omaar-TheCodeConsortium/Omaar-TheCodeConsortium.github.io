import { Link } from 'react-router-dom';
import { PartDrawing } from '../drawings.jsx';
import { Shot } from '../Shot.jsx';
import { HEADLINE_FIGURES, INDUSTRIES, PROCESSES, PROGRAMME, PROGRAMME_DAYS } from '../data.js';
import { BASE } from '../site.js';

const HERO_PINS = [
  { x: 50.5, y: 29, dir: 'up', len: 4, value: '4 guide pillars', text: 'Align the two halves to a few microns, every cycle' },
  { x: 56.5, y: 46, dir: 'right', len: 3, value: 'Cooling circuit', text: 'Most of the cycle time, and most of the warp' },
  { x: 45.5, y: 56, dir: 'down', len: 20, value: '±0.02 mm', text: 'Cavity and core steel tolerance' },
];

// The thirty-day programme, walked through the building. Each station takes the phases
// of the programme that fall inside its days.
const STATIONS = [
  {
    id: 'drawing',
    from: 0,
    to: 5,
    title: 'On the drawing',
    text: 'Before any steel is ordered, the engineer who will own your project reports on draft, wall thickness, gate position and ejection. Nothing is cut until you have signed it.',
  },
  {
    id: 'steel',
    from: 5,
    to: 14,
    title: 'In the tool room',
    text: 'Forty-one toolmakers cut, harden and fit the mould forty metres from the press it will run on. Cavity and core steel is held to ±0.02 mm.',
    shot: {
      name: 'toolroom',
      alt: 'A carbide end mill cutting a pocket into a clamped block of tool steel under a stream of coolant',
      pins: [
        { x: 50, y: 60, dir: 'right', len: 6, value: '30,000 rpm', text: 'High-speed milling in hardened steel and graphite' },
        { x: 40, y: 76, dir: 'down', len: 5, value: 'P20, H13 or S136', text: 'Hardness and certificate checked before cutting' },
      ],
    },
  },
  {
    id: 'shots',
    from: 14,
    to: 23,
    title: 'First shots',
    text: 'The first parts off the tool are measured against every dimension on your drawing and flown to you. Five of these days are yours: the samples are in the air and on your engineers’ desks.',
    shot: {
      name: 'ejection',
      alt: 'A robot gripper lifting a freshly moulded light-grey controller housing from between the two halves of an open mould',
      pins: [
        { x: 50, y: 33, dir: 'left', len: 14, value: '19 robots', text: 'One on every press above 180 tonnes' },
        { x: 49.5, y: 50, dir: 'right', len: 14, value: '120 × 80 × 30 mm', text: 'Controller housing in PC/ABS, 2 mm walls' },
      ],
    },
  },
  {
    id: 'production',
    from: 23,
    to: 29,
    title: 'Production, measured',
    text: 'The order is moulded, checked at the press and packed. What we measure travels with the parts, as a report you can read without us.',
    shot: {
      name: 'cmm',
      anchor: [0.2, 0.5],
      alt: 'The ruby-tipped probe of a coordinate measuring machine touching the rim of a black controller lid held in an aluminium fixture',
      pins: [
        { x: 37, y: 51, dir: 'right', len: 8, value: '1.5 + L/350 µm', text: 'Bridge CMM, in a temperature-controlled room' },
        { x: 24, y: 64, dir: 'down', len: 8, value: 'Every two hours', text: 'Critical dimensions, charted for Cpk' },
      ],
    },
  },
  {
    id: 'port',
    from: 29,
    to: 30,
    title: 'To the port',
    text: 'Cartons are checked against your purchase order and trucked to Yantian, ninety minutes away. From here the lead time is the ship’s.',
    shot: {
      name: 'dock',
      anchor: [0.75, 0.5],
      alt: 'Plain export cartons wrapped on pallets in a loading bay, with an open shipping container backed up to the door',
      pins: [
        { x: 48, y: 31, dir: 'up', len: 4, value: 'AQL 0.65', text: 'Outgoing inspection to ISO 2859-1' },
        { x: 84, y: 46.5, dir: 'left', len: 5, value: 'FOB Shenzhen', text: 'Loaded for Yantian on day 30' },
      ],
    },
  },
];

const pad = (day) => String(day).padStart(2, '0');

const PROCESS_SHOTS = {
  moulding: {
    name: 'press-hall',
    alt: 'A long row of off-white and navy injection-moulding machines, each with a hopper and a part-removal robot, down a clean factory aisle',
    pins: [
      { x: 25.5, y: 17, dir: 'right', len: 4, value: 'Six-axis robots', text: 'Cycle time stays the same from the first shot to the last' },
      { x: 88, y: 48, dir: 'left', len: 4, value: '34 presses', text: '50 to 850 tonnes clamping force' },
    ],
  },
  tooling: {
    name: 'mould-store',
    alt: 'Steel racking holding rows of closed mould tools, each with lifting eyes and a blank metal tag',
    pins: [{ x: 58.5, y: 37, dir: 'right', len: 4, value: 'Your asset number', text: 'Engraved on the tool. You own it once it is paid for' }],
  },
  printing: {
    name: 'printer',
    alt: 'A resin 3D printer with its door open, the build platform carrying six translucent white prototype housings',
    pins: [{ x: 47, y: 44, dir: 'up', len: 6, value: '0.05 mm layers', text: 'SLA resin for fit checks' }],
  },
};

export default function Home() {
  return (
    <>
      <section className="gs-hero gs-hero--left gs-on-navy">
        <Shot
          fill
          eager
          name="hero-mould"
          tall="hero-mould-tall"
          alt="One half of a steel injection mould mounted in a press, its polished cavity catching the light, with the moulding hall behind"
          pins={HERO_PINS}
        />
        <div className="gs-hero-copy">
          <h1 className="gs-h1">Injection moulds and moulded parts, built to drawing.</h1>
          <p className="gs-lede">
            We design the tool, cut the steel and mould the parts in one building in Chang’an, Dongguan. You get one
            engineer who owns your project from DFM to the last carton.
          </p>
          <div className="gs-hero-actions">
            <Link to={`${BASE}quote/`} className="gs-btn gs-btn--primary">
              Price a part
            </Link>
            <Link to={`${BASE}capabilities/`} className="gs-btn">
              See the plant
            </Link>
          </div>
          <p className="mt-7 text-[0.95rem]">
            <Link to={`${BASE}quality/`} className="gs-link">
              ISO 9001, IATF 16949 and ISO 13485 certified
            </Link>
          </p>
        </div>
      </section>

      <section aria-labelledby="gs-figures" className="gs-band gs-band--tight">
        <h2 id="gs-figures" className="sr-only">
          Key figures
        </h2>
        <dl className="gs-figs gs-figs--4">
          {HEADLINE_FIGURES.map((figure) => (
            <div key={figure.unit} className="flex flex-col">
              <dt className="gs-fig-note order-2">{figure.note}</dt>
              <dd className="gs-fig-value order-1">
                {figure.value}
                <small>{figure.unit}</small>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="gs-programme" className="gs-on-navy">
        <div className="gs-band gs-band--tight !pb-[clamp(36px,4vw,64px)]">
          <div className="gs-band-head !mb-0">
            <h2 id="gs-programme" className="gs-h2">
              Thirty working days from order to port
            </h2>
            <p className="gs-lede">
              Follow one part through the building. This is a typical programme for a single-cavity P20 tool and a
              first order of 5,000 parts. Hardened tools add five days. Tools with four or more cavities add four.
            </p>
          </div>
        </div>

        <ol>
          {STATIONS.map((station) => {
            const phases = PROGRAMME.filter((step) => step.start >= station.from && step.end <= station.to);
            return (
              <li key={station.id} className="gs-station">
                <div className="gs-station-media">
                  {station.shot ? (
                    <Shot {...station.shot} />
                  ) : (
                    <div className="gs-sheet">
                      <PartDrawing
                        length={120}
                        width={80}
                        height={30}
                        wall={2}
                        title="Drawing of a controller housing, 120 by 80 by 30 millimetres, with 2 millimetre walls"
                      />
                      <p className="gs-k mt-3 !text-[color:var(--gs-ink-2)]">
                        Controller housing, PC/ABS. Third-angle projection, dimensions in millimetres.
                      </p>
                    </div>
                  )}
                </div>

                <div className="gs-station-body">
                  <p className="gs-days">
                    <small>Day</small>
                    <span>
                      {pad(station.from)}–{pad(station.to)}
                    </span>
                  </p>
                  <div
                    className="gs-span"
                    aria-hidden="true"
                    style={{
                      '--from': `${(station.from / PROGRAMME_DAYS) * 100}%`,
                      '--width': `${((station.to - station.from) / PROGRAMME_DAYS) * 100}%`,
                    }}
                  >
                    <span />
                  </div>
                  <h3 className="gs-h3 !text-[clamp(1.6rem,2.6vw,2.6rem)] !font-extrabold" style={{ fontStretch: '125%' }}>
                    {station.title}
                  </h3>
                  <p className="gs-lede">{station.text}</p>
                  <ul className="gs-phases">
                    {phases.map((step) => (
                      <li key={step.phase} data-yours={step.customer ? '' : undefined}>
                        <span className="gs-k">
                          Day {step.start} to {step.end}
                        </span>
                        <span>
                          <strong>{step.phase}</strong>
                          {step.detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="gs-processes" className="gs-band">
        <div className="gs-band-head">
          <h2 id="gs-processes" className="gs-h2">
            Three processes, one project engineer
          </h2>
          <p>
            <Link to={`${BASE}capabilities/`} className="gs-link">
              Full capabilities and equipment list
            </Link>
          </p>
        </div>

        <div className="gs-proc">
          {PROCESSES.map((process) => (
            <article key={process.id} className="gs-proc-item">
              <Shot fill {...PROCESS_SHOTS[process.id]} />
              <h3 className="gs-h3 !text-[clamp(1.7rem,3vw,3rem)] !font-extrabold" style={{ fontStretch: '125%' }}>
                {process.name}
              </h3>
              <p className="gs-proc-facts">
                <span>{process.scale}</span>
                <span>{process.lead}</span>
              </p>
              <p className="text-[color:var(--fg2)]">{process.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="gs-industries" className="gs-band gs-on-sheet">
        <div className="gs-band-head">
          <h2 id="gs-industries" className="gs-h2">
            What comes off our presses
          </h2>
          <p className="gs-lede">
            About two thirds of what we mould is exported, mostly to Germany, the Netherlands, the United Kingdom and
            the United States.
          </p>
        </div>
        <dl className="gs-list-xl gs-list-xl--3">
          {INDUSTRIES.map((industry) => (
            <div key={industry.name} className="border-t-[3px] border-[color:var(--gs-ink)] py-4">
              <dt className="gs-h3">{industry.name}</dt>
              <dd className="gs-muted mt-2">{industry.parts}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="gs-case" className="gs-hero gs-on-deep !min-h-[78svh] !content-start">
        <Shot
          fill
          name="case-lid"
          anchor={[0.8, 0.5]}
          alt="A black glass-filled controller lid lying on a granite surface plate with a steel straight edge across its rim"
          pins={[{ x: 52, y: 56.5, dir: 'left', len: 5, value: '0.61 mm', text: 'Bow across the seal face, as the tool arrived' }]}
        />
        <div className="gs-hero-copy">
          <h2 id="gs-case" className="gs-h2 max-w-[14ch]">
            A lid that would not lie flat
          </h2>
          <p className="gs-lede mt-5 max-w-[40ch]">
            One part in sixteen failed its leak test. Six weeks after the tool reached us, it measured 0.18 mm.
          </p>
          <div className="gs-hero-actions">
            <Link to={`${BASE}case-study/`} className="gs-btn">
              Read the case study
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="gs-cta" className="gs-band gs-band--tight gs-on-red">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <h2 id="gs-cta" className="gs-h2 max-w-[20ch]">
            Know your part’s size and quantity? You can have a price in two minutes.
          </h2>
          <Link to={`${BASE}quote/`} className="gs-btn shrink-0 self-start lg:self-auto">
            Open the quote builder
          </Link>
        </div>
      </section>
    </>
  );
}
