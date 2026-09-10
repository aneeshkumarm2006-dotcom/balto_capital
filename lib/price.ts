import { PAGES } from './pages';

const S = PAGES.home.hero.search;

/** Survives a CMS typo, a blank field, or an older snapshot restored from
 *  History that predates these keys. */
const num = (v: string | undefined, fallback: number): number => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

/* The rent band, in one place. The homepage price control, the /residences
   filters panel and the URL defaults all read it, so a range set in Content
   Studio -> Pages -> Homepage -> Hero search bar moves all three together.
   If they ever drifted apart, a full-range search from the homepage would
   arrive at /residences looking like an active filter. */
export const PRICE_BOUNDS = {
  min: num(S.rentMin, 800),
  max: num(S.rentMax, 3500),
  step: num(S.rentStep, 50),
} as const;
