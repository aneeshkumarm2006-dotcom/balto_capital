'use client';
import { useRouter } from 'next/navigation';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

const SIZES = { sm: 14, md: 17, lg: 22, xl: 28 } as const;

export function Logo({ size = 'md', color }: LogoProps) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push('/')}
      style={{ cursor: 'pointer', color: color || 'var(--ink)' }}
    >
      <div
        className="serif"
        style={{
          fontWeight: 500,
          fontSize: SIZES[size],
          letterSpacing: '0.18em',
        }}
      >
        BALTO&nbsp;CAPITAL
      </div>
    </div>
  );
}
