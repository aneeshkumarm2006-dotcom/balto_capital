import type { Metadata } from 'next';
import { PAGES } from '@/lib/pages';
import { FavoritesBody } from './FavoritesBody';

/* This route is split in two: the page below is a server component so it can
 * export `metadata` (a client component cannot), and the markup lives in
 * FavoritesBody.tsx, which keeps 'use client' because it uses hooks. The title
 * and description come from the CMS like the rest of the page copy. */
export const metadata: Metadata = {
  title: PAGES.favorites.meta.title,
  description: PAGES.favorites.meta.description,
};

export default function FavoritesPage() {
  return <FavoritesBody />;
}
