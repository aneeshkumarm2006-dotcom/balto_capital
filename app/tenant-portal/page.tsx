import type { Metadata } from 'next';
import { TENANT_PORTAL } from '@/lib/pages';
import { TenantPortalBody } from './TenantPortalBody';

/* Server wrapper: exists only so the route can export CMS-editable metadata.
   The page itself is a client component (TenantPortalBody). */
export const metadata: Metadata = {
  title: TENANT_PORTAL.meta.title,
  description: TENANT_PORTAL.meta.description,
};

export default function TenantPortalPage() {
  return <TenantPortalBody />;
}
