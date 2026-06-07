'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eyebrow } from '@/components/Eyebrow';
import { FavoriteHeart } from '@/components/FavoriteHeart';
import { MapView } from '@/components/MapViewClient';
import { PropertyCard } from '@/components/PropertyCard';
import { PlaceholderImg } from '@/components/SmartImage';
import { InquireModal } from '@/components/InquireModal';
import { GalleryModal } from '@/components/GalleryModal';
import {
  bedroomShort,
  formatPrice,
  getResidence,
  residencesByCity,
  type Residence,
} from '@/lib/data';

const TONES = ['warm', 'cool', 'deep', 'light', 'warm', 'cool'] as const;

function FeatureList({ items }: { items: string[] }) {
  const mid = Math.ceil(items.length / 2);
  const left = items.slice(0, mid);
  const right = items.slice(mid);
  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 64px' }}
      className="grid-3-md1"
    >
      {[left, right].map((col, i) => (
        <ul key={i} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {col.map((item, j) => (
            <li
              key={j}
              style={{
                padding: '16px 0',
                borderBottom: '1px solid var(--hairline)',
                fontSize: 15,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: 'var(--gold)',
                  flexShrink: 0,
                }}
              />
              {item}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

export default function ResidenceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const r: Residence | undefined = getResidence(params.slug);
  const [inquireOpen, setInquireOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(0);

  useEffect(() => {
    if (!r) router.push('/residences');
  }, [r, router]);

  if (!r) return null;

  const plans = r.bedroomOptions
    .filter((b) => r.prices[b as 0 | 1 | 2 | 3] !== undefined)
    .map((b) => ({
      label: b === 0 ? 'Studio' : `${b} Bedroom`,
      price: r.prices[b as 0 | 1 | 2 | 3] as number,
    }));

  const others = residencesByCity(r.city)
    .filter((x) => x.id !== r.id)
    .slice(0, 3);

  return (
    <main className="page-enter">
      <div className="container" style={{ paddingTop: 28 }}>
        <div className="breadcrumb" style={{ marginBottom: 20 }}>
          <a className="text-link" onClick={() => router.push('/')}>Home</a>
          <span className="sep">/</span>
          <a className="text-link" onClick={() => router.push('/residences')}>
            Residences
          </a>
          <span className="sep">/</span>
          <a
            className="text-link"
            onClick={() => router.push(`/residences/${r.city}`)}
          >
            {r.cityLabel}
          </a>
          <span className="sep">/</span>
          <span>{r.name}</span>
        </div>
      </div>

      {!r.hideDetailGallery && (
      <div className="container" style={{ marginBottom: 64 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 1fr',
            gap: 12,
            position: 'relative',
          }}
          className="detail-gallery-grid"
        >
          <div
            style={{
              aspectRatio: '4 / 3',
              overflow: 'hidden',
              background: 'var(--cream)',
            }}
          >
            {r.heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={r.heroImage}
                alt={`${r.name} · main`}
                loading="eager"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                className="ken-burns"
              />
            ) : (
              <PlaceholderImg label={`${r.name} · main`} tone={TONES[0]}>
                {r.name.charAt(0)}
              </PlaceholderImg>
            )}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: 12,
            }}
            className="detail-gallery-thumbs"
          >
            {[0, 1, 2, 3].map((i) => {
              const src = r.gallery[i % r.gallery.length];
              return (
                <div
                  key={i}
                  style={{
                    overflow: 'hidden',
                    background: 'var(--cream)',
                  }}
                >
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt={`${r.name} · ${i + 1}`}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <PlaceholderImg label="" tone={TONES[i + 1] ?? 'warm'}>
                      ·
                    </PlaceholderImg>
                  )}
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setGalleryOpen(true)}
            className="btn btn-ghost btn-sm"
            style={{
              position: 'absolute',
              bottom: 18,
              right: 18,
              background: 'var(--ivory)',
              borderColor: 'var(--ink)',
            }}
          >
            View all photos
          </button>
        </div>
      </div>
      )}

      <div className="container" style={r.hideDetailGallery ? { marginTop: 32 } : undefined}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.7fr 1fr',
            gap: 'clamp(40px, 6vw, 96px)',
          }}
          className="detail-grid"
        >
          <div>
            <Eyebrow style={{ marginBottom: 14 }}>
              {r.cityLabel}{r.neighbourhood ? ` · ${r.neighbourhood}` : ''}
            </Eyebrow>
            <h1 className="h1 serif" style={{ marginBottom: 12 }}>
              {r.name}.
            </h1>
            <p className="body muted" style={{ fontSize: 16, marginBottom: 12 }}>
              {r.address}
            </p>
            <p style={{ fontSize: 15 }}>
              <span className="serif" style={{ fontSize: 19, fontWeight: 500 }}>
                From {formatPrice(r.priceFrom)}
              </span>
              <span className="muted"> /month net · {bedroomShort(r.bedroomOptions)}</span>
            </p>

            <div className="divider" style={{ margin: '36px 0 32px' }} />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 24,
              }}
              className="quick-stats"
            >
              {[
                {
                  label: 'Bedrooms',
                  val: r.bedrooms.replace(' Bedrooms', '').replace(' Bedroom', ''),
                },
                { label: 'Bathrooms', val: r.bathrooms },
                {
                  label: 'Available',
                  val: r.availability === 'available' ? 'Now' : 'Soon',
                },
              ].map((s) => (
                <div key={s.label}>
                  <Eyebrow style={{ marginBottom: 8 }}>{s.label}</Eyebrow>
                  <div className="serif" style={{ fontSize: 22, fontWeight: 500 }}>
                    {s.val}
                  </div>
                </div>
              ))}
            </div>

            <div className="divider" style={{ margin: '32px 0 56px' }} />

            <h2 className="h2 serif" style={{ marginBottom: 24 }}>Overview</h2>
            <p
              className="body"
              style={{ fontSize: 17, marginBottom: 28, maxWidth: 640 }}
            >
              {r.description}
            </p>
            <p
              className="body muted"
              style={{ fontSize: 16, lineHeight: 1.8, maxWidth: 640 }}
            >
              {r.longDescription}
            </p>

            <div className="divider" style={{ margin: '64px 0 40px' }} />

            <h2 className="h2 serif" style={{ marginBottom: 32 }}>
              {r.incentives ? 'Incentives' : 'Residence features'}
            </h2>
            <FeatureList items={r.incentives ?? r.features} />

            <div className="divider" style={{ margin: '64px 0 40px' }} />

            <h2 className="h2 serif" style={{ marginBottom: 32 }}>
              {r.unitLabels ? 'Unit Photos' : 'Building amenities'}
            </h2>
            <FeatureList items={r.unitLabels ?? r.amenities} />

            <div className="divider" style={{ margin: '64px 0 40px' }} />

            <h2 className="h2 serif" style={{ marginBottom: 12 }}>Suites</h2>
            <p className="small muted" style={{ marginBottom: 28 }}>
              Rents shown are net effective — what you pay after any promotion. Square
              footage and live availability are confirmed at viewing.
            </p>
            <div className="suites-table" role="table">
              <div className="suites-row suites-head" role="row">
                <span role="columnheader">Suite</span>
                <span role="columnheader">Bath</span>
                <span role="columnheader">Sq ft</span>
                <span role="columnheader">Rent (net)</span>
                <span role="columnheader">Availability</span>
                <span role="columnheader" aria-label="Apply" />
              </div>
              {plans.map((p, i) => (
                <div className="suites-row" role="row" key={i}>
                  <span role="cell" className="serif" style={{ fontSize: 16, fontWeight: 500 }}>
                    {p.label}
                  </span>
                  <span role="cell" className="muted">{r.bathrooms}</span>
                  <span role="cell" className="muted">—</span>
                  <span role="cell" className="serif" style={{ fontWeight: 500 }}>
                    {formatPrice(p.price)}<span className="caption muted" style={{ marginLeft: 4 }}>/mo</span>
                  </span>
                  <span role="cell" className="muted">
                    {r.availability === 'available' ? 'Available' : 'Coming soon'}
                  </span>
                  <span role="cell" style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => { setSelectedPlan(i); setInquireOpen(true); }}
                    >
                      Apply
                    </button>
                  </span>
                </div>
              ))}
            </div>

            <div className="divider" style={{ margin: '64px 0 40px' }} />

            <h2 className="h2 serif" style={{ marginBottom: 32 }}>Location</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: 32,
              }}
              className="grid-3-md1"
            >
              <div
                style={{
                  aspectRatio: '4 / 3',
                  border: '1px solid var(--hairline)',
                }}
              >
                <MapView
                  residences={[r]}
                  selectedId={r.id}
                  height="100%"
                  showPreview={false}
                />
              </div>
              <div>
                <Eyebrow style={{ marginBottom: 16 }}>NEARBY</Eyebrow>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {r.nearbyPoints.map((n, i) => (
                    <li
                      key={i}
                      style={{
                        padding: '14px 0',
                        borderBottom: '1px solid var(--hairline)',
                        fontSize: 15,
                      }}
                    >
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <aside style={{ position: 'relative' }} className="detail-sidebar">
            <div
              className="card"
              style={{
                position: 'sticky',
                top: 'calc(var(--header-h) + 24px)',
                padding: 36,
              }}
            >
              <Eyebrow style={{ marginBottom: 10 }}>
                {plans[selectedPlan]?.label.toUpperCase() ?? 'FROM'}
              </Eyebrow>
              <div
                className="serif"
                style={{
                  fontSize: 'clamp(2.4rem, 3.5vw, 3rem)',
                  fontWeight: 500,
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {formatPrice(plans[selectedPlan]?.price ?? r.priceFrom)}
                <span
                  style={{
                    fontSize: 15,
                    fontFamily: 'var(--sans)',
                    color: 'var(--muted)',
                    marginLeft: 6,
                    fontWeight: 400,
                  }}
                >
                  /month
                </span>
              </div>
              <div className="small muted" style={{ marginBottom: 6 }}>
                {r.availability === 'available' ? 'Available now' : 'Coming soon'}
              </div>
              <div className="caption muted" style={{ marginBottom: 28 }}>
                Net effective rent — what you pay after any promotion.
              </div>

              <div className="divider" style={{ marginBottom: 22 }} />

              <Eyebrow style={{ marginBottom: 16 }}>FLOOR PLANS</Eyebrow>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  marginBottom: 28,
                }}
              >
                {plans.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPlan(i)}
                    style={{
                      background:
                        i === selectedPlan ? 'var(--cream)' : 'transparent',
                      border:
                        '1px solid ' +
                        (i === selectedPlan
                          ? 'var(--ink)'
                          : 'var(--hairline-strong)'),
                      padding: '14px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                      fontFamily: 'var(--sans)',
                      fontSize: 14,
                      cursor: 'pointer',
                      transition: 'all 200ms var(--ease)',
                    }}
                  >
                    <div
                      className="serif"
                      style={{ fontSize: 17, fontWeight: 500 }}
                    >
                      {p.label}
                    </div>
                    <div className="small serif" style={{ fontWeight: 500 }}>
                      {formatPrice(p.price)}
                      <span
                        className="caption muted"
                        style={{ fontFamily: 'var(--sans)', marginLeft: 4 }}
                      >
                        /mo
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <button
                className="btn btn-primary full-w"
                style={{ width: '100%', marginBottom: 12 }}
                onClick={() => setInquireOpen(true)}
              >
                Book a viewing
              </button>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 16,
                  padding: '12px 0',
                  borderTop: '1px solid var(--hairline)',
                }}
              >
                <span className="small">Save to favorites</span>
                <FavoriteHeart id={r.id} size={20} />
              </div>

              <div className="divider" style={{ margin: '22px 0' }} />

              <Eyebrow style={{ marginBottom: 12 }}>CONTACT</Eyebrow>
              <div className="small" style={{ marginBottom: 4 }}>
                inquire@baltocapital.com
              </div>
              <div className="small muted">+1 (XXX) XXX-XXX</div>
            </div>
          </aside>
        </div>

        {others.length > 0 && (
          <section style={{ marginTop: 'clamp(80px, 10vw, 140px)' }}>
            <div className="divider" style={{ marginBottom: 56 }} />
            <Eyebrow style={{ marginBottom: 16 }}>YOU MAY ALSO LIKE</Eyebrow>
            <h2 className="h2 serif" style={{ marginBottom: 48 }}>
              Other residences in {r.cityLabel}.
            </h2>
            <div
              className="grid grid-residences-city"
              style={{
                gap: 'clamp(28px, 3vw, 44px)',
                marginBottom: 'clamp(80px, 10vw, 140px)',
              }}
            >
              {others.map((o) => (
                <PropertyCard key={o.id} residence={o} hideCity />
              ))}
            </div>
          </section>
        )}
      </div>

      <InquireModal
        open={inquireOpen}
        onClose={() => setInquireOpen(false)}
        residence={r}
      />
      <GalleryModal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        residence={r}
      />
    </main>
  );
}
