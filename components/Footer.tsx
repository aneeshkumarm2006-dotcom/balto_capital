'use client';
import { usePathname, useRouter } from 'next/navigation';
import { NAV_CITIES } from '@/lib/data';
import { SETTINGS } from '@/lib/settings';
import { SITE } from '@/lib/site';

/* Resident Portal + Maintenance Request are per-building (ZenRentals); the
   site-wide destinations now live in content/site.json and default to the
   residence list, where each property has its own buttons.

   Connect entries name a social account by key so the profile URLs stay owned
   by content/settings.json and are edited in exactly one place. */
const SOCIAL: Record<string, string> = SETTINGS.social;

export function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const go = (to: string) => router.push(to);
  // The CMS portal has its own chrome — no public site footer there.
  if (pathname.startsWith('/admin')) return null;
  return (
    <footer className="site-footer">
      <div className="inner">
        <div className="footer-grid">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SITE.brand.logoFooter}
              alt={SITE.brand.logoAlt}
              style={{
                height: 88,
                width: 'auto',
                display: 'block',
                marginBottom: 16,
              }}
            />
            <p
              style={{
                fontSize: 14,
                color: 'rgb(var(--ivory-rgb) / 0.7)',
                lineHeight: 1.7,
                maxWidth: 320,
                margin: 0,
              }}
            >
              {SITE.footer.blurb}
            </p>
          </div>
          <div>
            <h4>{SITE.footer.columns.residences.heading}</h4>
            <ul>
              {NAV_CITIES.map((c) => (
                <li key={c.slug}>
                  <a onClick={() => go(`/residences/${c.slug}`)}>
                    {c.label}
                    {c.comingSoon && SITE.footer.columns.residences.comingSoonSuffix}
                  </a>
                </li>
              ))}
              {SITE.footer.columns.residences.links.map((l) => (
                <li key={l.label}><a onClick={() => go(l.href)}>{l.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>{SITE.footer.columns.residents.heading}</h4>
            <ul>
              {SITE.footer.columns.residents.links.map((l) => (
                <li key={l.label}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
            <h4 style={{ marginTop: 24 }}>{SITE.footer.columns.company.heading}</h4>
            <ul>
              {SITE.footer.columns.company.links.map((l) => (
                <li key={l.label}><a onClick={() => go(l.href)}>{l.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>{SITE.footer.columns.connect.heading}</h4>
            <ul>
              {SITE.footer.columns.connect.links.map((l) => (
                <li key={l.social}>
                  <a
                    href={SOCIAL[l.social]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 24 }}>
              <h4 style={{ marginBottom: 10 }}>{SITE.footer.inquiries.heading}</h4>
              <div style={{ fontSize: 14, color: 'rgb(var(--ivory-rgb) / 0.7)' }}>
                {SETTINGS.contactEmail}
              </div>
              <div style={{ fontSize: 14, color: 'rgb(var(--ivory-rgb) / 0.7)' }}>
                {SETTINGS.contactPhone}
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div>{SITE.footer.copyright}</div>
          <div>{SITE.footer.legal.labels.join(SITE.footer.legal.separator)}</div>
        </div>
      </div>
    </footer>
  );
}
