'use client';
import { useState, type CSSProperties } from 'react';

type Tone = 'warm' | 'cool' | 'deep' | 'light';

const TONES: Record<Tone, { from: string; to: string; mark: string }> = {
  warm:  { from: '#EAEFF6', to: '#D3DCE8', mark: 'rgba(0,30,74,0.18)' },
  cool:  { from: '#E2E8F0', to: '#C6CFDB', mark: 'rgba(0,30,74,0.20)' },
  deep:  { from: '#C3CEDC', to: '#9FAEC1', mark: 'rgba(0,30,74,0.22)' },
  light: { from: '#F3F6FA', to: '#E2E8F1', mark: 'rgba(0,30,74,0.16)' },
};

interface PlaceholderProps {
  label?: string;
  tone?: Tone;
  children?: React.ReactNode;
  style?: CSSProperties;
}

export function PlaceholderImg({
  label = 'Residence interior',
  tone = 'warm',
  children,
  style,
}: PlaceholderProps) {
  const t = TONES[tone];
  return (
    <div
      className="placeholder-img"
      data-label={label}
      style={{
        background: `repeating-linear-gradient(135deg, rgba(0,30,74,0.04) 0 14px, rgba(0,30,74,0.08) 14px 28px), linear-gradient(160deg, ${t.from}, ${t.to})`,
        ...style,
      }}
    >
      <span className="mono-mark" style={{ color: t.mark }}>
        {children || '·'}
      </span>
    </div>
  );
}

interface SmartImageProps {
  src?: string;
  alt?: string;
  fallbackLabel?: string;
  fallbackTone?: Tone;
  fallbackChar?: string;
  style?: CSSProperties;
  className?: string;
  loading?: 'eager' | 'lazy';
  kenBurns?: boolean;
}

export function SmartImage({
  src,
  alt = '',
  fallbackLabel,
  fallbackTone = 'warm',
  fallbackChar,
  style,
  className,
  loading = 'lazy',
  kenBurns = false,
}: SmartImageProps) {
  const [errored, setErrored] = useState(false);
  if (!src || errored) {
    return (
      <PlaceholderImg
        label={fallbackLabel || alt}
        tone={fallbackTone}
        style={style}
      >
        {fallbackChar || (alt && alt[0]) || '·'}
      </PlaceholderImg>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setErrored(true)}
      className={`${className ?? ''}${kenBurns ? ' ken-burns' : ''}`}
      style={{ width: '100%', height: '100%', objectFit: 'cover', ...style }}
    />
  );
}
