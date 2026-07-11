'use client';
import { useRouter } from 'next/navigation';
import { Eyebrow } from '@/components/Eyebrow';
import { SmartImage } from '@/components/SmartImage';
import { ParallaxImage } from '@/components/ParallaxImage';
import { ArrowRight } from '@/components/icons';
import { PAGES } from '@/lib/pages';

// Layout only — copy for each pillar lives in content/pages.json (whyBalto.pillars).
const PILLAR_ALIGNS = ['left', 'right', 'left'] as const;
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
          <Eyebrow color="gold" style={{ marginBottom: 24 }}>{PAGES.whyBalto.hero.eyebrow}</Eyebrow>
          <h1 className="display" style={{ color: 'var(--ivory)', maxWidth: 900 }}>
            {PAGES.whyBalto.hero.title}
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
                &ldquo;{PAGES.whyBalto.intro.pullQuote}&rdquo;
              </p>
              <p
                className="caption muted"
                style={{ marginTop: 24, letterSpacing: '0.1em' }}
              >
                {PAGES.whyBalto.intro.attribution}
              </p>
            </div>
            <div>
              <p
                className="body"
                style={{ fontSize: 17, marginBottom: 24, maxWidth: 580 }}
              >
                {PAGES.whyBalto.intro.paragraph1}
              </p>
              <p
                className="body muted"
                style={{ fontSize: 16, lineHeight: 1.8, maxWidth: 580 }}
              >
                {PAGES.whyBalto.intro.paragraph2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {PAGES.whyBalto.pillars.map((p, i) => (
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
                direction: PILLAR_ALIGNS[i] === 'right' ? 'rtl' : 'ltr',
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
                <h2
                  className="h2 serif"
                  style={{ marginBottom: 28, fontVariantNumeric: 'lining-nums', fontFeatureSettings: '"lnum" 1' }}
                >
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
            {PAGES.whyBalto.stats.map((s) => (
              <div key={s.value}>
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
                  {s.value}
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
            {PAGES.whyBalto.cta.title}
          </h2>
          <button
            className="btn btn-primary"
            onClick={() => router.push('/residences')}
          >
            {PAGES.whyBalto.cta.buttonLabel} <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </main>
  );
}
