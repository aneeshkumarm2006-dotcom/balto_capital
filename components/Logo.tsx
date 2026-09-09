'use client';
import { useRouter } from 'next/navigation';
import { SITE } from '@/lib/site';

interface LogoProps {
  /** "light" = navy mark on ivory/light bg, "dark" = white mark on navy/dark bg */
  variant?: 'light' | 'dark';
  /** Pixel height of the mark; width scales by aspect ratio (~2.34:1 horizontal). */
  height?: number;
}

export function Logo({ variant = 'light', height = 30 }: LogoProps) {
  const router = useRouter();
  const isDark = variant === 'dark';
  const src = isDark ? SITE.brand.logoDark : SITE.brand.logoLight;
  return (
    <button
      type="button"
      onClick={() => router.push(SITE.brand.homeHref)}
      aria-label={SITE.brand.homeAriaLabel}
      style={{
        background: 'transparent',
        border: 0,
        padding: 0,
        margin: 0,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={SITE.brand.logoAlt}
        style={{
          height,
          width: 'auto',
          display: 'block',
        }}
      />
    </button>
  );
}
