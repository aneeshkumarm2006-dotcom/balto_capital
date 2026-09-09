import type { Metadata } from 'next';
import { PAGES } from '@/lib/pages';
import { HomeBody } from './HomeBody';

/* Server wrapper: owns the CMS-editable <title>/<meta description> for the
 * homepage. All markup and interactivity live in ./HomeBody (client). */
export const metadata: Metadata = {
  title: PAGES.home.meta.title,
  description: PAGES.home.meta.description,
};

export default function HomePage() {
  return <HomeBody />;
}
