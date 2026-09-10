'use client';

/* BALTO CMS - Site chrome: the parts of the website that are not one page but
   all of them. The header and its menus, the footer, the brand marks and search
   listing, the wording on every property card, and the labels shared by the map,
   the photo gallery and the date picker.

   Edits content/site.json. CONFIG ONLY - the form machinery lives in the shared
   ContentEditor engine. */

import { ContentEditor, type TabDef } from '@/components/admin/ContentEditor';

const SITE_TABS: TabDef[] = [
  {
    id: 'header',
    label: 'Navigation',
    sections: [
      {
        title: 'Main navigation',
        path: ['header'],
        fields: [
          {
            key: 'navAriaLabel',
            label: 'Navigation label (screen readers)',
            kind: 'input',
          },
        ],
        list: {
          key: 'nav',
          itemLabel: 'Navigation link',
          help: 'The header links, in order. "Company" is a dropdown holding "About" and "Why Balto", so those two are edited here but shown inside it. Each entry has its own layout, so items cannot be added or removed here — only reworded or repointed.',
          fields: [
            { key: 'label', label: 'Label', kind: 'input' },
            {
              key: 'href',
              label: 'Destination',
              kind: 'input',
              help: 'Where the link goes, e.g. /about. Leave blank to show the item as plain text instead of a link.',
              optional: true,
            },
          ],
        },
      },
      {
        title: 'Properties dropdown',
        path: ['header', 'propertiesMenu'],
        fields: [
          {
            key: 'comingSoonSuffix',
            label: '"Coming soon" suffix',
            kind: 'input',
            help: 'Added after a city name in the Properties dropdown. Keep the leading space.',
          },
        ],
      },
      {
        title: 'Favorites link',
        path: ['header', 'favorites'],
        fields: [
          { key: 'label', label: 'Label (mobile menu)', kind: 'input' },
          {
            key: 'ariaLabel',
            label: 'Screen-reader label',
            kind: 'input',
            help: '{count} is replaced with the number of saved properties.',
          },
        ],
      },
      {
        title: 'Tenant portal menu',
        path: ['header', 'tenantPortal'],
        fields: [
          { key: 'label', label: 'Button label', kind: 'input' },
          { key: 'ariaLabel', label: 'Screen-reader label', kind: 'input' },
        ],
      },
      {
        title: 'Mobile menu',
        path: ['header', 'mobile'],
        fields: [
          {
            key: 'openLabel',
            label: 'Open-menu button label (screen readers)',
            kind: 'input',
          },
          {
            key: 'closeLabel',
            label: 'Close-menu button label (screen readers)',
            kind: 'input',
          },
          {
            key: 'comingSoonSuffix',
            label: '"Coming soon" suffix',
            kind: 'input',
            help: 'Added after a city name in the mobile drawer. Keep the leading space.',
          },
          { key: 'careersSubLine', label: 'Careers sub-line', kind: 'input' },
        ],
      },
    ],
  },
  {
    id: 'footer',
    label: 'Footer',
    sections: [
      {
        title: 'Footer — intro & copyright',
        path: ['footer'],
        fields: [
          { key: 'blurb', label: 'Paragraph under the logo', kind: 'textareaWide' },
          { key: 'copyright', label: 'Copyright line', kind: 'input' },
        ],
      },
      {
        title: 'Footer — Residences column',
        path: ['footer', 'columns', 'residences'],
        fields: [
          { key: 'heading', label: 'Heading', kind: 'input' },
          {
            key: 'comingSoonSuffix',
            label: '"Coming soon" suffix',
            kind: 'input',
            help: 'Added after a city name. Keep the leading space. The city list itself comes from the Properties screen.',
          },
        ],
        list: {
          key: 'links',
          itemLabel: 'Link',
          growable: true,
          min: 1,
          help: 'Extra links shown under the city list.',
          fields: [
            { key: 'label', label: 'Label', kind: 'input' },
            { key: 'href', label: 'Destination', kind: 'input' },
          ],
        },
      },
      {
        title: 'Footer — Residents column',
        path: ['footer', 'columns', 'residents'],
        fields: [
          { key: 'heading', label: 'Heading', kind: 'input' },
        ],
        list: {
          key: 'links',
          itemLabel: 'Link',
          growable: true,
          min: 1,
          fields: [
            { key: 'label', label: 'Label', kind: 'input' },
            { key: 'href', label: 'Destination', kind: 'input' },
          ],
        },
      },
      {
        title: 'Footer — Company column',
        path: ['footer', 'columns', 'company'],
        fields: [
          { key: 'heading', label: 'Heading', kind: 'input' },
        ],
        list: {
          key: 'links',
          itemLabel: 'Link',
          growable: true,
          min: 1,
          fields: [
            { key: 'label', label: 'Label', kind: 'input' },
            { key: 'href', label: 'Destination', kind: 'input' },
          ],
        },
      },
      {
        title: 'Footer — Connect column',
        path: ['footer', 'columns', 'connect'],
        fields: [
          { key: 'heading', label: 'Heading', kind: 'input' },
        ],
        list: {
          key: 'links',
          itemLabel: 'Social link',
          help: 'Labels only. The profile addresses live on the Site settings screen, so they stay in one place.',
          fields: [
            { key: 'label', label: 'Label', kind: 'input' },
          ],
        },
      },
      {
        title: 'Footer — Inquiries',
        path: ['footer', 'inquiries'],
        fields: [
          {
            key: 'heading',
            label: 'Heading',
            kind: 'input',
            help: 'The email and phone shown beneath come from Site settings.',
          },
        ],
      },
      {
        title: 'Footer — legal line',
        path: ['footer', 'legal'],
        list: {
          key: 'labels',
          itemLabel: 'Item',
          growable: true,
          min: 1,
          stringKind: 'input',
          help: 'Shown as plain text on the bottom row, separated by a middle dot. Not links yet.',
        },
      },
    ],
  },
  {
    id: 'brand',
    label: 'Brand & search listing',
    sections: [
      {
        title: 'Brand & logos',
        path: ['brand'],
        fields: [
          {
            key: 'logoLight',
            label: 'Logo — navy (over light backgrounds)',
            kind: 'image',
          },
          {
            key: 'logoDark',
            label: 'Logo — white (over the dark header)',
            kind: 'image',
          },
          { key: 'logoFooter', label: 'Logo — footer', kind: 'image' },
          {
            key: 'logoAlt',
            label: 'Logo alt text',
            kind: 'input',
            help: 'Read aloud by screen readers in place of the logo image.',
          },
          {
            key: 'homeAriaLabel',
            label: 'Logo button label (screen readers)',
            kind: 'input',
          },
        ],
      },
      {
        title: 'Search engine listing',
        path: ['meta'],
        fields: [
          { key: 'title', label: 'Browser tab / search result title', kind: 'input' },
          {
            key: 'description',
            label: 'Search result description',
            kind: 'textareaWide',
            help: 'Google shows roughly the first 155 characters.',
          },
        ],
      },
    ],
  },
  {
    id: 'cards',
    label: 'Property cards',
    sections: [
      {
        title: 'Property cards — pricing & badges',
        path: ['propertyCard'],
        fields: [
          { key: 'pricePrefix', label: 'Before the rent figure', kind: 'input' },
          { key: 'perMonthSuffix', label: 'After the rent — card', kind: 'input' },
          {
            key: 'perMonthShortSuffix',
            label: 'After the rent — list row and map',
            kind: 'input',
          },
          {
            key: 'noPriceDash',
            label: 'Placeholder for a missing price or bedroom count',
            kind: 'input',
          },
          { key: 'bookingCta', label: 'Card call to action', kind: 'input' },
          { key: 'featuredBadge', label: '"Featured" badge', kind: 'input' },
          { key: 'comingSoonBadge', label: '"Coming soon" badge', kind: 'input' },
          {
            key: 'studioLabel',
            label: 'Word used instead of "0 bedrooms"',
            kind: 'input',
          },
          {
            key: 'bedroomsSuffix',
            label: 'After the bedroom numbers',
            kind: 'input',
            help: 'Keep the leading space, e.g. " Bedrooms".',
          },
        ],
      },
      {
        title: 'Property cards — image and screen-reader text',
        path: ['propertyCard'],
        fields: [
          {
            key: 'imageAlt',
            label: 'Photo alt text',
            kind: 'input',
            help: '{name} is replaced with the building name.',
          },
          {
            key: 'placeholderCaption',
            label: 'Caption when a building has no photo',
            kind: 'input',
            help: '{name} is replaced with the building name.',
          },
          {
            key: 'cardAriaLabel',
            label: 'Card label (screen readers)',
            kind: 'input',
            help: '{name} and {city} are replaced automatically.',
          },
        ],
      },
    ],
  },
  {
    id: 'shared',
    label: 'Maps & shared controls',
    sections: [
      {
        title: 'Map',
        path: ['map'],
        fields: [
          { key: 'legendAvailable', label: 'Legend — navy pin', kind: 'input' },
          { key: 'legendFeatured', label: 'Legend — gold pin', kind: 'input' },
          { key: 'searchAreaLabel', label: '"Search this area" button', kind: 'input' },
        ],
      },
      {
        title: 'Photo gallery',
        path: ['ui', 'gallery'],
        fields: [
          { key: 'eyebrow', label: 'Eyebrow above the gallery title', kind: 'input' },
          {
            key: 'photoCountSingular',
            label: 'Photo count — one photo',
            kind: 'input',
            help: '{count} is replaced with the number.',
          },
          {
            key: 'photoCountPlural',
            label: 'Photo count — several photos',
            kind: 'input',
            help: '{count} is replaced with the number.',
          },
          {
            key: 'photoAlt',
            label: 'Photo alt text',
            kind: 'input',
            help: '{title} is the gallery heading, {number} the photo\'s position.',
          },
        ],
      },
      {
        title: 'Shared controls',
        path: ['ui'],
        fields: [
          {
            key: 'closeLabel',
            label: 'Close button label (screen readers)',
            kind: 'input',
          },
          {
            key: 'dropdownPlaceholder',
            label: 'Dropdown placeholder',
            kind: 'input',
            help: 'Shown in every filter dropdown before a choice is made.',
          },
        ],
      },
      {
        title: 'Date picker — day columns',
        path: ['ui', 'datePicker'],
        list: {
          key: 'weekdays',
          itemLabel: 'Day',
          stringKind: 'input',
          help: 'The seven column headings, starting on Sunday. Keep all seven.',
        },
      },
      {
        title: 'Date picker — month names',
        path: ['ui', 'datePicker'],
        list: {
          key: 'months',
          itemLabel: 'Month',
          stringKind: 'input',
          help: 'All twelve months in order. The short date uses the first three letters of each.',
        },
      },
      {
        title: 'Date picker',
        path: ['ui', 'datePicker'],
        fields: [
          {
            key: 'placeholder',
            label: 'Placeholder before a date is picked',
            kind: 'input',
          },
          { key: 'ariaLabel', label: 'Field label (screen readers)', kind: 'input' },
          {
            key: 'previousMonthLabel',
            label: 'Previous-month arrow (screen readers)',
            kind: 'input',
          },
          {
            key: 'nextMonthLabel',
            label: 'Next-month arrow (screen readers)',
            kind: 'input',
          },
          { key: 'clearLabel', label: 'Clear button', kind: 'input' },
          {
            key: 'dayAriaLabel',
            label: 'Day label (screen readers)',
            kind: 'input',
            help: '{month}, {day} and {year} are filled in automatically.',
          },
        ],
      },
    ],
  },
];

export default function SiteChromePage() {
  return (
    <ContentEditor
      file="site"
      tabs={SITE_TABS}
      eyebrow="Site-wide"
      title="Navigation & chrome"
      lede="The header, footer and the wording that repeats across every page. A change here shows up everywhere at once."
      commitMessage="update site chrome"
      savedMessage="Site chrome saved. Live in about 2 minutes on the deployed site."
    />
  );
}
