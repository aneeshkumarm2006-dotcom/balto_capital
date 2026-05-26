'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiltersPanel, DEFAULT_FILTERS, type Filters } from '@/components/FiltersPanel';
import { SortDropdown } from '@/components/SortDropdown';
import { PropertyCard } from '@/components/PropertyCard';
import { MapView } from '@/components/MapViewClient';
import { Eyebrow } from '@/components/Eyebrow';
import { SlidersIcon } from '@/components/icons';
import { CITIES, residencesByCity, type CitySlug } from '@/lib/data';
import { applyFilters } from '@/lib/filter';

export default function CityListingPage({
  params,
}: {
  params: { city: string };
}) {
  const router = useRouter();
  const city = CITIES[params.city as CitySlug];
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const all = useMemo(
    () => (city ? residencesByCity(params.city) : []),
    [city, params.city]
  );
  const filtered = useMemo(
    () => applyFilters(all, filters, ''),
    [filters, all]
  );

  useEffect(() => {
    if (!city) router.push('/residences');
  }, [city, router]);

  if (!city) return null;

  return (
    <main className="page-enter">
      <FiltersPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={() => setFiltersOpen(false)}
        onClear={() => setFilters(DEFAULT_FILTERS)}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 480px',
        }}
        className="residences-layout"
      >
        <div style={{ padding: 'clamp(28px, 4vw, 56px) clamp(20px, 5vw, 64px)' }}>
          <div className="breadcrumb" style={{ marginBottom: 24 }}>
            <a className="text-link" onClick={() => router.push('/')}>Home</a>
            <span className="sep">/</span>
            <a className="text-link" onClick={() => router.push('/residences')}>
              Residences
            </a>
            <span className="sep">/</span>
            <span>{city.label}</span>
          </div>
          <Eyebrow style={{ marginBottom: 16 }}>{city.province}</Eyebrow>
          <h1 className="h1 serif" style={{ marginBottom: 14 }}>
            {city.label}.
          </h1>
          <p
            className="body muted"
            style={{ maxWidth: 560, marginBottom: 16, fontSize: 17 }}
          >
            {city.blurb}
          </p>
          <p className="small muted" style={{ marginBottom: 36 }}>
            {filtered.length} {filtered.length === 1 ? 'residence' : 'residences'} available
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 36,
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setFiltersOpen(true)}
              style={{ borderColor: 'var(--hairline-strong)' }}
            >
              <SlidersIcon size={14} /> Show filters
            </button>
            <SortDropdown
              value={filters.sort}
              onChange={(s) => setFilters({ ...filters, sort: s })}
            />
          </div>

          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 24px',
                background: 'var(--cream)',
                border: '1px solid var(--hairline)',
              }}
            >
              <p className="serif italic" style={{ fontSize: 22 }}>
                No residences match these filters.
              </p>
              <button
                className="btn btn-ghost btn-sm"
                style={{ marginTop: 24 }}
                onClick={() => setFilters(DEFAULT_FILTERS)}
              >
                Clear all
              </button>
            </div>
          ) : (
            <div
              className="grid grid-residences-city"
              style={{ gap: 'clamp(28px, 3vw, 44px)' }}
            >
              {filtered.map((r) => (
                <PropertyCard key={r.id} residence={r} hideCity />
              ))}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 56,
              gap: 24,
            }}
          >
            <span className="small muted">Page 1 of 1</span>
          </div>
        </div>

        <div
          style={{
            position: 'sticky',
            top: 'var(--header-h)',
            height: 'calc(100vh - var(--header-h))',
            borderLeft: '1px solid var(--hairline)',
          }}
          className="residences-map"
        >
          <MapView
            residences={filtered}
            selectedId={selected}
            onSelect={(id, navigateTo) => {
              const r = filtered.find((x) => x.id === id);
              if (navigateTo && r) router.push(`/residences/${r.city}/${r.slug}`);
              else setSelected(id);
            }}
          />
        </div>
      </div>
    </main>
  );
}
