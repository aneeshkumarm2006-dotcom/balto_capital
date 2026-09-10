'use client';
import dynamic from 'next/dynamic';
import { PAGES } from '@/lib/pages';

const RESIDENCES_PAGE = PAGES.residences;

export const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#F2F5F9',
      }}
      aria-label={RESIDENCES_PAGE.loading.mapLabel}
    />
  ),
});
