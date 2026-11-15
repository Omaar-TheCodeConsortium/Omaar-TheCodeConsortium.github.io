// Cuts products out of their studio backgrounds, so they can float over the page.
// Run:  node scripts/cutout-photos.mjs hoxen
//
// Works from the full-size originals in photo-originals/<concept>/ (not committed), because
// compression blurs exactly the colour differences this relies on. Each product is told apart from
// the backdrop by a test chosen per photograph, the outline is smoothed and feathered, and each
// cut-out is trimmed to its own outline and written as a WebP with transparency. Where each one
// sat in the original frame is recorded in cutouts.json, so pieces can be put back in place.

import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// key: how the product is told from the backdrop.
//   'dark'   the product is darker than the backdrop and its shadows (limit: how dark), or coloured
//   'warm'   the product is as bright as the backdrop but warmer in tone (an off-white case on
//            cool grey), so it is found by how far red exceeds blue
// pieces: how to split what is found, left to right.
//   'one'    the whole product as a single piece
//   'blobs'  one piece per separate object, named in order
//   'cuts'   one piece per band between the given positions (fractions of the width)
// seeds: points (fractions of the frame) inside enclosed backdrop, such as a camera opening.
//   Anything else the backdrop cannot reach from the frame edges is kept as product.
// add: outlines traced by hand, in pixels of the original, for pale metal the tests cannot see.
// guide: a shadow lying against a dark product is as dark as the product where the two meet, so
//   no brightness test can part them. For these, scripts/cutout-guides/<concept>/<source>.png holds
//   a rough mask from a background-removal model (@imgly/background-removal-node, run once by hand
//   and not a dependency: its alpha channel, saved at half size). It is soft-edged, so it is not
//   used for the outline, only to rule out anything well outside it.
// rebuild: the full outline of a part partly hidden behind another, whose hidden area is painted
//   from its visible area (mirrored about a vertical line, with its edge carried round).
// shade: also write a grey light-and-shade layer of the case material, for re-colouring.
const JOBS = {
  hoxen: [
    { source: 'hero-charger', key: 'dark', pieces: 'one', names: ['charger'], guide: true },
    {
      source: 'lineup',
      key: 'dark',
      pieces: 'blobs',
      names: ['charger-30', 'charger-65', 'charger-100', 'charger-140'],
      guide: true,
    },
    {
      source: 'exploded',
      key: 'dark',
      pieces: 'cuts',
      cuts: [0.4528, 0.553, 0.661],
      names: ['part-shell', 'part-power', 'part-ports', 'part-face'],
      // The two port openings in the front plate.
      seeds: [
        [0.733, 0.59],
        [0.733, 0.671],
      ],
      // The right-hand part of the heat spreader is hidden behind the circuit board. When the board
      // slides away it would be missing, so it is rebuilt: its whole outline (the visible outline,
      // carried on behind the board) and a line to mirror its texture about.
      rebuild: {
        piece: 0,
        // The board covers every pixel right of this line between these rows, including its own
        // edge and the shadow it casts there.
        behind: { x: 1248, top: 521, bottom: 1000 },
        mirror: 1245,
        points: [
          [1117, 466], [1118, 457], [1122, 451], [1130, 448], [1300, 434.4], [1308, 436.5], [1313.5, 442.5],
          [1315.5, 452], [1317, 478], [1318.5, 700], [1319.5, 975], [1318, 986], [1313, 993], [1304, 996],
          [1238.5, 1000], [1239, 1018], [1243.5, 1026.5], [1236.5, 1024.5], [1232.5, 1018],
          [1231.5, 1000.5], [1203, 1004.8], [1199.5, 1007.5], [1197.5, 1029], [1193, 1033.5], [1126, 1042.5],
          [1119, 1039.5], [1115.5, 1033], [1114.5, 986], [1100, 975], [1100, 600], [1125, 585], [1125, 470],
        ],
      },
      add: [
        // The aluminium heat spreader, which is the same tone as the backdrop. It stays with the shell.
        {
          piece: 0,
          pale: true,
          points: [
            [1117, 466], [1118, 457], [1122, 451], [1130, 448], [1300, 434.4], [1308, 436.5], [1313.5, 442.5],
            [1315.5, 452], [1317, 478], [1317, 489], [1285, 491], [1271, 500], [1263, 515], [1254, 521],
            [1254, 1000], [1238.5, 1000], [1239, 1018], [1243.5, 1026.5], [1236.5, 1024.5], [1232.5, 1018],
            [1231.5, 1000.5], [1203, 1004.8], [1199.5, 1007.5], [1197.5, 1029], [1193, 1033.5], [1126, 1042.5],
            [1119, 1039.5], [1115.5, 1033], [1114.5, 986], [1100, 975], [1100, 600], [1125, 585], [1125, 470],
          ],
        },
        // A small nub on the top edge of the heat spreader, past the edge of the shell's band.
        { piece: 0, ellipse: [1269, 435, 10, 7] },
        // The silver end of the top capacitor, which reaches the edge of its band.
        { piece: 1, ellipse: [1491.5, 568, 35, 48.5] },
        // The plug prong.
        { piece: 0, points: [[520.5, 502], [553, 504.5], [553, 575], [522, 571.5], [517, 560], [517, 512]] },
      ],
    },
    { source: 'case-back', key: 'warm', pieces: 'one', names: ['case-back'], seeds: [[0.5, 0.24]], shade: true },
    { source: 'case-angle', key: 'warm', pieces: 'one', names: ['case-angle'], shade: true, phone: true },
    { source: 'cable-coil', key: 'dark', pieces: 'one', names: ['cable'], seeds: [[0.42, 0.42]], limit: 168 },
  ],
};

const LIMIT = 188; // a dark product, and the line of shadow it stands on, is never brighter than this
const CASE_LIGHT = 212; // the brightness of the flat of the off-white case, which becomes pure colour

const light = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;
const one = (width, height) => ({ raw: { width, height, channels: 1 } });

// One channel of a blurred single-channel buffer.
async function blurred(buffer, width, height, sigma) {
  const { data, info } = await sharp(buffer, one(width, height)).blur(sigma).raw().toBuffer({ resolveWithObject: true });
  if (info.channels === 1) return data;
  const out = Buffer.alloc(width * height);
  for (let i = 0; i < width * height; i += 1) out[i] = data[i * info.channels];
  return out;
}

// Hand-traced outlines, one mask per shape: 255 inside, 0 outside, smooth at the edge.
// A shape is a polygon (points) or an ellipse (ellipse: [cx, cy, rx, ry]).
async function drawn(shapes, width, height) {
  const masks = [];
  for (const shape of shapes) {
    const body = shape.ellipse
      ? `<ellipse cx="${shape.ellipse[0]}" cy="${shape.ellipse[1]}" rx="${shape.ellipse[2]}" ry="${shape.ellipse[3]}" fill="#fff"/>`
      : `<polygon points="${shape.points.map((p) => p.join(',')).join(' ')}" fill="#fff"/>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#000"/>${body}</svg>`;
    const { data, info } = await sharp(Buffer.from(svg)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const out = Buffer.alloc(width * height);
    for (let i = 0; i < width * height; i += 1) out[i] = data[i * info.channels];
    masks.push(out);
  }
  return masks;
}

// Everything the backdrop can reach from the frame edges and the seeds, without crossing product.
function reach(product, width, height, seeds) {
  const background = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;
  const push = (i) => {
    if (background[i] || product[i]) return;
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
  while (head < tail) {
    const i = queue[head];
    head += 1;
    const x = i % width;
    if (x > 0) push(i - 1);
    if (x < width - 1) push(i + 1);
    if (i >= width) push(i - width);
    if (i < width * (height - 1)) push(i + width);
  }
  return background;
}

// Separate objects, left to right. Anything smaller than the minimum is ignored.
function findBlobs(solid, width, height, minimum) {
  const label = new Int32Array(width * height);
  const blobs = [];
  const stack = [];
  for (let start = 0; start < width * height; start += 1) {
    if (!solid[start] || label[start]) continue;
    const id = blobs.length + 1;
    const box = { x0: width, area: 0, id };
    stack.push(start);
    label[start] = id;
    while (stack.length) {
      const i = stack.pop();
      const x = i % width;
      box.area += 1;
      if (x < box.x0) box.x0 = x;
      for (const n of [x > 0 ? i - 1 : -1, x < width - 1 ? i + 1 : -1, i - width, i + width]) {
        if (n < 0 || n >= width * height || !solid[n] || label[n]) continue;
        label[n] = id;
        stack.push(n);
      }
    }
    blobs.push(box);
  }
  return { label, blobs: blobs.filter((blob) => blob.area >= minimum).sort((a, b) => a.x0 - b.x0) };
}

async function findProduct(file, job) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const pixels = width * height;
  const warm = job.key === 'warm';
  // A light blur keeps film grain from speckling the result; colour needs more than brightness does.
  const soft = await sharp(file).removeAlpha().blur(warm ? 2.2 : 1).raw().toBuffer();
  const limit = job.limit ?? LIMIT;

  const product = new Uint8Array(pixels);
  for (let i = 0; i < pixels; i += 1) {
    const [r, g, b] = [soft[i * 3], soft[i * 3 + 1], soft[i * 3 + 2]];
    if (warm) product[i] = r - b > -2.5 ? 1 : 0;
    else product[i] = light(r, g, b) < limit || Math.max(r, g, b) - Math.min(r, g, b) > 45 ? 1 : 0;
  }
  if (job.guide) {
    const guide = await sharp(path.resolve('scripts/cutout-guides', concept, `${job.source}.png`))
      .resize({ width, height, fit: 'fill' })
      .blur(2)
      .raw()
      .toBuffer({ resolveWithObject: true });
    // Anything the guide puts more than a pixel or two outside the product is not product.
    for (let i = 0; i < pixels; i += 1) if (guide.data[i * guide.info.channels] < 70) product[i] = 0;
  }
  const traced = job.add ? await drawn(job.add, width, height) : null;
  if (traced) for (const mask of traced) for (let i = 0; i < pixels; i += 1) if (mask[i] > 127) product[i] = 1;

  const background = reach(product, width, height, job.seeds ?? []);
  // Smooth the outline: blur the hard shape and take its half-way line. A straight edge stays where
  // it was; grain and single-pixel steps along it disappear.
  const hard = Buffer.alloc(pixels);
  for (let i = 0; i < pixels; i += 1) hard[i] = background[i] ? 0 : 255;
  const smooth = await blurred(hard, width, height, warm ? 9 : 1.2);
  let solid = new Uint8Array(pixels);
  for (let i = 0; i < pixels; i += 1) solid[i] = smooth[i] > 127 ? 1 : 0;
  if (warm) solid = await snap(file, solid, width, height);
  let rebuilt = null;
  if (job.rebuild) {
    const [full] = await drawn([job.rebuild], width, height);
    const visible = traced[0];
    const { behind, mirror } = job.rebuild;
    // What the board hides: below its top edge, everything right of the line; above it, only the
    // dark pixels of its rounded corner. Grown by two pixels to take in the board's soft edge.
    let hidden = new Uint8Array(pixels);
    for (let i = 0; i < pixels; i += 1) {
      if (full[i] <= 127) continue;
      const x = i % width;
      const y = (i - x) / width;
      const dark = light(soft[i * 3], soft[i * 3 + 1], soft[i * 3 + 2]) < 160;
      if (visible[i] <= 127 || (x >= behind.x && ((y >= behind.top && y <= behind.bottom) || dark))) hidden[i] = 1;
    }
    for (let pass = 0; pass < 2; pass += 1) {
      const grown = hidden.slice();
      for (let i = width; i < pixels - width; i += 1) {
        if (hidden[i] || full[i] <= 127 || i % width < behind.x - 1) continue;
        if (hidden[i - 1] || hidden[i + 1] || hidden[i - width] || hidden[i + width]) grown[i] = 1;
      }
      hidden = grown;
    }
    const paint = new Map();
    for (let y = 0; y < height; y += 1) {
      let left = -1;
      let right = -1;
      for (let x = 0; x < width; x += 1) {
        if (full[y * width + x] <= 127) continue;
        if (left < 0) left = x;
        right = x;
      }
      for (let x = left; left >= 0 && x <= right; x += 1) {
        const i = y * width + x;
        if (!hidden[i]) continue;
        // Near the rebuilt edge, the visible edge's bevel, carried round; elsewhere, the visible
        // face, mirrored.
        const fromEdge = right - x;
        const source = fromEdge < 12 ? left + fromEdge : 2 * mirror - x;
        paint.set(i, y * width + source);
      }
    }
    rebuilt = { full, paint, piece: job.rebuild.piece };
  }
  return { data, soft, width, height, solid, traced, rebuilt };
}

// A colour test alone puts the outline of a pale product within a few pixels of the truth, but it
// wanders, because the colour of a compressed photograph is blotchy. This settles it: near the
// rough outline, each pixel is compared with the typical colour just inside and just outside at that
// spot, and goes with whichever it is closer to.
async function snap(file, rough, width, height) {
  const pixels = width * height;
  const fine = await sharp(file).removeAlpha().blur(1).raw().toBuffer();
  const shape = Buffer.alloc(pixels);
  for (let i = 0; i < pixels; i += 1) shape[i] = rough[i] ? 255 : 0;
  const near = await blurred(shape, width, height, 5);
  const inner = Buffer.alloc(pixels);
  const outer = Buffer.alloc(pixels);
  for (let i = 0; i < pixels; i += 1) {
    inner[i] = near[i] > 240 ? 255 : 0;
    outer[i] = near[i] < 15 ? 255 : 0;
  }
  const SPREAD = 14;
  const insideWeight = await blurred(inner, width, height, SPREAD);
  const outsideWeight = await blurred(outer, width, height, SPREAD);
  const inside = [];
  const outside = [];
  for (let channel = 0; channel < 3; channel += 1) {
    const a = Buffer.alloc(pixels);
    const b = Buffer.alloc(pixels);
    for (let i = 0; i < pixels; i += 1) {
      a[i] = inner[i] ? fine[i * 3 + channel] : 0;
      b[i] = outer[i] ? fine[i * 3 + channel] : 0;
    }
    inside.push(await blurred(a, width, height, SPREAD));
    outside.push(await blurred(b, width, height, SPREAD));
  }
  const settled = Buffer.alloc(pixels);
  for (let i = 0; i < pixels; i += 1) {
    if (inner[i]) settled[i] = 255;
    else if (outer[i] || insideWeight[i] < 8 || outsideWeight[i] < 8) settled[i] = rough[i] && !outer[i] ? 255 : 0;
    else {
      let along = 0;
      let length = 0;
      for (let channel = 0; channel < 3; channel += 1) {
        const from = outside[channel][i] / outsideWeight[i];
        const to = inside[channel][i] / insideWeight[i];
        along += (fine[i * 3 + channel] / 255 - from) * (to - from);
        length += (to - from) * (to - from);
      }
      settled[i] = length > 0 && along / length > 0.5 ? 255 : 0;
      // Much darker than either: the shadow the product stands on.
      const here = light(fine[i * 3], fine[i * 3 + 1], fine[i * 3 + 2]);
      const least = Math.min(...[inside, outside].map((set, which) => light(set[0][i], set[1][i], set[2][i]) / (which ? outsideWeight[i] : insideWeight[i]))) * 255;
      if (here < least - 45) settled[i] = 0;
    }
  }
  const smooth = await blurred(settled, width, height, 4);
  const solid = new Uint8Array(pixels);
  for (let i = 0; i < pixels; i += 1) solid[i] = smooth[i] > 127 ? 1 : 0;
  return solid;
}

// How opaque each pixel is, for an outline pulled in from the true edge by `inset` pixels, so that
// no rim of backdrop is left on the product. The edge is one pixel soft.
const SOFT = 2;
const cumulative = (x) => 0.5 * (1 + Math.tanh(0.85 * x)); // close to the normal curve, and cheap
const opacity = (value, inset) => Math.min(1, Math.max(0, (value / 255 - cumulative(inset / SOFT)) * 4 + 0.5));

async function writePiece(image, keep, output, extras = {}) {
  const { data, soft, width, height } = image;
  let [x0, y0, x1, y1] = [width, height, 0, 0];
  const shape = Buffer.alloc(width * height);
  for (let i = 0; i < width * height; i += 1) {
    if (!keep(i)) continue;
    shape[i] = 255;
    const x = i % width;
    const y = (i - x) / width;
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  if (x1 < x0) return null;
  const pad = 6;
  x0 = Math.max(0, x0 - pad);
  y0 = Math.max(0, y0 - pad);
  x1 = Math.min(width - 1, x1 + pad);
  y1 = Math.min(height - 1, y1 + pad);
  const box = { width: x1 - x0 + 1, height: y1 - y0 + 1 };
  const edge = await blurred(shape, width, height, SOFT);

  // Colour for the feathered rim is taken from just inside the product, not from the photograph,
  // where rim pixels are part backdrop. Known colour is spread outwards a pixel at a time.
  const count = box.width * box.height;
  const colour = new Float32Array(count * 3);
  let known = new Uint8Array(count);
  for (let y = 0; y < box.height; y += 1) {
    for (let x = 0; x < box.width; x += 1) {
      const from = (y + y0) * width + x + x0;
      const to = y * box.width + x;
      colour[to * 3] = data[from * 3];
      colour[to * 3 + 1] = data[from * 3 + 1];
      colour[to * 3 + 2] = data[from * 3 + 2];
      known[to] = edge[from] > 255 * cumulative(2.5 / SOFT) ? 1 : 0;
      const painted = extras.paint?.get(from);
      if (painted !== undefined) {
        colour[to * 3] = data[painted * 3];
        colour[to * 3 + 1] = data[painted * 3 + 1];
        colour[to * 3 + 2] = data[painted * 3 + 2];
      }
    }
  }
  for (let pass = 0; pass < 6; pass += 1) {
    const next = known.slice();
    for (let y = 1; y < box.height - 1; y += 1) {
      for (let x = 1; x < box.width - 1; x += 1) {
        const at = y * box.width + x;
        if (known[at]) continue;
        let [r, g, b, n] = [0, 0, 0, 0];
        for (const step of [-1, 1, -box.width, box.width, -box.width - 1, -box.width + 1, box.width - 1, box.width + 1]) {
          if (!known[at + step]) continue;
          r += colour[(at + step) * 3];
          g += colour[(at + step) * 3 + 1];
          b += colour[(at + step) * 3 + 2];
          n += 1;
        }
        if (!n) continue;
        colour[at * 3] = r / n;
        colour[at * 3 + 1] = g / n;
        colour[at * 3 + 2] = b / n;
        next[at] = 1;
      }
    }
    known = next;
  }

  // For a case on a phone: the phone itself (the dark camera block and everything inside it) is
  // left out of the re-colouring layer.
  let material = null;
  if (extras.shade && extras.phone) {
    const dark = new Uint8Array(width * height);
    for (let i = 0; i < width * height; i += 1) {
      dark[i] = shape[i] && light(soft[i * 3], soft[i * 3 + 1], soft[i * 3 + 2]) < 120 ? 1 : 0;
    }
    const { label, blobs } = findBlobs(dark, width, height, 1);
    const largest = blobs.reduce((a, b) => (b.area > a.area ? b : a));
    const block = new Uint8Array(width * height);
    for (let i = 0; i < width * height; i += 1) block[i] = label[i] === largest.id ? 1 : 0;
    const outside = reach(block, width, height, []);
    const hard = Buffer.alloc(width * height);
    for (let i = 0; i < width * height; i += 1) hard[i] = outside[i] ? 255 : 0;
    // Spread a couple of pixels over the dark block, so the pale inner edge of the lip is coloured
    // too. Colouring a little of the block is harmless: dark stays dark.
    const spread = await blurred(hard, width, height, 2);
    material = Buffer.alloc(width * height);
    for (let i = 0; i < width * height; i += 1) material[i] = Math.min(255, spread[i] * 2.5);
  }

  const rgba = Buffer.alloc(count * 4);
  const shade = extras.shade ? Buffer.alloc(count * 4) : null;
  for (let y = 0; y < box.height; y += 1) {
    for (let x = 0; x < box.width; x += 1) {
      const from = (y + y0) * width + x + x0;
      const to = y * box.width + x;
      const [r, g, b] = [colour[to * 3], colour[to * 3 + 1], colour[to * 3 + 2]];
      rgba[to * 4] = Math.round(r);
      rgba[to * 4 + 1] = Math.round(g);
      rgba[to * 4 + 2] = Math.round(b);
      // Under a re-colouring layer the photograph is drawn a pixel smaller, so that none of its
      // off-white shows around a dark colour.
      rgba[to * 4 + 3] = Math.round(opacity(edge[from], shade ? 1.9 : 0.8) * 255);
      if (shade) {
        shade.fill(Math.min(255, Math.round((light(r, g, b) / CASE_LIGHT) * 255)), to * 4, to * 4 + 3);
        shade[to * 4 + 3] = Math.round(opacity(edge[from], 0.8) * (material ? material[from] : 255));
      }
    }
  }
  const size = { raw: { width: box.width, height: box.height, channels: 4 } };
  await sharp(rgba, size).webp({ quality: 88, alphaQuality: 100 }).toFile(output);
  if (shade) await sharp(shade, size).webp({ quality: 86, alphaQuality: 100 }).toFile(extras.shade);
  return { x: x0 / width, y: y0 / height, w: box.width / width, h: box.height / height, ratio: box.width / box.height };
}

const concept = process.argv[2];
if (!JOBS[concept]) {
  console.error(`Usage: node scripts/cutout-photos.mjs <${Object.keys(JOBS).join('|')}>`);
  process.exit(1);
}

const from = path.resolve('photo-originals', concept);
const dir = path.resolve('src/concepts', concept, 'photos');
const manifest = {};

for (const job of JOBS[concept]) {
  const image = await findProduct(path.join(from, `${job.source}.jpg`), job);
  const { width, height, solid, soft, traced, rebuilt } = image;
  const { label, blobs } = findBlobs(solid, width, height, width * height * 0.002);
  const wanted = new Set(blobs.map((blob) => blob.id));
  const kept = (i) => solid[i] && wanted.has(label[i]);

  let keeps;
  if (job.pieces === 'blobs') {
    keeps = blobs.slice(0, job.names.length).map((blob) => (i) => label[i] === blob.id);
  } else if (job.pieces === 'cuts') {
    const edges = [0, ...job.cuts, 1].map((cut) => Math.round(cut * width));
    // A traced outline belongs to its own piece, even across a cut. A 'pale' one only where it is
    // pale: the dark part in front of it keeps its own edge.
    const tracedPiece = (i) => {
      for (const [n, shape] of (job.add ?? []).entries()) {
        if (traced[n][i] <= 127) continue;
        if (shape.pale && light(soft[i * 3], soft[i * 3 + 1], soft[i * 3 + 2]) <= 140) continue;
        return shape.piece;
      }
      return -1;
    };
    keeps = job.names.map((_, index) => (i) => {
      if (rebuilt && index === rebuilt.piece && rebuilt.full[i] > 127) return true;
      if (!kept(i)) return false;
      const piece = tracedPiece(i);
      if (piece >= 0) return index === piece;
      return i % width >= edges[index] && i % width < edges[index + 1];
    });
  } else {
    keeps = [kept];
  }

  for (const [index, name] of job.names.entries()) {
    const extras = {
      shade: job.shade ? path.join(dir, `${name}-shade.webp`) : null,
      phone: job.phone,
      paint: image.rebuilt && index === image.rebuilt.piece ? image.rebuilt.paint : null,
    };
    const box = keeps[index] ? await writePiece(image, keeps[index], path.join(dir, `${name}-cut.webp`), extras) : null;
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
