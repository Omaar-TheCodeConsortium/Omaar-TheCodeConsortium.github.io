// Checks every concept palette against the WCAG AA contrast minimum for body text (4.5:1).
// Run with `npm run check:contrast` after changing a palette in src/concepts/registry.js.

import { CONCEPTS } from '../src/concepts/registry.js';

const MINIMUM = 4.5;

const channel = (value) => {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const luminance = (hex) => {
  const [r, g, b] = rgb(hex).map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
// Mirrors --c-muted in src/concepts/concepts.css: 72% ink mixed into the paper colour.
const mix = (a, b, share) => {
  const [x, y] = [rgb(a), rgb(b)];
  return `#${x.map((v, i) => Math.round(v * share + y[i] * (1 - share)).toString(16).padStart(2, '0')).join('')}`;
};

let failures = 0;

for (const concept of CONCEPTS) {
  const { paper, ink, loud, onLoud } = concept.palette;
  const pairs = [
    ['ink on paper', ink, paper],
    ['muted on paper', mix(ink, paper, 0.72), paper],
    ['text on loud', onLoud, loud],
  ];
  for (const [label, fg, bg] of pairs) {
    const ratio = contrast(fg, bg);
    const pass = ratio >= MINIMUM;
    if (!pass) failures += 1;
    console.log(`${pass ? 'pass' : 'FAIL'}  ${ratio.toFixed(2).padStart(5)}:1  ${concept.name.padEnd(22)} ${label}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} colour pair(s) fall below ${MINIMUM}:1`);
  process.exit(1);
}
