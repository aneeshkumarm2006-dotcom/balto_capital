'use client';
import { useEffect, useRef, useState } from 'react';
import { Eyebrow } from './Eyebrow';
import { CloseIcon } from './icons';
import { formatPrice } from '@/lib/data';
import { PAGES } from '@/lib/pages';

const RESIDENCES_PAGE = PAGES.residences;

export interface Filters {
  beds: number[];
  priceMin: number;
  priceMax: number;
  availability: 'any' | 'available' | 'coming-soon';
  amenities: string[];
  sort: 'name' | 'price-asc' | 'price-desc' | 'bedrooms';
}

export const DEFAULT_FILTERS: Filters = {
  beds: [],
  priceMin: 800,
  priceMax: 3500,
  availability: 'any',
  amenities: [],
  sort: 'name',
};

// The amenity checkboxes now live in the CMS (content/pages.json →
// residences.filters.amenities.options). `key` is the lowercase substring
// tested against each building's features + amenities and is not client-
// editable; near-duplicates stay grouped: "balcon" catches Balconies +
// Private balconies, "shared mail" catches both mail-area wordings. Roof
// terrace is excluded everywhere per the client (not a real amenity in any
// building).
const ALL_AMENITIES = RESIDENCES_PAGE.filters.amenities.options;

interface PriceRangeProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (next: [number, number]) => void;
}

function PriceRange({ min, max, step, value, onChange }: PriceRangeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<'a' | 'b' | null>(null);

  const pctA = ((value[0] - min) / (max - min)) * 100;
  const pctB = ((value[1] - min) / (max - min)) * 100;

  useEffect(() => {
    if (!drag) return;
    const move = (e: PointerEvent) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const raw = min + pct * (max - min);
      const snapped = Math.round(raw / step) * step;
      if (drag === 'a') {
        onChange([Math.min(snapped, value[1] - step), value[1]]);
      } else {
        onChange([value[0], Math.max(snapped, value[0] + step)]);
      }
    };
    const up = () => setDrag(null);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [drag, value, onChange, min, max, step]);

  return (
    <div className="range-track" ref={trackRef}>
      <div
        className="range-fill"
        style={{ left: `${pctA}%`, width: `${pctB - pctA}%` }}
      />
      <div
        className="range-handle"
        style={{ left: `${pctA}%` }}
        onPointerDown={() => setDrag('a')}
      />
      <div
        className="range-handle"
        style={{ left: `${pctB}%` }}
        onPointerDown={() => setDrag('b')}
      />
    </div>
  );
}

interface FiltersPanelProps {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
  onApply: () => void;
  onClear: () => void;
}

export function FiltersPanel({
  open,
  onClose,
  filters,
  setFilters,
  onApply,
  onClear,
}: FiltersPanelProps) {
  const update = (patch: Partial<Filters>) => setFilters({ ...filters, ...patch });
  const toggleBed = (n: number) => {
    const has = filters.beds.includes(n);
    update({ beds: has ? filters.beds.filter((b) => b !== n) : [...filters.beds, n] });
  };
  const toggleAmenity = (a: string) => {
    const has = filters.amenities.includes(a);
    update({
      amenities: has
        ? filters.amenities.filter((x) => x !== a)
        : [...filters.amenities, a],
    });
  };

  return (
    <>
      <div
        className={'filters-overlay' + (open ? ' open' : '')}
        onClick={onClose}
      />
      <aside
        className={'filters-panel' + (open ? ' open' : '')}
        aria-hidden={!open}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 32,
          }}
        >
          <Eyebrow>{RESIDENCES_PAGE.filters.eyebrow}</Eyebrow>
          <button
            aria-label={RESIDENCES_PAGE.filters.closeLabel}
            onClick={onClose}
            style={{ background: 'transparent', border: 0 }}
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <h3 className="h3 serif" style={{ marginBottom: 16 }}>
          {RESIDENCES_PAGE.filters.bedrooms.heading}
        </h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
          {RESIDENCES_PAGE.filters.bedrooms.options.map(({ beds: n, label }) => (
            <button
              key={n}
              className={'pill' + (filters.beds.includes(n) ? ' active' : '')}
              onClick={() => toggleBed(n)}
            >
              {label}
            </button>
          ))}
        </div>

        <h3 className="h3 serif" style={{ marginBottom: 8 }}>
          {RESIDENCES_PAGE.filters.price.heading}
        </h3>
        <div className="caption muted" style={{ marginBottom: 12 }}>
          {RESIDENCES_PAGE.filters.price.readoutPrefix} {formatPrice(filters.priceMin)}{' '}
          {RESIDENCES_PAGE.filters.price.readoutSeparator} {formatPrice(filters.priceMax)}
          <span style={{ fontFamily: 'var(--sans)' }}>
            {RESIDENCES_PAGE.filters.price.readoutSuffix}
          </span>
        </div>
        <PriceRange
          min={800}
          max={3500}
          step={50}
          value={[filters.priceMin, filters.priceMax]}
          onChange={([a, b]) => update({ priceMin: a, priceMax: b })}
        />
        <div style={{ height: 24 }} />

        <h3 className="h3 serif" style={{ marginBottom: 16 }}>
          {RESIDENCES_PAGE.filters.amenities.heading}
        </h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginBottom: 36,
          }}
        >
          {ALL_AMENITIES.map((a) => (
            <label
              key={a.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              <input
                type="checkbox"
                checked={filters.amenities.includes(a.key)}
                onChange={() => toggleAmenity(a.key)}
                style={{ accentColor: 'var(--ink)', width: 16, height: 16 }}
              />
              {a.label}
            </label>
          ))}
        </div>

        <div className="divider" style={{ margin: '12px 0 24px' }} />
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClear}>
            {RESIDENCES_PAGE.filters.clearLabel}
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={onApply}>
            {RESIDENCES_PAGE.filters.applyLabel}
          </button>
        </div>
      </aside>
    </>
  );
}
