import buildingsJson from '@/content/buildings.json';
import copyJson from '@/content/copy.json';
import amenitiesJson from '@/content/amenities.json';
import photosJson from '@/content/photos.json';
import unitsJson from '@/content/units.json';
import linksJson from '@/content/links.json';
import citiesJson from '@/content/cities.json';
import geocodedJson from '@/content/geocoded.json';
import taxonomiesJson from '@/content/taxonomies.json';

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

/** City slugs are dynamic — the client can add markets from the CMS
 *  (content/cities.json), so this is an open string rather than a union. */
export type CitySlug = string;

export interface City {
  slug: CitySlug;
  label: string;
  province: string;
  image: string;
  blurb: string;
  bounds: { minLng: number; maxLng: number; minLat: number; maxLat: number };
  /** Map centre + jitter spread for properties that haven't been geocoded. */
  center?: { lat: number; lng: number; spreadLat: number; spreadLng: number };
  /** Market is announced but not yet live, render as register-interest, not listings. */
  comingSoon?: boolean;
}

export const CITIES: Record<string, City> = citiesJson as Record<string, City>;

/** Cities in display order: live markets first, coming-soon markets last. */
export const CITY_LIST: City[] = Object.values(CITIES);
export const LIVE_CITIES: City[] = CITY_LIST.filter((c) => !c.comingSoon);
export const COMING_SOON_CITIES: City[] = CITY_LIST.filter((c) => c.comingSoon);

export type Availability = 'available' | 'coming-soon';

/** Description voice per the Build Spec. Tiers are client-editable in the CMS
 *  (content/taxonomies.json), so this is an open string rather than a union. */
export type Tier = string;

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
  /** CMS photo tags keyed by image path (e.g. "Studio", "1 Bedroom") — shown
   *  as badges and used to group the View-all-photos gallery. */
  photoTags?: Record<string, string>;
  /** CMS alt text keyed by image path. */
  photoAlt?: Record<string, string>;
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
  /** Per-unit Google Drive photo folder (from the sheet's Pictures column).
   *  Kept for reference; the site now serves the downloaded `images` instead. */
  image?: string;
  /** Local per-unit photos (downloaded from the Drive folder). "View" opens
   *  these in an in-site tile grid + lightbox. */
  images?: string[];
  /** Unit-specific ZenRentals apply URL. Overrides the per-bedroom-type link. */
  applyUrl?: string;
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
  /** Archived in the CMS: kept in content/buildings.json but never rendered. */
  archived?: boolean;
  /** Homepage featured-card order (lower first). Unranked featured go last. */
  featuredRank?: number;
}

// NOTE: `slug` is the stable URL + asset-folder key, keep it fixed across
// renames. `name` is the public display name per the Build Spec (Part Two).
const ASSETS: RawAsset[] = buildingsJson as unknown as RawAsset[];

/** Map centre + jitter spread per city, from content/cities.json. */
const DEFAULT_CENTER = { lat: 53.545, lng: -113.493, spreadLat: 0.045, spreadLng: 0.07 };
const centerFor = (city: CitySlug) => CITIES[city]?.center ?? DEFAULT_CENTER;

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Real lat/lng per property (content/geocoded.json), geocoded via OSM
 *  Nominatim — by scripts/geocode.mjs or the CMS "Fix map pin" button. */
const GEOCODED: Record<string, { lat: number; lng: number }> =
  geocodedJson as Record<string, { lat: number; lng: number }>;

function coordsFor(slug: string, city: CitySlug): { lat: number; lng: number } {
  const real = GEOCODED[slug];
  if (real) return real;
  // Fallback for new properties that haven't been geocoded yet.
  const c = centerFor(city);
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

// Fallback amenity pool for buildings the client's doc doesn't cover.
// Roof terrace is excluded everywhere per the client (not a real amenity).
const AMENITY_POOL = [
  'Resident concierge',
  'Bicycle storage',
  'Heated underground parking',
  'Surface parking',
  'Pet-friendly',
  'Storage lockers',
  'Resident lounge',
  'Courtyard garden',
  'Mail and parcel concierge',
];

const HEAT = 'Heat and hot water included';
/** Per-building Residence Features + Building Amenities, copied verbatim from
 *  the client's "Properties Descriptions Checklist" sheet (2026). The sheet is
 *  the single source of truth: each building shows exactly what its row lists,
 *  and anything not on the sheet is removed. Casing is normalised to the site
 *  style; the item set matches the sheet. "Heat and hot water included" = HEAT.
 *  Six buildings are absent from the sheet (britnell-landing, edge, cielo,
 *  greyson, lawson-village, lockwood-arms) and keep their pool fallback. */
const CURATED: Record<string, { features: string[]; amenities: string[] }> =
  amenitiesJson as unknown as Record<string, { features: string[]; amenities: string[] }>;

function pickN<T>(pool: T[], n: number, seed: number): T[] {
  const len = pool.length;
  const count = Math.min(n, len);
  const offset = Math.abs(seed) % len;
  return Array.from({ length: count }, (_, k) => pool[(offset + k) % len]);
}

// (Unsplash hero/gallery fallback pools removed - every building has real or
// coming-soon imagery managed via content/photos.json.)

function bedroomLabel(opts: number[]): string {
  const parts = opts.map((b) => (b === 0 ? 'Studio' : String(b)));
  const onlyStudio = opts.length === 1 && opts[0] === 0;
  return parts.join(' · ') + (onlyStudio ? '' : ' Bedrooms');
}

/** Per-building photo sets synced into public/assets/<slug>/ and managed by
 *  the CMS in content/photos.json. `hidden` lists image paths the client has
 *  hidden in the admin portal - they stay on disk but never render. */
export interface PhotoSet {
  hero?: string | null;
  gallery: string[];
  hidden?: string[];
  /** Tag per image path (e.g. "Studio") — badges + gallery grouping. */
  tags?: Record<string, string>;
  /** Alt text per image path. */
  alt?: Record<string, string>;
}
const REAL_PHOTOS: Record<string, PhotoSet> = photosJson as unknown as Record<string, PhotoSet>;

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

const COPY: Record<string, BuildingCopy> = copyJson as unknown as Record<string, BuildingCopy>;

/** Client-editable taxonomies (CMS Library): building tiers (with their
 *  standard Overview condition line) and unit types (with bedroom counts). */
interface Taxonomies {
  tiers: Array<{ value: string; label: string; line: string }>;
  unitTypes: Array<{ label: string; bedrooms: number }>;
  photoTags: string[];
}
export const TAXONOMIES: Taxonomies = taxonomiesJson as Taxonomies;

/** Standard condition line per tier, used as the second Overview paragraph. */
const TIER_LINE: Record<string, string> = Object.fromEntries(
  TAXONOMIES.tiers.map((t) => [t.value, t.line])
);
const GENERIC_TIER_LINE =
  'Operated to the Balto standard, family-operated and locally managed, with a one-business-day maintenance standard.';

/** Unit-type label → bedroom count (0=Studio), from the CMS taxonomies. */
const UNIT_TYPE_TO_NUM: Record<string, number> = Object.fromEntries(
  TAXONOMIES.unitTypes.map((u) => [u.label, u.bedrooms])
);
const UNITS: Record<string, Unit[]> = unitsJson as unknown as Record<string, Unit[]>;

/** ZenRentals per-floor-plan "View Details" links by bedroom type
 *  (0=Studio, 1..3=bedrooms), from the client (2026). Session tracking params
 *  are stripped — ZenRentals re-adds its own on load. The Apply button for a
 *  unit links to the matching bedroom type here. */
const APPLY_LINKS: Record<string, Partial<Record<0 | 1 | 2 | 3, string>>> =
  linksJson.applyLinks as unknown as Record<string, Partial<Record<0 | 1 | 2 | 3, string>>>;

/** Apply/"View Details" URL for a building + bedroom type, if provided. */
export const applyUrlFor = (slug: string, bed: number): string | undefined =>
  APPLY_LINKS[slug]?.[bed as 0 | 1 | 2 | 3];

/** ZenRentals resident-services property slug per building (from the client's
 *  Resident Portals sheet). Resident Portal + Maintenance Request links derive
 *  from this. Buildings not listed have no portal yet ("coming soon"). */
const ZEN_SLUG: Record<string, string> = linksJson.zenSlugs as Record<string, string>;

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
  const cityLabel = CITIES[raw.city]?.label ?? raw.city;
  const units = UNITS[raw.slug];

  let bedroomOptions: number[];
  let prices: Partial<Record<0 | 1 | 2 | 3, number>>;
  if (units && units.length) {
    // Availability sheet is the source of truth: bedroom types + net rent
    // (min per type) come from the actual available units.
    prices = {};
    units.forEach((u) => {
      const n = UNIT_TYPE_TO_NUM[u.type];
      if (n === undefined || n < 0 || n > 3) return;
      const bed = n as 0 | 1 | 2 | 3;
      const cur = prices[bed];
      prices[bed] = cur === undefined ? u.rent : Math.min(cur, u.rent);
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
  const hiddenSet = new Set(real?.hidden ?? []);
  // Card image: honour the real photo when present and not hidden in the CMS.
  // hideDetailGallery only skips the gallery on the detail page, not the card.
  const visibleHero = real?.hero && !hiddenSet.has(real.hero) ? real.hero : undefined;
  const heroImage = visibleHero || '/assets/coming-soon.png';
  const gallery = raw.hideDetailGallery
    ? []
    : (real?.gallery ?? []).filter((src) => !hiddenSet.has(src));

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
      ? TIER_LINE[copy.tier] ?? GENERIC_TIER_LINE
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
    photoTags: real?.tags,
    photoAlt: real?.alt,
    features,
    amenities,
    nearbyPoints: copy?.closeTo ?? [
      'Within walking distance of local shops and cafés',
      'Public transit within a short walk',
      'Quiet residential setting',
    ],
  };
}

/** Live residences only — archived buildings stay in the CMS but never render. */
export const RESIDENCES: Residence[] = ASSETS.filter((a) => !a.archived).map(
  (raw, idx) => makeResidence(raw, idx)
);

const FEATURED_RANK: Record<string, number> = Object.fromEntries(
  ASSETS.filter((a) => a.featuredRank !== undefined).map((a) => [a.slug, a.featuredRank as number])
);

export const getCity = (slug: string): City | undefined => CITIES[slug];
export const getResidence = (slug: string): Residence | undefined =>
  RESIDENCES.find((r) => r.slug === slug);
export const residencesByCity = (slug: string): Residence[] =>
  RESIDENCES.filter((r) => r.city === slug);
export const featuredResidences = (): Residence[] =>
  RESIDENCES.filter((r) => r.featured).sort(
    (a, b) => (FEATURED_RANK[a.slug] ?? Infinity) - (FEATURED_RANK[b.slug] ?? Infinity)
  );

export const formatPrice = (n: number): string => '$' + n.toLocaleString('en-US');

export function bedroomShort(opts: number[]): string {
  const parts = opts.map((b) => (b === 0 ? 'Studio' : String(b)));
  const onlyStudio = opts.length === 1 && opts[0] === 0;
  return parts.join(' · ') + (onlyStudio ? '' : ' Bedrooms');
}
