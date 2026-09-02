'use client';
import { Eyebrow } from '@/components/Eyebrow';
import { ArrowRight, HomeIcon } from '@/components/icons';
import { TENANT_PORTAL } from '@/lib/pages';

/* Resident sign-in hub. Entries come from content/tenant-portal.json, which the
   client maintains in Content Studio — adding a building here is a CMS edit,
   not a deploy. */
export default function TenantPortalPage() {
  const { eyebrow, title, intro, entries } = TENANT_PORTAL;

  return (
    <main className="page-enter">
      <section className="section">
        <div className="container-narrow">
          <Eyebrow style={{ marginBottom: 18 }}>{eyebrow}</Eyebrow>
          <h1 className="h1 serif" style={{ marginBottom: 16 }}>
            {title}
          </h1>
          <p
            className="body muted"
            style={{ maxWidth: 620, marginBottom: 48, fontSize: 17 }}
          >
            {intro}
          </p>

          {entries.length === 0 ? (
            <p className="body muted">
              Resident portals are being set up. Please contact your building
              manager in the meantime.
            </p>
          ) : (
            <div className="tenant-portal-list">
              {entries.map((e) => (
                <a
                  key={e.id}
                  className="tenant-portal-row"
                  href={e.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="tenant-portal-icon" aria-hidden>
                    <HomeIcon size={18} />
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="h3 serif tenant-portal-label">{e.label}</span>
                    <span className="small muted tenant-portal-address">
                      {e.address}
                    </span>
                  </span>
                  <span className="small tenant-portal-cta">
                    Sign in <ArrowRight size={14} />
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
