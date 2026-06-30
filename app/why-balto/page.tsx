'use client';
import { useRouter } from 'next/navigation';
import { Eyebrow } from '@/components/Eyebrow';
import { SmartImage } from '@/components/SmartImage';
import { ParallaxImage } from '@/components/ParallaxImage';
import { ArrowRight } from '@/components/icons';

const PILLARS = [
  {
    eyebrow: 'I · OWNERSHIP',
    title: 'We own what we manage.',
    body: 'Balto is run by a brother-and-sister team that owns the buildings outright, no third-party manager between you and your home. The people who answer your call are the people who own the building. It is our single biggest difference.',
    align: 'left' as const,
  },
  {
    eyebrow: 'II · RENOVATION',
    title: 'Renovated, updated, and secured.',
    body: 'We buy buildings to keep them, then invest in them: modernized suites, refreshed kitchens and baths, and upgraded building security. Most of the portfolio is value-add, older buildings brought up to a standard worth staying in for years.',
    align: 'right' as const,
  },
  {
    eyebrow: 'III · SERVICE',
    title: 'One business day. Local in every city.',
    body: 'Maintenance requests are answered within one business day, by a local team in your city, not a call centre two provinces away. Many of our residences are pet-friendly. It is the kind of service that used to be standard, and is now rare.',
    align: 'left' as const,
  },
];

const PILLAR_IMAGES = ['/assets/city-saskatoon.png', '/assets/city-edmonton.png', '/assets/city-yellowknife.avif'];
const PILLAR_TONES = ['warm', 'cool', 'deep'] as const;
const PILLAR_CHARS = ['I', 'II', 'III'];

export default function WhyBaltoPage() {
  const router = useRouter();
  return (
    <main className="page-enter">
      <section
        style={{
          position: 'relative',
          height: 'min(64vh, 620px)',
          minHeight: 420,
          overflow: 'hidden',
        }}
      >
        <ParallaxImage
          src="/assets/city-regina.png"
          alt="Heritage architecture"
          kenBurns
          eager
          speed={0.15}
          style={{ position: 'absolute', inset: 0 }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(10,25,41,0.4), rgba(10,25,41,0.55))',
          }}
        />
        <div
          style={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: 'clamp(40px, 8vw, 96px) clamp(20px, 5vw, 96px)',
            color: 'var(--ivory)',
          }}
        >
          <Eyebrow color="gold" style={{ marginBottom: 24 }}>WHY BALTO</Eyebrow>
          <h1 className="display" style={{ color: 'var(--ivory)', maxWidth: 900 }}>
            A different kind of landlord.
          </h1>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.2fr',
              gap: 'clamp(40px, 7vw, 110px)',
            }}
            className="grid-3-md1"
          >
            <div>
              <p
                className="serif italic"
                style={{
                  fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
                  lineHeight: 1.35,
                  color: 'var(--ink)',
                  maxWidth: 460,
                }}
              >
                &ldquo;We buy buildings to keep them, which is why we treat every resident as a long-term relationship, not a transaction.&rdquo;
              </p>
              <p
                className="caption muted"
                style={{ marginTop: 24, letterSpacing: '0.1em' }}
              >
                THE BALTO FAMILY
              </p>
            </div>
            <div>
              <p
                className="body"
                style={{ fontSize: 17, marginBottom: 24, maxWidth: 580 }}
              >
                Most residential real estate is built to sell. The market measures buildings by turnover, units by yield, neighbourhoods by appreciation. Balto Capital does none of that. We measure our work in the number of residents who renew their lease without thinking about it.
              </p>
              <p
                className="body muted"
                style={{ fontSize: 16, lineHeight: 1.8, maxWidth: 580 }}
              >
                Balto began in 2023 as a private and mezzanine real estate lender, and moved into direct ownership in 2025. Today the portfolio is more than 1,500 doors across Western Canada, and growing, every one of them owned, renovated, and operated in-house.
              </p>
            </div>
          </div>
        </div>
      </section>

      {PILLARS.map((p, i) => (
        <section
          key={i}
          className="section"
          style={{ background: i % 2 === 0 ? 'var(--cream)' : 'var(--ivory)' }}
        >
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'clamp(40px, 7vw, 110px)',
                alignItems: 'center',
                direction: p.align === 'right' ? 'rtl' : 'ltr',
              }}
              className="grid-3-md1"
            >
              <div
                style={{
                  direction: 'ltr',
                  aspectRatio: '4 / 5',
                  overflow: 'hidden',
                }}
              >
                <SmartImage
                  src={PILLAR_IMAGES[i]}
                  alt={`${p.eyebrow}, imagery`}
                  fallbackLabel={`Pillar ${i + 1} · imagery`}
                  fallbackTone={PILLAR_TONES[i]}
                  fallbackChar={PILLAR_CHARS[i]}
                />
              </div>
              <div style={{ direction: 'ltr' }}>
                <Eyebrow style={{ marginBottom: 22 }}>{p.eyebrow}</Eyebrow>
                <h2 className="h2 serif" style={{ marginBottom: 28 }}>
                  {p.title}
                </h2>
                <p
                  className="body muted"
                  style={{ fontSize: 17, maxWidth: 480 }}
                >
                  {p.body}
                </p>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="section bg-ink" style={{ textAlign: 'center' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'clamp(40px, 6vw, 96px)',
            }}
            className="grid-3-md1"
          >
            {[
              { n: '1,500+', label: 'Doors across Western Canada' },
              { n: '1 day', label: 'Maintenance response standard' },
              { n: '100%', label: 'Owned & operated in-house' },
            ].map((s) => (
              <div key={s.n}>
                <div
                  className="serif"
                  style={{
                    fontSize: 'clamp(4rem, 8vw, 6.5rem)',
                    color: 'var(--gold)',
                    lineHeight: 1,
                    fontWeight: 400,
                    marginBottom: 24,
                  }}
                >
                  {s.n}
                </div>
                <Eyebrow style={{ color: 'rgba(247,243,236,0.7)' }}>
                  {s.label}
                </Eyebrow>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ivory" style={{ textAlign: 'center' }}>
        <div className="container-narrow">
          <h2 className="h2 serif" style={{ marginBottom: 36 }}>
            Discover our residences.
          </h2>
          <button
            className="btn btn-primary"
            onClick={() => router.push('/residences')}
          >
            View the portfolio <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </main>
  );
}
