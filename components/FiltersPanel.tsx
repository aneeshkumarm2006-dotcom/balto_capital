'use client';
import { useEffect, useRef, useState } from 'react';
import { Eyebrow } from './Eyebrow';
import { CloseIcon } from './icons';
import { formatPrice } from '@/lib/data';

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

const ALL_AMENITIES = [
  'In-suite laundry',
  'Parking',
  'Pet-friendly',
  'Balcony',
  'Fitness centre',
  'Bicycle storage',
  'Concierge',
  'Roof terrace',
];

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
          <Eyebrow>FILTERS</Eyebrow>
          <button
            aria-label="Close"
            onClick={onClose}
            style={{ background: 'transparent', border: 0 }}
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <h3 className="h3 serif" style={{ marginBottom: 16 }}>Bedrooms</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
          {[
            { n: 0, label: 'Studio' },
            { n: 1, label: '1' },
            { n: 2, label: '2' },
            { n: 3, label: '3+' },
          ].map(({ n, label }) => (
            <button
              key={n}
              className={'pill' + (filters.beds.includes(n) ? ' active' : '')}
              onClick={() => toggleBed(n)}
            >
              {label}
            </button>
          ))}
        </div>

        <h3 className="h3 serif" style={{ marginBottom: 8 }}>Price range</h3>
        <div className="caption muted" style={{ marginBottom: 12 }}>
          From {formatPrice(filters.priceMin)} to {formatPrice(filters.priceMax)}
          <span style={{ fontFamily: 'var(--sans)' }}> /mo</span>
        </div>
        <PriceRange
          min={800}
          max={3500}
          step={50}
          value={[filters.priceMin, filters.priceMax]}
          onChange={([a, b]) => update({ priceMin: a, priceMax: b })}
        />
        <div style={{ height: 24 }} />

        <h3 className="h3 serif" style={{ marginBottom: 16 }}>Amenities</h3>
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
              key={a}
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
                checked={filters.amenities.includes(a)}
                onChange={() => toggleAmenity(a)}
                style={{ accentColor: 'var(--ink)', width: 16, height: 16 }}
              />
              {a}
            </label>
          ))}
        </div>

        <div className="divider" style={{ margin: '12px 0 24px' }} />
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClear}>
            Clear
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={onApply}>
            Apply
          </button>
        </div>
      </aside>
    </>
  );
}
