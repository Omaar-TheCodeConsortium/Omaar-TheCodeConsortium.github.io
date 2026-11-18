import { Link } from 'react-router-dom';
import { COMPANY } from '../company.js';

const LINKS = [
  { label: 'Spear OS', to: '/products/spear-os/' },
  { label: 'Spear Tea OS', to: '/products/tea-os/' },
  { label: 'TCCOS', to: '/products/tccos/' },
  { label: 'Lab', to: '/lab/' },
  { label: 'Concept builds', to: '/concepts/' },
  { label: 'GitHub', href: COMPANY.github },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms', to: '/terms' },
];

export default function Footer({ isDarkTheme = false, theme = "" }) {
  const isLightFintech = theme === 'light-fintech';
  const isSalon = theme === 'salon';
  const linkClass = `transition-colors duration-300 ${isLightFintech
    ? 'text-slate-600 hover:text-orange-600 font-semibold'
    : isSalon
      ? 'text-slate-400 hover:text-indigo-400 font-semibold'
      : isDarkTheme ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-black'
    }`;

  return (
    <footer className={`relative w-full border-t transition-colors duration-300 overflow-hidden ${isLightFintech
      ? 'border-orange-200/40 bg-[#FFF7ED]'
      : isSalon
        ? 'border-indigo-500/20 bg-slate-900'
        : isDarkTheme
          ? 'border-white/10 bg-[#0b0f19]'
          : 'border-gray-300 bg-white'
      }`}>
      {/* Premium Background Grid Pattern matching case studies */}
      <div className={`absolute inset-0 pointer-events-none opacity-[0.20] mix-blend-overlay ${isLightFintech
        ? 'bg-[linear-gradient(to_right,#ea580c0c_1px,transparent_1px),linear-gradient(to_bottom,#ea580c0c_1px,transparent_1px)] bg-[size:4rem_4rem]'
        : isSalon
          ? 'bg-[linear-gradient(to_right,#5b58f40f_1px,transparent_1px),linear-gradient(to_bottom,#5b58f40f_1px,transparent_1px)] bg-[size:4rem_4rem]'
          : isDarkTheme
            ? 'bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:48px_48px]'
            : 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]'
        }`}
      />

      <div className={`relative z-10 max-w-screen-2xl mx-auto w-full border-l border-r p-6 md:p-12 flex flex-col md:flex-row justify-between items-center md:items-center gap-4 md:gap-8 text-center md:text-left transition-colors duration-300 ${isLightFintech
        ? 'border-orange-200/40'
        : isSalon
          ? 'border-indigo-500/20'
          : isDarkTheme
            ? 'border-white/10'
            : 'border-gray-300'
        }`}>
        <div className={`font-bold text-xl tracking-tight uppercase transition-colors duration-300 w-full md:w-auto text-center md:text-left ${isLightFintech
          ? 'text-slate-800'
          : isDarkTheme || isSalon ? 'text-white' : 'text-gray-900'
          }`}>
          The Code Consortium
        </div>
        <nav aria-label="Footer" className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 font-mono text-xs uppercase">
          {LINKS.map((link) =>
            link.href ? (
              <a key={link.label} className={linkClass} href={link.href} target="_blank" rel="noopener">
                {link.label}
                <span aria-hidden="true"> ↗</span>
              </a>
            ) : (
              <Link key={link.label} className={linkClass} to={link.to}>
                {link.label}
              </Link>
            ),
          )}
        </nav>
        <div className={`font-mono text-xs uppercase transition-colors duration-300 ${isLightFintech ? 'text-slate-500' : isDarkTheme || isSalon ? 'text-slate-500' : 'text-gray-500'
          }`}>
          © 2026 {COMPANY.name}
        </div>
      </div>
    </footer>
  );
}
