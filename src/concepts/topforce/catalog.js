// Mock catalogue for Topforce Sports. The company, its products, prices and test figures are invented.
// Everything that is sold by weight is priced from one rate per kilogram, the way the site says it is.

export const LB_PER_KG = 2.20462;

export const CATEGORIES = [
  { id: 'bars', name: 'Bars', line: 'One bar, in the two lengths the sport uses.' },
  { id: 'plates', name: 'Plates', line: 'Rubber you can drop and steel for the small jumps.' },
  { id: 'dumbbells', name: 'Dumbbells', line: 'Sixteen sizes, 2.5 kg apart.' },
  { id: 'kettlebells', name: 'Kettlebells', line: 'Poured in one piece. Nothing to work loose.' },
  { id: 'racks', name: 'Racks and benches', line: 'What the bar sits on between sets.' },
];

// Each product is sold in the sizes listed. `kg` is the weight of one piece; `per` says how many
// pieces a sale is (plates and dumbbells go in pairs). `rate` is dollars per kilogram; products
// without a rate carry a price on each size instead.
export const PRODUCTS = [
  {
    slug: 'olympic-bar',
    sku: 'TF-OB',
    category: 'bars',
    name: 'Olympic bar',
    photo: 'bar',
    alt: 'One end of a barbell lying diagonally: a black knurled shaft, a thin yellow-green ring and a bright steel sleeve',
    blurb: 'Black-zinc shaft, hard-chrome sleeves, five needle bearings a side.',
    per: 1,
    unit: 'bar',
    sizes: [
      { kg: 20, price: 189, sku: 'TF-OB-20', dims: '2,200 mm long, 28 mm shaft, 415 mm sleeves' },
      { kg: 15, price: 179, sku: 'TF-OB-15', dims: '2,010 mm long, 25 mm shaft, 320 mm sleeves' },
    ],
    start: 20,
    proof: {
      figure: '190,000',
      unit: 'PSI tensile strength',
      text: 'The shaft is drawn from 42CrMo alloy steel and tested to 190,000 PSI. Loaded to 680 kg for a minute, it comes back straight to within 0.5 mm over its length.',
    },
    story: [
      'The knurl is cut 1.2 mm deep in a volcano pattern: it holds without chalk and does not open your hands on a high-rep day. Two sets of ring marks, for weightlifting and powerlifting grips.',
      'Each sleeve turns on five needle bearings. Spin one by hand, unloaded, and it runs for eleven seconds or more before we box the bar.',
    ],
    specs: [
      ['Steel', '42CrMo alloy, 190,000 PSI'],
      ['Static rating', '680 kg'],
      ['Knurl', '1.2 mm volcano, no centre knurl on the 15 kg'],
      ['Sleeves', 'Hard chrome, 50 mm, 5 needle bearings a side'],
      ['Shaft finish', 'Black zinc'],
      ['Weight tolerance', '±0.5%'],
      ['Warranty', '10 years against bending'],
    ],
    reviews: [
      {
        who: 'Marit Solheim',
        where: 'Trondheim, Norway',
        score: 5,
        text: 'Replaced a ten-year-old bar from a big-name brand. The spin is better and the knurl is less aggressive, which my hands appreciate at 6 am.',
      },
      {
        who: 'Deshawn Whitfield',
        where: 'Columbus, Ohio',
        score: 4,
        text: 'Good bar for the money. The black zinc on the shaft has started to polish where I grip it after four months. Does not affect anything, but it will not stay black.',
      },
      {
        who: 'Tomás Riera',
        where: 'Valencia, Spain',
        score: 5,
        text: 'Straight, true, and the sleeves are a proper 50 mm so my old plates fit without rattling.',
      },
    ],
  },
  {
    slug: 'bumper-plates',
    sku: 'TF-BP',
    category: 'plates',
    name: 'Bumper plates',
    photo: 'bumpers',
    alt: 'Two matte black rubber bumper plates standing together, each with a yellow-green ring near the rim and a steel centre',
    blurb: 'Virgin rubber over a steel insert. All five weights are 450 mm across.',
    per: 2,
    unit: 'pair',
    rate: 3.18,
    sizes: [
      { kg: 5, dims: '450 mm across, 22 mm thick' },
      { kg: 10, dims: '450 mm across, 32 mm thick' },
      { kg: 15, dims: '450 mm across, 42 mm thick' },
      { kg: 20, dims: '450 mm across, 54 mm thick' },
      { kg: 25, dims: '450 mm across, 65 mm thick' },
    ],
    start: 20,
    proof: {
      figure: '30,000',
      unit: 'drops from 2.3 m',
      text: 'One plate from every batch goes on the drop rig, loaded to 140 kg, and is dropped 30,000 times. Then we measure the steel insert. If it has moved more than 0.3 mm, the batch is scrapped.',
    },
    story: [
      'The rubber is 88 on the Shore A scale: hard enough for a low, dead bounce, soft enough to spare your floor. No recycled crumb, so no tyre smell in the garage.',
      'Every plate is weighed after moulding. A 25 kg plate that leaves us weighs between 24.75 and 25.25 kg.',
    ],
    specs: [
      ['Diameter', '450 mm, all weights'],
      ['Insert', 'Steel, 50.4 mm, hooked into the rubber'],
      ['Rubber', 'Virgin, Shore 88A'],
      ['Weight tolerance', '±1%'],
      ['Drop test', '30,000 drops from 2.3 m'],
      ['Sold as', 'Pairs'],
      ['Warranty', '3 years, 1 year on the 5 kg'],
    ],
    reviews: [
      {
        who: 'Callum Ferreira',
        where: 'Leeds, UK',
        score: 5,
        text: 'Weighed all eight on a parcel scale out of curiosity. The worst was 60 g out.',
      },
      {
        who: 'Jolene Abernathy',
        where: 'Boise, Idaho',
        score: 3,
        text: 'Plates are great. Two of the four boxes arrived split open because 25 kg in single-wall card is optimistic. Nothing damaged, and they sent a credit when I sent photos, but pack them better.',
      },
      {
        who: 'Pieter van Daalen',
        where: 'Utrecht, Netherlands',
        score: 4,
        text: 'No smell, which after my last set was the main thing. The 5s are thin and I would not drop them alone.',
      },
      {
        who: 'Renée Okafor',
        where: 'Lyon, France',
        score: 5,
        text: 'Second order. Bought 100 kg in March and another 60 in September.',
      },
    ],
  },
  {
    slug: 'change-plates',
    sku: 'TF-CP',
    category: 'plates',
    name: 'Steel change plates',
    photo: 'change-plates',
    alt: 'Three bright machined steel weight plates of different sizes, fanned out and overlapping, each with a yellow-green ring',
    blurb: 'Machined steel for the last few kilos. Fits any 50 mm sleeve.',
    per: 2,
    unit: 'pair',
    rate: 4.72,
    sizes: [
      { kg: 1.25, dims: '165 mm across, 15 mm thick' },
      { kg: 2.5, dims: '210 mm across, 20 mm thick' },
      { kg: 5, dims: '260 mm across, 24 mm thick' },
    ],
    start: 2.5,
    proof: {
      figure: '±0.5%',
      unit: 'of the stated weight',
      text: 'Change plates exist to add a small, exact amount. Each is machined from plate steel, weighed, and corrected with a pressed plug if it is more than half a per cent out.',
    },
    story: [
      'The bore is 50.4 mm and reamed, not punched, so the plate slides on without tipping and does not rattle against a bumper.',
    ],
    specs: [
      ['Material', 'Q235 plate steel, machined'],
      ['Bore', '50.4 mm, reamed'],
      ['Finish', 'Bright machined steel, clear-coated'],
      ['Weight tolerance', '±0.5%'],
      ['Sold as', 'Pairs'],
      ['Warranty', '5 years'],
    ],
    reviews: [
      {
        who: 'Agnieszka Wrona',
        where: 'Gdańsk, Poland',
        score: 5,
        text: 'They do what they say. Snug on the sleeve.',
      },
      {
        who: 'Brandon Ellery',
        where: 'Tucson, Arizona',
        score: 4,
        text: 'The bright finish scratches easily, and after a month they look ten years old. Accurate though: the 2.5s were 2.498 and 2.503 on my kitchen scale.',
      },
    ],
  },
  {
    slug: 'hex-dumbbells',
    sku: 'TF-HD',
    category: 'dumbbells',
    name: 'Hex dumbbells',
    photo: 'dumbbells',
    alt: 'A pair of black rubber hex dumbbells with chrome knurled handles and yellow-green rings, one resting across the other',
    blurb: 'Rubber heads pressed and pinned to a chrome handle. They do not roll.',
    per: 2,
    unit: 'pair',
    rate: 2.94,
    sizes: [2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 27.5, 30, 32.5, 35, 37.5, 40].map((kg) => ({
      kg,
      dims: `${Math.round(190 + kg * 4.6)} mm long, ${kg <= 5 ? 28 : 34} mm handle`,
    })),
    start: 20,
    proof: {
      figure: '12 t',
      unit: 'to pull a head off',
      text: 'The heads are pressed onto the handle and cross-pinned, not just glued. On the pull rig a 20 kg dumbbell holds past 12 tonnes before the handle itself gives way.',
    },
    story: [
      'The handle is one solid bar of chromed steel, 34 mm across from 7.5 kg up and 28 mm below, with a medium diamond knurl and a slight swell in the middle.',
      'Heads are low-odour rubber over cast iron. Six flat sides, so a dumbbell stays where you put it.',
    ],
    specs: [
      ['Handle', 'Solid chromed steel, 34 mm (28 mm to 5 kg)'],
      ['Heads', 'Cast iron in rubber, pressed and pinned'],
      ['Range', '2.5 to 40 kg in 2.5 kg steps'],
      ['Weight tolerance', '±2%'],
      ['Sold as', 'Pairs'],
      ['Warranty', '3 years'],
    ],
    reviews: [
      {
        who: 'Ines Carvalho',
        where: 'Porto, Portugal',
        score: 5,
        text: 'Bought 5 to 20 in pairs for a small studio. Twelve classes a week since February and nothing has come loose.',
      },
      {
        who: 'Garrett Lindqvist',
        where: 'Duluth, Minnesota',
        score: 4,
        text: 'There is a smell for the first week, less than others I have owned but it is there. Leave them in the garage with the door open.',
      },
      {
        who: 'Hannah Brückner',
        where: 'Leipzig, Germany',
        score: 2,
        text: 'One of my 12.5s had a flat spot of rubber missing on a corner. Replacement took three weeks to arrive, which is too long.',
      },
    ],
  },
  {
    slug: 'kettlebell',
    sku: 'TF-KB',
    category: 'kettlebells',
    name: 'Cast kettlebell',
    photo: 'kettlebell',
    alt: 'A matte black cast-iron kettlebell with a yellow-green band round each foot of its handle',
    blurb: 'One pour of iron, a machined flat base, and a handle you can chalk.',
    per: 1,
    unit: 'each',
    rate: 3.36,
    sizes: [4, 6, 8, 10, 12, 16, 20, 24, 28, 32].map((kg) => ({
      kg,
      dims: `${Math.round(150 + kg * 3.1)} mm tall, ${kg <= 8 ? 30 : kg <= 16 ? 33 : 36} mm handle`,
    })),
    start: 16,
    proof: {
      figure: '1 pour',
      unit: 'no weld, no plug',
      text: 'Body and handle are cast together in a single pour, so there is no seam under your palm and no filler plug to fall out. The base is machined flat to within 0.2 mm.',
    },
    story: [
      'The coat is a thin matte powder, not gloss enamel: it takes chalk and does not turn slick with sweat. The window is wide enough for two hands from 12 kg up.',
    ],
    specs: [
      ['Casting', 'Grey iron, single pour'],
      ['Base', 'Machined flat, ±0.2 mm'],
      ['Handle', '30, 33 or 36 mm by weight'],
      ['Finish', 'Matte powder coat'],
      ['Weight tolerance', '±2%'],
      ['Warranty', 'Lifetime on the casting'],
    ],
    reviews: [
      {
        who: 'Siobhán Keane',
        where: 'Cork, Ireland',
        score: 5,
        text: 'The handle finish is exactly right. Sits flat for renegade rows, which my last one did not.',
      },
      {
        who: 'Luca Moretti',
        where: 'Bologna, Italy',
        score: 4,
        text: 'A small casting line inside the handle window on the 24. Ten seconds with a file sorted it, but I should not have to.',
      },
    ],
  },
  {
    slug: 'half-rack',
    sku: 'TF-HR2',
    category: 'racks',
    name: 'HR-2 half rack',
    photo: 'rack',
    alt: 'A black steel rack with four uprights, two yellow-green bar hooks, a pull-up bar across the top and two safety arms',
    blurb: 'Four 75 mm uprights, safety arms and a pull-up bar, in 1.25 by 1.42 m of floor.',
    per: 1,
    unit: 'rack',
    sizes: [{ kg: 96, price: 649, sku: 'TF-HR2', dims: '2,260 mm tall, 1,250 mm wide, 1,420 mm deep' }],
    start: 96,
    proof: {
      figure: '450 kg',
      unit: 'on the hooks, tested at 900',
      text: 'The uprights are 75 by 75 mm box section with 3 mm walls. Every rack design is loaded to twice its rating on the J-hooks and again on the safety arms before it goes on sale.',
    },
    story: [
      'Holes are laser-cut every 25 mm through the bench zone and every 50 mm above it, and numbered, so both hooks go back at the same height.',
      'It bolts to the floor or stands free on its own feet. Ceiling under 2.3 m? The short version is 2,060 mm; ask before ordering.',
    ],
    specs: [
      ['Uprights', '75 × 75 mm, 3 mm wall'],
      ['Rating', '450 kg on hooks and safety arms'],
      ['Hole spacing', '25 mm in the bench zone, 50 mm above'],
      ['Footprint', '1,250 × 1,420 mm'],
      ['Height', '2,260 mm'],
      ['Included', 'J-hooks, safety arms, pull-up bar, fixings'],
      ['Ships as', '3 boxes, 96 kg'],
      ['Warranty', '10 years on the frame'],
    ],
    reviews: [
      {
        who: 'Oskar Nyberg',
        where: 'Uppsala, Sweden',
        score: 5,
        text: 'Two hours to build with a friend. Does not move when I re-rack 180.',
      },
      {
        who: 'Latoya Simmons',
        where: 'Raleigh, North Carolina',
        score: 4,
        text: 'Solid rack. Instructions are pictures only and step 6 is ambiguous about which way the cross-member faces. Check before you tighten everything.',
      },
    ],
  },
  {
    slug: 'bench',
    sku: 'TF-FB1',
    category: 'racks',
    name: 'FB-1 adjustable bench',
    photo: 'bench',
    alt: 'A black adjustable weight bench seen from the side with its back pad raised and a fine line of yellow-green stitching along the pads',
    blurb: 'Seven back angles from flat to 85°, a 50 mm pad, and wheels at one end.',
    per: 1,
    unit: 'bench',
    sizes: [{ kg: 38, price: 279, sku: 'TF-FB1', dims: '1,380 mm long, 440 mm high when flat, 300 mm pad' }],
    start: 38,
    proof: {
      figure: '450 kg',
      unit: 'rated, lifter and bar together',
      text: 'The frame is 50 by 75 mm steel on a three-point base, so it does not rock on an uneven garage floor. The gap between seat and back is 38 mm when flat.',
    },
    story: ['The back sets to seven angles on a ladder, not a pop-pin, so it changes with one hand and cannot slip a notch under load.'],
    specs: [
      ['Back angles', '7, from 0 to 85°'],
      ['Seat angles', '3'],
      ['Rating', '450 kg'],
      ['Pad', '50 mm closed-cell foam, grippy vinyl'],
      ['Height when flat', '440 mm'],
      ['Weight', '38 kg, with wheels and a handle'],
      ['Warranty', '5 years on the frame, 1 on the pads'],
    ],
    reviews: [
      {
        who: 'Mirela Dragomir',
        where: 'Cluj-Napoca, Romania',
        score: 5,
        text: 'Heavy, in a good way. The ladder adjustment is quicker than the pin on my gym’s benches.',
      },
      {
        who: 'Eamon Barlow',
        where: 'Bristol, UK',
        score: 3,
        text: 'At 440 mm it is a touch high for me at 168 cm; my feet are not quite flat when I arch. Fine on a pair of 5 kg plates.',
      },
    ],
  },
  {
    slug: 'collars',
    sku: 'TF-LC',
    category: 'bars',
    name: 'Lock collars',
    photo: 'collars',
    alt: 'A pair of yellow-green aluminium barbell collars with black locking levers',
    blurb: 'Aluminium, one lever, and a rubber liner that does not chew the sleeve.',
    per: 2,
    unit: 'pair',
    sizes: [{ kg: 0.21, price: 24.9, sku: 'TF-LC-50', dims: 'For 50 mm sleeves, 38 mm wide' }],
    start: 0.21,
    proof: {
      figure: '90 kg',
      unit: 'of side load before it slips',
      text: 'Clamped on a chrome sleeve and pushed sideways on the test rig, a collar holds 90 kg before it moves. That is more than a tilted bar puts on it.',
    },
    story: ['They go on and come off with one hand. The lever closes over centre, so it cannot shake open during a set.'],
    specs: [
      ['Body', '6061 aluminium, anodised'],
      ['Fits', '50 mm Olympic sleeves'],
      ['Holding force', '90 kg side load'],
      ['Weight', '210 g each'],
      ['Sold as', 'Pairs'],
      ['Warranty', '2 years'],
    ],
    reviews: [
      {
        who: 'Nadia Haddad',
        where: 'Marseille, France',
        score: 5,
        text: 'So much better than springs.',
      },
      {
        who: 'Curtis Yoon',
        where: 'Sacramento, California',
        score: 4,
        text: 'Tight on my older bar, whose sleeves must be slightly over 50. Loosened up after a week.',
      },
    ],
  },
];

export const productBySlug = (slug) => PRODUCTS.find((product) => product.slug === slug);
export const productsIn = (category) => PRODUCTS.filter((product) => product.category === category);
export const sizeOf = (product, kg) => product.sizes.find((size) => size.kg === Number(kg)) ?? null;

const cents = (value) => Math.round(value * 100) / 100;

// What one sale of a size costs and weighs: a pair of 20 kg dumbbells is 40 kg.
export const saleKg = (product, kg) => kg * product.per;
export const salePrice = (product, kg) => (product.rate ? cents(product.rate * saleKg(product, kg)) : sizeOf(product, kg).price);
export const fromPrice = (product) => Math.min(...product.sizes.map((size) => salePrice(product, size.kg)));

export const formatPrice = (value) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const formatKg = (kg) => `${Number(kg.toFixed(2)).toLocaleString('en-US')}`;
export const toLb = (kg) => Math.round(kg * LB_PER_KG);

// "2 × 20 kg" for a pair, "20 kg" for one piece.
export const sizeLabel = (product, kg) => (product.per > 1 ? `${product.per} × ${formatKg(kg)} kg` : `${formatKg(kg)} kg`);

/* ---------- The loader ---------- */

// The plates the loader offers, heaviest first. `thick` and `dia` are millimetres and are what
// the barbell is drawn from. One tap loads one plate on each end, which is one pair in the cart.
export const LOADER_PLATES = [
  { kg: 25, thick: 65, dia: 450, slug: 'bumper-plates' },
  { kg: 20, thick: 54, dia: 450, slug: 'bumper-plates' },
  { kg: 15, thick: 42, dia: 450, slug: 'bumper-plates' },
  { kg: 10, thick: 32, dia: 450, slug: 'bumper-plates' },
  { kg: 5, thick: 22, dia: 450, slug: 'bumper-plates' },
  { kg: 2.5, thick: 20, dia: 210, slug: 'change-plates' },
  { kg: 1.25, thick: 15, dia: 165, slug: 'change-plates' },
];

export const loaderPlate = (kg) => LOADER_PLATES.find((plate) => plate.kg === kg);

// Both bars, in millimetres. `sleeve` is the length a plate can sit on.
export const BARS = {
  20: { kg: 20, length: 2200, shaft: 28, sleeve: 415, name: '20 kg bar' },
  15: { kg: 15, length: 2010, shaft: 25, sleeve: 320, name: '15 kg bar' },
};

export const COLLAR_WIDTH = 38;
export const DEFAULT_LOAD = { bar: 20, side: [25, 20, 15] };

export const sideThickness = (side) => side.reduce((sum, kg) => sum + loaderPlate(kg).thick, 0);
export const roomOnSleeve = (bar, side) => BARS[bar].sleeve - COLLAR_WIDTH - sideThickness(side);
export const fits = (bar, side, kg) => loaderPlate(kg).thick <= roomOnSleeve(bar, side);
export const loadKg = (bar, side) => BARS[bar].kg + 2 * side.reduce((sum, kg) => sum + kg, 0);

// Heaviest plates sit nearest the middle, as they would be loaded.
export const sortSide = (side) => [...side].sort((a, b) => b - a);

// The plates for one end that bring the bar to a target weight, or as near under it as the
// plates allow. Greedy from the heaviest, stopping when the sleeve is full.
export function sideForTarget(bar, target) {
  let left = (target - BARS[bar].kg) / 2;
  const side = [];
  for (const plate of LOADER_PLATES) {
    while (left >= plate.kg - 1e-9 && fits(bar, side, plate.kg)) {
      side.push(plate.kg);
      left -= plate.kg;
    }
  }
  return side;
}

// The cart lines for a loaded bar: the bar itself, one pair of plates per plate on a side, and collars.
export function linesForLoad(bar, side, { collars = true } = {}) {
  const pairs = new Map();
  side.forEach((kg) => pairs.set(kg, (pairs.get(kg) ?? 0) + 1));
  return [
    { slug: 'olympic-bar', kg: bar, qty: 1 },
    ...[...pairs].map(([kg, qty]) => ({ slug: loaderPlate(kg).slug, kg, qty })),
    ...(collars ? [{ slug: 'collars', kg: 0.21, qty: 1 }] : []),
  ];
}

/* ---------- The cart ---------- */

export const MAX_QTY = 12;
export const lineKey = (line) => `${line.slug}:${line.kg}`;
export const validLine = (line) =>
  Boolean(line) && Boolean(productBySlug(line.slug)) && Boolean(sizeOf(productBySlug(line.slug), line.kg)) && Number.isInteger(line.qty) && line.qty > 0;
export const linePrice = (line) => salePrice(productBySlug(line.slug), line.kg) * line.qty;
export const lineKg = (line) => saleKg(productBySlug(line.slug), line.kg) * line.qty;

// A bar with 100 kg of plates or more is a set, and the plates in a set cost 8% less.
export const SET_FROM_KG = 100;
export const SET_DISCOUNT = 0.08;

// Freight is charged by weight. Over the free-freight line it is on us.
export const FREIGHT_PER_KG = 0.46;
export const FREIGHT_MIN = 9.5;
export const FREE_FREIGHT_FROM = 450;
export const PALLET_FROM_KG = 70;

export function totals(lines) {
  const subtotal = cents(lines.reduce((sum, line) => sum + linePrice(line), 0));
  const kg = lines.reduce((sum, line) => sum + lineKg(line), 0);
  const plateLines = lines.filter((line) => productBySlug(line.slug).category === 'plates');
  const plateKg = plateLines.reduce((sum, line) => sum + lineKg(line), 0);
  const hasBar = lines.some((line) => line.slug === 'olympic-bar');
  const isSet = hasBar && plateKg >= SET_FROM_KG;
  const discount = isSet ? cents(plateLines.reduce((sum, line) => sum + linePrice(line), 0) * SET_DISCOUNT) : 0;
  const goods = cents(subtotal - discount);
  const freight = lines.length === 0 || goods >= FREE_FREIGHT_FROM ? 0 : cents(Math.max(FREIGHT_MIN, kg * FREIGHT_PER_KG));
  return {
    subtotal,
    kg,
    plateKg,
    hasBar,
    isSet,
    discount,
    freight,
    total: cents(goods + freight),
    pallet: kg >= PALLET_FROM_KG,
    count: lines.reduce((sum, line) => sum + line.qty, 0),
  };
}

export const shipsAs = (pallet) =>
  pallet ? 'On a pallet to the kerb, 5 to 8 working days' : 'By parcel, 3 to 5 working days';
