'use client';

/* BALTO — custom branded dropdown (replaces native <select> everywhere).
   Accessible listbox: full keyboard support, type-ahead, click-outside.
   Variants: 'site' (transparent trigger for the public site) and
   'admin' (input-style trigger for the CMS). Styles in globals.css (.bd-*). */

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
import { SITE } from '@/lib/site';
import { useAnchorPosition } from './useAnchorPosition';

export interface DropdownOption {
  value: string;
  label: string;
}

export function Dropdown({
  value,
  onChange,
  options,
  placeholder = SITE.ui.dropdownPlaceholder,
  variant = 'site',
  ariaLabel,
  disabled,
  style,
  menuStyle,
  maxHeight = 300,
}: {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  variant?: 'site' | 'admin';
  ariaLabel?: string;
  disabled?: boolean;
  style?: CSSProperties;
  menuStyle?: CSSProperties;
  /** Ceiling for the menu; the viewport budget can still shrink it. */
  maxHeight?: number;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: '', at: 0 });
  const listboxId = useId();

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const close = useCallback(() => {
    setOpen(false);
    setActive(-1);
  }, []);

  /* The menu is portaled to <body>, so its position is measured off the
     trigger rather than inherited — see useAnchorPosition for why. `.bd-select`
     is width:100%, so its rect is already the field width, and a caller's
     explicit width is picked up for free. */
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
      // check — otherwise this closes it before an option's onClick can fire.
      if (listRef.current?.contains(t)) return;
      close();
    };
    document.addEventListener('pointerdown', onDocDown);
    return () => document.removeEventListener('pointerdown', onDocDown);
  }, [open, close]);

  useEffect(() => {
    if (open && active >= 0) {
      listRef.current
        ?.querySelectorAll('li')
        [active]?.scrollIntoView({ block: 'nearest' });
    }
  }, [open, active]);

  const openMenu = () => {
    if (disabled) return;
    setOpen(true);
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
  };

  const commit = (i: number) => {
    const opt = options[i];
    if (opt) onChange(opt.value);
    close();
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
        setActive((a) => Math.max(a - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setActive(0);
        break;
      case 'End':
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        commit(active);
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

  return (
    <div
      ref={rootRef}
      className={`bd-select bd-${variant}${disabled ? ' disabled' : ''}`}
      style={style}
    >
      <button
        type="button"
        className="bd-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={
          open && active >= 0 ? listboxId + '-' + active : undefined
        }
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onKeyDown}
      >
        <span className={selected ? 'bd-value' : 'bd-placeholder'}>
          {selected?.label ?? placeholder}
        </span>
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
          {options.map((o, i) => (
            <li
              key={o.value}
              id={listboxId + '-' + i}
              role="option"
              aria-selected={o.value === value}
              className={`bd-option${i === active ? ' active' : ''}`}
              onPointerEnter={() => setActive(i)}
              onClick={() => commit(i)}
            >
              <span>{o.label}</span>
              {o.value === value && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="m5 12.5 4.5 4.5L19 7" />
                </svg>
              )}
            </li>
          ))}
        </ul>,
        document.body,
      )}
    </div>
  );
}
