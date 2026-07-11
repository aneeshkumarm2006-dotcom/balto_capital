import settingsJson from '@/content/settings.json';

/** Site-wide contact and social settings, managed via the CMS portal
 *  (content/settings.json). Single source of truth — do not hardcode the
 *  email/phone in components. */
export interface SiteSettings {
  contactEmail: string;
  contactPhone: string;
  officeLocation: string;
  officeHoursWeekdays: string;
  officeHoursWeekend: string;
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
}

export const SETTINGS: SiteSettings = settingsJson;
