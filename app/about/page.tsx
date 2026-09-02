'use client';
import { useRouter } from 'next/navigation';
import { Eyebrow } from '@/components/Eyebrow';
import { ArrowRight } from '@/components/icons';
import { PAGES } from '@/lib/pages';

export default function AboutPage() {
  const router = useRouter();
  return (
    <main className="page-enter has-overlay-hero">
      {/* The film runs the full screen, edge to edge and behind the navigation;
          everything else on the page is set over it in a single centred column. */}
      <section className="about-hero">
        <video
          className="about-hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={PAGES.about.hero.image}
        >
          <source src="/video/about-bg.mp4" type="video/mp4" />
        </video>
        <div className="about-hero-scrim" />
        <div className="container about-hero-copy">
          <Eyebrow
            color="ivory"
            className="hero-rise"
            style={{ ['--rise-delay' as string]: '160ms', marginBottom: 32 }}
          >
            {PAGES.about.hero.eyebrow}
          </Eyebrow>
          <div
            className="serif about-hero-title hero-rise"
            style={{ ['--rise-delay' as string]: '300ms' }}
          >
            <span className="italic">{PAGES.about.hero.titleItalic}</span>{' '}
            {PAGES.about.hero.titleRest}
          </div>
          <p
            className="body about-hero-sub hero-rise"
            style={{ ['--rise-delay' as string]: '460ms' }}
          >
            {PAGES.about.hero.subtitle}
          </p>
        </div>
        <div
          className="about-hero-cue hero-rise"
          style={{ ['--rise-delay' as string]: '900ms' }}
          aria-hidden="true"
        >
          <span className="eyebrow">Scroll</span>
          <span className="line" />
        </div>
      </section>

      <section className="section bg-ivory">
        <div
          className="container-narrow"
          style={{ textAlign: 'center', maxWidth: 720 }}
        >
          <Eyebrow style={{ marginBottom: 44, display: 'inline-block' }}>
            {PAGES.about.story.eyebrow}
          </Eyebrow>

          {/* Lead, manifesto in serif italic */}
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
            {PAGES.about.story.lead}
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

        {/* Pull-quote cards, 2×2 grid */}
        <div
          className="container"
          style={{
            maxWidth: 1040,
            paddingLeft: 'clamp(20px, 5vw, 64px)',
            paddingRight: 'clamp(20px, 5vw, 64px)',
          }}
        >
          <div
            className="grid-2up"
            style={{
              gap: 'clamp(20px, 2.4vw, 32px)',
              textAlign: 'left',
            }}
          >
            {PAGES.about.story.cards.map((c) => (
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

          {/* Close, serif italic, smaller than the lead */}
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
            {PAGES.about.story.close}
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
              <Eyebrow style={{ marginBottom: 22 }}>{PAGES.about.standards.eyebrow}</Eyebrow>
              <h2 className="h2 serif">{PAGES.about.standards.title}</h2>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {PAGES.about.standards.items.map((s, i) => (
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
              <Eyebrow style={{ marginBottom: 22 }}>{PAGES.about.figures.eyebrow}</Eyebrow>
              <h2 className="h2 serif">{PAGES.about.figures.title}</h2>
            </div>
            <p
              className="body muted"
              style={{ maxWidth: 380, margin: 0 }}
            >
              {PAGES.about.figures.blurb}
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
            {PAGES.about.figures.items.map((f) => (
              <div
                key={f.value}
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
                  {f.value}
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
          <Eyebrow style={{ marginBottom: 24 }}>{PAGES.about.cta.eyebrow}</Eyebrow>
          <h2 className="h2 serif" style={{ marginBottom: 32 }}>
            {PAGES.about.cta.title}
          </h2>
          <button
            className="btn btn-primary"
            onClick={() => router.push('/inquire')}
          >
            {PAGES.about.cta.buttonLabel} <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </main>
  );
}
