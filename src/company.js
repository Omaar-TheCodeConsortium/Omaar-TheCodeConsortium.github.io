// Facts about the company, its people and its products, kept in one place.
//
// A value left as null shows on the page as a marked gap, such as "[City]", so the preview
// can be reviewed before every fact is in. A production build stops while any gap is left
// (see scripts/prerender.mjs), so a gap can never go live.

export const COMPANY = {
  name: 'The Code Consortium',
  legalName: null, // as registered, e.g. "The Code Consortium (Private) Limited"
  registration: null, // company registration number
  founded: null, // year, e.g. 2024
  city: null,
  country: 'Sri Lanka',
  email: null, // the address the site should show for general enquiries
  github: 'https://github.com/Omaar-TheCodeConsortium',
  linkedin: null, // the company's LinkedIn page, if it has one
};

// Each founder needs a public profile link: programmes check the team against outside sources.
// photo is a path under public/, e.g. '/team/omaar.jpg'.
export const FOUNDERS = [
  {
    name: 'Omaar Fazey',
    role: 'Co-founder and Chief Operating Officer',
    linkedin: 'https://www.linkedin.com/in/omaar-fazey-b7504726a',
    photo: null,
    bio: null, // one or two sentences: what they did before and what they own here
  },
  { name: null, role: null, linkedin: null, photo: null, bio: null },
  { name: null, role: null, linkedin: null, photo: null, bio: null },
];

// Why we are building Spear, in the founders' own words. Three to five sentences.
export const FOUNDER_NOTE = null;

// status: 'built', 'building' or 'planned'. null shows as a gap.
export const PRODUCTS = [
  {
    slug: 'spear-os',
    name: 'Spear OS',
    path: '/products/spear-os/',
    site: 'https://spear-os.com/',
    siteLabel: 'spear-os.com',
    stage: 'In development',
    stageNote: 'Being built with its first customer',
    live: false,
    line: 'One system for running a hotel and its restaurant.',
    summary:
      'Spear OS puts the rooms, the guest bills, the restaurant till, the menus and the reservations in one place, so a stay and everything charged to it end up on one bill.',
    audience: 'Hotels, villas and boutique resorts, and the restaurants and cafés inside them.',
    pricing: 'Monthly or yearly subscription.',
    modules: [
      { name: 'Property management', detail: 'Rooms, rates, stays and the guest bill.', status: null },
      { name: 'Restaurant till', detail: 'Takes orders and payments, and keeps working when the internet drops.', status: null },
      { name: 'QR menus', detail: 'Guests read the menu and order from their table.', status: null },
      { name: 'Reservations', detail: 'One queue for room and table bookings.', status: null },
    ],
    milestones: [
      { what: 'First customer live', when: null },
      { what: 'Open to new customers', when: null },
    ],
    shots: [], // e.g. [{ src: '/products/spear-os-folio.webp', alt: '…', width: 1600, height: 1000 }]
  },
  {
    slug: 'tea-os',
    name: 'Spear Tea OS',
    path: '/products/tea-os/',
    site: 'https://teashopos.spear-os.com/',
    siteLabel: 'teashopos.spear-os.com',
    app: 'https://teashopos.spear-os.com/app/',
    stage: 'Released',
    stageNote: 'First shop lined up',
    live: true,
    line: 'A running tab for every customer, on the shop’s own phone.',
    summary:
      'In a tea shop people order all evening and pay when they leave. Spear Tea OS keeps a tab for each of them: open it with a name, tap what they order, close it when they pay.',
    audience: 'Tea shops, cafés and places where customers pay at the end.',
    pricing: 'A licence activated on the shop’s phone. No monthly fee.',
    modules: [
      { name: 'Tabs', detail: 'One per customer, with a colour or table number when names clash.', status: 'built' },
      { name: 'Works offline', detail: 'Install it once and it runs with no internet at all.', status: 'built' },
      { name: 'Three languages', detail: 'Sinhala, Tamil and English.', status: 'built' },
      { name: 'Owner PIN and log', detail: 'Discounts, cancellations and removed items need the owner’s PIN, and every change is logged.', status: 'built' },
      { name: 'Nightly reports', detail: 'Takings, best sellers, cash against transfer. Sales after midnight count to the night they started.', status: 'built' },
      { name: 'Backups', detail: 'Export to Excel, or save a full backup to Google Drive or WhatsApp.', status: 'built' },
    ],
    milestones: [
      { what: 'Released', when: null },
      { what: 'First shop using it', when: null },
    ],
    shots: [
      { src: '/products/tea-os-home.webp', alt: 'Spear Tea OS: the open tabs, with tonight’s takings at the top', width: 436, height: 940 },
      { src: '/products/tea-os-tab.webp', alt: 'Spear Tea OS: one customer’s tab, with the menu as a grid of buttons', width: 372, height: 804 },
      { src: '/products/tea-os-close.webp', alt: 'Spear Tea OS: closing a tab of Rs 1,950, paid in cash', width: 426, height: 922 },
    ],
  },
];

export const productBySlug = (slug) => PRODUCTS.find((product) => product.slug === slug);

// Working demos built to test ideas outside hospitality. Not on sale.
export const PROTOTYPES = [
  {
    path: '/project/bakery-os',
    name: 'BakeryOS',
    line: 'A counter till for a bakery: shifts, sales, promotions and stock.',
    image: '/bakery-sales.png',
    alt: 'BakeryOS sales report',
  },
  {
    path: '/project/hris-command-center',
    name: 'HRIS Command Center',
    line: 'People, rosters, payroll and staff transport for a large call centre. Built as a proof of concept for a prospective customer.',
    image: '/hris-showcase.png',
    alt: 'HRIS Command Center overview screen',
  },
  {
    path: '/project/bespoke-salon',
    name: 'Bespoke Salon',
    line: 'Bookings, client records, treatments and retail stock for a hair salon.',
    image: '/salon-showcase.png',
    alt: 'Bespoke Salon bookings screen',
  },
];
