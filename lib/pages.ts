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

export interface HomeContent {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    searchButton: string;
    disclaimer: string;
    /** Hero image, managed in the CMS Pages editor. */
    image: string;
  };
  cities: {
    eyebrow: string;
    title: string;
    blurb: string;
    comingSoonBadge: string;
    comingSoonCta: string;
    liveCta: string;
  };
  featured: {
    eyebrow: string;
    title: string;
    viewAllLabel: string;
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
  hero: {
    eyebrow: string;
    titleItalic: string;
    titleRest: string;
    subtitle: string;
    /** Hero video poster image, managed in the CMS Pages editor. */
    image: string;
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
}

export interface WhyBaltoStat {
  value: string;
  label: string;
}

export interface WhyBaltoContent {
  hero: {
    eyebrow: string;
    title: string;
    /** Hero background image, managed in the CMS Pages editor. */
    image: string;
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
    buttonLabel: string;
  };
  benefits: {
    eyebrow: string;
    title: string;
    items: string[];
  };
}

export interface PagesContent {
  home: HomeContent;
  about: AboutContent;
  whyBalto: WhyBaltoContent;
  careers: CareersContent;
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
  eyebrow: string;
  title: string;
  intro: string;
  entries: TenantPortalEntry[];
}

export const TENANT_PORTAL: TenantPortalContent = tenantPortalJson;
