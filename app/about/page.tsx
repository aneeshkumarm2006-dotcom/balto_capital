import type { Metadata } from 'next';
import { PAGES } from '@/lib/pages';
import { AboutBody } from './AboutBody';

// Server wrapper: exists only so this route can carry its own CMS-editable
// title and description (a client component cannot export `metadata`).
// All markup lives in AboutBody.
export const metadata: Metadata = {
  title: PAGES.about.meta.title,
  description: PAGES.about.meta.description,
};

export default function AboutPage() {
  return <AboutBody />;
}
