import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

// Sections of the home page, then pages. The concept builds are linked from the footer.
const LINKS = [
  { label: 'Products', section: 'products' },
  { label: 'How we work', section: 'model' },
  { label: 'Team', section: 'company' },
  { label: 'Prototypes', to: '/prototypes/' },
];

const chars = '!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function ScrambleLink({ to, onClick, children, isDarkTheme, theme }) {
  const text = children.toUpperCase();
  const [displayText, setDisplayText] = useState(text);
  const [scrambledIndices, setScrambledIndices] = useState(new Set());
  const intervalRef = useRef(null);

  const startScramble = () => {
    let iterations = 0;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const newIndices = new Set();
      const scrambledWord = text.split('').map((char, index) => {
        if (char === ' ') return ' ';

        if (index < iterations) {
          return text[index];
        }

        newIndices.add(index);
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');

      setDisplayText(scrambledWord);
      setScrambledIndices(newIndices);

      if (iterations >= text.length) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
        setScrambledIndices(new Set());
      }

      iterations += text.length / 10;
    }, 35);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current);
    setDisplayText(text);
    setScrambledIndices(new Set());
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const isLightFintech = theme === 'light-fintech';
  const isSalon = theme === 'salon';

  return (
    <Link
      to={to}
      onClick={onClick}
      onMouseEnter={startScramble}
      onMouseLeave={stopScramble}
      className={`font-mono uppercase text-sm transition-colors duration-200 cursor-pointer select-none tracking-widest ${isLightFintech
        ? 'text-slate-600 hover:text-orange-600'
        : isSalon
          ? 'text-slate-300 hover:text-indigo-400'
          : isDarkTheme ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-black'
        }`}
    >
      {displayText.split('').map((char, index) => {
        const isScrambled = scrambledIndices.has(index);
        return (
          <span
            key={index}
            className={isScrambled ? (isLightFintech ? 'text-orange-500 font-bold' : isSalon ? 'text-indigo-400 font-bold' : 'text-blue-500 font-bold') : 'text-inherit'}
          >
            {char}
          </span>
        );
      })}
    </Link>
  );
}

export default function Navbar({ isDarkTheme = false, hideOnScroll = false, theme = "" }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!hideOnScroll) {
      setIsVisible(true);
      return;
    }
    const diff = latest - lastScrollY.current;
    if (latest < 50) {
      setIsVisible(true);
    } else if (diff > 10) {
      setIsVisible(false); // scroll down
    } else if (diff < -10) {
      setIsVisible(true); // scroll up
    }
    lastScrollY.current = latest;
  });

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Automatically scroll to hash element on homepage load/change
  useEffect(() => {
    if (isHomePage && location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [location, isHomePage]);

  const handleLinkClick = (e, sectionId) => {
    if (isHomePage) {
      e.preventDefault();
      handleScrollTo(sectionId);
    }
    setIsMobileMenuOpen(false);
  };

  const isLightFintech = theme === 'light-fintech';
  const isSalon = theme === 'salon';

  const ctaClass = isLightFintech
    ? 'bg-orange-600 border-orange-600 text-white hover:bg-transparent hover:text-orange-600'
    : isSalon
      ? 'bg-[#5b58f4] border-[#5b58f4] text-white hover:bg-transparent hover:text-[#5b58f4]'
      : isDarkTheme
        ? 'bg-blue-600 border-blue-600 text-white hover:bg-transparent hover:text-blue-400'
        : 'bg-black text-white border-black hover:bg-white hover:text-black';
  const drawerLinkClass = isLightFintech
    ? 'text-slate-600 hover:text-orange-600'
    : isSalon || isDarkTheme
      ? 'text-slate-400 hover:text-white'
      : 'text-gray-500 hover:text-black';

  return (
    <motion.nav
      animate={{ y: isVisible ? 0 : -80 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={`fixed top-0 left-0 w-full z-50 h-20 transition-colors duration-300 ${isLightFintech
        ? 'bg-white/80 border-b border-orange-200/50 backdrop-blur-md'
        : isSalon
          ? 'bg-slate-900 border-b border-indigo-500/25'
          : isDarkTheme
            ? 'bg-[#0b0f19]/90 border-b border-white/10 backdrop-blur-md'
            : 'bg-white border-b border-gray-300'
        }`}
    >
      <div className="max-w-screen-2xl mx-auto h-full flex justify-between items-center px-6 md:px-12">
        <Link to="/" className="flex items-center gap-4">
          <img
            alt=""
            className="h-12 w-auto object-contain"
            src="/logo.png"
          />
          <div className={`font-mono text-base md:text-lg font-semibold tracking-widest uppercase transition-colors duration-300 ${isLightFintech
            ? 'text-slate-800'
            : isDarkTheme || isSalon ? 'text-white' : 'text-gray-800'
            }`}>The Code Consortium</div>
        </Link>

        <div className="hidden lg:flex items-center space-x-8">
          {LINKS.map((link) => (
            <ScrambleLink
              key={link.label}
              to={link.section ? (isHomePage ? `#${link.section}` : `/#${link.section}`) : link.to}
              onClick={(e) => (link.section ? handleLinkClick(e, link.section) : setIsMobileMenuOpen(false))}
              isDarkTheme={isDarkTheme}
              theme={theme}
            >
              {link.label}
            </ScrambleLink>
          ))}
          <Link
            className={`px-6 py-2 font-mono uppercase text-sm transition-all duration-200 border ${ctaClass}`}
            to={isHomePage ? "#contact" : "/#contact"}
            onClick={(e) => handleLinkClick(e, 'contact')}
          >
            Contact us
          </Link>
        </div>

        <button
          className={`lg:hidden focus:outline-none transition-colors duration-300 ${isLightFintech
            ? 'text-slate-800'
            : isDarkTheme || isSalon ? 'text-white' : 'text-black'
            }`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <span className="material-symbols-outlined">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden absolute top-20 left-0 w-full z-50 flex flex-col p-6 space-y-1 shadow-lg border-b transition-colors duration-300 ${isLightFintech
          ? 'bg-[#FFF8F0] border-orange-200/50 text-slate-800'
          : isSalon
            ? 'bg-slate-900 border-indigo-500/25 text-white'
            : isDarkTheme ? 'bg-[#0b0f19] border-white/10 text-white' : 'bg-white border-gray-300'
          }`}>
          {LINKS.map((link) => (
            <Link
              key={link.label}
              className={`font-mono uppercase text-sm py-3 transition-colors duration-200 ${drawerLinkClass}`}
              to={link.section ? (isHomePage ? `#${link.section}` : `/#${link.section}`) : link.to}
              onClick={(e) => (link.section ? handleLinkClick(e, link.section) : setIsMobileMenuOpen(false))}
            >
              {link.label}
            </Link>
          ))}
          <Link
            className={`mt-3 px-6 py-3 font-mono uppercase text-sm text-center border transition-all duration-200 ${ctaClass}`}
            to={isHomePage ? "#contact" : "/#contact"}
            onClick={(e) => handleLinkClick(e, 'contact')}
          >
            Contact us
          </Link>
        </div>
      )}
    </motion.nav>
  );
}
