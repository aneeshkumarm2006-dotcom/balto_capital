import type { Metadata } from 'next';
import { PAGES } from '@/lib/pages';
import { WhyBaltoBody } from './WhyBaltoBody';

// Server wrapper: it exists so the browser-tab title and search-result
// description can come from content/pages.json (whyBalto.meta), editable in
// the CMS Pages editor. The page itself is WhyBaltoBody, a client component.
export const metadata: Metadata = {
  title: PAGES.whyBalto.meta.title,
  description: PAGES.whyBalto.meta.description,
};

export default function WhyBaltoPage() {
  return <WhyBaltoBody />;
}
