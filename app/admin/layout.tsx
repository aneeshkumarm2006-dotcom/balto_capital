import type { Metadata } from 'next';
import './admin.css';

export const metadata: Metadata = {
  title: 'Balto Content Studio',
  description: 'Manage the Balto Capital website — properties, photos, availability, and site settings.',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
