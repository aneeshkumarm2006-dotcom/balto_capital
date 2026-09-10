'use client';

/* BALTO CMS - Pages: the site-copy editor for the public marketing pages.
   Edits content/pages.json as ONE document: a single draft + snapshot spans
   every tab, so switching tabs never loses work and one Save publishes the lot.

   This file is CONFIG ONLY. The form machinery - loading, validation, image
   upload, growable lists, the save bar - lives in the shared ContentEditor
   engine. To expose a new field to the client, add it to SECTION_TABS below
   and make sure the public page reads it from lib/pages.ts. */

import {
  ContentEditor,
  EYEBROW,
  TITLE,
  type FieldDef,
  type TabDef,
} from '@/components/admin/ContentEditor';

const SECTION_TABS: TabDef[] = [
  {
    id: 'home',
    label: 'Homepage',
    sections: [
      {
        title: 'Hero',
        path: ['home', 'hero'],
        fields: [
          EYEBROW,
          TITLE,
          { key: 'subtitle', label: 'Subtitle', kind: 'textareaWide' },
          { key: 'searchButton', label: 'Search button label', kind: 'input' },
          {
            key: 'disclaimer',
            label: 'Pricing disclaimer (fine print under the search button)',
            kind: 'textarea',
          },
          { key: 'image', label: 'Hero image', kind: 'image' },
          {
            key: 'imageAlt',
            label: 'Hero image description',
            kind: 'input',
            help: 'Read aloud by screen readers and shown if the photo fails to load. Describe what is in the picture.',
          },
        ],
      },
      {
        title: 'Hero search bar',
        path: ['home', 'hero', 'search'],
        fields: [
          { key: 'cityLabel', label: 'City field label', kind: 'input' },
          { key: 'cityAnyLabel', label: 'City field — "any city" option', kind: 'input' },
          { key: 'rentLabel', label: 'Price field label', kind: 'input' },
          { key: 'rentAnyLabel', label: 'Price field — wording when no price is set', kind: 'input' },
          { key: 'rentMinInputLabel', label: 'Price popover — "minimum" label', kind: 'input' },
          { key: 'rentMaxInputLabel', label: 'Price popover — "maximum" label', kind: 'input' },
          {
            key: 'rentSummaryTemplate',
            label: 'Price field wording once a range is set',
            kind: 'input',
            help: 'Use {min} and {max} — they are replaced with the chosen prices, e.g. "{min} - {max}".',
          },
          {
            key: 'rentMin',
            label: 'Lowest rent the slider can reach (number only)',
            kind: 'input',
            help: 'Also sets the low end of the filters on the Residences page. Leave at 800 unless the portfolio moves.',
          },
          { key: 'rentMax', label: 'Highest rent the slider can reach (number only)', kind: 'input' },
          { key: 'rentStep', label: 'Slider increment in dollars (number only)', kind: 'input' },
          { key: 'bedsLabel', label: 'Bedrooms field label', kind: 'input' },
          { key: 'bedsAnyLabel', label: 'Bedrooms field — "any size" option', kind: 'input' },
        ],
      },
      {
        title: 'Hero search bar — bedroom options',
        path: ['home', 'hero', 'search'],
        list: {
          key: 'bedOptions',
          itemLabel: 'Bedroom option',
          growable: true,
          min: 1,
          help: 'Bedroom counts are matched by the search, so change the wording rather than the value.',
          fields: [
            { key: 'value', label: 'Bedrooms (number only)', kind: 'input' },
            { key: 'label', label: 'Option wording', kind: 'input' },
          ],
        },
      },
      {
        title: 'Our cities',
        path: ['home', 'cities'],
        fields: [
          EYEBROW,
          TITLE,
          { key: 'blurb', label: 'Blurb', kind: 'textareaWide' },
          { key: 'comingSoonBadge', label: 'Coming-soon badge', kind: 'input' },
          { key: 'comingSoonCta', label: 'Coming-soon link label', kind: 'input' },
          { key: 'liveCta', label: 'Live-city link label', kind: 'input' },
          {
            key: 'emptyMessage',
            label: 'Message when no city is published',
            kind: 'textarea',
            help: 'Shown in place of the city grid if every city is hidden.',
          },
        ],
      },
      {
        title: 'Featured residences',
        path: ['home', 'featured'],
        fields: [
          EYEBROW,
          TITLE,
          { key: 'viewAllLabel', label: 'View-all button label', kind: 'input' },
          {
            key: 'emptyMessage',
            label: 'Message when nothing is featured',
            kind: 'textarea',
            help: 'Shown in place of the cards if no residence is marked as featured.',
          },
        ],
      },
      {
        title: 'Benefits (why rent with Balto)',
        path: ['home', 'benefits'],
        fields: [
          EYEBROW,
          TITLE,
          { key: 'subtitle', label: 'Subtitle', kind: 'textareaWide' },
        ],
        list: {
          key: 'items',
          itemLabel: 'Benefit',
          growable: true,
          min: 1,
          help: 'Add, re-order or remove benefits — they fill the grid in this order.',
          fields: [
            TITLE,
            { key: 'body', label: 'Body', kind: 'textarea' },
          ],
        },
      },
      {
        title: 'How to rent',
        path: ['home', 'steps'],
        fields: [EYEBROW, TITLE],
        list: {
          key: 'items',
          itemLabel: 'Step',
          stringKind: 'input',
          growable: true,
          min: 1,
          help: 'Steps are numbered on the website in this order.',
        },
      },
      {
        title: 'Our story',
        path: ['home', 'story'],
        fields: [
          EYEBROW,
          TITLE,
          { key: 'paragraph', label: 'Paragraph', kind: 'textareaWide' },
          { key: 'image', label: 'Story image', kind: 'image' },
          {
            key: 'imageAlt',
            label: 'Story image description',
            kind: 'input',
            help: 'Read aloud by screen readers and shown if the photo fails to load.',
          },
        ],
        list: {
          key: 'timeline',
          itemLabel: 'Timeline entry',
          growable: true,
          min: 1,
          help: 'The story timeline, oldest first.',
          fields: [
            { key: 'year', label: 'Year', kind: 'input' },
            { key: 'label', label: 'Label', kind: 'input' },
          ],
        },
        fieldsAfter: [{ key: 'ctaLabel', label: 'Button label', kind: 'input' }],
      },
      {
        title: 'Call to action',
        path: ['home', 'cta'],
        fields: [
          EYEBROW,
          TITLE,
          { key: 'body', label: 'Body', kind: 'textareaWide' },
          { key: 'primaryLabel', label: 'Primary button label', kind: 'input' },
          { key: 'secondaryLabel', label: 'Secondary button label', kind: 'input' },
        ],
      },
      {
        title: 'Search engine listing',
        path: ['home', 'meta'],
        fields: [
          {
            key: 'title',
            label: 'Page title',
            kind: 'input',
            help: 'Shown in the browser tab and as the blue headline in Google results. Aim for under 60 characters.',
          },
          {
            key: 'description',
            label: 'Search result description',
            kind: 'textareaWide',
            help: 'The grey summary under the headline in Google results. Aim for 140-160 characters.',
          },
        ],
      },
    ],
  },
  {
    id: 'about',
    label: 'About',
    sections: [
      {
        title: 'Hero',
        path: ['about', 'hero'],
        fields: [
          EYEBROW,
          {
            key: 'titleItalic',
            label: 'Title — italic part',
            kind: 'input',
            help: 'Rendered in italics before the rest of the title.',
          },
          { key: 'titleRest', label: 'Title — remaining part', kind: 'input' },
          { key: 'subtitle', label: 'Subtitle', kind: 'textareaWide' },
          { key: 'image', label: 'Hero video poster image', kind: 'image' },
          {
            key: 'video',
            label: 'Hero background film',
            kind: 'input',
            help: 'Path to the video file, e.g. /video/about-bg.mp4. Films are uploaded by your developer; the poster image above is what shows until it plays.',
          },
          { key: 'scrollCue', label: 'Scroll cue wording', kind: 'input' },
        ],
      },
      {
        title: 'Our story',
        path: ['about', 'story'],
        fields: [
          EYEBROW,
          { key: 'lead', label: 'Lead paragraph', kind: 'textareaWide' },
        ],
        list: {
          key: 'cards',
          itemLabel: 'Card',
          growable: true,
          min: 1,
          fields: [
            { key: 'numeral', label: 'Numeral (I, II, III…)', kind: 'input' },
            { key: 'eyebrow', label: 'Eyebrow', kind: 'input' },
            { key: 'quote', label: 'Quote', kind: 'textareaWide' },
            { key: 'body', label: 'Body', kind: 'textareaWide' },
          ],
        },
        fieldsAfter: [
          { key: 'close', label: 'Closing paragraph', kind: 'textareaWide' },
        ],
      },
      {
        title: 'Standards',
        path: ['about', 'standards'],
        fields: [EYEBROW, TITLE],
        list: {
          key: 'items',
          itemLabel: 'Standard',
          stringKind: 'textarea',
          growable: true,
          min: 1,
        },
      },
      {
        title: 'Figures',
        path: ['about', 'figures'],
        fields: [
          EYEBROW,
          TITLE,
          { key: 'blurb', label: 'Blurb', kind: 'textareaWide' },
        ],
        list: {
          key: 'items',
          itemLabel: 'Figure',
          growable: true,
          min: 1,
          fields: [
            { key: 'value', label: 'Value (the large number)', kind: 'input' },
            { key: 'label', label: 'Label', kind: 'input' },
            { key: 'body', label: 'Body', kind: 'textarea' },
          ],
        },
      },
      {
        title: 'Call to action',
        path: ['about', 'cta'],
        fields: [
          EYEBROW,
          TITLE,
          { key: 'buttonLabel', label: 'Button label', kind: 'input' },
        ],
      },
      {
        title: 'Search engine listing',
        path: ['about', 'meta'],
        fields: [
          {
            key: 'title',
            label: 'Page title',
            kind: 'input',
            help: 'Shown in the browser tab and as the blue headline in Google results. Aim for under 60 characters.',
          },
          {
            key: 'description',
            label: 'Search result description',
            kind: 'textareaWide',
            help: 'The grey summary under the headline in Google results. Aim for 140-160 characters.',
          },
        ],
      },
    ],
  },
  {
    id: 'whyBalto',
    label: 'Why Balto',
    sections: [
      {
        title: 'Hero',
        path: ['whyBalto', 'hero'],
        fields: [
          EYEBROW,
          TITLE,
          { key: 'image', label: 'Hero background image', kind: 'image' },
          {
            key: 'imageAlt',
            label: 'Hero image description',
            kind: 'input',
            help: 'Read aloud by screen readers and shown if the photo fails to load.',
          },
        ],
      },
      {
        title: 'Introduction',
        path: ['whyBalto', 'intro'],
        fields: [
          { key: 'pullQuote', label: 'Pull quote', kind: 'textareaWide' },
          { key: 'attribution', label: 'Quote attribution', kind: 'input' },
          { key: 'paragraph1', label: 'First paragraph', kind: 'textareaWide' },
          { key: 'paragraph2', label: 'Second paragraph', kind: 'textareaWide' },
        ],
      },
      {
        title: 'Pillars',
        path: ['whyBalto'],
        list: {
          key: 'pillars',
          itemLabel: 'Pillar',
          growable: true,
          min: 1,
          help: 'Each pillar is a full-width band with its own image, in this order.',
          fields: [
            { key: 'eyebrow', label: 'Eyebrow (numeral and theme)', kind: 'input' },
            TITLE,
            { key: 'body', label: 'Body', kind: 'textareaWide' },
            { key: 'image', label: 'Pillar image', kind: 'image' },
            {
              key: 'imageAlt',
              label: 'Pillar image description',
              kind: 'input',
              help: 'Read aloud by screen readers and shown if the photo fails to load.',
            },
          ],
        },
      },
      {
        title: 'Statistics',
        path: ['whyBalto'],
        list: {
          key: 'stats',
          itemLabel: 'Stat',
          growable: true,
          min: 1,
          fields: [
            { key: 'value', label: 'Value (the large number)', kind: 'input' },
            { key: 'label', label: 'Label', kind: 'input' },
          ],
        },
      },
      {
        title: 'Call to action',
        path: ['whyBalto', 'cta'],
        fields: [
          TITLE,
          { key: 'buttonLabel', label: 'Button label', kind: 'input' },
        ],
      },
      {
        title: 'Search engine listing',
        path: ['whyBalto', 'meta'],
        fields: [
          {
            key: 'title',
            label: 'Page title',
            kind: 'input',
            help: 'Shown in the browser tab and as the blue headline in Google results. Aim for under 60 characters.',
          },
          {
            key: 'description',
            label: 'Search result description',
            kind: 'textareaWide',
            help: 'The grey summary under the headline in Google results. Aim for 140-160 characters.',
          },
        ],
      },
    ],
  },
  {
    id: 'careers',
    label: 'Careers',
    sections: [
      {
        title: 'Hero',
        path: ['careers', 'hero'],
        fields: [
          EYEBROW,
          TITLE,
          { key: 'subtitle', label: 'Subtitle', kind: 'textareaWide' },
        ],
      },
      {
        title: 'Openings',
        path: ['careers', 'openings'],
        fields: [
          EYEBROW,
          TITLE,
          {
            key: 'noOpeningsMessage',
            label: 'No-openings message (also shown in the top navigation)',
            kind: 'textarea',
          },
          {
            key: 'contactIntro',
            label: 'Contact line (shown before the email address)',
            kind: 'textarea',
          },
          {
            key: 'contactOutro',
            label: 'Punctuation after the email address',
            kind: 'input',
            help: 'Closes the sentence after the email link — usually just a full stop.',
          },
          { key: 'buttonLabel', label: 'Button label', kind: 'input' },
        ],
      },
      {
        title: 'Key benefits',
        path: ['careers', 'benefits'],
        fields: [EYEBROW, TITLE],
        list: {
          key: 'items',
          itemLabel: 'Benefit',
          stringKind: 'input',
          growable: true,
          min: 1,
        },
      },
      {
        title: 'Search engine listing',
        path: ['careers', 'meta'],
        fields: [
          {
            key: 'title',
            label: 'Page title',
            kind: 'input',
            help: 'Shown in the browser tab and as the blue headline in Google results. Aim for under 60 characters.',
          },
          {
            key: 'description',
            label: 'Search result description',
            kind: 'textareaWide',
            help: 'The grey summary under the headline in Google results. Aim for 140-160 characters.',
          },
        ],
      },
    ],
  },
  {
    id: 'residences',
    label: 'Residences list',
    sections: [
      {
        title: 'Page title & result count',
        path: ['residences'],
        fields: [
          { key: 'title', label: 'Page title', kind: 'input' },
          {
            key: 'resultCount',
            label: 'Result line under the title',
            kind: 'input',
            help: 'Write {count} where the number of matching residences should appear and {total} for the total. Both must stay exactly as written, curly braces included.',
          },
        ],
      },
      {
        title: 'Breadcrumb',
        path: ['residences', 'breadcrumb'],
        fields: [
          { key: 'homeLabel', label: 'Link back to the homepage', kind: 'input' },
          { key: 'currentLabel', label: 'Current page label', kind: 'input' },
        ],
      },
      {
        title: 'Search chip',
        path: ['residences', 'searchChip'],
        fields: [
          {
            key: 'prefix',
            label: 'Text before the search term',
            kind: 'input',
            help: 'Shown above the results when someone arrives with a search, e.g. Searching “Riverbend”. The search term and its quote marks are added automatically.',
          },
        ],
      },
      {
        title: 'Filters button',
        path: ['residences', 'toolbar'],
        fields: [
          { key: 'showFiltersLabel', label: 'Button label', kind: 'input' },
        ],
      },
      {
        title: 'No results',
        path: ['residences', 'emptyState'],
        fields: [
          { key: 'title', label: 'Message when nothing matches', kind: 'input' },
          { key: 'clearLabel', label: 'Reset button label', kind: 'input' },
        ],
      },
      {
        title: 'Map placeholder',
        path: ['residences', 'loading'],
        fields: [
          {
            key: 'mapLabel',
            label: 'Screen-reader label while the map loads',
            kind: 'input',
            help: 'Not visible on screen — read aloud by screen readers in the moment before the map appears.',
          },
        ],
      },
      {
        title: 'Filter panel',
        path: ['residences', 'filters'],
        fields: [
          {
            key: 'eyebrow',
            label: 'Panel heading (small label at the top)',
            kind: 'input',
          },
          {
            key: 'closeLabel',
            label: 'Screen-reader label for the close button',
            kind: 'input',
            help: 'Not visible on screen — read aloud for the X that closes the panel.',
          },
          { key: 'clearLabel', label: 'Clear button label', kind: 'input' },
          { key: 'applyLabel', label: 'Apply button label', kind: 'input' },
        ],
      },
      {
        title: 'Filters — bedrooms',
        path: ['residences', 'filters', 'bedrooms'],
        fields: [
          { key: 'heading', label: 'Section heading', kind: 'input' },
        ],
        list: {
          key: 'options',
          itemLabel: 'Bedroom button',
          help: 'The four bedroom buttons, in the order they appear. What each button filters by is fixed in the design — only the wording is editable.',
          fields: [
            { key: 'label', label: 'Button text', kind: 'input' },
          ],
        },
      },
      {
        title: 'Filters — price range',
        path: ['residences', 'filters', 'price'],
        fields: [
          { key: 'heading', label: 'Section heading', kind: 'input' },
          {
            key: 'readoutPrefix',
            label: 'Word before the lowest price',
            kind: 'input',
            help: 'The line reads: From $800 to $3,500 /mo.',
          },
          {
            key: 'readoutSeparator',
            label: 'Word between the two prices',
            kind: 'input',
          },
          {
            key: 'readoutSuffix',
            label: 'Text after the highest price',
            kind: 'input',
            help: 'Keep the space at the start — it separates the price from /mo.',
          },
        ],
      },
      {
        title: 'Filters — amenities',
        path: ['residences', 'filters', 'amenities'],
        fields: [
          { key: 'heading', label: 'Section heading', kind: 'input' },
        ],
        list: {
          key: 'options',
          itemLabel: 'Amenity',
          growable: true,
          min: 1,
          help: 'The amenity checkboxes, in the order they appear. Add, re-order or remove them freely — a checkbox shows a residence when the match word appears in that residence’s amenities or features.',
          fields: [
            { key: 'label', label: 'Checkbox text', kind: 'input' },
            {
              key: 'key',
              label: 'Match word',
              kind: 'input',
              help: 'The word looked for in each residence’s amenities and features, ignoring capitals — “parking” matches “Heated underground parking”. Keep it short. Changing it also changes the link people get when they share a filtered search.',
            },
          ],
        },
      },
      {
        title: 'Sort menu',
        path: ['residences', 'sort'],
        fields: [
          {
            key: 'triggerPrefix',
            label: 'Text on the sort button, before the choice',
            kind: 'input',
            help: 'Reads: Sort by: Alphabetical (A–Z).',
          },
        ],
        list: {
          key: 'options',
          itemLabel: 'Sort option',
          help: 'The four sort choices, in menu order. What each one sorts by is fixed in the design — only the wording is editable.',
          fields: [
            { key: 'label', label: 'Option text', kind: 'input' },
          ],
        },
      },
      {
        title: 'Search engine listing',
        path: ['residences', 'meta'],
        fields: [
          {
            key: 'title',
            label: 'Page title',
            kind: 'input',
            help: 'Shown in the browser tab and as the blue headline in Google results. Aim for under 60 characters.',
          },
          {
            key: 'description',
            label: 'Search result description',
            kind: 'textareaWide',
            help: 'The grey summary under the headline in Google results. Aim for 140-160 characters.',
          },
        ],
      },
    ],
  },
  {
    id: 'city',
    label: 'City pages',
    sections: [
      {
        title: 'Breadcrumb',
        path: ['city', 'breadcrumb'],
        fields: [
          { key: 'homeLabel', label: '"Home" link', kind: 'input' },
          { key: 'residencesLabel', label: '"Residences" link', kind: 'input' },
        ],
      },
      {
        title: 'Coming-soon city (register interest)',
        path: ['city', 'comingSoon'],
        fields: [
          {
            key: 'eyebrow',
            label: 'Eyebrow (small label above the city name)',
            kind: 'input',
            help: '{province} is replaced with the province. Keep the · character.',
          },
          {
            key: 'title',
            label: 'Title',
            kind: 'input',
            help: '{city} is replaced with the city name.',
          },
          { key: 'body', label: 'Intro paragraph', kind: 'textareaWide' },
          { key: 'emailPlaceholder', label: 'Email field placeholder', kind: 'input' },
          { key: 'submitLabel', label: 'Submit button label', kind: 'input' },
          {
            key: 'successMessage',
            label: 'Thank-you message (replaces the form once sent)',
            kind: 'textarea',
          },
          {
            key: 'footnote',
            label: 'Fine print under the form',
            kind: 'input',
            help: 'Keep the · character.',
          },
        ],
      },
      {
        title: 'Standard city listing',
        path: ['city', 'listing'],
        fields: [
          {
            key: 'title',
            label: 'Page title',
            kind: 'input',
            help: '{city} is replaced with the city name.',
          },
          {
            key: 'countSingular',
            label: 'Result count — one residence',
            kind: 'input',
            help: '{count} is replaced with the number found.',
          },
          {
            key: 'countPlural',
            label: 'Result count — several residences',
            kind: 'input',
            help: '{count} is replaced with the number found.',
          },
          { key: 'showFiltersLabel', label: 'Filters button label', kind: 'input' },
          { key: 'emptyTitle', label: 'No-results message', kind: 'input' },
          { key: 'emptyClearLabel', label: 'No-results button label', kind: 'input' },
          {
            key: 'paginationLabel',
            label: 'Pagination line',
            kind: 'input',
            help: 'Static placeholder — pagination is not wired up on this page yet.',
          },
        ],
      },
      {
        title: 'Portfolio city — cover',
        path: ['city', 'portfolio', 'cover'],
        fields: [
          {
            key: 'eyebrow',
            label: 'Eyebrow (small label above the city name)',
            kind: 'input',
            help: '{province} is replaced with the province. Keep the · character.',
          },
          {
            key: 'title',
            label: 'Title',
            kind: 'input',
            help: '{city} is replaced with the city name.',
          },
          {
            key: 'imageAlt',
            label: 'Cover photo description (for screen readers)',
            kind: 'input',
            help: '{city} and {province} are replaced automatically.',
          },
        ],
      },
      {
        title: 'Portfolio city — filter bar',
        path: ['city', 'portfolio', 'toolbar'],
        fields: [
          {
            key: 'countSingular',
            label: 'Result count — one residence',
            kind: 'input',
            help: '{count} and {city} are replaced automatically.',
          },
          {
            key: 'countPlural',
            label: 'Result count — several residences',
            kind: 'input',
            help: '{count} and {city} are replaced automatically.',
          },
          {
            key: 'countAreaSuffix',
            label: 'Added to the count during a map-area search',
            kind: 'input',
            help: 'A space is added before this automatically — do not start with one.',
          },
          { key: 'showFiltersLabel', label: 'Filters button label', kind: 'input' },
          {
            key: 'moreFiltersLabel',
            label: '"More filters" button label (map layout)',
            kind: 'input',
          },
          {
            key: 'cityFilterLabel',
            label: 'City dropdown name (for screen readers)',
            kind: 'input',
          },
          {
            key: 'allCitiesLabel',
            label: 'City dropdown — all-cities option',
            kind: 'input',
          },
          {
            key: 'bedroomsFilterLabel',
            label: 'Bedrooms dropdown name (for screen readers)',
            kind: 'input',
          },
          {
            key: 'allBedroomsLabel',
            label: 'Bedrooms dropdown — all-sizes option',
            kind: 'input',
          },
          {
            key: 'bedroomStudioLabel',
            label: 'Bedrooms — studio option',
            kind: 'input',
          },
          {
            key: 'bedroomSingular',
            label: 'Bedrooms — one bedroom',
            kind: 'input',
            help: '{count} is replaced with the number of bedrooms.',
          },
          {
            key: 'bedroomPlural',
            label: 'Bedrooms — two bedrooms',
            kind: 'input',
            help: '{count} is replaced with the number of bedrooms.',
          },
          { key: 'bedroomMaxLabel', label: 'Bedrooms — three or more', kind: 'input' },
          {
            key: 'viewToggleLabel',
            label: 'List/map toggle name (for screen readers)',
            kind: 'input',
          },
          { key: 'listViewLabel', label: 'List view button label', kind: 'input' },
          { key: 'mapViewLabel', label: 'Map view button label', kind: 'input' },
          { key: 'hideMapLabel', label: 'Hide-map button label', kind: 'input' },
          { key: 'showMapLabel', label: 'Show-map button label', kind: 'input' },
        ],
      },
      {
        title: 'Portfolio city — residence rows',
        path: ['city', 'portfolio', 'row'],
        fields: [
          {
            key: 'imageLabel',
            label: 'Photo link description (for screen readers)',
            kind: 'input',
            help: '{name} and {city} are replaced automatically.',
          },
          {
            key: 'placeholderCaption',
            label: 'Caption when a photo is missing',
            kind: 'input',
            help: '{name} is replaced with the residence name. Keep the · character.',
          },
          { key: 'suitesLabel', label: '"Suites" label', kind: 'input' },
          { key: 'priceFromLabel', label: '"From" label above the rent', kind: 'input' },
          { key: 'priceSuffix', label: 'Unit shown after the rent', kind: 'input' },
          {
            key: 'unavailableValue',
            label: 'Shown when a building has no units on file',
            kind: 'input',
            help: 'Currently an em dash (—).',
          },
          {
            key: 'viewResidenceLabel',
            label: 'View-residence button label',
            kind: 'input',
          },
        ],
      },
      {
        title: 'Portfolio city — rows beside the map',
        path: ['city', 'portfolio', 'splitRow'],
        fields: [
          { key: 'featuredBadge', label: 'Badge on featured buildings', kind: 'input' },
          { key: 'priceFromLabel', label: '"From" label above the rent', kind: 'input' },
          { key: 'priceSuffix', label: 'Unit shown after the rent', kind: 'input' },
          {
            key: 'noPriceLabel',
            label: 'Shown instead of a rent when none is on file',
            kind: 'input',
          },
          {
            key: 'viewLabel',
            label: 'Arrow button description (for screen readers)',
            kind: 'input',
            help: '{name} is replaced with the residence name.',
          },
        ],
      },
      {
        title: 'Portfolio city — no results',
        path: ['city', 'portfolio', 'empty'],
        fields: [
          { key: 'title', label: 'No-results message (filters)', kind: 'input' },
          {
            key: 'clearLabel',
            label: 'No-results button label (filters)',
            kind: 'input',
          },
          {
            key: 'inAreaTitle',
            label: 'No-results message (map area search)',
            kind: 'input',
          },
          {
            key: 'clearAreaLabel',
            label: 'No-results button label (map area search)',
            kind: 'input',
          },
        ],
      },
      {
        title: 'Search engine listing',
        path: ['city', 'meta'],
        fields: [
          {
            key: 'titleTemplate',
            label: 'Page title',
            kind: 'input',
            help: 'Shown in the browser tab and as the blue headline in Google results. Aim for under 60 characters. Use {city} or {name} where the residence or city should appear.',
          },
          {
            key: 'descriptionTemplate',
            label: 'Search result description',
            kind: 'textareaWide',
            help: 'The grey summary under the headline in Google results. Aim for 140-160 characters. Use {city} or {name} where the residence or city should appear.',
          },
        ],
      },
    ],
  },
  {
    id: 'property',
    label: 'Residence pages',
    sections: [
      {
        title: 'Breadcrumb',
        path: ['property', 'breadcrumb'],
        fields: [
          { key: 'home', label: 'Home link', kind: 'input' },
          { key: 'residences', label: 'Residences link', kind: 'input' },
          {
            key: 'separator',
            label: 'Divider between links',
            kind: 'input',
            help: 'Drawn between every breadcrumb link.',
          },
        ],
      },
      {
        title: 'Page header',
        path: ['property', 'header'],
        fields: [
          {
            key: 'eyebrowSeparator',
            label: 'City / neighbourhood divider',
            kind: 'input',
            help: 'Sits between the city and the neighbourhood, e.g. "Edmonton · Oliver".',
          },
          {
            key: 'title',
            label: 'Heading pattern',
            kind: 'input',
            help: '{name} is replaced with the residence name. The full stop is part of the house style.',
          },
        ],
      },
      {
        title: 'Photo gallery',
        path: ['property', 'gallery'],
        fields: [
          { key: 'viewAllLabel', label: 'View-all button label', kind: 'input' },
          {
            key: 'mainPhotoAlt',
            label: 'Main photo alt text',
            kind: 'input',
            help: '{name} = residence name. Read aloud by screen readers.',
          },
          {
            key: 'thumbPhotoAlt',
            label: 'Thumbnail alt text',
            kind: 'input',
            help: '{name} = residence name, {number} = photo position.',
          },
          {
            key: 'emptyThumbCaption',
            label: 'Empty thumbnail glyph',
            kind: 'input',
            help: 'Placeholder shown in a thumbnail tile with no photo.',
          },
          {
            key: 'unitModalEyebrow',
            label: 'Unit photos pop-up eyebrow',
            kind: 'input',
          },
          {
            key: 'unitModalTitle',
            label: 'Unit photos pop-up heading',
            kind: 'input',
            help: '{name} = residence name, {unit} = unit label (e.g. "Unit 305").',
          },
        ],
      },
      {
        title: 'Photo lightbox (also used in the staff portal)',
        path: ['property', 'lightbox'],
        fields: [
          { key: 'closeLabel', label: 'Close button (screen readers)', kind: 'input' },
          {
            key: 'previousLabel',
            label: 'Previous button (screen readers)',
            kind: 'input',
          },
          { key: 'nextLabel', label: 'Next button (screen readers)', kind: 'input' },
          {
            key: 'photoAlt',
            label: 'Photo alt text',
            kind: 'input',
            help: '{label} = building or unit label, {number} = photo position.',
          },
          {
            key: 'photoAltFallback',
            label: 'Photo alt text — no label',
            kind: 'input',
            help: '{number} = photo position.',
          },
          {
            key: 'counter',
            label: 'Photo counter',
            kind: 'input',
            help: '{current} = current photo, {total} = total photos.',
          },
        ],
      },
      {
        title: 'Price line',
        path: ['property', 'price'],
        fields: [
          { key: 'fromPrefix', label: 'Price prefix', kind: 'input' },
          { key: 'perMonthSuffix', label: 'Price suffix', kind: 'input' },
          {
            key: 'bedroomsSeparator',
            label: 'Divider before bedroom summary',
            kind: 'input',
          },
        ],
      },
      {
        title: 'Promotion banner',
        path: ['property', 'promo'],
        fields: [
          { key: 'tag', label: 'Banner tag', kind: 'input' },
          {
            key: 'offerSingular',
            label: 'Offer wording — one free month',
            kind: 'input',
            help: '{count} = number of free months.',
          },
          {
            key: 'offerPlural',
            label: 'Offer wording — several free months',
            kind: 'input',
            help: '{count} = number of free months.',
          },
        ],
      },
      {
        title: 'Quick stats',
        path: ['property', 'quickStats'],
        fields: [
          { key: 'bedroomsLabel', label: 'Bedrooms label', kind: 'input' },
          {
            key: 'bedroomsNoneValue',
            label: 'Bedrooms value — nothing available',
            kind: 'input',
          },
          { key: 'availabilityLabel', label: 'Availability label', kind: 'input' },
          {
            key: 'availabilityNoneValue',
            label: 'Availability — nothing available',
            kind: 'input',
          },
          {
            key: 'availabilityNowValue',
            label: 'Availability — available now',
            kind: 'input',
          },
          {
            key: 'availabilitySoonValue',
            label: 'Availability — coming soon',
            kind: 'input',
          },
        ],
      },
      {
        title: 'Section headings',
        path: ['property', 'sections'],
        fields: [
          { key: 'overviewTitle', label: 'Overview heading', kind: 'input' },
          {
            key: 'incentivesTitle',
            label: 'Heading when the building lists incentives',
            kind: 'input',
          },
          {
            key: 'featuresTitle',
            label: 'Heading when it lists features instead',
            kind: 'input',
          },
          {
            key: 'unitPhotosTitle',
            label: 'Heading when the building lists unit photos',
            kind: 'input',
          },
          {
            key: 'amenitiesTitle',
            label: 'Heading when it lists amenities instead',
            kind: 'input',
          },
          { key: 'suitesTitle', label: 'Available suites heading', kind: 'input' },
          { key: 'locationTitle', label: 'Location heading', kind: 'input' },
          { key: 'nearbyEyebrow', label: 'Nearby list eyebrow', kind: 'input' },
        ],
      },
      {
        title: 'Available suites table',
        path: ['property', 'suites'],
        fields: [
          {
            key: 'emptyMessage',
            label: 'Message when nothing is available',
            kind: 'textarea',
          },
          { key: 'disclaimer', label: 'Rent disclaimer', kind: 'textareaWide' },
          { key: 'unitNumberHeader', label: 'Column — unit number', kind: 'input' },
          { key: 'unitTypeHeader', label: 'Column — unit type', kind: 'input' },
          { key: 'rentHeader', label: 'Column — rent', kind: 'input' },
          { key: 'imagesHeader', label: 'Column — images', kind: 'input' },
          {
            key: 'applyColumnLabel',
            label: 'Apply column name (screen readers)',
            kind: 'input',
          },
          {
            key: 'unitNumberUnknownValue',
            label: 'Unit number when unknown',
            kind: 'input',
            help: 'Placeholder shown when the sheet has no unit number for a row.',
          },
          { key: 'rentSuffix', label: 'Rent suffix', kind: 'input' },
          { key: 'viewLabel', label: 'View photos link label', kind: 'input' },
          {
            key: 'noPhotosValue',
            label: 'Images cell when there are no photos',
            kind: 'input',
          },
          { key: 'applyLabel', label: 'Apply button label', kind: 'input' },
          {
            key: 'unitPhotosLabel',
            label: 'Unit photo set label',
            kind: 'input',
            help: '{unit} = unit number.',
          },
        ],
      },
      {
        title: 'Booking sidebar',
        path: ['property', 'sidebar'],
        fields: [
          {
            key: 'planEyebrowFallback',
            label: 'Price eyebrow when no plan is selected',
            kind: 'input',
          },
          { key: 'perMonthSuffix', label: 'Price suffix', kind: 'input' },
          { key: 'availableNowLine', label: 'Status — available now', kind: 'input' },
          { key: 'comingSoonLine', label: 'Status — coming soon', kind: 'input' },
          { key: 'netEffectiveNote', label: 'Net-effective note', kind: 'textarea' },
          { key: 'floorPlansEyebrow', label: 'Floor plans eyebrow', kind: 'input' },
          { key: 'planPriceSuffix', label: 'Floor plan price suffix', kind: 'input' },
          { key: 'noSuitesEyebrow', label: 'No-suites card eyebrow', kind: 'input' },
          { key: 'noSuitesTitle', label: 'No-suites card heading', kind: 'input' },
          { key: 'noSuitesBody', label: 'No-suites card body', kind: 'textareaWide' },
          { key: 'bookViewingLabel', label: 'Book a viewing button', kind: 'input' },
          { key: 'residentPortalLabel', label: 'Resident portal link', kind: 'input' },
          {
            key: 'residentPortalComingSoonLabel',
            label: 'Resident portal — no link yet',
            kind: 'input',
          },
          { key: 'maintenanceLabel', label: 'Maintenance request link', kind: 'input' },
          {
            key: 'maintenanceComingSoonLabel',
            label: 'Maintenance request — no link yet',
            kind: 'input',
          },
          { key: 'favoritesLabel', label: 'Save to favourites label', kind: 'input' },
          { key: 'contactEyebrow', label: 'Contact eyebrow', kind: 'input' },
        ],
      },
      {
        title: 'Similar residences',
        path: ['property', 'similar'],
        fields: [
          { key: 'eyebrow', label: 'Eyebrow', kind: 'input' },
          { key: 'title', label: 'Heading', kind: 'input', help: '{city} = city name.' },
        ],
      },
      {
        title: 'Search engine listing',
        path: ['property', 'meta'],
        fields: [
          {
            key: 'titleTemplate',
            label: 'Page title',
            kind: 'input',
            help: 'Shown in the browser tab and as the blue headline in Google results. Aim for under 60 characters. Use {city} or {name} where the residence or city should appear.',
          },
          {
            key: 'descriptionTemplate',
            label: 'Search result description',
            kind: 'textareaWide',
            help: 'The grey summary under the headline in Google results. Aim for 140-160 characters. Use {city} or {name} where the residence or city should appear.',
          },
        ],
      },
    ],
  },
  {
    id: 'inquire',
    label: 'Contact & enquiries',
    sections: [
      {
        title: 'Hero',
        path: ['inquire', 'hero'],
        fields: [
          {
            key: 'eyebrow',
            label: 'Eyebrow (small label above the title)',
            kind: 'input',
          },
          {
            key: 'titleLine1',
            label: 'Title, first line',
            kind: 'input',
            help: 'The title is set on two lines. This is the top line.',
          },
          { key: 'titleLine2', label: 'Title, second line', kind: 'input' },
          { key: 'intro', label: 'Intro paragraph', kind: 'textareaWide' },
        ],
      },
      {
        title: 'Contact details (labels)',
        path: ['inquire', 'contact'],
        fields: [
          {
            key: 'emailLabel',
            label: 'Email label',
            kind: 'input',
            help: 'Label only. The email address itself is edited in Settings.',
          },
          {
            key: 'phoneLabel',
            label: 'Telephone label',
            kind: 'input',
            help: 'Label only. The phone number itself is edited in Settings.',
          },
          {
            key: 'officeLabel',
            label: 'Office label',
            kind: 'input',
            help: 'Label only. The office location itself is edited in Settings.',
          },
          {
            key: 'officeHoursLabel',
            label: 'Office hours label',
            kind: 'input',
            help: 'Label only. The hours themselves are edited in Settings.',
          },
        ],
      },
      {
        title: 'Inquiry form',
        path: ['inquire', 'form'],
        fields: [
          {
            key: 'eyebrow',
            label: 'Eyebrow (small label above the form)',
            kind: 'input',
          },
          { key: 'nameLabel', label: 'Full name field label', kind: 'input' },
          { key: 'emailLabel', label: 'Email field label', kind: 'input' },
          { key: 'phoneLabel', label: 'Telephone field label', kind: 'input' },
          {
            key: 'phonePlaceholder',
            label: 'Telephone field placeholder',
            kind: 'input',
            help: 'Grey hint text shown in the empty field.',
          },
          { key: 'cityLabel', label: 'City field label', kind: 'input' },
          {
            key: 'cityAriaLabel',
            label: 'City field, screen-reader name',
            kind: 'input',
            help: 'Read aloud by screen readers. Keep it in sentence case and in step with the city field label.',
          },
          {
            key: 'cityPlaceholderOption',
            label: 'City dropdown, first option',
            kind: 'input',
            help: 'Shown before a city is chosen. The cities in the list come from the live-city data, not from here.',
          },
          { key: 'moveInLabel', label: 'Move-in date field label', kind: 'input' },
          {
            key: 'moveInAriaLabel',
            label: 'Move-in date field, screen-reader name',
            kind: 'input',
            help: 'Read aloud by screen readers. Keep it in sentence case and in step with the move-in date label.',
          },
          {
            key: 'moveInPlaceholder',
            label: 'Move-in date field placeholder',
            kind: 'input',
          },
          { key: 'residenceLabel', label: 'Residence field label', kind: 'input' },
          {
            key: 'residencePlaceholder',
            label: 'Residence field placeholder',
            kind: 'input',
          },
          { key: 'messageLabel', label: 'Message field label', kind: 'input' },
          {
            key: 'submitLabel',
            label: 'Submit button label',
            kind: 'input',
            help: 'An arrow is drawn after this label automatically.',
          },
        ],
      },
      {
        title: 'After the form is sent',
        path: ['inquire', 'thankYou'],
        fields: [
          {
            key: 'eyebrow',
            label: 'Eyebrow (small label above the title)',
            kind: 'input',
          },
          { key: 'title', label: 'Title', kind: 'input' },
          { key: 'body', label: 'Message', kind: 'textareaWide' },
        ],
      },
      {
        title: 'Residence inquiry pop-up',
        path: ['inquire', 'modal'],
        fields: [
          {
            key: 'eyebrow',
            label: 'Eyebrow (small label above the residence name)',
            kind: 'input',
          },
          {
            key: 'intro',
            label: 'Intro line',
            kind: 'textarea',
            help: 'Shown under the residence name. The residence name comes from the property, not from here.',
          },
          {
            key: 'closeAriaLabel',
            label: 'Close button, screen-reader name',
            kind: 'input',
            help: 'The close button is an X icon, so this is the only text screen readers announce for it.',
          },
          { key: 'nameLabel', label: 'Full name field label', kind: 'input' },
          { key: 'emailLabel', label: 'Email field label', kind: 'input' },
          { key: 'messageLabel', label: 'Message field label', kind: 'input' },
          {
            key: 'messageDefault',
            label: 'Pre-filled message',
            kind: 'textarea',
            help: 'Write {residence} where the residence name should appear. It is filled in automatically.',
          },
          { key: 'submitLabel', label: 'Submit button label', kind: 'input' },
        ],
      },
      {
        title: 'Pop-up, after the form is sent',
        path: ['inquire', 'modal', 'thankYou'],
        fields: [
          {
            key: 'eyebrow',
            label: 'Eyebrow (small label above the title)',
            kind: 'input',
          },
          { key: 'title', label: 'Title', kind: 'input' },
          { key: 'body', label: 'Message', kind: 'textarea' },
          { key: 'closeLabel', label: 'Close button label', kind: 'input' },
        ],
      },
      {
        title: 'Search engine listing',
        path: ['inquire', 'meta'],
        fields: [
          {
            key: 'title',
            label: 'Page title',
            kind: 'input',
            help: 'Shown in the browser tab and as the blue headline in Google results. Aim for under 60 characters.',
          },
          {
            key: 'description',
            label: 'Search result description',
            kind: 'textareaWide',
            help: 'The grey summary under the headline in Google results. Aim for 140-160 characters.',
          },
        ],
      },
    ],
  },
  {
    id: 'favorites',
    label: 'Favorites',
    sections: [
      {
        title: 'Favorites page — heading & saved count',
        path: ['favorites'],
        fields: [
          {
            key: 'eyebrow',
            label: 'Eyebrow (small label above the title)',
            kind: 'input',
          },
          { key: 'title', label: 'Title', kind: 'input' },
          { key: 'countNone', label: 'Line shown when nothing is saved', kind: 'input' },
          {
            key: 'countSingular',
            label: 'Count line — one saved residence',
            kind: 'input',
            help: 'Write {count} where the number should appear.',
          },
          {
            key: 'countPlural',
            label: 'Count line — two or more saved residences',
            kind: 'input',
            help: 'Write {count} where the number should appear.',
          },
        ],
      },
      {
        title: 'Empty state (nothing saved yet)',
        path: ['favorites', 'empty'],
        fields: [
          {
            key: 'quote',
            label: 'Empty-state message',
            kind: 'textarea',
            help: 'Shown inside quote marks — don\'t type your own quotes.',
          },
          {
            key: 'ctaLabel',
            label: 'Button label',
            kind: 'input',
            help: 'The button always goes to the residences page.',
          },
        ],
      },
      {
        title: 'Heart button (screen-reader labels)',
        path: ['favorites', 'heart'],
        fields: [
          {
            key: 'saveLabel',
            label: 'Label before a residence is saved',
            kind: 'input',
          },
          {
            key: 'removeLabel',
            label: 'Label once a residence is saved',
            kind: 'input',
          },
        ],
      },
      {
        title: 'Search engine listing',
        path: ['favorites', 'meta'],
        fields: [
          {
            key: 'title',
            label: 'Page title',
            kind: 'input',
            help: 'Shown in the browser tab and as the blue headline in Google results. Aim for under 60 characters.',
          },
          {
            key: 'description',
            label: 'Search result description',
            kind: 'textareaWide',
            help: 'The grey summary under the headline in Google results. Aim for 140-160 characters.',
          },
        ],
      },
    ],
  },
];

export default function PagesPage() {
  return (
    <ContentEditor
      file="pages"
      tabs={SECTION_TABS}
      eyebrow="Site copy"
      title="Pages"
      lede="Edit the wording, links and images of every public page. The first four tabs are individual pages; the rest are templates whose labels drive every residence, city and enquiry form."
      commitMessage="update pages"
      savedMessage="Pages saved. Live in about 2 minutes on the deployed site."
    />
  );
}
