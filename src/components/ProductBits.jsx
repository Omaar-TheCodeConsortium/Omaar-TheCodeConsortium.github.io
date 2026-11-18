import Fill from './Fill.jsx';

export const LABEL = 'font-mono text-xs uppercase tracking-widest text-gray-500';

const STATUS_TEXT = { built: 'Built', building: 'In progress', planned: 'Planned' };

// A product's stage, with a filled dot when people can use it today.
export function Stage({ product }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-widest">
      <span className="inline-flex items-center gap-2 border border-black px-2.5 py-1">
        <span aria-hidden="true" className={`h-2 w-2 rounded-full border border-black ${product.live ? 'bg-black' : ''}`} />
        {product.stage}
      </span>
      <span className="text-gray-500">{product.stageNote}</span>
    </p>
  );
}

export function ModuleList({ modules }) {
  return (
    <ul className="border-t border-gray-300">
      {modules.map((module) => (
        <li key={module.name} className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 border-b border-gray-300 py-4">
          <strong className="font-semibold">{module.name}</strong>
          <span className="row-span-2 self-start font-mono text-[11px] uppercase tracking-widest text-gray-500">
            <Fill value={STATUS_TEXT[module.status]} label="Status" />
          </span>
          <span className="text-sm text-gray-600">{module.detail}</span>
        </li>
      ))}
    </ul>
  );
}

// A phone screen from the real app, in a plain black frame.
export function Phone({ shot, eager = false, className = '' }) {
  return (
    <span className={`block overflow-hidden rounded-[2rem] border-[6px] border-black bg-black shadow-[0_24px_48px_-24px_rgba(0,0,0,0.45)] ${className}`}>
      <img
        src={shot.src}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="block h-auto w-full rounded-[1.6rem]"
      />
    </span>
  );
}

// A wide product screen in a plain browser frame, or a marked gap until one is supplied.
export function Screen({ shot, label }) {
  return (
    <span className="block w-full border border-gray-300 bg-white shadow-[0_24px_48px_-28px_rgba(0,0,0,0.35)]">
      <span aria-hidden="true" className="flex gap-1.5 border-b border-gray-300 px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-gray-300" />
        <span className="h-2 w-2 rounded-full bg-gray-300" />
        <span className="h-2 w-2 rounded-full bg-gray-300" />
      </span>
      {shot ? (
        <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} loading="lazy" decoding="async" className="block h-auto w-full" />
      ) : (
        <span className="flex aspect-[16/10] items-center justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] p-6 text-center font-mono text-xs uppercase tracking-widest">
          <Fill value={null} label={label} />
        </span>
      )}
    </span>
  );
}

export function ExternalLink({ href, children, className = '' }) {
  return (
    <a href={href} target="_blank" rel="noopener" className={className}>
      {children}
      <span aria-hidden="true" className="ml-1.5">↗</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export const BUTTON_DARK =
  'inline-flex min-h-[48px] items-center justify-center rounded-full border border-black bg-black px-8 py-3 text-center font-mono text-sm uppercase text-white transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black';
export const BUTTON_LIGHT =
  'inline-flex min-h-[48px] items-center justify-center rounded-full border border-gray-300 bg-white px-8 py-3 text-center font-mono text-sm uppercase text-black transition-colors hover:border-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black';
export const TEXT_LINK =
  'font-mono text-xs uppercase tracking-widest text-black underline decoration-gray-300 decoration-1 underline-offset-4 transition-colors hover:decoration-black';
