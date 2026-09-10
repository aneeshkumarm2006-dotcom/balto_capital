'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { useFavorites } from './FavoritesContext';
import {
  HeartIcon,
  MenuIcon,
  CloseIcon,
  ChevronDown,
  ChevronRight,
  HomeIcon,
} from './icons';
import { CITIES, NAV_CITIES } from '@/lib/data';
import { PAGES, TENANT_PORTAL } from '@/lib/pages';
import { SITE } from '@/lib/site';


/* Routes whose first section is a full-bleed film that runs edge to edge —
   the header sits over it, transparent, until the visitor scrolls past. */
const OVERLAY_HERO_ROUTES = ['/', '/about', '/why-balto'];

/* Navigation labels and destinations come from content/site.json. The entries
   are looked up by key rather than mapped over, because each one has its own
   layout — the city dropdown, the careers dropdown, a placeholder that is not
   a link, and plain links — and the markup for those is not interchangeable. */
interface NavEntry {
  key: string;
  label: string;
  href: string;
}

/* The header is chrome on every page, so a content edit must never be able to
   take it down. If a key is renamed or deleted in Content Studio the lookup
   falls back to a blank entry instead of throwing on `NAV.<key>.label` and
   losing the navigation site-wide. */
const NAV: Record<string, NavEntry> = new Proxy(
  Object.fromEntries(SITE.header.nav.map((n) => [n.key, n])) as Record<string, NavEntry>,
  {
    get: (target, prop: string) =>
      target[prop] ?? { key: prop, label: '', href: '' },
  }
);

/* Portfolio city listings open on the same kind of full-screen cover, so the
   bar has to go transparent over those too. Read from the city config rather
   than a hard-coded list, so a market switched to the portfolio layout in the
   Content Studio picks the treatment up on its own. */
function isOverlayHeroRoute(pathname: string): boolean {
  if (OVERLAY_HERO_ROUTES.includes(pathname)) return true;
  const m = /^\/residences\/([^/]+)\/?$/.exec(pathname);
  return Boolean(m && CITIES[m[1]]?.portfolioLayout);
}

export function Header() {
  const pathname = usePathname();
  const { count } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [careersOpen, setCareersOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setPortalOpen(false);
  }, [pathname]);

  /* The tenant-portal panel is a click-to-open list, not a hover dropdown —
     residents read down it and pick their building, so it has to stay put. */
  useEffect(() => {
    if (!portalOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!portalRef.current?.contains(e.target as Node)) setPortalOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPortalOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [portalOpen]);

  const overlayHero = isOverlayHeroRoute(pathname);

  /* The bar fills in as soon as the page moves. Over a full-bleed hero it is
     transparent only while the visitor is still at the very top — waiting for
     most of the first screen left the navigation floating over the hero type
     for the whole scroll, which is what read as broken. */
  useEffect(() => {
    const onScroll = () => {
      const threshold = overlayHero ? 64 : 24;
      setScrolled(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [overlayHero]);

  /* Ivory type whenever the bar is dark behind it — over the film at the top
     of an overlay hero, and on the navy band once the page has scrolled. */
  const onDark = overlayHero || scrolled;

  /* A blank prefix means the CMS entry has no destination (a placeholder, or a
     link the client cleared). Without the guard '' matches every route, because
     every path starts with '/', and the whole nav would light up as active. */
  const isActive = (prefix: string) =>
    prefix !== '' && (pathname === prefix || pathname.startsWith(prefix + '/'));

  // The CMS portal has its own chrome — no public site header there.
  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      <header
        className={
          'site-header' +
          (overlayHero ? ' overlay' : '') +
          (scrolled ? ' scrolled' : '')
        }
      >
        <div className="inner">
          <div className="brand-mark">
            <Logo variant={onDark ? 'dark' : 'light'} height={80} />
          </div>

          <nav className="nav" aria-label={SITE.header.navAriaLabel}>
            <div
              className={'nav-item has-dropdown ' + (isActive(NAV.properties.href) ? 'active' : '')}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Link
                href={NAV.properties.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'inherit',
                }}
              >
                {NAV.properties.label} <ChevronDown size={14} />
              </Link>
              <div
                className="dropdown"
                style={{
                  opacity: dropdownOpen ? 1 : undefined,
                  pointerEvents: dropdownOpen ? 'auto' : undefined,
                }}
              >
                {NAV_CITIES.map((c) => (
                  <Link
                    key={c.slug}
                    className="dropdown-item"
                    href={`/residences/${c.slug}`}
                  >
                    {c.label}
                    {c.comingSoon && (
                      <span style={{ color: 'var(--muted)', fontSize: 11 }}>
                        {SITE.header.propertiesMenu.comingSoonSuffix}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
            {/* Company has no landing page of its own — the tab is only a way
                into About and Why Balto, so the trigger is a button rather than
                a link, and it carries the active mark while either child is
                the current page. Click toggles it for touch and keyboard;
                hover opens it the way the other menus do. */}
            <div
              className={
                'nav-item has-dropdown ' +
                (isActive(NAV.about.href) || isActive(NAV.whyBalto.href) ? 'active' : '')
              }
              onMouseEnter={() => setCompanyOpen(true)}
              onMouseLeave={() => setCompanyOpen(false)}
            >
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={companyOpen}
                onClick={() => setCompanyOpen((o) => !o)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'inherit',
                  font: 'inherit',
                  letterSpacing: 'inherit',
                  background: 'transparent',
                  border: 0,
                  padding: 0,
                }}
              >
                {NAV.company.label} <ChevronDown size={14} />
              </button>
              <div
                className="dropdown"
                style={{
                  opacity: companyOpen ? 1 : undefined,
                  pointerEvents: companyOpen ? 'auto' : undefined,
                }}
              >
                <Link className="dropdown-item" href={NAV.about.href}>
                  {NAV.about.label}
                </Link>
                <Link className="dropdown-item" href={NAV.whyBalto.href}>
                  {NAV.whyBalto.label}
                </Link>
              </div>
            </div>
            {/* Placeholder, destination pending client direction on content. */}
            <span className="nav-item" aria-disabled="true" style={{ cursor: 'default' }}>
              {NAV.team.label}
            </span>
            {/* Placeholder, destination pending client direction on content. */}
            <span className="nav-item" aria-disabled="true" style={{ cursor: 'default' }}>
              {NAV.community.label}
            </span>
            <div
              className={'nav-item has-dropdown ' + (isActive(NAV.careers.href) ? 'active' : '')}
              onMouseEnter={() => setCareersOpen(true)}
              onMouseLeave={() => setCareersOpen(false)}
            >
              <Link
                href={NAV.careers.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'inherit',
                }}
              >
                {NAV.careers.label} <ChevronDown size={14} />
              </Link>
              <div
                className="dropdown"
                style={{
                  opacity: careersOpen ? 1 : undefined,
                  pointerEvents: careersOpen ? 'auto' : undefined,
                  width: 260,
                }}
              >
                <div
                  style={{
                    padding: '14px 18px',
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: 'var(--muted)',
                  }}
                >
                  {PAGES.careers.openings.noOpeningsMessage}
                </div>
              </div>
            </div>
            <Link
              href={NAV.contact.href}
              className={'nav-item ' + (isActive(NAV.contact.href) ? 'active' : '')}
            >
              {NAV.contact.label}
            </Link>
          </nav>

          <div className="nav-right">
            <Link
              href={SITE.header.favorites.href}
              className="favorites-link"
              aria-label={SITE.header.favorites.ariaLabel.replace('{count}', String(count))}
            >
              <HeartIcon
                filled={count > 0}
                size={20}
                style={{
                  color:
                    count > 0
                      ? 'var(--gold)'
                      : onDark
                      ? 'var(--ivory)'
                      : 'var(--ink)',
                }}
              />
              <span className="favorites-count">{count}</span>
            </Link>
            <div className="tenant-portal-nav" ref={portalRef}>
              <button
                type="button"
                className="tenant-portal-link"
                aria-label={SITE.header.tenantPortal.ariaLabel}
                aria-haspopup="true"
                aria-expanded={portalOpen}
                onClick={() => setPortalOpen((o) => !o)}
                style={{
                  color: onDark ? 'var(--ivory)' : 'var(--ink)',
                  background: 'transparent',
                  border: 0,
                  padding: 0,
                }}
              >
                <HomeIcon size={18} />
                <span className="tenant-portal-link-text">{SITE.header.tenantPortal.label}</span>
                <ChevronDown
                  size={12}
                  style={{
                    transition: 'transform 220ms var(--ease)',
                    transform: portalOpen ? 'rotate(180deg)' : 'none',
                  }}
                />
              </button>

              <div
                className={'tenant-portal-menu' + (portalOpen ? ' open' : '')}
                role="menu"
                aria-hidden={!portalOpen}
              >
                <div className="tenant-portal-menu-head eyebrow">
                  {TENANT_PORTAL.eyebrow}
                </div>
                {TENANT_PORTAL.entries.length === 0 ? (
                  <p className="tenant-portal-menu-empty small muted">
                    {TENANT_PORTAL.emptyMessage}
                  </p>
                ) : (
                  TENANT_PORTAL.entries.map((e) => (
                    <a
                      key={e.id}
                      role="menuitem"
                      className="tenant-portal-menu-item"
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setPortalOpen(false)}
                    >
                      <span className="tenant-portal-menu-icon" aria-hidden>
                        <HomeIcon size={14} />
                      </span>
                      <span className="tenant-portal-menu-text">
                        <span className="tenant-portal-menu-label serif">
                          {e.label}
                        </span>
                        <span className="tenant-portal-menu-address">
                          {e.address}
                        </span>
                      </span>
                      <ChevronRight size={13} />
                    </a>
                  ))
                )}
                <Link
                  href={SITE.header.tenantPortal.allHref}
                  className="tenant-portal-menu-all"
                  onClick={() => setPortalOpen(false)}
                >
                  {TENANT_PORTAL.allPortalsLabel} <ChevronRight size={12} />
                </Link>
              </div>
            </div>
            <button
              className="menu-trigger"
              aria-label={SITE.header.mobile.openLabel}
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon size={22} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={'mobile-backdrop' + (menuOpen ? ' open' : '')}
        onClick={() => setMenuOpen(false)}
      />
      <aside
        className={'mobile-menu' + (menuOpen ? ' open' : '')}
        aria-hidden={!menuOpen}
      >
        <div className="close-row">
          <button
            aria-label={SITE.header.mobile.closeLabel}
            onClick={() => setMenuOpen(false)}
            style={{ background: 'transparent', border: 0 }}
          >
            <CloseIcon size={22} />
          </button>
        </div>
        <nav>
          <Link href={NAV.properties.href}>{NAV.properties.label}</Link>
          {NAV_CITIES.map((c) => (
            <Link key={c.slug} className="sub" href={`/residences/${c.slug}`}>
              {c.label}
              {c.comingSoon && SITE.header.mobile.comingSoonSuffix}
            </Link>
          ))}
          <span aria-disabled="true">{NAV.company.label}</span>
          <Link className="sub" href={NAV.about.href}>
            {NAV.about.label}
          </Link>
          <Link className="sub" href={NAV.whyBalto.href}>
            {NAV.whyBalto.label}
          </Link>
          {/* Placeholder, destination pending client direction on content. */}
          <span aria-disabled="true">{NAV.team.label}</span>
          {/* Placeholder, destination pending client direction on content. */}
          <span aria-disabled="true">{NAV.community.label}</span>
          <Link href={NAV.careers.href}>{NAV.careers.label}</Link>
          <span className="sub" aria-disabled="true">
            {SITE.header.mobile.careersSubLine}
          </span>
          <Link href={NAV.contact.href}>{NAV.contact.label}</Link>
          <Link href={SITE.header.tenantPortal.allHref}>
            {SITE.header.tenantPortal.label}
          </Link>
          <Link href={SITE.header.favorites.href}>
            {SITE.header.favorites.label}{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>
              {count}
            </span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
