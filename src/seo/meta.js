// Head tags for the concept section. Used on the client (useSeo) and at build time (scripts/prerender.mjs),
// so both produce the same title, description, canonical address, robots rule and structured data.

import { CONCEPTS, LIBRARY_PATH, findConceptForPath } from '../concepts/registry.js';

export const SITE_URL = 'https://www.thecodeconsortium.com';
export const SITE_NAME = 'The Code Consortium';

const ORGANISATION = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.png`,
};

const normalise = (pathname) => (pathname.endsWith('/') ? pathname : `${pathname}/`);

function libraryMeta() {
  return {
    title: `Concept Builds | ${SITE_NAME}`,
    description:
      'Six fictional export brands, designed and built end to end by The Code Consortium: industrial manufacturing, home textiles, tech hardware, fitness equipment and drop shipping.',
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
        numberOfItems: CONCEPTS.length,
        itemListElement: CONCEPTS.map((concept) => ({
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

// Returns null for routes outside the concept section; those pages manage their own titles.
function metaFor(pathname) {
  const path = normalise(pathname);
  if (path === LIBRARY_PATH) return libraryMeta();

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
