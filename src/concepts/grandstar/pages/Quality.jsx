import { Link } from 'react-router-dom';
import { Shot } from '../Shot.jsx';
import { CERTIFICATIONS, DOCUMENTS, INSPECTION_GATES, QUALITY_FIGURES, TEAM } from '../data.js';
import { FAQ } from '../faq.js';
import { BASE } from '../site.js';

export default function Quality() {
  return (
    <>
      <section className="gs-hero gs-hero--right gs-on-navy">
        <Shot
          fill
          eager
          name="cmm"
          anchor={[0, 0.6]}
          alt="The ruby-tipped probe of a coordinate measuring machine touching the rim of a black controller lid held in an aluminium fixture"
          pins={[
            { x: 34.5, y: 24, dir: 'left', len: 4, value: '1.5 + L/350 µm', text: 'Zeiss Contura bridge CMM' },
            { x: 24, y: 64, dir: 'down', len: 6, value: 'Five shots per cavity', text: 'Every drawing dimension, at first article' },
          ]}
        />
        <div className="gs-hero-copy">
          <h1 className="gs-h1">Checked at four gates. Reported in full.</h1>
          <p className="gs-lede">
            You are buying from the other side of the world and cannot walk the shop floor. So every shipment arrives
            with the measurements that show it is right, and every problem gets a written answer within a working day.
          </p>
        </div>
      </section>

      <section aria-labelledby="gs-figures-2025" className="gs-band">
        <div className="gs-band-head">
          <h2 id="gs-figures-2025" className="gs-h2">
            2025 in numbers
          </h2>
          <p className="gs-lede">
            We publish the T1 figure because nobody gets every new tool right first time, and a supplier who claims to
            is not measuring.
          </p>
        </div>
        <dl className="gs-figs gs-figs--4">
          {QUALITY_FIGURES.map((figure) => {
            const [value, unit] = figure.value.split(' ');
            return (
              <div key={figure.label} className="flex flex-col">
                <dt className="gs-bar-title order-2 mt-4">{figure.label}</dt>
                <dd className="gs-fig-value order-1 !text-[clamp(2.4rem,5.2vw,5.4rem)]">
                  {value}
                  {unit && <small>{unit}</small>}
                </dd>
                <dd className="gs-fig-note order-3 !mt-2">{figure.note}</dd>
              </div>
            );
          })}
        </dl>
      </section>

      <section aria-labelledby="gs-gates" className="gs-band gs-on-navy">
        <div className="gs-band-head">
          <h2 id="gs-gates" className="gs-h2">
            The four gates
          </h2>
        </div>
        <ol className="grid gap-[5px] md:grid-cols-2 xl:grid-cols-4">
          {INSPECTION_GATES.map((gate, index) => (
            <li key={gate.code} className="flex flex-col bg-[var(--bar)] p-[clamp(18px,2vw,30px)]">
              <p className="gs-days !text-[clamp(3.4rem,5.4vw,5.6rem)]" aria-hidden="true">
                {index + 1}
              </p>
              <h3 className="gs-h3 mt-6 !text-[1.6rem]">
                <span className="sr-only">Gate {index + 1}: </span>
                {gate.name}
              </h3>
              <p className="gs-k mt-1 !text-[color:var(--accent)]">{gate.code}</p>
              <ul className="mt-5 grid gap-3 text-[0.97rem] text-[#d5dbe3]">
                {gate.checks.map((check) => (
                  <li key={check} className="border-t-2 border-white/20 pt-3">
                    {check}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="gs-certs" className="gs-band gs-on-sheet">
        <div className="gs-band-head">
          <h2 id="gs-certs" className="gs-h2">
            Certifications
          </h2>
          <p className="gs-lede">
            Copies of all four certificates are sent with our first quotation, and you are welcome to audit us in person
            or by video.
          </p>
        </div>
        <ul className="gs-bars">
          {CERTIFICATIONS.map((cert) => (
            <li key={cert.standard} className="gs-bar md:grid-cols-[15rem_1fr_8rem_9rem]">
              <p className="gs-bar-fig gs-num !text-[1.5rem]">{cert.standard}</p>
              <p>{cert.scope}</p>
              <p className="gs-num">
                <span className="gs-k">Held since</span>
                {cert.since}
              </p>
              <p className="gs-num">
                <span className="gs-k">Valid to</span>
                {cert.valid}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="gs-documents" className="gs-on-deep grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="lg:relative lg:min-h-[80svh]">
          <Shot
            name="lab-bench"
            className="lg:!absolute lg:inset-0 lg:[&_.gs-shot]:!absolute lg:[&_.gs-shot]:inset-0 lg:[&_.gs-shot]:!aspect-auto"
            alt="An inspection bench with a digital height gauge, a wooden case of pin gauges, a micrometer and three light-grey controller housings in a row"
            pins={[
              { x: 50.5, y: 13, dir: 'right', len: 6, value: 'Height gauge', text: 'Calibrated yearly, checked daily' },
              { x: 45, y: 76, dir: 'down', len: 4, value: 'Boundary samples', text: 'Kept at the press for cosmetic checks' },
            ]}
          />
        </div>
        <div className="gs-band !py-[clamp(48px,6vw,96px)] lg:!pl-[clamp(32px,4vw,76px)]">
          <h2 id="gs-documents" className="gs-h2">
            What ships with your parts
          </h2>
          <ul className="gs-bars mt-10">
            {DOCUMENTS.map((doc) => (
              <li key={doc} className="gs-bar">
                {doc}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="gs-people" className="gs-band">
        <div className="gs-band-head">
          <h2 id="gs-people" className="gs-h2">
            Who you will deal with
          </h2>
          <p className="gs-lede">
            Three people answer for your project. You will have their direct lines from the first quotation.
          </p>
        </div>
        <ul className="gs-list-xl gs-list-xl--3">
          {TEAM.map((person) => (
            <li key={person.name}>
              <p className="gs-display !text-[clamp(1.5rem,2.3vw,2.2rem)]">{person.name}</p>
              <p className="mt-3 font-semibold">{person.role}</p>
              <p className="gs-muted">{person.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="gs-terms" className="gs-band gs-on-navy">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div>
            <h2 id="gs-terms" className="gs-h2">
              Ownership, payment and shipping
            </h2>
            <p className="gs-lede mt-6 max-w-[40ch]">
              The questions buyers ask before placing a first order with a supplier they have not met.
            </p>
            <Link to={`${BASE}quote/`} className="gs-btn gs-btn--primary mt-8">
              Price a part
            </Link>
          </div>
          <div className="gs-faq">
            {FAQ.map((item) => (
              <details key={item.question}>
                <summary>
                  <h3 className="gs-h3 !text-[1.12rem]">{item.question}</h3>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
