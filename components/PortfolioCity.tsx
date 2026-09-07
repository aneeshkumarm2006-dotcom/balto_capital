'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEFAULT_FILTERS, FiltersPanel, type Filters } from './FiltersPanel';
import { SortDropdown } from './SortDropdown';
import { MapView } from './MapViewClient';
import type { MapBounds } from './MapView';
import { Dropdown } from './ui/Dropdown';
import { Eyebrow } from './Eyebrow';
import { FavoriteHeart } from './FavoriteHeart';
import { ParallaxImage } from './ParallaxImage';
import { PropertyRow } from './PropertyRow';
import { PlaceholderImg } from './SmartImage';
import { ArrowRight, ListIcon, MapIcon, SlidersIcon } from './icons';
import {
  bedroomShort,
  formatPrice,
  residencesByCity,
  LIVE_CITIES,
  type City,
  type Residence,
} from '@/lib/data';
import { applyFilters, unitBeds } from '@/lib/filter';

/* ============================================================
   Portfolio city listing — the editorial layout the client asked
   for on the reference site: one full-bleed cover image, then the
   residences as large stacked rows. Photography loads desaturated
   and resolves to full colour under the cursor.

   Cities that also switch on `mapListing` in the Content Studio get
   the split treatment from the client's map reference instead of the
   stacked rows: the residences as a scrolling column of horizontal
   rows on the left, a sticky map of the city on the right.

   Both are opted into per city, so they can be reviewed on Saskatoon
   before the other markets move over.
   ============================================================ */

/** Adds `is-inview` the first time the element crosses into the viewport.
 *  Unlike the global ScrollReveal this also fires for rows that are already
 *  on screen at mount, so an above-the-fold row still settles. */
function useInView<T extends HTMLElement>(): React.RefObject<T> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-inview');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-inview');
          io.unobserve(e.target);
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function PortfolioRow({ r, index }: { r: Residence; index: number }) {
  const router = useRouter();
  const ref = useInView<HTMLElement>();
  const [imgErrored, setImgErrored] = useState(false);
  const to = `/residences/${r.city}/${r.slug}`;
  const hasUnits = (r.units?.length ?? 0) > 0;
  const flipped = index % 2 === 1;

  return (
    <article
      ref={ref}
      className={`portfolio-row${flipped ? ' flipped' : ''}`}
    >
      <a
        className="portfolio-media"
        href={to}
        onClick={(e) => {
          e.preventDefault();
          router.push(to);
        }}
        aria-label={`${r.name}, ${r.cityLabel}`}
      >
        {r.heroImage && !imgErrored ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={r.heroImage}
            alt={r.name}
            loading={index < 2 ? 'eager' : 'lazy'}
            onError={() => setImgErrored(true)}
          />
        ) : (
          <PlaceholderImg label={`${r.name} · exterior`} tone="deep">
            {r.name.charAt(0)}
          </PlaceholderImg>
        )}
        <span className="portfolio-index serif">
          {String(index + 1).padStart(2, '0')}
        </span>
      </a>

      <div className="portfolio-copy">
        {r.neighbourhood && (
          <Eyebrow style={{ marginBottom: 14 }}>{r.neighbourhood}</Eyebrow>
        )}
        <h2 className="h2 serif" style={{ marginBottom: 10 }}>
          {r.name}
        </h2>
        <p className="small muted" style={{ marginBottom: 22 }}>
          {r.address}
        </p>
        <p
          className="body muted"
          style={{ fontSize: 16, maxWidth: 460, marginTop: 0, marginBottom: 28 }}
        >
          {r.description}
        </p>

        <dl className="portfolio-facts">
          <div>
            <dt className="eyebrow">Suites</dt>
            <dd className="serif">
              {hasUnits ? bedroomShort(r.bedroomOptions) : '—'}
            </dd>
          </div>
          <div>
            <dt className="eyebrow">From</dt>
            <dd className="serif">
              {hasUnits ? (
                <>
                  {formatPrice(r.priceFrom)}
                  <span
                    className="caption muted"
                    style={{ marginLeft: 4, fontFamily: 'var(--sans)' }}
                  >
                    /mo net
                  </span>
                </>
              ) : (
                '—'
              )}
            </dd>
          </div>
        </dl>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginTop: 30,
          }}
        >
          <button className="btn btn-ghost btn-sm" onClick={() => router.push(to)}>
            View residence <ArrowRight size={14} />
          </button>
          <FavoriteHeart id={r.id} size={18} />
        </div>
      </div>
    </article>
  );
}

function EmptyState({
  onClear,
  onClearArea,
  inArea,
}: {
  onClear: () => void;
  onClearArea?: () => void;
  inArea?: boolean;
}) {
  return (
    <div className="portfolio-empty">
      <p className="serif italic" style={{ fontSize: 22, margin: 0 }}>
        {inArea
          ? 'No residences in this part of the map.'
          : 'No residences match these filters.'}
      </p>
      {inArea && onClearArea ? (
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 24 }} onClick={onClearArea}>
          Show the whole city
        </button>
      ) : (
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 24 }} onClick={onClear}>
          Clear all
        </button>
      )}
    </div>
  );
}

export function PortfolioCity({ city }: { city: City }) {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [area, setArea] = useState<MapBounds | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const mapListing = Boolean(city.mapListing);

  const all = useMemo(() => residencesByCity(city.slug), [city.slug]);
  const filtered = useMemo(() => applyFilters(all, filters, ''), [all, filters]);

  /* A viewport search narrows what is listed without moving the camera. */
  const shown = useMemo(() => {
    if (!area) return filtered;
    return filtered.filter(
      (r) =>
        r.coordinates.lat <= area.north &&
        r.coordinates.lat >= area.south &&
        r.coordinates.lng <= area.east &&
        r.coordinates.lng >= area.west
    );
  }, [filtered, area]);

  /* The map re-frames when the FILTERS change, never when a viewport search
     narrows the list — otherwise searching this area would immediately zoom
     away from the area the visitor just framed. */
  const fitToken = useMemo(
    () =>
      [
        city.slug,
        filters.beds.join('-'),
        filters.priceMin,
        filters.priceMax,
        filters.availability,
        filters.amenities.join('-'),
      ].join('|'),
    [city.slug, filters]
  );

  /* Bedroom sizes that actually exist in this market. A building with no
     units on file is excluded by any bedroom filter (lib/filter.ts), so
     offering a size nothing can match would just empty the page. */
  const bedOptions = useMemo(() => {
    const seen = new Set<number>();
    all.forEach((r) =>
      (r.units ?? []).forEach((u) => {
        const b = unitBeds(u.type);
        if (b >= 0) seen.add(b >= 3 ? 3 : b);
      })
    );
    return Array.from(seen).sort((a, b) => a - b);
  }, [all]);

  const clearAll = () => {
    // Sort lives inside Filters; clearing the filters should not silently
    // re-sort the list back to A–Z under the visitor.
    setFilters({ ...DEFAULT_FILTERS, sort: filters.sort });
    setArea(null);
  };

  /* Switching view swaps what sits under the toolbar, so bring the toolbar to
     the top of the screen — otherwise the cover image hides the change. */
  const changeView = (next: 'list' | 'map') => {
    setView(next);
    const el = toolbarRef.current;
    if (!el) return;
    const headerH =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
        10
      ) || 92;
    const top = el.getBoundingClientRect().top + window.scrollY - headerH;
    if (window.scrollY < top) window.scrollTo({ top, behavior: 'smooth' });
  };

  const cityOptions = [
    { value: '', label: 'All cities' },
    ...LIVE_CITIES.map((c) => ({ value: c.slug, label: c.label })),
  ];

  const bedLabel = (b: number) =>
    b === 0 ? 'Studio' : b >= 3 ? '3+ bedrooms' : b === 1 ? '1 bedroom' : `${b} bedrooms`;

  const viewToggle = (
    <div
      className={'view-toggle' + (mapListing ? ' portfolio-view-toggle' : '')}
      role="group"
      aria-label="View"
    >
      <button
        type="button"
        className={view === 'list' ? 'active' : ''}
        aria-pressed={view === 'list'}
        onClick={() => changeView('list')}
      >
        <ListIcon size={14} /> List view
      </button>
      <button
        type="button"
        className={view === 'map' ? 'active' : ''}
        aria-pressed={view === 'map'}
        onClick={() => changeView('map')}
      >
        <MapIcon size={14} /> Map view
      </button>
    </div>
  );

  const sort = (
    <SortDropdown
      value={filters.sort}
      onChange={(s) => setFilters({ ...filters, sort: s })}
    />
  );

  const count = (
    <p className="small muted" style={{ margin: 0 }}>
      {shown.length} {shown.length === 1 ? 'residence' : 'residences'} in{' '}
      {city.label}
      {area && ' in this area'}
    </p>
  );

  /* The split lays the controls out the way the reference does: filters on
     their own row, then the count and the sort facing each other under it.
     Side by side the column is too narrow for one row of everything. */
  const toolbar = mapListing ? (
    <div className="portfolio-toolbar" ref={toolbarRef}>
      <div className="portfolio-toolbar-inner is-split">
        <div className="portfolio-filter-row">
          {/* On a single-city page a city FILTER can only ever return
              everything or nothing, so the control navigates instead. */}
          <div className="filter-pill">
            <Dropdown
              ariaLabel="City"
              value={city.slug}
              options={cityOptions}
              onChange={(v) => router.push(v ? `/residences/${v}` : '/residences')}
            />
          </div>
          {bedOptions.length > 0 && (
            <div className="filter-pill">
              <Dropdown
                ariaLabel="Bedrooms"
                value={filters.beds.length === 1 ? String(filters.beds[0]) : ''}
                options={[
                  { value: '', label: 'All bedrooms' },
                  ...bedOptions.map((b) => ({
                    value: String(b),
                    label: bedLabel(b),
                  })),
                ]}
                onChange={(v) =>
                  setFilters({ ...filters, beds: v === '' ? [] : [Number(v)] })
                }
              />
            </div>
          )}
          <button
            className="btn btn-ghost btn-sm filter-more"
            onClick={() => setFiltersOpen(true)}
            style={{ borderColor: 'var(--hairline-strong)' }}
          >
            <SlidersIcon size={14} /> More filters
          </button>
          {viewToggle}
        </div>
        <div className="portfolio-count-row">
          {count}
          {sort}
        </div>
      </div>
    </div>
  ) : (
    <div className="portfolio-toolbar" ref={toolbarRef}>
      <div className="container portfolio-toolbar-inner">
        {count}
        <div className="portfolio-toolbar-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setFiltersOpen(true)}
            style={{ borderColor: 'var(--hairline-strong)' }}
          >
            <SlidersIcon size={14} /> Show filters
          </button>
          {viewToggle}
          {sort}
        </div>
      </div>
    </div>
  );

  const map = (
    <MapView
      residences={shown}
      selectedId={selected}
      hoverId={hovered}
      onHover={setHovered}
      showPreview={false}
      featuredPins
      showLegend
      fitToken={fitToken}
      onSearchArea={setArea}
      onSelect={(id, navigateTo) => {
        const r = shown.find((x) => x.id === id);
        if (navigateTo && r) router.push(`/residences/${r.city}/${r.slug}`);
        else setSelected(id);
      }}
    />
  );

  return (
    /* `has-overlay-hero` pulls the page up under the header so the cover runs
       the full screen behind the navigation, the same as the About film. */
    <main className="page-enter has-overlay-hero">
      <FiltersPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={() => setFiltersOpen(false)}
        onClear={clearAll}
      />

      {/* 01 · Full-bleed cover. Breadcrumb rides at the top as page chrome and
             the city sits as a title block on the bottom rule, so the two stop
             reading as one undifferentiated stack of text over the skyline. */}
      <section className="portfolio-cover">
        <ParallaxImage
          src={city.image || '/assets/placeholder.jpeg'}
          alt={`${city.label}, ${city.province}`}
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
              Home
            </a>
            <span className="sep">/</span>
            <a className="text-link" onClick={() => router.push('/residences')}>
              Residences
            </a>
            <span className="sep">/</span>
            <span>{city.label}</span>
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
              {city.province} · Portfolio
            </Eyebrow>
            <h1
              className="display portfolio-cover-title hero-rise"
              style={{ ['--rise-delay' as string]: '380ms' }}
            >
              {city.label}.
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
              {city.blurb}
            </p>
          </div>
        </div>
      </section>

      {mapListing ? (
        /* 02 · Split: the residences as a scrolling column beside a map of the
               city that stays pinned under the header. `data-view` only bites
               below the breakpoint, where the two panes stack. */
        <div className="portfolio-split" data-view={view}>
          <div className="portfolio-split-list">
            {toolbar}
            {shown.length === 0 ? (
              <EmptyState
                onClear={clearAll}
                onClearArea={() => setArea(null)}
                inArea={Boolean(area) && filtered.length > 0}
              />
            ) : (
              <div className="portfolio-listing">
                {shown.map((r) => (
                  <PropertyRow
                    key={r.id}
                    residence={r}
                    active={hovered === r.id || selected === r.id}
                    onHover={setHovered}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="portfolio-split-map">{map}</div>
        </div>
      ) : (
        <>
          {/* 02 · Toolbar — filters, list/map view, sort */}
          {toolbar}

          {/* 03 · The residences */}
          {shown.length === 0 ? (
            <div className="container" style={{ padding: '80px 0 120px' }}>
              <EmptyState onClear={clearAll} />
            </div>
          ) : view === 'map' ? (
            <div className="portfolio-map">{map}</div>
          ) : (
            <div className="container portfolio-list">
              {shown.map((r, i) => (
                <PortfolioRow key={r.id} r={r} index={i} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
