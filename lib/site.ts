// lib/site.ts
import siteJson from '@/content/site.json';

/** Global chrome — brand marks, page metadata, header, footer, and the labels
 *  shared by the property cards, the map and the dialogs. Managed via the CMS
 *  portal (content/site.json). Single source of truth — do not hardcode chrome
 *  copy in components. Strings are rendered verbatim, so preserve unicode
 *  punctuation (’ · — → …) when editing.
 *
 *  Braced tokens are substituted at render time with String.replace, e.g.
 *  "Favorites ({count})", "{name} · exterior", "{month} {day}, {year}". */

export interface SiteBrand {
  /** Destination of the logo button. A route, not copy — hidden from the editor. */
  homeHref: string;
  homeAriaLabel: string;
  /** Alt text for the header and footer logo images. */
  logoAlt: string;
  /** Navy mark, shown over light backgrounds. */
  logoLight: string;
  /** White mark, shown over the navy / overlay header. */
  logoDark: string;
  /** White mark used in the footer (sized larger than the header mark). */
  logoFooter: string;
}

export interface SiteMeta {
  /** Browser tab title and the default search-result title. */
  title: string;
  /** Meta description used by search engines. */
  description: string;
}

export interface SiteNavItem {
  /** Fixed lookup key the header JSX reads. Each entry has its own layout
   *  (city dropdown, company dropdown, careers dropdown, plain link,
   *  placeholder), so the list is fixed: keys may not be added, removed or
   *  renamed. 'company' groups 'about' and 'whyBalto' as its two sub links —
   *  those two no longer appear at the top level, but their labels and
   *  destinations are still edited through their own entries. */
  key: string;
  label: string;
  /** Empty string = a placeholder that renders as plain text, not a link. */
  href: string;
}

export interface SiteLink {
  label: string;
  href: string;
}

/** Footer "Connect" entry. The profile URL itself stays in
 *  content/settings.json; this only names which account to link to. */
export interface SiteSocialLink {
  label: string;
  /** Key into SETTINGS.social: 'facebook' | 'instagram' | 'linkedin'. */
  social: string;
}

export interface SiteHeader {
  /** Accessible name of the primary <nav>. */
  navAriaLabel: string;
  nav: SiteNavItem[];
  propertiesMenu: {
    /** Appended after a city name in the Properties dropdown. */
    comingSoonSuffix: string;
  };
  favorites: {
    href: string;
    /** Mobile drawer label. The desktop link is icon-only. */
    label: string;
    /** Screen-reader label; {count} becomes the saved-property count. */
    ariaLabel: string;
  };
  tenantPortal: {
    label: string;
    ariaLabel: string;
    allHref: string;
  };
  mobile: {
    openLabel: string;
    closeLabel: string;
    /** Appended after a city name in the mobile drawer. */
    comingSoonSuffix: string;
    /** Greyed sub-line under Careers in the mobile drawer. */
    careersSubLine: string;
  };
}

export interface SiteFooterColumn {
  heading: string;
  links: SiteLink[];
}

export interface SiteFooter {
  /** Paragraph under the footer logo. */
  blurb: string;
  copyright: string;
  columns: {
    residences: SiteFooterColumn & {
      /** Appended after a city name in the Residences column. */
      comingSoonSuffix: string;
    };
    residents: SiteFooterColumn;
    company: SiteFooterColumn;
    connect: { heading: string; links: SiteSocialLink[] };
  };
  inquiries: { heading: string };
  legal: {
    /** Glyph between the legal labels. Hidden from the editor. */
    separator: string;
    /** Rendered as plain text until the client has real destinations. */
    labels: string[];
  };
}

export interface SitePropertyCard {
  /** Sits before the rent figure: "From $1,250". */
  pricePrefix: string;
  /** Card suffix after the rent figure. */
  perMonthSuffix: string;
  /** Compact suffix used in the listing row and the map preview. */
  perMonthShortSuffix: string;
  /** Placeholder shown for bedrooms and price when a building has no units. */
  noPriceDash: string;
  bookingCta: string;
  featuredBadge: string;
  comingSoonBadge: string;
  /** Caption on the fallback tile when a building has no photo; {name}. */
  placeholderCaption: string;
  /** Alt text for a property photo; {name}. */
  imageAlt: string;
  /** Screen-reader label for the whole card; {name}, {city}. */
  cardAriaLabel: string;
  /** Written instead of "0" in a bedroom summary. */
  studioLabel: string;
  /** Glyph between bedroom counts. Hidden from the editor. */
  bedroomSeparator: string;
  bedroomsSuffix: string;
}

export interface SiteMap {
  legendAvailable: string;
  legendFeatured: string;
  /** Button that appears after the visitor pans the map. */
  searchAreaLabel: string;
}

export interface SiteUi {
  /** Screen-reader label on modal close buttons. */
  closeLabel: string;
  /** Empty-state text in every custom dropdown. */
  dropdownPlaceholder: string;
  datePicker: {
    placeholder: string;
    ariaLabel: string;
    previousMonthLabel: string;
    nextMonthLabel: string;
    clearLabel: string;
    /** Screen-reader label per day cell; {month} {day}, {year}. */
    dayAriaLabel: string;
    /** Column headings, starting on Sunday. Exactly 7 entries. */
    weekdays: string[];
    /** Month names in order. Exactly 12 entries; the short date label uses
     *  the first three characters of each. */
    months: string[];
  };
  gallery: {
    /** Fallback eyebrow when a caller passes none. */
    eyebrow: string;
    /** {count} photo. */
    photoCountSingular: string;
    /** {count} photos. */
    photoCountPlural: string;
    /** Alt text per gallery image; {title} · {number}. */
    photoAlt: string;
  };
}

export interface SiteContent {
  brand: SiteBrand;
  meta: SiteMeta;
  header: SiteHeader;
  footer: SiteFooter;
  propertyCard: SitePropertyCard;
  map: SiteMap;
  ui: SiteUi;
}

export const SITE: SiteContent = siteJson;