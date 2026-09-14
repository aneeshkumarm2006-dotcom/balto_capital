'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Residence } from '@/lib/data';
import { bedroomShort, formatPrice } from '@/lib/data';
import { Eyebrow } from './Eyebrow';
import { FavoriteHeart } from './FavoriteHeart';
import { ArrowRight } from './icons';
import { PlaceholderImg } from './SmartImage';
import { PAGES } from '@/lib/pages';
import { SITE } from '@/lib/site';

const T = PAGES.city.portfolio.splitRow;

/* Horizontal listing row for the map + list view: photograph left, name /
   address / rent right. The media keeps the .portfolio-media class so it
   inherits the black-and-white-resolves-to-colour-on-hover treatment rather
   than carrying a second copy of it. */
export function PropertyRow({
  residence: r,
  active,
  onHover,
  showCity = false,
}: {
  residence: Residence;
  active?: boolean;
  onHover?: (id: string | null) => void;
  /** Prints the market above the name. On for the all-markets index, where the
   *  row is otherwise the only card on the site that does not say where it is. */
  showCity?: boolean;
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
        {/* Featured on the homepage does not automatically mean a gold badge
            here — the building can be opted out of the listing treatment. */}
        {r.featured && !r.hideFeaturedBadge && (
          <span className="portfolio-listing-badge">{T.featuredBadge}</span>
        )}
      </a>

      <div className="portfolio-listing-copy">
        {showCity && (
          <Eyebrow style={{ fontSize: 10, marginBottom: 8, display: 'block' }}>
            {r.cityLabel}
          </Eyebrow>
        )}
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
        {/* The suite mix sits beside the rent the way it does on the property
            card, so the split listing carries the same two facts the rest of
            the site leads with. */}
        <p className="portfolio-listing-beds small">
          {r.bedroomTypes.length
            ? bedroomShort(r.bedroomTypes)
            : SITE.propertyCard.noPriceDash}
        </p>
        <p className="portfolio-listing-price">
          {hasUnits ? (
            <>
              <span className="from">{T.priceFromLabel}</span>{' '}
              <span className="serif amount">{formatPrice(r.priceFrom)}</span>{' '}
              <span className="per">{T.priceSuffix}</span>
            </>
          ) : (
            <span className="from">{T.noPriceLabel}</span>
          )}
        </p>
      </div>

      <div className="portfolio-listing-actions">
        <FavoriteHeart id={r.id} size={17} />
        <button
          type="button"
          className="portfolio-listing-go"
          aria-label={T.viewLabel.replace('{name}', r.name)}
          onClick={() => router.push(to)}
        >
          <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
}
