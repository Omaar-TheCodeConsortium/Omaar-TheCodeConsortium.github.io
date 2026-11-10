// Page list for Sunloom International. Plain data, read by the registry, the SEO layer
// and the pre-render script.

import { PRODUCTS, basePrice } from './products.js';

export const BASE = '/concepts/sunloom/';

export const COMPANY = {
  name: 'Sunloom International',
  short: 'Sunloom',
  legalName: 'Shaoxing Sunloom International Home Textile Co., Ltd.',
  address: 'Keqiao District, Shaoxing 312030, Zhejiang, China',
  founded: 1998,
};

export const productPath = (slug) => `${BASE}product/${slug}/`;

const BRAND = { '@type': 'Brand', name: COMPANY.name };

export const PAGES = [
  {
    key: 'home',
    path: BASE,
    nav: null,
    title: 'Washed linen bedding, woven in our own mill',
    description:
      'Stonewashed European flax linen for bed, table and bath, woven, dyed and sewn in one mill in Shaoxing. Eight colours, shipped duty-paid to Europe and North America.',
  },
  {
    key: 'collection',
    path: `${BASE}collection/`,
    nav: 'Shop',
    title: 'Linen for bed, table and bath',
    description:
      'Duvet cover sets, sheets, pillowcases, throws, tablecloths, napkins and waffle towels in washed linen, in eight dyes from undyed oat to indigo.',
  },
  {
    key: 'mill',
    path: `${BASE}mill/`,
    nav: 'The mill',
    title: 'Our mill: from flax field to folded sheet',
    description:
      'How Sunloom linen is made: long-line flax from Normandy, wet-spun yarn, 46 looms in Keqiao, piece dyeing in 300-metre lots and two washes before cutting.',
  },
  {
    key: 'wholesale',
    path: `${BASE}wholesale/`,
    nav: 'Wholesale',
    title: 'Wholesale and private-label linen',
    description:
      'Stock Sunloom linen from 40 pieces at 30% off retail, add your own woven label from 200, or commission custom dye lots from 1,000. Terms, lead times and sample kits.',
  },
  {
    key: 'cart',
    path: `${BASE}cart/`,
    nav: null,
    title: 'Your bag',
    description: 'Review the linen in your bag, with shipping and duties shown before checkout.',
  },
  ...PRODUCTS.map((product) => ({
    key: `product:${product.slug}`,
    path: productPath(product.slug),
    nav: product.short,
    title: `${product.name}, from $${basePrice(product)}`,
    description: `${product.blurb} ${product.weight} g/m² washed linen in ${product.dyes.length} colours.`,
    // No price or rating data: the shop is not real, so nothing here should surface as a buyable offer.
    jsonLd: [
      {
        '@type': 'Product',
        name: product.name,
        description: product.blurb,
        brand: BRAND,
        category: `${product.category} linen`,
        material: 'Linen',
      },
    ],
  })),
];

export const pageByKey = (key) => PAGES.find((page) => page.key === key);
