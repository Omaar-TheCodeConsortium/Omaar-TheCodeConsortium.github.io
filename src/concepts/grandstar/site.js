// Page list for Grandstar Precision. Plain data so the registry, the SEO layer and the
// pre-render script can read it without loading the site itself.

import { FAQ } from './faq.js';

export const BASE = '/concepts/grandstar/';

export const COMPANY = {
  name: 'Grandstar Precision',
  legalName: 'Dongguan Grandstar Precision Technology Co., Ltd.',
  address: "Building 4, Jinsha Industrial Park, Chang'an Town, Dongguan 523850, Guangdong, China",
  founded: 2009,
};

export const PAGES = [
  {
    key: 'home',
    path: BASE,
    nav: null,
    sheet: 1,
    drawingTitle: 'General arrangement',
    title: 'Injection moulds and moulded parts, built to drawing',
    description:
      'Tooling, injection moulding and 3D printing under one roof in Dongguan. 34 presses from 50 to 850 tonnes, T1 samples in 15 working days.',
  },
  {
    key: 'capabilities',
    path: `${BASE}capabilities/`,
    nav: 'Capabilities',
    sheet: 2,
    drawingTitle: 'Plant and process',
    title: 'Capabilities: tooling, moulding and 3D printing',
    description:
      'Press list, mould classes, tool steels, 3D printing build volumes and secondary operations at Grandstar Precision, with the full equipment register.',
  },
  {
    key: 'materials',
    path: `${BASE}materials/`,
    nav: 'Materials',
    sheet: 3,
    drawingTitle: 'Material schedule',
    title: 'Materials library: 19 resins and print materials',
    description:
      'Tensile strength, heat deflection temperature, shrinkage, density and flame rating for the injection moulding resins and 3D printing materials Grandstar Precision runs.',
  },
  {
    key: 'quote',
    path: `${BASE}quote/`,
    nav: 'Instant quote',
    sheet: 4,
    drawingTitle: 'Budgetary estimate',
    title: 'Instant quote: price a moulded or printed part',
    description:
      'Enter part size, material and quantity to see tooling cost, unit price and lead time, and the quantity at which injection moulding becomes cheaper than 3D printing.',
  },
  {
    key: 'case-study',
    path: `${BASE}case-study/`,
    nav: 'Case study',
    sheet: 5,
    drawingTitle: 'Corrective action report',
    title: 'Case study: flattening a glass-filled controller housing',
    description:
      'How a gate move, two ribs and a copper-alloy core insert brought a PA66-GF30 e-bike controller lid from 0.61 mm to 0.18 mm flatness and cut scrap from 6.1% to 0.9%.',
  },
  {
    key: 'quality',
    path: `${BASE}quality/`,
    nav: 'Quality',
    sheet: 6,
    drawingTitle: 'Inspection plan',
    title: 'Quality: certifications, inspection and commercial terms',
    description:
      'Certifications held, the four inspection gates every order passes, the measurement equipment used, 2025 delivery and reject figures, and answers on tooling ownership, payment and shipping.',
    jsonLd: [
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  },
];

export const pageByKey = (key) => PAGES.find((page) => page.key === key);
