'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/* ============================================================
   Scroll choreography.

   Every page gets the same treatment without touching its markup:
   headings and body copy drift in from the side, cards and images
   rise and un-mask, and grid children stagger behind one another so
   a section resolves rather than snapping into place.

   Anything already on screen at mount is left alone — an element the
   visitor is looking at should never animate under them.

   Opt a specific element into a named motion with `data-reveal`:
     data-reveal            → the default rise
     data-reveal="mask"     → image wipes up from its own bottom edge
     data-reveal="pop"      → scales up from 92%
     data-reveal="rule"     → a hairline draws out from the left
     data-reveal="fade"     → opacity only
   and delay it with `data-reveal-delay="240"` (milliseconds).
   ============================================================ */

const TEXT_SELECTORS = [
  '.display',
  '.h1',
  '.h2',
  '.h3',
  'h1, h2, h3',
  '.eyebrow',
  'p.body',
  '[data-reveal-text]',
];

const BLOCK_SELECTORS = [
  '.property-card',
  '.city-card',
  '.featured-grid > *',
  '.cards-grid > *',
  '.city-carousel-grid > *',
  '.portfolio-row',
  '.grid-2up > .card',
  '.grid-4-md2 > .card',
  '[data-reveal]',
];

const ALL_SELECTORS = [...TEXT_SELECTORS, ...BLOCK_SELECTORS].join(',');
const TEXT_SELECTOR_STR = TEXT_SELECTORS.join(',');

const GRID_CLASSES = [
  'featured-grid',
  'cards-grid',
  'city-carousel-grid',
  'home-cards-4',
  'steps-grid',
  'grid-2up',
  'grid-4-md2',
];

const VARIANTS = new Set(['mask', 'pop', 'rule', 'fade']);

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.remove('reveal-safety');

    const initTimer = window.setTimeout(() => {
      const els = Array.from(
        document.querySelectorAll<HTMLElement>(ALL_SELECTORS)
      );
      if (!els.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-revealed');
              observer.unobserve(e.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      );

      els.forEach((el) => {
        if (el.dataset.revealInit) return;

        const rect = el.getBoundingClientRect();
        const aboveFold = rect.top < window.innerHeight * 0.95;

        if (aboveFold) {
          el.dataset.revealInit = 'skip';
          return;
        }

        el.dataset.revealInit = '1';
        el.classList.add('reveal-on-scroll');

        const variant = el.dataset.reveal;
        if (variant && VARIANTS.has(variant)) {
          el.classList.add(`reveal-${variant}`);
        } else if (el.matches(TEXT_SELECTOR_STR)) {
          el.classList.add('reveal-x');
        } else {
          el.classList.add('reveal-y');
        }

        /* Grid children trail the one before them, so a row of cards
           resolves left-to-right instead of all at once. */
        let delay = Number(el.dataset.revealDelay ?? 0);
        const parent = el.parentElement;
        if (parent && !el.dataset.revealDelay) {
          const hit = GRID_CLASSES.find((c) => parent.classList.contains(c));
          if (hit) {
            const idx = Array.from(parent.children).indexOf(el);
            delay = Math.min(idx * 90, 540);
          }
        }
        if (delay) el.style.transitionDelay = `${delay}ms`;

        observer.observe(el);
      });
    }, 60);

    const safety = window.setTimeout(() => {
      document.body.classList.add('reveal-safety');
    }, 1800);

    return () => {
      window.clearTimeout(initTimer);
      window.clearTimeout(safety);
    };
  }, [pathname]);

  return null;
}
