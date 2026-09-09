import type { Metadata } from 'next';
import { PAGES } from '@/lib/pages';
import { CareersBody } from './CareersBody';

// Server wrapper: exists only so this route can carry its own CMS-editable
// title and description (a client component cannot export `metadata`).
// All markup lives in CareersBody.
export const metadata: Metadata = {
  title: PAGES.careers.meta.title,
  description: PAGES.careers.meta.description,
};

export default function CareersPage() {
  return <CareersBody />;
}
