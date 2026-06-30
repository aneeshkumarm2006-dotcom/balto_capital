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
  /** Short note explaining the advertised net-effective basis (incentive +
   *  lease term). Undefined for Woodridge, which is on its own rate card. */
  priceBasis?: string;
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
}

/** Non-renovated base rate card, applies to every property except Woodridge
 *  (across all cities). Studio / 1BR / 2BR / 3BR. */
const NON_RENOVATED_RATES: Record<0 | 1 | 2 | 3, number> = {
  0: 1100, 1: 1300, 2: 1500, 3: 1600,
};

/** Standard non-renovated incentive: up to this many months free, advertised
 *  as net effective rent over a (12 + freeMonths)-month lease -
 *  base × 12 / (12 + freeMonths). e.g. $1,100 × 12 / 14 = $942. */
const NON_RENOVATED_FREE_MONTHS = 2;
export const NON_RENOVATED_INCENTIVE = `Up to ${NON_RENOVATED_FREE_MONTHS} months free`;
const netEffective = (base: number): number =>
  Math.floor((base * 12) / (12 + NON_RENOVATED_FREE_MONTHS));

/** Net effective non-renovated card, what we advertise. */
const NON_RENOVATED_NET: Record<0 | 1 | 2 | 3, number> = {
  0: netEffective(NON_RENOVATED_RATES[0]),
  1: netEffective(NON_RENOVATED_RATES[1]),
  2: netEffective(NON_RENOVATED_RATES[2]),
  3: netEffective(NON_RENOVATED_RATES[3]),
};

/** Woodridge keeps its own (renovated-tier) rate card, excluded from the
 *  non-renovated net-effective scheme above. */
const WOODRIDGE_RATES: Record<0 | 1 | 2 | 3, number> = {
  0: 1150, 1: 1350, 2: 1550, 3: 1700,
};

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
}

// NOTE: `slug` is the stable URL + asset-folder key, keep it fixed across
// renames. `name` is the public display name per the Build Spec (Part Two).
const ASSETS: RawAsset[] = [
  { slug: 'chicklet-house',   name: 'Chicklet House',        city: 'edmonton',  address: '10304 107 Ave NW, Edmonton, AB T5H 0V8' },
  { slug: 'woodridge',        name: 'Westpark Living',       city: 'edmonton',  address: '10139 158 ST NW, Edmonton, AB T5P 2X9', featured: true },
  {
    slug: 'palisades',        name: 'Palisades',             city: 'edmonton',  address: '10825 113 ST NW, Edmonton, AB T5H 3J1', featured: true,
    incentives: [
      'Early move-in opportunity.',
      'Up to 2 months free.',
      'In-suite washer/dryer adds units for +$100/month.',
    ],
  },
  { slug: 'hamlet',           name: 'Hamlet Village',        city: 'edmonton',  address: '11647 124 ST NW, Edmonton, AB T5M 0K8' },
  { slug: 'copper-manor',     name: 'Copper Manor',          city: 'edmonton',  address: '13011 83 ST NW, Edmonton, AB T5E 2W5' },
  { slug: 'kafa',             name: 'Kafa Manor',            city: 'edmonton',  address: '12717 119 ST NW, Edmonton, AB T5E 5M2' },
  { slug: 'royal-lady',       name: 'The Crown Residence',   city: 'edmonton',  address: '10746 102 ST NW, Edmonton, AB T5H 2T7', featured: true },
  { slug: 'catalina-estates', name: 'Catalina Estates',      city: 'edmonton',  address: '5910 118 Ave NW, Edmonton, AB T5W 1E5' },
  { slug: 'layali',           name: 'Layali House',          city: 'edmonton',  address: '13710 64 ST NW, Edmonton, AB T5A 1R9' },
  { slug: 'sky-manor',        name: 'Sky Manor',             city: 'edmonton',  address: '9612 156 ST NW, Edmonton, AB T5P 2N7' },
  { slug: 'grandview-manor',  name: 'Grandview Manor',       city: 'edmonton',  address: '11705 83 ST NW, Edmonton, AB T5B 2Z1', featured: true },
  { slug: 'cedar-manor',      name: 'Cedar Manor',           city: 'edmonton',  address: '12040 82 ST NW, Edmonton, AB T5B 2W6' },
  { slug: 'courts-manor',     name: 'Courts Manor',          city: 'edmonton',  address: '12239 82 ST NW, Edmonton, AB T5B 2W9' },
  { slug: 'oakwood-manor',    name: 'Oakwood Manor',         city: 'edmonton',  address: '11348 97 ST NW, Edmonton, AB T5G 1X4' },
  { slug: 'royal-manor',      name: 'Royal Manor',           city: 'edmonton',  address: '10215 108 Ave NW, Edmonton, AB T5H 1A9', featured: true },
  { slug: 'balwin-manor',     name: 'Balwin Manor',          city: 'edmonton',  address: '6704 131A AVE NW, Edmonton, AB T5C 1Z6' },
  { slug: 'acadian',          name: '124 West Residences',   city: 'edmonton',  address: '11535 124 ST NW, Edmonton, AB T5M 0K5' },
  { slug: 'parkdale',         name: '115 Park Residences',   city: 'edmonton',  address: '8021 115 Ave NW, Edmonton, AB T5B 4W7' },
  { slug: 'beverly',          name: 'The Beverley 34',       city: 'edmonton',  address: '11312 34 ST NW, Edmonton, AB T5W 1Y9' },
  { slug: 'strathearn',       name: 'River Valley Residence', city: 'edmonton', address: '9510 85 ST NW, Edmonton, AB T6C 3E2' },
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

const AMENITY_POOL = [
  'Resident concierge',
  'Bicycle storage',
  'Heated underground parking',
  'Surface parking',
  'Pet-friendly',
  'Storage lockers',
  'Resident lounge',
  'Roof terrace',
  'Courtyard garden',
  'Mail and parcel concierge',
];

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
    gallery: [
      '/assets/acadian/02.jpg',
      '/assets/acadian/03.jpg',
      '/assets/acadian/04.jpg',
      '/assets/acadian/05.jpg',
      '/assets/acadian/06.jpg',
      '/assets/acadian/07.jpg',
      '/assets/acadian/08.jpg',
    ],
  },
  hamlet: {
    hero: '/assets/hamlet/01-main.jpg',
    gallery: [
      '/assets/hamlet/02.jpg',
      '/assets/hamlet/03.jpg',
      '/assets/hamlet/04.jpg',
      '/assets/hamlet/05.jpg',
      '/assets/hamlet/06.jpg',
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
    ],
  },
  'catalina-estates': {
    hero: '/assets/catalina-estates/01-main.jpg',
    gallery: [
      '/assets/catalina-estates/02.jpg',
      '/assets/catalina-estates/03.jpg',
      '/assets/catalina-estates/04.jpg',
      '/assets/catalina-estates/05.jpg',
      '/assets/catalina-estates/06.jpg',
    ],
  },
  layali: {
    hero: '/assets/layali/01-main.jpg',
    gallery: [
      '/assets/layali/02.jpg',
      '/assets/layali/03.jpg',
      '/assets/layali/04.jpg',
      '/assets/layali/05.jpg',
      '/assets/layali/06.jpg',
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
    gallery: [
      '/assets/cedar-manor/02.jpg',
      '/assets/cedar-manor/03.jpg',
      '/assets/cedar-manor/04.jpg',
      '/assets/cedar-manor/05.jpg',
      '/assets/cedar-manor/06.jpg',
      '/assets/cedar-manor/07.jpg',
      '/assets/cedar-manor/08.jpg',
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
    gallery: [
      '/assets/palisades/02.jpg',
      '/assets/palisades/03.jpg',
      '/assets/palisades/04.jpg',
      '/assets/palisades/05.jpg',
      '/assets/palisades/06.jpg',
      '/assets/palisades/07.jpg',
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
    gallery: [
      '/assets/courts-manor/02.jpg',
      '/assets/courts-manor/03.jpg',
      '/assets/courts-manor/04.jpg',
      '/assets/courts-manor/05.jpg',
      '/assets/courts-manor/06.jpg',
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
    hero: '/assets/coming-soon.png',
    gallery: [
      '/assets/parkdale/01-main.jpg',
      '/assets/parkdale/02.jpg',
      '/assets/parkdale/03.jpg',
      '/assets/parkdale/04.jpg',
      '/assets/parkdale/05.jpg',
      '/assets/parkdale/06.jpg',
      '/assets/parkdale/07.jpg',
      '/assets/parkdale/08.jpg',
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
    hero: '/assets/coming-soon.png',
    gallery: [
      '/assets/beverly/01-main.jpg',
      '/assets/beverly/02.jpg',
      '/assets/beverly/03.jpg',
      '/assets/beverly/04.jpg',
      '/assets/beverly/05.jpg',
      '/assets/beverly/06.jpg',
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

/** Pricing per asset. Every property except Woodridge uses the non-renovated
 *  net-effective card (all cities); Woodridge keeps its own rates. */
function pricesFor(raw: RawAsset): Partial<Record<0 | 1 | 2 | 3, number>> {
  if (raw.slug === 'woodridge') return WOODRIDGE_RATES;
  return NON_RENOVATED_NET;
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

function makeResidence(raw: RawAsset, _idx: number): Residence {
  const seed = hashSeed(raw.slug);
  const cityLabel = CITIES[raw.city].label;
  // Every Edmonton property offers all four configs. Other cities keep
  // the deterministic variation until we know better.
  const bedroomOptions = raw.city === 'edmonton'
    ? [0, 1, 2, 3]
    : BEDROOM_VARIANTS[seed % BEDROOM_VARIANTS.length];
  // Rate card may carry all four configs; keep only the bedrooms this
  // building actually offers so "From $X" reflects an available suite.
  const card = pricesFor(raw);
  const prices: Partial<Record<0 | 1 | 2 | 3, number>> = {};
  bedroomOptions.forEach((b) => {
    const v = card[b as 0 | 1 | 2 | 3];
    if (v !== undefined) prices[b as 0 | 1 | 2 | 3] = v;
  });
  const priceFrom = Math.min(...(Object.values(prices) as number[]));
  // Non-renovated net-effective pricing carries the standard incentive basis;
  // Woodridge is on its own card and keeps the generic note.
  const priceBasis = raw.slug === 'woodridge'
    ? undefined
    : `Reflects ${NON_RENOVATED_INCENTIVE.toLowerCase()} on a ${12 + NON_RENOVATED_FREE_MONTHS}-month lease.`;

  const real = REAL_PHOTOS[raw.slug];
  // Card image: always honour real photo if present. hideDetailGallery
  // only skips the gallery on the detail page, not the listing card.
  const heroImage = real?.hero || HERO_POOL[seed % HERO_POOL.length];
  const gallery = raw.hideDetailGallery
    ? []
    : (real?.gallery ?? pickN(GALLERY_POOL, 5, seed));

  const features = pickN(FEATURE_POOL, 6, seed >> 1);
  const amenities = pickN(AMENITY_POOL, 6, seed >> 2);
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
    priceBasis,
    availability,
    featured,
    hideDetailGallery: raw.hideDetailGallery,
    incentives: raw.incentives,
    unitLabels: raw.unitLabels,
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
