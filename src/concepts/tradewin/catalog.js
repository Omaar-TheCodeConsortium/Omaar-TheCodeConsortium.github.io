// One catalogue for both front doors. Tradewin Direct sells each product singly at `retail`;
// Tradewin Wholesale sells the same product by the carton at the tier prices in `trade`.

export const CATEGORIES = [
  { id: 'kitchen', name: 'Kitchen', line: 'Things that end up in the drawer you open most.' },
  { id: 'desk', name: 'Desk', line: 'For the cables, mostly.' },
  { id: 'travel', name: 'Travel', line: 'Small enough to forget you packed them.' },
  { id: 'home', name: 'Home', line: 'Fixes for doors, jumpers and dark hallways.' },
];

// Carton tiers are the same for every product: the price steps down at 5 and at 25 cartons.
export const TIER_FROM = [1, 5, 25];
export const MAX_QTY = 20;
export const MAX_CARTONS = 60;

// Direct postage.
export const POSTAGE = 3.9;
export const FREE_POSTAGE_FROM = 35;
export const DELIVERY_DAYS = [7, 12];

// Buying two or three of one thing takes a share off each of them.
export const MULTI = [
  { qty: 2, off: 0.1 },
  { qty: 3, off: 0.15 },
];

// A line is running low when the warehouse holds less than this many days of sales.
export const LOW_DAYS = 14;

// Average rating and how many buyers gave one. The two reviews printed on a product page are a sample.
const RATED = {
  'stretch-lids': [4.6, 2318],
  'bag-clips': [4.7, 3104],
  'measuring-spoons': [4.8, 1022],
  'cable-clips': [4.5, 3876],
  'tech-pouch': [4.7, 811],
  'phone-stand': [4.6, 1740],
  'travel-bottles': [4.4, 1493],
  'packing-cubes': [4.8, 702],
  'luggage-tags': [4.5, 1911],
  'night-light': [4.7, 1288],
  'door-hooks': [4.3, 544],
  'fabric-shaver': [4.6, 867],
};

// A pale ground for each product, picked to set off its own colours.
const TINT = {
  'stretch-lids': '#d3e9fb',
  'bag-clips': '#ffeaa8',
  'measuring-spoons': '#dde6ec',
  'cable-clips': '#cdf0e7',
  'tech-pouch': '#d9e3f6',
  'phone-stand': '#ffe2cf',
  'travel-bottles': '#ffdbe2',
  'packing-cubes': '#ffdfc6',
  'luggage-tags': '#d6f0db',
  'night-light': '#ffe8c6',
  'door-hooks': '#ece4d6',
  'fabric-shaver': '#ffdacd',
};

// What the in-use photographs show, for the products that have one.
const USE_ALT = {
  'stretch-lids': 'The coloured lids stretched over a glass salad bowl, two ceramic bowls, a steel mixing bowl and a jar on a kitchen worktop',
  'cable-clips': 'The coloured cable clips stuck along the edge of a desk, holding charging cables beside a laptop',
  'bag-clips': 'The coloured clips sealing open bags of coffee, pasta and crisps on a pantry shelf',
  'night-light': 'The dome night light glowing on a bedside table in a dark bedroom',
  'packing-cubes': 'The three blue packing cubes filled with folded clothes in an open suitcase',
  'travel-bottles': 'The four coloured travel bottles in a clear wash bag on a bathroom shelf',
};

// `photo` is the studio picture; `use` is the same product in someone's home, where one has been shot.
const product = (entry) => ({
  ...entry,
  photo: entry.slug,
  use: `${entry.slug}-use`,
  useAlt: USE_ALT[entry.slug] ?? '',
  tint: TINT[entry.slug],
  rating: RATED[entry.slug][0],
  ratings: RATED[entry.slug][1],
});

export const PRODUCTS = [
  product({
    slug: 'stretch-lids',
    sku: 'TW-K-1042',
    category: 'kitchen',
    name: 'Stretch lids',
    pack: 'Set of 5',
    alt: 'Five round silicone lids in graduated sizes, in sky blue, yellow, coral, mint and orange, overlapping in a fan',
    blurb: 'Five silicone lids that stretch over bowls, tins and half a melon, from 9 to 21 cm.',
    retail: 6.9,
    trade: [2.38, 2.12, 1.89],
    carton: 48,
    grams: 142,
    stock: 18240,
    sold: 3912,
    made: 'Food-grade silicone, LFGB tested',
    specs: [
      ['Sizes', '9, 11.5, 14.5, 17 and 21 cm'],
      ['Stretches to fit', 'Rims up to 26 cm'],
      ['Safe from', '-40 °C to 230 °C'],
      ['Wash', 'Dishwasher, top rack'],
    ],
    reviews: [
      { name: 'Marta Kowalczyk', place: 'Gdańsk', stars: 5, text: 'The big one fits my salad bowl, which nothing else ever has.' },
      { name: 'Dean Whitlock', place: 'Bristol', stars: 3, text: 'Fine on glass and steel. On a wet plastic tub the smallest one slides off.' },
    ],
  }),
  product({
    slug: 'bag-clips',
    sku: 'TW-K-1077',
    category: 'kitchen',
    name: 'Bag clips',
    pack: 'Mixed pack, six colours',
    alt: 'A fan of plastic bag sealing clips in red, pink, green, yellow, blue and orange, in three lengths',
    blurb: 'Clips in three lengths that shut a bag of rice, coffee or frozen peas with one squeeze.',
    retail: 4.9,
    trade: [1.42, 1.26, 1.12],
    carton: 96,
    grams: 88,
    stock: 26400,
    sold: 5108,
    made: 'ABS plastic, steel spring',
    specs: [
      ['Lengths', '11, 15 and 19 cm'],
      ['Grips', 'Bags up to 10 cm wide'],
      ['Freezer safe', 'Yes, to -20 °C'],
    ],
    reviews: [
      { name: 'Ingrid Solberg', place: 'Bergen', stars: 4, text: 'Strong spring. The short ones are no use on a cereal bag, the long ones are perfect.' },
      { name: 'Paul Emmerson', place: 'Leeds', stars: 5, text: 'Bought to reach free postage. Now the most used thing in the kitchen.' },
    ],
  }),
  product({
    slug: 'measuring-spoons',
    sku: 'TW-K-1113',
    category: 'kitchen',
    name: 'Measuring spoons',
    pack: 'Set of 3',
    alt: 'Three polished stainless steel measuring spoons on a ring, fanned out',
    blurb: 'Three deep steel spoons on a ring: a teaspoon, a half tablespoon and a tablespoon.',
    retail: 8.4,
    trade: [2.95, 2.66, 2.38],
    carton: 60,
    grams: 96,
    stock: 9360,
    sold: 1844,
    made: 'Stainless steel, grade 304',
    specs: [
      ['Sizes', '5, 7.5 and 15 ml'],
      ['Handle', '11 cm, on a split ring'],
      ['Wash', 'Dishwasher safe'],
    ],
    reviews: [
      { name: 'Aoife Brennan', place: 'Cork', stars: 5, text: 'Deep enough that vanilla does not spill on the way to the bowl.' },
      { name: 'Jonas Richter', place: 'Leipzig', stars: 4, text: 'Good. The sizes are stamped in, not printed, so they will not wash off.' },
    ],
  }),
  product({
    slug: 'cable-clips',
    sku: 'TW-D-2019',
    category: 'desk',
    name: 'Cable clips',
    pack: 'Pack of 6',
    alt: 'Six silicone cable clips in a row, in yellow, teal, coral, navy, orange and grey, with a black cable running through them',
    blurb: 'Six stick-on clips that hold a charging cable at the edge of the desk, not under it.',
    retail: 5.6,
    trade: [1.48, 1.31, 1.17],
    carton: 120,
    grams: 34,
    stock: 31200,
    sold: 6230,
    made: 'Silicone, acrylic adhesive pad',
    specs: [
      ['Holds', 'Cables 3 to 6 mm thick'],
      ['Sticks to', 'Wood, glass, metal, painted walls'],
      ['Comes off', 'Clean, with a hairdryer'],
    ],
    reviews: [
      { name: 'Sanne de Wit', place: 'Utrecht', stars: 5, text: 'One on the bedside table, one in the car. My cable has stopped vanishing.' },
      { name: 'Trevor Ashby', place: 'Tulsa', stars: 2, text: 'Would not stay on my oiled oak desk. Fine on the monitor stand.' },
    ],
  }),
  product({
    slug: 'tech-pouch',
    sku: 'TW-D-2054',
    category: 'desk',
    name: 'Cable pouch',
    pack: 'One pouch',
    alt: 'A mustard-yellow zipped pouch lying open, with a white cable, a black charger and earbuds held in its elastic loops',
    blurb: 'A 22 cm zipped pouch with five elastic loops, for the chargers that live in your bag.',
    retail: 11.9,
    trade: [4.36, 3.92, 3.51],
    carton: 40,
    grams: 118,
    stock: 6880,
    sold: 1267,
    made: 'Recycled polyester, YKK zip',
    specs: [
      ['Size', '22 × 14 × 4 cm'],
      ['Inside', '5 elastic loops, 1 mesh pocket'],
      ['Wipes clean', 'Yes'],
    ],
    reviews: [
      { name: 'Camille Laurent', place: 'Lyon', stars: 5, text: 'Holds a laptop charger, two cables and earphones, and still zips.' },
      { name: 'Rhys Morgan', place: 'Cardiff', stars: 4, text: 'Well made. A hand strap would make it perfect.' },
    ],
  }),
  product({
    slug: 'phone-stand',
    sku: 'TW-D-2088',
    category: 'desk',
    name: 'Folding phone stand',
    pack: 'One stand',
    alt: 'A sky-blue aluminium folding phone stand with black pads, opened',
    blurb: 'Folds to 9 cm, opens to any angle and holds a phone or a small tablet at eye height.',
    retail: 7.8,
    trade: [2.54, 2.27, 2.03],
    carton: 80,
    grams: 92,
    stock: 14720,
    sold: 2981,
    made: 'Anodised aluminium, silicone pads',
    specs: [
      ['Folded', '9 × 7 × 2 cm'],
      ['Holds', 'Devices 4 to 11 inches'],
      ['Angle', '0 to 100 degrees'],
    ],
    reviews: [
      { name: 'Helen Papadakis', place: 'Thessaloniki', stars: 4, text: 'Stiff hinge, which is what you want. Lives in my handbag.' },
      { name: 'Marcus Oyelaran', place: 'Manchester', stars: 5, text: 'Used daily for video calls for four months and nothing has loosened.' },
    ],
  }),
  product({
    slug: 'travel-bottles',
    sku: 'TW-T-3011',
    category: 'travel',
    name: 'Travel bottles',
    pack: 'Set of 4',
    alt: 'Four squeezable travel bottles with white flip caps, in pink, turquoise, green and orange, standing in a row',
    blurb: 'Four squeezable 89 ml bottles, under the cabin limit, with caps that do not leak.',
    retail: 9.2,
    trade: [3.12, 2.8, 2.49],
    carton: 60,
    grams: 126,
    stock: 11400,
    sold: 2455,
    made: 'Food-grade silicone, polypropylene cap',
    specs: [
      ['Holds', '89 ml (3 fl oz) each'],
      ['Cap', 'Three-layer flip cap, no-drip valve'],
      ['Opening', 'Wide, 3 cm, for refilling'],
    ],
    reviews: [
      { name: 'Olivia Hartmann', place: 'Munich', stars: 5, text: 'Six flights with conditioner in one and no leaks yet.' },
      { name: 'Gareth Pryce', place: 'Swansea', stars: 3, text: 'Thick shampoo is hard to get out of the last third.' },
    ],
  }),
  product({
    slug: 'packing-cubes',
    sku: 'TW-T-3046',
    category: 'travel',
    name: 'Packing cubes',
    pack: 'Set of 3',
    alt: 'Three cobalt-blue zipped packing cubes with mesh tops and orange zip pulls, stacked from large to small',
    blurb: 'Three zipped cubes that turn a suitcase into drawers: shirts, underwear, everything else.',
    retail: 13.5,
    trade: [5.08, 4.55, 4.07],
    carton: 30,
    grams: 214,
    stock: 5130,
    sold: 1102,
    made: 'Ripstop nylon, mesh top',
    specs: [
      ['Sizes', '40 × 30, 30 × 28 and 28 × 20 cm, all 10 cm deep'],
      ['Wash', 'Machine, 30 °C'],
    ],
    reviews: [
      { name: 'Beatriz Almeida', place: 'Porto', stars: 5, text: 'The large one takes a week of T-shirts. Zips are smooth.' },
      { name: 'Colin Fairweather', place: 'Aberdeen', stars: 4, text: 'Thin fabric, but that is the point. No tears after three trips.' },
    ],
  }),
  product({
    slug: 'luggage-tags',
    sku: 'TW-T-3072',
    category: 'travel',
    name: 'Luggage tags',
    pack: 'Pair',
    alt: 'Two silicone luggage tags with steel loops, one red and one yellow',
    blurb: 'Two bright silicone tags with a covered address card and a loop that will not snap.',
    retail: 5.2,
    trade: [1.38, 1.22, 1.09],
    carton: 100,
    grams: 46,
    stock: 22800,
    sold: 3320,
    made: 'Silicone, steel cable loop',
    specs: [
      ['Size', '11 × 6.5 cm'],
      ['Loop', '16 cm braided steel, screw lock'],
      ['Card', 'Hidden behind a flap'],
    ],
    reviews: [
      { name: 'Niamh Gallagher', place: 'Galway', stars: 5, text: 'I can spot my black suitcase on the belt now.' },
      { name: 'Stefan Lindqvist', place: 'Malmö', stars: 4, text: 'The screw lock is fiddly with cold hands. It has not come undone.' },
    ],
  }),
  product({
    slug: 'night-light',
    sku: 'TW-H-4008',
    category: 'home',
    name: 'Motion night light',
    pack: 'One light',
    alt: 'A small dome-shaped night light glowing warm amber on a round beech base',
    blurb: 'Lights the way to the bathroom when you walk past, then switches itself off after 20 seconds.',
    retail: 12.4,
    trade: [4.62, 4.15, 3.71],
    carton: 48,
    grams: 74,
    stock: 8256,
    sold: 2076,
    made: 'Silicone dome, beech base, CE and RoHS marked',
    specs: [
      ['Senses movement at', 'Up to 3 m, 120 degrees'],
      ['Battery', '600 mAh, about 45 days a charge'],
      ['Charges by', 'USB-C, cable included'],
      ['Fixes with', 'Magnet and stick-on plate'],
    ],
    reviews: [
      { name: 'Yvonne Kessler', place: 'Graz', stars: 5, text: 'Warm light, not hospital white. I bought three more for the stairs.' },
      { name: 'Derek Malone', place: 'Dublin', stars: 3, text: 'The cat sets it off all night. That is not really its fault.' },
    ],
  }),
  product({
    slug: 'door-hooks',
    sku: 'TW-H-4035',
    category: 'home',
    name: 'Over-door hook rail',
    pack: 'One rail, 5 hooks',
    alt: 'A matte black steel over-door rail with five hooks tipped with beech balls',
    blurb: 'Hangs over any door up to 4.5 cm thick with no screws, and carries 20 kg of coats.',
    retail: 10.8,
    trade: [4.05, 3.63, 3.25],
    carton: 24,
    grams: 312,
    stock: 312,
    sold: 918,
    made: 'Powder-coated steel, beech tips, felt-backed',
    specs: [
      ['Width', '40 cm'],
      ['Fits doors', 'Up to 4.5 cm thick'],
      ['Carries', '20 kg in total, 4 kg a hook'],
    ],
    reviews: [
      { name: 'Hannah Whitcombe', place: 'Norwich', stars: 4, text: 'Solid. Check the gap above your door first: mine needed 2 mm.' },
      { name: 'Luis Ferreira', place: 'Braga', stars: 5, text: 'Five wet towels and it has not bent.' },
    ],
  }),
  product({
    slug: 'fabric-shaver',
    sku: 'TW-H-4061',
    category: 'home',
    name: 'Fabric shaver',
    pack: 'One shaver',
    alt: 'A hand-held white fabric shaver with an orange base, a round steel head and a clear lint cup',
    blurb: 'Takes the bobbles off a jumper in about two minutes. Three blades, one charge a month.',
    retail: 14.9,
    trade: [5.72, 5.13, 4.59],
    carton: 36,
    grams: 188,
    stock: 540,
    sold: 1391,
    made: 'ABS plastic, stainless steel blades, CE marked',
    specs: [
      ['Head', '5 cm, three blades'],
      ['Battery', '1,200 mAh, about 90 minutes'],
      ['Charges by', 'USB-C, cable included'],
      ['In the box', 'Cleaning brush, spare blade'],
    ],
    reviews: [
      { name: 'Margaret Doyle', place: 'Liverpool', stars: 5, text: 'Saved a wool coat I was about to give away.' },
      { name: 'Felix Baumann', place: 'Zürich', stars: 4, text: 'Works well. Empty the lint box often or it clogs.' },
    ],
  }),
];

export const productBySlug = (slug) => PRODUCTS.find((entry) => entry.slug === slug) ?? null;
export const productsIn = (category) => PRODUCTS.filter((entry) => entry.category === category);
export const categoryOf = (entry) => CATEGORIES.find((category) => category.id === entry.category);

export const formatPrice = (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const formatCount = (value) => value.toLocaleString('en-US');
export const percent = (value) => `${Math.round(value * 100)}%`;

// Trade pricing. The tier is set by how many cartons of one product are on the order.
export const tierIndex = (cartons) => TIER_FROM.reduce((found, from, index) => (cartons >= from ? index : found), 0);
export const tradePrice = (entry, cartons = 1) => entry.trade[tierIndex(cartons)];
export const tierLabel = (index) =>
  index === TIER_FROM.length - 1 ? `${TIER_FROM[index]} cartons or more` : `${TIER_FROM[index]} to ${TIER_FROM[index + 1] - 1} cartons`;

// What a reseller keeps on one unit sold at Tradewin Direct's own price, before their postage and fees.
export const margin = (entry, cartons = 1) => {
  const cost = tradePrice(entry, cartons);
  return { each: entry.retail - cost, share: (entry.retail - cost) / entry.retail };
};

export const cartonKg = (entry) => (entry.grams * entry.carton) / 1000 + 0.6;

// One line of a trade order.
export const tradeLine = (entry, cartons) => {
  const units = entry.carton * cartons;
  const each = tradePrice(entry, cartons);
  return { units, each, cost: units * each, resale: units * entry.retail, kg: cartonKg(entry) * cartons };
};

// Direct basket: lines are { slug, qty }.
export const validLine = (line) => Boolean(line) && Boolean(productBySlug(line.slug)) && Number.isInteger(line.qty) && line.qty > 0;

const round2 = (value) => Math.round(value * 100) / 100;

// The price of one when `qty` of the same thing are bought together.
export const unitPrice = (entry, qty = 1) => {
  const step = MULTI.reduce((found, offer) => (qty >= offer.qty ? offer : found), null);
  return step ? round2(entry.retail * (1 - step.off)) : entry.retail;
};
export const linePrice = (entry, qty) => round2(unitPrice(entry, qty) * qty);
export const lineSaving = (entry, qty) => round2(entry.retail * qty - linePrice(entry, qty));

// How long the stock in Yiwu lasts at the last 30 days' rate of sale.
export const daysOfStock = (entry) => Math.round(entry.stock / (entry.sold / 30));
export const isLow = (entry) => daysOfStock(entry) < LOW_DAYS;

// The three that sold most in the last 30 days.
const BEST = [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 3).map((entry) => entry.slug);
export const isBestSeller = (entry) => BEST.includes(entry.slug);

export function basketTotals(lines) {
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  const goods = round2(lines.reduce((sum, line) => sum + linePrice(productBySlug(line.slug), line.qty), 0));
  const saved = round2(lines.reduce((sum, line) => sum + lineSaving(productBySlug(line.slug), line.qty), 0));
  const postage = count === 0 || goods >= FREE_POSTAGE_FROM ? 0 : POSTAGE;
  return { count, goods, saved, postage, total: round2(goods + postage), toFree: round2(Math.max(0, FREE_POSTAGE_FROM - goods)) };
}

// Trade freight, charged by the kilo. Days are door to door.
export const FREIGHT = [
  { id: 'air', name: 'Air', days: [6, 9], perKg: 4.8 },
  { id: 'sea', name: 'Sea', days: [32, 38], perKg: 0.9 },
];

// Trade order: { slug: cartons }.
export function orderTotals(order) {
  const lines = Object.entries(order)
    .map(([slug, cartons]) => ({ entry: productBySlug(slug), cartons }))
    .filter((line) => line.entry && line.cartons > 0);
  const sums = lines.map((line) => tradeLine(line.entry, line.cartons));
  const add = (key) => sums.reduce((sum, line) => sum + line[key], 0);
  return { cartons: lines.reduce((sum, line) => sum + line.cartons, 0), units: add('units'), cost: add('cost'), resale: add('resale'), kg: add('kg') };
}

// The reseller the trade side is signed in as. Invented, like everything else here.
export const ACCOUNT = {
  company: 'Harbour & Pine Ltd',
  place: 'Leeds, United Kingdom',
  since: 'March 2025',
  month: { units: 2304, spend: 5376.4, kept: 10405.6, orders: 7 },
  orders: [
    { ref: 'TW-W-60418', placed: '11 November', cartons: 9, value: 1284.48, stage: 3, lane: 'Sea, to Felixstowe', due: '14 December' },
    { ref: 'TW-W-60377', placed: '3 November', cartons: 4, value: 611.2, stage: 2, lane: 'Air, to East Midlands', due: '19 November' },
    { ref: 'TW-W-60352', placed: '27 October', cartons: 12, value: 1902.72, stage: 4, lane: 'Sea, to Felixstowe', due: 'Delivered 14 November' },
  ],
  // What the reseller has left, in days of sales at their recent rate.
  shelf: [
    { slug: 'cable-clips', days: 6 },
    { slug: 'night-light', days: 9 },
    { slug: 'stretch-lids', days: 13 },
  ],
};

export const ORDER_STAGES = ['Packed in Yiwu', 'Left the warehouse', 'In transit', 'Delivered'];
