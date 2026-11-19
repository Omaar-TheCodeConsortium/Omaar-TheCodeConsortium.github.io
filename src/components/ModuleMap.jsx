import { useEffect, useRef, useState } from 'react';
import Fill from './Fill.jsx';
import { LABEL } from './ProductBits.jsx';

const STATUS_TEXT = { built: 'Built', building: 'In progress', planned: 'Planned' };
const slug = (name) =>
  'module-' +
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
const pad = (n) => String(n).padStart(2, '0');

// "What it does" for a product with many modules in groups. The modules run down the right; on wide
// screens a map of all of them stays in view on the left, lights up the one being read, and shows
// how the modules hand work to each other. On phones a bar of the groups stays at the top instead.
export default function ModuleMap({ product, frame }) {
  const modules = product.modules.map((module, index) => ({ ...module, index, id: slug(module.name) }));
  const groups = [...new Set(modules.map((module) => module.group))].map((name) => ({
    name,
    id: slug(name).replace('module-', 'group-'),
    members: modules.filter((module) => module.group === name),
  }));
  const byName = Object.fromEntries(modules.map((module) => [module.name, module]));
  const links = (product.connections ?? []).filter((link) => byName[link.from] && byName[link.to]);

  const [current, setCurrent] = useState(0);
  const [link, setLink] = useState(null);
  const list = useRef(null);
  const bar = useRef(null);

  // Follow the module in the middle of the screen.
  useEffect(() => {
    const items = list.current.querySelectorAll('[data-module]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(Number(entry.target.dataset.module));
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const currentGroup = modules[current].group;

  // Phones: keep the current group's button in view in the bar.
  useEffect(() => {
    const strip = bar.current;
    const chip = strip?.querySelector('[aria-current]');
    if (!chip || strip.scrollWidth <= strip.clientWidth) return;
    strip.scrollTo({ left: chip.offsetLeft - 24, behavior: 'smooth' });
  }, [currentGroup]);
  const lit = link === null ? null : [byName[links[link].from].index, byName[links[link].to].index];

  const tileClass = (module) => {
    if (lit) {
      return lit.includes(module.index) ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-300';
    }
    if (module.index === current) return 'border-black bg-black text-white';
    if (module.group === currentGroup) return 'border-black bg-white text-black';
    return 'border-gray-300 bg-white text-gray-400 hover:border-black hover:text-black';
  };

  return (
    <section aria-labelledby="does-title" className={`${frame} grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]`}>
      <div className="border-b border-gray-300 p-6 md:border-b-0 md:border-r md:p-12 lg:p-16">
        <div className="md:[@media(min-height:780px)]:sticky md:[@media(min-height:780px)]:top-28">
          <h2 id="does-title" className="text-4xl font-bold tracking-tight md:text-5xl">
            What it does
          </h2>
          <p className="mt-4 max-w-md text-gray-600">
            {modules.length} modules in {groups.length} groups. A property takes the ones it needs, and they all work from the same guests, rooms and tables.
          </p>

          <nav aria-label={`${product.name} modules`} className="mt-8 hidden space-y-4 md:block">
            {groups.map((group) => (
              <div key={group.id}>
                <a
                  href={`#${group.id}`}
                  className={`mb-2 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-widest transition-colors duration-300 ${
                    group.name === currentGroup && !lit ? 'text-black' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  <span>{group.name}</span>
                  <span>{pad(group.members.length)}</span>
                </a>
                <ol className="grid grid-cols-[repeat(7,2.25rem)] gap-1.5">
                  {group.members.map((module) => (
                    <li key={module.id}>
                      <a
                        href={`#${module.id}`}
                        title={module.name}
                        aria-label={`${pad(module.index + 1)}. ${module.name}`}
                        aria-current={module.index === current ? 'true' : undefined}
                        className={`flex aspect-square items-center justify-center border font-mono text-[11px] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${tileClass(module)}`}
                      >
                        {pad(module.index + 1)}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
            <p className="flex min-h-[3rem] items-baseline gap-3 border-t border-gray-300 pt-4">
              <span className={LABEL}>{lit ? 'Linked' : 'Reading'}</span>
              <span className="font-semibold">
                {lit ? `${links[link].from} → ${links[link].to}` : `${pad(current + 1)} · ${modules[current].name}`}
              </span>
            </p>
          </nav>

          {links.length > 0 ? (
            <div className="mt-10 md:mt-8">
              <h3 className={LABEL}>How they work together</h3>
              <ul className="mt-3 border-t border-gray-300">
                {links.map((item, i) => (
                  <li
                    key={item.line}
                    tabIndex={0}
                    onMouseEnter={() => setLink(i)}
                    onMouseLeave={() => setLink(null)}
                    onFocus={() => setLink(i)}
                    onBlur={() => setLink(null)}
                    className={`border-b border-gray-300 py-3 outline-none transition-colors duration-300 focus-visible:bg-gray-50 ${link === i ? 'md:bg-gray-50' : ''}`}
                  >
                    <span className="block font-mono text-[11px] uppercase tracking-widest text-gray-500">
                      {pad(byName[item.from].index + 1)} {item.from} → {pad(byName[item.to].index + 1)} {item.to}
                    </span>
                    <span className="mt-1 block text-sm text-gray-700">{item.line}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <div ref={list} className="pb-6 md:p-12 lg:p-16">
        {/* Phones: the groups, kept in reach while the list scrolls */}
        <nav ref={bar} aria-label={`${product.name} module groups`} className="sticky top-20 z-10 -mt-px mb-6 flex gap-1 overflow-x-auto border-b border-gray-300 bg-white px-6 py-3 md:hidden">
          {groups.map((group) => (
            <a
              key={group.id}
              href={`#${group.id}`}
              aria-current={group.name === currentGroup ? 'true' : undefined}
              className={`flex min-h-[44px] flex-none items-center rounded-full border px-4 font-mono text-[11px] uppercase tracking-widest transition-colors duration-300 ${
                group.name === currentGroup ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-600'
              }`}
            >
              {group.name} <span className="ml-2 opacity-60">{group.members.length}</span>
            </a>
          ))}
        </nav>

        <div className="space-y-12 px-6 md:px-0">
          {groups.map((group) => (
            <section key={group.id} id={group.id} aria-labelledby={`${group.id}-title`} className="scroll-mt-40 md:scroll-mt-28">
              <h3 id={`${group.id}-title`} className="mb-4 flex items-baseline justify-between text-2xl font-bold tracking-tight">
                {group.name}
                <span className={LABEL}>{group.members.length} modules</span>
              </h3>
              <ul className="border-t border-gray-300">
                {group.members.map((module) => (
                  <li
                    key={module.id}
                    id={module.id}
                    data-module={module.index}
                    className="grid scroll-mt-40 grid-cols-[2.25rem_1fr_auto] gap-x-4 gap-y-1 border-b border-gray-300 py-4 md:scroll-mt-32"
                  >
                    <span className={`row-span-2 font-mono text-xs transition-colors duration-300 ${module.index === current ? 'text-black' : 'text-gray-400'}`}>{pad(module.index + 1)}</span>
                    <strong className="font-semibold">{module.name}</strong>
                    <span className="row-span-2 self-start font-mono text-[11px] uppercase tracking-widest text-gray-500">
                      <Fill value={STATUS_TEXT[module.status]} label="Status" />
                    </span>
                    <span className="text-sm text-gray-600">{module.detail}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
