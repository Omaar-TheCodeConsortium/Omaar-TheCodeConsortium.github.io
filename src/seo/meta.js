// Head tags for the concept section. Used on the client (useSeo) and at build time (scripts/prerender.mjs),
// so both produce the same title, description, canonical address, robots rule and structured data.

import { LISTED, LIBRARY_PATH, findConceptForPath } from '../concepts/registry.js';
import { COMPANY, DEMO_PAGES, FOUNDERS, PRODUCTS } from '../company.js';

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
      known({ '@type': 'Person', name: person.name, jobTitle: person.role, sameAs: [person.linkedin, person.github].filter(Boolean) }),
    ),
  });
}

function softwareOf(product) {
  return {
    '@type': 'SoftwareApplication',
    name: product.name,
    url: product.site ?? `${SITE_URL}${product.path}`,
    description: `${product.line} ${product.summary}`,
    applicationCategory: 'BusinessApplication',
    creator: { '@id': ORGANISATION['@id'] },
  };
}

// The company's own pages: the home page, one page per product and the Lab.
function mainMeta(path) {
  if (path === '/') {
    return {
      title: `${SITE_NAME}: software built to solve, not just run`,
      description: `${SITE_NAME} is a software company in ${COMPANY.country} that builds and runs its own products: ${PRODUCTS.map((product) => `${product.name} (${product.industry.toLowerCase()})`).join(', ')}.`,
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
      description: `${product.summary} ${product.stage}: ${product.stageNote.toLowerCase()}. Built and run by ${SITE_NAME}.`,
      canonical: `${SITE_URL}${path}`,
      robots: 'index,follow',
      ogType: 'website',
      jsonLd: { '@context': 'https://schema.org', '@graph': [softwareOf(product), ORGANISATION] },
    };
  }

  const prototype = DEMO_PAGES.find((entry) => `${entry.path}/` === path);
  if (prototype) {
    return {
      title: `${prototype.name}: ${prototype.kind} | ${SITE_NAME}`,
      description: `${prototype.line} A working demo with made-up data, built by ${SITE_NAME}.`,
      canonical: `${SITE_URL}${prototype.path}`,
      robots: 'index,follow',
      ogType: 'website',
      jsonLd: { '@context': 'https://schema.org', '@type': 'WebPage', name: prototype.name, url: `${SITE_URL}${prototype.path}`, publisher: ORGANISATION },
    };
  }

  const legal = { '/terms/': 'Terms of Service', '/privacy/': 'Privacy Policy' }[path];
  if (legal) {
    return {
      title: `${legal} | ${SITE_NAME}`,
      description: `${legal} for ${SITE_NAME} and its websites.`,
      canonical: `${SITE_URL}${path.slice(0, -1)}`,
      robots: 'index,follow',
      ogType: 'website',
      jsonLd: { '@context': 'https://schema.org', '@type': 'WebPage', name: legal, publisher: ORGANISATION },
    };
  }

  // Tools we send customers a link to. Not linked from the site and kept out of search engines.
  if (path === '/brief/') {
    return {
      title: `Project brief | ${SITE_NAME}`,
      description: `Tell ${SITE_NAME} what you need built: a website, a business system or an app. Your answers come to us as one document.`,
      canonical: `${SITE_URL}${path}`,
      robots: 'noindex,nofollow',
      ogType: 'website',
      jsonLd: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Project brief', publisher: ORGANISATION },
    };
  }

  if (path === '/lab/') {
    return {
      title: `Lab | ${SITE_NAME}`,
      description: `Experiments ${SITE_NAME} built to test ideas, each finished enough to deploy: a bakery till and a salon system.`,
      canonical: `${SITE_URL}${path}`,
      robots: 'index,follow',
      ogType: 'website',
      jsonLd: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Lab', url: `${SITE_URL}${path}`, publisher: ORGANISATION },
    };
  }

  return null;
}

// Every page of the company's own site that is written out as HTML at build time.
// /brief/ is among them so it loads like a company page, but it is noindex and stays out of the sitemap.
export const MAIN_ROUTES = ['/', ...PRODUCTS.map((product) => product.path), '/lab/', '/brief/'];

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

// Returns null for addresses that have no head tags of their own.
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
