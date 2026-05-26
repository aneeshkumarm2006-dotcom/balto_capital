'use client';
import { useRouter } from 'next/navigation';
import { Eyebrow } from '@/components/Eyebrow';
import { ParallaxImage } from '@/components/ParallaxImage';
import { ArrowRight } from '@/components/icons';
import { IMAGES } from '@/lib/data';

const STANDARDS = [
  'Restoration over renovation — original detail is preserved where it exists.',
  'A single resident manager per building, hired locally.',
  'Maintenance requests addressed within one business day.',
  'Long-term leases preferred; lease terms structured to incentivize stability.',
  'Annual building inspections by a heritage architect of record.',
  'No third-party leasing agents — we represent every residence directly.',
];

const FIGURES = [
  {
    n: '60+',
    label: 'YEARS STEWARDING',
    body: 'A single family, six decades, one continuous portfolio. The first building from 1964 is still under our care.',
  },
  {
    n: '12',
    label: 'RESIDENCES',
    body: 'Small by intent. We add a building every few years, not every quarter — each one held, never resold.',
  },
  {
    n: '3',
    label: 'CITIES',
    body: 'Saskatoon, Edmonton, Regina. A focused geography we know in detail — by street, by neighbourhood, by trade.',
  },
  {
    n: '100%',
    label: 'OPERATED IN-HOUSE',
    body: 'No third-party managers, no leasing agents. Every resident speaks with someone employed by Balto.',
  },
];

export default function AboutPage() {
  const router = useRouter();
  return (
    <main className="page-enter">
      <section
        className="section bg-cream"
        style={{
          paddingTop: 'clamp(80px, 12vw, 160px)',
          paddingBottom: 'clamp(80px, 12vw, 160px)',
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <Eyebrow style={{ marginBottom: 32 }}>ABOUT BALTO CAPITAL</Eyebrow>
          <div
            className="serif"
            style={{
              fontSize: 'clamp(5rem, 14vw, 13rem)',
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: '-0.01em',
            }}
          >
            <span className="italic">Est.</span> 1964.
          </div>
          <p
            className="body muted"
            style={{
              fontSize: 18,
              marginTop: 36,
              maxWidth: 540,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            A heritage portfolio of luxury residences in Saskatoon, Edmonton, and Regina — kept, restored, and operated by the same family for sixty years.
          </p>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.2fr',
              gap: 'clamp(40px, 7vw, 110px)',
              alignItems: 'center',
            }}
            className="grid-3-md1"
          >
            <div style={{ aspectRatio: '4 / 5', overflow: 'hidden' }}>
              <ParallaxImage
                src={IMAGES.heritage3}
                alt="Founder's first building"
                speed={0.12}
              />
            </div>
            <div>
              <Eyebrow style={{ marginBottom: 22 }}>OUR STORY</Eyebrow>
              <h2 className="h2 serif" style={{ marginBottom: 32 }}>
                One building. Then another.
              </h2>
              <p
                className="body"
                style={{ fontSize: 17, marginBottom: 22, maxWidth: 520 }}
              >
                Balto began in 1964 with a single fourplex on Saskatchewan Drive in Edmonton. The owner — a quiet operator who preferred to be known by his initials — bought it, restored it, and rented it to four families. He never sold it.
              </p>
              <p
                className="body muted"
                style={{
                  fontSize: 16,
                  lineHeight: 1.8,
                  maxWidth: 520,
                  marginBottom: 22,
                }}
              >
                Sixty years on, that building is still in the portfolio, and the same orientation still governs the work. We acquire residences slowly, restore them carefully, and operate them ourselves. Most of our residents have been with us for years — some for decades.
              </p>
              <p
                className="body muted"
                style={{ fontSize: 16, lineHeight: 1.8, maxWidth: 520 }}
              >
                The company is small. The portfolio is small. The standard is not.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.4fr',
              gap: 'clamp(40px, 6vw, 96px)',
            }}
            className="grid-3-md1"
          >
            <div>
              <Eyebrow style={{ marginBottom: 22 }}>OUR STANDARDS</Eyebrow>
              <h2 className="h2 serif">The way we operate.</h2>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {STANDARDS.map((s, i) => (
                <li
                  key={i}
                  style={{
                    padding: '24px 0',
                    borderBottom: '1px solid var(--hairline-strong)',
                    display: 'flex',
                    gap: 24,
                    fontSize: 17,
                    lineHeight: 1.55,
                  }}
                >
                  <span
                    className="serif italic"
                    style={{
                      color: 'var(--gold)',
                      flexShrink: 0,
                      fontSize: 18,
                      minWidth: 32,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

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
              <Eyebrow style={{ marginBottom: 22 }}>BY THE NUMBERS</Eyebrow>
              <h2 className="h2 serif">The shape of the practice.</h2>
            </div>
            <p
              className="body muted"
              style={{ maxWidth: 380, margin: 0 }}
            >
              Four figures that describe how Balto operates — and how it has, for the better part of a lifetime.
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'clamp(20px, 2.4vw, 36px)',
            }}
            className="grid-4-md2"
          >
            {FIGURES.map((f) => (
              <div
                key={f.n}
                data-reveal
                className="card"
                style={{
                  padding: 'clamp(28px, 2.4vw, 40px)',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 320,
                }}
              >
                <div
                  className="serif italic"
                  style={{
                    fontSize: 'clamp(3rem, 5vw, 4.25rem)',
                    color: 'var(--gold)',
                    lineHeight: 1,
                    fontWeight: 400,
                    marginBottom: 24,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {f.n}
                </div>
                <div
                  className="divider-gold"
                  style={{ width: 36, marginBottom: 22 }}
                />
                <Eyebrow style={{ marginBottom: 14 }}>{f.label}</Eyebrow>
                <p
                  className="small muted"
                  style={{ lineHeight: 1.65, margin: 0 }}
                >
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream" style={{ textAlign: 'center' }}>
        <div className="container-narrow">
          <Eyebrow style={{ marginBottom: 24 }}>INQUIRE</Eyebrow>
          <h2 className="h2 serif" style={{ marginBottom: 32 }}>
            Begin a conversation.
          </h2>
          <button
            className="btn btn-primary"
            onClick={() => router.push('/inquire')}
          >
            Contact our team <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </main>
  );
}
