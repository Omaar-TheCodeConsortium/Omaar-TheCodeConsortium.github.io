// Founder portraits: crop each original in photo-originals/team/ to the same framing (3:4, eyes at the
// same height, faces the same size, centred on the nose). Colours are left exactly as photographed.
// Manuka's photo is the widest framing available, so it sets the size the others match.
// Run: node scripts/team-photos.mjs   Writes public/team/<name>.webp.
import sharp from 'sharp';

const OUT = { width: 600, height: 800 };
const CROPS = {
  bhagya: { left: 478, top: 192, width: 647, height: 863 },
  omaar: { left: 143, top: 158, width: 1187, height: 1583 },
  manuka: { left: 0, top: 4, width: 1493, height: 1991 },
};

// Photos used exactly as supplied, with no crop. Bhagya's is on trial (2026-11-19); delete the
// entry to go back to the matched crop above.
const AS_IS = { bhagya: 'bhagya-uncropped.png' };

for (const [name, crop] of Object.entries(CROPS)) {
  const image = AS_IS[name] ? sharp(`photo-originals/team/${AS_IS[name]}`) : sharp(`photo-originals/team/${name}.jpg`).extract(crop).resize(OUT.width, OUT.height);
  await image.webp({ quality: 80 }).toFile(`public/team/${name}.webp`);
}
