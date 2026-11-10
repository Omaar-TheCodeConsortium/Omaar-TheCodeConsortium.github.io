import { Link } from 'react-router-dom';
import { CERTIFICATIONS, DOCUMENTS, INSPECTION_GATES, QUALITY_FIGURES, TEAM } from '../data.js';
import { FAQ } from '../faq.js';
import { BASE } from '../site.js';

export default function Quality() {
  return (
    <>
      <section className="gs-wrap py-12 md:py-20">
        <h1 className="gs-h1 max-w-[18ch]">Checked at four gates. Reported in full.</h1>
        <p className="gs-lede mt-6">
          You are buying from the other side of the world and cannot walk the shop floor. So every shipment arrives with
          the measurements that show it is right, and every problem gets a written answer within a working day.
        </p>
      </section>

      <section aria-labelledby="gs-figures-2025" className="border-y border-[color:var(--gs-line-strong)] bg-[var(--gs-sheet)]">
        <div className="gs-wrap py-14 md:py-20">
          <h2 id="gs-figures-2025" className="gs-h2">
            2025 in numbers
          </h2>
          <dl className="mt-8 grid border-t border-[color:var(--gs-line-strong)] sm:grid-cols-2">
            {QUALITY_FIGURES.map((figure) => (
              <div key={figure.label} className="flex flex-col border-b border-[color:var(--gs-line)] py-6 sm:pr-10">
                <dt className="gs-label order-1">{figure.label}</dt>
                <dd className="gs-data order-2 mt-2 text-[clamp(2rem,4vw,3rem)] font-medium leading-none">{figure.value}</dd>
                <dd className="gs-muted order-3 mt-3 max-w-[44ch] text-[0.95rem]">{figure.note}</dd>
              </div>
            ))}
          </dl>
          <p className="gs-muted mt-5 text-[0.92rem]">
            We publish the T1 figure because nobody gets every new tool right first time, and a supplier who claims to is
            not measuring.
          </p>
        </div>
      </section>

      <section aria-labelledby="gs-gates" className="gs-wrap py-16 md:py-24">
        <h2 id="gs-gates" className="gs-h2">
          The four gates
        </h2>
        <ol className="mt-10 grid border-t border-[color:var(--gs-line-strong)] md:grid-cols-2 xl:grid-cols-4">
          {INSPECTION_GATES.map((gate, index) => (
            <li
              key={gate.code}
              className="border-b border-[color:var(--gs-line)] py-7 md:pr-8 xl:border-b-0 xl:border-r xl:pl-8 xl:first:pl-0 xl:last:border-r-0"
            >
              <p className="gs-data text-[0.85rem] text-[color:var(--gs-ink-2)]">
                Gate {index + 1} · {gate.code}
              </p>
              <h3 className="gs-h3 mt-2 text-[1.45rem]">{gate.name}</h3>
              <ul className="mt-4 grid gap-3 text-[0.97rem]">
                {gate.checks.map((check) => (
                  <li key={check} className="gs-muted border-t border-[color:var(--gs-line)] pt-3">
                    {check}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="gs-certs" className="border-y border-[color:var(--gs-line-strong)] bg-[var(--gs-sheet)]">
        <div className="gs-wrap grid gap-12 py-16 md:py-24 lg:grid-cols-[1.7fr_1fr] lg:gap-16">
          <div>
            <h2 id="gs-certs" className="gs-h2">
              Certifications
            </h2>
            <div className="gs-table-scroll mt-8">
              <table className="gs-table min-w-[620px]">
                <thead>
                  <tr>
                    <th scope="col">Standard</th>
                    <th scope="col">Scope</th>
                    <th scope="col" className="gs-num">
                      Held since
                    </th>
                    <th scope="col">Valid to</th>
                  </tr>
                </thead>
                <tbody>
                  {CERTIFICATIONS.map((cert) => (
                    <tr key={cert.standard}>
                      <th scope="row" className="gs-data whitespace-nowrap">
                        {cert.standard}
                      </th>
                      <td>{cert.scope}</td>
                      <td className="gs-num">{cert.since}</td>
                      <td className="gs-data whitespace-nowrap">{cert.valid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="gs-muted mt-4 text-[0.95rem]">
              Copies of all four certificates are sent with our first quotation, and you are welcome to audit us in
              person or by video.
            </p>
          </div>

          <div>
            <h2 className="gs-h3 text-[1.45rem]">What ships with your parts</h2>
            <ul className="mt-5 border-t border-[color:var(--gs-line-strong)]">
              {DOCUMENTS.map((doc) => (
                <li key={doc} className="border-b border-[color:var(--gs-line)] py-3 text-[0.97rem]">
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="gs-people" className="gs-wrap grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <h2 id="gs-people" className="gs-h2">
            Who you will deal with
          </h2>
          <p className="gs-muted mt-5 max-w-[40ch]">
            Three people answer for your project. You will have their direct lines from the first quotation.
          </p>
        </div>
        <ul className="border-t border-[color:var(--gs-line-strong)]">
          {TEAM.map((person) => (
            <li
              key={person.name}
              className="grid gap-x-8 gap-y-1 border-b border-[color:var(--gs-line)] py-4 sm:grid-cols-[12rem_1fr_auto]"
            >
              <span className="font-medium">{person.name}</span>
              <span>{person.role}</span>
              <span className="gs-muted">{person.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="gs-terms" className="border-t border-[color:var(--gs-line-strong)] bg-[var(--gs-sheet)]">
        <div className="gs-wrap grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div>
            <h2 id="gs-terms" className="gs-h2">
              Ownership, payment and shipping
            </h2>
            <p className="gs-muted mt-5 max-w-[40ch]">
              The questions buyers ask before placing a first order with a supplier they have not met.
            </p>
            <Link to={`${BASE}quote/`} className="gs-btn gs-btn--primary mt-8">
              Price a part
            </Link>
          </div>
          <div className="gs-faq border-t border-[color:var(--gs-line-strong)]">
            {FAQ.map((item) => (
              <details key={item.question}>
                <summary>
                  <h3 className="text-[1.1rem] font-medium tracking-normal">{item.question}</h3>
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
