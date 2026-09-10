import pagesJson from '@/content/pages.json';
import tenantPortalJson from '@/content/tenant-portal.json';

/** Marketing copy for the public pages (home, about, why-balto, careers),
 *  managed via the CMS portal (content/pages.json). Single source of truth —
 *  do not hardcode page copy in components. Strings are rendered verbatim,
 *  so preserve unicode punctuation (’ · →) when editing. */

export interface HomeBenefit {
  title: string;
  body: string;
}

export interface HomeTimelineEntry {
  year: string;
  label: string;
}

/** One option in the homepage hero search dropdowns. `value` is the query the
 *  /residences filter receives, `label` is the wording the visitor reads. */
/** Browser-tab title and search-result description for one page. Seeded with
 *  the site-wide values, so a page shows the shared wording until the client
 *  gives it its own. */
export interface PageMeta {
  title: string;
  description: string;
}

/** Metadata for a page template, where one wording serves many URLs. Tokens
 *  ({city}, {name}) are filled with the residence or city being viewed. */
export interface PageMetaTemplate {
  titleTemplate: string;
  descriptionTemplate: string;
}

export interface HomeSearchOption {
  value: string;
  label: string;
}

/** Labels and options for the homepage hero rental-search bar. The bedroom
 *  values (0/1/2/3, where 3 means "3+") are matched by lib/filter.ts, so only
 *  their labels are client-editable. */
export interface HomeHeroSearch {
  cityLabel: string;
  cityAnyLabel: string;
  rentLabel: string;
  rentAnyLabel: string;
  /** Bounds for the price slider, read through lib/price.ts, which also feeds
   *  the /residences filters panel. Optional with fallbacks so restoring an
   *  older snapshot from the CMS History cannot break the build. */
  rentMin?: string;
  rentMax?: string;
  rentStep?: string;
  rentMinInputLabel?: string;
  rentMaxInputLabel?: string;
  /** Wording once a range is set; {min} and {max} are filled with the prices. */
  rentSummaryTemplate?: string;
  bedsLabel: string;
  bedsAnyLabel: string;
  bedOptions: HomeSearchOption[];
}

export interface HomeContent {
  /** Browser-tab title and search-result description. */
  meta: PageMeta;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    searchButton: string;
    disclaimer: string;
    /** Hero image, managed in the CMS Pages editor. */
    image: string;
    /** Alt text for the hero image, read by screen readers and shown if the
     *  image fails to load. */
    imageAlt: string;
    /** Labels and dropdown options for the hero rental-search bar. */
    search: HomeHeroSearch;
  };
  cities: {
    eyebrow: string;
    title: string;
    blurb: string;
    comingSoonBadge: string;
    comingSoonCta: string;
    liveCta: string;
    /** Shown instead of the grid when no city is published. */
    emptyMessage: string;
  };
  featured: {
    eyebrow: string;
    title: string;
    viewAllLabel: string;
    /** Shown instead of the cards when no residence is marked featured. */
    emptyMessage: string;
  };
  benefits: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: HomeBenefit[];
  };
  steps: {
    eyebrow: string;
    title: string;
    items: string[];
  };
  story: {
    eyebrow: string;
    title: string;
    paragraph: string;
    timeline: HomeTimelineEntry[];
    ctaLabel: string;
    /** Section image, managed in the CMS Pages editor. */
    image: string;
    /** Alt text for the section image. */
    imageAlt: string;
  };
  cta: {
    eyebrow: string;
    title: string;
    body: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
}

export interface AboutStoryCard {
  numeral: string;
  eyebrow: string;
  quote: string;
  body: string;
}

export interface AboutFigure {
  value: string;
  label: string;
  body: string;
}

export interface AboutContent {
  /** Browser-tab title and search-result description. */
  meta: PageMeta;
  hero: {
    eyebrow: string;
    titleItalic: string;
    titleRest: string;
    subtitle: string;
    /** Hero video poster image, managed in the CMS Pages editor. */
    image: string;
    /** Hero background film. Path under /public - the CMS image library only
     *  accepts stills, so this is set in the document, not in the editor. */
    video: string;
    /** Wording of the scroll cue at the foot of the hero. */
    scrollCue: string;
  };
  story: {
    eyebrow: string;
    lead: string;
    cards: AboutStoryCard[];
    close: string;
  };
  standards: {
    eyebrow: string;
    title: string;
    items: string[];
  };
  figures: {
    eyebrow: string;
    title: string;
    blurb: string;
    items: AboutFigure[];
  };
  cta: {
    eyebrow: string;
    title: string;
    buttonLabel: string;
  };
}

export interface WhyBaltoPillar {
  eyebrow: string;
  title: string;
  body: string;
  /** Section image, managed in the CMS Pages editor. */
  image: string;
  /** Alt text for the section image. */
  imageAlt: string;
}

export interface WhyBaltoStat {
  value: string;
  label: string;
}

export interface WhyBaltoContent {
  /** Browser-tab title and search-result description. */
  meta: PageMeta;
  hero: {
    eyebrow: string;
    title: string;
    /** Hero background image, managed in the CMS Pages editor. */
    image: string;
    /** Alt text for the hero background image. */
    imageAlt: string;
  };
  intro: {
    pullQuote: string;
    attribution: string;
    paragraph1: string;
    paragraph2: string;
  };
  pillars: WhyBaltoPillar[];
  stats: WhyBaltoStat[];
  cta: {
    title: string;
    buttonLabel: string;
  };
}

export interface CareersContent {
  /** Browser-tab title and search-result description. */
  meta: PageMeta;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  openings: {
    eyebrow: string;
    title: string;
    noOpeningsMessage: string;
    contactIntro: string;
    /** Punctuation that closes the contact sentence after the email link. */
    contactOutro: string;
    buttonLabel: string;
  };
  benefits: {
    eyebrow: string;
    title: string;
    items: string[];
  };
}


/* ================================================================ */
/* Residences index - listing, filters and sort
/* ================================================================ */

/** One bedroom pill in the filter panel. `beds` is the filter value the pill
 *  applies (3 means "3+", per applyFilters in lib/filter.ts) — behaviour, not
 *  copy, so it is not exposed in the CMS. Only `label` is client-editable. */
export interface ResidencesBedroomOption {
  beds: number;
  label: string;
}

/** One amenity checkbox. `key` is the lowercase substring matched against each
 *  building's amenities + features (lib/filter.ts) and is also what lands in
 *  the ?amenities= URL param — behaviour, not copy. Only `label` is
 *  client-editable; changing a key silently changes what the filter matches. */
export interface ResidencesAmenityOption {
  key: string;
  label: string;
}

/** One entry in the sort menu. `value` must stay one of the sort modes
 *  applyFilters understands ('name' | 'price-asc' | 'price-desc' | 'bedrooms');
 *  only `label` is client-editable. */
export interface ResidencesSortOption {
  value: string;
  label: string;
}

/** Copy for the /residences index and the filter/sort chrome it shares with
 *  the city pages (FiltersPanel, SortDropdown, the map loading placeholder). */
export interface ResidencesContent {
  /** Browser-tab title and search-result description. */
  meta: PageMeta;
  breadcrumb: {
    homeLabel: string;
    currentLabel: string;
  };
  title: string;
  /** Result line. `{count}` and `{total}` are substituted at render time. */
  resultCount: string;
  /** The chip shown while a search term is active; the term itself follows. */
  searchChip: {
    prefix: string;
  };
  toolbar: {
    showFiltersLabel: string;
  };
  emptyState: {
    title: string;
    clearLabel: string;
  };
  loading: {
    /** Screen-reader label on the map placeholder while Leaflet loads. */
    mapLabel: string;
  };
  filters: {
    eyebrow: string;
    /** Screen-reader label on the panel's close button. */
    closeLabel: string;
    bedrooms: {
      heading: string;
      options: ResidencesBedroomOption[];
    };
    price: {
      heading: string;
      /** Readout reads: prefix $800 separator $3,500 suffix. */
      readoutPrefix: string;
      readoutSeparator: string;
      /** Leading space is intentional — it separates the price from "/mo". */
      readoutSuffix: string;
    };
    amenities: {
      heading: string;
      options: ResidencesAmenityOption[];
    };
    clearLabel: string;
    applyLabel: string;
  };
  sort: {
    /** Prefix on the sort button; the active option's label follows. */
    triggerPrefix: string;
    options: ResidencesSortOption[];
  };
}

/* ================================================================ */
/* City listing pages - shared template
/* ================================================================ */

/* ---------------------------------------------------------------- */
/* City pages — /residences/[city]. One key covers all three layouts   */
/* the route can render: the register-interest screen for announced    */
/* markets, the default grid + sticky map, and the portfolio /         */
/* map-split treatment opted into per city in the Content Studio.      */
/* ---------------------------------------------------------------- */

/** Breadcrumb chrome, shared by the listing and portfolio layouts. */
export interface CityBreadcrumb {
  homeLabel: string;
  residencesLabel: string;
}

/** Announced-but-not-live markets (Yellowknife): register-interest email
 *  capture instead of listings. `{province}` and `{city}` are substituted
 *  at render from the city record. */
export interface CityComingSoon {
  eyebrow: string;
  /** `{city}` is replaced with the city name. Keep the full stop. */
  title: string;
  body: string;
  emailPlaceholder: string;
  submitLabel: string;
  /** Shown in place of the form once the address is submitted. */
  successMessage: string;
  footnote: string;
}

/** Default city layout: card grid on the left, sticky map on the right. */
export interface CityListing {
  /** `{city}` is replaced with the city name. Keep the full stop. */
  title: string;
  /** `{count}` is replaced with the number of matching residences. */
  countSingular: string;
  countPlural: string;
  showFiltersLabel: string;
  emptyTitle: string;
  emptyClearLabel: string;
  /** Static placeholder — pagination is not wired up on this route yet. */
  paginationLabel: string;
}

/** Full-bleed cover at the top of the portfolio layout. */
export interface CityPortfolioCover {
  /** `{province}` is replaced with the province. */
  eyebrow: string;
  /** `{city}` is replaced with the city name. Keep the full stop. */
  title: string;
  /** Alt text for the cover photograph. `{city}` and `{province}` are
   *  replaced from the city record. */
  imageAlt: string;
}

/** Filter / count / view-toggle bar under the cover. */
export interface CityPortfolioToolbar {
  /** `{count}` and `{city}` are replaced at render. */
  countSingular: string;
  countPlural: string;
  /** Appended to the count while a map-area search is narrowing the list.
   *  A space is added before it in code — do not lead with one here. */
  countAreaSuffix: string;
  showFiltersLabel: string;
  moreFiltersLabel: string;
  /** Accessible name for the city dropdown. */
  cityFilterLabel: string;
  allCitiesLabel: string;
  /** Accessible name for the bedrooms dropdown. */
  bedroomsFilterLabel: string;
  allBedroomsLabel: string;
  bedroomStudioLabel: string;
  /** `{count}` is replaced with the bedroom count. */
  bedroomSingular: string;
  bedroomPlural: string;
  /** Used for anything with three or more bedrooms. */
  bedroomMaxLabel: string;
  /** Accessible name for the list/map toggle group. */
  viewToggleLabel: string;
  listViewLabel: string;
  mapViewLabel: string;
  hideMapLabel: string;
  showMapLabel: string;
}

/** Large stacked editorial rows (portfolio layout, list view). */
export interface CityPortfolioRow {
  /** Accessible name for the photograph link. `{name}` and `{city}` are
   *  replaced from the residence record. */
  imageLabel: string;
  /** Caption drawn on the fallback tile when a photograph is missing.
   *  `{name}` is replaced with the residence name. */
  placeholderCaption: string;
  suitesLabel: string;
  priceFromLabel: string;
  /** Small unit shown after the rent figure. */
  priceSuffix: string;
  /** Shown wherever a building has no units on file. */
  unavailableValue: string;
  viewResidenceLabel: string;
}

/** Compact horizontal rows beside the map (portfolio + map-split layout). */
export interface CityPortfolioSplitRow {
  featuredBadge: string;
  priceFromLabel: string;
  priceSuffix: string;
  /** Replaces the rent line when a building has no units on file. */
  noPriceLabel: string;
  /** Accessible name for the arrow button. `{name}` is replaced with the
   *  residence name. */
  viewLabel: string;
}

/** No-results states for both portfolio views. */
export interface CityPortfolioEmpty {
  title: string;
  clearLabel: string;
  /** Shown when a map-area search, not the filters, emptied the list. */
  inAreaTitle: string;
  clearAreaLabel: string;
}

export interface CityPortfolio {
  cover: CityPortfolioCover;
  toolbar: CityPortfolioToolbar;
  row: CityPortfolioRow;
  splitRow: CityPortfolioSplitRow;
  empty: CityPortfolioEmpty;
}

export interface CityContent {
  /** Title and description template for every page of this type. */
  meta: PageMetaTemplate;
  breadcrumb: CityBreadcrumb;
  comingSoon: CityComingSoon;
  listing: CityListing;
  portfolio: CityPortfolio;
}

/* ================================================================ */
/* Residence detail pages - shared template
/* ================================================================ */

/** Chrome for a residence detail page (/residences/[city]/[slug]) and the three
 *  modals it opens. Per-building copy — name, address, description, features,
 *  amenities, incentives, nearby points — stays in the residence data, not here.
 *  Strings are rendered verbatim: the separators below are U+00B7 (·) and
 *  U+2014 (—); apostrophes are straight (') because the JSX they replace used
 *  `&apos;`. */
export interface PropertyContent {
  /** Title and description template for every page of this type. */
  meta: PageMetaTemplate;
  breadcrumb: {
    home: string;
    residences: string;
    /** Divider drawn between breadcrumb links (3 occurrences). */
    separator: string;
  };
  header: {
    /** Between city and neighbourhood in the eyebrow, e.g. "Edmonton · Oliver". */
    eyebrowSeparator: string;
    /** H1 pattern. {name} = residence name. */
    title: string;
  };
  gallery: {
    viewAllLabel: string;
    /** Hero photo alt text. {name} = residence name. Also used as the
     *  placeholder tile label when the residence has no hero image. */
    mainPhotoAlt: string;
    /** Thumbnail alt text. {name} = residence name, {number} = 1-based index. */
    thumbPhotoAlt: string;
    /** Glyph shown inside an empty thumbnail tile. */
    emptyThumbCaption: string;
    /** Eyebrow of the per-unit photo modal. */
    unitModalEyebrow: string;
    /** Per-unit modal heading. {name} = residence, {unit} = unit label. */
    unitModalTitle: string;
  };
  /** Full-screen photo viewer. Shared with the admin units page, so these
   *  labels appear in the staff portal too. */
  lightbox: {
    closeLabel: string;
    previousLabel: string;
    nextLabel: string;
    /** {label} = building or unit label, {number} = 1-based index. */
    photoAlt: string;
    /** Used when no label is supplied. {number} = 1-based index. */
    photoAltFallback: string;
    /** {current} = 1-based index, {total} = photo count. */
    counter: string;
  };
  price: {
    fromPrefix: string;
    perMonthSuffix: string;
    /** Between the per-month suffix and the bedroom summary. */
    bedroomsSeparator: string;
  };
  promo: {
    /** Badge on the promotional banner. */
    tag: string;
    /** {count} = free months. Used when exactly 1 month is free. */
    offerSingular: string;
    /** {count} = free months. Used for 2+. */
    offerPlural: string;
  };
  quickStats: {
    bedroomsLabel: string;
    /** Shown when the residence has no live units. */
    bedroomsNoneValue: string;
    availabilityLabel: string;
    /** No live units. */
    availabilityNoneValue: string;
    /** Units available now. */
    availabilityNowValue: string;
    /** Units coming soon. */
    availabilitySoonValue: string;
  };
  sections: {
    overviewTitle: string;
    /** Heading used when the residence lists incentives. */
    incentivesTitle: string;
    /** Heading used when it lists features instead. */
    featuresTitle: string;
    /** Heading used when the residence lists unit photo labels. */
    unitPhotosTitle: string;
    /** Heading used when it lists amenities instead. */
    amenitiesTitle: string;
    suitesTitle: string;
    locationTitle: string;
    nearbyEyebrow: string;
  };
  suites: {
    /** Shown in place of the table when nothing is available. */
    emptyMessage: string;
    disclaimer: string;
    unitNumberHeader: string;
    unitTypeHeader: string;
    rentHeader: string;
    imagesHeader: string;
    /** Screen-reader name for the unlabelled Apply column. */
    applyColumnLabel: string;
    /** Placeholder in the Unit Number cell when the unit number is unknown.
     *  Doubles as the sentinel the row style checks — change it in one place
     *  and both the value and the muted styling follow. */
    unitNumberUnknownValue: string;
    rentSuffix: string;
    /** Link/button label in the Images column. */
    viewLabel: string;
    /** Images cell when a unit has no photos at all. */
    noPhotosValue: string;
    applyLabel: string;
    /** Heading label for a unit's photo set. {unit} = unit number. */
    unitPhotosLabel: string;
  };
  sidebar: {
    /** Eyebrow used before a floor plan is selected. */
    planEyebrowFallback: string;
    perMonthSuffix: string;
    availableNowLine: string;
    comingSoonLine: string;
    netEffectiveNote: string;
    floorPlansEyebrow: string;
    /** Suffix on each floor-plan button's price. */
    planPriceSuffix: string;
    /** Eyebrow of the no-suites card. */
    noSuitesEyebrow: string;
    noSuitesTitle: string;
    noSuitesBody: string;
    bookViewingLabel: string;
    /** Shown when the residence has a resident-portal link. */
    residentPortalLabel: string;
    /** Disabled state when it has none. */
    residentPortalComingSoonLabel: string;
    /** Shown when the residence has a maintenance link. */
    maintenanceLabel: string;
    /** Disabled state when it has none. */
    maintenanceComingSoonLabel: string;
    favoritesLabel: string;
    contactEyebrow: string;
  };
  similar: {
    eyebrow: string;
    /** {city} = city label. */
    title: string;
  };
}

/* ================================================================ */
/* Contact page and the shared enquiry modal
/* ================================================================ */

/** Inquire page (app/inquire/page.tsx) and the residence inquiry modal
 *  (components/InquireModal.tsx). Field labels render inside <Eyebrow>, which
 *  does not transform case — type them exactly as they should appear (the site
 *  sets them in caps). Note the source uses the HTML entity &apos; for
 *  apostrophes, which renders U+0027, so `intro` and `modal.thankYou.body`
 *  carry a straight ' here, not the curly ’ used elsewhere in pages.json. */
export interface InquireContent {
  /** Browser-tab title and search-result description. */
  meta: PageMeta;
  hero: {
    eyebrow: string;
    /** First line of the h1; rendered above `titleLine2` with a <br /> between. */
    titleLine1: string;
    /** Second line of the h1. */
    titleLine2: string;
    intro: string;
  };
  /** Labels only. The email address, phone number, office location and office
   *  hours themselves come from content/settings.json (SETTINGS), not here. */
  contact: {
    emailLabel: string;
    phoneLabel: string;
    officeLabel: string;
    officeHoursLabel: string;
  };
  form: {
    eyebrow: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    phonePlaceholder: string;
    cityLabel: string;
    /** Screen-reader name for the city dropdown. */
    cityAriaLabel: string;
    /** First entry in the city dropdown. The cities themselves come from
     *  LIVE_CITIES in lib/data. */
    cityPlaceholderOption: string;
    moveInLabel: string;
    /** Screen-reader name for the move-in date picker. */
    moveInAriaLabel: string;
    moveInPlaceholder: string;
    residenceLabel: string;
    residencePlaceholder: string;
    messageLabel: string;
    submitLabel: string;
  };
  /** Replaces the form once an inquiry has been submitted. */
  thankYou: {
    eyebrow: string;
    title: string;
    body: string;
  };
  /** The inquiry pop-up opened from a residence detail page. Its heading is the
   *  residence name, which comes from the property data, not from this document. */
  modal: {
    eyebrow: string;
    intro: string;
    /** Screen-reader name for the icon-only close button. */
    closeAriaLabel: string;
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
    /** Pre-filled message. `{residence}` is replaced with the residence name. */
    messageDefault: string;
    submitLabel: string;
    thankYou: {
      eyebrow: string;
      title: string;
      body: string;
      closeLabel: string;
    };
  };
}

/* ================================================================ */
/* Saved residences
/* ================================================================ */

/** Favorites page (/favorites) — the saved-residences list, its empty state,
 *  and the screen-reader labels on the heart button that appears on every
 *  property card site-wide. */
export interface FavoritesContent {
  /** Browser-tab title and search-result description. */
  meta: PageMeta;
  eyebrow: string;
  title: string;
  /** Sub-line when nothing has been saved yet. */
  countNone: string;
  /** Sub-line for exactly one saved residence. "{count}" is replaced with the
   *  number, so the whole sentence stays rewordable. */
  countSingular: string;
  /** Sub-line for two or more saved residences. "{count}" is replaced with the
   *  number. */
  countPlural: string;
  empty: {
    /** Rendered inside typographic quote marks — do not add quotes here. */
    quote: string;
    ctaLabel: string;
  };
  /** aria-labels on the heart toggle (FavoriteHeart), used on cards and on the
   *  residence detail page. Not visible text — read aloud by screen readers. */
  heart: {
    saveLabel: string;
    removeLabel: string;
  };
}

export interface PagesContent {
  home: HomeContent;
  about: AboutContent;
  whyBalto: WhyBaltoContent;
  careers: CareersContent;
  /** Shared chrome for the residences index, its filters and its sort. */
  residences: ResidencesContent;
  /** Shared chrome for every city listing page. */
  city: CityContent;
  /** Shared chrome for every residence detail page. */
  property: PropertyContent;
  /** The contact page and the shared enquiry modal. */
  inquire: InquireContent;
  /** The saved-residences page. */
  favorites: FavoritesContent;
}

export const PAGES: PagesContent = pagesJson;

/* ---------------------------------------------------------------- */
/* Tenant portal — resident sign-in links, maintained by the client   */
/* in Content Studio so new buildings don't need a code change.       */
/* ---------------------------------------------------------------- */
export interface TenantPortalEntry {
  id: string;
  label: string;
  address: string;
  url: string;
}

export interface TenantPortalContent {
  /** Browser-tab title and search-result description. */
  meta: PageMeta;
  eyebrow: string;
  title: string;
  intro: string;
  /** Label on the sign-in link at the end of each building row on
   *  /tenant-portal. The arrow icon is drawn after it in code. */
  signInLabel: string;
  /** Shown on /tenant-portal and in the header Tenant Portal dropdown when
   *  no buildings have been added yet. One message serves both places. */
  emptyMessage: string;
  /** Label on the link at the foot of the header dropdown that goes to the
   *  full /tenant-portal page. The chevron icon is drawn after it in code. */
  allPortalsLabel: string;
  entries: TenantPortalEntry[];
}

export const TENANT_PORTAL: TenantPortalContent = tenantPortalJson;
