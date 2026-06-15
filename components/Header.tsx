'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { useFavorites } from './FavoritesContext';
import { HeartIcon, MenuIcon, CloseIcon, ChevronDown } from './icons';

// TODO: real Resident Portal URL pending from client.
const RESIDENT_PORTAL_URL = '#';

export function Header() {
  const pathname = usePathname();
  const { count } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (prefix: string) =>
    pathname === prefix || pathname.startsWith(prefix + '/');

  return (
    <>
      <header className="site-header">
        <div className="inner">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Logo variant="light" height={80} />
          </div>

          <nav className="nav" aria-label="Primary">
            <div
              className={'nav-item has-dropdown ' + (isActive('/residences') ? 'active' : '')}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Link
                href="/residences"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'inherit',
                }}
              >
                Properties <ChevronDown size={14} />
              </Link>
              <div
                className="dropdown"
                style={{
                  opacity: dropdownOpen ? 1 : undefined,
                  pointerEvents: dropdownOpen ? 'auto' : undefined,
                }}
              >
                <Link className="dropdown-item" href="/residences/saskatoon">
                  Saskatoon
                </Link>
                <Link className="dropdown-item" href="/residences/edmonton">
                  Edmonton
                </Link>
                <Link className="dropdown-item" href="/residences/regina">
                  Regina
                </Link>
                <Link className="dropdown-item" href="/residences/yellowknife">
                  Yellowknife <span style={{ color: 'var(--muted)', fontSize: 11 }}>· Coming soon</span>
                </Link>
              </div>
            </div>
            <Link
              href="/why-balto"
              className={'nav-item ' + (isActive('/why-balto') ? 'active' : '')}
            >
              Why Balto
            </Link>
            <Link
              href="/about"
              className={'nav-item ' + (isActive('/about') ? 'active' : '')}
            >
              About
            </Link>
            {/* Placeholder — destination pending client direction on content. */}
            <span className="nav-item" aria-disabled="true" style={{ cursor: 'default' }}>
              Community Involvement
            </span>
            <Link
              href="/inquire"
              className={'nav-item ' + (isActive('/inquire') ? 'active' : '')}
            >
              Contact Us
            </Link>
          </nav>

          <div className="nav-right">
            <a
              href={RESIDENT_PORTAL_URL}
              className="btn btn-ghost btn-sm resident-portal-btn"
            >
              Resident Portal
            </a>
            <Link
              href="/favorites"
              className="favorites-link"
              aria-label={`Favorites (${count})`}
            >
              <HeartIcon
                filled={count > 0}
                size={20}
                style={{ color: count > 0 ? 'var(--gold)' : 'var(--ink)' }}
              />
              <span className="favorites-count">{count}</span>
            </Link>
            <button
              className="menu-trigger"
              aria-label="Open menu"
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
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            style={{ background: 'transparent', border: 0 }}
          >
            <CloseIcon size={22} />
          </button>
        </div>
        <nav>
          <Link href="/residences">Properties</Link>
          <Link className="sub" href="/residences/saskatoon">— Saskatoon</Link>
          <Link className="sub" href="/residences/edmonton">— Edmonton</Link>
          <Link className="sub" href="/residences/regina">— Regina</Link>
          <Link className="sub" href="/residences/yellowknife">— Yellowknife (Coming soon)</Link>
          <Link href="/why-balto">Why Balto</Link>
          <Link href="/about">About</Link>
          {/* Placeholder — destination pending client direction on content. */}
          <span aria-disabled="true">Community Involvement</span>
          <Link href="/inquire">Contact Us</Link>
          <a href={RESIDENT_PORTAL_URL}>Resident Portal</a>
          <Link href="/favorites">
            Favorites{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>
              {count}
            </span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
