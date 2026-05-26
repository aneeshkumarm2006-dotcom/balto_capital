'use client';
import type { Residence } from '@/lib/data';
import { Eyebrow } from './Eyebrow';
import { CloseIcon } from './icons';
import { PlaceholderImg } from './SmartImage';

interface Props {
  open: boolean;
  onClose: () => void;
  residence: Residence;
}

const TONES = ['warm', 'cool', 'deep', 'light'] as const;

export function GalleryModal({ open, onClose, residence }: Props) {
  return (
    <div
      className={'modal-backdrop' + (open ? ' open' : '')}
      onClick={onClose}
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ width: 'min(900px, 96vw)', padding: 36 }}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'transparent',
            border: 0,
          }}
        >
          <CloseIcon size={18} />
        </button>
        <Eyebrow style={{ marginBottom: 12 }}>GALLERY</Eyebrow>
        <h2 className="h2 serif" style={{ marginBottom: 28 }}>
          {residence.name}
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 8,
          }}
        >
          {Array.from({ length: 9 }).map((_, i) => {
            const all = [residence.heroImage, ...residence.gallery].filter(Boolean);
            const src = all[i % all.length];
            return (
              <div
                key={i}
                style={{
                  aspectRatio: '4 / 3',
                  background: 'var(--cream)',
                  overflow: 'hidden',
                }}
              >
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={`${residence.name} · ${i + 1}`}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <PlaceholderImg label="" tone={TONES[i % 4]}>·</PlaceholderImg>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
