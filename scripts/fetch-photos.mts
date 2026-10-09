// Downloads every photo listed in lib/photo-sources.ts from Unsplash once and
// writes resized WebP variants to public/photos/<key>-<width>.webp.
// Usage: npm run photos   (add --force to re-download existing files)
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import sharp from "sharp";
import { PHOTO_WIDTHS, photoSources } from "../lib/photo-sources";

const outDir = "public/photos";
const force = process.argv.includes("--force");

await mkdir(outDir, { recursive: true });

for (const [key, id] of Object.entries(photoSources)) {
  const largest = `${outDir}/${key}-${Math.max(...PHOTO_WIDTHS)}.webp`;
  if (existsSync(largest) && !force) {
    console.log(`skip ${key}`);
    continue;
  }
  const res = await fetch(`https://images.unsplash.com/${id}?w=2000&q=90&fm=jpg`);
  if (!res.ok) throw new Error(`${key}: HTTP ${res.status}`);
  const original = Buffer.from(await res.arrayBuffer());
  for (const width of PHOTO_WIDTHS) {
    await sharp(original)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: width <= 640 ? 70 : 74, effort: 6 })
      .toFile(`${outDir}/${key}-${width}.webp`);
  }
  console.log(`saved ${key}`);
}
