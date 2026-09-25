import Link from 'next/link';
import { Eyebrow } from '@/components/Eyebrow';
import { ArrowRight } from '@/components/icons';

/* Shown for unknown cities and residences, which now answer a real 404 rather
   than bouncing to /residences under a 200. Without this the visitor would get
   Next's unstyled default, with no header, footer or way back into the site. */
export default function NotFound() {
  return (
    <main className="page-enter">
      <section className="section">
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <Eyebrow style={{ marginBottom: 18 }}>404</Eyebrow>
          <h1 className="h1 serif" style={{ marginBottom: 16 }}>
            We couldn&apos;t find that page.
          </h1>
          <p
            className="body muted"
            style={{ maxWidth: 520, margin: '0 auto 40px', fontSize: 17 }}
          >
            The residence or city you&apos;re looking for may have been renamed
            or is no longer listed. Browse everything currently available below.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 14,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link className="btn btn-primary" href="/residences">
              View all residences <ArrowRight size={14} />
            </Link>
            <Link className="btn btn-ghost" href="/">
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
