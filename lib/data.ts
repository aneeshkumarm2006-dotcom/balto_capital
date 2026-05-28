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
}

export const CITIES: Record<CitySlug, City> = {
  saskatoon: {
    slug: 'saskatoon',
    label: 'Saskatoon',
    province: 'Saskatchewan',
    image: '/assets/city-saskatoon.png',
    blurb: 'Where the South Saskatchewan curves through prairie light. Riverside heritage homes and warm-brick mid-rises.',
    bounds: { minLng: -106.685, maxLng: -106.620, minLat: 52.115, maxLat: 52.150 },
  },
  edmonton: {
    slug: 'edmonton',
    label: 'Edmonton',
    province: 'Alberta',
    image: '/assets/city-edmonton.png',
    blurb: 'River valley city of bridges and balconies. Heritage neighbourhoods edge the most generous urban park in North America.',
    bounds: { minLng: -113.555, maxLng: -113.470, minLat: 53.520, maxLat: 53.560 },
  },
  regina: {
    slug: 'regina',
    label: 'Regina',
    province: 'Saskatchewan',
    image: '/assets/city-regina.png',
    blurb: 'Wide skies, ordered streets, and Wascana — the lake-park that anchors the city. A quiet capital with conviction.',
    bounds: { minLng: -104.640, maxLng: -104.580, minLat: 50.430, maxLat: 50.460 },
  },
  yellowknife: {
    slug: 'yellowknife',
    label: 'Yellowknife',
    province: 'Northwest Territories',
    image: '/assets/city-yellowknife.avif',
    blurb: 'Aurora-touched, lakeside, gold-quiet — the capital of the Northwest Territories, where Great Slave Lake meets the long Northern night.',
    bounds: { minLng: -114.420, maxLng: -114.330, minLat: 62.430, maxLat: 62.475 },
  },
};

export type Availability = 'available' | 'coming-soon';

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
  bathrooms: string;
  /** Monthly rent by bedroom count. Keys: 0=Studio, 1..3=Bedroom count. */
  prices: Partial<Record<0 | 1 | 2 | 3, number>>;
  /** Minimum across `prices` — used on cards / "From $X/mo" labels. */
  priceFrom: number;
  availability: Availability;
  featured: boolean;
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

/** Standard Edmonton rate card — applies to every Edmonton property except
 *  Woodridge. Studio / 1BR / 2BR / 3BR. */
const EDMONTON_RATES: Record<0 | 1 | 2 | 3, number> = {
  0: 1100, 1: 1300, 2: 1500, 3: 1600,
};
const WOODRIDGE_RATES: Record<0 | 1 | 2 | 3, number> = {
  0: 1150, 1: 1350, 2: 1550, 3: 1700,
};

/* ============================================================
   BALTO CAPITAL — assets (real portfolio, 28 residences)
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
  /** Per-asset alternate views — see Palisades for the canonical example. */
  hideDetailGallery?: boolean;
  incentives?: string[];
  unitLabels?: string[];
}

const ASSETS: RawAsset[] = [
  // Woodridge first, Palisades second per portfolio ordering. Palisades runs an
  // alternate text-forward view (no imagery, Incentives + Unit Photos blocks).
  { slug: 'woodridge',        name: 'Woodridge',        city: 'edmonton',  address: '10139 158 ST NW, Edmonton, AB T5P 2X9', featured: true },
  {
    slug: 'palisades',        name: 'Palisades',        city: 'edmonton',  address: '10825 113 ST NW, Edmonton, AB T5H 3J1', featured: true,
    hideDetailGallery: true,
    incentives: [
      'Early move-in opportunity.',
      'Up to 2 months free.',
      'In-suite washer/dryer adds units for +$100/month.',
    ],
    unitLabels: ['Unit 102', 'Unit 104', 'Unit 105', 'Unit 204', 'Unit 303', 'Unit 306'],
  },
  { slug: 'hamlet',           name: 'Hamlet',           city: 'edmonton',  address: '11647 124 ST NW, Edmonton, AB T5M 0K8' },
  { slug: 'copper-manor',     name: 'Copper Manor',     city: 'edmonton',  address: '13011 83 ST NW, Edmonton, AB T5E 2W5' },
  { slug: 'kafa',             name: 'Kafa',             city: 'edmonton',  address: '12717 119 ST NW, Edmonton, AB T5E 5M2' },
  { slug: 'royal-lady',       name: 'Royal Lady',       city: 'edmonton',  address: '10746 102 ST NW, Edmonton, AB T5H 2T7', featured: true },
  { slug: 'catalina-estates', name: 'Catalina Estates', city: 'edmonton',  address: '5910 118 Ave NW, Edmonton, AB T5W 1E5' },
  { slug: 'layali',           name: 'Layali',           city: 'edmonton',  address: '13710 64 ST NW, Edmonton, AB T5A 1R9' },
  { slug: 'sky-manor',        name: 'Sky Manor',        city: 'edmonton',  address: '9612 156 ST NW, Edmonton, AB T5P 2N7' },
  { slug: 'grandview-manor',  name: 'Grandview Manor',  city: 'edmonton',  address: '11705 83 ST NW, Edmonton, AB T5B 2Z1', featured: true },
  { slug: 'cedar-manor',      name: 'Cedar Manor',      city: 'edmonton',  address: '12040 82 ST NW, Edmonton, AB T5B 2W6' },
  { slug: 'courts-manor',     name: 'Courts Manor',     city: 'edmonton',  address: '12239 82 ST NW, Edmonton, AB T5B 2W9' },
  { slug: 'oakwood-manor',    name: 'Oakwood Manor',    city: 'edmonton',  address: '11348 97 ST NW, Edmonton, AB T5G 1X4' },
  { slug: 'royal-10215',      name: 'Royal 10215',      city: 'edmonton',  address: '10215 108 Ave NW, Edmonton, AB T5H 1A9' },
  { slug: 'balwin-manor',     name: 'Balwin Manor',     city: 'edmonton',  address: '6704 131A AVE NW, Edmonton, AB T5C 1Z6' },
  { slug: 'acadian',          name: 'Acadian',          city: 'edmonton',  address: '11535 124 ST NW, Edmonton, AB T5M 0K5' },
  { slug: 'parkdale',         name: 'Parkdale',         city: 'edmonton',  address: '8021 115 Ave NW, Edmonton, AB T5B 4W7' },
  { slug: 'beverly',          name: 'Beverly',          city: 'edmonton',  address: '11312 34 ST NW, Edmonton, AB T5W 1Y9' },
  { slug: 'strathearn',       name: 'Strathearn',       city: 'edmonton',  address: '9510 85 ST NW, Edmonton, AB T6C 3E2' },
  { slug: 'pioneer',          name: 'Pioneer',          city: 'edmonton',  address: '12929 / 12921 127 ST NW, Edmonton, AB T5L 1B1' },
  { slug: 'rivergate',        name: 'Rivergate',        city: 'edmonton',  address: '11040 82 ST NW, Edmonton, AB T5H 1L9' },
  { slug: 'arbour-green',     name: 'Arbour Green',     city: 'edmonton',  address: '12036 - 66 Street, Edmonton, AB' },
  { slug: 'ten-one-26-154',   name: '10126-154',        city: 'edmonton',  address: '10126 154 St, Edmonton, AB T5P 2H3' },
  { slug: 'britnell-landing', name: 'Britnell Landing', city: 'edmonton',  address: '16255 51 St NW, Edmonton, AB T5Y 0V6' },
  { slug: 'edge',             name: 'Edge',             city: 'edmonton',  address: '3005 – 3011 James Mowatt Trail SW, Edmonton, AB' },
  { slug: 'cielo-greyson',    name: 'Cielo & Greyson',  city: 'saskatoon', address: '235 Willis Cres, Saskatoon, SK S7T 0W7' },
  { slug: 'lawson',           name: 'Lawson',           city: 'saskatoon', address: '192 Pinehouse Drive, Saskatoon, SK S7K 7Z9' },
  { slug: 'lockwood',         name: 'Lockwood',         city: 'regina',    address: '193 / 197 Lockwood Road, Regina, SK S4S 6G9' },
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

function coordsFor(slug: string, city: CitySlug): { lat: number; lng: number } {
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
    ],
  },
  'catalina-estates': {
    hero: '/assets/catalina-estates/01-main.jpg',
    gallery: [],
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
    gallery: [],
  },
  // Palisades — card-only image. Detail page stays text-forward via
  // hideDetailGallery on the raw asset.
  palisades: {
    hero: '/assets/palisades/01-main.jpg',
    gallery: [],
  },
  'copper-manor':    { hero: '/assets/copper-manor/01-main.jpg',    gallery: [] },
  'grandview-manor': { hero: '/assets/grandview-manor/01-main.jpg', gallery: [] },
  'courts-manor':    { hero: '/assets/courts-manor/01-main.jpg',    gallery: [] },
  'oakwood-manor':   { hero: '/assets/oakwood-manor/01-main.jpg',   gallery: [] },
  'balwin-manor':    { hero: '/assets/balwin-manor/01-main.jpg',    gallery: [] },
};

/** Pricing per asset. Edmonton uses the standard rate card except for
 *  Woodridge which has its own. Other cities still use deterministic
 *  placeholders until real rates arrive. */
function pricesFor(raw: RawAsset, seed: number): Partial<Record<0 | 1 | 2 | 3, number>> {
  if (raw.slug === 'woodridge') return WOODRIDGE_RATES;
  if (raw.city === 'edmonton') return EDMONTON_RATES;
  // Placeholder for Saskatoon / Regina / Yellowknife — deterministic per-slug.
  const base = 1280 + ((seed >> 3) % 24) * 50; // 1280..2430
  return {
    0: base,
    1: base + 200,
    2: base + 400,
    3: base + 500,
  };
}

function makeResidence(raw: RawAsset, _idx: number): Residence {
  const seed = hashSeed(raw.slug);
  const cityLabel = CITIES[raw.city].label;
  // Every Edmonton property offers all four configs. Other cities keep
  // the deterministic variation until we know better.
  const bedroomOptions = raw.city === 'edmonton'
    ? [0, 1, 2, 3]
    : BEDROOM_VARIANTS[seed % BEDROOM_VARIANTS.length];
  const prices = pricesFor(raw, seed);
  const priceFrom = Math.min(...Object.values(prices) as number[]);

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

  return {
    id: `r-${raw.slug}`,
    slug: raw.slug,
    name: raw.name,
    city: raw.city,
    cityLabel,
    address: raw.address,
    coordinates: coordsFor(raw.slug, raw.city),
    description: `${raw.name} — a Balto residence at ${streetLine} in ${cityLabel}.`,
    longDescription: `${raw.name} is held within the Balto portfolio at ${raw.address}. The building is operated to the Balto standard — restored where appropriate, maintained by a resident manager, and let on terms intended to favour long stays. Detailed unit plans, finishes, and current availability are released on request.`,
    bedrooms: bedroomLabel(bedroomOptions),
    bedroomOptions,
    bathrooms: '1 – 2',
    prices,
    priceFrom,
    availability,
    featured,
    hideDetailGallery: raw.hideDetailGallery,
    incentives: raw.incentives,
    unitLabels: raw.unitLabels,
    heroImage,
    gallery,
    features,
    amenities,
    nearbyPoints: [
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
