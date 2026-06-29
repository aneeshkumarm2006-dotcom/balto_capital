'use client';
import { useRouter } from 'next/navigation';

// TODO: real Resident Portal / Maintenance Request URLs pending from client.
const RESIDENT_PORTAL_URL = '#';
const MAINTENANCE_REQUEST_URL = '#';

export function Footer() {
  const router = useRouter();
  const go = (to: string) => router.push(to);
  return (
    <footer className="site-footer">
      <div className="inner">
        <div className="footer-grid">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/balto-logo-white.png"
              alt="Balto Capital"
              style={{
                height: 140,
                width: 'auto',
                display: 'block',
                marginBottom: 24,
              }}
            />
            <p
              style={{
                fontSize: 14,
                color: 'rgba(247,243,236,0.7)',
                lineHeight: 1.7,
                maxWidth: 320,
                margin: 0,
              }}
            >
              Apartment homes owned and operated across Western Canada — kept and cared for by the same family team that answers your call.
            </p>
          </div>
          <div>
            <h4>Residences</h4>
            <ul>
              <li><a onClick={() => go('/residences/saskatoon')}>Saskatoon</a></li>
              <li><a onClick={() => go('/residences/edmonton')}>Edmonton</a></li>
              <li><a onClick={() => go('/residences/regina')}>Regina</a></li>
              <li><a onClick={() => go('/residences/yellowknife')}>Yellowknife · Coming soon</a></li>
              <li><a onClick={() => go('/residences')}>All residences</a></li>
            </ul>
          </div>
          <div>
            <h4>Residents</h4>
            <ul>
              <li><a href={RESIDENT_PORTAL_URL}>Resident Portal</a></li>
              <li><a href={MAINTENANCE_REQUEST_URL}>Maintenance Request</a></li>
            </ul>
            <h4 style={{ marginTop: 24 }}>Company</h4>
            <ul>
              <li><a onClick={() => go('/why-balto')}>Why Balto</a></li>
              <li><a onClick={() => go('/about')}>About</a></li>
              <li><a onClick={() => go('/careers')}>Careers</a></li>
              <li><a onClick={() => go('/inquire')}>Inquire</a></li>
            </ul>
          </div>
          <div>
            <h4>Connect</h4>
            <ul>
              <li>
                <a
                  href="https://www.facebook.com/p/Balto-Capital-61583216199874/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/baltocapital/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://ca.linkedin.com/company/balto-capital-inc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
            <div style={{ marginTop: 24 }}>
              <h4 style={{ marginBottom: 10 }}>Inquiries</h4>
              <div style={{ fontSize: 14, color: 'rgba(247,243,236,0.7)' }}>
                inquire@baltocapital.com
              </div>
              <div style={{ fontSize: 14, color: 'rgba(247,243,236,0.7)' }}>
                +1 587-207-5171
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 Balto Capital. All rights reserved.</div>
          <div>Privacy · Terms · Accessibility</div>
        </div>
      </div>
    </footer>
  );
}
