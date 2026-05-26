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
  detail_arch:  IMG('1503387762-abdef8da4d7c'),
} as const;

export type CitySlug = 'saskatoon' | 'edmonton' | 'regina';

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
  squareFeet: string;
  priceFrom: number;
  availability: Availability;
  featured: boolean;
  heroImage: string;
  gallery: string[];
  features: string[];
  amenities: string[];
  nearbyPoints: string[];
}

export const RESIDENCES: Residence[] = [
  {
    id: 'r-royal',
    slug: 'royal-apartments',
    name: 'Royal Apartments',
    city: 'edmonton',
    cityLabel: 'Edmonton',
    address: '10135 Saskatchewan Drive NW, Edmonton, AB T5W 1H1',
    coordinates: { lat: 53.530, lng: -113.518 },
    description: 'A handsomely restored 1920s brick residence overlooking the river valley.',
    longDescription: 'Set on Saskatchewan Drive with uninterrupted views across the river valley, the Royal is a 1920s brick residence quietly restored to a modern standard. Original mouldings, cast-iron radiators, and oversized casement windows remain — paired with new oak floors, marble baths, and a thoughtful concierge layer that defines the Balto standard.',
    bedrooms: 'Studio · 1 · 2 Bedrooms',
    bedroomOptions: [0, 1, 2],
    bathrooms: '1 – 2',
    squareFeet: '480 – 1,180',
    priceFrom: 1450,
    availability: 'available',
    featured: true,
    heroImage: IMAGES.heritage1,
    gallery: [IMAGES.int_living1, IMAGES.int_kitchen1, IMAGES.int_bed1, IMAGES.int_bath1, IMAGES.detail_brick],
    features: [
      'Original cast-iron casement windows',
      'Quarter-sawn oak floors',
      'Marble bathrooms with vintage fixtures',
      'In-suite laundry',
      'Restored fireplace mantels (select suites)',
      'Bosch kitchen appliances',
    ],
    amenities: [
      'River valley terrace',
      'Reading room and library',
      'Resident concierge',
      'Bicycle storage',
      'Pet-friendly',
      'Heated underground parking',
    ],
    nearbyPoints: [
      'High Level Bridge — 4 min walk',
      'Whyte Avenue — 8 min walk',
      'University of Alberta — 12 min walk',
      'Mill Creek Ravine — 6 min walk',
    ],
  },
  {
    id: 'r-whyte-heritage',
    slug: 'whyte-heritage',
    name: 'Whyte Heritage',
    city: 'edmonton',
    cityLabel: 'Edmonton',
    address: '10456 82 Avenue NW, Edmonton, AB T6E 2A2',
    coordinates: { lat: 53.518, lng: -113.495 },
    description: 'A restored Edwardian on the quiet end of Old Strathcona.',
    longDescription: 'On a tree-lined block at the eastern edge of Old Strathcona, Whyte Heritage occupies a fully restored 1908 Edwardian. Wide-plank floors, brass hardware, and reading nooks built into every suite. A short walk to the avenue, with the privacy of a residential street.',
    bedrooms: '1 · 2 Bedrooms',
    bedroomOptions: [1, 2],
    bathrooms: '1 – 2',
    squareFeet: '620 – 1,050',
    priceFrom: 1680,
    availability: 'available',
    featured: true,
    heroImage: IMAGES.heritage2,
    gallery: [IMAGES.int_living3, IMAGES.int_kitchen2, IMAGES.int_bed2, IMAGES.int_dining1, IMAGES.detail_door],
    features: [
      'Wide-plank reclaimed floors',
      'Brass and bronze hardware',
      'Built-in library shelving',
      'Soaker tubs in primary baths',
      'Quartz counters, panel-front appliances',
    ],
    amenities: [
      'Private courtyard garden',
      'Bike room',
      'Pet-friendly',
      'Resident lounge',
      'Surface parking',
    ],
    nearbyPoints: [
      'Whyte Avenue — 3 min walk',
      'Mill Creek Ravine — 5 min walk',
      "Old Strathcona Farmers' Market — 4 min walk",
    ],
  },
  {
    id: 'r-glenora',
    slug: 'glenora-manor',
    name: 'Glenora Manor',
    city: 'edmonton',
    cityLabel: 'Edmonton',
    address: '13420 102 Avenue NW, Edmonton, AB T5N 0M2',
    coordinates: { lat: 53.545, lng: -113.540 },
    description: "A four-storey limestone in one of the city's most considered neighbourhoods.",
    longDescription: 'Glenora Manor stands four storeys of limestone above 102 Avenue, in the considered company of estate homes and embassies. Suites are spacious — many with two exposures — and the building maintains a private library, a small fitness room, and a quiet, well-mannered front-of-house.',
    bedrooms: '1 · 2 · 3 Bedrooms',
    bedroomOptions: [1, 2, 3],
    bathrooms: '1 – 2.5',
    squareFeet: '720 – 1,640',
    priceFrom: 2150,
    availability: 'available',
    featured: false,
    heroImage: IMAGES.heritage3,
    gallery: [IMAGES.int_living2, IMAGES.int_kitchen1, IMAGES.int_bed1, IMAGES.int_bath2],
    features: [
      'Two-exposure corner suites',
      'Solid-core panelled doors',
      'Gas fireplaces (select suites)',
      'Walk-in wardrobes',
      'European appliances',
    ],
    amenities: [
      'Private library',
      'Fitness room',
      'Heated underground parking',
      'Storage lockers',
      'Concierge',
    ],
    nearbyPoints: [
      'Royal Glenora Club — 6 min walk',
      'River valley trails — 4 min walk',
      'Government House Park — 5 min walk',
    ],
  },
  {
    id: 'r-rossdale',
    slug: 'rossdale-residences',
    name: 'Rossdale Residences',
    city: 'edmonton',
    cityLabel: 'Edmonton',
    address: '9620 100A Street NW, Edmonton, AB T5K 0V3',
    coordinates: { lat: 53.534, lng: -113.500 },
    description: 'A small, river-facing building tucked into the Rossdale flats.',
    longDescription: 'Twelve suites only, set against the river. Quiet by design. Large windows, soft southern light, and a courtyard that opens to the valley trail. The building keeps a single attendant at the front desk and a private gate for residents arriving on foot from the trail.',
    bedrooms: '1 · 2 Bedrooms',
    bedroomOptions: [1, 2],
    bathrooms: '1 – 2',
    squareFeet: '680 – 1,220',
    priceFrom: 1890,
    availability: 'coming-soon',
    featured: false,
    heroImage: IMAGES.heritage4,
    gallery: [IMAGES.int_living1, IMAGES.int_bath1, IMAGES.detail_arch],
    features: [
      'River-facing windows in most suites',
      'In-floor radiant heat',
      'Custom walnut millwork',
      'Marble vanities',
    ],
    amenities: [
      'Courtyard with garden',
      'Trail access',
      'Front desk attendant (weekdays)',
      'Bike storage',
    ],
    nearbyPoints: [
      'Walterdale Bridge — 4 min walk',
      'Louise McKinney Park — 10 min walk',
      'Downtown core — 12 min walk',
    ],
  },
  {
    id: 'r-riversdale',
    slug: 'the-riversdale',
    name: 'The Riversdale',
    city: 'saskatoon',
    cityLabel: 'Saskatoon',
    address: '244 Avenue B South, Saskatoon, SK S7M 1M2',
    coordinates: { lat: 52.128, lng: -106.674 },
    description: 'A converted warehouse with twenty-foot ceilings in Riversdale.',
    longDescription: "A 1912 grain merchant's warehouse, reframed into eighteen residences. Twenty-foot ceilings, exposed brick, and steel sash windows that pull in the long prairie light. The ground floor keeps a small espresso counter and a bookbinder — neighbours, not amenities.",
    bedrooms: 'Studio · 1 · 2 Bedrooms',
    bedroomOptions: [0, 1, 2],
    bathrooms: '1 – 2',
    squareFeet: '520 – 1,340',
    priceFrom: 1380,
    availability: 'available',
    featured: true,
    heroImage: IMAGES.modern3,
    gallery: [IMAGES.int_living2, IMAGES.int_kitchen2, IMAGES.int_bed2, IMAGES.detail_brick],
    features: [
      'Twenty-foot ceilings',
      'Exposed brick and timber',
      'Steel sash windows',
      'Sub-zero refrigeration',
      'Concrete soaker tubs',
    ],
    amenities: [
      'Ground-floor espresso counter',
      'Bookbinder atelier',
      'Resident lounge',
      'Bicycle storage',
      'Pet-friendly',
    ],
    nearbyPoints: [
      'Remai Modern — 8 min walk',
      'Meewasin Trail — 5 min walk',
      "Farmers' Market — 3 min walk",
    ],
  },
  {
    id: 'r-broadway',
    slug: 'broadway-house',
    name: 'Broadway House',
    city: 'saskatoon',
    cityLabel: 'Saskatoon',
    address: '824 Broadway Avenue, Saskatoon, SK S7N 1B6',
    coordinates: { lat: 52.123, lng: -106.652 },
    description: 'Above Broadway, a narrow brick residence with a courtyard reading room.',
    longDescription: "Six storeys of warm brick set above Broadway's most considered block. The reading room — open to all residents — fills the south-facing courtyard with afternoon light. Suites are modestly sized but generously detailed: oak parquet, French doors, and a building that asks for very little of you.",
    bedrooms: '1 · 2 Bedrooms',
    bedroomOptions: [1, 2],
    bathrooms: '1 – 2',
    squareFeet: '600 – 1,080',
    priceFrom: 1560,
    availability: 'available',
    featured: true,
    heroImage: IMAGES.detail_brick,
    gallery: [IMAGES.int_living3, IMAGES.int_kitchen1, IMAGES.int_bed1, IMAGES.int_dining1],
    features: [
      'Oak parquet floors',
      'French doors to small balconies',
      'Bosch kitchen appliances',
      'Marble fireplace mantels (select)',
    ],
    amenities: [
      'Courtyard reading room',
      'Bicycle storage',
      'Pet-friendly',
      'Mail and parcel concierge',
    ],
    nearbyPoints: [
      'Broadway Theatre — 2 min walk',
      'Meewasin Trail — 6 min walk',
      'Nutana Library — 4 min walk',
    ],
  },
  {
    id: 'r-nutana',
    slug: 'nutana-heights',
    name: 'Nutana Heights',
    city: 'saskatoon',
    cityLabel: 'Saskatoon',
    address: '1015 Temperance Street, Saskatoon, SK S7N 0M9',
    coordinates: { lat: 52.131, lng: -106.642 },
    description: 'A new building, quietly designed, on a leafy Nutana street.',
    longDescription: 'A new three-storey residence on a quiet block of Nutana. The architecture defers to its neighbours — slim brick, deep eaves, a single ground-floor garden. Suites are larger than the city standard, with a den off the main hall in most plans.',
    bedrooms: '1 · 2 · 3 Bedrooms',
    bedroomOptions: [1, 2, 3],
    bathrooms: '1.5 – 2.5',
    squareFeet: '780 – 1,540',
    priceFrom: 1840,
    availability: 'available',
    featured: false,
    heroImage: IMAGES.modern1,
    gallery: [IMAGES.int_living1, IMAGES.int_kitchen2, IMAGES.int_bed2, IMAGES.int_bath2],
    features: [
      'Dens in most plans',
      'In-floor radiant heat',
      'Quartz counters, panel-front appliances',
      'Large balconies',
    ],
    amenities: [
      'Ground-floor garden',
      'Bicycle storage',
      'Underground parking',
      'Pet-friendly',
    ],
    nearbyPoints: [
      'College Drive — 3 min walk',
      'University of Saskatchewan — 10 min walk',
      'Meewasin Trail — 8 min walk',
    ],
  },
  {
    id: 'r-bessborough',
    slug: 'bessborough-place',
    name: 'Bessborough Place',
    city: 'saskatoon',
    cityLabel: 'Saskatoon',
    address: '410 Spadina Crescent East, Saskatoon, SK S7K 3G6',
    coordinates: { lat: 52.135, lng: -106.660 },
    description: 'A river-facing address two blocks from the Bessborough.',
    longDescription: 'Steps from the Bessborough and the Meewasin, with two-thirds of the suites facing the river. A quiet limestone façade, a small lobby with a single attendant, and a roof terrace that looks east toward the morning.',
    bedrooms: '1 · 2 · 3 Bedrooms',
    bedroomOptions: [1, 2, 3],
    bathrooms: '1 – 2.5',
    squareFeet: '720 – 1,720',
    priceFrom: 2080,
    availability: 'coming-soon',
    featured: false,
    heroImage: IMAGES.modern2,
    gallery: [IMAGES.int_living2, IMAGES.int_kitchen1, IMAGES.int_bath1],
    features: [
      'River-facing windows',
      'Limestone façade',
      'Oak floors',
      'Soaker tubs',
    ],
    amenities: [
      'Roof terrace',
      'Front desk attendant',
      'Heated parking',
      'Storage lockers',
    ],
    nearbyPoints: [
      'Delta Bessborough — 2 min walk',
      'Remai Modern — 6 min walk',
      'Meewasin Trail — 1 min walk',
    ],
  },
  {
    id: 'r-wascana',
    slug: 'wascana-residences',
    name: 'Wascana Residences',
    city: 'regina',
    cityLabel: 'Regina',
    address: '2310 College Avenue, Regina, SK S4P 1C5',
    coordinates: { lat: 50.444, lng: -104.617 },
    description: 'Across the road from the lake, in the quiet of the park.',
    longDescription: 'Wascana Residences sit across the road from the lake and the legislature grounds. A 1948 building, sympathetically updated. The lobby keeps its terrazzo, and the upper floors keep their cross breezes. Most suites look directly into the park.',
    bedrooms: '1 · 2 Bedrooms',
    bedroomOptions: [1, 2],
    bathrooms: '1 – 2',
    squareFeet: '660 – 1,180',
    priceFrom: 1520,
    availability: 'available',
    featured: true,
    heroImage: IMAGES.heritage2,
    gallery: [IMAGES.int_living1, IMAGES.int_kitchen2, IMAGES.int_bed1, IMAGES.int_dining1],
    features: [
      'Park-facing windows',
      'Original terrazzo in lobby',
      'Oak strip floors',
      'Updated kitchens and baths',
    ],
    amenities: [
      'Lake and park trails',
      'Bike storage',
      'Surface parking',
      'Pet-friendly',
    ],
    nearbyPoints: [
      'Wascana Lake — 1 min walk',
      'Legislative Building — 6 min walk',
      'Conexus Arts Centre — 8 min walk',
    ],
  },
  {
    id: 'r-cathedral',
    slug: 'cathedral-place',
    name: 'Cathedral Place',
    city: 'regina',
    cityLabel: 'Regina',
    address: '2840 13th Avenue, Regina, SK S4T 1N7',
    coordinates: { lat: 50.450, lng: -104.633 },
    description: 'A converted school in Cathedral, with the bell tower preserved.',
    longDescription: 'A 1912 schoolhouse in the Cathedral neighbourhood, reframed as fourteen residences. The bell tower and chalkboards remain. Suites occupy the former classrooms — five-metre ceilings, tall arched windows, and a courtyard that was once the play yard.',
    bedrooms: '1 · 2 · 3 Bedrooms',
    bedroomOptions: [1, 2, 3],
    bathrooms: '1 – 2.5',
    squareFeet: '740 – 1,820',
    priceFrom: 1780,
    availability: 'available',
    featured: true,
    heroImage: IMAGES.heritage1,
    gallery: [IMAGES.int_living3, IMAGES.int_kitchen1, IMAGES.int_bed2, IMAGES.int_bath2],
    features: [
      'Five-metre ceilings',
      'Tall arched windows',
      'Preserved chalkboards and millwork',
      'In-floor radiant heat',
    ],
    amenities: [
      'Courtyard garden',
      'Library room (former office)',
      'Bicycle storage',
      'Pet-friendly',
      'Surface parking',
    ],
    nearbyPoints: [
      'Holy Rosary Cathedral — 3 min walk',
      '13th Avenue shops — 1 min walk',
      'Connaught Library — 5 min walk',
    ],
  },
  {
    id: 'r-albert',
    slug: 'the-albert',
    name: 'The Albert',
    city: 'regina',
    cityLabel: 'Regina',
    address: '1925 Albert Street, Regina, SK S4P 2T3',
    coordinates: { lat: 50.448, lng: -104.610 },
    description: 'A slim brick mid-rise on Albert, near the legislature.',
    longDescription: 'Seven storeys of warm brick on Albert Street, two blocks from the legislative grounds. The Albert keeps a small lobby, a fireplace lounge, and a roof terrace with a view down Wascana. Suites are well-proportioned, with bay windows in the front-facing plans.',
    bedrooms: 'Studio · 1 · 2 Bedrooms',
    bedroomOptions: [0, 1, 2],
    bathrooms: '1 – 2',
    squareFeet: '460 – 1,140',
    priceFrom: 1320,
    availability: 'available',
    featured: false,
    heroImage: IMAGES.heritage3,
    gallery: [IMAGES.int_living2, IMAGES.int_kitchen2, IMAGES.int_bed1, IMAGES.int_bath1],
    features: [
      'Bay windows in front-facing suites',
      'Oak floors',
      'Quartz counters',
      'Walk-in showers',
    ],
    amenities: [
      'Fireplace lounge',
      'Roof terrace',
      'Bike storage',
      'Heated parking',
      'Pet-friendly',
    ],
    nearbyPoints: [
      'Legislative Building — 5 min walk',
      'Wascana Lake — 6 min walk',
      'Cornwall Centre — 8 min walk',
    ],
  },
  {
    id: 'r-victoria',
    slug: 'victoria-house',
    name: 'Victoria House',
    city: 'regina',
    cityLabel: 'Regina',
    address: '2155 Victoria Avenue, Regina, SK S4P 0S4',
    coordinates: { lat: 50.452, lng: -104.625 },
    description: 'A 1924 mansion block, eight residences only.',
    longDescription: 'A 1924 mansion block on Victoria Avenue, sympathetically restored to eight residences. Most occupy a full floor; one occupies the attic with its original dormers. The building shares a back garden with the neighbouring rectory — a quiet courtyard most never see.',
    bedrooms: '2 · 3 Bedrooms',
    bedroomOptions: [2, 3],
    bathrooms: '2 – 3',
    squareFeet: '1,180 – 2,240',
    priceFrom: 2680,
    availability: 'coming-soon',
    featured: false,
    heroImage: IMAGES.modern2,
    gallery: [IMAGES.int_living1, IMAGES.int_kitchen1, IMAGES.int_bed2, IMAGES.int_dining1],
    features: [
      'Full-floor plans',
      'Original mouldings and mantels',
      'Quarter-sawn oak floors',
      'Marble baths',
      'Working gas fireplaces',
    ],
    amenities: [
      'Shared back garden',
      'Storage in original cellar',
      'Surface parking',
      'Pet-friendly',
    ],
    nearbyPoints: [
      'Victoria Park — 8 min walk',
      'Casino Regina — 10 min walk',
      'Wascana Lake — 12 min walk',
    ],
  },
];

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
