'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEFAULT_FILTERS, FiltersPanel, type Filters } from './FiltersPanel';
import { SortDropdown } from './SortDropdown';
import { MapView } from './MapViewClient';
import { Eyebrow } from './Eyebrow';
import { FavoriteHeart } from './FavoriteHeart';
import { ParallaxImage } from './ParallaxImage';
import { PlaceholderImg } from './SmartImage';
import { ArrowRight, ListIcon, MapIcon, SlidersIcon } from './icons';
import {
  bedroomShort,
  formatPrice,
  residencesByCity,
  type City,
  type Residence,
} from '@/lib/data';
import { applyFilters } from '@/lib/filter';

/* ============================================================
   Portfolio city listing — the editorial layout the client asked
   for on the reference site: one full-bleed cover image, then the
   residences as large stacked rows. Photography loads desaturated
   and resolves to full colour as each row scrolls into view.

   Opted into per city (`portfolioLayout` in the Content Studio), so
   it can be reviewed on Saskatoon before the other markets move over.
   ============================================================ */

/** Adds `is-inview` the first time the element crosses into the viewport.
 *  Unlike the global ScrollReveal this also fires for rows that are already
 *  on screen at mount, so an above-the-fold row still resolves to colour. */
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

export function PortfolioCity({ city }: { city: City }) {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [selected, setSelected] = useState<string | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const all = useMemo(() => residencesByCity(city.slug), [city.slug]);
  const filtered = useMemo(() => applyFilters(all, filters, ''), [all, filters]);

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

      {/* 01 · Full-bleed cover */}
      <section className="portfolio-cover">
        <ParallaxImage
          src={city.image || '/assets/placeholder.jpeg'}
          alt={`${city.label}, ${city.province}`}
          eager
          kenBurns
          speed={0.12}
        />
        <div className="portfolio-cover-scrim" />
        <div className="container portfolio-cover-copy">
          <div className="breadcrumb" style={{ marginBottom: 22 }}>
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
          <Eyebrow color="gold" style={{ marginBottom: 20 }}>
            {city.province} · Portfolio
          </Eyebrow>
          <h1 className="display" style={{ color: 'var(--ivory)' }}>
            {city.label}.
          </h1>
          <p className="portfolio-cover-blurb body">{city.blurb}</p>
        </div>
      </section>

      {/* 02 · Toolbar — filters, list/map view, sort */}
      <div className="portfolio-toolbar" ref={toolbarRef}>
        <div className="container portfolio-toolbar-inner">
          <p className="small muted" style={{ margin: 0 }}>
            {filtered.length} {filtered.length === 1 ? 'residence' : 'residences'}{' '}
            in {city.label}
          </p>
          <div className="portfolio-toolbar-actions">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setFiltersOpen(true)}
              style={{ borderColor: 'var(--hairline-strong)' }}
            >
              <SlidersIcon size={14} /> Show filters
            </button>

            <div className="view-toggle" role="group" aria-label="View">
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

            <SortDropdown
              value={filters.sort}
              onChange={(s) => setFilters({ ...filters, sort: s })}
            />
          </div>
        </div>
      </div>

      {/* 03 · The residences */}
      {filtered.length === 0 ? (
        <div className="container" style={{ padding: '80px 0 120px' }}>
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
        </div>
      ) : view === 'map' ? (
        <div className="portfolio-map">
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
      ) : (
        <div className="container portfolio-list">
          {filtered.map((r, i) => (
            <PortfolioRow key={r.id} r={r} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
