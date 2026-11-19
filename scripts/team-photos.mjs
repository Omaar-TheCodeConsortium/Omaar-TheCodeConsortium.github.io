// Founder portraits: the three photos from the November 2026 shoot (photo-originals/team/<name>-2.jpg),
// framed alike already, trimmed to 3:4 and given a faint TCC_ print on the T-shirt.
// Colours are left as photographed apart from the print.
// Run: node scripts/team-photos.mjs   Writes public/team/<name>.webp.
//
// The print is made to sit in the fabric rather than on top of it: it is light grey at low strength,
// darkens where the shirt is in shadow, carries the shirt's own creases and weave, and has a little
// grain, like a worn screen print.
import sharp from 'sharp';

const OUT = { width: 600, height: 800 };
const SOURCE = { width: 1493, height: 1991 }; // the originals are 1493 × 2000; 3:4 needs 9 px off the bottom
// Where the print sits on each shirt, in original pixels: its centre, its top edge and its width.
const PRINT = {
  bhagya: { x: 731, top: 1690, width: 330 },
  omaar: { x: 761, top: 1640, width: 330 },
  manuka: { x: 753, top: 1700, width: 330 },
};
const INK = [188, 188, 186]; // light grey
const STRENGTH = 0.3; // how much of the ink shows over the black shirt

// The TCC_ letters from the logo, as a mask the width of the print.
async function letters(width) {
  const { data, info } = await sharp('public/logo.png')
    .greyscale()
    .threshold(200)
    .trim({ threshold: 10 })
    .resize({ width })
    .blur(0.6)
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

// A repeatable pseudo-random number per pixel, for the print's grain.
const grain = (x, y) => {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
};

async function portrait(name) {
  const file = `photo-originals/team/${name}-2.jpg`;
  const base = sharp(file).extract({ left: 0, top: 0, ...SOURCE });
  const { data: rgb } = await base.clone().removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { data: lum } = await base.clone().greyscale().raw().toBuffer({ resolveWithObject: true });
  const { data: soft } = await base.clone().greyscale().blur(14).raw().toBuffer({ resolveWithObject: true });

  const place = PRINT[name];
  const mask = await letters(place.width);
  const left = Math.round(place.x - mask.width / 2);
  const top = place.top;

  // The shirt's typical brightness under the print, so shading is measured against it.
  const under = [];
  for (let y = 0; y < mask.height; y += 3) for (let x = 0; x < mask.width; x += 3) under.push(soft[(top + y) * SOURCE.width + left + x]);
  under.sort((a, b) => a - b);
  const typical = Math.max(1, under[Math.floor(under.length / 2)]);

  for (let y = 0; y < mask.height; y += 1) {
    for (let x = 0; x < mask.width; x += 1) {
      const m = mask.data[y * mask.width + x] / 255;
      if (m === 0) continue;
      const px = left + x;
      const py = top + y;
      const i = py * SOURCE.width + px;
      const shade = Math.min(1.35, Math.max(0.5, soft[i] / typical));
      const weave = (lum[i] - soft[i]) * 1.4;
      const alpha = m * STRENGTH * (0.82 + 0.3 * grain(px, py));
      for (let c = 0; c < 3; c += 1) {
        const ink = INK[c] * shade + weave;
        rgb[i * 3 + c] = Math.round(Math.min(255, Math.max(0, rgb[i * 3 + c] * (1 - alpha) + ink * alpha)));
      }
    }
  }

  await sharp(rgb, { raw: { ...SOURCE, channels: 3 } })
    .resize(OUT.width, OUT.height)
    .webp({ quality: 82 })
    .toFile(`public/team/${name}.webp`);
}

for (const name of Object.keys(PRINT)) await portrait(name);
