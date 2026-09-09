'use client';
import { useRouter } from 'next/navigation';
import { Eyebrow } from '@/components/Eyebrow';
import { useFavorites } from '@/components/FavoritesContext';
import { PropertyCard } from '@/components/PropertyCard';
import { ArrowRight } from '@/components/icons';
import { RESIDENCES } from '@/lib/data';
import { PAGES } from '@/lib/pages';

export function FavoritesBody() {
  const router = useRouter();
  const { ids } = useFavorites();
  const saved = RESIDENCES.filter((r) => ids.includes(r.id));
  // The count sentence is one editable string per plural form, with {count}
  // standing in for the number — so the client can reword the whole line, not
  // just the noun the old template swapped.
  const countLine = (
    saved.length === 1
      ? PAGES.favorites.countSingular
      : PAGES.favorites.countPlural
  ).replace('{count}', String(saved.length));

  return (
    <main className="page-enter">
      <section className="section bg-ivory">
        <div className="container">
          <Eyebrow style={{ marginBottom: 22 }}>{PAGES.favorites.eyebrow}</Eyebrow>
          <h1 className="h1 serif" style={{ marginBottom: 14 }}>
            {PAGES.favorites.title}
          </h1>
          <p className="small muted" style={{ marginBottom: 56 }}>
            {saved.length === 0 ? PAGES.favorites.countNone : countLine}
          </p>

          {saved.length === 0 ? (
            <div
              style={{
                background: 'var(--cream)',
                border: '1px solid var(--hairline)',
                padding: 'clamp(48px, 8vw, 96px)',
                textAlign: 'center',
              }}
            >
              <p
                className="serif italic"
                style={{
                  fontSize: 'clamp(1.5rem, 2.4vw, 2rem)',
                  maxWidth: 440,
                  margin: '0 auto 32px',
                }}
              >
                &ldquo;{PAGES.favorites.empty.quote}&rdquo;
              </p>
              <button
                className="btn btn-ghost"
                onClick={() => router.push('/residences')}
              >
                {PAGES.favorites.empty.ctaLabel} <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="cards-grid">
              {saved.map((r) => (
                <PropertyCard key={r.id} residence={r} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
