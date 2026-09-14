'use client';

/* BALTO CMS — Properties list: searchable, city-filterable table of buildings
   with quick links to edit details, photos, and units. */

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getContent, putContent } from '@/components/admin/api';
import { IconPlus, IconSearch } from '@/components/admin/icons';
import { PageHead, useToast } from '@/components/admin/ui';
import { Dropdown, type DropdownOption } from '@/components/ui/Dropdown';

interface Building {
  slug: string;
  name: string;
  city: string;
  address: string;
  featured?: boolean;
  archived?: boolean;
  /* Cleared alongside `featured` by the inline toggle below. Every other key
     in buildings.json rides through the spread untouched. */
  featuredRank?: number;
  hideFeaturedBadge?: boolean;
}

interface Unit {
  unit: string;
  type: string;
  rent: number;
}

interface CityEntry {
  slug: string;
  label: string;
  province: string;
}

export default function PropertiesPage() {
  const [buildings, setBuildings] = useState<Building[] | null>(null);
  const [units, setUnits] = useState<Record<string, Unit[]>>({});
  const [cityLabels, setCityLabels] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('all');
  const [pendingFeature, setPendingFeature] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getContent<Building[]>('buildings'),
      getContent<Record<string, Unit[]>>('units'),
      getContent<Record<string, CityEntry>>('cities'),
    ])
      .then(([b, u, cities]) => {
        if (cancelled) return;
        setBuildings(Array.isArray(b) ? b : []);
        setUnits(u ?? {});
        const labels: Record<string, string> = {};
        for (const entry of Object.values(
          cities && typeof cities === 'object' ? cities : {}
        )) {
          if (entry && typeof entry.slug === 'string' && typeof entry.label === 'string') {
            labels[entry.slug] = entry.label;
          }
        }
        setCityLabels(labels);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load properties.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /* Feature / unfeature straight from the table so the control is available on
     every property, not only the ones already carrying the badge. Writes the
     whole buildings file back the way the detail editor does; the rank and
     badge sub-options stay where they are and keep being edited there. */
  const toggleFeatured = async (slug: string, next: boolean) => {
    if (!buildings || pendingFeature) return;
    const previous = buildings;
    const updated = buildings.map((b) => {
      if (b.slug !== slug) return b;
      const merged: Building = { ...b };
      if (next) {
        merged.featured = true;
      } else {
        delete merged.featured;
        delete merged.featuredRank;
        delete merged.hideFeaturedBadge;
      }
      return merged;
    });
    setPendingFeature(slug);
    setBuildings(updated);
    try {
      await putContent('buildings', updated);
      const name = previous.find((b) => b.slug === slug)?.name ?? 'Property';
      toast('success', next ? `${name} is now featured.` : `${name} is no longer featured.`);
    } catch (err: unknown) {
      setBuildings(previous);
      toast('error', err instanceof Error ? err.message : 'Could not update the property.');
    } finally {
      setPendingFeature(null);
    }
  };

  const cityOptions: DropdownOption[] = useMemo(
    () => [
      { value: 'all', label: 'All cities' },
      ...Object.entries(cityLabels).map(([value, label]) => ({ value, label })),
    ],
    [cityLabels]
  );

  const filtered = useMemo(() => {
    if (!buildings) return [];
    const q = query.trim().toLowerCase();
    return buildings.filter((b) => {
      if (city !== 'all' && b.city !== city) return false;
      if (!q) return true;
      return (
        b.name.toLowerCase().includes(q) || b.address.toLowerCase().includes(q)
      );
    });
  }, [buildings, query, city]);

  const head = (
    <PageHead
      eyebrow="Manage"
      title="Properties"
      lede="Edit building details, manage photos, and keep suite availability up to date."
      actions={
        <Link className="adm-btn gold" href="/admin/properties/new">
          <IconPlus />
          Add property
        </Link>
      }
    />
  );

  if (error) {
    return (
      <>
        {head}
        <div className="adm-card">
          <div className="adm-empty">
            <div className="t">Something went wrong</div>
            <p>{error}</p>
          </div>
        </div>
      </>
    );
  }

  if (!buildings) {
    return (
      <>
        {head}
        <p className="adm-muted">Loading…</p>
      </>
    );
  }

  return (
    <>
      {head}

      <div className="adm-row" style={{ marginBottom: 18 }}>
        <div className="adm-search adm-grow" style={{ maxWidth: 380 }}>
          <IconSearch />
          <input
            className="adm-input"
            type="search"
            placeholder="Search by name or address…"
            aria-label="Search properties by name or address"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Dropdown
          variant="admin"
          ariaLabel="Filter by city"
          style={{ minWidth: 160 }}
          value={city}
          options={cityOptions}
          onChange={setCity}
        />
      </div>

      <div className="adm-card">
        {filtered.length === 0 ? (
          <div className="adm-empty">
            <div className="t">No properties match</div>
            <p>Try clearing the search or choosing a different city.</p>
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th scope="col">Property</th>
                <th scope="col">City</th>
                <th scope="col" className="num">Units</th>
                <th scope="col">Status</th>
                <th scope="col">Featured</th>
                <th scope="col">
                  <span style={{ position: 'absolute', clip: 'rect(0 0 0 0)', width: 1, height: 1, overflow: 'hidden' }}>
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.slug}>
                  <td>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 500 }}>
                      {b.name}
                    </div>
                    <div className="adm-muted" style={{ fontSize: 12.5 }}>
                      {b.address}
                    </div>
                  </td>
                  <td>{cityLabels[b.city] ?? b.city}</td>
                  <td className="num">{units[b.slug]?.length ?? 0}</td>
                  <td>
                    <div className="adm-row" style={{ gap: 6 }}>
                      {b.archived ? (
                        <span className="adm-badge danger">Archived</span>
                      ) : (
                        <span className="adm-muted">Live</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <label className="adm-switch">
                      <input
                        type="checkbox"
                        checked={b.featured === true}
                        disabled={pendingFeature !== null}
                        aria-label={`Feature ${b.name} on the homepage`}
                        onChange={(e) => toggleFeatured(b.slug, e.target.checked)}
                      />
                      <span className="track" />
                      <span className={b.featured ? undefined : 'adm-muted'}>
                        {b.featured ? 'Featured' : 'Not featured'}
                      </span>
                    </label>
                  </td>
                  <td>
                    <div className="adm-row" style={{ flexWrap: 'nowrap', gap: 8, justifyContent: 'flex-end' }}>
                      <Link className="adm-btn sm ghost" href={`/admin/properties/${b.slug}`}>
                        Edit
                      </Link>
                      <Link className="adm-btn sm ghost" href={`/admin/properties/${b.slug}/images`}>
                        Photos
                      </Link>
                      <Link className="adm-btn sm ghost" href={`/admin/properties/${b.slug}/units`}>
                        Units
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
