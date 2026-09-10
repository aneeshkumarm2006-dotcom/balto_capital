'use client';

/* BALTO — price control for the homepage search bar. The bar has ~200px per
   field, which is not enough for two dollar inputs, so the field itself reads
   as a summary and opens a panel holding both a typed min/max and the same
   dual-handle slider the filters page uses.

   The panel is portaled and measured like the Dropdown menu — see
   useAnchorPosition — because .home-hero clips anything absolutely positioned
   inside it. */

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { formatPrice } from '@/lib/data';
import { PriceRange } from './PriceRange';
import { useAnchorPosition } from './useAnchorPosition';

export function PriceField({
  min,
  max,
  step,
  value,
  onChange,
  anyLabel,
  minLabel,
  maxLabel,
  summaryTemplate,
  ariaLabel,
}: {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (next: [number, number]) => void;
  anyLabel: string;
  minLabel: string;
  maxLabel: string;
  summaryTemplate: string;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const box = useAnchorPosition(rootRef, open, {
    maxHeight: 320,
    minWidth: 320,
    onEscapeViewport: () => setOpen(false),
  });

  /* The typed boxes keep their own strings so a half-typed or cleared value is
     not rewritten under the cursor; they commit on blur or Enter. */
  const [minText, setMinText] = useState(String(value[0]));
  const [maxText, setMaxText] = useState(String(value[1]));
  useEffect(() => {
    setMinText(String(value[0]));
    setMaxText(String(value[1]));
  }, [value, open]);

  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      if (popRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', down);
    return () => document.removeEventListener('pointerdown', down);
  }, [open]);

  const clamp = (n: number) =>
    Math.min(max, Math.max(min, Math.round(n / step) * step));

  const commitMin = () => {
    const n = Number(minText);
    if (minText.trim() === '' || !Number.isFinite(n)) {
      onChange([min, value[1]]);
      return;
    }
    onChange([Math.min(clamp(n), value[1] - step), value[1]]);
  };

  const commitMax = () => {
    const n = Number(maxText);
    if (maxText.trim() === '' || !Number.isFinite(n)) {
      onChange([value[0], max]);
      return;
    }
    onChange([value[0], Math.max(clamp(n), value[0] + step)]);
  };

  const isAny = value[0] === min && value[1] === max;
  const summary = isAny
    ? anyLabel
    : summaryTemplate
        .split('{min}')
        .join(formatPrice(value[0]))
        .split('{max}')
        .join(formatPrice(value[1]));

  const dismiss = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={rootRef} className="bd-select bd-site">
      <button
        ref={triggerRef}
        // Sits inside <form className="hero-search"> — without this it submits.
        type="button"
        className="bd-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span className={isAny ? 'bd-placeholder' : 'bd-value'}>{summary}</span>
        <svg
          className={'bd-chevron' + (open ? ' up' : '')}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && box && typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={popRef}
            className={'bd-pricepop' + (box.placement === 'above' ? ' up' : '')}
            role="dialog"
            aria-label={ariaLabel}
            style={{
              left: box.left,
              top: box.top,
              bottom: box.bottom,
              width: box.width,
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') dismiss();
            }}
          >
            <div className="bd-price-inputs">
              <label className="bd-price-cell">
                <span className="eyebrow">{minLabel}</span>
                <span className="bd-price-input">
                  <span aria-hidden>$</span>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    aria-label={minLabel}
                    value={minText}
                    onChange={(e) =>
                      setMinText(e.target.value.replace(/[^0-9]/g, ''))
                    }
                    onBlur={commitMin}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        // The panel is portaled out of the form, but be explicit.
                        e.preventDefault();
                        commitMin();
                      }
                    }}
                  />
                </span>
              </label>
              <span className="sep" aria-hidden>
                –
              </span>
              <label className="bd-price-cell">
                <span className="eyebrow">{maxLabel}</span>
                <span className="bd-price-input">
                  <span aria-hidden>$</span>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    aria-label={maxLabel}
                    value={maxText}
                    onChange={(e) =>
                      setMaxText(e.target.value.replace(/[^0-9]/g, ''))
                    }
                    onBlur={commitMax}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        commitMax();
                      }
                    }}
                  />
                </span>
              </label>
            </div>
            <PriceRange
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={onChange}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
