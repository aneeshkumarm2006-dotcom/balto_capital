import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Balto Capital — Residences across Western Canada',
  description:
    'A portfolio of residences in Saskatoon, Edmonton, Regina, and Yellowknife — kept, restored, and operated by the same family. Established 2023.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
          <ScrollReveal />
        </Providers>
      </body>
    </html>
  );
}
