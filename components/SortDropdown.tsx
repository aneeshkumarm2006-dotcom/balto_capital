'use client';
import { useState } from 'react';
import { ChevronDown } from './icons';
import type { Filters } from './FiltersPanel';
import { PAGES } from '@/lib/pages';

const RESIDENCES_PAGE = PAGES.residences;

const OPTIONS = RESIDENCES_PAGE.sort.options as {
  value: Filters['sort'];
  label: string;
}[];

interface Props {
  value: Filters['sort'];
  onChange: (v: Filters['sort']) => void;
}

export function SortDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const current = OPTIONS.find((o) => o.value === value) || OPTIONS[0];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        className="btn btn-ghost btn-sm"
        style={{ borderColor: 'var(--hairline-strong)' }}
      >
        {RESIDENCES_PAGE.sort.triggerPrefix} {current.label} <ChevronDown size={12} />
      </button>
      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 10 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 4px)',
              background: 'var(--ivory)',
              border: '1px solid var(--hairline)',
              minWidth: 220,
              zIndex: 20,
            }}
          >
            {OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className="dropdown-item"
                style={{ fontSize: 14, padding: '14px 20px' }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
