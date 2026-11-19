// Founder portraits: crop each original in photo-originals/team/ to the same framing (4:5, eyes at the
// same height, faces the same size, centred on the nose), then colour-match them so they read as one set.
// Run: node scripts/team-photos.mjs   Writes public/team/<name>.webp.
import sharp from 'sharp';

const OUT = { width: 640, height: 800 };
const CROPS = {
  bhagya: { left: 491, top: 232, width: 622, height: 778 },
  omaar: { left: 166, top: 231, width: 1142, height: 1428 },
  manuka: { left: 0, top: 40, width: 1493, height: 1866 },
};
// The lit skin used to measure each portrait's colour, in output pixels.
const FACE = { left: 200, top: 300, width: 240, height: 240 };

async function crop(name) {
  return sharp(`photo-originals/team/${name}.jpg`).extract(CROPS[name]).resize(OUT.width, OUT.height).removeAlpha().raw().toBuffer();
}

// Mean colour of the lit skin: the brighter pixels in the face box, so shadow does not count.
function skin(buffer) {
  const pixels = [];
  for (let y = FACE.top; y < FACE.top + FACE.height; y += 2) {
    for (let x = FACE.left; x < FACE.left + FACE.width; x += 2) {
      const i = (y * OUT.width + x) * 3;
      pixels.push([buffer[i], buffer[i + 1], buffer[i + 2]]);
    }
  }
  pixels.sort((a, b) => b[0] + b[1] + b[2] - (a[0] + a[1] + a[2]));
  const lit = pixels.slice(0, Math.floor(pixels.length * 0.35));
  return [0, 1, 2].map((c) => lit.reduce((sum, p) => sum + p[c], 0) / lit.length);
}

// Mean colour of the backdrop, from the top corners.
function backdrop(buffer) {
  const sum = [0, 0, 0];
  let n = 0;
  for (let y = 10; y < 160; y += 2) {
    for (const x0 of [10, OUT.width - 90]) {
      for (let x = x0; x < x0 + 80; x += 2) {
        const i = (y * OUT.width + x) * 3;
        for (let c = 0; c < 3; c += 1) sum[c] += buffer[i + c];
        n += 1;
      }
    }
  }
  return sum.map((v) => v / n);
}

const names = Object.keys(CROPS);
const buffers = Object.fromEntries(await Promise.all(names.map(async (name) => [name, await crop(name)])));
const means = Object.fromEntries(names.map((name) => [name, skin(buffers[name])]));
const target = [0, 1, 2].map((c) => names.reduce((sum, name) => sum + means[name][c], 0) / names.length);
const backs = Object.fromEntries(names.map((name) => [name, backdrop(buffers[name])]));
const lightest = [0, 1, 2].map((c) => Math.max(...names.map((name) => backs[name][c])));

for (const name of names) {
  // Move each portrait two thirds of the way to the shared skin colour; all the way looks painted.
  const gains = target.map((t, c) => 1 + ((t / means[name][c]) - 1) * 0.67);
  // Lift a near-black backdrop part of the way towards the charcoal of the others.
  const lift = lightest.map((l, c) => Math.max(0, (l - backs[name][c] * gains[c]) * 0.6));
  await sharp(buffers[name], { raw: { ...OUT, channels: 3 } })
    .linear(gains, lift)
    .webp({ quality: 80 })
    .toFile(`public/team/${name}.webp`);
  console.log(name, 'gains', gains.map((g) => g.toFixed(2)).join(','), 'lift', lift.map(Math.round).join(','));
}
