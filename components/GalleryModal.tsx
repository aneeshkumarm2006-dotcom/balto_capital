'use client';
import type { Residence } from '@/lib/data';
import { Eyebrow } from './Eyebrow';
import { CloseIcon } from './icons';

interface Props {
  open: boolean;
  onClose: () => void;
  /** Building gallery (hero + gallery). Ignored when `photos` is passed. */
  residence?: Residence;
  /** Explicit photo list — used for the per-unit gallery. */
  photos?: string[];
  /** Heading (defaults to residence name). */
  title?: string;
  eyebrow?: string;
  /** Optional per-photo badge (aligned with `photos`), e.g. the unit type.
   *  Tiles with a label show a small coloured pill in the corner. */
  labels?: (string | undefined)[];
  /** Open the enlarged lightbox at the given photo index. */
  onPhotoClick?: (index: number) => void;
}

/** Badge tint by unit type, so studio / 1- / 2-bed read apart at a glance. */
function badgeColor(label: string): string {
  const l = label.toLowerCase();
  if (l.includes('studio')) return '#2b2f36';
  if (l.startsWith('1')) return '#3b5bdb';
  if (l.startsWith('2')) return '#2f7d54';
  if (l.startsWith('3')) return '#b0592a';
  return '#2b2f36';
}

export function GalleryModal({ open, onClose, residence, photos, title, eyebrow, labels, onPhotoClick }: Props) {
  const allPhotos = photos
    ?? (residence ? [residence.heroImage, ...residence.gallery].filter(Boolean) : []);
  const heading = title ?? residence?.name ?? '';

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
          <Eyebrow style={{ marginBottom: 6 }}>{eyebrow ?? 'GALLERY'}</Eyebrow>
          <h2 className="h2 serif" style={{ marginBottom: 4, fontSize: 28 }}>
            {heading}
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
            {allPhotos.map((src, i) => {
              const label = labels?.[i];
              return (
                <div
                  key={`${src}-${i}`}
                  onClick={onPhotoClick ? () => onPhotoClick(i) : undefined}
                  style={{
                    position: 'relative',
                    aspectRatio: '4 / 3',
                    background: 'var(--cream)',
                    overflow: 'hidden',
                    cursor: onPhotoClick ? 'zoom-in' : undefined,
                  }}
                >
                  {label && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        zIndex: 1,
                        padding: '3px 9px',
                        borderRadius: 999,
                        fontFamily: 'var(--sans)',
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                        color: '#fff',
                        background: badgeColor(label),
                        boxShadow: '0 1px 3px rgba(0,0,0,0.28)',
                      }}
                    >
                      {label}
                    </span>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${heading} · ${label ?? i + 1}`}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
