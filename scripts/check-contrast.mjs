// Checks WCAG 2.x contrast for the colour tokens in src/app/globals.css.
// Run: npm run check:contrast   (exits non-zero if a required pair fails)
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const token = (name) => {
  const m = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`token --${name} not found`);
  return m[1];
};
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

// [foreground, background, minimum] — 4.5 for body text, 3 for large text / UI parts.
const pairs = [
  ["text", "bg", 4.5], ["text", "surface", 4.5], ["text", "surface-2", 4.5],
  ["muted", "bg", 4.5], ["muted", "surface", 4.5], ["muted", "surface-2", 4.5],
  ["faint", "bg", 4.5], ["faint", "surface", 4.5],
  ["display-muted", "bg", 3], ["display-muted", "surface", 3], // large display text only
  ["accent", "bg", 4.5], ["accent", "surface", 4.5],
  ["amber", "bg", 4.5], ["amber", "surface", 4.5],
  ["rose", "bg", 4.5], ["rose", "surface", 4.5],
  ["pass", "bg", 4.5], ["pass", "surface", 4.5],
  ["cream", "ink", 4.5], ["cream-muted", "ink", 4.5], ["cream-muted", "ink-2", 4.5],
  ["cream", "accent", 4.5], ["ink", "accent-bright", 4.5], ["accent-ink", "accent", 4.5],
  ["line-strong", "bg", 1.5],
];

let failed = 0;
for (const [fg, bg, min] of pairs) {
  const r = ratio(token(fg), token(bg));
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${fg.padEnd(12)} on ${bg.padEnd(10)} ${r.toFixed(2)}:1  (min ${min})`);
}
process.exit(failed ? 1 : 0);
