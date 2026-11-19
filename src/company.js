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
    industry: 'Hospitality',
    tags: ['Hotels and restaurants', '19 modules', 'Till works offline', 'Subscription'],
    path: '/products/spear-os/',
    site: 'https://spear-os.com/',
    siteLabel: 'spear-os.com',
    stage: 'Built',
    stageNote: 'Going live with its first customer',
    live: false,
    line: 'One system for running a hotel and its restaurant.',
    summary:
      'Spear OS runs the rooms, the restaurant, the kitchen, the guests and the staff of a hotel in one system. Bookings from every channel land on one calendar, dinner is charged straight to the room, and a stay and everything charged to it end up on one bill.',
    audience: 'Boutique hotels, B&Bs, hostels and resorts, and the restaurants, cafés and bars inside them or on their own.',
    pricing: 'A monthly subscription per property, in three packages: Restaurant, Hotel, or both in one. Hosting, updates and support included.',
    modules: [
      { group: 'Hotel', name: 'Hotel PMS', detail: 'Rooms, reservations and the guest folio in one record.', status: 'built' },
      { group: 'Hotel', name: 'Booking engine', detail: 'Commission-free bookings on the hotel’s own website.', status: 'built' },
      { group: 'Hotel', name: 'Channel manager', detail: 'Booking.com, Expedia, Agoda and Airbnb kept in step, so no room is sold twice.', status: 'built' },
      { group: 'Hotel', name: 'Revenue management', detail: 'Rates that follow occupancy and demand, sent to every channel at once.', status: 'built' },
      { group: 'Hotel', name: 'Sales and banqueting', detail: 'Event orders that block rooms, hold spaces and order the food.', status: 'built' },
      { group: 'Restaurant', name: 'Offline POS', detail: 'A desktop till that keeps trading when the internet drops.', status: 'built' },
      { group: 'Restaurant', name: 'QR and tablet ordering', detail: 'Guests order from the table, waiters from a tablet.', status: 'built' },
      { group: 'Restaurant', name: 'Menus and recipes', detail: 'Every dish costed to the gram.', status: 'built' },
      { group: 'Restaurant', name: 'Kitchen display', detail: 'Tickets on any screen, coloured by how long they have waited.', status: 'built' },
      { group: 'Restaurant', name: 'Kitchen inventory', detail: 'Stock deducted with every sale.', status: 'built' },
      { group: 'Restaurant', name: 'Reservations and floor plan', detail: 'Tables booked from the plan the restaurant draws; seating a party opens its bill.', status: 'built' },
      { group: 'Restaurant', name: 'Buffet management', detail: 'Prep planned by headcount, refills by line.', status: 'built' },
      { group: 'Guests', name: 'Desk check-in', detail: 'ID checked at the desk, then the stay handed to the guest’s phone.', status: 'built' },
      { group: 'Guests', name: 'Guest messaging', detail: 'WhatsApp, SMS and email in one inbox.', status: 'built' },
      { group: 'Guests', name: 'Guest profiles', detail: 'Preferences and spend across stays and meals.', status: 'built' },
      { group: 'Guests', name: 'Smart locks', detail: 'Room keys in Apple and Google Wallet that follow the stay dates.', status: 'built' },
      { group: 'Property and staff', name: 'Housekeeping and supplies', detail: 'Cleaning jobs and amenities, room by room.', status: 'built' },
      { group: 'Property and staff', name: 'Staff and timeclock', detail: 'Rotas, and clock-ins verified on site.', status: 'built' },
      { group: 'Property and staff', name: 'Hotel website', detail: 'The hotel’s own site, booking rooms and tables straight from Spear.', status: 'built' },
    ],
    milestones: [
      { what: 'First customer live', when: null },
      { what: 'Open to new customers', when: null },
    ],
    preview: true, // shown as the animated preview in src/components/SpearPreview.jsx
    shots: [],
  },
  {
    slug: 'tea-os',
    name: 'Spear Tea OS',
    industry: 'Hospitality',
    tags: ['Any phone', 'Sinhala, Tamil, English', 'No monthly fee'],
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
  {
    slug: 'tccos',
    name: 'TCCOS',
    industry: 'Workforce',
    tags: ['BPOs', 'Rosters and payroll', 'Staff transport'],
    path: '/products/tccos/',
    site: null,
    stage: 'In development',
    stageNote: 'Not on sale yet',
    live: false,
    line: 'The people system for companies that run around the clock.',
    summary:
      'TCCOS runs the staff side of a BPO or any large shift-based business: who works where and when, leave and attendance, payroll, and the vans that bring people in for the night shift.',
    audience: 'BPOs, contact centres and other large companies that work in shifts.',
    pricing: null,
    modules: [
      { name: 'People records', detail: 'Every employee, their documents and their place in the organisation.', status: null },
      { name: 'Rosters', detail: 'Shift patterns, rotations and the master rota.', status: null },
      { name: 'Leave and attendance', detail: 'Applications, approvals and biometric clock-ins.', status: null },
      { name: 'Payroll', detail: 'Salaries, EPF and ETF, and statutory holidays.', status: null },
      { name: 'Staff transport', detail: 'Routes and manifests for the vans that bring shifts in.', status: null },
      { name: 'Organisation chart', detail: 'Restructure teams by dragging the lines between people.', status: null },
    ],
    milestones: [
      { what: 'First customer live', when: null },
      { what: 'On sale', when: null },
    ],
    demo: '/project/hris-command-center',
    shots: [
      { src: '/wall/tccos-command-lg.webp', alt: 'TCCOS command centre: the overview screen of the workforce system', width: 1600, height: 790 },
      { src: '/wall/tccos-rota-lg.webp', alt: 'TCCOS master rota: a week of shifts for each employee', width: 1600, height: 785 },
    ],
  },
];

export const productBySlug = (slug) => PRODUCTS.find((product) => product.slug === slug);

// Experiments: built to test an idea, finished enough to deploy for a business that wants one.
export const LAB = [
  {
    path: '/project/bakery-os',
    name: 'BakeryOS',
    line: 'A counter till for a bakery: shifts, sales, promotions and stock.',
    image: '/wall/bakery-notifications-lg.webp',
    alt: 'BakeryOS cashier portal: shift notifications',
  },
  {
    path: '/project/bespoke-salon',
    name: 'Bespoke Salon',
    line: 'Bookings, client records, treatments and retail stock for a hair salon.',
    image: '/wall/salon-warehouse-lg.webp',
    alt: 'Bespoke Salon: the retail stock screen',
  },
];

// Pages that hold a working demo, with the name each should go by.
export const DEMO_PAGES = [
  ...LAB.map((item) => ({ path: item.path, name: item.name, line: item.line, kind: 'experiment' })),
  { path: '/project/hris-command-center', name: 'TCCOS', line: 'An early build of TCCOS, the people system for shift-based companies.', kind: 'early build' },
];

// The order in which the company's story has happened. null dates show as gaps.
export const TIMELINE = [
  { what: 'The Code Consortium founded', when: COMPANY.founded },
  { what: 'Spear Tea OS released', when: null },
  { what: 'Spear OS goes live with its first customer', when: null },
  { what: 'TCCOS in development', when: null },
  { what: 'Next', when: null, detail: null },
];
