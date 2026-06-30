'use client';
import { useRouter } from 'next/navigation';
import { Eyebrow } from '@/components/Eyebrow';
import { ArrowRight } from '@/components/icons';

// NOTE: Benefits + culture copy mirror the Delmar Cargo careers structure,
// adapted to Balto's voice. Confirm the specific benefits with the client
// before launch. Openings message + resume inbox are placeholders.
const CAREERS_EMAIL = 'inquire@baltocapital.com';

const BENEFITS = [
  'Health and dental benefits',
  'Paid time off and statutory holidays',
  'Education and training support',
  'Cross-training across the portfolio',
  'Internal promotion opportunities',
  'A close-knit, family-operated team',
];

export default function CareersPage() {
  const router = useRouter();
  return (
    <main className="page-enter">
      {/* 01 · Hero */}
      <section
        className="section bg-cream"
        style={{
          paddingTop: 'clamp(72px, 10vw, 140px)',
          paddingBottom: 'clamp(56px, 8vw, 96px)',
          textAlign: 'center',
        }}
      >
        <div className="container-narrow" style={{ maxWidth: 760 }}>
          <Eyebrow style={{ marginBottom: 28 }}>CAREERS</Eyebrow>
          <h1
            className="serif"
            style={{
              fontSize: 'clamp(2.6rem, 6vw, 4.6rem)',
              fontWeight: 400,
              lineHeight: 1.02,
              letterSpacing: '-0.01em',
              marginBottom: 28,
            }}
          >
            Grow your career where ambition meets opportunity.
          </h1>
          <p
            className="body muted"
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              maxWidth: 600,
              margin: '0 auto',
            }}
          >
            Start or grow your career with Balto Capital, a family-operated
            owner and operator of apartment communities across Western Canada.
            We invest in our buildings and in the people who care for them.
          </p>
        </div>
      </section>

      {/* 02 · Career centre, current openings */}
      <section className="section bg-ivory" style={{ textAlign: 'center' }}>
        <div className="container-narrow" style={{ maxWidth: 680 }}>
          <Eyebrow style={{ marginBottom: 22 }}>CAREER CENTRE</Eyebrow>
          <h2 className="h2 serif" style={{ marginBottom: 28 }}>
            Current openings.
          </h2>
          <div
            style={{
              padding: 'clamp(36px, 5vw, 56px)',
              background: 'var(--cream)',
              border: '1px solid var(--hairline)',
            }}
          >
            <p className="serif italic" style={{ fontSize: 20, lineHeight: 1.5, margin: 0 }}>
              There are currently no job openings available. Please check back
              soon.
            </p>
          </div>
          <p className="body muted" style={{ fontSize: 16, marginTop: 32, lineHeight: 1.7 }}>
            We&rsquo;re always glad to hear from talented people. To introduce
            yourself, email us at{' '}
            <a className="text-link" href={`mailto:${CAREERS_EMAIL}`}>
              {CAREERS_EMAIL}
            </a>
            .
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: 28 }}
            onClick={() => router.push('/inquire')}
          >
            Contact our team <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* 03 · Key benefits */}
      <section className="section bg-cream">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <Eyebrow style={{ marginBottom: 18 }}>KEY BENEFITS</Eyebrow>
            <h2 className="h2 serif">What we offer.</h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'clamp(16px, 2vw, 28px)',
              maxWidth: 1000,
              margin: '0 auto',
            }}
            className="grid-4-md2"
          >
            {BENEFITS.map((b, i) => (
              <div
                key={b}
                className="card"
                style={{
                  padding: 'clamp(24px, 2.4vw, 36px)',
                  display: 'flex',
                  gap: 18,
                  alignItems: 'baseline',
                }}
              >
                <span
                  className="serif italic"
                  style={{ color: 'var(--gold)', fontSize: 18, minWidth: 28, flexShrink: 0 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: 16, lineHeight: 1.5 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
