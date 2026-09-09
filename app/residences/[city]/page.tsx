import type { Metadata } from 'next';
import { PAGES } from '@/lib/pages';
import { CITIES, type CitySlug } from '@/lib/data';
import { CityBody } from './CityBody';

/* This route is split in two: the page below is a server component so it can
 * export metadata (a client component cannot), and the markup lives in
 * CityBody.tsx, which keeps 'use client' because it uses hooks. Because the
 * route is dynamic, the wording is a template per city rather than one fixed
 * string, so it exports generateMetadata instead of a static `metadata`. The
 * templates come from the CMS like the rest of the page copy. */

const T = PAGES.city;

/** Fill {token} placeholders in a CMS string. The replacement is a function so
 *  a value containing `$&` or `$$` is inserted literally instead of being read
 *  as a String.replace substitution pattern. */
const fill = (template: string, values: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? values[key] : match
  );

/** Last resort when the city isn't in the data: drop any placeholder we
 *  couldn't fill and tidy the punctuation left behind, so the visitor sees the
 *  plain CMS wording rather than a raw "{city}" or a dangling separator. */
const stripTokens = (template: string): string =>
  template
    .replace(/\{\w+\}/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.])/g, '$1')
    .replace(/(^[\s,.|·—–-]+)|([\s,|·—–-]+$)/g, '')
    .trim();

/** Tidy up only when a placeholder actually went unfilled — a fully
 *  substituted string is used exactly as the CMS wrote it. */
const render = (template: string, values: Record<string, string>): string => {
  const filled = fill(template, values);
  return /\{\w+\}/.test(filled) ? stripTokens(filled) : filled;
};

export function generateMetadata({
  params,
}: {
  params: { city: string };
}): Metadata {
  // Same lookup the body uses, so the title matches the page that renders.
  const city = CITIES[params.city as CitySlug];
  // {name} is the name of the thing being viewed, which on a listing page is
  // the city itself; {province} is offered too since the city data carries it.
  const values: Record<string, string> = city
    ? { city: city.label, name: city.label, province: city.province }
    : {};

  return {
    title: render(T.meta.titleTemplate, values),
    description: render(T.meta.descriptionTemplate, values),
  };
}

export default function CityListingPage({
  params,
}: {
  params: { city: string };
}) {
  return <CityBody params={params} />;
}
