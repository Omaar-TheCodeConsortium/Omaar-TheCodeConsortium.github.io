import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { PartDrawing } from '../drawings.jsx';
import { HEADLINE_FIGURES, INDUSTRIES, PROCESSES, PROGRAMME, PROGRAMME_DAYS } from '../data.js';
import { BASE } from '../site.js';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const WEEKS = [0, 5, 10, 15, 20, 25, 30];

export default function Home() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // The hero drawing is drawn the way a draughtsman would: outlines first, then dimensions.
        const drawing = root.current.querySelector('[data-hero-drawing]');
        const outlines = drawing.querySelectorAll('.outline');
        const dims = drawing.querySelectorAll('.dim');
        const rest = drawing.querySelectorAll('.thin, .hidden-line, .centre, .arrow, text');

        gsap.set([...outlines, ...dims], { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(rest, { autoAlpha: 0 });
        gsap
          .timeline({ defaults: { ease: 'power2.inOut' } })
          .to(outlines, { strokeDashoffset: 0, duration: 1.1, stagger: 0.18 })
          .to(rest, { autoAlpha: 1, duration: 0.4, stagger: 0.012 }, '-=0.5')
          .to(dims, { strokeDashoffset: 0, duration: 0.7, stagger: 0.1 }, '-=0.5');

        // Programme bars grow to their length as the chart scrolls into view.
        gsap.from(root.current.querySelectorAll('.gs-gantt-bar'), {
          scaleX: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.07,
          scrollTrigger: { trigger: root.current.querySelector('[data-gantt]'), start: 'top 78%', once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <section className="gs-wrap grid items-center gap-10 py-12 md:py-20 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <h1 className="gs-h1">Injection moulds and moulded parts, built to drawing.</h1>
          <p className="gs-lede mt-6">
            We design the tool, cut the steel and mould the parts in one building in Chang’an, Dongguan. You get one
            engineer who owns your project from DFM to the last carton.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={`${BASE}quote/`} className="gs-btn gs-btn--primary">
              Price a part
            </Link>
            <Link to={`${BASE}capabilities/`} className="gs-btn">
              See the plant
            </Link>
          </div>
          <p className="mt-8 text-[0.95rem]">
            <Link to={`${BASE}quality/`} className="gs-link">
              ISO 9001, IATF 16949 and ISO 13485 certified
            </Link>
          </p>
        </div>

        <figure className="gs-sheet p-4 md:p-6" data-hero-drawing>
          <PartDrawing
            length={120}
            width={80}
            height={30}
            wall={2}
            title="Drawing of a controller housing, 120 by 80 by 30 millimetres, with 2 millimetre walls"
          />
          <figcaption className="gs-label mt-3 flex flex-wrap justify-between gap-x-6 gap-y-1 border-t border-[color:var(--gs-line)] pt-3">
            <span>Fig. 1 · Controller housing, PC/ABS</span>
            <span>Third-angle projection</span>
          </figcaption>
        </figure>
      </section>

      <section aria-labelledby="gs-figures" className="border-y border-[color:var(--gs-line-strong)] bg-[var(--gs-sheet)]">
        <h2 id="gs-figures" className="sr-only">
          Key figures
        </h2>
        <dl className="gs-wrap grid grid-cols-2 lg:grid-cols-4">
          {HEADLINE_FIGURES.map((figure, index) => (
            <div
              key={figure.unit}
              className={`flex flex-col border-[color:var(--gs-line)] py-7 pr-4 md:py-9 ${index % 2 === 1 ? 'border-l pl-5' : ''} ${index >= 2 ? 'border-t lg:border-t-0' : ''} ${index === 2 ? 'lg:border-l lg:pl-5' : ''}`}
            >
              <dt className="order-2 mt-2 max-w-[24ch] text-[0.92rem] text-[color:var(--gs-ink-2)]">{figure.note}</dt>
              <dd className="gs-data order-1 flex items-baseline gap-2">
                <span className="text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-none">{figure.value}</span>
                <span className="text-sm">{figure.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="gs-processes" className="gs-wrap py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="gs-processes" className="gs-h2 max-w-[18ch]">
            Three processes, one project engineer
          </h2>
          <Link to={`${BASE}capabilities/`} className="gs-link">
            Full capabilities and equipment list
          </Link>
        </div>

        <div className="mt-10 border-t border-[color:var(--gs-line-strong)]">
          {PROCESSES.map((process) => (
            <article
              key={process.id}
              className="grid gap-x-10 gap-y-3 border-b border-[color:var(--gs-line)] py-7 md:grid-cols-[1.1fr_1fr_2fr]"
            >
              <h3 className="gs-h3 text-[1.45rem]">{process.name}</h3>
              <p className="gs-data text-[0.9rem] leading-relaxed">
                {process.scale}
                <br />
                {process.lead}
              </p>
              <p className="gs-muted max-w-[58ch]">{process.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="gs-programme" className="border-y border-[color:var(--gs-line-strong)] bg-[var(--gs-sheet)]">
        <div className="gs-wrap py-16 md:py-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
            <div>
              <h2 id="gs-programme" className="gs-h2">
                Thirty working days from order to port
              </h2>
              <p className="gs-muted mt-5 max-w-[44ch]">
                A typical programme for a single-cavity P20 tool and a first order of 5,000 parts. Five of those days
                are yours: the samples are in the air and on your engineers’ desks.
              </p>
              <p className="gs-label mt-6 flex flex-wrap gap-x-6 gap-y-2">
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-3 w-6 bg-[var(--gs-ink)]" aria-hidden="true" /> Our work
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="gs-gantt-bar--customer inline-block h-3 w-6" aria-hidden="true" /> Your review
                </span>
              </p>
            </div>

            <div data-gantt>
              <div className="gs-gantt-row !min-h-0 !border-b-[color:var(--gs-line-strong)] pb-2" aria-hidden="true">
                <span className="gs-label">Phase</span>
                <span className="gs-label relative block h-4">
                  {WEEKS.map((day) => (
                    <span
                      key={day}
                      className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full"
                      style={{ left: `${(day / PROGRAMME_DAYS) * 100}%` }}
                    >
                      {day === 0 ? 'Day 0' : day}
                    </span>
                  ))}
                </span>
              </div>
              <ol>
                {PROGRAMME.map((step) => (
                  <li key={step.phase} className="gs-gantt-row">
                    <span className="py-2 text-[0.95rem] leading-tight">
                      {step.phase}
                      <span className="sr-only">
                        : day {step.start} to day {step.end}. {step.detail}
                      </span>
                    </span>
                    <span className="gs-gantt-track" aria-hidden="true" title={step.detail}>
                      <span
                        className={`gs-gantt-bar ${step.customer ? 'gs-gantt-bar--customer' : ''}`}
                        style={{
                          left: `${(step.start / PROGRAMME_DAYS) * 100}%`,
                          width: `${((step.end - step.start) / PROGRAMME_DAYS) * 100}%`,
                        }}
                      />
                    </span>
                  </li>
                ))}
              </ol>
              <p className="gs-muted mt-4 text-[0.92rem]">
                Hardened tools add five days. Tools with four or more cavities add four.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="gs-industries" className="gs-wrap grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <h2 id="gs-industries" className="gs-h2">
            What comes off our presses
          </h2>
          <p className="gs-muted mt-5 max-w-[42ch]">
            About two thirds of what we mould is exported, mostly to Germany, the Netherlands, the United Kingdom and
            the United States.
          </p>
          <p className="mt-6">
            <Link to={`${BASE}case-study/`} className="gs-link">
              Read how we flattened a glass-filled controller lid
            </Link>
          </p>
        </div>
        <dl className="border-t border-[color:var(--gs-line-strong)]">
          {INDUSTRIES.map((industry) => (
            <div
              key={industry.name}
              className="grid gap-x-8 gap-y-1 border-b border-[color:var(--gs-line)] py-4 sm:grid-cols-[13rem_1fr]"
            >
              <dt className="font-medium">{industry.name}</dt>
              <dd className="gs-muted">{industry.parts}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="gs-cta" className="bg-[var(--gs-red)] text-white">
        <div className="gs-wrap flex flex-col justify-between gap-8 py-14 md:flex-row md:items-end md:py-20">
          <h2 id="gs-cta" className="gs-h2 max-w-[22ch]">
            Know your part’s size and quantity? You can have a price in two minutes.
          </h2>
          <Link to={`${BASE}quote/`} className="gs-btn gs-btn--light shrink-0">
            Open the quote builder
          </Link>
        </div>
      </section>
    </div>
  );
}
