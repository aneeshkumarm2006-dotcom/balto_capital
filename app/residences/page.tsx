'use client';
import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiltersPanel, DEFAULT_FILTERS, type Filters } from '@/components/FiltersPanel';
import { SortDropdown } from '@/components/SortDropdown';
import { PropertyCard } from '@/components/PropertyCard';
import { MapView } from '@/components/MapViewClient';
import { CloseIcon, MapIcon, SlidersIcon } from '@/components/icons';
import { RESIDENCES } from '@/lib/data';
import { applyFilters } from '@/lib/filter';

export default function ResidencesAllPage() {
  return (
    <Suspense fallback={<main className="page-enter" />}>
      <ResidencesAllInner />
    </Suspense>
  );
}

function ResidencesAllInner() {
  const router = useRouter();
  const search = useSearchParams();
  const initialQuery = search.get('q') ?? '';
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(
    () => applyFilters(RESIDENCES, filters, query),
    [filters, query]
  );

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
            <a className="text-link" onClick={() => router.push('/')}>
              Home
            </a>
            <span className="sep">/</span>
            <span>Residences</span>
          </div>
          <h1 className="h1 serif" style={{ marginBottom: 10 }}>
            All residences.
          </h1>
          <p className="small muted" style={{ marginBottom: 36 }}>
            {filtered.length} of {RESIDENCES.length} residences across three cities
          </p>

          {query && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 24,
                padding: '12px 16px',
                background: 'var(--cream)',
                border: '1px solid var(--hairline)',
              }}
            >
              <span className="small">
                Searching <span className="italic serif">&ldquo;{query}&rdquo;</span>
              </span>
              <button
                onClick={() => setQuery('')}
                style={{
                  marginLeft: 'auto',
                  background: 'transparent',
                  border: 0,
                  color: 'var(--muted)',
                }}
              >
                <CloseIcon size={14} />
              </button>
            </div>
          )}

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
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <SortDropdown
                value={filters.sort}
                onChange={(s) => setFilters({ ...filters, sort: s })}
              />
            </div>
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
                onClick={() => {
                  setFilters(DEFAULT_FILTERS);
                  setQuery('');
                }}
              >
                Clear all
              </button>
            </div>
          ) : (
            <div
              className="grid grid-residences"
              style={{ gap: 'clamp(28px, 3vw, 44px)' }}
            >
              {filtered.map((r) => (
                <PropertyCard key={r.id} residence={r} />
              ))}
            </div>
          )}
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
