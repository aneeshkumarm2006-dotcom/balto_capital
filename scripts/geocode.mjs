/**
 * Geocode every Balto residence via OpenStreetMap Nominatim.
 *
 * Nominatim's public endpoint has a 1 req/sec ceiling and a required
 * User-Agent. We sleep 1.1s between requests and identify ourselves.
 * Output is printed as a TS literal you can paste into lib/data.ts.
 */
import fs from 'node:fs/promises';

const ADDRESSES = [
  { slug: 'woodridge',        addr: '10139 158 Street NW, Edmonton, AB, Canada' },
  { slug: 'palisades',        addr: '10825 113 Street NW, Edmonton, AB, Canada' },
  { slug: 'hamlet',           addr: '11647 124 Street NW, Edmonton, AB, Canada' },
  { slug: 'copper-manor',     addr: '13011 83 Street NW, Edmonton, AB, Canada' },
  { slug: 'kafa',             addr: '12717 119 Street NW, Edmonton, AB, Canada' },
  { slug: 'royal-lady',       addr: '10746 102 Street NW, Edmonton, AB, Canada' },
  { slug: 'catalina-estates', addr: '5910 118 Avenue NW, Edmonton, AB, Canada' },
  { slug: 'layali',           addr: '13710 64 Street NW, Edmonton, AB, Canada' },
  { slug: 'sky-manor',        addr: '9612 156 Street NW, Edmonton, AB, Canada' },
  { slug: 'grandview-manor',  addr: '11705 83 Street NW, Edmonton, AB, Canada' },
  { slug: 'cedar-manor',      addr: '12040 82 Street NW, Edmonton, AB, Canada' },
  { slug: 'courts-manor',     addr: '12239 82 Street NW, Edmonton, AB, Canada' },
  { slug: 'oakwood-manor',    addr: '11348 97 Street NW, Edmonton, AB, Canada' },
  { slug: 'royal-manor',      addr: '10215 108 Avenue NW, Edmonton, AB, Canada' },
  { slug: 'balwin-manor',     addr: '6704 131A Avenue NW, Edmonton, AB, Canada' },
  { slug: 'acadian',          addr: '11535 124 Street NW, Edmonton, AB, Canada' },
  { slug: 'parkdale',         addr: '8021 115 Avenue NW, Edmonton, AB, Canada' },
  { slug: 'beverly',          addr: '11312 34 Street NW, Edmonton, AB, Canada' },
  { slug: 'strathearn',       addr: '9510 85 Street NW, Edmonton, AB, Canada' },
  { slug: 'pioneer',          addr: '12929 127 Street NW, Edmonton, AB, Canada' },
  { slug: 'rivergate',        addr: '11040 82 Street NW, Edmonton, AB, Canada' },
  { slug: 'arbour-green',     addr: '12036 66 Street NW, Edmonton, AB, Canada' },
  { slug: 'ten-one-26-154',   addr: '10126 154 Street NW, Edmonton, AB, Canada' },
  { slug: 'britnell-landing', addr: '16255 51 Street NW, Edmonton, AB, Canada' },
  { slug: 'edge',             addr: '3005 James Mowatt Trail SW, Edmonton, AB, Canada' },
  { slug: 'cielo-greyson',    addr: '235 Willis Crescent, Saskatoon, SK, Canada' },
  { slug: 'lawson',           addr: '192 Pinehouse Drive, Saskatoon, SK, Canada' },
  { slug: 'lockwood',         addr: '193 Lockwood Road, Regina, SK, Canada' },
];

const UA = 'BaltoCapital-Geocode/1.0 (https://baltocapital.com)';

async function geocode(addr) {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(addr)}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;
  return { lat: Number(data[0].lat), lng: Number(data[0].lon) };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const out = {};
let okCount = 0;
let missCount = 0;
for (const { slug, addr } of ADDRESSES) {
  try {
    const r = await geocode(addr);
    if (r) {
      out[slug] = r;
      okCount++;
      console.log(`✓ ${slug.padEnd(20)} ${r.lat.toFixed(5)}, ${r.lng.toFixed(5)}`);
    } else {
      missCount++;
      console.log(`✗ ${slug.padEnd(20)} no match for "${addr}"`);
    }
  } catch (e) {
    missCount++;
    console.log(`✗ ${slug.padEnd(20)} error: ${e.message}`);
  }
  await sleep(1100); // be polite
}

console.log(`\n${okCount} matched, ${missCount} missed`);

const tsLines = Object.entries(out)
  .map(([slug, c]) => `  '${slug}': { lat: ${c.lat.toFixed(5)}, lng: ${c.lng.toFixed(5)} },`);
const ts = `const GEOCODED: Record<string, { lat: number; lng: number }> = {\n${tsLines.join('\n')}\n};\n`;
await fs.writeFile('scripts/geocoded.ts', ts);
await fs.writeFile('scripts/geocoded.json', JSON.stringify(out, null, 2));
console.log(`\nWrote scripts/geocoded.ts and scripts/geocoded.json`);
