/**
 * Sync property images from Images/<City>/<Property>/ → public/assets/<slug>/
 *
 * Convention:
 *   - Folder name = property (case-insensitive matched to a slug)
 *   - Hero image  = filename contains "main" (case-insensitive). Else first
 *                   alphabetically.
 *   - Gallery     = everything else, alphabetical
 *
 * Each image is resized to fit within 1800×1800 (no upscale), re-encoded
 * as JPEG q82 with mozjpeg. Output named 01-main.jpg, 02.jpg, 03.jpg, …
 *
 * Replace mode: wipes public/assets/<slug>/ before writing.
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC  = path.join(ROOT, 'Images');
const DST  = path.join(ROOT, 'public', 'assets');

// Map a folder name (e.g. "Royal 10746" / "Cielo & Greyson") to the slug
// used in lib/data.ts. Lower-case, kebab, with the explicit special cases
// from the asset list.
const SLUG_OVERRIDES = {
  '10126-154': 'ten-one-26-154',
  'cielo & greyson': 'cielo-greyson',
  'cielo and greyson': 'cielo-greyson',
};
function toSlug(name) {
  const lower = name.trim().toLowerCase();
  if (SLUG_OVERRIDES[lower]) return SLUG_OVERRIDES[lower];
  return lower
    .replace(/[&]/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const IMG_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.heic']);

async function syncProperty(slug, srcDir) {
  const files = (await fs.readdir(srcDir, { withFileTypes: true }))
    .filter((d) => d.isFile() && IMG_EXT.has(path.extname(d.name).toLowerCase()))
    .map((d) => d.name);
  if (files.length === 0) {
    console.log(`  - ${slug}  (no images, skipping)`);
    return null;
  }

  // Pick hero — filenames containing "main" or "exterior" become the hero.
  // If the folder has a single image, that image is the hero (covers the
  // case where the source file is just a screenshot or a one-off shot).
  // Otherwise no hero — every file is gallery.
  const heroIdx = files.findIndex((f) => /(main|exterior)/i.test(f));
  const hero = heroIdx >= 0
    ? files[heroIdx]
    : (files.length === 1 ? files[0] : null);
  const rest = files.filter((f) => f !== hero).sort();
  const ordered = hero ? [hero, ...rest] : rest;

  const outDir = path.join(DST, slug);
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });

  const outputs = [];
  for (let i = 0; i < ordered.length; i++) {
    const inPath = path.join(srcDir, ordered[i]);
    const outName = i === 0 && hero
      ? '01-main.jpg'
      : `${String(i + 1).padStart(2, '0')}.jpg`;
    const outPath = path.join(outDir, outName);
    await sharp(inPath, { failOn: 'none' })
      .rotate() // honour EXIF orientation
      .resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true, progressive: true })
      .toFile(outPath);
    const { size } = await fs.stat(outPath);
    outputs.push({ name: outName, kb: Math.round(size / 1024) });
  }

  console.log(`  ✓ ${slug}  (${outputs.length} images${hero ? '' : ', gallery only'})`);
  outputs.forEach((o) => console.log(`      ${o.name.padEnd(12)} ${o.kb} KB`));

  return hero
    ? {
        slug,
        hero: `/assets/${slug}/01-main.jpg`,
        gallery: outputs.slice(1).map((o) => `/assets/${slug}/${o.name}`),
      }
    : {
        slug,
        gallery: outputs.map((o) => `/assets/${slug}/${o.name}`),
      };
}

const cityDirs = (await fs.readdir(SRC, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((n) => !['brand', 'cities'].includes(n.toLowerCase()));

console.log(`Found ${cityDirs.length} city folder(s) in Images/`);
const manifest = [];

for (const city of cityDirs) {
  console.log(`\n[${city}]`);
  const cityPath = path.join(SRC, city);
  const propDirs = (await fs.readdir(cityPath, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  for (const prop of propDirs) {
    const slug = toSlug(prop);
    const result = await syncProperty(slug, path.join(cityPath, prop));
    if (result) manifest.push({ city: city.toLowerCase(), ...result });
  }
}

await fs.mkdir(DST, { recursive: true });
await fs.writeFile(
  path.join(DST, 'image-manifest.json'),
  JSON.stringify(manifest, null, 2)
);
console.log(`\nWrote manifest: public/assets/image-manifest.json (${manifest.length} entries)`);
