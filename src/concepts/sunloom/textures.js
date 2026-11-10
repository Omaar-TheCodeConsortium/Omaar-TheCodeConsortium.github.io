// Linen, drawn in code. Each texture is a small tileable SVG of stretched noise, used as a CSS
// background over a dye colour: one layer of warp threads, one of weft, one of fine grain.
// They stand in wherever a photograph has not been supplied yet.

const SIZE = 420;

const tile = (inner) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${SIZE}' height='${SIZE}'>${inner}</svg>`,
  )}")`;

// Noise stretched along one axis reads as thread. `rgb` picks dark (shadow) or light (highlight) threads.
const threads = ({ fx, fy, seed, gain, bias, rgb = 0, octaves = 3 }) =>
  tile(
    `<filter id='f' x='0' y='0' width='100%' height='100%'>` +
      `<feTurbulence type='fractalNoise' baseFrequency='${fx} ${fy}' numOctaves='${octaves}' seed='${seed}' stitchTiles='stitch'/>` +
      `<feColorMatrix values='0 0 0 0 ${rgb}  0 0 0 0 ${rgb}  0 0 0 0 ${rgb}  0 0 0 ${gain} ${bias}'/>` +
      `</filter><rect width='100%' height='100%' filter='url(#f)'/>`,
  );

export const TEXTURES = {
  '--sl-warp': threads({ fx: 0.9, fy: 0.012, seed: 3, gain: -2.1, bias: 1.08 }),
  '--sl-weft': threads({ fx: 0.012, fy: 0.9, seed: 11, gain: -2.1, bias: 1.08 }),
  '--sl-slub': threads({ fx: 0.014, fy: 0.7, seed: 23, gain: 2.6, bias: -1.56, rgb: 1, octaves: 2 }),
  '--sl-grain': threads({ fx: 1.1, fy: 1.1, seed: 7, gain: -1.3, bias: 0.74, octaves: 2 }),
};
