'use client';
import { useRouter } from 'next/navigation';
import { Eyebrow } from '@/components/Eyebrow';
import { SmartImage } from '@/components/SmartImage';
import { ParallaxImage } from '@/components/ParallaxImage';
import { ArrowRight } from '@/components/icons';
import { IMAGES } from '@/lib/data';

const PILLARS = [
  {
    eyebrow: 'I — HERITAGE',
    title: 'A portfolio built one residence at a time.',
    body: 'Sixty years ago, Balto began with a single building. We are still operated by the same family, and we still buy slowly. Every residence in the portfolio has been kept — never flipped, never refinanced into anonymity.',
    align: 'left' as const,
  },
  {
    eyebrow: 'II — CURATION',
    title: 'Selected with intent. Restored, not renovated.',
    body: 'We acquire residences that already have something to offer: a façade worth preserving, a floor plan worth keeping, a neighbourhood worth living in. Our work is to remove what was added in error and reinstate what was original. The result is a building that feels older and newer at once.',
    align: 'right' as const,
  },
  {
    eyebrow: 'III — SERVICE',
    title: 'Concierge-level care. One person who knows your name.',
    body: 'A single resident manager lives in each building. Maintenance requests are answered the same day. Mail is signed for. The lobby is kept like a library. It is the kind of service that used to be standard, and is now rare.',
    align: 'left' as const,
  },
];

const PILLAR_IMAGES = [IMAGES.heritage2, IMAGES.detail_door, IMAGES.int_living1];
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
          src={IMAGES.heritage1}
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
                &ldquo;We did not build a portfolio. We kept one — for sixty years, and counting.&rdquo;
              </p>
              <p
                className="caption muted"
                style={{ marginTop: 24, letterSpacing: '0.1em' }}
              >
                — FROM THE FOUNDER&apos;S NOTES, 1968
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
                That orientation produces a different kind of building. Quieter lobbies. Better-considered finishes. A standing relationship with the trades who maintain the property. And a portfolio that grows by a building or two each decade, never more.
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
                  alt={`${p.eyebrow} — imagery`}
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
              { n: '60+', label: 'Years stewarding the portfolio' },
              { n: '3', label: 'Cities across Western Canada' },
              { n: '24/7', label: 'Concierge & maintenance' },
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
