// Page list for Topforce Sports. Plain data, read by the registry, the SEO layer and the pre-render script.
import { PRODUCTS } from './catalog.js';

export const BASE = '/concepts/topforce/';

export const COMPANY = {
  name: 'Topforce Sports',
  short: 'Topforce',
  legalName: 'Nantong Topforce Sports Goods Co., Ltd.',
  address: '88 Jianghai Avenue, Economic and Technological Development Area, Nantong 226009, Jiangsu, China',
  founded: 2009,
};

const BRAND = { '@type': 'Brand', name: COMPANY.name };

export const productPath = (slug) => `${BASE}shop/${slug}/`;
export const categoryPath = (id) => `${BASE}shop/#${id}`;

export const PAGES = [
  {
    key: 'home',
    path: BASE,
    nav: null,
    title: 'Barbells, plates and racks, priced by the kilo',
    description:
      'Topforce Sports casts and machines strength equipment in Nantong. Load a barbell on screen and see what it weighs and costs: bumper plates are $3.18 a kilo and a 20 kg bar is $189.',
  },
  {
    key: 'shop',
    path: `${BASE}shop/`,
    nav: 'Shop',
    title: 'Shop bars, plates, dumbbells, kettlebells and racks',
    description:
      'Every Topforce product on one page: Olympic bars, bumper and change plates, hex dumbbells, kettlebells, a half rack and a bench, each with its price per kilogram.',
  },
  ...PRODUCTS.map((product) => ({
    key: `product:${product.slug}`,
    path: productPath(product.slug),
    nav: null,
    title: `${product.name}: sizes, specifications and price`,
    description: `${product.name} from Topforce Sports. ${product.blurb} ${product.proof.text}`,
    // No price or rating data: the shop is not real, so nothing here should surface as a buyable offer.
    jsonLd: [
      {
        '@type': 'Product',
        name: `Topforce ${product.name}`,
        description: product.blurb,
        sku: product.sku,
        brand: BRAND,
        category: 'Strength training equipment',
      },
    ],
  })),
  {
    key: 'build',
    path: `${BASE}build/`,
    nav: 'Build a set',
    title: 'Build a barbell set: load the bar, see the weight and price',
    description:
      'Type a target weight or tap plates onto the bar. The set builder shows what each end carries, what the set weighs and costs, and takes 8% off the plates from 100 kg.',
  },
  {
    key: 'cart',
    path: `${BASE}cart/`,
    nav: null,
    title: 'Your cart',
    description: 'Review your order, with its total weight and the freight cost shown before checkout.',
  },
];

export const pageByKey = (key) => PAGES.find((page) => page.key === key);
