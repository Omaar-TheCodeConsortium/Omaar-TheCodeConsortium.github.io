// Runs after `vite build`. Turns each concept route into a complete HTML file so that
// search engines and AI crawlers get real content and a normal "200 OK" response,
// then writes sitemap.xml and llms.txt.
//
// Routes and head tags come from src/concepts/registry.js and src/seo/meta.js.

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const server = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);
const { render, prerenderRoutes, getMeta, isIndexable, CONCEPTS, LIBRARY_PATH, SITE_URL, SITE_NAME, IS_PREVIEW } = server;

const template = await readFile(path.join(dist, 'index.html'), 'utf8');

// Vite's manifest maps each source file to the hashed CSS and JS it was built into.
const manifestPath = path.join(dist, '.vite', 'manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

// A lazily loaded route keeps its styles and fonts in its own files. Without these links a
// pre-rendered page would appear unstyled until the main script had fetched them.
function routeAssets(route) {
  const segment = route.split('/').filter(Boolean)[1];
  const key = segment ? `src/concepts/${segment}/index.jsx` : 'src/pages/ConceptLibrary.jsx';
  if (!manifest[key]) throw new Error(`prerender: ${key} is missing from the build manifest`);

  const css = new Set();
  const js = new Set();
  const visit = (name) => {
    const chunk = manifest[name];
    if (!chunk || chunk.isEntry || js.has(chunk.file)) return;
    js.add(chunk.file);
    (chunk.css ?? []).forEach((file) => css.add(file));
    (chunk.imports ?? []).forEach(visit);
  };
  visit(key);

  return [
    ...[...css].map((file) => `<link rel="stylesheet" crossorigin href="/${file}">`),
    ...[...js].map((file) => `<link rel="modulepreload" crossorigin href="/${file}">`),
  ].join('\n    ');
}

const ROOT_MARKER = '<div id="root"></div>';
const TITLE_PATTERN = /<title>[\s\S]*?<\/title>/;
const HTML_CLASS_MARKER = '<html class="scroll-smooth"';

for (const [label, found] of [
  ['root element', template.includes(ROOT_MARKER)],
  ['title tag', TITLE_PATTERN.test(template)],
  ['html class', template.includes(HTML_CLASS_MARKER)],
]) {
  if (!found) throw new Error(`prerender: could not find the ${label} in dist/index.html`);
}

const escapeAttr = (value) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// data-seo marks the tags that src/seo/useSeo.js takes over in the browser.
function headTags(meta) {
  const jsonLd = JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c');
  return [
    `<meta name="description" content="${escapeAttr(meta.description)}" data-seo>`,
    `<meta name="robots" content="${meta.robots}" data-seo>`,
    `<link rel="canonical" href="${meta.canonical}" data-seo>`,
    `<meta property="og:title" content="${escapeAttr(meta.title)}" data-seo>`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" data-seo>`,
    `<meta property="og:url" content="${meta.canonical}" data-seo>`,
    `<meta property="og:type" content="${meta.ogType}" data-seo>`,
    `<meta property="og:site_name" content="${escapeAttr(SITE_NAME)}" data-seo>`,
    `<meta name="twitter:card" content="summary" data-seo>`,
    `<script type="application/ld+json" data-seo>${jsonLd}</script>`,
  ].join('\n    ');
}

let written = 0;

for (const route of prerenderRoutes) {
  const meta = getMeta(route);
  if (!meta) throw new Error(`prerender: no head tags defined for ${route}`);

  const body = await render(route);
  if (!body.includes('<h1')) throw new Error(`prerender: ${route} rendered without an H1`);

  let html = template
    .replace(TITLE_PATTERN, `<title>${escapeAttr(meta.title)}</title>`)
    .replace('</head>', `  ${headTags(meta)}\n    ${routeAssets(route)}\n  </head>`)
    .replace(ROOT_MARKER, `<div id="root">${body}</div>`);

  // Concept sites run without the main site's page zoom; setting the class here avoids a jump on load.
  if (route !== LIBRARY_PATH) {
    html = html.replace(HTML_CLASS_MARKER, '<html class="scroll-smooth concept-root"');
  }

  const outDir = path.join(dist, route);
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, 'index.html'), html);
  written += 1;
}

// sitemap.xml: the home page plus every concept page that search engines may index.
const today = new Date().toISOString().slice(0, 10);
const indexable = ['/', ...prerenderRoutes.filter((route) => isIndexable(route))];
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...indexable.map((route) => `  <url><loc>${SITE_URL}${route}</loc><lastmod>${today}</lastmod></url>`),
  '</urlset>',
  '',
].join('\n');
await writeFile(path.join(dist, 'sitemap.xml'), sitemap);

// llms.txt: a plain-text guide for AI assistants. A convention, not a standard.
const liveConcepts = CONCEPTS.filter((concept) => concept.status === 'live');
const llms = [
  `# ${SITE_NAME}`,
  '',
  `> ${SITE_NAME} is a software engineering company that designs and builds websites and business platforms.`,
  '',
  '## Concept builds',
  '',
  `- [Concept Builds](${SITE_URL}${LIBRARY_PATH}): Concept websites built for fictional export brands, to show the range of work. None of the companies shown are real.`,
  ...liveConcepts.flatMap((concept) => [
    '',
    `### ${concept.name}`,
    '',
    `${concept.summary} Fictional company; concept build by ${SITE_NAME}.`,
    '',
    ...(concept.routes ?? [{ path: concept.path, title: concept.name, description: concept.summary }]).map(
      (page) => `- [${page.title}](${SITE_URL}${page.path}): ${page.description}`,
    ),
  ]),
  '',
].join('\n');
await writeFile(path.join(dist, 'llms.txt'), llms);

// A preview build is shared by link only: keep every page of it out of search engines.
if (IS_PREVIEW) {
  const noindex = '<meta name="robots" content="noindex,nofollow">';
  for (const file of ['index.html', '404.html']) {
    const target = path.join(dist, file);
    const page = await readFile(target, 'utf8');
    if (!page.includes('name="robots"')) await writeFile(target, page.replace('<head>', `<head>\n    ${noindex}`));
  }
  await writeFile(path.join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  await rm(path.join(dist, 'sitemap.xml'), { force: true });
  await rm(path.join(dist, 'llms.txt'), { force: true });
  // Stops GitHub Pages from running the files through Jekyll.
  await writeFile(path.join(dist, '.nojekyll'), '');
}

// Build leftovers that should not be published.
await rm(ssrDir, { recursive: true, force: true });
await rm(path.join(dist, '.vite'), { recursive: true, force: true });

console.log(`prerender: wrote ${written} pages, sitemap.xml (${indexable.length} addresses) and llms.txt`);
