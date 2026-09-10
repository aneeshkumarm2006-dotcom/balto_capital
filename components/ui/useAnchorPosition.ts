'use client';

/* BALTO — positions a portaled layer against its trigger, in viewport
   coordinates.

   An absolutely-positioned menu cannot escape an ancestor that clips or forms
   a stacking context, and the site has several: .home-hero is `overflow:
   hidden` (it has to be — the hero image animates a scale), the portfolio
   toolbar is sticky with a z-index, and the CMS selection bar is pinned to the
   bottom of the viewport. So the layer lives on <body> and is measured rather
   than inherited.

   Used by ui/Dropdown.tsx and ui/PriceField.tsx. */

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';

export interface AnchorBox {
  left: number;
  /** Set when the layer sits below the trigger. */
  top?: number;
  /** Set when it has flipped above — using `bottom` rather than a transform
   *  keeps the entrance keyframes (which animate transform) working. */
  bottom?: number;
  width: number;
  maxHeight: number;
  placement: 'below' | 'above';
}

/** Matches the 6px the absolute `top: calc(100% + 6px)` used to give. */
const GAP = 6;
/** Never let the layer touch the viewport edge. */
const EDGE = 8;
/** Roughly three options — below this the layer is not worth opening. */
const MIN_H = 132;

export function useAnchorPosition(
  anchorRef: RefObject<HTMLElement>,
  open: boolean,
  opts: {
    maxHeight?: number;
    minWidth?: number;
    onEscapeViewport?: () => void;
  } = {},
): AnchorBox | null {
  const { maxHeight: cap = 300, minWidth = 0, onEscapeViewport } = opts;
  const [box, setBox] = useState<AnchorBox | null>(null);

  /* Held in a ref, not a dependency. Callers pass an inline arrow, so making
     `measure` depend on it would give it a new identity every render — the
     layout effect would then re-measure and setBox on every render, which is
     a render loop. */
  const escapeRef = useRef(onEscapeViewport);
  escapeRef.current = onEscapeViewport;

  const measure = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vv = window.visualViewport;
    const vh = vv?.height ?? window.innerHeight;
    const vw = vv?.width ?? window.innerWidth;

    // The trigger has scrolled out of view — the layer has nothing left to
    // point at, so let the caller dismiss it.
    if (r.bottom < 0 || r.top > vh) {
      escapeRef.current?.();
      return;
    }

    const below = vh - r.bottom - GAP - EDGE;
    const above = r.top - GAP - EDGE;
    /* Flip up whenever the layer cannot open at full height below AND above is
       meaningfully roomier. The homepage search bar sits centred in the fold,
       which leaves ~190px beneath it — enough to render, not enough to show a
       five-option menu without scrolling, which is what the client was hitting.
       The 24px margin stops a near-tie from flip-flopping on resize. */
    const up = below < cap && above > below + 24;
    const space = up ? above : below;
    const width = Math.max(r.width, minWidth);

    const next: AnchorBox = {
      left: Math.min(Math.max(EDGE, r.left), Math.max(EDGE, vw - width - EDGE)),
      ...(up ? { bottom: vh - r.top + GAP } : { top: r.bottom + GAP }),
      width,
      maxHeight: Math.max(MIN_H, Math.min(cap, space)),
      placement: up ? 'above' : 'below',
    };
    // Bail on an unchanged box: these listeners fire on every scroll frame.
    setBox((prev) =>
      prev &&
      prev.left === next.left &&
      prev.top === next.top &&
      prev.bottom === next.bottom &&
      prev.width === next.width &&
      prev.maxHeight === next.maxHeight
        ? prev
        : next,
    );
  }, [anchorRef, cap, minWidth]);

  useLayoutEffect(() => {
    if (open) measure();
    else setBox(null);
  }, [open, measure]);

  useEffect(() => {
    if (!open) return;
    const on = () => measure();
    // capture: true so scrolling ANY container re-anchors the layer — the
    // filters slide-over, the CMS sidebar, the sticky toolbar, the page.
    window.addEventListener('scroll', on, true);
    window.addEventListener('resize', on);
    window.visualViewport?.addEventListener('resize', on);
    window.visualViewport?.addEventListener('scroll', on);
    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(on) : null;
    if (ro && anchorRef.current) ro.observe(anchorRef.current);
    return () => {
      window.removeEventListener('scroll', on, true);
      window.removeEventListener('resize', on);
      window.visualViewport?.removeEventListener('resize', on);
      window.visualViewport?.removeEventListener('scroll', on);
      ro?.disconnect();
    };
  }, [open, measure, anchorRef]);

  return box;
}
