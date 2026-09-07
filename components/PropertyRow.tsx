'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Residence } from '@/lib/data';
import { formatPrice } from '@/lib/data';
import { FavoriteHeart } from './FavoriteHeart';
import { ArrowRight } from './icons';
import { PlaceholderImg } from './SmartImage';

/* Horizontal listing row for the map + list view: photograph left, name /
   address / rent right. The media keeps the .portfolio-media class so it
   inherits the black-and-white-resolves-to-colour-on-hover treatment rather
   than carrying a second copy of it. */
export function PropertyRow({
  residence: r,
  active,
  onHover,
}: {
  residence: Residence;
  active?: boolean;
  onHover?: (id: string | null) => void;
}) {
  const router = useRouter();
  const [imgErrored, setImgErrored] = useState(false);
  const to = `/residences/${r.city}/${r.slug}`;
  const hasUnits = (r.units?.length ?? 0) > 0;

  return (
    <article
      className={'portfolio-listing-row' + (active ? ' is-active' : '')}
      onMouseEnter={() => onHover?.(r.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <a
        className="portfolio-media"
        href={to}
        tabIndex={-1}
        aria-hidden="true"
        onClick={(e) => {
          e.preventDefault();
          router.push(to);
        }}
      >
        {r.heroImage && !imgErrored ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={r.heroImage}
            alt=""
            loading="lazy"
            onError={() => setImgErrored(true)}
          />
        ) : (
          <PlaceholderImg label="" tone="deep">
            {r.name.charAt(0)}
          </PlaceholderImg>
        )}
        {r.featured && <span className="portfolio-listing-badge">Featured</span>}
      </a>

      <div className="portfolio-listing-copy">
        <a
          className="portfolio-listing-name h3 serif"
          href={to}
          onClick={(e) => {
            e.preventDefault();
            router.push(to);
          }}
        >
          {r.name}
        </a>
        <p className="portfolio-listing-address small muted">{r.address}</p>
        <p className="portfolio-listing-price">
          {hasUnits ? (
            <>
              <span className="from">From</span>{' '}
              <span className="serif amount">{formatPrice(r.priceFrom)}</span>{' '}
              <span className="per">/mo</span>
            </>
          ) : (
            <span className="from">Enquire for availability</span>
          )}
        </p>
      </div>

      <div className="portfolio-listing-actions">
        <FavoriteHeart id={r.id} size={17} />
        <button
          type="button"
          className="portfolio-listing-go"
          aria-label={`View ${r.name}`}
          onClick={() => router.push(to)}
        >
          <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
}
