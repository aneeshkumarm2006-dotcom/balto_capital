'use client';

/* BALTO — multi-select sibling of ui/Dropdown.

   Same trigger, same portaled menu, same keyboard contract; the difference is
   that a row toggles instead of committing, so the menu stays open while the
   visitor builds a selection. Row 0 is the "all" row: it means "no filter", so
   picking it clears everything, and it reads as selected while nothing else is.

   Styles live in globals.css alongside the single-select menu (.bd-*). */

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { useAnchorPosition } from './useAnchorPosition';
import type { DropdownOption } from './Dropdown';

/** Row 0 of the menu — "All cities" / "All bedrooms". Not an option index. */
const ALL = -1;

export function MultiDropdown({
  values,
  onChange,
  options,
  allLabel,
  summaryTemplate = '{count} selected',
  variant = 'site',
  ariaLabel,
  disabled,
  style,
  menuStyle,
  maxHeight = 300,
}: {
  values: string[];
  onChange: (values: string[]) => void;
  options: DropdownOption[];
  /** Row 0's wording, and what the trigger reads while nothing is selected. */
  allLabel: string;
  /** Trigger wording past one selection; `{count}` is replaced. */
  summaryTemplate?: string;
  variant?: 'site' | 'admin';
  ariaLabel?: string;
  disabled?: boolean;
  style?: CSSProperties;
  menuStyle?: CSSProperties;
  /** Ceiling for the menu; the viewport budget can still shrink it. */
  maxHeight?: number;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(ALL);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: '', at: 0 });
  const listboxId = useId();

  /* Read in menu order rather than click order, so the same pair of cities
     always summarises the same way. */
  const selected = options.filter((o) => values.includes(o.value));

  const close = useCallback(() => {
    setOpen(false);
    setActive(ALL);
  }, []);

  const box = useAnchorPosition(rootRef, open, {
    maxHeight,
    onEscapeViewport: close,
  });

  useEffect(() => {
    if (!open) return;
    const onDocDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      // The menu is portaled out of the trigger's subtree, so it needs its own
      // check — otherwise this closes it before a row's onClick can fire.
      if (listRef.current?.contains(t)) return;
      close();
    };
    document.addEventListener('pointerdown', onDocDown);
    return () => document.removeEventListener('pointerdown', onDocDown);
  }, [open, close]);

  /* The single-select menu can rely on the trigger's own onKeyDown, because a
     click commits and closes before the visitor can press anything. Here the
     menu stays open across clicks, and clicking a portaled row drops focus to
     <body> — so Escape has to be caught at the document. */
  useEffect(() => {
    if (!open) return;
    const onDocKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (rootRef.current?.contains(document.activeElement)) return; // trigger handles it
      e.preventDefault();
      close();
      triggerRef.current?.focus();
    };
    document.addEventListener('keydown', onDocKey);
    return () => document.removeEventListener('keydown', onDocKey);
  }, [open, close]);

  useEffect(() => {
    // The "all" row is index -1, so the <li> list is offset by one.
    if (open) {
      listRef.current
        ?.querySelectorAll('li')
        [active + 1]?.scrollIntoView({ block: 'nearest' });
    }
  }, [open, active]);

  const openMenu = () => {
    if (disabled) return;
    setOpen(true);
    // Land on the first selection, so arrowing starts where the eye is.
    const first = options.findIndex((o) => values.includes(o.value));
    setActive(first >= 0 ? first : ALL);
  };

  /* Toggling never closes the menu — that is the whole point of this control.
     Row 0 clears, since "all" and "a subset" cannot both be true. */
  const toggle = (i: number) => {
    if (i === ALL) {
      onChange([]);
      return;
    }
    const opt = options[i];
    if (!opt) return;
    onChange(
      values.includes(opt.value)
        ? values.filter((v) => v !== opt.value)
        : [...values, opt.value],
    );
  };

  const findByTypeahead = (ch: string): number => {
    const now = Date.now();
    typeahead.current.text =
      now - typeahead.current.at > 600 ? ch : typeahead.current.text + ch;
    typeahead.current.at = now;
    const q = typeahead.current.text.toLowerCase();
    return options.findIndex((o) => o.label.toLowerCase().startsWith(q));
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActive((a) => Math.min(a + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((a) => Math.max(a - 1, ALL));
        break;
      case 'Home':
        e.preventDefault();
        setActive(ALL);
        break;
      case 'End':
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        toggle(active);
        break;
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'Tab':
        close();
        break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const i = findByTypeahead(e.key);
          if (i >= 0) setActive(i);
        }
    }
  };

  const triggerLabel =
    selected.length === 0
      ? allLabel
      : selected.length === 1
        ? selected[0].label
        : summaryTemplate.replace('{count}', String(selected.length));

  const row = (key: string, i: number, label: string, checked: boolean) => (
    <li
      key={key}
      id={listboxId + '-' + (i + 1)}
      role="option"
      aria-selected={checked}
      className={`bd-option bd-option-multi${i === active ? ' active' : ''}`}
      onPointerEnter={() => setActive(i)}
      // Keep focus on the trigger so arrow keys and Escape still reach it
      // after the visitor has ticked a row with the mouse.
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => toggle(i)}
    >
      <span className={`bd-check${checked ? ' on' : ''}`} aria-hidden>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 12.5 4.5 4.5L19 7" />
        </svg>
      </span>
      <span>{label}</span>
    </li>
  );

  return (
    <div
      ref={rootRef}
      className={`bd-select bd-${variant}${disabled ? ' disabled' : ''}`}
      style={style}
    >
      <button
        ref={triggerRef}
        type="button"
        className="bd-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={open ? listboxId + '-' + (active + 1) : undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onKeyDown}
      >
        <span className="bd-value">{triggerLabel}</span>
        <svg
          className={`bd-chevron${open ? ' up' : ''}`}
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
          <ul
            ref={listRef}
            id={listboxId}
            className={
              'bd-menu bd-menu-' + variant + (box.placement === 'above' ? ' up' : '')
            }
            role="listbox"
            aria-multiselectable="true"
            aria-label={ariaLabel}
            style={{
              // Caller styling first; the measured box always wins on layout.
              ...menuStyle,
              left: box.left,
              top: box.top,
              bottom: box.bottom,
              width: box.width,
              maxHeight: box.maxHeight,
            }}
          >
            {row('__all__', ALL, allLabel, selected.length === 0)}
            {options.map((o, i) => row(o.value, i, o.label, values.includes(o.value)))}
          </ul>,
          document.body,
        )}
    </div>
  );
}
