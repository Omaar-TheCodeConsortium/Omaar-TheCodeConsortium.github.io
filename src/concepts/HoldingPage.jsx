import { CONCEPTS, pad2 } from './registry.js';

// Shown for a concept that is planned but not built. It is hidden from search engines
// (see src/seo/meta.js) and is replaced by the real site when the concept goes live.
export default function HoldingPage({ concept }) {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <main
        id="concept-main"
        tabIndex={-1}
        className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-5 pt-6 md:px-12 md:pt-10"
      >
        <header className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-[color:var(--c-rule)] pb-4 text-sm">
          <span>
            Concept {pad2(concept.order)} of {pad2(CONCEPTS.length)} · In build
          </span>
          <span>
            {concept.category} · {concept.audience}
          </span>
        </header>

        <div className="flex flex-1 flex-col justify-center py-14 md:py-20">
          <h1
            className="text-[clamp(3rem,11vw,10rem)] leading-[0.92] tracking-[-0.02em]"
            style={{ fontWeight: concept.displayWeight }}
          >
            {concept.name}
          </h1>
          <p className="mt-8 max-w-[46ch] text-lg leading-snug md:text-2xl">{concept.summary}</p>
          <p className="mt-4 max-w-[52ch] text-base text-[color:var(--c-muted)]">
            This concept site has not been built yet. The pages listed below are planned.
          </p>
        </div>

        <section aria-labelledby="planned-pages" className="border-t border-[color:var(--c-rule)] pb-12 pt-6">
          <h2 id="planned-pages" className="text-sm">
            Planned pages
          </h2>
          <ol className="mt-4 grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {concept.pages.map((page, index) => (
              <li
                key={page}
                className="flex items-baseline gap-4 border-b border-[color:var(--c-rule)] py-3 text-lg md:text-xl"
              >
                <span className="w-7 shrink-0 text-sm tabular-nums text-[color:var(--c-muted)]">{pad2(index + 1)}</span>
                {page}
              </li>
            ))}
          </ol>
        </section>
      </main>

      {/* The loud colour, used once and at size, edge to edge. Bottom padding keeps the text clear of the return tab. */}
      <footer className="bg-[var(--c-loud)] text-[color:var(--c-on-loud)]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-baseline justify-between gap-x-8 gap-y-1 px-5 pb-24 pt-5 text-sm md:px-12">
          <span>{concept.legalName}</span>
          <span>
            {concept.city} · {concept.coords}
          </span>
        </div>
      </footer>
    </div>
  );
}
