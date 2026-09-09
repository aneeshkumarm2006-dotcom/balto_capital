import type { Metadata } from 'next';
import { PAGES } from '@/lib/pages';
import { InquireBody } from './InquireBody';

// Server wrapper: exists only so this route can carry its own CMS-editable
// title and description (a client component cannot export `metadata`).
// All markup lives in InquireBody.
export const metadata: Metadata = {
  title: PAGES.inquire.meta.title,
  description: PAGES.inquire.meta.description,
};

export default function InquirePage() {
  return <InquireBody />;
}
