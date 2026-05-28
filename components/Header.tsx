'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { useFavorites } from './FavoritesContext';
import { HeartIcon, MenuIcon, CloseIcon, ChevronDown } from './icons';

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
            <Logo variant="light" height={36} />
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
                Residences <ChevronDown size={14} />
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
                  Yellowknife
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
            <Link
              href="/inquire"
              className={'nav-item ' + (isActive('/inquire') ? 'active' : '')}
            >
              Inquire
            </Link>
          </nav>

          <div className="nav-right">
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
          <Link href="/residences">Residences</Link>
          <Link className="sub" href="/residences/saskatoon">— Saskatoon</Link>
          <Link className="sub" href="/residences/edmonton">— Edmonton</Link>
          <Link className="sub" href="/residences/regina">— Regina</Link>
          <Link className="sub" href="/residences/yellowknife">— Yellowknife</Link>
          <Link href="/why-balto">Why Balto</Link>
          <Link href="/about">About</Link>
          <Link href="/inquire">Inquire</Link>
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
