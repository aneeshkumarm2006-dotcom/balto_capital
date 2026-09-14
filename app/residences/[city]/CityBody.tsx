'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiltersPanel, DEFAULT_FILTERS, type Filters } from '@/components/FiltersPanel';
import { ListingSplit } from '@/components/ListingSplit';
import { PortfolioCity } from '@/components/PortfolioCity';
import { Eyebrow } from '@/components/Eyebrow';
import { ArrowRight } from '@/components/icons';
import { CITIES, residencesByCity, type City, type CitySlug } from '@/lib/data';
import { PAGES } from '@/lib/pages';

const T = PAGES.city;

/** Fill {token} placeholders in a CMS string. The replacement is a function so
 *  a value containing `$&` or `$$` is inserted literally instead of being read
 *  as a String.replace substitution pattern. */
const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (token, key: string) =>
    key in values ? values[key] : token,
  );

/* Announced-but-not-live market (Yellowknife): register-interest email capture. */
function ComingSoonCity({ city }: { city: City }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  return (
    <main className="page-enter">
      <section
        style={{
          position: 'relative',
          minHeight: 'calc(100vh - var(--header-h))',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={city.image}
          alt={city.label}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', filter: 'grayscale(0.4)',
          }}
        />
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,30,74,0.62), rgba(0,30,74,0.80))',
          }}
        />
        <div className="container" style={{ position: 'relative', color: 'var(--ivory)' }}>
          <div style={{ maxWidth: 640 }}>
            <Eyebrow color="gold" style={{ marginBottom: 24 }}>
              {fill(T.comingSoon.eyebrow, { province: city.province })}
            </Eyebrow>
            <h1 className="display" style={{ color: 'var(--ivory)', marginBottom: 24 }}>
              {fill(T.comingSoon.title, { city: city.label })}
            </h1>
            <p
              className="body"
              style={{ color: 'rgb(var(--ivory-rgb) / 0.88)', fontSize: 18, maxWidth: 540, marginBottom: 28 }}
            >
              {T.comingSoon.body}
            </p>

            {sent ? (
              <p className="serif" style={{ color: 'var(--gold)', fontSize: 20 }}>
                {T.comingSoon.successMessage}
              </p>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSent(true); }}
                style={{
                  display: 'flex', gap: 8, maxWidth: 460, flexWrap: 'wrap',
                  background: 'var(--ivory)', padding: 8, border: '1px solid var(--hairline)',
                }}
              >
                <input
                  type="email"
                  required
                  className="input"
                  placeholder={T.comingSoon.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ border: 0, flex: 1, minWidth: 200, padding: '12px 16px', color: 'var(--ink)' }}
                />
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  {T.comingSoon.submitLabel} <ArrowRight size={14} />
                </button>
              </form>
            )}
            <p className="small" style={{ color: 'rgb(var(--ivory-rgb) / 0.55)', marginTop: 16 }}>
              {T.comingSoon.footnote}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export function CityBody({
  params,
}: {
  params: { city: string };
}) {
  const router = useRouter();
  const city = CITIES[params.city as CitySlug];
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const all = useMemo(
    () => (city ? residencesByCity(params.city) : []),
    [city, params.city]
  );

  useEffect(() => {
    if (!city) router.push('/residences');
  }, [city, router]);

  if (!city) return null;

  // Announced-but-not-live markets (Yellowknife): register-interest, not listings.
  if (city.comingSoon) return <ComingSoonCity city={city} />;

  // Markets switched to the portfolio layout in the Content Studio get the
  // cover-image + editorial-rows treatment instead.
  if (city.portfolioLayout) return <PortfolioCity city={city} />;

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

      <div className="container" style={{ paddingTop: 'clamp(28px, 4vw, 56px)' }}>
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <a className="text-link" onClick={() => router.push('/')}>{T.breadcrumb.homeLabel}</a>
          <span className="sep">/</span>
          <a className="text-link" onClick={() => router.push('/residences')}>
            {T.breadcrumb.residencesLabel}
          </a>
          <span className="sep">/</span>
          <span>{city.label}</span>
        </div>
        <Eyebrow style={{ marginBottom: 16 }}>{city.province}</Eyebrow>
        <h1 className="h1 serif" style={{ marginBottom: 14 }}>
          {fill(T.listing.title, { city: city.label })}
        </h1>
        <p
          className="body muted"
          style={{ maxWidth: 560, marginBottom: 8, fontSize: 17 }}
        >
          {city.blurb}
        </p>
      </div>

      {/* The same split, toolbar and map every other listing renders. */}
      <ListingSplit
        residences={all}
        citySlug={city.slug}
        filters={filters}
        setFilters={setFilters}
        onOpenFilters={() => setFiltersOpen(true)}
        onClearAll={() => setFilters({ ...DEFAULT_FILTERS, sort: filters.sort })}
        renderCount={(shown) => (
          <p className="small muted" style={{ margin: 0 }}>
            {fill(shown === 1 ? T.listing.countSingular : T.listing.countPlural, {
              count: String(shown),
            })}
          </p>
        )}
      />
    </main>
  );
}
