// Page lists for the two Tradewin sites. Plain data, read by the registry, the SEO layer and the
// pre-render script. One company, two front doors: every Direct page has a twin on the trade side.
import { PRODUCTS, formatPrice, percent, margin } from './catalog.js';

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

const BRAND = { '@type': 'Brand', name: COMPANY.name };

export const DIRECT_PAGES = [
  {
    key: 'home',
    path: DIRECT,
    nav: 'Shop',
    title: 'Small useful things, posted straight from Yiwu',
    description:
      'Tradewin Direct sells twelve small useful things for the kitchen, desk, suitcase and home, posted from the warehouse in Yiwu in 7 to 12 days. Postage is $3.90, free over $35.',
  },
  ...PRODUCTS.map((product) => ({
    key: `item:${product.slug}`,
    path: productPath(product.slug),
    nav: null,
    title: `${product.name}, ${product.pack.toLowerCase()}: ${formatPrice(product.retail)}`,
    description: `${product.name} from Tradewin Direct. ${product.blurb} Posted from Yiwu in 7 to 12 days.`,
    // No price or rating data: the shop is not real, so nothing here should surface as a buyable offer.
    jsonLd: [{ '@type': 'Product', name: `Tradewin ${product.name}`, description: product.blurb, sku: product.sku, brand: BRAND }],
  })),
];

export const TRADE_PAGES = [
  {
    key: 'home',
    path: TRADE,
    nav: 'Dashboard',
    title: 'Trade account dashboard: orders, stock and margins',
    description:
      'The Tradewin Wholesale dashboard for a demo reseller: open orders from Yiwu, lines that are about to run out, and the margin on every product in the catalogue.',
  },
  ...PRODUCTS.map((product) => ({
    key: `item:${product.slug}`,
    path: productPath(product.slug, 'trade'),
    nav: null,
    title: `${product.name}, trade price: from ${formatPrice(product.trade[2])} a unit by the carton`,
    description: `${product.name} at trade: ${product.carton} units to a carton, ${formatPrice(product.trade[0])} a unit for one carton and ${formatPrice(
      product.trade[2],
    )} from 25, leaving a ${percent(margin(product).share)} margin at the retail price.`,
  })),
];

const lists = { direct: DIRECT_PAGES, trade: TRADE_PAGES };
export const pageByKey = (side, key) => lists[side].find((page) => page.key === key) ?? null;

// Which side an address belongs to, and the address of the same page on the other side.
export const sideOf = (pathname) => (pathname.startsWith(TRADE) ? 'trade' : 'direct');

export function twinOf(pathname) {
  const side = sideOf(pathname);
  const other = side === 'trade' ? 'direct' : 'trade';
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const page = lists[side].find((entry) => entry.path === path);
  return (page && pageByKey(other, page.key)?.path) ?? baseOf(other);
}
