const IMG = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=85&auto=format&fit=crop`;

export const IMAGES = {
  heritage1: IMG('1486325212027-8081e485255e'),
  heritage2: IMG('1449034446853-66c86144b0ad'),
  heritage3: IMG('1518780664697-55e3ad937233'),
  heritage4: IMG('1494526585095-c41746248156'),
  modern1:   IMG('1512917774080-9991f1c4c750'),
  modern2:   IMG('1564013799919-ab600027ffc6'),
  modern3:   IMG('1480074568708-e7b720bb3f09'),
  modern4:   IMG('1502005229762-cf1b2da7c5d6'),
  int_living1:  IMG('1600596542815-ffad4c1539a9'),
  int_living2:  IMG('1600607687939-ce8a6c25118c'),
  int_living3:  IMG('1505691938895-1758d7feb511'),
  int_kitchen1: IMG('1600210492486-724fe5c67fb0'),
  int_kitchen2: IMG('1600210491892-03d54c0aaf87'),
  int_bed1:     IMG('1556909114-f6e7ad7d3136'),
  int_bed2:     IMG('1540518614846-7eded433c457'),
  int_bath1:    IMG('1600585154340-be6161a56a0c'),
  int_bath2:    IMG('1552321554-5fefe8c9ef14'),
  int_dining1:  IMG('1502672260266-1c1ef2d93688'),
  int_detail1:  IMG('1560448204-e02f11c3d0e2'),
  int_detail2:  IMG('1493809842364-78817add7ffb'),
  portrait1: IMG('1507003211169-0a1dd7228f2d', 800),
  portrait2: IMG('1573497019940-1c28c88b4f3e', 800),
  portrait3: IMG('1494790108377-be9c29b29330', 800),
  portrait4: IMG('1500648767791-00dcc994a43e', 800),
  detail_brick: IMG('1487958449943-2429e8be8625'),
  detail_door:  IMG('1469022563428-aa04fef9f5a2'),
  detail_arch:  IMG('1430285561322-7808604715df'),
  ext_apartment1: IMG('1502672023488-70e25813eb80'),
  ext_apartment2: IMG('1416331108676-a22ccb276e35'),
  ext_apartment3: IMG('1448630360428-65456885c650'),
  ext_apartment4: IMG('1542621334-a254cf47733d'),
  ext_apartment5: IMG('1460317442991-0ec209397118'),
  ext_apartment6: IMG('1494522855154-9297ac14b55f'),
} as const;

export type CitySlug = 'saskatoon' | 'edmonton' | 'regina' | 'yellowknife';

export interface City {
  slug: CitySlug;
  label: string;
  province: string;
  image: string;
  blurb: string;
  bounds: { minLng: number; maxLng: number; minLat: number; maxLat: number };
  /** Market is announced but not yet live, render as register-interest, not listings. */
  comingSoon?: boolean;
}

export const CITIES: Record<CitySlug, City> = {
  saskatoon: {
    slug: 'saskatoon',
    label: 'Saskatoon',
    province: 'Saskatchewan',
    image: '/assets/city-saskatoon.png',
    blurb: 'Contemporary residences in Saskatoon’s sought-after south end and convenient north end.',
    bounds: { minLng: -106.685, maxLng: -106.620, minLat: 52.115, maxLat: 52.150 },
  },
  edmonton: {
    slug: 'edmonton',
    label: 'Edmonton',
    province: 'Alberta',
    image: '/assets/city-edmonton.png',
    blurb: 'The heart of the portfolio, renovated, updated residences across Edmonton’s most livable neighbourhoods, with local management in every building.',
    bounds: { minLng: -113.555, maxLng: -113.470, minLat: 53.520, maxLat: 53.560 },
  },
  regina: {
    slug: 'regina',
    label: 'Regina',
    province: 'Saskatchewan',
    image: '/assets/city-regina.png',
    blurb: 'A quiet, well-connected residence in southeast Regina near the University of Regina and Wascana Centre.',
    bounds: { minLng: -104.640, maxLng: -104.580, minLat: 50.430, maxLat: 50.460 },
  },
  yellowknife: {
    slug: 'yellowknife',
    label: 'Yellowknife',
    province: 'Northwest Territories',
    image: '/assets/city-yellowknife.avif',
    blurb: 'Aurora-touched, lakeside, gold-quiet, the capital of the Northwest Territories, where Great Slave Lake meets the long Northern night.',
    bounds: { minLng: -114.420, maxLng: -114.330, minLat: 62.430, maxLat: 62.475 },
    comingSoon: true,
  },
};

export type Availability = 'available' | 'coming-soon';

/** Description voice per the Build Spec: value-add buildings lead with
 *  renovations + security; newer lead with finishes; premium fully elevated. */
export type Tier = 'value-add' | 'newer' | 'premium' | 'coming-soon';

export interface Residence {
  id: string;
  slug: string;
  name: string;
  city: CitySlug;
  cityLabel: string;
  address: string;
  coordinates: { lat: number; lng: number };
  description: string;
  longDescription: string;
  bedrooms: string;
  bedroomOptions: number[];
  /** Monthly rent by bedroom count. Keys: 0=Studio, 1..3=Bedroom count. */
  prices: Partial<Record<0 | 1 | 2 | 3, number>>;
  /** Minimum across `prices`, used on cards / "From $X/mo" labels. */
  priceFrom: number;
  /** Promotional banner text, e.g. "Up to 2 months free on a 12-month lease". */
  promo?: string;
  availability: Availability;
  featured: boolean;
  /** Build Spec neighbourhood label (shown as the property-page tag). */
  neighbourhood?: string;
  /** Description tier, drives the condition voice on the property page. */
  tier?: Tier;
  heroImage: string;
  gallery: string[];
  features: string[];
  amenities: string[];
  nearbyPoints: string[];
  /** Per-asset alternate views (currently only Palisades uses these). */
  hideDetailGallery?: boolean;
  incentives?: string[];
  unitLabels?: string[];
  /** Real available units from the client's availability sheet. When present,
   *  these drive the "Available suites" table and the building's pricing. */
  units?: Unit[];
}

/** A single available unit from the availability sheet. */
export interface Unit {
  unit: string;
  type: string;
  rent: number;
}

/** Non-renovated base rate card, applies to every property except Woodridge
 *  (across all cities). Studio / 1BR / 2BR / 3BR. */
const NON_RENOVATED_RATES: Record<0 | 1 | 2 | 3, number> = {
  0: 1100, 1: 1300, 2: 1500, 3: 1600,
};

/** Woodridge (Westpark Living) keeps its own (renovated-tier) base card. */
const WOODRIDGE_RATES: Record<0 | 1 | 2 | 3, number> = {
  0: 1150, 1: 1350, 2: 1550, 3: 1700,
};

/** Promotional offer (client, 2026): up to N months free on a 12-month lease.
 *  Default is 2 months; three buildings run a 1-month promo. Advertised rent is
 *  net effective over the 12-month term — base × (12 - free) / 12.
 *  e.g. $1,300 × 10/12 = $1,083 (2 free); × 11/12 = $1,191 (1 free). */
const LEASE_MONTHS = 12;
const REDUCED_PROMO_SLUGS = new Set(['royal-manor', 'royal-lady', 'woodridge']);
const freeMonthsFor = (slug: string): number =>
  REDUCED_PROMO_SLUGS.has(slug) ? 1 : 2;
const promoText = (freeMonths: number): string =>
  `Up to ${freeMonths} month${freeMonths === 1 ? '' : 's'} free on a 12-month lease`;
const netEffective = (base: number, freeMonths: number): number =>
  Math.floor((base * (LEASE_MONTHS - freeMonths)) / LEASE_MONTHS);

/* ============================================================
   BALTO CAPITAL, assets (real portfolio, 28 residences)
   Coordinates approximated by city centre + deterministic offset
   from the asset slug. Refine per-asset as real geocodes arrive.
   ============================================================ */
interface RawAsset {
  slug: string;
  name: string;
  city: CitySlug;
  address: string;
  /** Explicit feature flag. Replaces the old `idx % 4 === 0` heuristic
   *  so reordering the array doesn't accidentally re-shuffle featured cards. */
  featured?: boolean;
  /** Per-asset alternate views, see Palisades for the canonical example. */
  hideDetailGallery?: boolean;
  incentives?: string[];
  unitLabels?: string[];
  /** Bedroom configs the building actually offers (0=Studio, 1..3=bedrooms),
   *  from the client's Apartment Type data. Overrides the city default.
   *  Buildings the client left blank keep the default until data arrives. */
  bedrooms?: number[];
}

// NOTE: `slug` is the stable URL + asset-folder key, keep it fixed across
// renames. `name` is the public display name per the Build Spec (Part Two).
const ASSETS: RawAsset[] = [
  { slug: 'chicklet-house',   name: 'Chicklet House',        city: 'edmonton',  address: '10304 107 Ave NW, Edmonton, AB T5H 0V8' },
  { slug: 'woodridge',        name: 'Westpark Living',       city: 'edmonton',  address: '10139 158 ST NW, Edmonton, AB T5P 2X9', featured: true, bedrooms: [1, 2] },
  {
    slug: 'palisades',        name: 'Palisades',             city: 'edmonton',  address: '10825 113 ST NW, Edmonton, AB T5H 3J1', featured: true,
    bedrooms: [1, 2],
  },
  { slug: 'hamlet',           name: 'Hamlet Village',        city: 'edmonton',  address: '11647 124 ST NW, Edmonton, AB T5M 0K8', bedrooms: [1] },
  { slug: 'copper-manor',     name: 'Copper Manor',          city: 'edmonton',  address: '13011 83 ST NW, Edmonton, AB T5E 2W5' },
  { slug: 'kafa',             name: 'Kafa Manor',            city: 'edmonton',  address: '12717 119 ST NW, Edmonton, AB T5E 5M2' },
  { slug: 'royal-lady',       name: 'The Crown Residence',   city: 'edmonton',  address: '10746 102 ST NW, Edmonton, AB T5H 2T7', featured: true, bedrooms: [1] },
  { slug: 'catalina-estates', name: 'Catalina Estates',      city: 'edmonton',  address: '5910 118 Ave NW, Edmonton, AB T5W 1E5', bedrooms: [1] },
  { slug: 'layali',           name: 'Layali House',          city: 'edmonton',  address: '13710 64 ST NW, Edmonton, AB T5A 1R9', bedrooms: [1, 2] },
  { slug: 'sky-manor',        name: 'Sky Manor',             city: 'edmonton',  address: '9612 156 ST NW, Edmonton, AB T5P 2N7' },
  { slug: 'grandview-manor',  name: 'Grandview Manor',       city: 'edmonton',  address: '11705 83 ST NW, Edmonton, AB T5B 2Z1', featured: true },
  { slug: 'cedar-manor',      name: 'Cedar Manor',           city: 'edmonton',  address: '12040 82 ST NW, Edmonton, AB T5B 2W6', bedrooms: [1] },
  { slug: 'courts-manor',     name: 'Courts Manor',          city: 'edmonton',  address: '12239 82 ST NW, Edmonton, AB T5B 2W9', bedrooms: [1] },
  { slug: 'oakwood-manor',    name: 'Oakwood Manor',         city: 'edmonton',  address: '11348 97 ST NW, Edmonton, AB T5G 1X4' },
  { slug: 'royal-manor',      name: 'Royal Manor',           city: 'edmonton',  address: '10215 108 Ave NW, Edmonton, AB T5H 1A9', featured: true, bedrooms: [1] },
  { slug: 'balwin-manor',     name: 'Balwin Manor',          city: 'edmonton',  address: '6704 131A AVE NW, Edmonton, AB T5C 1Z6' },
  { slug: 'acadian',          name: '124 West Residences',   city: 'edmonton',  address: '11535 124 ST NW, Edmonton, AB T5M 0K5', bedrooms: [0, 1] },
  { slug: 'parkdale',         name: '115 Park Residences',   city: 'edmonton',  address: '8021 115 Ave NW, Edmonton, AB T5B 4W7', bedrooms: [2] },
  { slug: 'beverly',          name: 'The Beverley 34',       city: 'edmonton',  address: '11312 34 ST NW, Edmonton, AB T5W 1Y9', bedrooms: [1] },
  { slug: 'strathearn',       name: 'River Valley Residence', city: 'edmonton', address: '9510 85 ST NW, Edmonton, AB T6C 3E2', bedrooms: [1] },
  { slug: 'pioneer',          name: '127 North Residences',  city: 'edmonton',  address: '12929 / 12921 127 ST NW, Edmonton, AB T5L 1B1' },
  { slug: 'rivergate',        name: 'River 82 Residences',   city: 'edmonton',  address: '11040 82 ST NW, Edmonton, AB T5H 1L9' },
  { slug: 'arbour-green',     name: 'Arbour Green',          city: 'edmonton',  address: '12036 - 66 Street, Edmonton, AB' },
  { slug: 'ten-one-26-154',   name: 'Aurora West',           city: 'edmonton',  address: '10126 154 St, Edmonton, AB T5P 2H3' },
  { slug: 'britnell-landing', name: 'Brintnell Landing',     city: 'edmonton',  address: '16255 51 St NW, Edmonton, AB T5Y 0V6' },
  // The Edge, consolidates the former 'edge' + 'edge-living' entries into one
  // premium building at 3005 James Mowatt Trail (Allard). Uses the edge-living photos.
  { slug: 'edge',             name: 'The Edge',              city: 'edmonton',  address: '3005 James Mowatt Trail SW, Edmonton, AB T6W 3P3', featured: true },
  // Cielo & Greyson, separate buildings, adjacent addresses on Willis Cres.
  { slug: 'cielo',            name: 'Cielo',                 city: 'saskatoon', address: '235 Willis Crescent, Saskatoon, SK S7T 0W7' },
  { slug: 'greyson',          name: 'Greyson',               city: 'saskatoon', address: '241 Willis Crescent, Saskatoon, SK' },
  { slug: 'lawson-village',   name: 'Lawson',                city: 'saskatoon', address: '192 Pinehouse Drive, Saskatoon, SK S7K 7Z9' },
  { slug: 'lockwood-arms',    name: 'Lockwood',              city: 'regina',    address: '193 / 197 Lockwood Road, Regina, SK S4S 6G9' },
];

const CITY_CENTERS: Record<CitySlug, { lat: number; lng: number; spreadLat: number; spreadLng: number }> = {
  edmonton:    { lat: 53.545,  lng: -113.493, spreadLat: 0.045, spreadLng: 0.070 },
  saskatoon:   { lat: 52.130,  lng: -106.665, spreadLat: 0.025, spreadLng: 0.045 },
  regina:      { lat: 50.445,  lng: -104.620, spreadLat: 0.020, spreadLng: 0.040 },
  yellowknife: { lat: 62.4540, lng: -114.3718, spreadLat: 0.022, spreadLng: 0.040 },
};

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Real lat/lng per property, geocoded via OSM Nominatim by scripts/geocode.mjs.
 *  Re-run `node scripts/geocode.mjs` when addresses change. */
const GEOCODED: Record<string, { lat: number; lng: number }> = {
  'chicklet-house':   { lat: 53.55151, lng: -113.49765 }, // 10304 107 Ave, exact house match
  'woodridge':        { lat: 53.54850, lng: -113.59388 }, // 10139 158 St, corrected to Britannia-Youngstown
  'palisades':        { lat: 53.55377, lng: -113.51541 },
  'hamlet':           { lat: 53.56818, lng: -113.53571 },
  'copper-manor':     { lat: 53.58946, lng: -113.46890 },
  'kafa':             { lat: 53.58548, lng: -113.52637 },
  'royal-lady':       { lat: 53.55253, lng: -113.49567 },
  'catalina-estates': { lat: 53.57065, lng: -113.43269 },
  'layali':           { lat: 53.60011, lng: -113.44043 },
  'sky-manor':        { lat: 53.53347, lng: -113.59051 },
  'grandview-manor':  { lat: 53.56902, lng: -113.46863 },
  'cedar-manor':      { lat: 53.57453, lng: -113.46720 }, // 12040 82 St, corrected (anchored to Courts Manor, same street)
  'courts-manor':     { lat: 53.57766, lng: -113.46717 },
  'oakwood-manor':    { lat: 53.56408, lng: -113.49233 },
  'royal-manor':      { lat: 53.55293, lng: -113.49664 },
  'balwin-manor':     { lat: 53.59132, lng: -113.44544 },
  'acadian':          { lat: 53.59792, lng: -113.53657 },
  'parkdale':         { lat: 53.56570, lng: -113.46520 },
  'beverly':          { lat: 53.56629, lng: -113.39384 },
  'strathearn':       { lat: 53.53202, lng: -113.45802 },
  'pioneer':          { lat: 53.58853, lng: -113.54084 },
  'rivergate':        { lat: 53.55941, lng: -113.46769 },
  'arbour-green':     { lat: 53.57439, lng: -113.44324 },
  'ten-one-26-154':   { lat: 53.54219, lng: -113.58721 },
  'britnell-landing': { lat: 53.62481, lng: -113.41321 },
  'edge':             { lat: 53.41544, lng: -113.52042 },
  // Saskatoon, Cielo at 235 Willis, Greyson at 241 Willis (separate buildings).
  'cielo':            { lat: 52.08840, lng: -106.63143 },
  'greyson':          { lat: 52.08835, lng: -106.62955 },
  'lawson-village':   { lat: 52.16912, lng: -106.62724 },
  // Regina
  'lockwood-arms':    { lat: 50.40151, lng: -104.62602 },
};

function coordsFor(slug: string, city: CitySlug): { lat: number; lng: number } {
  const real = GEOCODED[slug];
  if (real) return real;
  // Fallback for new properties added before re-running geocode.mjs.
  const c = CITY_CENTERS[city];
  const h = hashSeed(slug);
  const dLat = (((h % 997) / 997) - 0.5) * c.spreadLat * 2;
  const dLng = ((((h * 13) % 1009) / 1009) - 0.5) * c.spreadLng * 2;
  return { lat: +(c.lat + dLat).toFixed(5), lng: +(c.lng + dLng).toFixed(5) };
}

const BEDROOM_VARIANTS: number[][] = [
  [0, 1, 2],
  [1, 2],
  [1, 2, 3],
  [2, 3],
  [0, 1],
];

const FEATURE_POOL = [
  'Oak floors throughout',
  'Tall casement windows',
  'Updated kitchens and baths',
  'Quartz counters, panel-front appliances',
  'In-suite laundry',
  'Soaker tubs in primary baths',
  'Walk-in wardrobes',
  'Restored mouldings and trim',
  'Marble fireplace mantels (select suites)',
  'Custom millwork',
];

// Fallback amenity pool for buildings the client's doc doesn't cover. The
// items the doc treats as "not real" (roof terrace, resident lounge, storage
// lockers, mail & parcel concierge) are intentionally excluded.
const AMENITY_POOL = [
  'Surface parking',
  'Heated underground parking',
  'Updated common areas',
  'Private balconies',
];

/** Curated per-building Residence Features + Building Amenities from the
 *  client's Amenities tab (2026). Buildings not listed here fall back to the
 *  deterministic pool selection. "Heat and hot water included" was added to
 *  every building in this update per the client's promo note. */
const HEAT = 'Heat and hot water included';
// Per-building Residence Features + Building Amenities, strictly per the
// client's Amenities doc (2026): base features {In-suite laundry, Marble
// fireplace mantels}, base amenity {Heated underground parking}, with the doc's
// remove/add/replace applied. Items the doc never adds (roof terrace, resident
// lounge, storage lockers, mail & parcel concierge) and items it never mentions
// (pet-friendly, soaker tubs, walk-in wardrobes, mouldings, millwork) are gone.
const CURATED: Record<string, { features: string[]; amenities: string[] }> = {
  // 115 Park Residences
  parkdale: {
    features: ['In-suite laundry', 'Spacious suites'],
    amenities: ['Surface parking', 'Elevator', HEAT],
  },
  // 124 West Residences
  acadian: {
    features: ['In-suite laundry'],
    amenities: ['Surface parking', 'Communal laundry', 'Updated common areas', HEAT],
  },
  'balwin-manor': {
    features: ['In-suite laundry'],
    amenities: ['Heated underground parking', 'Balconies', HEAT],
  },
  'catalina-estates': {
    features: ['In-suite laundry'],
    amenities: ['Heated underground parking', 'Updated common areas', HEAT],
  },
  'cedar-manor': {
    features: ['Marble fireplace mantels (select suites)'],
    amenities: ['Heated underground parking', 'Updated common areas', HEAT],
  },
  'copper-manor': {
    features: ['In-suite laundry'],
    amenities: ['Heated underground parking', 'Shared mail area', 'Updated common areas', HEAT],
  },
  'courts-manor': {
    features: ['In-suite laundry'],
    amenities: ['Surface parking', 'Updated common areas', 'Private balconies', HEAT],
  },
  'grandview-manor': {
    features: ['In-suite laundry'],
    amenities: ['Heated underground parking', 'Private balconies', 'Shared mail area', HEAT],
  },
  hamlet: {
    features: ['Marble fireplace mantels (select suites)'],
    amenities: ['Surface parking', 'Private balconies', 'Updated common areas', HEAT],
  },
  kafa: {
    features: ['In-suite laundry'],
    amenities: ['Surface parking', 'Updated common areas', HEAT],
  },
  layali: {
    features: ['In-suite laundry'],
    amenities: ['Surface parking', 'Updated common areas', HEAT],
  },
  'oakwood-manor': {
    features: ['Marble fireplace mantels (select suites)'],
    amenities: ['Heated underground parking', 'Private balconies', 'Updated common areas', HEAT],
  },
  palisades: {
    features: ['In-suite laundry', 'Marble fireplace mantels (select suites)'],
    amenities: ['Surface parking', 'Updated common areas', HEAT],
  },
  // River Valley Residence (no residence features remain per the doc)
  strathearn: {
    features: [],
    amenities: ['Surface parking', 'Updated common areas', HEAT],
  },
  'royal-manor': {
    features: [],
    amenities: ['Surface parking', 'Updated common areas', 'Communal laundry', HEAT],
  },
  'sky-manor': {
    features: ['In-suite laundry'],
    amenities: ['Heated underground parking', 'Private balconies', 'Newly renovated suites', 'Shared mail and parcel area', HEAT],
  },
  // The Beverley 34
  beverly: {
    features: ['In-suite laundry'],
    amenities: ['Surface parking', 'Private balconies', 'Updated common areas', HEAT],
  },
  // The Crown Residence
  'royal-lady': {
    features: ['Marble fireplace mantels (select suites)'],
    amenities: ['Surface parking', 'Private balconies', 'Updated common areas', 'Communal laundry', 'Resident concierge', HEAT],
  },
  // Westpark Living
  woodridge: {
    features: ['Marble fireplace mantels (select suites)'],
    amenities: ['Surface parking', 'Private balconies', 'Updated common areas', 'Communal laundry', 'Resident concierge', HEAT],
  },
};

function pickN<T>(pool: T[], n: number, seed: number): T[] {
  const len = pool.length;
  const count = Math.min(n, len);
  const offset = Math.abs(seed) % len;
  return Array.from({ length: count }, (_, k) => pool[(offset + k) % len]);
}

const HERO_POOL: string[] = [
  IMAGES.heritage1, IMAGES.heritage2, IMAGES.heritage3, IMAGES.heritage4,
  IMAGES.modern1, IMAGES.modern2, IMAGES.modern3, IMAGES.modern4,
  IMAGES.detail_brick, IMAGES.detail_door, IMAGES.detail_arch,
  IMAGES.ext_apartment1, IMAGES.ext_apartment2, IMAGES.ext_apartment3,
  IMAGES.ext_apartment4, IMAGES.ext_apartment5, IMAGES.ext_apartment6,
];

const GALLERY_POOL: string[] = [
  IMAGES.int_living1, IMAGES.int_living2, IMAGES.int_living3,
  IMAGES.int_kitchen1, IMAGES.int_kitchen2,
  IMAGES.int_bed1, IMAGES.int_bed2,
  IMAGES.int_bath1, IMAGES.int_bath2,
  IMAGES.int_dining1, IMAGES.int_detail1, IMAGES.int_detail2,
];

function bedroomLabel(opts: number[]): string {
  const parts = opts.map((b) => (b === 0 ? 'Studio' : String(b)));
  const onlyStudio = opts.length === 1 && opts[0] === 0;
  return parts.join(' · ') + (onlyStudio ? '' : ' Bedrooms');
}

/** Per-asset overrides for real photos that have been synced into
 *  public/assets/<slug>/. Anything not listed here falls back to the
 *  Unsplash pool. Generated/maintained via npm run sync-images. */
const REAL_PHOTOS: Record<string, { hero?: string; gallery: string[] }> = {
  woodridge: {
    hero: '/assets/woodridge/01-main.jpg',
    gallery: [
      '/assets/woodridge/02.jpg',
      '/assets/woodridge/03.jpg',
      '/assets/woodridge/04.jpg',
      '/assets/woodridge/05.jpg',
      '/assets/woodridge/06.jpg',
      '/assets/woodridge/07.jpg',
      '/assets/woodridge/08.jpg',
      '/assets/woodridge/09.jpg',
      '/assets/woodridge/10.jpg',
    ],
  },
  acadian: {
    hero: '/assets/acadian/01-main.jpg',
    // Interiors replaced with AI renders across units 103/303, 106/201/207/
    // 304/306, and 202/205 (furnished + unfurnished, 2026).
    gallery: [
      '/assets/acadian/02.png', // 103/303 · Living area (furnished)
      '/assets/acadian/03.png', // 103/303 · Kitchen (furnished)
      '/assets/acadian/04.png', // 103/303 · Living area
      '/assets/acadian/05.png', // 103/303 · Kitchen
      '/assets/acadian/06.png', // 106… · Living room (furnished)
      '/assets/acadian/07.png', // 106… · Kitchen (furnished)
      '/assets/acadian/08.png', // 106… · Bedroom (furnished)
      '/assets/acadian/09.png', // 106… · Living room
      '/assets/acadian/10.png', // 106… · Kitchen
      '/assets/acadian/11.png', // 106… · Bedroom
      '/assets/acadian/12.png', // 202/205 · Living room (furnished)
      '/assets/acadian/13.png', // 202/205 · Kitchen (furnished)
      '/assets/acadian/14.png', // 202/205 · Bedroom (furnished)
      '/assets/acadian/15.png', // 202/205 · Master bedroom (furnished)
      '/assets/acadian/16.png', // 202/205 · Living room
      '/assets/acadian/17.png', // 202/205 · Kitchen
      '/assets/acadian/18.png', // 202/205 · Bedroom
      '/assets/acadian/19.png', // 202/205 · Master bedroom
    ],
  },
  hamlet: {
    hero: '/assets/hamlet/01-main.jpg',
    // Interiors replaced with Unit 6 AI Unfurnished renders (2026).
    gallery: [
      '/assets/hamlet/02.png', // Living room
      '/assets/hamlet/03.png', // Kitchen
      '/assets/hamlet/04.png', // Kitchen view
      '/assets/hamlet/05.png', // Bedroom
    ],
  },
  'royal-lady': {
    hero: '/assets/royal-lady/01-main.jpg',
    gallery: [
      '/assets/royal-lady/02.jpg',
      '/assets/royal-lady/03.jpg',
      '/assets/royal-lady/04.jpg',
      '/assets/royal-lady/05.jpg',
      '/assets/royal-lady/06.jpg',
      '/assets/royal-lady/07.jpg',
      '/assets/royal-lady/08.jpg',
      '/assets/royal-lady/09.jpg',
      '/assets/royal-lady/10.jpg',
      '/assets/royal-lady/11.jpg',
      // Added: Unit 302/303/309 AI Unfurnished renders (2026).
      '/assets/royal-lady/12.png', // Living room
      '/assets/royal-lady/13.png', // Kitchen
      '/assets/royal-lady/14.png', // Bedroom
      // Added: unit 105 AI Furnished renders (2026).
      '/assets/royal-lady/15.png', // Living room
      '/assets/royal-lady/16.png', // Kitchen
      '/assets/royal-lady/17.png', // Bedroom
      '/assets/royal-lady/18.png', // Bathroom
      // Added: Unit 302/303/309 AI Furnished renders (2026).
      '/assets/royal-lady/19.png', // Living room
      '/assets/royal-lady/20.png', // Kitchen
      '/assets/royal-lady/21.png', // Bedroom
    ],
  },
  'catalina-estates': {
    hero: '/assets/catalina-estates/01-main.jpg',
    // Interiors replaced with Unit 2 AI Furnished renders (2026).
    gallery: [
      '/assets/catalina-estates/02.png', // Living room
      '/assets/catalina-estates/03.png', // Kitchen
      '/assets/catalina-estates/04.png', // Bedroom
      '/assets/catalina-estates/05.png', // Bathroom
    ],
  },
  layali: {
    hero: '/assets/layali/01-main.jpg',
    // Interiors replaced with Unit 7 + Unit 5/15 AI Unfurnished renders (2026).
    gallery: [
      '/assets/layali/02.png', // Unit 7 · Living room
      '/assets/layali/03.png', // Unit 7 · Kitchen
      '/assets/layali/04.png', // Unit 7 · Bedroom
      '/assets/layali/05.png', // Unit 5/15 · Master bedroom
      '/assets/layali/06.png', // Unit 5/15 · Bedroom
    ],
  },
  'sky-manor': {
    hero: '/assets/sky-manor/01-main.jpg',
    gallery: [
      '/assets/sky-manor/02.jpg',
      '/assets/sky-manor/03.jpg',
      '/assets/sky-manor/04.jpg',
      '/assets/sky-manor/05.jpg',
      '/assets/sky-manor/06.jpg',
      '/assets/sky-manor/07.jpg',
    ],
  },
  'cedar-manor': {
    hero: '/assets/cedar-manor/01-main.jpg',
    // Interiors replaced with Unit 5/15/17 + Unit 2/7/8 AI Unfurnished (2026).
    gallery: [
      '/assets/cedar-manor/02.png', // Unit 5/15/17 · Living room
      '/assets/cedar-manor/03.png', // Unit 5/15/17 · Kitchen
      '/assets/cedar-manor/04.png', // Unit 5/15/17 · Bedroom
      '/assets/cedar-manor/05.png', // Unit 2/7/8 · Living room
      '/assets/cedar-manor/06.png', // Unit 2/7/8 · Kitchen
      '/assets/cedar-manor/07.png', // Unit 2/7/8 · Bedroom
    ],
  },
  kafa: {
    hero: '/assets/kafa/01-main.jpg',
    gallery: [
      '/assets/kafa/02.jpg',
      '/assets/kafa/03.jpg',
      '/assets/kafa/04.jpg',
      '/assets/kafa/05.jpg',
      '/assets/kafa/06.jpg',
      '/assets/kafa/07.jpg',
      '/assets/kafa/08.jpg',
    ],
  },
  palisades: {
    hero: '/assets/palisades/01-main.jpg',
    // Interiors replaced with unit 204 + Unit 205 AI Furnished renders (2026).
    gallery: [
      '/assets/palisades/02.png', // Unit 204 · Living room
      '/assets/palisades/03.png', // Unit 204 · Kitchen
      '/assets/palisades/04.png', // Unit 204 · Bedroom
      '/assets/palisades/05.png', // Unit 204 · Bathroom
      '/assets/palisades/06.png', // Unit 205 · Living room
      '/assets/palisades/07.png', // Unit 205 · Kitchen
      '/assets/palisades/08.png', // Unit 205 · Bedroom 1
      '/assets/palisades/09.png', // Unit 205 · Bedroom 2
      '/assets/palisades/10.png', // Unit 205 · Bathroom
    ],
  },
  'copper-manor':    { hero: '/assets/copper-manor/01-main.jpg',    gallery: [] },
  'grandview-manor': {
    hero: '/assets/grandview-manor/01-main.jpg',
    gallery: [
      '/assets/grandview-manor/02.jpg',
      '/assets/grandview-manor/03.jpg',
      '/assets/grandview-manor/04.jpg',
    ],
  },
  'courts-manor': {
    hero: '/assets/courts-manor/01-main.jpg',
    // Interiors replaced with Unit 5 + Unit 21 AI Unfurnished renders (2026).
    gallery: [
      '/assets/courts-manor/02.png', // Unit 5 · Living room
      '/assets/courts-manor/03.png', // Unit 5 · Kitchen
      '/assets/courts-manor/04.png', // Unit 21 · Living room
      '/assets/courts-manor/05.png', // Unit 21 · Kitchen
      '/assets/courts-manor/06.png', // Unit 21 · Bathroom
    ],
  },
  'oakwood-manor': {
    hero: '/assets/oakwood-manor/01-main.jpg',
    gallery: [
      '/assets/oakwood-manor/02.jpg',
      '/assets/oakwood-manor/03.jpg',
      '/assets/oakwood-manor/04.jpg',
      '/assets/oakwood-manor/05.jpg',
    ],
  },
  'balwin-manor': {
    hero: '/assets/balwin-manor/01-main.jpg',
    gallery: [
      '/assets/balwin-manor/02.jpg',
      '/assets/balwin-manor/03.jpg',
      '/assets/balwin-manor/04.jpg',
      '/assets/balwin-manor/05.jpg',
      '/assets/balwin-manor/06.jpg',
      '/assets/balwin-manor/07.jpg',
      '/assets/balwin-manor/08.jpg',
    ],
  },
  // Parkdale / Strathearn / Rivergate / Beverly, the sync script auto-
  // promoted the first photo to 01-main.jpg since there's no dedicated
  // Main shot from the client yet. Hero comes from that file; the rest
  // populate the gallery. When a proper Main arrives, the file naming
  // re-sorts automatically on next sync.
  parkdale: {
    // No facade shot yet — keep the coming-soon cover; Unit 202 AI Unfurnished
    // interiors populate the gallery (2026).
    hero: '/assets/coming-soon.png',
    gallery: [
      '/assets/parkdale/01-main.png', // Living room
      '/assets/parkdale/02.png', // Kitchen
      '/assets/parkdale/03.png', // Master bedroom
      '/assets/parkdale/04.png', // Bedroom
    ],
  },
  strathearn: {
    hero: '/assets/coming-soon.png',
    gallery: [
      '/assets/strathearn/01-main.jpg',
      '/assets/strathearn/02.jpg',
      '/assets/strathearn/03.jpg',
      '/assets/strathearn/04.jpg',
      '/assets/strathearn/05.jpg',
    ],
  },
  rivergate: {
    hero: '/assets/coming-soon.png',
    gallery: [
      '/assets/rivergate/01-main.jpg',
      '/assets/rivergate/02.jpg',
      '/assets/rivergate/03.jpg',
      '/assets/rivergate/04.jpg',
      '/assets/rivergate/05.jpg',
    ],
  },
  beverly: {
    // No facade shot yet — keep the coming-soon cover; Unit 203 AI Unfurnished
    // interiors populate the gallery (2026).
    hero: '/assets/coming-soon.png',
    gallery: [
      '/assets/beverly/01-main.png', // Living room
      '/assets/beverly/02.png', // Kitchen
      '/assets/beverly/03.png', // Bedroom
    ],
  },
  'royal-manor': {
    hero: '/assets/royal-manor/01-main.jpg',
    gallery: [
      '/assets/royal-manor/02.jpg',
      '/assets/royal-manor/03.jpg',
      '/assets/royal-manor/04.jpg',
      '/assets/royal-manor/05.jpg',
      '/assets/royal-manor/06.jpg',
      '/assets/royal-manor/07.jpg',
      '/assets/royal-manor/08.jpg',
      '/assets/royal-manor/09.jpg',
      // Added: AI Furnished renders (2026).
      '/assets/royal-manor/10.png', // Living room
      '/assets/royal-manor/11.png', // Kitchen
      '/assets/royal-manor/12.png', // Bedroom
      '/assets/royal-manor/13.png', // Bathroom
    ],
  },
  // Saskatoon, Cielo & Greyson split + new Edge Living + renames.
  cielo: {
    hero: '/assets/cielo/01-main.jpg',
    gallery: Array.from({ length: 17 }, (_, i) =>
      `/assets/cielo/${String(i + 2).padStart(2, '0')}.jpg`),
  },
  greyson: {
    hero: '/assets/greyson/01-main.jpg',
    gallery: Array.from({ length: 28 }, (_, i) =>
      `/assets/greyson/${String(i + 2).padStart(2, '0')}.jpg`),
  },
  // The Edge, photos live under /assets/edge-living/ (folder kept as-is).
  edge: {
    hero: '/assets/edge-living/01-main.jpg',
    gallery: Array.from({ length: 12 }, (_, i) =>
      `/assets/edge-living/${String(i + 1).padStart(2, '0')}.jpg`),
  },
  pioneer:           { hero: '/assets/coming-soon.png', gallery: [] },
  'arbour-green':    { hero: '/assets/coming-soon.png', gallery: [] },
  'ten-one-26-154':  { hero: '/assets/coming-soon.png', gallery: [] },
  'britnell-landing':{ hero: '/assets/coming-soon.png', gallery: [] },
  'chicklet-house':  { hero: '/assets/coming-soon.png', gallery: [] },
  'lawson-village': {
    hero: '/assets/lawson-village/01-main.jpg',
    gallery: [
      '/assets/lawson-village/02.jpg',
      '/assets/lawson-village/03.jpg',
      '/assets/lawson-village/04.jpg',
      '/assets/lawson-village/05.jpg',
    ],
  },
  'lockwood-arms': {
    hero: '/assets/lockwood-arms/01-main.jpg',
    gallery: [
      '/assets/lockwood-arms/02.jpg',
      '/assets/lockwood-arms/03.jpg',
      '/assets/lockwood-arms/04.jpg',
      '/assets/lockwood-arms/05.jpg',
    ],
  },
};

/** Net-effective pricing per asset. Woodridge uses its own base card; everyone
 *  else uses the non-renovated card. The advertised number reflects the
 *  building's promo (free months) over a 12-month lease. */
function pricesFor(raw: RawAsset): Partial<Record<0 | 1 | 2 | 3, number>> {
  const card = raw.slug === 'woodridge' ? WOODRIDGE_RATES : NON_RENOVATED_RATES;
  const free = freeMonthsFor(raw.slug);
  return {
    0: netEffective(card[0], free),
    1: netEffective(card[1], free),
    2: netEffective(card[2], free),
    3: netEffective(card[3], free),
  };
}

/** Per-building copy from the Build Spec, Part Two. `description` is the
 *  ready-to-use blurb; `closeTo` populates the NEARBY list. Keyed by slug.
 *  NOTE: bed/bath, rents, and in-suite finishes still come from the
 *  management system, verify before publishing. */
interface BuildingCopy {
  neighbourhood: string;
  tier: Tier;
  description: string;
  closeTo: string[];
}

const COPY: Record<string, BuildingCopy> = {
  'chicklet-house': {
    neighbourhood: 'Central McDougall', tier: 'value-add',
    description: 'A renovated and updated residence on Edmonton’s multicultural “Avenue of Nations,” just north of downtown. Modernized suites and secured entry in a highly walkable, transit-rich pocket, steps from the diverse restaurants and shops of 107 Avenue, with MacEwan University, the Royal Alexandra Hospital, and the Metro Line LRT all close by.',
    closeTo: ['107 Ave “Avenue of Nations” dining', 'MacEwan University', 'Royal Alexandra Hospital', 'Kingsway Mall', 'Metro Line LRT', 'downtown'],
  },
  hamlet: {
    neighbourhood: '124 St / Westmount', tier: 'value-add',
    description: 'A renovated character walk-up on Edmonton’s most celebrated independent shopping street. Updated suites pair handsome mid-century proportions with refreshed kitchens and baths, secured entry, and improved common areas. Step out the door into the 124 Street District, galleries, boutiques, and the city’s best-loved bakeries and cafés, with the river valley and downtown minutes away.',
    closeTo: ['Duchess Bake Shop', 'Roxy Theatre', '124 Grand Market', 'Government House Park & river valley', 'downtown', 'transit on 124 St'],
  },
  acadian: {
    neighbourhood: 'Inglewood', tier: 'value-add',
    description: 'In Inglewood, an established central neighbourhood beside the 124 Street District. This renovated and updated building puts the corridor’s cafés, galleries, and boutiques within easy reach, modernized suites, upgraded security, and a quiet residential setting near one of Edmonton’s most walkable streets.',
    closeTo: ['124 Street shops & restaurants', 'Duchess Bake Shop', 'art galleries', 'Westmount Centre', 'downtown & Jasper Avenue', 'transit'],
  },
  kafa: {
    neighbourhood: 'Calder', tier: 'value-add',
    description: 'A renovated building in Calder, a quiet, established north-central neighbourhood. Updated suites and secured entry in a mature, tree-lined setting, close to NAIT, Kingsway Mall, and the Yellowhead, with easy transit and downtown access for commuters.',
    closeTo: ['124 Street District (walk)', 'Westmount Centre', 'Kingsway Mall', 'Yellowhead Trail', 'downtown', 'transit'],
  },
  'royal-lady': {
    neighbourhood: 'Downtown / MacEwan', tier: 'value-add',
    description: 'Steps from MacEwan University and the ICE District, on the northern edge of downtown. This renovated and updated building offers modernized suites and upgraded security in a location built for students and young professionals, walk to class, work, and Rogers Place, with LRT and Jasper Avenue minutes away.',
    closeTo: ['MacEwan University', 'ICE District & Rogers Place', 'downtown core', 'LRT', 'Jasper Avenue', 'river valley'],
  },
  'royal-manor': {
    neighbourhood: 'Central McDougall', tier: 'value-add',
    description: 'A central address moments from MacEwan University and Edmonton’s downtown core. Renovated and updated suites, secured entry, and quick transit access make this an easy choice for students and downtown commuters. Walk to campus, shops, and the river valley.',
    closeTo: ['MacEwan University', 'downtown', 'Royal Alexandra Hospital', 'Kingsway Mall', 'LRT', 'river valley'],
  },
  'grandview-manor': {
    neighbourhood: 'Parkdale', tier: 'value-add',
    description: 'A renovated walk-up in Parkdale, a central neighbourhood just off the 118 Avenue arts district and a short distance north of downtown. Updated suites, secured entry, and refreshed common areas in an area seeing real reinvestment, close to Commonwealth Stadium, transit, and the downtown core.',
    closeTo: ['118 Avenue arts & festivals (Kaleido, Deep Freeze)', 'Nina Haggerty Centre', 'Commonwealth Stadium & Rec Centre', 'downtown', 'transit'],
  },
  'cedar-manor': {
    neighbourhood: 'Alberta Avenue', tier: 'value-add',
    description: 'A renovated and updated building on a quiet residential block in the Alberta Avenue community, steps from the 118 Avenue corridor’s cafés, galleries, and festivals. Modernized suites and upgraded security, with downtown and NAIT a short commute and the Coliseum LRT connecting you across the city.',
    closeTo: ['118 Avenue shops & arts', 'Carrot Community Coffeehouse', 'NAIT', 'Coliseum LRT', 'downtown'],
  },
  'courts-manor': {
    neighbourhood: 'Elmwood', tier: 'value-add',
    description: 'In Elmwood, a quiet established neighbourhood near the 118 Avenue corridor, this renovated building offers updated suites and secured entry. A short reach to the Avenue’s growing arts scene, with quick downtown and transit access at an accessible rent.',
    closeTo: ['118 Avenue corridor', 'arts & festivals', 'NAIT', 'Coliseum LRT', 'Commonwealth Rec Centre', 'downtown'],
  },
  parkdale: {
    neighbourhood: 'Eastwood', tier: 'value-add',
    description: 'A renovated and updated building in Eastwood, just east of the Alberta Avenue corridor. Secured entry and modernized suites with easy access to 118 Avenue amenities, Commonwealth Stadium, and downtown. Practical, central, and improving.',
    closeTo: ['118 Avenue', 'Commonwealth Stadium', 'Stadium LRT', 'downtown', 'transit'],
  },
  'oakwood-manor': {
    neighbourhood: 'Spruce Avenue', tier: 'value-add',
    description: 'In Spruce Avenue, a central neighbourhood on 97 Street near Kingsway and the 118 Avenue corridor. This renovated building offers updated suites and secured entry in a well-connected inner-city location, close to Kingsway Mall, NAIT, the Royal Alexandra Hospital, transit, and downtown.',
    closeTo: ['118 Avenue', 'downtown (short drive)', 'Royal Alexandra Hospital', 'NAIT', 'transit'],
  },
  'catalina-estates': {
    neighbourhood: 'Montrose', tier: 'value-add',
    description: 'A renovated and updated building in Montrose, an established neighbourhood near the 118 Avenue corridor and Borden Park. Modernized suites with upgraded security, close to green space, transit, and the ongoing 118 Avenue revitalization. Affordable, connected, and on the rise.',
    closeTo: ['Borden Park', '118 Avenue corridor', 'Coliseum', 'Stadium LRT', 'Commonwealth Rec Centre', 'downtown access'],
  },
  rivergate: {
    neighbourhood: 'Cromdale', tier: 'value-add',
    description: 'A renovated building in Cromdale, an established inner-city neighbourhood overlooking the river valley. Updated suites and secured entry in a central, well-connected pocket, steps from the 118 Avenue corridor’s cafés and arts spaces, with quick downtown and transit access.',
    closeTo: ['118 Avenue', 'downtown', 'Commonwealth Rec Centre', 'transit', 'NAIT'],
  },
  'copper-manor': {
    neighbourhood: 'NE / Killarney', tier: 'value-add',
    description: 'A renovated and updated building in a quiet, established northeast neighbourhood. Modernized suites and secured entry, with quick Yellowhead Trail access for commuters and nearby shopping and schools. Practical, family-friendly value.',
    closeTo: ['Yellowhead Trail', 'Northgate shopping', 'schools', 'transit', 'downtown access'],
  },
  'balwin-manor': {
    neighbourhood: 'Northgate', tier: 'value-add',
    description: 'Close to Northgate Centre shopping and transit, this renovated building offers updated suites and upgraded security in a convenient northeast location. Easy access to NAIT, downtown, and major routes north.',
    closeTo: ['Northgate Centre', 'NAIT', 'transit hub', 'Yellowhead Trail', 'downtown'],
  },
  'arbour-green': {
    neighbourhood: 'Montrose', tier: 'value-add',
    description: 'A renovated and updated building in Montrose, an established neighbourhood near the 118 Avenue corridor. Modernized suites and secured entry, close to transit and downtown access, at an accessible rent.',
    closeTo: ['118 Avenue', 'Commonwealth area', 'transit', 'downtown access', 'schools'],
  },
  layali: {
    neighbourhood: 'York', tier: 'value-add',
    description: 'A renovated building in York, a quiet northeast residential neighbourhood with good road access and nearby shopping and schools. Updated suites and secured entry, comfortable, practical value close to transit.',
    closeTo: ['Northgate & Clareview shopping', 'Clareview LRT (nearby)', 'schools', 'Anthony Henday access'],
  },
  beverly: {
    neighbourhood: 'Beverly Heights', tier: 'value-add',
    description: 'A renovated and updated building in Beverly Heights, a mature northeast neighbourhood overlooking the river valley. Modernized suites and secured entry close to Rundle Park, the river valley golf courses, and transit, green space and connectivity at an accessible rent.',
    closeTo: ['Rundle Park', 'river valley & golf', 'Coliseum/Stadium LRT', 'downtown', 'transit'],
  },
  pioneer: {
    neighbourhood: 'Calder', tier: 'value-add',
    description: 'Two renovated buildings on a quiet residential street in north-central Edmonton, close to NAIT, the Yellowhead, and Kingsway Mall. Updated suites and secured entry, with quick downtown and transit access. Practical, central value.',
    closeTo: ['NAIT', 'Kingsway Mall', 'Yellowhead Trail', 'transit', 'downtown'],
  },
  woodridge: {
    neighbourhood: 'Britannia-Youngstown', tier: 'value-add',
    description: 'A renovated building in Britannia-Youngstown, an established west-end neighbourhood near the Stony Plain Road corridor. Updated suites and secured entry with quick routes to West Edmonton Mall and the Misericordia Hospital, practical value with everyday amenities close by and the future Valley Line West LRT nearby.',
    closeTo: ['West Edmonton Mall', 'Misericordia Hospital', 'Stony Plain Road shops', 'Meadowlark', 'future Valley Line West LRT'],
  },
  'sky-manor': {
    neighbourhood: 'Glenwood', tier: 'value-add',
    description: 'A renovated and updated walk-up in Glenwood, an established west-end neighbourhood minutes from West Edmonton Mall and Meadowlark shopping. Modernized suites, upgraded security, and good transit access toward downtown. Comfortable, connected, family-friendly.',
    closeTo: ['West Edmonton Mall', 'Meadowlark shopping', 'Misericordia Hospital', 'transit', 'future Valley Line West LRT'],
  },
  'ten-one-26-154': {
    neighbourhood: 'Canora', tier: 'value-add',
    description: 'A renovated and updated building in Canora, an established west-end neighbourhood near the Stony Plain Road corridor. Modernized suites and secured entry, close to shopping, schools, and Misericordia Hospital, with the coming Valley Line West LRT set to improve the commute downtown.',
    closeTo: ['Stony Plain Road', 'West Edmonton Mall', 'Misericordia Hospital', 'schools', 'future Valley Line West LRT'],
  },
  strathearn: {
    neighbourhood: 'Strathearn', tier: 'newer',
    description: 'A standout address in Strathearn, a quiet, mature southeast neighbourhood perched above the river valley. Bright, updated suites with modern finishes and secured entry, moments from Mill Creek Ravine, the Bonnie Doon shopping area, and the Valley Line LRT, with downtown and the University of Alberta both a short hop across the river.',
    closeTo: ['Mill Creek Ravine trails', 'Bonnie Doon shopping', 'Valley Line LRT', 'river valley', 'University of Alberta', 'downtown'],
  },
  'britnell-landing': {
    neighbourhood: 'Brintnell', tier: 'newer',
    description: 'A newer building in the Brintnell area of northeast Edmonton, surrounded by established shopping, schools, and parks. Modern suites and secured entry with easy Manning Drive and Anthony Henday access, a fresh, family-friendly option with everyday amenities close by.',
    closeTo: ['Anthony Henday Drive', 'new retail & schools', 'parks', 'transit'],
  },
  edge: {
    neighbourhood: 'Allard', tier: 'premium',
    description: 'The Edge is a contemporary residence in Allard, one of Edmonton’s fast-growing southside communities. Modern open-concept suites, premium finishes, and secured building access, surrounded by new retail, parks, and schools, with quick Anthony Henday connections and the future Heritage Valley LRT planned nearby. Elevated rental living, built for how people live now.',
    closeTo: ['Heritage Valley shopping', 'parks & schools', 'Anthony Henday Drive', 'future Heritage Valley LRT', 'QEII to Calgary'],
  },
  // Palisades: not in the Build Spec Part Two, copy below is drafted in-house
  // from the tier map (Oliver / Wîhkwêntôwin, value-add). VERIFY before publishing.
  palisades: {
    neighbourhood: 'Oliver / Wîhkwêntôwin', tier: 'value-add',
    description: 'A renovated and updated building in Oliver (Wîhkwêntôwin), one of Edmonton’s most walkable downtown-edge neighbourhoods. Modernized suites and secured entry steps from the river valley, Jasper Avenue, and the Brewery District, with the Valley Line West LRT and the downtown core close at hand.',
    closeTo: ['Jasper Avenue', 'Brewery District shopping', 'river valley', 'MacEwan University', 'downtown core', 'transit'],
  },
  cielo: {
    neighbourhood: 'Stonebridge', tier: 'newer',
    description: 'A contemporary residence in Stonebridge, one of Saskatoon’s most popular newer neighbourhoods. Bright, modern suites and secured entry in a master-planned community built for easy living, walk to grocery, restaurants, parks, and pathways, with a direct University of Saskatchewan bus connection and quick Circle Drive access across the city.',
    closeTo: ['Stonebridge shopping (Sobeys, restaurants)', 'parks & pathways', 'Stonebridge Library', 'direct U of S transit', 'Circle Drive', 'schools'],
  },
  greyson: {
    neighbourhood: 'Stonebridge', tier: 'newer',
    description: 'A modern building in the heart of Stonebridge, steps from its shops, parks, and interconnected walking paths. Contemporary suites and secured entry in a vibrant, family-friendly south-end community, with a direct bus to the University of Saskatchewan and fast Circle Drive connections to downtown and beyond.',
    closeTo: ['Stonebridge amenities', 'grocery & dining', 'parks & pathways', 'direct U of S transit', 'Circle Drive', 'downtown access'],
  },
  'lawson-village': {
    neighbourhood: 'Lawson Heights', tier: 'value-add',
    description: 'A well-positioned residence in established Lawson Heights, one of Saskatoon’s most convenient north-end neighbourhoods. Comfortable, updated suites and secured entry in a peaceful, tree-lined setting, with Lawson Heights Mall right across the way and the river trails minutes from your door.',
    closeTo: ['Lawson Heights Mall', 'groceries, dining, medical', 'Meewasin Valley Trail & South Saskatchewan River', 'schools', 'downtown (short commute)'],
  },
  'lockwood-arms': {
    neighbourhood: 'Whitmore Park', tier: 'value-add',
    description: 'Two updated buildings in a settled southeast Regina neighbourhood, minutes from the University of Regina and the green expanse of Wascana Centre, one of North America’s largest urban parks. Comfortable suites and secured entry in a quiet residential setting, close to shopping, parks, and the lake, with the campus and downtown both within reach.',
    closeTo: ['University of Regina', 'Wascana Centre & lake', 'Albert St / Gordon Rd shopping', 'schools', 'downtown access'],
  },
};

/** Standard condition line per tier, used as the second Overview paragraph. */
const TIER_LINE: Record<Tier, string> = {
  'value-add': 'Renovated and updated under Balto, modernized suites, secured entry, and refreshed common areas, family-operated and locally managed with a one-business-day maintenance standard.',
  newer: 'A newer building with bright, well-finished suites and secured entry, family-operated and locally managed, with a one-business-day maintenance standard.',
  premium: 'Fully elevated rental living, premium finishes, open-concept suites, and secured building access, family-operated and locally managed.',
  'coming-soon': 'Coming soon. Register your interest and we’ll be in touch as homes become available.',
};

/** Real available units per building, from the client's availability sheet
 *  (2026). Net-effective rent is the source of truth for these buildings. */
const UNIT_TYPE_TO_NUM: Record<string, 0 | 1 | 2 | 3> = {
  'Studio': 0, '1 Bedroom': 1, '2 Bedroom': 2, '3 Bedroom': 3,
};
const UNITS: Record<string, Unit[]> = {
  hamlet: [{ unit: '6', type: '1 Bedroom', rent: 1075 }],
  woodridge: [
    { unit: '1', type: '2 Bedroom', rent: 1421 },
    { unit: '114', type: '2 Bedroom', rent: 1300 },
    { unit: '120', type: '1 Bedroom', rent: 1238 },
    { unit: '121', type: '1 Bedroom', rent: 1238 },
    { unit: '213', type: '2 Bedroom', rent: 1200 },
    { unit: '216', type: '1 Bedroom', rent: 1238 },
    { unit: '221', type: '1 Bedroom', rent: 1238 },
    { unit: '317', type: '2 Bedroom', rent: 1421 },
    { unit: '320', type: '1 Bedroom', rent: 1238 },
    { unit: '322', type: '2 Bedroom', rent: 1300 },
    { unit: '323', type: '1 Bedroom', rent: 1150 },
    { unit: '324', type: '2 Bedroom', rent: 1421 },
  ],
  'royal-lady': [
    { unit: '105', type: '1 Bedroom', rent: 1200 },
    { unit: '107', type: '1 Bedroom', rent: 1200 },
    { unit: '205', type: '1 Bedroom', rent: 1200 },
    { unit: '302', type: '1 Bedroom', rent: 1070 },
    { unit: '303', type: '1 Bedroom', rent: 1005 },
    { unit: '307', type: '1 Bedroom', rent: 1200 },
    { unit: '402', type: '1 Bedroom', rent: 1200 },
    { unit: '405', type: '1 Bedroom', rent: 1200 },
  ],
  'catalina-estates': [{ unit: '2', type: '1 Bedroom', rent: 1125 }],
  layali: [
    { unit: '7', type: '1 Bedroom', rent: 1025 },
    { unit: '15', type: '2 Bedroom', rent: 1350 },
  ],
  'cedar-manor': [
    { unit: '2', type: '1 Bedroom', rent: 1015 },
    { unit: '5', type: '1 Bedroom', rent: 1015 },
    { unit: '7', type: '1 Bedroom', rent: 1015 },
    { unit: '8', type: '1 Bedroom', rent: 1015 },
    { unit: '15', type: '1 Bedroom', rent: 1015 },
    { unit: '17', type: '1 Bedroom', rent: 1015 },
  ],
  'courts-manor': [{ unit: '5', type: '1 Bedroom', rent: 1015 }],
  'royal-manor': [
    { unit: '9', type: '1 Bedroom', rent: 1185 },
    { unit: '12', type: '1 Bedroom', rent: 1238 },
  ],
  palisades: [
    { unit: '204', type: '1 Bedroom', rent: 1090 },
    { unit: '205', type: '2 Bedroom', rent: 1360 },
  ],
  acadian: [
    { unit: '103', type: 'Studio', rent: 950 },
    { unit: '106', type: '1 Bedroom', rent: 1115 },
    { unit: '201', type: '1 Bedroom', rent: 1095 },
    { unit: '205', type: '1 Bedroom', rent: 1220 },
    { unit: '207', type: '1 Bedroom', rent: 1135 },
    { unit: '306', type: '1 Bedroom', rent: 1150 },
    { unit: '302', type: '2 Bedroom', rent: 1295 },
  ],
  parkdale: [
    { unit: '202', type: '2 Bedroom', rent: 1280 },
    { unit: '208', type: '2 Bedroom', rent: 1245 },
  ],
  strathearn: [{ unit: '1', type: '1 Bedroom', rent: 1090 }],
  beverly: [{ unit: '203', type: '1 Bedroom', rent: 1050 }],
};

/** ZenRentals per-floor-plan "View Details" links by bedroom type
 *  (0=Studio, 1..3=bedrooms), from the client (2026). Session tracking params
 *  are stripped — ZenRentals re-adds its own on load. The Apply button for a
 *  unit links to the matching bedroom type here. */
const APPLY_LINKS: Record<string, Partial<Record<0 | 1 | 2 | 3, string>>> = {
  woodridge: {
    1: 'https://zenrentals.securecafe.com/onlineleasing/woodridge-5/floorplans/1-bedroom',
    2: 'https://zenrentals.securecafe.com/onlineleasing/woodridge-5/floorplans/2-bedroom',
  },
  kafa: {
    0: 'https://zenrentals.securecafe.com/onlineleasing/kafa-manor/floorplans/studio',
    1: 'https://zenrentals.securecafe.com/onlineleasing/kafa-manor/floorplans/1-bedroom-1-bath',
  },
  'cedar-manor': {
    0: 'https://zenrentals.securecafe.com/onlineleasing/cedar-manor1/floorplans/studio',
    1: 'https://zenrentals.securecafe.com/onlineleasing/cedar-manor1/floorplans/1-bedroom',
  },
  'courts-manor': {
    0: 'https://zenrentals.securecafe.com/onlineleasing/courts-manor/floorplans/studio',
    1: 'https://zenrentals.securecafe.com/onlineleasing/courts-manor/floorplans/1-bedroom',
    2: 'https://zenrentals.securecafe.com/onlineleasing/courts-manor/floorplans/2-bedroom',
  },
  'oakwood-manor': {
    0: 'https://zenrentals.securecafe.com/onlineleasing/oakwood-manor2/floorplans/studio',
    1: 'https://zenrentals.securecafe.com/onlineleasing/oakwood-manor2/floorplans/1-bedroom',
  },
  layali: {
    1: 'https://zenrentals.securecafe.com/onlineleasing/layali-house/floorplans/1-bedroom',
    2: 'https://zenrentals.securecafe.com/onlineleasing/layali-house/floorplans/2-bedroom',
  },
  'catalina-estates': {
    1: 'https://zenrentals.securecafe.com/onlineleasing/catalina-estates/floorplans/1-bedroom',
    2: 'https://zenrentals.securecafe.com/onlineleasing/catalina-estates/floorplans/2-bedroom',
  },
  'sky-manor': {
    1: 'https://zenrentals.securecafe.com/onlineleasing/sky-manor/floorplans/1-bedroom',
    2: 'https://zenrentals.securecafe.com/onlineleasing/sky-manor/floorplans/2-bedroom',
    3: 'https://zenrentals.securecafe.com/onlineleasing/sky-manor/floorplans/3-bedroom',
  },
  'chicklet-house': {
    0: 'https://zenrentals.securecafe.com/onlineleasing/chicklet-house/floorplans/studio',
    1: 'https://zenrentals.securecafe.com/onlineleasing/chicklet-house/floorplans/1-bedroom',
    2: 'https://zenrentals.securecafe.com/onlineleasing/chicklet-house/floorplans/2-bedroom',
  },
  hamlet: {
    0: 'https://zenrentals.securecafe.com/onlineleasing/hamlet-village/floorplans/studio',
    1: 'https://zenrentals.securecafe.com/onlineleasing/hamlet-village/floorplans/1-bedroom',
  },
  'royal-lady': {
    0: 'https://zenrentals.securecafe.com/onlineleasing/royal-lady/floorplans/studio',
    1: 'https://zenrentals.securecafe.com/onlineleasing/royal-lady/floorplans/1-bedroom',
  },
  'royal-manor': {
    0: 'https://zenrentals.securecafe.com/onlineleasing/royal-manor2/floorplans/studio',
    1: 'https://zenrentals.securecafe.com/onlineleasing/royal-manor2/floorplans/1-bedroom',
  },
  'balwin-manor': {
    1: 'https://zenrentals.securecafe.com/onlineleasing/balwin-manor/floorplans/1-bedroom',
    2: 'https://zenrentals.securecafe.com/onlineleasing/balwin-manor/floorplans/2-bedroom',
  },
  // ZenRentals slug for Acadian House is "house-acadian".
  acadian: {
    0: 'https://zenrentals.securecafe.com/onlineleasing/house-acadian/floorplans/studio',
    1: 'https://zenrentals.securecafe.com/onlineleasing/house-acadian/floorplans/1-bedroom',
    2: 'https://zenrentals.securecafe.com/onlineleasing/house-acadian/floorplans/2-bedroom',
  },
  palisades: {
    0: 'https://zenrentals.securecafe.com/onlineleasing/palisades4/floorplans/studio',
    1: 'https://zenrentals.securecafe.com/onlineleasing/palisades4/floorplans/1-bedroom',
    2: 'https://zenrentals.securecafe.com/onlineleasing/palisades4/floorplans/2-bedroom',
  },
  // ZenRentals slug for Beverly Heights is "beverly-manor".
  beverly: {
    1: 'https://zenrentals.securecafe.com/onlineleasing/beverly-manor/floorplans/1-bedroom',
    2: 'https://zenrentals.securecafe.com/onlineleasing/beverly-manor/floorplans/2-bedroom',
  },
  parkdale: {
    1: 'https://zenrentals.securecafe.com/onlineleasing/parkdale-terrace0/floorplans/1-bedroom',
    2: 'https://zenrentals.securecafe.com/onlineleasing/parkdale-terrace0/floorplans/2-bedroom',
  },
  strathearn: {
    1: 'https://zenrentals.securecafe.com/onlineleasing/strathearn-place/floorplans/1-bedroom',
  },
  // "Bachelor" is ZenRentals' slug for Studio.
  rivergate: {
    0: 'https://zenrentals.securecafe.com/onlineleasing/rivergate2/floorplans/bachelor',
    1: 'https://zenrentals.securecafe.com/onlineleasing/rivergate2/floorplans/1-bedroom-1-bath',
  },
  pioneer: {
    0: 'https://zenrentals.securecafe.com/onlineleasing/pioneer-apartments6/floorplans/bachelor',
    1: 'https://zenrentals.securecafe.com/onlineleasing/pioneer-apartments6/floorplans/1-bedroom',
    2: 'https://zenrentals.securecafe.com/onlineleasing/pioneer-apartments6/floorplans/2-bedroom',
    3: 'https://zenrentals.securecafe.com/onlineleasing/pioneer-apartments6/floorplans/3-bedroom',
  },
  // The Edge has multiple 2-bed plans; the bedroom-type table links the base one.
  edge: {
    1: 'https://zenrentals.securecafe.com/onlineleasing/the-edge14/floorplans/1-bedroom-p22l33u1ws-den',
    2: 'https://zenrentals.securecafe.com/onlineleasing/the-edge14/floorplans/2-bedroom',
  },
};

/** Apply/"View Details" URL for a building + bedroom type, if provided. */
export const applyUrlFor = (slug: string, bed: number): string | undefined =>
  APPLY_LINKS[slug]?.[bed as 0 | 1 | 2 | 3];

/** ZenRentals resident-services property slug per building (from the client's
 *  Resident Portals sheet). Resident Portal + Maintenance Request links derive
 *  from this. Buildings not listed have no portal yet ("coming soon"). */
const ZEN_SLUG: Record<string, string> = {
  woodridge: 'woodridge-5',
  'royal-lady': 'royal-lady',
  acadian: 'house-acadian',
  parkdale: 'parkdale-terrace0',
  'cedar-manor': 'cedar-manor1',
  layali: 'layali-house',
  palisades: 'palisades4',
  'courts-manor': 'courts-manor',
  'royal-manor': 'royal-manor2',
  hamlet: 'hamlet-village',
  kafa: 'kafa-manor',
  'catalina-estates': 'catalina-estates',
  strathearn: 'strathearn-place',
  beverly: 'beverly-manor',
  'chicklet-house': 'chicklet-house',
  'copper-manor': 'copper-manor',
  'sky-manor': 'sky-manor',
  'grandview-manor': 'grandview-manor1',
  'oakwood-manor': 'oakwood-manor2',
  'balwin-manor': 'balwin-manor',
  pioneer: 'pioneer-apartments6',
  rivergate: 'rivergate2',
  'arbour-green': 'arbour-green-2757506-alberta-ltd',
};

/** Resident Portal + Maintenance Request URLs for a building, if it has a
 *  ZenRentals portal. Returns undefined when none exists yet. */
export const portalLinksFor = (
  slug: string
): { portal: string; maintenance: string } | undefined => {
  const z = ZEN_SLUG[slug];
  if (!z) return undefined;
  const base = `https://zenrentals.securecafe.com/residentservices/${z}`;
  return { portal: `${base}/userlogin.aspx`, maintenance: `${base}/maintenance.aspx` };
};

function makeResidence(raw: RawAsset, _idx: number): Residence {
  const seed = hashSeed(raw.slug);
  const cityLabel = CITIES[raw.city].label;
  const units = UNITS[raw.slug];

  let bedroomOptions: number[];
  let prices: Partial<Record<0 | 1 | 2 | 3, number>>;
  if (units && units.length) {
    // Availability sheet is the source of truth: bedroom types + net rent
    // (min per type) come from the actual available units.
    prices = {};
    units.forEach((u) => {
      const n = UNIT_TYPE_TO_NUM[u.type];
      if (n === undefined) return;
      const cur = prices[n];
      prices[n] = cur === undefined ? u.rent : Math.min(cur, u.rent);
    });
    bedroomOptions = (Object.keys(prices) as unknown as number[])
      .map(Number)
      .sort((a, b) => a - b);
  } else {
    // No sheet units: fall back to the configured bedrooms + promo pricing.
    bedroomOptions = raw.bedrooms
      ?? (raw.city === 'edmonton'
        ? [0, 1, 2, 3]
        : BEDROOM_VARIANTS[seed % BEDROOM_VARIANTS.length]);
    const card = pricesFor(raw);
    prices = {};
    bedroomOptions.forEach((b) => {
      const v = card[b as 0 | 1 | 2 | 3];
      if (v !== undefined) prices[b as 0 | 1 | 2 | 3] = v;
    });
  }
  const priceFrom = Math.min(...(Object.values(prices) as number[]));
  // Promotional banner (client promo is scoped to Edmonton properties).
  const promo = raw.city === 'edmonton' ? promoText(freeMonthsFor(raw.slug)) : undefined;

  const real = REAL_PHOTOS[raw.slug];
  // Card image: always honour real photo if present. hideDetailGallery
  // only skips the gallery on the detail page, not the listing card.
  const heroImage = real?.hero || HERO_POOL[seed % HERO_POOL.length];
  const gallery = raw.hideDetailGallery
    ? []
    : (real?.gallery ?? pickN(GALLERY_POOL, 5, seed));

  const curated = CURATED[raw.slug];
  const features = curated?.features ?? pickN(FEATURE_POOL, 6, seed >> 1);
  const amenities = curated?.amenities ?? pickN(AMENITY_POOL, 6, seed >> 2);
  const availability: Availability = 'available';
  const featured = raw.featured ?? false;

  const streetLine = raw.address.split(',')[0];
  const copy = COPY[raw.slug];

  return {
    id: `r-${raw.slug}`,
    slug: raw.slug,
    name: raw.name,
    city: raw.city,
    cityLabel,
    address: raw.address,
    coordinates: coordsFor(raw.slug, raw.city),
    neighbourhood: copy?.neighbourhood,
    tier: copy?.tier,
    description: copy?.description
      ?? `${raw.name}, a Balto residence at ${streetLine} in ${cityLabel}.`,
    longDescription: copy
      ? TIER_LINE[copy.tier]
      : `${raw.name} is held within the Balto portfolio at ${raw.address}. The building is operated to the Balto standard, restored where appropriate, maintained by a resident manager, and let on terms intended to favour long stays. Detailed unit plans, finishes, and current availability are released on request.`,
    bedrooms: bedroomLabel(bedroomOptions),
    bedroomOptions,
    prices,
    priceFrom,
    promo,
    availability,
    featured,
    hideDetailGallery: raw.hideDetailGallery,
    incentives: raw.incentives,
    unitLabels: raw.unitLabels,
    units,
    heroImage,
    gallery,
    features,
    amenities,
    nearbyPoints: copy?.closeTo ?? [
      'Within walking distance of local shops and cafés',
      'Public transit within a short walk',
      'Quiet residential setting',
    ],
  };
}

export const RESIDENCES: Residence[] = ASSETS.map((raw, idx) => makeResidence(raw, idx));

export const getCity = (slug: string): City | undefined =>
  (CITIES as Record<string, City>)[slug];
export const getResidence = (slug: string): Residence | undefined =>
  RESIDENCES.find((r) => r.slug === slug);
export const residencesByCity = (slug: string): Residence[] =>
  RESIDENCES.filter((r) => r.city === slug);
export const featuredResidences = (): Residence[] =>
  RESIDENCES.filter((r) => r.featured);

export const formatPrice = (n: number): string => '$' + n.toLocaleString('en-US');

export function bedroomShort(opts: number[]): string {
  const parts = opts.map((b) => (b === 0 ? 'Studio' : String(b)));
  const onlyStudio = opts.length === 1 && opts[0] === 0;
  return parts.join(' · ') + (onlyStudio ? '' : ' Bedrooms');
}
