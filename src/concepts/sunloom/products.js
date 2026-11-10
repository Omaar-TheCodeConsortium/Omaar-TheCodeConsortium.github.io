// Mock catalogue for Sunloom International. The company, products, prices and reviews are invented.

// `on` is the text colour that reads on top of each dye.
export const DYES = [
  { id: 'indigo', name: 'Indigo', hex: '#23408F', on: '#F4EFE4' },
  { id: 'oat', name: 'Oat', hex: '#D9CDB8', on: '#2B2622' },
  { id: 'madder', name: 'Madder', hex: '#A4442E', on: '#FBF3E8' },
  { id: 'sage', name: 'Sage', hex: '#8C977A', on: '#1B1916' },
  { id: 'ochre', name: 'Ochre', hex: '#C4923A', on: '#1E1A16' },
  { id: 'lake', name: 'Lake', hex: '#6F8798', on: '#12100E' },
  { id: 'chalk', name: 'Chalk', hex: '#F1EDE4', on: '#2B2622' },
  { id: 'soot', name: 'Soot', hex: '#37322E', on: '#F1EDE4' },
];

export const dyeById = (id) => DYES.find((dye) => dye.id === id) ?? DYES[0];

const ALL_DYES = DYES.map((dye) => dye.id);

export const CATEGORIES = ['All', 'Bed', 'Table', 'Bath'];

export const PRODUCTS = [
  {
    slug: 'duvet-cover-set',
    name: 'Washed Linen Duvet Cover Set',
    short: 'Duvet cover set',
    category: 'Bed',
    photo: 'product-duvet',
    weight: 165,
    dyes: ALL_DYES,
    dye: 'indigo',
    sizes: [
      { id: 'twin', label: 'Twin · 173 × 218 cm', price: 169 },
      { id: 'queen', label: 'Full / Queen · 229 × 234 cm', price: 189 },
      { id: 'king', label: 'King · 274 × 234 cm', price: 219 },
    ],
    includes: 'One duvet cover and two pillowcases (one with Twin)',
    blurb: 'The set most people start with. Coconut-shell buttons at the foot, ties in all four corners so the duvet stays put.',
    wholesaleFrom: 40,
  },
  {
    slug: 'fitted-sheet',
    name: 'Washed Linen Fitted Sheet',
    short: 'Fitted sheet',
    category: 'Bed',
    photo: 'product-sheets',
    weight: 165,
    dyes: ALL_DYES,
    dye: 'oat',
    sizes: [
      { id: 'twin', label: 'Twin · 99 × 191 cm', price: 84 },
      { id: 'queen', label: 'Queen · 152 × 203 cm', price: 98 },
      { id: 'king', label: 'King · 193 × 203 cm', price: 114 },
    ],
    includes: 'One fitted sheet, for mattresses up to 38 cm deep',
    blurb: 'Elastic all the way round, not only at the corners, with a label on the short side so you can tell which way it goes.',
    wholesaleFrom: 40,
  },
  {
    slug: 'flat-sheet',
    name: 'Washed Linen Flat Sheet',
    short: 'Flat sheet',
    category: 'Bed',
    photo: 'product-sheets',
    weight: 165,
    dyes: ['oat', 'chalk', 'indigo', 'sage', 'lake'],
    dye: 'chalk',
    sizes: [
      { id: 'queen', label: 'Queen · 240 × 270 cm', price: 94 },
      { id: 'king', label: 'King · 275 × 270 cm', price: 108 },
    ],
    includes: 'One flat sheet with a 10 cm top hem',
    blurb: 'Generously cut so it tucks under a deep mattress. Doubles as a light summer cover.',
    wholesaleFrom: 40,
  },
  {
    slug: 'pillowcase-pair',
    name: 'Washed Linen Pillowcase Pair',
    short: 'Pillowcase pair',
    category: 'Bed',
    photo: 'product-pillowcases',
    weight: 165,
    dyes: ALL_DYES,
    dye: 'madder',
    sizes: [
      { id: 'standard', label: 'Standard · 50 × 75 cm', price: 48 },
      { id: 'king', label: 'King · 50 × 90 cm', price: 54 },
      { id: 'euro', label: 'Euro square · 65 × 65 cm', price: 52 },
    ],
    includes: 'Two pillowcases with an envelope closure',
    blurb: 'The cheapest way to find out whether you like sleeping on linen, and to try a colour before buying the bed’s worth.',
    wholesaleFrom: 60,
  },
  {
    slug: 'heavy-linen-throw',
    name: 'Heavy Linen Throw',
    short: 'Heavy throw',
    category: 'Bed',
    photo: 'product-throw',
    weight: 280,
    dyes: ['soot', 'oat', 'ochre', 'sage', 'madder'],
    dye: 'ochre',
    sizes: [{ id: 'one', label: 'One size · 140 × 220 cm', price: 126 }],
    includes: 'One throw with a hand-knotted fringe on the short ends',
    blurb: 'Woven at nearly twice the weight of our sheeting. It hangs properly over the end of a bed or the arm of a sofa.',
    wholesaleFrom: 30,
  },
  {
    slug: 'linen-tablecloth',
    name: 'Linen Tablecloth',
    short: 'Tablecloth',
    category: 'Table',
    photo: 'product-table',
    weight: 215,
    dyes: ['chalk', 'oat', 'sage', 'madder', 'lake'],
    dye: 'sage',
    sizes: [
      { id: 'six', label: 'Seats six · 150 × 250 cm', price: 112 },
      { id: 'ten', label: 'Seats ten · 150 × 320 cm', price: 138 },
    ],
    includes: 'One tablecloth with mitred corners',
    blurb: 'A mid-weight cloth that takes a spill and a hot wash. Looks better unironed, which is the point.',
    wholesaleFrom: 30,
  },
  {
    slug: 'linen-napkins',
    name: 'Linen Napkins, Set of Four',
    short: 'Napkins, set of four',
    category: 'Table',
    photo: 'product-table',
    weight: 215,
    dyes: ['chalk', 'oat', 'sage', 'madder', 'lake', 'ochre'],
    dye: 'lake',
    sizes: [{ id: 'four', label: 'Set of four · 45 × 45 cm', price: 38 }],
    includes: 'Four napkins, tied with a strip of offcut linen',
    blurb: 'Cut from the same cloth as the tablecloths, so the colours match exactly, lot for lot.',
    wholesaleFrom: 80,
  },
  {
    slug: 'waffle-bath-towel',
    name: 'Waffle Linen Bath Towel',
    short: 'Waffle bath towel',
    category: 'Bath',
    photo: 'product-towel',
    weight: 300,
    dyes: ['chalk', 'oat', 'soot', 'lake'],
    dye: 'soot',
    sizes: [
      { id: 'bath', label: 'Bath · 75 × 140 cm', price: 46 },
      { id: 'sheet', label: 'Bath sheet · 100 × 160 cm', price: 64 },
    ],
    includes: 'One towel with a hanging loop',
    blurb: 'Honeycomb weave in a linen and cotton blend. Dries you, then dries itself in about half the time of terry.',
    wholesaleFrom: 60,
  },
];

export const productBySlug = (slug) => PRODUCTS.find((product) => product.slug === slug) ?? null;
export const basePrice = (product) => Math.min(...product.sizes.map((size) => size.price));

// Reviews are uneven on purpose: different lengths, different scores, real complaints.
export const REVIEWS = {
  'duvet-cover-set': [
    { name: 'Maren K.', place: 'Hamburg', rating: 5, date: 'October 2026', dye: 'Indigo', text: 'Third set from them. The first is four years old and softer than when it arrived. The indigo did bleed slightly in the first wash, as the card in the box warned, so wash it alone.' },
    { name: 'Colm D.', place: 'Cork', rating: 4, date: 'September 2026', dye: 'Oat', text: 'Lovely weight. Knocked a star off because delivery took eleven days and the tracking sat on “label created” for five of them.' },
    { name: 'Priya S.', place: 'Leeds', rating: 3, date: 'August 2026', dye: 'Sage', text: 'The sage is greyer in real life than on my screen. Quality is fine, and they did offer an exchange, but I had already washed it.' },
    { name: 'Dana R.', place: 'Portland, Oregon', rating: 5, date: 'July 2026', dye: 'Madder', text: 'Corner ties. Finally.' },
    { name: 'Tobias W.', place: 'Utrecht', rating: 4, date: 'June 2026', dye: 'Soot', text: 'It creases, obviously, it is linen. If you want a crisp hotel bed this is not for you. The buttons feel like they will outlast the fabric.' },
    { name: 'Ines F.', place: 'Porto', rating: 5, date: 'May 2026', dye: 'Chalk', text: 'Bought for a rental flat because it survives hot washes. Six months and roughly forty washes in, no pilling.' },
  ],
  'fitted-sheet': [
    { name: 'Jonas E.', place: 'Malmö', rating: 5, date: 'October 2026', dye: 'Oat', text: 'Fits a 35 cm mattress with a topper, which almost nothing does.' },
    { name: 'Rachel O.', place: 'Bristol', rating: 4, date: 'August 2026', dye: 'Lake', text: 'Good sheet. Slightly rough for the first three washes, then it settles.' },
    { name: 'Aylin T.', place: 'Rotterdam', rating: 2, date: 'July 2026', dye: 'Chalk', text: 'A seam came open at one corner after two months. They replaced it without asking for the old one back, so two stars rather than one.' },
  ],
  'linen-tablecloth': [
    { name: 'Hélène B.', place: 'Lyon', rating: 5, date: 'September 2026', dye: 'Madder', text: 'Red wine, olive oil, candle wax. All out at 60 degrees.' },
    { name: 'Marcus L.', place: 'Chicago', rating: 4, date: 'June 2026', dye: 'Sage', text: 'Nice and heavy. Measure your table: the 250 was shorter on ours than I had pictured.' },
  ],
};

export const averageRating = (reviews) =>
  reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : null;

// Wholesale: percentage off the retail price by pieces per order.
export const WHOLESALE_TIERS = [
  { from: 40, off: 30, note: 'Mixed sizes and colours, from stock' },
  { from: 200, off: 38, note: 'Your woven label sewn in' },
  { from: 1000, off: 45, note: 'Custom dye lots and packaging' },
];

export const MILL_CHAPTERS = [
  { id: 'flax', pattern: 'stalks', title: 'Flax', place: 'Normandy, France', text: 'Our yarn is spun from flax grown on the Channel coast, where rain and sea air do the work irrigation does elsewhere. Flax needs no watering and almost no pesticide. We buy long-line fibre only, which is the part that makes smooth, strong yarn.', figure: '0', unit: 'litres of irrigation' },
  { id: 'spin', pattern: 'yarn', title: 'Spinning', place: 'Jiangsu, China', text: 'The fibre is wet-spun: drawn through warm water so the natural gums soften and the yarn comes out fine and even. Dry-spun yarn is cheaper and hairier. You can feel the difference with your eyes shut.', figure: '24', unit: 'Nm yarn count' },
  { id: 'weave', pattern: 'weave', title: 'Weaving', place: 'Keqiao, Shaoxing', text: 'Forty-six rapier looms run in two shifts in our own shed. Sheeting is a plain weave at 165 grams per square metre: heavy enough to last, light enough to sleep under in August.', figure: '46', unit: 'looms' },
  { id: 'dye', pattern: 'dye', title: 'Dyeing', place: 'Keqiao, Shaoxing', text: 'Cloth is dyed in the piece, in lots of 300 metres, with reactive dyes that bond to the fibre. Each lot is checked against the master shade under daylight lamps. Indigo is the one colour we still let bleed a little; it is meant to fade like denim.', figure: '300', unit: 'metres per dye lot' },
  { id: 'wash', pattern: 'wash', title: 'Washing', place: 'Keqiao, Shaoxing', text: 'This is where the softness comes from. Every metre is washed twice in softened water with enzymes, then tumbled dry. It shrinks here, on our floor, so it does not shrink on your bed.', figure: '2', unit: 'washes before cutting' },
  { id: 'sew', pattern: 'stitch', title: 'Cutting and sewing', place: 'Keqiao, Shaoxing', text: 'Sixty-two people cut and sew in the building next to the looms. Seams are double-stitched, corners are mitred, and every piece is checked on a light table before it is folded.', figure: '62', unit: 'cutters and sewers' },
];

export const formatPrice = (value) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2 })}`;

export const FREE_SHIPPING_FROM = 150;
export const SHIPPING_FLAT = 14;
