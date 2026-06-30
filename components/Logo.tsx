'use client';
import { useRouter } from 'next/navigation';

interface LogoProps {
  /** "light" = navy mark on ivory/light bg, "dark" = white mark on navy/dark bg */
  variant?: 'light' | 'dark';
  /** Pixel height of the mark; width scales by aspect ratio (~2.34:1 horizontal). */
  height?: number;
}

export function Logo({ variant = 'light', height = 30 }: LogoProps) {
  const router = useRouter();
  const isDark = variant === 'dark';
  const src = isDark ? '/brand/balto-logo-white.png' : '/brand/balto-logo-navy.png';
  return (
    <button
      type="button"
      onClick={() => router.push('/')}
      aria-label="Balto Capital, home"
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
        alt="Balto Capital"
        style={{
          height,
          width: 'auto',
          display: 'block',
        }}
      />
    </button>
  );
}
