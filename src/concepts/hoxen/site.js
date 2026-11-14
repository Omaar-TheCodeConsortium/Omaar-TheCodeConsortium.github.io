// Page list for Hoxen. Plain data, read by the registry, the SEO layer and the pre-render script.

export const BASE = '/concepts/hoxen/';

export const COMPANY = {
  name: 'Hoxen',
  legalName: 'Shenzhen Hoxen Technology Co., Ltd.',
  address: "Building 7, Zhigu Innovation Park, Xixiang, Bao'an District, Shenzhen 518102, Guangdong, China",
  founded: 2016,
};

const BRAND = { '@type': 'Brand', name: COMPANY.name };

export const PAGES = [
  {
    key: 'home',
    path: BASE,
    nav: null,
    title: '65 W GaN charger, 104 grams',
    description:
      'Hoxen makes compact GaN chargers, braided USB-C cables and phone cases in Shenzhen. The 65 W charger runs a laptop and a phone at once and weighs 104 grams.',
  },
  {
    key: 'charger',
    path: `${BASE}charger/`,
    nav: 'Chargers',
    title: 'Configure a Hoxen GaN charger: 30, 65, 100 or 140 W',
    description:
      'Choose the power, plug and cable for a Hoxen GaN charger and see what it will charge and how fast. From $19, with free shipping over $50.',
    // No price or rating data: the shop is not real, so nothing here should surface as a buyable offer.
    jsonLd: [
      {
        '@type': 'Product',
        name: 'Hoxen GaN charger',
        description: 'Compact USB-C wall charger in 30, 65, 100 and 140 watt versions.',
        brand: BRAND,
        category: 'USB-C wall chargers',
      },
    ],
  },
  {
    key: 'compare',
    path: `${BASE}compare/`,
    nav: 'Compare',
    title: 'Compare Hoxen chargers: ports, size, weight and charge times',
    description:
      'The four Hoxen GaN chargers side by side: ports, power sharing, size, weight, power density and the time each takes to half-charge a phone and a laptop.',
  },
  {
    key: 'compatibility',
    path: `${BASE}compatibility/`,
    nav: 'Will it charge?',
    title: 'Compatibility checker: which Hoxen charger fits your devices',
    description:
      'Pick one or two devices and see which Hoxen charger gives each its full charging speed, how long a half charge takes and which cable you need.',
  },
  {
    key: 'cart',
    path: `${BASE}cart/`,
    nav: null,
    title: 'Your bag',
    description: 'Review the chargers, cables and cases in your bag, with shipping shown before checkout.',
  },
];

export const pageByKey = (key) => PAGES.find((page) => page.key === key);
