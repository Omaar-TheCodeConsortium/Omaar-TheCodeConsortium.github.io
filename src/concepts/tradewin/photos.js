// Photographs are picked up by file name from ./photos. A product's studio picture is named by its
// slug; the same product in use is `<slug>-use`. See docs/tradewin-shot-list.md.
const files = import.meta.glob('./photos/*.{jpg,webp}', { eager: true, query: '?url', import: 'default' });

export const PHOTOS = Object.fromEntries(Object.entries(files).map(([path, url]) => [path.replace('./photos/', '').replace(/\.[a-z]+$/, ''), url]));
export const hasPhoto = (name) => Boolean(PHOTOS[name]);
