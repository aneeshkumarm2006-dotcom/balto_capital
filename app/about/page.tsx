'use client';
import { useRouter } from 'next/navigation';
import { Eyebrow } from '@/components/Eyebrow';
import { ArrowRight } from '@/components/icons';

const STANDARDS = [
  'Restoration over renovation — original detail is preserved where it exists.',
  'A single resident manager per building, hired locally.',
  'Maintenance requests addressed within one business day.',
  'Long-term leases preferred; lease terms structured to incentivize stability.',
  'Regular building inspections and preventative maintenance.',
  'No third-party leasing agents — we represent every residence directly.',
];

const FIGURES = [
  {
    n: '2023',
    label: 'IN REAL ESTATE FINANCE',
    body: 'Balto began in 2023 as a private and mezzanine real estate lender — learning buildings from the capital side first.',
  },
  {
    n: '2025',
    label: 'DIRECT OWNERSHIP',
    body: 'In 2025 we moved into direct ownership — acquiring, renovating, and operating apartment communities ourselves.',
  },
  {
    n: '1,500+',
    label: 'DOORS, AND GROWING',
    body: 'Apartment homes across Western Canada, with local teams in every city — a portfolio that keeps growing.',
  },
  {
    n: '100%',
    label: 'OPERATED IN-HOUSE',
    body: 'No third-party managers, no leasing agents. Every resident speaks with someone at Balto.',
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
            <span className="italic">Est.</span> 2023.
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
            A private real estate lender since 2023, owner-operator since 2025 — today a growing portfolio of family-operated apartment homes across Western Canada.
          </p>
        </div>
      </section>

      <section className="section bg-ivory">
        <div
          className="container-narrow"
          style={{ textAlign: 'center', maxWidth: 720 }}
        >
          <Eyebrow style={{ marginBottom: 44, display: 'inline-block' }}>
            OUR STORY
          </Eyebrow>

          {/* Lead — manifesto in serif italic */}
          <p
            className="serif italic"
            style={{
              fontSize: 'clamp(1.4rem, 2.4vw, 1.95rem)',
              lineHeight: 1.4,
              color: 'var(--ink)',
              maxWidth: 660,
              margin: '0 auto',
              letterSpacing: '-0.005em',
            }}
          >
            At Balto Capital, we believe real estate is about more than buildings. It’s about creating spaces where people feel connected, supported, and inspired to grow.
          </p>

          {/* Gold divider */}
          <div
            style={{
              width: 44,
              height: 1,
              background: 'var(--gold)',
              opacity: 0.6,
              margin: 'clamp(48px, 6vw, 72px) auto',
            }}
          />
        </div>

        {/* Pull-quote cards — 2×2 grid */}
        <div
          className="container"
          style={{
            maxWidth: 1040,
            paddingLeft: 'clamp(20px, 5vw, 64px)',
            paddingRight: 'clamp(20px, 5vw, 64px)',
          }}
        >
          <div
            className="grid grid-residences"
            style={{
              gap: 'clamp(20px, 2.4vw, 32px)',
              textAlign: 'left',
            }}
          >
            {[
              {
                numeral: 'I',
                eyebrow: 'VISION',
                quote: 'Long-term value to the people and communities we serve.',
                body: 'From our foundation to where we are today, our vision continues to guide everything we do: to develop and invest in properties that bring long-term value to the people and communities we serve.',
              },
              {
                numeral: 'II',
                eyebrow: 'APPROACH',
                quote: 'Lasting impressions of comfort, opportunity, and trust.',
                body: 'We strive to create spaces that leave lasting impressions of comfort, opportunity, and trust. Whether residential, commercial, or mixed-use, each property is designed to be purposeful, welcoming, and future-focused.',
              },
              {
                numeral: 'III',
                eyebrow: 'STANDARD',
                quote: 'A standard of quality and service to rely on.',
                body: 'Across Western Canada, residents, partners, and communities benefit from a standard of quality and service they can rely on. Through thoughtful management, strategic investment, and strong relationships, we create environments where people want to live, work, and build their future.',
              },
              {
                numeral: 'IV',
                eyebrow: 'GROWTH',
                quote: 'Shaped by the needs of those we serve.',
                body: 'As we grow, our commitment to quality is shaped by the needs of those we serve. We listen, learn, and improve continuously. Guided by experience and community insight, we enhance every aspect of our work, from property development to daily service. Through each project, we aim to create spaces and opportunities with lasting impact. This is our purpose.',
              },
            ].map((c) => (
              <div
                key={c.numeral}
                className="card"
                style={{
                  padding: 'clamp(28px, 2.6vw, 44px)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  className="serif italic"
                  style={{
                    fontSize: 22,
                    color: 'var(--gold)',
                    letterSpacing: '0.02em',
                    marginBottom: 12,
                  }}
                >
                  {c.numeral}
                </div>
                <div
                  className="eyebrow"
                  style={{ marginBottom: 20 }}
                >
                  {c.eyebrow}
                </div>
                <p
                  className="serif"
                  style={{
                    fontSize: 'clamp(1.2rem, 1.4vw, 1.4rem)',
                    fontWeight: 500,
                    lineHeight: 1.35,
                    color: 'var(--ink)',
                    letterSpacing: '-0.005em',
                    margin: '0 0 24px',
                  }}
                >
                  &ldquo;{c.quote}&rdquo;
                </p>
                <div
                  style={{
                    width: 28,
                    height: 1,
                    background: 'var(--gold)',
                    opacity: 0.5,
                    marginBottom: 22,
                  }}
                />
                <p
                  style={{
                    fontSize: 14.5,
                    lineHeight: 1.8,
                    color: 'var(--muted)',
                    margin: 0,
                  }}
                >
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="container-narrow"
          style={{ textAlign: 'center', maxWidth: 720 }}
        >
          {/* Gold divider */}
          <div
            style={{
              width: 44,
              height: 1,
              background: 'var(--gold)',
              opacity: 0.6,
              margin: 'clamp(56px, 6vw, 72px) auto clamp(40px, 5vw, 56px)',
            }}
          />

          {/* Close — serif italic, smaller than the lead */}
          <p
            className="serif italic"
            style={{
              fontSize: 'clamp(1.1rem, 1.5vw, 1.3rem)',
              lineHeight: 1.55,
              color: 'var(--ink)',
              maxWidth: 580,
              margin: '0 auto',
            }}
          >
            Every day, we move forward together, making daily experiences more meaningful, collaborative, and inspiring. Our community is built on vision, partnership, and trust.
          </p>
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
              Four figures that describe how Balto came to be — and how it operates today.
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
