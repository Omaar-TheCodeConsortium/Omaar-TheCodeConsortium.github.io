// Head tags for the concept section. Used on the client (useSeo) and at build time (scripts/prerender.mjs),
// so both produce the same title, description, canonical address, robots rule and structured data.

import { LISTED, LIBRARY_PATH, findConceptForPath } from '../concepts/registry.js';
import { COMPANY, FOUNDERS, PRODUCTS } from '../company.js';

export const SITE_URL = 'https://www.thecodeconsortium.com';
export const SITE_NAME = 'The Code Consortium';

const ORGANISATION = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.png`,
};

// Only facts that have been supplied in src/company.js go into structured data.
const known = (entries) => Object.fromEntries(Object.entries(entries).filter(([, value]) => value !== null && value !== undefined));

function organisationInFull() {
  return known({
    ...ORGANISATION,
    legalName: COMPANY.legalName,
    foundingDate: COMPANY.founded ? String(COMPANY.founded) : null,
    address: { '@type': 'PostalAddress', addressCountry: COMPANY.country, ...(COMPANY.city ? { addressLocality: COMPANY.city } : {}) },
    email: COMPANY.email,
    sameAs: [COMPANY.github, COMPANY.linkedin].filter(Boolean),
    founder: FOUNDERS.filter((person) => person.name).map((person) =>
      known({ '@type': 'Person', name: person.name, jobTitle: person.role, sameAs: person.linkedin ? [person.linkedin] : null }),
    ),
  });
}

function softwareOf(product) {
  return {
    '@type': 'SoftwareApplication',
    name: product.name,
    url: product.site,
    description: `${product.line} ${product.summary}`,
    applicationCategory: 'BusinessApplication',
    creator: { '@id': ORGANISATION['@id'] },
  };
}

// The company's own pages: the home page, one page per product and the prototypes.
function mainMeta(path) {
  if (path === '/') {
    const [spear, tea] = PRODUCTS;
    return {
      title: `${SITE_NAME}: makers of ${spear.name} and ${tea.name}`,
      description: `${SITE_NAME} is a software company in ${COMPANY.country} that builds and owns Spear: ${tea.name}, a tab ledger for tea shops that is out now, and ${spear.name}, hotel and restaurant software in development with its first customer.`,
      canonical: `${SITE_URL}/`,
      robots: 'index,follow',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [organisationInFull(), { '@type': 'WebSite', name: SITE_NAME, url: `${SITE_URL}/`, publisher: { '@id': ORGANISATION['@id'] } }, ...PRODUCTS.map(softwareOf)],
      },
    };
  }

  const product = PRODUCTS.find((entry) => entry.path === path);
  if (product) {
    return {
      title: `${product.name}: ${product.line.replace(/\.$/, '')} | ${SITE_NAME}`,
      description: `${product.summary} ${product.stage}: ${product.stageNote.toLowerCase()}. Built and owned by ${SITE_NAME}.`,
      canonical: `${SITE_URL}${path}`,
      robots: 'index,follow',
      ogType: 'website',
      jsonLd: { '@context': 'https://schema.org', '@graph': [softwareOf(product), ORGANISATION] },
    };
  }

  if (path === '/prototypes/') {
    return {
      title: `Prototypes | ${SITE_NAME}`,
      description: `Working prototypes ${SITE_NAME} built to test ideas outside hospitality: a bakery till, an HR system and a salon system. Not on sale.`,
      canonical: `${SITE_URL}${path}`,
      robots: 'index,follow',
      ogType: 'website',
      jsonLd: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Prototypes', url: `${SITE_URL}${path}`, publisher: ORGANISATION },
    };
  }

  return null;
}

// Every page of the company's own site that is written out as HTML at build time.
export const MAIN_ROUTES = ['/', ...PRODUCTS.map((product) => product.path), '/prototypes/'];

const normalise = (pathname) => (pathname.endsWith('/') ? pathname : `${pathname}/`);

function libraryMeta() {
  return {
    title: `Concept Builds | ${SITE_NAME}`,
    description:
      'Five fictional export companies, designed and built end to end by The Code Consortium: industrial manufacturing, home textiles, tech hardware, fitness equipment and drop shipping.',
    canonical: `${SITE_URL}${LIBRARY_PATH}`,
    robots: 'index,follow',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Concept Builds',
      url: `${SITE_URL}${LIBRARY_PATH}`,
      description:
        'Concept websites built by The Code Consortium for fictional export brands. None of the companies shown are real.',
      publisher: ORGANISATION,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: LISTED.length,
        itemListElement: LISTED.map((concept) => ({
          '@type': 'ListItem',
          position: concept.order,
          name: concept.name,
          url: `${SITE_URL}${concept.path}`,
        })),
      },
    },
  };
}

function conceptMeta(concept) {
  const live = concept.status === 'live';
  return {
    title: `${concept.name} | Concept build by ${SITE_NAME}`,
    description: `${concept.summary} ${concept.name} is a fictional company: this is a concept build by ${SITE_NAME}.`,
    canonical: `${SITE_URL}${concept.path}`,
    // Unfinished concepts stay out of search results until they are built.
    robots: live ? 'index,follow' : 'noindex,follow',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: concept.name,
      url: `${SITE_URL}${concept.path}`,
      description: `${concept.summary} A concept build by ${SITE_NAME}; ${concept.name} is a fictional company.`,
      isPartOf: { '@type': 'CollectionPage', name: 'Concept Builds', url: `${SITE_URL}${LIBRARY_PATH}` },
      creator: ORGANISATION,
    },
  };
}

// A page inside a built concept site.
function pageMeta(concept, page) {
  const url = `${SITE_URL}${page.path}`;
  const isHome = page.path === concept.path;
  const fictional = `${concept.name} is a fictional company: this is a concept build by ${SITE_NAME}.`;

  const breadcrumbs = [
    { name: 'Concept Builds', item: `${SITE_URL}${LIBRARY_PATH}` },
    { name: concept.name, item: `${SITE_URL}${concept.path}` },
    ...(isHome ? [] : [{ name: page.nav ?? page.title, item: url }]),
  ];

  return {
    title: isHome ? `${concept.name}: ${page.title}` : `${page.title} | ${concept.name}`,
    description: `${page.description} ${fictional}`,
    canonical: url,
    robots: concept.status === 'live' ? 'index,follow' : 'noindex,follow',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': url,
          url,
          name: page.title,
          description: `${page.description} ${fictional}`,
          isPartOf: { '@type': 'WebSite', name: concept.name, url: `${SITE_URL}${concept.path}` },
          creator: ORGANISATION,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: crumb.item,
          })),
        },
        ...(page.jsonLd ?? []),
      ],
    },
  };
}

// Returns null for the prototype pages and legal pages; those manage their own titles.
function metaFor(pathname) {
  const path = normalise(pathname);
  if (path === LIBRARY_PATH) return libraryMeta();
  const main = mainMeta(path);
  if (main) return main;

  const concept = findConceptForPath(path);
  if (!concept) return null;
  if (!concept.routes) return concept.path === path ? conceptMeta(concept) : null;

  const page = concept.routes.find((route) => route.path === path);
  return page ? pageMeta(concept, page) : null;
}

// A preview build (npm run build:preview) is for sharing work before it goes live. It must
// never be indexed, whatever a concept's status says.
export const IS_PREVIEW = import.meta.env.VITE_PREVIEW === '1';

export function getMeta(pathname) {
  const meta = metaFor(pathname);
  return meta && IS_PREVIEW ? { ...meta, robots: 'noindex,nofollow' } : meta;
}

export function isIndexable(pathname) {
  const meta = getMeta(pathname);
  return Boolean(meta) && meta.robots.startsWith('index');
}
