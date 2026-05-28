'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eyebrow } from '@/components/Eyebrow';
import { SmartImage } from '@/components/SmartImage';
import { ParallaxImage } from '@/components/ParallaxImage';
import { TransactionCard } from '@/components/TransactionCard';
import { useTilt } from '@/components/useTilt';
import { ArrowRight, SearchIcon } from '@/components/icons';
import { CITIES, IMAGES, RESIDENCES, type City } from '@/lib/data';
import { PORTFOLIO } from '@/lib/portfolio';

function CinematicHero({
  query,
  setQuery,
  onSearch,
  goCity,
}: {
  query: string;
  setQuery: (v: string) => void;
  onSearch: () => void;
  goCity: (slug: string) => void;
}) {
  return (
    <section
      style={{
        position: 'relative',
        height: 'calc(100vh - var(--header-h))',
        minHeight: 620,
        overflow: 'hidden',
      }}
    >
      <ParallaxImage
        src="/assets/city-edmonton.png"
        alt="Western Canadian skyline at twilight"
        kenBurns
        eager
        speed={0.16}
        objectPosition="center 40%"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(10,25,41,0.45) 0%, rgba(10,25,41,0.10) 35%, rgba(10,25,41,0.55) 100%)',
        }}
      />
      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        <div
          className="eyebrow gold"
          style={{
            marginBottom: 28,
            fontFamily: 'var(--serif)',
            fontStyle: 'italic',
            textTransform: 'none',
            fontSize: 16,
            letterSpacing: '0.18em',
          }}
        >
          Est. 2023
        </div>
        <h1 className="display" style={{ color: 'var(--ivory)', maxWidth: 980 }}>
          Find your residence.
        </h1>
        <p
          className="body"
          style={{
            color: 'rgba(247,243,236,0.86)',
            fontWeight: 300,
            marginTop: 22,
            fontSize: 19,
            maxWidth: 560,
          }}
        >
          A curated collection across Western Canada.
        </p>

        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            onSearch();
          }}
          style={{
            marginTop: 44,
            background: 'var(--ivory)',
            width: 'min(620px, 92%)',
            padding: 8,
            display: 'flex',
            gap: 8,
            border: '1px solid var(--hairline)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              padding: '0 16px',
            }}
          >
            <SearchIcon size={16} style={{ color: 'var(--muted)' }} />
            <input
              className="input"
              style={{ border: 0, marginLeft: 12 }}
              placeholder="Search by city or residence"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-ghost btn-sm"
            style={{ border: '1px solid var(--ink)' }}
          >
            Discover
          </button>
        </form>

        <div
          style={{
            marginTop: 28,
            color: 'rgba(247,243,236,0.78)',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <span className="italic serif" style={{ fontSize: 15 }}>
            or explore by city —
          </span>
          <a
            className="text-link"
            style={{ color: 'var(--ivory)' }}
            onClick={() => goCity('saskatoon')}
          >
            Saskatoon
          </a>
          <span style={{ opacity: 0.4 }}>·</span>
          <a
            className="text-link"
            style={{ color: 'var(--ivory)' }}
            onClick={() => goCity('edmonton')}
          >
            Edmonton
          </a>
          <span style={{ opacity: 0.4 }}>·</span>
          <a
            className="text-link"
            style={{ color: 'var(--ivory)' }}
            onClick={() => goCity('regina')}
          >
            Regina
          </a>
        </div>
      </div>
    </section>
  );
}

function CityCard({ c }: { c: City }) {
  const router = useRouter();
  const tiltRef = useTilt<HTMLAnchorElement>(4);
  return (
    <a
      ref={tiltRef}
      onClick={() => router.push(`/residences/${c.slug}`)}
      className="city-card"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={c.image} alt={c.label} />
      <div className="overlay" />
      <div className="label">
        <div className="eyebrow" style={{ color: 'rgba(247,243,236,0.7)' }}>
          {c.province}
        </div>
        <div
          className="serif"
          style={{ fontSize: 32, fontWeight: 500, marginTop: 4 }}
        >
          {c.label}
        </div>
        <div className="gold-rule" />
      </div>
    </a>
  );
}

function CityCarousel() {
  const cities = (['saskatoon', 'edmonton', 'regina', 'yellowknife'] as const).map(
    (s) => CITIES[s]
  );
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 24,
      }}
      className="city-carousel-grid"
    >
      {cities.map((c) => (
        <CityCard key={c.slug} c={c} />
      ))}
    </div>
  );
}

function HeritageStrip() {
  const router = useRouter();
  return (
    <section className="section bg-cream">
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 1fr',
            gap: 'clamp(40px, 7vw, 96px)',
            alignItems: 'center',
          }}
          className="grid-3-md1"
        >
          <div style={{ aspectRatio: '4 / 5', overflow: 'hidden' }}>
            <SmartImage
              src={IMAGES.detail_brick}
              alt="Architectural detail · brick masonry"
              fallbackLabel="Architectural detail"
              fallbackTone="deep"
              fallbackChar="B"
            />
          </div>
          <div>
            <Eyebrow style={{ marginBottom: 24 }}>EST. 2023</Eyebrow>
            <h2 className="h2 serif" style={{ marginBottom: 28 }}>
              Building trust from year one.
            </h2>
            <p
              className="body muted"
              style={{ fontSize: 17, maxWidth: 520, marginBottom: 36 }}
            >
              Since 2023, Balto Capital has built a portfolio defined by quality and an uncompromising standard. Today, we open our residences to those who recognize the difference.
            </p>
            <button className="btn btn-ghost" onClick={() => router.push('/about')}>
              Our story <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function PortfolioStrip() {
  const router = useRouter();
  return (
    <section className="section bg-ivory">
      <div className="container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'end',
            marginBottom: 56,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <Eyebrow style={{ marginBottom: 18 }}>PORTFOLIO</Eyebrow>
            <h2 className="h2 serif">Recent transactions.</h2>
          </div>
          <a className="text-link" onClick={() => router.push('/residences')}>
            View all residences{' '}
            <ArrowRight
              size={14}
              style={{ verticalAlign: 'middle', marginLeft: 6 }}
            />
          </a>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'clamp(28px, 3vw, 44px)',
          }}
          className="portfolio-grid"
        >
          {PORTFOLIO.map((entry) => (
            <TransactionCard key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ValuePropsStrip() {
  const props = [
    {
      n: '01',
      t: 'Heritage.',
      d: 'A practice founded in 2023. A portfolio built one residence at a time.',
    },
    {
      n: '02',
      t: 'Curation.',
      d: 'Each residence selected with intent — restored, not renovated.',
    },
    {
      n: '03',
      t: 'Service.',
      d: 'Concierge-level care, always. A single resident manager per building.',
    },
  ];
  return (
    <section className="section bg-ink">
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'clamp(32px, 5vw, 80px)',
          }}
          className="grid-3-md1"
        >
          {props.map((p) => (
            <div key={p.n}>
              <div
                className="serif italic"
                style={{ fontSize: 22, color: 'var(--gold)', marginBottom: 28 }}
              >
                {p.n}
              </div>
              <h3
                className="h3 serif"
                style={{ color: 'var(--ivory)', marginBottom: 16 }}
              >
                {p.t}
              </h3>
              <p
                style={{
                  color: 'rgba(247,243,236,0.7)',
                  lineHeight: 1.7,
                  fontSize: 15,
                }}
              >
                {p.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InquireCTA() {
  const router = useRouter();
  return (
    <section className="section bg-ivory" style={{ textAlign: 'center' }}>
      <div className="container-narrow">
        <Eyebrow style={{ marginBottom: 22 }}>BEGIN AN INQUIRY</Eyebrow>
        <h2 className="h2 serif" style={{ marginBottom: 24 }}>
          Begin your inquiry.
        </h2>
        <p
          className="body muted"
          style={{
            fontSize: 18,
            marginBottom: 40,
            maxWidth: 520,
            margin: '0 auto 40px',
          }}
        >
          Tell us what you&apos;re looking for. We&apos;ll find it.
        </p>
        <button className="btn btn-primary" onClick={() => router.push('/inquire')}>
          Inquire <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const onSearch = () => {
    const q = query.trim().toLowerCase();
    if (!q) {
      router.push('/residences');
      return;
    }
    if (['saskatoon', 'edmonton', 'regina'].includes(q)) {
      router.push(`/residences/${q}`);
      return;
    }
    const r = RESIDENCES.find(
      (r) => r.name.toLowerCase().includes(q) || r.slug.includes(q)
    );
    if (r) router.push(`/residences/${r.city}/${r.slug}`);
    else router.push(`/residences?q=${encodeURIComponent(query)}`);
  };

  return (
    <main className="page-enter">
      <CinematicHero
        query={query}
        setQuery={setQuery}
        onSearch={onSearch}
        goCity={(slug) => router.push(`/residences/${slug}`)}
      />

      <section className="section bg-ivory">
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'end',
              marginBottom: 56,
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div>
              <Eyebrow style={{ marginBottom: 18 }}>OUR CITIES</Eyebrow>
              <h2 className="h2 serif">Four cities. One standard.</h2>
            </div>
            <p
              className="body muted"
              style={{ maxWidth: 380, margin: 0 }}
            >
              The portfolio runs across Western Canada — each city represented by considered residences, never collected indiscriminately.
            </p>
          </div>
          <CityCarousel />
        </div>
      </section>

      <HeritageStrip />
      <PortfolioStrip />
      <ValuePropsStrip />
      <InquireCTA />
    </main>
  );
}
