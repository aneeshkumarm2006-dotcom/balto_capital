import type { Metadata } from 'next';
import { getCity, getResidence } from '@/lib/data';
import { PAGES } from '@/lib/pages';
import { PropertyBody } from './PropertyBody';

/** Server wrapper for the residence detail page. It exists only so this route
 *  can carry its own browser-tab title and search-result description — a
 *  client component cannot export metadata, and the page body needs hooks.
 *  The rendering itself is untouched: everything below lives in PropertyBody. */

type PropertyParams = { city: string; slug: string };

/** Fill {token} placeholders in a CMS string. The replacement is a function so
 *  a value containing `$&` or `$$` is inserted literally instead of being read
 *  as a String.replace substitution pattern. */
const fill = (template: string, values: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? values[key] : match
  );

/** Last resort when the residence (or its city) isn't in the data: drop any
 *  placeholder we couldn't fill and tidy the punctuation left behind, so the
 *  visitor sees the plain CMS wording rather than a raw "{name}". */
const stripTokens = (template: string): string =>
  template
    .replace(/\{\w+\}/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.])/g, '$1')
    .replace(/(^[\s,.|·—–-]+)|([\s,|·—–-]+$)/g, '')
    .trim();

export function generateMetadata({
  params,
}: {
  params: PropertyParams;
}): Metadata {
  const M = PAGES.property.meta;
  const residence = getResidence(params.slug);
  // City label from the residence when we have it, otherwise from the URL
  // segment, so a title reading only "{city}" still resolves.
  const cityLabel = residence?.cityLabel ?? getCity(params.city)?.label;

  const vars: Record<string, string> = {};
  if (residence) vars.name = residence.name;
  if (cityLabel) vars.city = cityLabel;

  // Tidy up only when a placeholder actually went unfilled — a fully
  // substituted string is used exactly as the CMS wrote it.
  const render = (template: string): string => {
    const filled = fill(template, vars);
    return /\{\w+\}/.test(filled) ? stripTokens(filled) : filled;
  };

  return {
    title: render(M.titleTemplate),
    description: render(M.descriptionTemplate),
  };
}

export default function ResidenceDetailPage({
  params,
}: {
  params: PropertyParams;
}) {
  return <PropertyBody params={params} />;
}
