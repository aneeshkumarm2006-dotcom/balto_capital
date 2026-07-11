'use client';

/* BALTO CMS — Property photo manager: upload photos, hide/show them on the
   public site, pick the hero image, tag photos, reorder the gallery, and
   write alt text. Hidden photos stay on disk and in this grid so they can
   be restored at any time. Every tile shows whether it is live on the
   website right now. */

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { getContent, putContent, uploadPhotos } from '@/components/admin/api';
import { Field, PageHead, useToast } from '@/components/admin/ui';
import { PropertyTabs } from '@/components/admin/PropertyTabs';
import { Dropdown, type DropdownOption } from '@/components/ui/Dropdown';
import {
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconEye,
  IconEyeOff,
  IconSpinner,
  IconStar,
  IconUpload,
} from '@/components/admin/icons';

interface Building {
  slug: string;
  name: string;
  address: string;
  hideDetailGallery?: boolean;
}

interface Photos {
  hero: string | null;
  gallery: string[];
  hidden?: string[];
  tags?: Record<string, string>;
  alt?: Record<string, string>;
}

interface Taxonomies {
  photoTags: string[];
}

type PhotoRecord = Record<string, Photos>;

const EMPTY_ENTRY: Photos = { hero: null, gallery: [], hidden: [] };

export default function PropertyImagesPage() {
  const { slug } = useParams<{ slug: string }>();
  const toast = useToast();

  const [buildings, setBuildings] = useState<Building[] | null>(null);
  const [record, setRecord] = useState<PhotoRecord>({});
  const [photoTags, setPhotoTags] = useState<string[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [tagChoice, setTagChoice] = useState('');
  const [altDraft, setAltDraft] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getContent<Building[]>('buildings'),
      getContent<PhotoRecord>('photos'),
      getContent<Taxonomies>('taxonomies'),
    ])
      .then(([b, p, tax]) => {
        if (cancelled) return;
        setBuildings(Array.isArray(b) ? b : []);
        setRecord(p ?? {});
        setPhotoTags(
          Array.isArray(tax?.photoTags)
            ? tax.photoTags.filter((t): t is string => typeof t === 'string')
            : []
        );
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : 'Failed to load photos.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const building = buildings?.find((b) => b.slug === slug);
  const hideGallery = building?.hideDetailGallery === true;

  const entry = record[slug] ?? EMPTY_ENTRY;
  const items = Array.from(
    new Set([...(entry.hero ? [entry.hero] : []), ...(entry.gallery ?? [])])
  );
  const hiddenSet = new Set(entry.hidden ?? []);
  const hiddenCount = items.filter((p) => hiddenSet.has(p)).length;
  const liveCount = items.filter(
    (p) => !hiddenSet.has(p) && (p === entry.hero || !hideGallery)
  ).length;

  const singleSelection = selected.size === 1 ? Array.from(selected)[0] : null;

  /* Keep the alt-text draft in sync with the currently selected photo. */
  useEffect(() => {
    setAltDraft(
      singleSelection !== null ? record[slug]?.alt?.[singleSelection] ?? '' : ''
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleSelection, slug]);

  const toggleSelect = (path: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  /** Optimistic write of the whole photos record; re-fetches on failure. */
  const applyEntry = async (
    next: Photos,
    successMessage: string,
    keepSelection = false
  ) => {
    const previous = record;
    const nextRecord: PhotoRecord = { ...record, [slug]: next };
    setRecord(nextRecord);
    if (!keepSelection) setSelected(new Set());
    try {
      await putContent('photos', nextRecord);
      toast('success', successMessage);
    } catch (err) {
      try {
        const fresh = await getContent<PhotoRecord>('photos');
        setRecord(fresh ?? {});
      } catch {
        setRecord(previous);
      }
      toast('error', err instanceof Error ? err.message : 'Could not save photo changes.');
    }
  };

  const hideSelected = () => {
    const n = selected.size;
    if (n === 0) return;
    const hidden = Array.from(new Set([...(entry.hidden ?? []), ...selected]));
    void applyEntry(
      { ...entry, hidden },
      n === 1
        ? '1 photo hidden. It stays saved here and can be shown again anytime.'
        : `${n} photos hidden. They stay saved here and can be shown again anytime.`
    );
  };

  const showSelected = () => {
    const n = selected.size;
    if (n === 0) return;
    const hidden = (entry.hidden ?? []).filter((path) => !selected.has(path));
    void applyEntry(
      { ...entry, hidden },
      n === 1 ? '1 photo is now visible on the website.' : `${n} photos are now visible on the website.`
    );
  };

  const canSetHero = singleSelection !== null && !hiddenSet.has(singleSelection);

  const setAsHero = () => {
    if (!canSetHero || singleSelection === null) return;
    const gallery = (entry.gallery ?? []).filter((path) => path !== singleSelection);
    if (entry.hero && entry.hero !== singleSelection && !gallery.includes(entry.hero)) {
      gallery.unshift(entry.hero);
    }
    void applyEntry(
      { ...entry, hero: singleSelection, gallery },
      'Hero photo updated.'
    );
  };

  /* ---------- Tags ---------- */

  const tagOptions: DropdownOption[] = [
    { value: '', label: 'No tag' },
    ...photoTags.map((t) => ({ value: t, label: t })),
  ];

  const applyTag = () => {
    const n = selected.size;
    if (n === 0) return;
    const tags = { ...(entry.tags ?? {}) };
    for (const path of selected) {
      if (tagChoice === '') delete tags[path];
      else tags[path] = tagChoice;
    }
    const next: Photos = { ...entry };
    if (Object.keys(tags).length > 0) next.tags = tags;
    else delete next.tags;
    void applyEntry(
      next,
      tagChoice === ''
        ? `Tag cleared on ${n} photo${n === 1 ? '' : 's'}.`
        : `${n} photo${n === 1 ? '' : 's'} tagged “${tagChoice}”.`
    );
  };

  /* ---------- Reorder (single gallery photo, not the hero) ---------- */

  const galleryIndex =
    singleSelection !== null && singleSelection !== entry.hero
      ? (entry.gallery ?? []).indexOf(singleSelection)
      : -1;
  const canMoveEarlier = galleryIndex > 0;
  const canMoveLater =
    galleryIndex >= 0 && galleryIndex < (entry.gallery ?? []).length - 1;

  const moveSelected = (delta: -1 | 1) => {
    if (galleryIndex < 0) return;
    const target = galleryIndex + delta;
    const gallery = [...(entry.gallery ?? [])];
    if (target < 0 || target >= gallery.length) return;
    const a = gallery[galleryIndex];
    gallery[galleryIndex] = gallery[target];
    gallery[target] = a;
    void applyEntry(
      { ...entry, gallery },
      delta === -1 ? 'Photo moved earlier in the gallery.' : 'Photo moved later in the gallery.',
      true
    );
  };

  /* ---------- Alt text ---------- */

  const saveAlt = () => {
    if (singleSelection === null) return;
    const alt = { ...(entry.alt ?? {}) };
    const trimmed = altDraft.trim();
    if (trimmed) alt[singleSelection] = trimmed;
    else delete alt[singleSelection];
    const next: Photos = { ...entry };
    if (Object.keys(alt).length > 0) next.alt = alt;
    else delete next.alt;
    void applyEntry(next, 'Alt text saved.', true);
  };

  const handleFiles = async (list: FileList | File[] | null) => {
    const files = Array.from(list ?? []).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0 || uploading) return;
    setUploading(true);
    try {
      const added = await uploadPhotos(slug, files);
      const fresh = await getContent<PhotoRecord>('photos');
      setRecord(fresh ?? {});
      const n = added.length;
      toast('success', `${n} photo${n === 1 ? '' : 's'} uploaded.`);
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  if (loadError) {
    return (
      <>
        <PropertyTabs slug={slug} />
        <div className="adm-card">
          <div className="adm-empty">
            <div className="t">Something went wrong</div>
            <p>{loadError}</p>
          </div>
        </div>
      </>
    );
  }

  if (!buildings) {
    return (
      <>
        <PropertyTabs slug={slug} />
        <p className="adm-muted">Loading…</p>
      </>
    );
  }

  if (!building) {
    return (
      <>
        <PropertyTabs slug={slug} />
        <div className="adm-card">
          <div className="adm-empty">
            <div className="t">Property not found</div>
            <p>No building with this address exists in the portfolio.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PropertyTabs slug={slug} />
      <PageHead
        eyebrow="Photos"
        title={`${building.name} — Photos`}
        lede="Select photos to hide or show them on the website. Hidden photos stay here and can be restored anytime — the website keeps its layout with beige placeholder cards even if everything is hidden."
      />

      <div className="adm-row" style={{ marginBottom: 18 }}>
        <span className="adm-muted">
          {liveCount} live on website · {hiddenCount} hidden
          {hideGallery ? ' · gallery hidden on property page' : ''}
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        style={{ display: 'none' }}
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => void handleFiles(e.target.files)}
      />
      <button
        type="button"
        className={`adm-dropzone${dragging ? ' drag' : ''}`}
        style={{ width: '100%', marginBottom: 22 }}
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
      >
        {uploading ? <IconSpinner /> : <IconUpload />}
        <span>{uploading ? 'Uploading…' : 'Drag photos here or click to upload'}</span>
        <span className="adm-muted" style={{ fontSize: 12 }}>
          JPG or PNG · resized automatically
        </span>
      </button>

      {items.length === 0 ? (
        <div className="adm-card">
          <div className="adm-empty">
            <div className="t">No photos yet</div>
            <p>Upload photos above to start building this property&apos;s gallery.</p>
          </div>
        </div>
      ) : (
        <div className="adm-photo-grid">
          {items.map((path, i) => {
            const isHero = path === entry.hero;
            const isHidden = hiddenSet.has(path);
            const isSelected = selected.has(path);
            const isLive = !isHidden && (isHero || !hideGallery);
            const galleryOff = !isHidden && !isLive;
            const tag = entry.tags?.[path];
            const label = `Photo ${i + 1}${isHero ? ', hero' : ''}${
              isHidden ? ', hidden' : isLive ? ', on website' : ', gallery off'
            }${tag ? `, tagged ${tag}` : ''}${isSelected ? ', selected' : ''}`;
            return (
              <button
                key={path}
                type="button"
                className={`adm-photo${isSelected ? ' selected' : ''}${
                  isHidden ? ' is-hidden' : ''
                }`}
                aria-pressed={isSelected}
                aria-label={label}
                onClick={() => toggleSelect(path)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={path} alt="" loading="lazy" />
                <span className="adm-photo-check">
                  <IconCheck />
                </span>
                <span className="adm-photo-flags">
                  {isHero && <span className="adm-photo-flag gold">Hero</span>}
                  {isLive && <span className="adm-photo-flag live">On website</span>}
                  {isHidden && <span className="adm-photo-flag">Hidden</span>}
                  {galleryOff && <span className="adm-photo-flag">Gallery off</span>}
                  {tag && <span className="adm-photo-flag tag">{tag}</span>}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {singleSelection !== null && (
        <div className="adm-card adm-card-pad" style={{ marginTop: 22, maxWidth: 560 }}>
          <Field
            label="Alt text (accessibility & SEO)"
            help="Describes the selected photo for screen readers and search engines."
          >
            <div className="adm-row" style={{ flexWrap: 'nowrap', gap: 8 }}>
              <input
                className="adm-input"
                value={altDraft}
                placeholder="e.g. Renovated kitchen with stainless appliances"
                onChange={(e) => setAltDraft(e.target.value)}
              />
              <button type="button" className="adm-btn sm" onClick={saveAlt}>
                Save
              </button>
            </div>
          </Field>
        </div>
      )}

      {selected.size > 0 && (
        <div className="adm-selectbar">
          <span className="count">{selected.size} selected</span>
          <button type="button" className="adm-btn" onClick={hideSelected}>
            <IconEyeOff />
            Hide on website
          </button>
          <button type="button" className="adm-btn" onClick={showSelected}>
            <IconEye />
            Show on website
          </button>
          <button
            type="button"
            className="adm-btn"
            onClick={setAsHero}
            disabled={!canSetHero}
            title={
              canSetHero
                ? undefined
                : 'Select exactly one visible photo to set it as the hero.'
            }
          >
            <IconStar />
            Set as hero
          </button>
          {galleryIndex >= 0 && (
            <>
              <button
                type="button"
                className="adm-btn"
                aria-label="Move earlier"
                title="Move earlier"
                onClick={() => moveSelected(-1)}
                disabled={!canMoveEarlier}
              >
                <IconChevronLeft />
              </button>
              <button
                type="button"
                className="adm-btn"
                aria-label="Move later"
                title="Move later"
                onClick={() => moveSelected(1)}
                disabled={!canMoveLater}
              >
                <IconChevronRight />
              </button>
            </>
          )}
          <Dropdown
            variant="admin"
            ariaLabel="Tag for selected photos"
            value={tagChoice}
            options={tagOptions}
            onChange={setTagChoice}
            style={{ width: 200 }}
            menuStyle={{ maxHeight: 200 }}
          />
          <button type="button" className="adm-btn" onClick={applyTag}>
            Apply tag
          </button>
          <button
            type="button"
            className="adm-btn ghost"
            onClick={() => setSelected(new Set())}
          >
            Clear
          </button>
        </div>
      )}
    </>
  );
}
