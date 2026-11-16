// Single source of truth for the concept builds.
// Read by the library page, the router, the transition, the SEO layer and the pre-render script.
//
// status: 'planned' -> holding page, hidden from search engines and the sitemap
//         'live'    -> full site, indexed
//
// palette: two quiet colours and one loud one. `onLoud` is the text colour that
// passes contrast on top of `loud`. Run `npm run check:contrast` after changing any of these.

// routes: the pages of a built concept (path, title, description). A concept without routes
// is a single holding page at `path`.

import { PAGES as GRANDSTAR_PAGES } from './grandstar/site.js';
import { PAGES as SUNLOOM_PAGES } from './sunloom/site.js';
import { PAGES as HOXEN_PAGES } from './hoxen/site.js';
import { PAGES as TOPFORCE_PAGES } from './topforce/site.js';
import { DIRECT_PAGES as TRADEWIN_DIRECT_PAGES, TRADE_PAGES as TRADEWIN_TRADE_PAGES } from './tradewin/site.js';

export const LIBRARY_PATH = '/concepts/';

export const CONCEPTS = [
  {
    slug: 'grandstar',
    path: '/concepts/grandstar/',
    order: 1,
    name: 'Grandstar Precision',
    legalName: 'Dongguan Grandstar Precision Technology Co., Ltd.',
    category: 'Industrial manufacturing',
    audience: 'B2B',
    city: 'Dongguan, Guangdong',
    coords: '23.02° N, 113.75° E',
    summary:
      'An injection moulding and 3D printing supplier. Photographs of the plant carry measured callouts, and a quote builder prices a part as you configure it.',
    signature: 'Live quote builder',
    pages: ['Home', 'Capabilities', 'Materials library', 'Instant quote', 'Case study', 'Quality and certifications'],
    palette: { paper: '#E8EBEE', ink: '#101B2D', loud: '#D62B1F', onLoud: '#FFFFFF' },
    display: "'Mona Sans Variable', 'Helvetica Neue', Arial, sans-serif",
    displayWeight: 800,
    status: 'live',
    routes: GRANDSTAR_PAGES,
    load: () => import('./grandstar/index.jsx'),
  },
  {
    slug: 'sunloom',
    path: '/concepts/sunloom/',
    order: 2,
    name: 'Sunloom International',
    legalName: 'Shaoxing Sunloom International Home Textile Co., Ltd.',
    category: 'Lifestyle and home textiles',
    audience: 'B2C and wholesale',
    city: 'Shaoxing, Zhejiang',
    coords: '30.00° N, 120.58° E',
    summary:
      'A washed-linen bedding and homeware brand. Choosing a colour swatch re-tints the whole product page.',
    signature: 'Swatch-driven product page',
    pages: ['Home', 'Collection', 'Product', 'Our mill', 'Wholesale enquiry', 'Cart'],
    palette: { paper: '#EDE6D8', ink: '#2B2622', loud: '#23408F', onLoud: '#FFFFFF' },
    display: "'Newsreader Variable', Georgia, 'Times New Roman', serif",
    displayWeight: 300,
    status: 'live',
    routes: SUNLOOM_PAGES,
    load: () => import('./sunloom/index.jsx'),
  },
  {
    slug: 'hoxen',
    path: '/concepts/hoxen/',
    order: 3,
    name: 'Hoxen',
    legalName: 'Shenzhen Hoxen Technology Co., Ltd.',
    category: 'Tech hardware',
    audience: 'B2C',
    city: 'Shenzhen, Guangdong',
    coords: '22.54° N, 114.06° E',
    summary:
      'Chargers, cables and phone cases. Scrolling takes a charger apart part by part, with the spec attached to each, and a checker picks the right one for your devices.',
    signature: 'Scroll-driven exploded view',
    pages: ['Home', 'Product configurator', 'Compare', 'Compatibility checker', 'Cart'],
    palette: { paper: '#D9DCDF', ink: '#16181C', loud: '#FF5A00', onLoud: '#16181C' },
    display: "'Schibsted Grotesk Variable', 'Helvetica Neue', Arial, sans-serif",
    displayWeight: 700,
    status: 'live',
    routes: HOXEN_PAGES,
    load: () => import('./hoxen/index.jsx'),
  },
  {
    slug: 'topforce',
    path: '/concepts/topforce/',
    order: 4,
    name: 'Topforce Sports',
    legalName: 'Nantong Topforce Sports Goods Co., Ltd.',
    category: 'Fitness equipment',
    audience: 'B2C',
    city: 'Nantong, Jiangsu',
    coords: '31.98° N, 120.89° E',
    summary:
      'Barbells, plates, dumbbells and racks, priced by the kilo. Load plates onto a barbell and the total weight and price update as you go.',
    signature: 'Barbell loader',
    pages: ['Home', 'Shop', 'Product', 'Set builder', 'Cart'],
    palette: { paper: '#F1EFE9', ink: '#121212', loud: '#D4F000', onLoud: '#121212' },
    display: "'Big Shoulders Variable', 'Arial Narrow', Impact, sans-serif",
    displayWeight: 800,
    status: 'live',
    routes: TOPFORCE_PAGES,
    load: () => import('./topforce/index.jsx'),
  },
  {
    slug: 'tradewin-direct',
    path: '/concepts/tradewin/',
    order: 5,
    name: 'Tradewin Direct',
    legalName: 'Yiwu Tradewin Global Supply Chain Co., Ltd.',
    category: 'Drop shipping, consumer shop',
    audience: 'B2C',
    city: 'Yiwu, Zhejiang',
    coords: '29.31° N, 120.08° E',
    summary:
      'A shop of small useful goods shipped straight from the source, with order tracking from warehouse to door.',
    signature: 'Direct / Wholesale switch',
    pages: ['Home', 'Category', 'Product', 'Cart', 'Order tracking'],
    routes: TRADEWIN_DIRECT_PAGES,
    // How the library lists it: one card for the company, which opens on the shop and holds the trade side too.
    listing: {
      name: 'Tradewin',
      category: 'Drop shipping, shop and trade counter',
      audience: 'B2C + B2B',
      summary:
        'One catalogue with two sides. Tradewin Direct sells a single item to a shopper; Tradewin Wholesale sells the same item by the carton to a reseller. Any page flips between them.',
    },
    palette: { paper: '#F6EFE2', ink: '#0F3B2E', loud: '#FF4F5E', onLoud: '#0E1F18' },
    display: "'Bricolage Grotesque Variable', 'Helvetica Neue', Arial, sans-serif",
    displayWeight: 700,
    status: 'planned',
    load: () => import('./tradewin/index.jsx'),
  },
  {
    slug: 'tradewin-wholesale',
    path: '/concepts/tradewin/wholesale/',
    order: 6,
    name: 'Tradewin Wholesale',
    legalName: 'Yiwu Tradewin Global Supply Chain Co., Ltd.',
    category: 'Drop shipping, trade portal',
    audience: 'B2B',
    city: 'Yiwu, Zhejiang',
    coords: '29.31° N, 120.08° E',
    summary:
      'The same catalogue for resellers: tiered pricing, minimum quantities and a margin calculator.',
    signature: 'Direct / Wholesale switch',
    pages: ['Dashboard', 'Catalogue with tier pricing', 'Product, trade view', 'Margin calculator', 'Supplier terms'],
    routes: TRADEWIN_TRADE_PAGES,
    // Served by the Tradewin Direct module, whose address this one sits under, so the two share one mounted tree.
    within: 'tradewin-direct',
    palette: { paper: '#0F3B2E', ink: '#F6EFE2', loud: '#FF4F5E', onLoud: '#0E1F18' },
    display: "'Bricolage Grotesque Variable', 'Helvetica Neue', Arial, sans-serif",
    displayWeight: 700,
    status: 'planned',
    load: () => import('./tradewin/index.jsx'),
  },
];

// What the library shows: one card per company. A concept served `within` another shares that one's card.
export const LISTED = CONCEPTS.filter((concept) => !concept.within).map((concept) => ({ ...concept, ...concept.listing }));

const withSlash = (pathname) => (pathname.endsWith('/') ? pathname : `${pathname}/`);

// The concept whose address exactly matches.
export function findConceptByPath(pathname) {
  const normalised = withSlash(pathname);
  return CONCEPTS.find((concept) => concept.path === normalised) ?? null;
}

// The concept a page belongs to: the longest concept address the path starts with.
export function findConceptForPath(pathname) {
  const normalised = withSlash(pathname);
  return (
    CONCEPTS.filter((concept) => normalised.startsWith(concept.path)).sort(
      (a, b) => b.path.length - a.path.length,
    )[0] ?? null
  );
}

// Every address that should exist as a page: one per route of a built concept,
// or the single holding page of a planned one.
export const conceptPaths = (concept) => (concept.routes ? concept.routes.map((route) => route.path) : [concept.path]);

export const pad2 = (n) => String(n).padStart(2, '0');
