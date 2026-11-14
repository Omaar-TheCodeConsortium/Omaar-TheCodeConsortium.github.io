// Cuts products out of their studio backgrounds, so they can float over the page.
// Run after process-photos:  node scripts/cutout-photos.mjs hoxen
//
// The background is found by spreading inwards from the edges of the frame across anything that
// changes smoothly (the backdrop and its soft shadows) and stopping at the product's hard edges.
// Each cut-out is trimmed to its own outline and written as a WebP with transparency. Where each
// one sat in the original frame is recorded in cutouts.json, so pieces can be put back in place.

import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// source: the processed photograph. pieces: how to split what is found, left to right.
//   'one'      the whole product as a single piece
//   'blobs'    one piece per separate object, named in order
//   'cuts'     one piece per band between the given positions (fractions of the width)
// seeds: extra starting points inside enclosed background, such as a camera opening.
// shade: also write a grey light-and-shade layer of the pale material, for re-colouring.
// trim: shave thin slivers of shadow off the outline, by this many pixels.
// warm: the product is as bright as the backdrop but warmer in tone (an off-white case on cool
//   grey), so the backdrop is told apart by being bluer than it is red.
const JOBS = {
  hoxen: [
    { source: 'hero-charger', pieces: 'one', names: ['charger'] },
    { source: 'lineup', pieces: 'blobs', names: ['charger-30', 'charger-65', 'charger-100', 'charger-140'], darkest: 95, step: 11, trim: 5 },
    { source: 'exploded', pieces: 'cuts', cuts: [0.452, 0.553, 0.661],
      names: ['part-shell', 'part-power', 'part-ports', 'part-face'],
      // A tight step keeps the pale heat spreader, which is close to the backdrop in tone.
      step: 2,
      // The two port openings in the front plate.
      seeds: [
        [0.733, 0.59],
        [0.733, 0.671],
      ],
    },
    { source: 'case-back', pieces: 'one', names: ['case-back'], seeds: [[0.5, 0.24]], shade: true, warm: true },
    { source: 'case-angle', pieces: 'one', names: ['case-angle'], shade: true, warm: true },
    { source: 'cable-coil', pieces: 'one', names: ['cable'], seeds: [[0.42, 0.42]] },
  ],
};

const STEP = 5; // largest change between neighbouring pixels that still counts as backdrop (a job can set its own)
const DARKEST = 150; // backdrop and shadow never get darker than this (a job can set its own)
const BRIGHTEST = 233; // nor brighter than this: bare aluminium is

async function findBackground(file, { seeds = [], warm = false, darkest = DARKEST, step = STEP, trim = 0 }) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  // A light blur keeps film grain and JPEG noise from stopping the spread.
  const soft = await sharp(file).removeAlpha().blur(warm ? 2.2 : 1.4).raw().toBuffer();
  const { width, height } = info;
  const background = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;
  const push = (i) => {
    if (background[i]) return;
    background[i] = 1;
    queue[tail] = i;
    tail += 1;
  };
  for (let x = 0; x < width; x += 1) {
    push(x);
    push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    push(y * width);
    push(y * width + width - 1);
  }
  for (const [sx, sy] of seeds) push(Math.round(sy * height) * width + Math.round(sx * width));

  const near = (a, b) => {
    const [r, g, bl] = [soft[b * 3], soft[b * 3 + 1], soft[b * 3 + 2]];
    if (Math.min(r, g, bl) < darkest) return false;
    if (warm) return bl - r >= 1;
    if (Math.max(r, g, bl) > BRIGHTEST) return false;
    if (Math.max(r, g, bl) - Math.min(r, g, bl) > 26) return false; // the backdrop is grey, never coloured
    return (
      Math.abs(soft[a * 3] - r) <= step && Math.abs(soft[a * 3 + 1] - g) <= step && Math.abs(soft[a * 3 + 2] - bl) <= step
    );
  };
  while (head < tail) {
    const i = queue[head];
    head += 1;
    const x = i % width;
    if (x > 0 && !background[i - 1] && near(i, i - 1)) push(i - 1);
    if (x < width - 1 && !background[i + 1] && near(i, i + 1)) push(i + 1);
    if (i >= width && !background[i - width] && near(i, i - width)) push(i - width);
    if (i < width * (height - 1) && !background[i + width] && near(i, i + width)) push(i + width);
  }
  if (trim) {
    // Wear the outline away, then grow it back: anything thinner than the trim does not return.
    const solid = Buffer.alloc(width * height);
    for (let i = 0; i < width * height; i += 1) solid[i] = background[i] ? 0 : 255;
    const raw = { raw: { width, height, channels: 1 } };
    const worn = await sharp(solid, raw).blur(trim).threshold(235).raw().toBuffer({ resolveWithObject: true });
    const wornOne = Buffer.alloc(width * height);
    for (let i = 0; i < width * height; i += 1) wornOne[i] = worn.data[i * worn.info.channels];
    // It grows back a little less than it was worn, so slivers lying close to the outline stay gone.
    const grown = await sharp(wornOne, raw)
      .blur(Math.max(1, trim - 3))
      .threshold(40)
      .raw()
      .toBuffer({ resolveWithObject: true });
    for (let i = 0; i < width * height; i += 1) if (!grown.data[i * grown.info.channels]) background[i] = 1;
  }
  return { data, width, height, background };
}

// Separate objects, largest first is not needed: they are returned left to right.
function findBlobs(background, width, height, minimum) {
  const label = new Int32Array(width * height);
  const blobs = [];
  const stack = [];
  for (let start = 0; start < width * height; start += 1) {
    if (background[start] || label[start]) continue;
    const id = blobs.length + 1;
    const box = { x0: width, y0: height, x1: 0, y1: 0, area: 0, id };
    stack.push(start);
    label[start] = id;
    while (stack.length) {
      const i = stack.pop();
      const x = i % width;
      const y = (i - x) / width;
      box.area += 1;
      if (x < box.x0) box.x0 = x;
      if (x > box.x1) box.x1 = x;
      if (y < box.y0) box.y0 = y;
      if (y > box.y1) box.y1 = y;
      for (const n of [x > 0 ? i - 1 : -1, x < width - 1 ? i + 1 : -1, i - width, i + width]) {
        if (n < 0 || n >= width * height || background[n] || label[n]) continue;
        label[n] = id;
        stack.push(n);
      }
    }
    blobs.push(box);
  }
  return { label, blobs: blobs.filter((blob) => blob.area >= minimum).sort((a, b) => a.x0 - b.x0) };
}

async function writePiece({ data, width, height }, keep, output, shadeOutput, smooth = 0) {
  let [x0, y0, x1, y1] = [width, height, 0, 0];
  const alpha = Buffer.alloc(width * height);
  for (let i = 0; i < width * height; i += 1) {
    if (!keep(i)) continue;
    alpha[i] = 255;
    const x = i % width;
    const y = (i - x) / width;
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  if (x1 < x0) return null;
  const pad = 4;
  x0 = Math.max(0, x0 - pad);
  y0 = Math.max(0, y0 - pad);
  x1 = Math.min(width - 1, x1 + pad);
  y1 = Math.min(height - 1, y1 + pad);
  const box = { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
  const raw = { raw: { width, height, channels: 1 } };
  // Pull the edge in by a pixel, then feather it, so no pale rim of backdrop is left on the product.
  // A colour-keyed outline is rougher than a contrast one, so it is smoothed before feathering.
  const outline = smooth ? sharp(alpha, raw).blur(smooth).threshold(112) : sharp(alpha, raw);
  const edge = await outline.blur(1.1).linear(1.6, -90).extract(box).raw().toBuffer({ resolveWithObject: true });
  const feathered = (x, y) => edge.data[(y * box.width + x) * edge.info.channels];

  const rgba = Buffer.alloc(box.width * box.height * 4);
  const shade = shadeOutput ? Buffer.alloc(box.width * box.height * 4) : null;
  for (let y = 0; y < box.height; y += 1) {
    for (let x = 0; x < box.width; x += 1) {
      const from = ((y + y0) * width + x + x0) * 3;
      const to = (y * box.width + x) * 4;
      const [r, g, b] = [data[from], data[from + 1], data[from + 2]];
      rgba[to] = r;
      rgba[to + 1] = g;
      rgba[to + 2] = b;
      rgba[to + 3] = feathered(x, y);
      if (shade) {
        // The pale material only: its light and shade in grey, lifted so its flat areas are white.
        const light = 0.299 * r + 0.587 * g + 0.114 * b;
        const pale = Math.min(1, Math.max(0, (light - 105) / 40));
        shade.fill(Math.min(255, Math.round((light / 222) * 255)), to, to + 3);
        shade[to + 3] = Math.round(feathered(x, y) * pale);
      }
    }
  }
  const size = { raw: { width: box.width, height: box.height, channels: 4 } };
  await sharp(rgba, size).webp({ quality: 84, alphaQuality: 90 }).toFile(output);
  if (shade) await sharp(shade, size).webp({ quality: 80, alphaQuality: 90 }).toFile(shadeOutput);
  return { x: x0 / width, y: y0 / height, w: box.width / width, h: box.height / height, ratio: box.width / box.height };
}

const concept = process.argv[2];
if (!JOBS[concept]) {
  console.error(`Usage: node scripts/cutout-photos.mjs <${Object.keys(JOBS).join('|')}>`);
  process.exit(1);
}

const dir = path.resolve('src/concepts', concept, 'photos');
const manifest = {};

for (const job of JOBS[concept]) {
  const image = await findBackground(path.join(dir, `${job.source}.jpg`), job);
  const { width, height, background } = image;
  const { label, blobs } = findBlobs(background, width, height, width * height * 0.002);
  const wanted = new Set(blobs.map((blob) => blob.id));
  const solid = (i) => !background[i] && wanted.has(label[i]);

  let keeps;
  if (job.pieces === 'blobs') {
    keeps = blobs.slice(0, job.names.length).map((blob) => (i) => label[i] === blob.id);
  } else if (job.pieces === 'cuts') {
    const edges = [0, ...job.cuts, 1].map((cut) => Math.round(cut * width));
    keeps = job.names.map((_, index) => (i) => solid(i) && i % width >= edges[index] && i % width < edges[index + 1]);
  } else {
    keeps = [solid];
  }

  for (const [index, name] of job.names.entries()) {
    if (!keeps[index]) {
      console.warn(`${job.source}: nothing found for ${name}`);
      continue;
    }
    const shadeOutput = job.shade ? path.join(dir, `${name}-shade.webp`) : null;
    const box = await writePiece(image, keeps[index], path.join(dir, `${name}-cut.webp`), shadeOutput, job.warm ? 24 : 0);
    if (!box) {
      console.warn(`${job.source}: nothing found for ${name}`);
      continue;
    }
    manifest[name] = box;
    console.log(`${name.padEnd(14)} from ${job.source.padEnd(13)} ${(box.w * 100).toFixed(1)}% x ${(box.h * 100).toFixed(1)}% of the frame`);
  }
  manifest[`${job.source}:frame`] = { ratio: width / height };
}

await writeFile(path.join(dir, 'cutouts.json'), `${JSON.stringify(manifest, null, 2)}\n`);
