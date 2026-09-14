'use client';
import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiltersPanel, DEFAULT_FILTERS, type Filters } from '@/components/FiltersPanel';
import { ListingSplit } from '@/components/ListingSplit';
import { ParallaxImage } from '@/components/ParallaxImage';
import { Eyebrow } from '@/components/Eyebrow';
import { CloseIcon } from '@/components/icons';
import { RESIDENCES } from '@/lib/data';
import { PAGES } from '@/lib/pages';

const RESIDENCES_PAGE = PAGES.residences;

export function ResidencesBody() {
  return (
    <Suspense fallback={<main className="page-enter" />}>
      <ResidencesAllInner />
    </Suspense>
  );
}

function ResidencesAllInner() {
  const router = useRouter();
  const search = useSearchParams();

  const [filters, setFilters] = useState<Filters>(() => {
    const qCities = search.get('cities');
    const qBeds = search.get('beds');
    const qPriceMin = search.get('priceMin');
    const qPriceMax = search.get('priceMax') || search.get('maxRent');
    const qAvailability = search.get('availability');
    const qAmenities = search.get('amenities');
    const qSort = search.get('sort');

    return {
      cities: qCities ? qCities.split(',').filter(Boolean) : [],
      beds: qBeds
        ? qBeds.split(',').map(Number).filter((n) => !Number.isNaN(n))
        : [],
      priceMin: qPriceMin ? Number(qPriceMin) : DEFAULT_FILTERS.priceMin,
      priceMax: qPriceMax ? Number(qPriceMax) : DEFAULT_FILTERS.priceMax,
      availability: (qAvailability as any) || DEFAULT_FILTERS.availability,
      amenities: qAmenities ? qAmenities.split(',') : [],
      sort: (qSort as any) || DEFAULT_FILTERS.sort,
    };
  });
  
  const [query, setQuery] = useState(() => search.get('q') ?? '');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Sync state from URL when the URL changes (e.g. Back button)
  useEffect(() => {
    const qCities = search.get('cities');
    const qBeds = search.get('beds');
    const qPriceMin = search.get('priceMin');
    const qPriceMax = search.get('priceMax') || search.get('maxRent');
    const qAvailability = search.get('availability');
    const qAmenities = search.get('amenities');
    const qSort = search.get('sort');
    const qQuery = search.get('q') ?? '';

    const newCities = qCities ? qCities.split(',').filter(Boolean) : [];
    const newBeds = qBeds ? qBeds.split(',').map(Number).filter((n) => !Number.isNaN(n)) : [];
    const newPriceMin = qPriceMin ? Number(qPriceMin) : DEFAULT_FILTERS.priceMin;
    const newPriceMax = qPriceMax ? Number(qPriceMax) : DEFAULT_FILTERS.priceMax;
    const newAvailability = (qAvailability as any) || DEFAULT_FILTERS.availability;
    const newAmenities = qAmenities ? qAmenities.split(',') : [];
    const newSort = (qSort as any) || DEFAULT_FILTERS.sort;

    setFilters((prev) => {
      const citiesChanged = prev.cities.join(',') !== newCities.join(',');
      const bedsChanged = prev.beds.join(',') !== newBeds.join(',');
      const minChanged = prev.priceMin !== newPriceMin;
      const maxChanged = prev.priceMax !== newPriceMax;
      const availChanged = prev.availability !== newAvailability;
      const amenChanged = prev.amenities.join(',') !== newAmenities.join(',');
      const sortChanged = prev.sort !== newSort;

      if (citiesChanged || bedsChanged || minChanged || maxChanged || availChanged || amenChanged || sortChanged) {
        return {
          cities: newCities,
          beds: newBeds,
          priceMin: newPriceMin,
          priceMax: newPriceMax,
          availability: newAvailability,
          amenities: newAmenities,
          sort: newSort,
        };
      }
      return prev;
    });

    setQuery((prev) => (prev !== qQuery ? qQuery : prev));
  }, [search]);

  // Sync state to URL
  useEffect(() => {
    const sp = new URLSearchParams();
    if (query) sp.set('q', query);
    if (filters.cities.length) sp.set('cities', filters.cities.join(','));
    if (filters.beds.length) sp.set('beds', filters.beds.join(','));
    if (filters.priceMin !== DEFAULT_FILTERS.priceMin) sp.set('priceMin', String(filters.priceMin));
    if (filters.priceMax !== DEFAULT_FILTERS.priceMax) sp.set('priceMax', String(filters.priceMax));
    if (filters.availability !== DEFAULT_FILTERS.availability) sp.set('availability', filters.availability);
    if (filters.amenities.length) sp.set('amenities', filters.amenities.join(','));
    if (filters.sort !== DEFAULT_FILTERS.sort) sp.set('sort', filters.sort);

    const queryString = sp.toString();
    const newUrl = queryString ? `/residences?${queryString}` : '/residences';

    const currentQueryString = window.location.search;
    const parsedCurrent = new URLSearchParams(currentQueryString);
    const parsedNew = new URLSearchParams(queryString);
    parsedCurrent.sort();
    parsedNew.sort();

    if (parsedCurrent.toString() !== parsedNew.toString()) {
      // Immediate address bar update for continuous changes
      window.history.replaceState(null, '', newUrl);

      // Debounce history push for the back button
      const timeoutId = setTimeout(() => {
        window.history.pushState(null, '', newUrl);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [filters, query]);

  return (
    <main className="page-enter has-overlay-hero">
      <FiltersPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={() => setFiltersOpen(false)}
        onClear={() => setFilters(DEFAULT_FILTERS)}
      />

      {/* Full-bleed cover — same treatment as the portfolio city pages */}
      <section className="portfolio-cover">
        <ParallaxImage
          src={RESIDENCES_PAGE.cover.image}
          alt={RESIDENCES_PAGE.cover.imageAlt}
          eager
          kenBurns
          speed={0.12}
        />
        <div className="portfolio-cover-scrim" />
        <div className="container portfolio-cover-inner">
          <div
            className="breadcrumb portfolio-cover-crumbs hero-rise"
            style={{ ['--rise-delay' as string]: '120ms' }}
          >
            <a className="text-link" onClick={() => router.push('/')}>
              {RESIDENCES_PAGE.breadcrumb.homeLabel}
            </a>
            <span className="sep">/</span>
            <span>{RESIDENCES_PAGE.breadcrumb.currentLabel}</span>
          </div>

          <div className="portfolio-cover-copy">
            <Eyebrow
              className="hero-rise"
              style={{
                ['--rise-delay' as string]: '260ms',
                marginBottom: 18,
                display: 'block',
              }}
            >
              {RESIDENCES_PAGE.cover.eyebrow}
            </Eyebrow>
            <h1
              className="display portfolio-cover-title hero-rise"
              style={{ ['--rise-delay' as string]: '380ms' }}
            >
              {RESIDENCES_PAGE.cover.title}
            </h1>
            <div
              className="portfolio-cover-rule hero-rise"
              style={{ ['--rise-delay' as string]: '520ms' }}
              aria-hidden="true"
            />
            <p
              className="portfolio-cover-blurb body hero-rise"
              style={{ ['--rise-delay' as string]: '620ms' }}
            >
              {RESIDENCES_PAGE.cover.blurb}
            </p>
          </div>
        </div>
      </section>

      {/* The same split, toolbar and map the city pages render — this page is
          simply scoped to every market at once, so the city control sits on
          "All cities" and each row prints the market it is in. */}
      <ListingSplit
        residences={RESIDENCES}
        filters={filters}
        setFilters={setFilters}
        onOpenFilters={() => setFiltersOpen(true)}
        onClearAll={() => {
          // Sort lives inside Filters; clearing should not silently re-sort
          // the list back to A–Z under the visitor.
          setFilters({ ...DEFAULT_FILTERS, sort: filters.sort });
          setQuery('');
        }}
        query={query}
        showRowCity
        renderCount={(shown) => (
          <p className="small muted" style={{ margin: 0 }}>
            {RESIDENCES_PAGE.resultCount
              .replace('{count}', String(shown))
              .replace('{total}', String(RESIDENCES.length))}
          </p>
        )}
        banner={
          query ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginTop: 20,
                padding: '12px 16px',
                background: 'var(--cream)',
                border: '1px solid var(--hairline)',
              }}
            >
              <span className="small">
                {RESIDENCES_PAGE.searchChip.prefix}{' '}
                <span className="italic serif">&ldquo;{query}&rdquo;</span>
              </span>
              <button
                onClick={() => setQuery('')}
                aria-label={RESIDENCES_PAGE.filters.closeLabel}
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
          ) : null
        }
      />
    </main>
  );
}
