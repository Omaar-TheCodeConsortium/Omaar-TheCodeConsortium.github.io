// Page lists for the two Tradewin sites. Plain data, read by the registry, the SEO layer and the
// pre-render script. One company, two sets of prices: every Direct page has a twin on the trade
// side under the same `key`, which is how the switch in the header knows where to send you.
import { CATEGORIES, PRODUCTS, formatPrice, percent, margin } from './catalog.js';

export const DIRECT = '/concepts/tradewin/';
export const TRADE = '/concepts/tradewin/wholesale/';
export const baseOf = (side) => (side === 'trade' ? TRADE : DIRECT);

export const COMPANY = {
  name: 'Tradewin',
  legalName: 'Yiwu Tradewin Global Supply Chain Co., Ltd.',
  address: ['Building 7, 1188 Chouzhou North Road', 'Yiwu 322000, Zhejiang, China'],
  founded: 2014,
  countries: 41,
};

export const productPath = (slug, side = 'direct') => `${baseOf(side)}item/${slug}/`;
export const categoryPath = (id, side = 'direct') => `${baseOf(side)}${id}/`;

const BRAND = { '@type': 'Brand', name: COMPANY.name };
const names = (category) =>
  PRODUCTS.filter((product) => product.category === category.id)
    .map((product) => product.name.toLowerCase())
    .join(', ');

// `nav` places a page in the header: 'shop' beside the categories, 'help' at the end of the row.
export const DIRECT_PAGES = [
  {
    key: 'home',
    path: DIRECT,
    nav: 'shop',
    label: 'Everything',
    title: 'Small useful things, posted straight from Yiwu',
    description:
      'Tradewin Direct sells twelve small useful things for the kitchen, desk, suitcase and home, posted from the warehouse in Yiwu in 7 to 12 days. Postage is $3.90, free over $35.',
  },
  ...CATEGORIES.map((category) => ({
    key: `cat:${category.id}`,
    path: categoryPath(category.id),
    nav: 'shop',
    label: category.name,
    title: `${category.name}: ${names(category)}`,
    description: `${category.line} Tradewin Direct's ${category.name.toLowerCase()} shelf: ${names(category)}, posted from Yiwu in 7 to 12 days.`,
  })),
  ...PRODUCTS.map((product) => ({
    key: `item:${product.slug}`,
    path: productPath(product.slug),
    title: `${product.name}, ${product.pack.toLowerCase()}: ${formatPrice(product.retail)}`,
    description: `${product.name} from Tradewin Direct. ${product.blurb} Posted from Yiwu in 7 to 12 days.`,
    // No price or rating data: the shop is not real, so nothing here should surface as a buyable offer.
    jsonLd: [{ '@type': 'Product', name: `Tradewin ${product.name}`, description: product.blurb, sku: product.sku, brand: BRAND }],
  })),
  {
    key: 'basket',
    path: `${DIRECT}basket/`,
    label: 'Basket',
    title: 'Your basket',
    description: 'The Tradewin Direct basket: what you have picked, what buying two or three takes off, and how far you are from free postage.',
  },
  {
    key: 'orders',
    path: `${DIRECT}track/`,
    nav: 'help',
    label: 'Track an order',
    title: 'Track an order from Yiwu to your door',
    description: 'Follow a Tradewin Direct parcel through its five stops: packed in Yiwu, out of the warehouse, flown from Hangzhou, through customs and delivered.',
  },
  {
    key: 'terms',
    path: `${DIRECT}delivery/`,
    nav: 'help',
    label: 'Delivery and returns',
    title: 'Delivery, duties and returns',
    description: 'What Tradewin Direct charges for postage, how long a parcel takes, who pays the duty, and how to send something back within 30 days.',
  },
];

export const TRADE_PAGES = [
  {
    key: 'home',
    path: TRADE,
    nav: 'shop',
    label: 'Everything',
    title: 'Trade catalogue: twelve lines priced by the carton',
    description:
      'The Tradewin Wholesale catalogue for resellers: twelve lines sold by the carton, with the price a unit at 1, 5 and 25 cartons and what each keeps at the retail price.',
  },
  ...CATEGORIES.map((category) => ({
    key: `cat:${category.id}`,
    path: categoryPath(category.id, 'trade'),
    nav: 'shop',
    label: category.name,
    title: `${category.name} at trade prices: ${names(category)}`,
    description: `Tradewin Wholesale's ${category.name.toLowerCase()} lines by the carton: ${names(category)}, with tier prices and the margin on each.`,
  })),
  ...PRODUCTS.map((product) => ({
    key: `item:${product.slug}`,
    path: productPath(product.slug, 'trade'),
    title: `${product.name}, trade price: from ${formatPrice(product.trade[2])} a unit by the carton`,
    description: `${product.name} at trade: ${product.carton} units to a carton, ${formatPrice(product.trade[0])} a unit for one carton and ${formatPrice(
      product.trade[2],
    )} from 25, leaving a ${percent(margin(product).share)} margin at the retail price.`,
  })),
  {
    key: 'basket',
    path: `${TRADE}order/`,
    label: 'Order sheet',
    title: 'Order sheet and margin calculator',
    description: 'Build a Tradewin Wholesale order by the carton, set your own selling prices and freight, and see what the order keeps before you send it.',
  },
  {
    key: 'orders',
    path: `${TRADE}account/`,
    nav: 'help',
    label: 'Account',
    title: 'Trade account: orders, stock and margins',
    description:
      'A demo reseller account on Tradewin Wholesale: open orders from Yiwu, lines that are about to run out, and what every product in the catalogue keeps.',
  },
  {
    key: 'terms',
    path: `${TRADE}terms/`,
    nav: 'help',
    label: 'Supplier terms',
    title: 'Supplier terms: minimums, payment, freight and claims',
    description: 'How Tradewin Wholesale trades: one carton minimum, tier prices at 5 and 25 cartons, payment on dispatch, air and sea freight by the kilo, and 60 days to claim.',
  },
];

const lists = { direct: DIRECT_PAGES, trade: TRADE_PAGES };
export const pagesOf = (side) => lists[side];
export const pageByKey = (side, key) => lists[side].find((page) => page.key === key) ?? null;
export const pathOf = (side, key) => pageByKey(side, key)?.path ?? baseOf(side);

// Which side an address belongs to, and the address of the same page on the other side.
export const sideOf = (pathname) => (pathname.startsWith(TRADE) ? 'trade' : 'direct');

export function twinOf(pathname) {
  const side = sideOf(pathname);
  const other = side === 'trade' ? 'direct' : 'trade';
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const page = lists[side].find((entry) => entry.path === path);
  return (page && pageByKey(other, page.key)?.path) ?? baseOf(other);
}
