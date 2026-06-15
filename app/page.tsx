'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eyebrow } from '@/components/Eyebrow';
import { SmartImage } from '@/components/SmartImage';
import { ParallaxImage } from '@/components/ParallaxImage';
import { PropertyCard } from '@/components/PropertyCard';
import { useTilt } from '@/components/useTilt';
import { ArrowRight, SearchIcon } from '@/components/icons';
import { CITIES, IMAGES, featuredResidences, type City } from '@/lib/data';

/* ------------------------------------------------------------------ */
/* 02 · Hero + rental search bar                                       */
/* ------------------------------------------------------------------ */
function CinematicHero({
  onSearch,
}: {
  onSearch: (v: { city: string; maxRent: string; beds: string }) => void;
}) {
  const [city, setCity] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [beds, setBeds] = useState('');

  const selectStyle: React.CSSProperties = {
    border: 0,
    background: 'transparent',
    font: 'inherit',
    color: 'var(--ink)',
    fontSize: 15,
    width: '100%',
    padding: '14px 16px',
    appearance: 'none',
    cursor: 'pointer',
  };

  return (
    <section
      style={{
        position: 'relative',
        height: 'calc(100vh - var(--header-h))',
        minHeight: 640,
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
            'linear-gradient(to bottom, rgba(10,25,41,0.50) 0%, rgba(10,25,41,0.12) 35%, rgba(10,25,41,0.58) 100%)',
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
            marginBottom: 26,
            fontFamily: 'var(--serif)',
            fontStyle: 'italic',
            textTransform: 'none',
            fontSize: 16,
            letterSpacing: '0.18em',
          }}
        >
          Family-operated · Western Canada
        </div>
        <h1 className="display" style={{ color: 'var(--ivory)', maxWidth: 1040 }}>
          Homes across Western Canada. One standard.
        </h1>
        <p
          className="body"
          style={{
            color: 'rgba(247,243,236,0.88)',
            fontWeight: 300,
            marginTop: 22,
            fontSize: 19,
            maxWidth: 600,
          }}
        >
          Thoughtfully maintained apartment homes across Western Canada — owned and
          run by the same family team that answers your call.
        </p>

        {/* Rental search bar — City · Max Rent · Bedrooms · Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearch({ city, maxRent, beds });
          }}
          className="hero-search"
          style={{
            marginTop: 44,
            background: 'var(--ivory)',
            width: 'min(880px, 96%)',
            padding: 8,
            display: 'flex',
            alignItems: 'stretch',
            gap: 0,
            border: '1px solid var(--hairline)',
            flexWrap: 'wrap',
          }}
        >
          <label style={{ flex: 1, minWidth: 150, display: 'flex', flexDirection: 'column' }}>
            <span className="eyebrow" style={{ padding: '8px 16px 0', fontSize: 10 }}>City</span>
            <select style={selectStyle} value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Any city</option>
              <option value="Edmonton">Edmonton</option>
              <option value="Saskatoon">Saskatoon</option>
              <option value="Regina">Regina</option>
            </select>
          </label>
          <span className="hero-search-div" />
          <label style={{ flex: 1, minWidth: 150, display: 'flex', flexDirection: 'column' }}>
            <span className="eyebrow" style={{ padding: '8px 16px 0', fontSize: 10 }}>Max rent</span>
            <select style={selectStyle} value={maxRent} onChange={(e) => setMaxRent(e.target.value)}>
              <option value="">Any</option>
              <option value="1400">Up to $1,400</option>
              <option value="1600">Up to $1,600</option>
              <option value="1800">Up to $1,800</option>
              <option value="2200">Up to $2,200</option>
            </select>
          </label>
          <span className="hero-search-div" />
          <label style={{ flex: 1, minWidth: 150, display: 'flex', flexDirection: 'column' }}>
            <span className="eyebrow" style={{ padding: '8px 16px 0', fontSize: 10 }}>Bedrooms</span>
            <select style={selectStyle} value={beds} onChange={(e) => setBeds(e.target.value)}>
              <option value="">Any</option>
              <option value="0">Studio</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3+ Bedrooms</option>
            </select>
          </label>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ margin: 4, display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <SearchIcon size={16} /> Search homes
          </button>
        </form>
        <p style={{ marginTop: 14, color: 'rgba(247,243,236,0.7)', fontSize: 12.5 }}>
          Prices shown are net effective rent — what you actually pay after any promotion.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 04 · Our cities                                                     */
/* ------------------------------------------------------------------ */
function CityCard({ c, comingSoon }: { c: City; comingSoon?: boolean }) {
  const router = useRouter();
  const tiltRef = useTilt<HTMLAnchorElement>(comingSoon ? 0 : 4);
  return (
    <a
      ref={tiltRef}
      onClick={() => router.push(`/residences/${c.slug}`)}
      className="city-card"
      style={comingSoon ? { filter: 'grayscale(0.7)', opacity: 0.82 } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={c.image} alt={c.label} />
      <div className="overlay" />
      {comingSoon && (
        <div
          className="eyebrow"
          style={{
            position: 'absolute', top: 16, left: 16, zIndex: 2,
            background: 'rgba(10,25,41,0.72)', color: 'var(--gold)',
            padding: '6px 12px', fontSize: 10,
          }}
        >
          Coming soon
        </div>
      )}
      <div className="label">
        <div className="eyebrow" style={{ color: 'rgba(247,243,236,0.7)' }}>
          {c.province}
        </div>
        <div className="serif" style={{ fontSize: 32, fontWeight: 500, marginTop: 4 }}>
          {c.label}
        </div>
        <div className="gold-rule" />
        <div className="small" style={{ color: 'rgba(247,243,236,0.82)', marginTop: 6 }}>
          {comingSoon ? 'Register your interest →' : 'View residences →'}
        </div>
      </div>
    </a>
  );
}

function OurCities() {
  const cities = (['saskatoon', 'edmonton', 'regina'] as const).map((s) => CITIES[s]);
  return (
    <section className="section bg-ivory">
      <div className="container">
        <div
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'end',
            marginBottom: 56, flexWrap: 'wrap', gap: 16,
          }}
        >
          <div>
            <Eyebrow style={{ marginBottom: 18 }}>OUR CITIES</Eyebrow>
            <h2 className="h2 serif">Across Western Canada, and growing.</h2>
          </div>
          <p className="body muted" style={{ maxWidth: 400, margin: 0 }}>
            A focused portfolio across Western Canada — and growing. Every building
            chosen, kept, and cared for with intent. Start with your city.
          </p>
        </div>
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}
          className="city-carousel-grid"
        >
          {cities.map((c) => (
            <CityCard key={c.slug} c={c} />
          ))}
          <CityCard c={CITIES.yellowknife} comingSoon />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 05 · Featured residences                                            */
/* ------------------------------------------------------------------ */
function FeaturedResidences() {
  const router = useRouter();
  const featured = featuredResidences().slice(0, 6);
  return (
    <section className="section bg-cream">
      <div className="container">
        <div
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'end',
            marginBottom: 48, flexWrap: 'wrap', gap: 16,
          }}
        >
          <div>
            <Eyebrow style={{ marginBottom: 18 }}>FEATURED RESIDENCES</Eyebrow>
            <h2 className="h2 serif">Homes available now.</h2>
          </div>
          <button className="btn btn-ghost" onClick={() => router.push('/residences')}>
            View all residences <ArrowRight size={14} />
          </button>
        </div>
        <div className="home-cards-3">
          {featured.map((r) => (
            <PropertyCard key={r.id} residence={r} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 06 · Why rent with Balto                                            */
/* ------------------------------------------------------------------ */
const BENEFITS = [
  { t: 'Family-operated', d: 'A brother-and-sister team that owns and runs the buildings.' },
  { t: 'One-day response', d: 'Maintenance answered within one business day.' },
  { t: 'Renovated & secured', d: 'Updated suites and upgraded building security.' },
  { t: 'Pet-friendly homes', d: 'Many of our residences welcome pets.' },
];

function WhyRent() {
  return (
    <section className="section bg-ivory">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 56, maxWidth: 680, margin: '0 auto 56px' }}>
          <Eyebrow style={{ marginBottom: 18 }}>WHY RENT WITH BALTO</Eyebrow>
          <h2 className="h2 serif" style={{ marginBottom: 18 }}>We own what we manage.</h2>
          <p className="body muted" style={{ fontSize: 17 }}>
            No third-party manager between you and your home — the family that owns
            the building is the one that looks after it.
          </p>
        </div>
        <div className="home-cards-4">
          {BENEFITS.map((b, i) => (
            <div key={b.t} style={{ borderTop: '2px solid var(--gold)', paddingTop: 24 }}>
              <div className="serif italic" style={{ fontSize: 20, color: 'var(--gold)', marginBottom: 16 }}>
                0{i + 1}
              </div>
              <h3 className="h3 serif" style={{ marginBottom: 12 }}>{b.t}</h3>
              <p className="body muted" style={{ fontSize: 15, lineHeight: 1.7 }}>{b.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 07 · How to rent                                                    */
/* ------------------------------------------------------------------ */
const STEPS = ['Search', 'Book a viewing', 'Apply', 'Get approved', 'Move in'];

function HowToRent() {
  return (
    <section className="section bg-ink">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <Eyebrow style={{ marginBottom: 18 }}>HOW TO RENT</Eyebrow>
          <h2 className="h2 serif" style={{ color: 'var(--ivory)' }}>Five steps to your new home.</h2>
        </div>
        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <div key={s} style={{ textAlign: 'center' }}>
              <div
                className="serif"
                style={{
                  width: 56, height: 56, borderRadius: '50%', margin: '0 auto 18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid var(--gold)', color: 'var(--gold)', fontSize: 22,
                }}
              >
                {i + 1}
              </div>
              <div className="serif" style={{ color: 'var(--ivory)', fontSize: 17, fontWeight: 500 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 10 · Our story / heritage                                           */
/* ------------------------------------------------------------------ */
function StoryStrip() {
  const router = useRouter();
  return (
    <section className="section bg-ivory">
      <div className="container">
        <div
          style={{
            display: 'grid', gridTemplateColumns: '1.05fr 1fr',
            gap: 'clamp(40px, 7vw, 96px)', alignItems: 'center',
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
            <Eyebrow style={{ marginBottom: 24 }}>OUR STORY</Eyebrow>
            <h2 className="h2 serif" style={{ marginBottom: 28 }}>
              We buy buildings to keep them.
            </h2>
            <p className="body muted" style={{ fontSize: 17, maxWidth: 540, marginBottom: 28 }}>
              Balto began in 2023 as a private and mezzanine real estate lender. In
              2025 we moved into direct ownership — acquiring, renovating, and
              operating apartment communities across Western Canada, a portfolio that
              continues to grow. We buy buildings to keep them, which is why we treat
              every resident as a long-term relationship, not a transaction.
            </p>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 }}
              className="story-timeline"
            >
              {[
                { y: '2023', t: 'Private & mezzanine lending' },
                { y: '2025', t: 'First property acquisitions · direct ownership' },
                { y: 'Today', t: '1,500+ doors across Western Canada, growing.' },
              ].map((m) => (
                <div key={m.y} style={{ borderLeft: '2px solid var(--gold)', paddingLeft: 14 }}>
                  <div className="serif" style={{ fontSize: 20, fontWeight: 500 }}>{m.y}</div>
                  <div className="small muted">{m.t}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-ghost" onClick={() => router.push('/about')}>
              Our story <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 11 · Inquiry CTA                                                    */
/* ------------------------------------------------------------------ */
function InquireCTA() {
  const router = useRouter();
  return (
    <section className="section bg-cream" style={{ textAlign: 'center' }}>
      <div className="container-narrow">
        <Eyebrow style={{ marginBottom: 22 }}>BEGIN AN INQUIRY</Eyebrow>
        <h2 className="h2 serif" style={{ marginBottom: 24 }}>Begin your inquiry.</h2>
        <p className="body muted" style={{ fontSize: 18, maxWidth: 520, margin: '0 auto 40px' }}>
          Tell us the city, the budget, and the move-in date — we’ll find the right home for you.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => router.push('/residences')}>
            Browse residences <ArrowRight size={14} />
          </button>
          <button className="btn btn-ghost" onClick={() => router.push('/inquire')}>
            Contact us
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  const router = useRouter();

  const onSearch = ({ city, maxRent, beds }: { city: string; maxRent: string; beds: string }) => {
    const sp = new URLSearchParams();
    if (city) sp.set('q', city);
    if (maxRent) sp.set('maxRent', maxRent);
    if (beds) sp.set('beds', beds);
    const qs = sp.toString();
    router.push(qs ? `/residences?${qs}` : '/residences');
  };

  return (
    <main className="page-enter">
      <CinematicHero onSearch={onSearch} />
      <OurCities />
      <FeaturedResidences />
      <WhyRent />
      <HowToRent />
      <StoryStrip />
      <InquireCTA />
    </main>
  );
}
