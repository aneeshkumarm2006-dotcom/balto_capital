'use client';
import type { Residence } from '@/lib/data';
import { Eyebrow } from './Eyebrow';
import { CloseIcon } from './icons';

interface Props {
  open: boolean;
  onClose: () => void;
  residence: Residence;
}

export function GalleryModal({ open, onClose, residence }: Props) {
  const allPhotos = [residence.heroImage, ...residence.gallery].filter(Boolean);

  return (
    <div
      className={'modal-backdrop' + (open ? ' open' : '')}
      onClick={onClose}
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(1100px, 96vw)',
          maxHeight: '90vh',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Sticky header */}
        <div
          style={{
            padding: '28px 36px 20px',
            borderBottom: '1px solid var(--hairline)',
            background: 'var(--bone)',
            position: 'relative',
          }}
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
          <Eyebrow style={{ marginBottom: 6 }}>GALLERY</Eyebrow>
          <h2 className="h2 serif" style={{ marginBottom: 4, fontSize: 28 }}>
            {residence.name}
          </h2>
          <div
            className="small muted"
            style={{ fontFamily: 'var(--sans)' }}
          >
            {allPhotos.length} {allPhotos.length === 1 ? 'photo' : 'photos'}
          </div>
        </div>

        {/* Scrollable grid */}
        <div
          style={{
            padding: 16,
            overflowY: 'auto',
            flex: 1,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8,
            }}
            className="gallery-modal-grid"
          >
            {allPhotos.map((src, i) => (
              <div
                key={`${src}-${i}`}
                style={{
                  aspectRatio: '4 / 3',
                  background: 'var(--cream)',
                  overflow: 'hidden',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${residence.name} · ${i + 1}`}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
