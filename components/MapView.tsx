'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap, Marker } from 'leaflet';
import type { Residence } from '@/lib/data';
import { bedroomShort, formatPrice } from '@/lib/data';
import { SITE } from '@/lib/site';
import { Eyebrow } from './Eyebrow';
import { SearchIcon } from './icons';
import { PlaceholderImg } from './SmartImage';

/* CARTO's Positron basemap started requiring an API key and began serving
   "API KEY REQUIRED" watermark tiles, so every map on the site rendered as a
   field of watermarks. OpenStreetMap's standard tiles need no key; the pale
   editorial tone that Positron gave for free is recovered with the CSS filter
   on .balto-mapview .leaflet-tile-pane. */
const BASEMAP_TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const BASEMAP_ATTR = '© OpenStreetMap contributors';

/* One teardrop, two fills. The path is hoisted so the marker HTML and the
   legend glyph can never drift apart. */
export const PIN_PATH =
  'M16 1 C 7.7 1, 1 7.7, 1 16 C 1 26, 16 43, 16 43 C 16 43, 31 26, 31 16 C 31 7.7, 24.3 1, 16 1 Z';
export const PIN_FILL = { default: '#001E4A', featured: '#B8965A' } as const;
type PinVariant = keyof typeof PIN_FILL;

/* The SVG sits inside a <span>: Leaflet writes an inline `transform` on the
   marker element itself to position it, so any transform declared on that
   element in CSS is dead. The child is Leaflet-free, which is what lets the
   hover lift and the active scale actually transition. */
function pinSvg(variant: PinVariant): string {
  return `<span class="pin"><svg width="32" height="44" viewBox="0 0 32 44" xmlns="http://www.w3.org/2000/svg">
      <path d="${PIN_PATH}" fill="${PIN_FILL[variant]}" stroke="#F7F3EC" stroke-width="1.2" />
      <circle cx="16" cy="16" r="4.5" fill="#F7F3EC" />
    </svg></span>`;
}

function PinGlyph({ variant }: { variant: PinVariant }) {
  return (
    <svg viewBox="0 0 32 44" aria-hidden focusable="false">
      <path d={PIN_PATH} fill={PIN_FILL[variant]} stroke="#F7F3EC" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="4.5" fill="#F7F3EC" />
    </svg>
  );
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface MapViewProps {
  residences: Residence[];
  selectedId?: string | null;
  onSelect?: (id: string, navigateTo?: boolean) => void;
  height?: string;
  showPreview?: boolean;
  interactive?: boolean;
  /** Controlled hover. Left undefined, the map keeps its own internal hover. */
  hoverId?: string | null;
  /** Fires on pin mouseover/mouseout so a list beside the map can follow. */
  onHover?: (id: string | null) => void;
  /** Draw featured residences in gold. Off by default so the pages that were
   *  not part of this request keep their single-colour pins. */
  featuredPins?: boolean;
  /** Key at the bottom edge: navy = available, gold = featured. */
  showLegend?: boolean;
  /** Supplied, a "Search this area" control appears after a user pan or zoom. */
  onSearchArea?: (bounds: MapBounds) => void;
  /** The view re-fits only when this changes — never merely because
   *  `residences` did, which would yank the frame out from under a viewport
   *  search the moment it narrowed the results. */
  fitToken?: string | number;
}

export default function MapView({
  residences,
  selectedId,
  onSelect,
  height = '100%',
  showPreview = true,
  interactive = true,
  hoverId: hoverIdProp,
  onHover,
  featuredPins = false,
  showLegend = false,
  onSearchArea,
  fitToken,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const [innerHover, setInnerHover] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  /** Bumped whenever the marker set is rebuilt, so the class-toggle effect
   *  re-runs against elements that exist. */
  const [markerEpoch, setMarkerEpoch] = useState(0);
  const [areaDirty, setAreaDirty] = useState(false);

  const hoverId = hoverIdProp !== undefined ? hoverIdProp : innerHover;

  const onHoverRef = useRef(onHover);
  onHoverRef.current = onHover;
  const setHover = useCallback((id: string | null) => {
    setInnerHover(id);
    onHoverRef.current?.(id);
  }, []);

  /* Programmatic camera moves must not offer "Search this area". */
  const suppressMoveRef = useRef(false);
  const residencesRef = useRef(residences);
  residencesRef.current = residences;
  /** Set by the fit effect so the ResizeObserver can re-run the same fit once
   *  the container reports its real size. */
  const fitRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!containerRef.current || mapRef.current) return;
      const L = (await import('leaflet')).default;
      if (cancelled) return;

      const m = L.map(containerRef.current!, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: interactive,
        dragging: interactive,
        doubleClickZoom: interactive,
        touchZoom: interactive,
        keyboard: interactive,
        boxZoom: interactive,
        preferCanvas: false,
        zoomSnap: 0.25,
        wheelPxPerZoomLevel: 120,
      });

      /* Leaflet refuses to accept layers before the map has a view — "Set map
         center and zoom first." Building the markers and fitting the bounds
         are separate effects now, so the marker pass can win the race; this
         provisional view (Western Canada) makes that safe. The real fit
         follows immediately and overwrites it. */
      m.setView([53.5, -108.5], 5);

      L.tileLayer(BASEMAP_TILES, {
        maxZoom: 19,
        minZoom: 4,
        attribution: BASEMAP_ATTR,
      }).addTo(m);

      if (interactive) {
        L.control.zoom({ position: 'bottomright' }).addTo(m);
      }
      L.control.attribution({ position: 'bottomleft', prefix: '' }).addTo(m);

      mapRef.current = m;
      setReady(true);
    })();

    return () => {
      cancelled = true;
      try {
        mapRef.current?.remove();
      } catch {
        // ignore
      }
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const m = mapRef.current;
    if (!m || !containerRef.current) return;
    let settled = false;
    const ro = new ResizeObserver(() => {
      try {
        m.invalidateSize();
        /* The first measurement arrives after the initial fit, so that fit was
           computed against the wrong box — refit once, when the real size is
           known. */
        if (!settled) {
          settled = true;
          fitRef.current?.();
        }
      } catch {
        // ignore
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [ready]);

  /* Markers. Rebuilt when the residence set changes; deliberately does NOT
     touch the camera — fitting is its own effect below. */
  useEffect(() => {
    const m = mapRef.current;
    if (!m) return;
    let cancelled = false;

    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !mapRef.current) return;

      Object.values(markersRef.current).forEach((mk) => mk.remove());
      markersRef.current = {};

      residences.forEach((r) => {
        const icon = L.divIcon({
          className: 'balto-pin-wrap',
          html: pinSvg(featuredPins && r.featured ? 'featured' : 'default'),
          iconSize: [32, 44],
          iconAnchor: [16, 44],
        });
        const mk = L.marker([r.coordinates.lat, r.coordinates.lng], {
          icon,
          riseOnHover: true,
        }).addTo(m);

        mk.on('click', () => onSelect?.(r.id));
        mk.on('mouseover', () => setHover(r.id));
        mk.on('mouseout', () => setHover(null));

        markersRef.current[r.id] = mk;
      });

      setMarkerEpoch((n) => n + 1);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [residences, ready, featuredPins]);

  /* Camera. Runs on mount and whenever the parent bumps `fitToken` — not on
     every residence change, so narrowing the list to the current viewport
     leaves the frame where the visitor put it. */
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const m = mapRef.current;
      if (!m) return;
      const L = (await import('leaflet')).default;
      if (cancelled || !mapRef.current) return;
      const rs = residencesRef.current;
      if (!rs.length) return;

      const pts = rs.map(
        (r) => [r.coordinates.lat, r.coordinates.lng] as [number, number]
      );
      suppressMoveRef.current = true;
      if (pts.length === 1) {
        m.setView(pts[0], 14);
      } else {
        /* Asymmetric inset. The top of a sticky map column can sit behind the
           site header, and the legend strip covers the bottom 44px — a pin
           fitted flush to either edge is simply invisible. */
        m.fitBounds(L.latLngBounds(pts), {
          paddingTopLeft: [60, 110],
          paddingBottomRight: [60, showLegend ? 100 : 60],
          maxZoom: 14.5,
          animate: true,
          duration: 0.6,
        });
      }
      window.setTimeout(() => {
        suppressMoveRef.current = false;
      }, 900);
    };

    fitRef.current = run;
    run();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, fitToken, showLegend]);

  /* Hover / selection styling. Synchronous and class-only: swapping icons here
     rebuilt every marker's DOM node on each mouse-move, which also meant no
     transition could ever play. */
  useEffect(() => {
    residences.forEach((r) => {
      const el = markersRef.current[r.id]?.getElement();
      if (!el) return;
      el.classList.toggle('active', r.id === selectedId || r.id === hoverId);
    });
  }, [residences, selectedId, hoverId, markerEpoch]);

  /* "Search this area" — user gestures only. `dragend`/`zoomend` rather than
     `moveend` because a programmatic fitBounds fires moveend too. */
  useEffect(() => {
    const m = mapRef.current;
    if (!m || !onSearchArea) return;
    const onEnd = () => {
      if (!suppressMoveRef.current) setAreaDirty(true);
    };
    m.on('dragend', onEnd);
    m.on('zoomend', onEnd);
    return () => {
      m.off('dragend', onEnd);
      m.off('zoomend', onEnd);
    };
  }, [ready, onSearchArea]);

  useEffect(() => {
    const m = mapRef.current;
    if (!m || !selectedId) return;
    const r = residences.find((x) => x.id === selectedId);
    if (!r) return;
    suppressMoveRef.current = true;
    m.flyTo([r.coordinates.lat, r.coordinates.lng], Math.max(m.getZoom(), 14), {
      duration: 0.8,
    });
    const t = window.setTimeout(() => {
      suppressMoveRef.current = false;
    }, 1100);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, ready]);

  const previewId = hoverId || selectedId;
  const preview = showPreview && previewId
    ? residences.find((r) => r.id === previewId)
    : null;

  const hasFeatured = featuredPins && residences.some((r) => r.featured);

  return (
    <div
      style={{ position: 'relative', height, width: '100%' }}
      className={'balto-mapview' + (showLegend ? ' has-legend' : '')}
    >
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', background: '#F4F1EA' }}
      />

      {onSearchArea && areaDirty && (
        <button
          type="button"
          className="map-search-area"
          onClick={() => {
            const m = mapRef.current;
            if (!m) return;
            const b = m.getBounds();
            onSearchArea({
              north: b.getNorth(),
              south: b.getSouth(),
              east: b.getEast(),
              west: b.getWest(),
            });
            setAreaDirty(false);
          }}
        >
          {SITE.map.searchAreaLabel} <SearchIcon size={13} />
        </button>
      )}

      {showLegend && (
        <div className="map-legend">
          <span>
            <PinGlyph variant="default" /> {SITE.map.legendAvailable}
          </span>
          {/* Only keyed when there is actually a gold pin on the map. */}
          {hasFeatured && (
            <span>
              <PinGlyph variant="featured" /> {SITE.map.legendFeatured}
            </span>
          )}
        </div>
      )}

      {preview && (
        <div
          className="map-preview-card"
          onClick={() => onSelect?.(preview.id, true)}
        >
          <div className="thumb">
            {preview.heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview.heroImage}
                alt={SITE.propertyCard.imageAlt.replace('{name}', preview.name)}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <PlaceholderImg label="" tone="warm">
                {preview.name.charAt(0)}
              </PlaceholderImg>
            )}
          </div>
          <div className="info">
            <Eyebrow style={{ fontSize: 9.5, marginBottom: 4 }}>
              {preview.cityLabel}
            </Eyebrow>
            <div
              className="serif"
              style={{
                fontWeight: 500,
                fontSize: 16,
                marginBottom: 4,
                lineHeight: 1.2,
              }}
            >
              {preview.name}
            </div>
            <div className="caption muted">
              {bedroomShort(preview.bedroomOptions)}
            </div>
            <div className="small serif" style={{ marginTop: 4 }}>
              {SITE.propertyCard.pricePrefix} {formatPrice(preview.priceFrom)}
              <span
                className="caption muted"
                style={{ fontFamily: 'var(--sans)' }}
              >
                {' '}{SITE.propertyCard.perMonthShortSuffix}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
