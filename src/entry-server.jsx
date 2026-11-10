// Build-time entry: scripts/prerender.mjs imports the compiled version of this file
// to turn each concept route into a complete HTML page.
import { StrictMode } from 'react';
import { prerenderToNodeStream } from 'react-dom/static';
import { StaticRouter } from 'react-router-dom';
import App from './App.jsx';
import { CONCEPTS, LIBRARY_PATH, conceptPaths } from './concepts/registry.js';

export { CONCEPTS, LIBRARY_PATH };
export { SITE_URL, SITE_NAME, IS_PREVIEW, getMeta, isIndexable } from './seo/meta.js';

export const prerenderRoutes = [LIBRARY_PATH, ...CONCEPTS.flatMap(conceptPaths)];

// Waits for lazy-loaded routes, so the returned HTML is the finished page.
export async function render(url) {
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );

  prelude.setEncoding('utf8');
  let html = '';
  for await (const chunk of prelude) html += chunk;
  return html;
}
