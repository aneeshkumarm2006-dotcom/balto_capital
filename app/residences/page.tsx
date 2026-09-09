import type { Metadata } from 'next';
import { PAGES } from '@/lib/pages';
import { ResidencesBody } from './ResidencesBody';

/* Server wrapper: exists only so the /residences route can export its own
 * CMS-editable browser-tab title and search-result description. The page
 * itself lives in ResidencesBody.tsx, which stays a client component. */
export const metadata: Metadata = {
  title: PAGES.residences.meta.title,
  description: PAGES.residences.meta.description,
};

export default function ResidencesAllPage() {
  return <ResidencesBody />;
}
