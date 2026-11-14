// Crops and compresses concept photographs.
// Originals live in photo-originals/<concept>/ (not committed); web-ready copies are written to
// src/concepts/<concept>/photos/. Run: node scripts/process-photos.mjs sunloom
import { mkdir, readdir, stat } from 'node:fs/promises';
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
};

// Photographs whose blue cloth the site re-dyes. For each, a second file is written with the
// cloth only: its light and shade in grey, everything else transparent.
const REDYE = { sunloom: ['hero-bed', 'hero-bed-tall'] };

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

for (const file of (await readdir(from)).filter((name) => /\.(jpe?g|png)$/i.test(name)).sort()) {
  const name = file.replace(/\.[a-z]+$/i, '');
  const input = path.join(from, file);
  const { width, height } = await sharp(input).metadata();
  const { top = 0, bottom = 0, left = 0, right = 0 } = CROPS[concept][name] ?? {};
  const box = { left, top, width: width - left - right, height: height - top - bottom };
  const limit = box.width > box.height ? MAX_LANDSCAPE : MAX_PORTRAIT;
  const output = path.join(to, `${name}.jpg`);

  await sharp(input)
    .extract(box)
    .resize({ width: limit, height: limit, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(output);

  if (REDYE[concept]?.includes(name)) await writeCloth(output, path.join(to, `${name}-cloth.webp`));

  const out = await sharp(output).metadata();
  const kb = Math.round((await stat(output)).size / 1024);
  console.log(`${name.padEnd(22)} ${width}x${height} -> ${out.width}x${out.height}  ${kb} KB`);
}
