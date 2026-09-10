'use client';

/* BALTO — dual-handle price slider. Lifted out of FiltersPanel so the homepage
   search bar can show the same control the filters page does. Pointer events
   only; no library. */

import { useEffect, useRef, useState } from 'react';

export interface PriceRangeProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (next: [number, number]) => void;
}

export function PriceRange({ min, max, step, value, onChange }: PriceRangeProps) {
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

  /* Keyboard parity with the pointer drag: the handles are the only way to set
     a price on the filters page, so they cannot be mouse-only. */
  const nudge = (which: 'a' | 'b', delta: number) => {
    if (which === 'a') {
      onChange([
        Math.max(min, Math.min(value[0] + delta, value[1] - step)),
        value[1],
      ]);
    } else {
      onChange([
        value[0],
        Math.min(max, Math.max(value[1] + delta, value[0] + step)),
      ]);
    }
  };

  const handleKeys =
    (which: 'a' | 'b') => (e: React.KeyboardEvent<HTMLDivElement>) => {
      const map: Record<string, number> = {
        ArrowLeft: -step,
        ArrowDown: -step,
        ArrowRight: step,
        ArrowUp: step,
        PageDown: -step * 10,
        PageUp: step * 10,
      };
      if (e.key in map) {
        e.preventDefault();
        nudge(which, map[e.key]);
      } else if (e.key === 'Home') {
        e.preventDefault();
        which === 'a' ? nudge('a', -(max - min)) : nudge('b', -(max - min));
      } else if (e.key === 'End') {
        e.preventDefault();
        which === 'a' ? nudge('a', max - min) : nudge('b', max - min);
      }
    };

  const handle = (which: 'a' | 'b') => {
    const v = which === 'a' ? value[0] : value[1];
    return (
      <div
        className="range-handle"
        role="slider"
        tabIndex={0}
        aria-valuemin={which === 'a' ? min : value[0]}
        aria-valuemax={which === 'a' ? value[1] : max}
        aria-valuenow={v}
        aria-valuetext={'$' + v.toLocaleString()}
        style={{ left: (which === 'a' ? pctA : pctB) + '%' }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture?.(e.pointerId);
          setDrag(which);
        }}
        onKeyDown={handleKeys(which)}
      />
    );
  };

  return (
    <div className="range-track" ref={trackRef}>
      <div
        className="range-fill"
        style={{ left: pctA + '%', width: pctB - pctA + '%' }}
      />
      {handle('a')}
      {handle('b')}
    </div>
  );
}
