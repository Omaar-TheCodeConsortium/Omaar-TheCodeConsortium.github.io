// Crops and compresses concept photographs.
// Originals live in photo-originals/<concept>/ (not committed); web-ready copies are written to
// src/concepts/<concept>/photos/. Run: node scripts/process-photos.mjs sunloom
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Pixels to trim from each original before resizing. Files not listed are only resized.
const CROPS = {
  sunloom: {
    'hero-bed-tall': { top: 160 },
    stack: { top: 160 },
    'product-duvet': { top: 80, bottom: 80 },
    'product-sheets': { top: 80, bottom: 80 },
    'product-pillowcases': { top: 80, bottom: 80 },
    'product-throw': { top: 80, bottom: 80 },
    'product-table': { top: 80, bottom: 80 },
    'product-towel': { top: 80, bottom: 80 },
    'bed-madder': { left: 224, right: 224 },
    'bed-sage': { left: 224, right: 224 },
    'mill-wash': { top: 80, bottom: 80 },
  },
  grandstar: {},
  hoxen: {},
  topforce: {},
};

// Photographs whose blue cloth the site re-dyes. For each, a second file is written with the
// cloth only: its light and shade in grey, everything else transparent.
const REDYE = { sunloom: ['hero-bed', 'hero-bed-tall'] };

// Products photographed on black, which the site lays straight onto its own near-black page.
// Their darkest tones are pulled down to true black, the frame is trimmed to the product with a
// margin, and what is left fades to black at its edges, so the picture's backdrop and floor never
// show as a rectangle. `lift` brightens the mid-tones of a shot that came out too dark.
const ON_BLACK = {
  topforce: {
    bar: {},
    bumpers: {},
    'change-plates': {},
    dumbbells: {},
    kettlebell: {},
    rack: {},
    bench: { lift: 1.25 },
    collars: {},
  },
};
const BLACK_POINT = 10;
const PRODUCT_FROM = 36; // brightness above which a pixel counts as product when trimming
const TRIM_MARGIN = 0.2;

async function onBlack(image, { lift = 1 }) {
  const { data, info } = await image.removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const scale = 255 / (255 - BLACK_POINT);
  const cut = (v) => Math.max(0, (v - BLACK_POINT) * scale);
  const curve = Uint8Array.from({ length: 256 }, (_, v) => Math.round(255 * (cut(v) / 255) ** (1 / lift)));
  const cols = new Uint32Array(width);
  const rows = new Uint32Array(height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * channels;
      // Measured before any lift, so a brightened floor is not mistaken for the product.
      if (cut((data[i] + data[i + 1] + data[i + 2]) / 3) > PRODUCT_FROM) {
        cols[x] += 1;
        rows[y] += 1;
      }
      data[i] = curve[data[i]];
      data[i + 1] = curve[data[i + 1]];
      data[i + 2] = curve[data[i + 2]];
    }
  }
  // A row or column belongs to the product once more than a few stray pixels in it are lit.
  const edge = (counts, need) => [counts.findIndex((n) => n > need), counts.findLastIndex((n) => n > need)];
  const [x0, x1] = edge(cols, height * 0.004);
  const [y0, y1] = edge(rows, width * 0.004);
  const pad = Math.round(Math.max(x1 - x0, y1 - y0) * TRIM_MARGIN);
  const left = Math.max(0, x0 - pad);
  const top = Math.max(0, y0 - pad);
  const box = { left, top, width: Math.min(width, x1 + pad) - left, height: Math.min(height, y1 + pad) - top };

  const short = Math.min(box.width, box.height);
  const fade = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${box.width}" height="${box.height}">
      <defs><filter id="f" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="${short * 0.03}"/></filter></defs>
      <rect width="100%" height="100%" fill="#000"/>
      <rect x="${box.width * 0.055}" y="${box.height * 0.055}" width="${box.width * 0.89}" height="${box.height * 0.89}" rx="${short * 0.07}" fill="#fff" filter="url(#f)"/>
    </svg>`,
  );
  const trimmed = await sharp(data, { raw: { width, height, channels } }).extract(box).png().toBuffer();
  return sharp(trimmed).composite([{ input: fade, blend: 'multiply' }]);
}

const MAX_LANDSCAPE = 2400;
const MAX_PORTRAIT = 1600;

// Blue cloth is told apart from the warm room by how far blue exceeds red in each pixel.
// The left fifth of the frame is the window, whose daylight is also blue, so it is left out.
async function writeCloth(input, output) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixels = info.width * info.height;
  const grey = Buffer.alloc(pixels);
  const mask = Buffer.alloc(pixels);
  for (let i = 0; i < pixels; i += 1) {
    const [r, g, b] = [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];
    // Measured against brightness, so cloth in shadow still counts as blue.
    const blue = (b - r) / (r + g + b + 1);
    const x = (i % info.width) / info.width;
    // In deep shadow the cloth loses its colour, so there anything that is not warm counts.
    // Taking too much there is harmless: a dark pixel stays dark whatever it is dyed. Only the
    // strongly orange wood of the bed frame has to be kept out.
    const floor = r + g + b < 240 ? -0.13 : 0.012;
    const t = x < 0.2 ? 0 : Math.min(1, Math.max(0, (blue - floor) / 0.03));
    mask[i] = Math.round(t * t * (3 - 2 * t) * 255);
    grey[i] = Math.min(255, Math.round((0.299 * r + 0.587 * g + 0.114 * b) * 1.6));
  }
  // Close holes: a short, dark, unmasked run with cloth above and below it in the same column is
  // cloth too (deep shadow in a fold, where the colour test fails).
  const maxGap = Math.round(info.height * 0.14);
  for (let x = 0; x < info.width; x += 1) {
    let lastCloth = -1;
    for (let y = 0; y < info.height; y += 1) {
      if (mask[y * info.width + x] < 128) continue;
      const gap = y - lastCloth - 1;
      if (lastCloth >= 0 && gap > 0 && gap <= maxGap) {
        for (let fill = lastCloth + 1; fill < y; fill += 1) {
          const at = (fill * info.width + x) * 3;
          // Only shadow is filled. A bright gap is the wall showing between two folds.
          if (data[at] + data[at + 1] + data[at + 2] < 300) mask[fill * info.width + x] = 255;
        }
      }
      lastCloth = y;
    }
  }
  const raw = { raw: { width: info.width, height: info.height, channels: 1 } };
  // The median removes stray specks from the mask; the blur feathers its edge.
  const soft = await sharp(mask, raw).median(5).blur(1.2).raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(pixels * 4);
  for (let i = 0; i < pixels; i += 1) {
    rgba.fill(grey[i], i * 4, i * 4 + 3);
    rgba[i * 4 + 3] = soft.data[i * soft.info.channels];
  }
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 78, alphaQuality: 80 })
    .toFile(output);
}

const concept = process.argv[2];
if (!CROPS[concept]) {
  console.error(`Usage: node scripts/process-photos.mjs <${Object.keys(CROPS).join('|')}>`);
  process.exit(1);
}

const from = path.resolve('photo-originals', concept);
const to = path.resolve('src/concepts', concept, 'photos');
await mkdir(to, { recursive: true });

const sizes = {};

for (const file of (await readdir(from)).filter((name) => /\.(jpe?g|png)$/i.test(name)).sort()) {
  const name = file.replace(/\.[a-z]+$/i, '');
  const input = path.join(from, file);
  const { width, height } = await sharp(input).metadata();
  const { top = 0, bottom = 0, left = 0, right = 0 } = CROPS[concept][name] ?? {};
  const box = { left, top, width: width - left - right, height: height - top - bottom };
  const limit = box.width > box.height ? MAX_LANDSCAPE : MAX_PORTRAIT;
  const output = path.join(to, `${name}.jpg`);

  const resized = sharp(input)
    .extract(box)
    .resize({ width: limit, height: limit, fit: 'inside', withoutEnlargement: true });
  const dark = ON_BLACK[concept]?.[name];
  await (dark ? await onBlack(resized, dark) : resized).jpeg({ quality: 80, mozjpeg: true }).toFile(output);

  if (REDYE[concept]?.includes(name)) await writeCloth(output, path.join(to, `${name}-cloth.webp`));

  const out = await sharp(output).metadata();
  sizes[name] = [out.width, out.height];
  const kb = Math.round((await stat(output)).size / 1024);
  console.log(`${name.padEnd(22)} ${width}x${height} -> ${out.width}x${out.height}  ${kb} KB`);
}

// Trimmed photographs are no longer a standard shape, so their sizes are written beside them.
if (ON_BLACK[concept]) await writeFile(path.join(to, 'sizes.json'), `${JSON.stringify(sizes, null, 2)}\n`);
