'use client';
import { useMemo, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { Filters } from './FiltersPanel';
import { SortDropdown } from './SortDropdown';
import { MapView } from './MapViewClient';
import type { MapBounds } from './MapView';
import { MultiDropdown } from './ui/MultiDropdown';
import { PropertyRow } from './PropertyRow';
import { ListIcon, MapIcon, MapOffIcon, SlidersIcon } from './icons';
import { LIVE_CITIES, type Residence } from '@/lib/data';
import { applyFilters, unitBeds } from '@/lib/filter';
import { PAGES } from '@/lib/pages';

const T = PAGES.city;

/** Fill {token} placeholders in a CMS string. The replacement is a function so
 *  a value containing `$&` or `$$` is inserted literally instead of being read
 *  as a String.replace substitution pattern. */
const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (token, key: string) =>
    key in values ? values[key] : token,
  );

/* ============================================================
   Split listing — the client's map reference, and the single
   implementation of it. /residences, the default city layout and the
   portfolio cities that switch on `mapListing` all render this, so the
   toolbar, the filters and the map cannot drift apart from one page to
   the next: one toolbar (city · bedrooms · more filters · hide map ·
   list/map), one map configuration (gold featured pins, legend, hover
   synced with the list, "Search this area").
   ============================================================ */

export function ListingEmptyState({
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
        {inArea ? T.portfolio.empty.inAreaTitle : T.portfolio.empty.title}
      </p>
      {inArea && onClearArea ? (
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 24 }} onClick={onClearArea}>
          {T.portfolio.empty.clearAreaLabel}
        </button>
      ) : (
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 24 }} onClick={onClear}>
          {T.portfolio.empty.clearLabel}
        </button>
      )}
    </div>
  );
}

export interface ListingSplitProps {
  /** Everything in scope before the filters run: one market, or the whole
   *  portfolio on /residences. */
  residences: Residence[];
  /** The market this page is scoped to. Omitted on /residences, where the city
   *  control sits on "All cities". */
  citySlug?: string;
  filters: Filters;
  setFilters: (f: Filters) => void;
  /** Opens the page's FiltersPanel — owned by the page so the panel stays
   *  mounted at the top of <main>. */
  onOpenFilters: () => void;
  onClearAll: () => void;
  /** Free-text search (/residences). Narrows the list and the map together. */
  query?: string;
  /** Rendered between the toolbar and the rows — the active-search chip. */
  banner?: ReactNode;
  /** Replaces the "{count} residences in {city}" line where a page counts
   *  differently (/residences reads "{count} of {total} …"). */
  renderCount?: (shown: number) => ReactNode;
  /** Prints the market above each row. On for the all-markets index, where the
   *  city is the one fact the row would otherwise be missing. */
  showRowCity?: boolean;
}

export function ListingSplit({
  residences,
  citySlug,
  filters,
  setFilters,
  onOpenFilters,
  onClearAll,
  query = '',
  banner,
  renderCount,
  showRowCity = false,
}: ListingSplitProps) {
  const router = useRouter();
  const [view, setView] = useState<'list' | 'map'>('list');
  /* Desktop split only: the map column can be dismissed so the listings take
     the full width. Below the breakpoint the panes stack and `view` rules. */
  const [mapVisible, setMapVisible] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [area, setArea] = useState<MapBounds | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => applyFilters(residences, filters, query),
    [residences, filters, query]
  );

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
        citySlug ?? 'all',
        query,
        filters.cities.join('-'),
        filters.beds.join('-'),
        filters.priceMin,
        filters.priceMax,
        filters.availability,
        filters.amenities.join('-'),
      ].join('|'),
    [citySlug, query, filters]
  );

  /* Bedroom sizes that actually exist in this scope. A building with no units
     on file is excluded by any bedroom filter (lib/filter.ts), so offering a
     size nothing can match would just empty the page. */
  const bedOptions = useMemo(() => {
    const seen = new Set<number>();
    residences.forEach((r) =>
      (r.units ?? []).forEach((u) => {
        const b = unitBeds(u.type);
        if (b >= 0) seen.add(b >= 3 ? 3 : b);
      })
    );
    return Array.from(seen).sort((a, b) => a - b);
  }, [residences]);

  const clearAll = () => {
    setArea(null);
    onClearAll();
  };

  /* Swapping what sits under the toolbar is invisible while the cover image
     still fills the screen, so bring the toolbar up to the header first. */
  const scrollToToolbar = () => {
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

  const changeView = (next: 'list' | 'map') => {
    setView(next);
    scrollToToolbar();
  };

  /* Dismissing the map also drops any viewport search: the list would
     otherwise stay narrowed by an area the visitor can no longer see. */
  const toggleMap = () => {
    if (mapVisible) setArea(null);
    setMapVisible(!mapVisible);
    scrollToToolbar();
  };

  const cityOptions = LIVE_CITIES.map((c) => ({ value: c.slug, label: c.label }));

  /* A city page is scoped by its route, so its toolbar cannot filter on city —
     it navigates. One market still has a page of its own to go to; several, or
     none, only exist on the all-markets index, which carries the selection
     across in the URL and picks it up as a real filter. */
  const citySelection = citySlug ? [citySlug] : filters.cities;
  const onCityChange = (next: string[]) => {
    if (!citySlug) {
      setFilters({ ...filters, cities: next });
      return;
    }
    if (next.length === 1) {
      if (next[0] !== citySlug) router.push(`/residences/${next[0]}`);
      return;
    }
    router.push(next.length ? `/residences?cities=${next.join(',')}` : '/residences');
  };

  const bedLabel = (b: number) =>
    b === 0
      ? T.portfolio.toolbar.bedroomStudioLabel
      : b >= 3
        ? T.portfolio.toolbar.bedroomMaxLabel
        : fill(
            b === 1
              ? T.portfolio.toolbar.bedroomSingular
              : T.portfolio.toolbar.bedroomPlural,
            { count: String(b) },
          );

  const count = renderCount ? (
    renderCount(shown.length)
  ) : (
    <p className="small muted" style={{ margin: 0 }}>
      {fill(
        shown.length === 1
          ? T.portfolio.toolbar.countSingular
          : T.portfolio.toolbar.countPlural,
        {
          count: String(shown.length),
          city: citySlug
            ? (LIVE_CITIES.find((c) => c.slug === citySlug)?.label ?? '')
            : T.portfolio.toolbar.allCitiesLabel,
        },
      )}
      {area && ` ${T.portfolio.toolbar.countAreaSuffix}`}
    </p>
  );

  return (
    /* `data-view` only bites below the breakpoint, where the panes stack. */
    <div
      className="portfolio-split"
      data-view={view}
      data-map={mapVisible ? 'shown' : 'hidden'}
    >
      <div className="portfolio-split-list">
        {/* The split lays the controls out the way the reference does: filters
            on their own row, then the count and the sort facing each other
            under it. Side by side the column is too narrow for one row. */}
        <div className="portfolio-toolbar" ref={toolbarRef}>
          <div className="portfolio-toolbar-inner is-split">
            <div className="portfolio-filter-row">
              <div className="filter-pill">
                <MultiDropdown
                  ariaLabel={T.portfolio.toolbar.cityFilterLabel}
                  values={citySelection}
                  options={cityOptions}
                  allLabel={T.portfolio.toolbar.allCitiesLabel}
                  summaryTemplate={
                    T.portfolio.toolbar.citiesSummaryTemplate ?? '{count} cities'
                  }
                  onChange={onCityChange}
                />
              </div>
              {bedOptions.length > 0 && (
                <div className="filter-pill">
                  <MultiDropdown
                    ariaLabel={T.portfolio.toolbar.bedroomsFilterLabel}
                    values={filters.beds.map(String)}
                    options={bedOptions.map((b) => ({
                      value: String(b),
                      label: bedLabel(b),
                    }))}
                    allLabel={T.portfolio.toolbar.allBedroomsLabel}
                    summaryTemplate={
                      T.portfolio.toolbar.bedroomsSummaryTemplate ?? '{count} sizes'
                    }
                    onChange={(v) =>
                      setFilters({ ...filters, beds: v.map(Number) })
                    }
                  />
                </div>
              )}
              <button
                className="btn btn-ghost btn-sm filter-more"
                onClick={onOpenFilters}
                style={{ borderColor: 'var(--hairline-strong)' }}
              >
                <SlidersIcon size={14} /> {T.portfolio.toolbar.moreFiltersLabel}
              </button>
              <button
                className="btn btn-ghost btn-sm portfolio-map-toggle"
                onClick={toggleMap}
                aria-pressed={!mapVisible}
                style={{ borderColor: 'var(--hairline-strong)' }}
              >
                {mapVisible ? (
                  <>
                    <MapOffIcon size={14} /> {T.portfolio.toolbar.hideMapLabel}
                  </>
                ) : (
                  <>
                    <MapIcon size={14} /> {T.portfolio.toolbar.showMapLabel}
                  </>
                )}
              </button>
              <div
                className="view-toggle portfolio-view-toggle"
                role="group"
                aria-label={T.portfolio.toolbar.viewToggleLabel}
              >
                <button
                  type="button"
                  className={view === 'list' ? 'active' : ''}
                  aria-pressed={view === 'list'}
                  onClick={() => changeView('list')}
                >
                  <ListIcon size={14} /> {T.portfolio.toolbar.listViewLabel}
                </button>
                <button
                  type="button"
                  className={view === 'map' ? 'active' : ''}
                  aria-pressed={view === 'map'}
                  onClick={() => changeView('map')}
                >
                  <MapIcon size={14} /> {T.portfolio.toolbar.mapViewLabel}
                </button>
              </div>
            </div>
            <div className="portfolio-count-row">
              {count}
              <SortDropdown
                value={filters.sort}
                onChange={(s) => setFilters({ ...filters, sort: s })}
              />
            </div>
          </div>
        </div>

        {banner}

        {shown.length === 0 ? (
          <ListingEmptyState
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
                showCity={showRowCity}
                active={hovered === r.id || selected === r.id}
                onHover={setHovered}
              />
            ))}
          </div>
        )}
      </div>

      <div className="portfolio-split-map">
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
      </div>
    </div>
  );
}
