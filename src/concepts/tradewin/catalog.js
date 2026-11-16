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

const product = (entry) => ({ ...entry, photo: entry.slug });

export const PRODUCTS = [
  product({
    slug: 'stretch-lids',
    sku: 'TW-K-1042',
    category: 'kitchen',
    name: 'Stretch lids',
    pack: 'Set of 5',
    alt: 'Five round bottle-green silicone lids in graduated sizes, overlapping in a fan',
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
    pack: '11 clips: 5 green, 6 coral',
    alt: 'Eleven plastic bag sealing clips in a row, alternating bottle green and coral',
    blurb: 'Eleven 11 cm clips that shut a bag of rice, coffee or frozen peas with one squeeze.',
    retail: 4.9,
    trade: [1.42, 1.26, 1.12],
    carton: 96,
    grams: 88,
    stock: 26400,
    sold: 5108,
    made: 'ABS plastic, steel spring',
    specs: [
      ['Length', '11 cm'],
      ['Grips', 'Bags up to 10 cm wide'],
      ['Freezer safe', 'Yes, to -20 °C'],
    ],
    reviews: [
      { name: 'Ingrid Solberg', place: 'Bergen', stars: 4, text: 'Strong spring. I would have liked two long ones for cereal bags.' },
      { name: 'Paul Emmerson', place: 'Leeds', stars: 5, text: 'Bought to reach free postage. Now the most used thing in the kitchen.' },
    ],
  }),
  product({
    slug: 'measuring-spoons',
    sku: 'TW-K-1113',
    category: 'kitchen',
    name: 'Measuring spoons',
    pack: 'Set of 4',
    alt: 'Four bottle-green measuring spoons with cream handles, fanned out',
    blurb: 'Four deep spoons, from a quarter teaspoon to a tablespoon, that nest into one.',
    retail: 8.4,
    trade: [2.95, 2.66, 2.38],
    carton: 60,
    grams: 96,
    stock: 9360,
    sold: 1844,
    made: 'Polypropylene, BPA free',
    specs: [
      ['Sizes', '1.25, 5, 7.5 and 15 ml'],
      ['Handle', '11 cm, hanging hole'],
      ['Wash', 'Dishwasher safe'],
    ],
    reviews: [
      { name: 'Aoife Brennan', place: 'Cork', stars: 5, text: 'Deep enough that vanilla does not spill on the way to the bowl.' },
      { name: 'Jonas Richter', place: 'Leipzig', stars: 4, text: 'Good. The sizes are moulded in, not printed, so they will not wash off.' },
    ],
  }),
  product({
    slug: 'cable-clips',
    sku: 'TW-D-2019',
    category: 'desk',
    name: 'Cable clips',
    pack: 'Pack of 6',
    alt: 'Six round coral silicone cable clips in two rows of three',
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
    alt: 'A flat bottle-green zipped fabric pouch with a coral zip pull',
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
    alt: 'A small bottle-green folding phone stand, opened',
    blurb: 'Folds to 9 cm, opens to any angle and holds a phone or a small tablet at eye height.',
    retail: 7.8,
    trade: [2.54, 2.27, 2.03],
    carton: 80,
    grams: 92,
    stock: 14720,
    sold: 2981,
    made: 'ABS plastic, silicone pads, steel hinges',
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
    alt: 'Four small silicone travel bottles with flip caps, two green and two coral',
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
    alt: 'Three bottle-green zipped packing cubes in three sizes, side by side',
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
    alt: 'Two silicone luggage tags with loops, one coral and one bottle green',
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
    alt: 'A small round cream night light with a bottle-green rim',
    blurb: 'Lights the way to the bathroom when you walk past, then switches itself off after 20 seconds.',
    retail: 12.4,
    trade: [4.62, 4.15, 3.71],
    carton: 48,
    grams: 74,
    stock: 8256,
    sold: 2076,
    made: 'ABS plastic, CE and RoHS marked',
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
    alt: 'A bottle-green steel over-door rail with five hooks',
    blurb: 'Hangs over any door up to 4.5 cm thick with no screws, and carries 20 kg of coats.',
    retail: 10.8,
    trade: [4.05, 3.63, 3.25],
    carton: 24,
    grams: 312,
    stock: 4104,
    sold: 918,
    made: 'Powder-coated steel, felt-backed',
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
    alt: 'A hand-held bottle-green fabric shaver with a round steel head',
    blurb: 'Takes the bobbles off a jumper in about two minutes. Three blades, one charge a month.',
    retail: 14.9,
    trade: [5.72, 5.13, 4.59],
    carton: 36,
    grams: 188,
    stock: 3852,
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

export function basketTotals(lines) {
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  const goods = lines.reduce((sum, line) => sum + productBySlug(line.slug).retail * line.qty, 0);
  const postage = count === 0 || goods >= FREE_POSTAGE_FROM ? 0 : POSTAGE;
  return { count, goods, postage, total: goods + postage };
}

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
