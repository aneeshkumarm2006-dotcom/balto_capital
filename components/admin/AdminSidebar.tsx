'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from './api';
import {
  IconBuilding,
  IconDashboard,
  IconExternal,
  IconImage,
  IconLogout,
  IconSettings,
} from './icons';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: IconDashboard, exact: true },
  { href: '/admin/properties', label: 'Properties', icon: IconBuilding },
  { href: '/admin/library', label: 'Library', icon: IconImage },
  { href: '/admin/settings', label: 'Site settings', icon: IconSettings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  const signOut = async () => {
    await logout();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="adm-sidebar">
      <div className="adm-sidebar-brand">
        <div className="adm-wordmark">Balto</div>
        <div className="adm-wordmark-sub">Content Studio</div>
      </div>

      <nav className="adm-nav" aria-label="Admin">
        <div className="adm-nav-label">Manage</div>
        {NAV.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`adm-nav-item${isActive(href, exact) ? ' active' : ''}`}
            aria-current={isActive(href, exact) ? 'page' : undefined}
          >
            <Icon />
            {label}
          </Link>
        ))}
        <div className="adm-nav-label">Site</div>
        <a
          className="adm-nav-item"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconExternal />
          View live site
        </a>
      </nav>

      <div className="adm-sidebar-foot">
        <button className="adm-nav-item" onClick={signOut} style={{ width: '100%', background: 'none', border: 0, borderLeft: '2px solid transparent' }}>
          <IconLogout />
          Sign out
        </button>
      </div>
    </aside>
  );
}
