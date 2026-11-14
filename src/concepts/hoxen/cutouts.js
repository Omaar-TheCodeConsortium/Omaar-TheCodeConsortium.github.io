import CUTOUTS from './photos/cutouts.json';

// Photographs and cut-outs are picked up by file name from ./photos.
// See docs/hoxen-shot-list.md and scripts/cutout-photos.mjs.
const files = import.meta.glob('./photos/*.{jpg,webp}', { eager: true, query: '?url', import: 'default' });
const URLS = Object.fromEntries(Object.entries(files).map(([path, url]) => [path.replace('./photos/', '').replace(/\.[a-z]+$/, ''), url]));

// The address of a photograph, by file name.
export const photoUrl = (name) => URLS[name];

// A cut-out: where it sat in its photograph (x, y, w, h as fractions), its proportions, and its files.
export const cutout = (name) => ({ ...CUTOUTS[name], src: URLS[`${name}-cut`], shade: URLS[`${name}-shade`] });
