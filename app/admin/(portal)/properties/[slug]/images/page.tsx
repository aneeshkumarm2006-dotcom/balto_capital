'use client';

/* BALTO CMS — Property photo manager: upload photos, hide/show them on the
   public site, pick the hero image, tag photos, reorder the gallery, and
   write alt text. Hidden photos stay on disk and in this grid so they can
   be restored at any time. Every tile shows whether it is live on the
   website right now.

   Publish-once model: uploads only STAGE files and every action edits a
   local DRAFT. Nothing reaches the website until "Publish changes" sends
   the staged photos and the photos JSON as ONE commit (one deploy). */

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  commitStaged,
  getContent,
  uploadPhotos,
  type StagedFile,
} from '@/components/admin/api';
import { Field, PageHead, useToast } from '@/components/admin/ui';
import { PropertyTabs } from '@/components/admin/PropertyTabs';
import { ImageEditor } from '@/components/admin/ImageEditor';
import { Dropdown, type DropdownOption } from '@/components/ui/Dropdown';
import {
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconCrop,
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
  const [draft, setDraft] = useState<Photos>(EMPTY_ENTRY);
  const [snapshot, setSnapshot] = useState<Photos>(EMPTY_ENTRY);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  /* path → object URL for photos uploaded this session; in GitHub mode the
     real URL does not exist until publish, so tiles render from here. */
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const previewsRef = useRef<Record<string, string>>({});
  previewsRef.current = previews;
  const [photoTags, setPhotoTags] = useState<string[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [tagChoice, setTagChoice] = useState('');
  const [altDraft, setAltDraft] = useState('');
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [dragging, setDragging] = useState(false);
  /* Crop/rotate editor: path being edited (null = closed) + upload state. */
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [editBusy, setEditBusy] = useState(false);
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
        const rec = p ?? {};
        setRecord(rec);
        const entry = rec[slug] ?? EMPTY_ENTRY;
        setDraft(entry);
        setSnapshot(entry);
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
  }, [slug]);

  /* Free object URLs when the page unmounts. */
  useEffect(
    () => () => {
      for (const url of Object.values(previewsRef.current)) URL.revokeObjectURL(url);
    },
    []
  );

  const building = buildings?.find((b) => b.slug === slug);
  const hideGallery = building?.hideDetailGallery === true;

  const items = Array.from(
    new Set([...(draft.hero ? [draft.hero] : []), ...(draft.gallery ?? [])])
  );
  const hiddenSet = new Set(draft.hidden ?? []);
  const hiddenCount = items.filter((p) => hiddenSet.has(p)).length;
  const liveCount = items.filter(
    (p) => !hiddenSet.has(p) && (p === draft.hero || !hideGallery)
  ).length;

  /* Photos not in the last published snapshot are "New" until published. */
  const snapshotSet = new Set([
    ...(snapshot.hero ? [snapshot.hero] : []),
    ...(snapshot.gallery ?? []),
  ]);
  const newCount = items.filter((p) => !snapshotSet.has(p)).length;

  const dirty = JSON.stringify(draft) !== JSON.stringify(snapshot);

  const singleSelection = selected.size === 1 ? Array.from(selected)[0] : null;

  /* Keep the alt-text draft in sync with the currently selected photo. */
  useEffect(() => {
    setAltDraft(singleSelection !== null ? draft.alt?.[singleSelection] ?? '' : '');
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

  /** Every action edits the draft only — nothing is saved until publish. */
  const applyEntry = (next: Photos, keepSelection = false) => {
    setDraft(next);
    if (!keepSelection) setSelected(new Set());
  };

  const hideSelected = () => {
    if (selected.size === 0) return;
    const hidden = Array.from(new Set([...(draft.hidden ?? []), ...selected]));
    applyEntry({ ...draft, hidden });
  };

  const showSelected = () => {
    if (selected.size === 0) return;
    const hidden = (draft.hidden ?? []).filter((path) => !selected.has(path));
    applyEntry({ ...draft, hidden });
  };

  const canSetHero = singleSelection !== null && !hiddenSet.has(singleSelection);

  const setAsHero = () => {
    if (!canSetHero || singleSelection === null) return;
    const gallery = (draft.gallery ?? []).filter((path) => path !== singleSelection);
    if (draft.hero && draft.hero !== singleSelection && !gallery.includes(draft.hero)) {
      gallery.unshift(draft.hero);
    }
    applyEntry({ ...draft, hero: singleSelection, gallery });
  };

  /* ---------- Tags ---------- */

  const tagOptions: DropdownOption[] = [
    { value: '', label: 'No tag' },
    ...photoTags.map((t) => ({ value: t, label: t })),
  ];

  const applyTag = () => {
    if (selected.size === 0) return;
    const tags = { ...(draft.tags ?? {}) };
    for (const path of selected) {
      if (tagChoice === '') delete tags[path];
      else tags[path] = tagChoice;
    }
    const next: Photos = { ...draft };
    if (Object.keys(tags).length > 0) next.tags = tags;
    else delete next.tags;
    applyEntry(next);
  };

  /* ---------- Reorder (single gallery photo, not the hero) ---------- */

  const galleryIndex =
    singleSelection !== null && singleSelection !== draft.hero
      ? (draft.gallery ?? []).indexOf(singleSelection)
      : -1;
  const canMoveEarlier = galleryIndex > 0;
  const canMoveLater =
    galleryIndex >= 0 && galleryIndex < (draft.gallery ?? []).length - 1;

  const moveSelected = (delta: -1 | 1) => {
    if (galleryIndex < 0) return;
    const target = galleryIndex + delta;
    const gallery = [...(draft.gallery ?? [])];
    if (target < 0 || target >= gallery.length) return;
    const a = gallery[galleryIndex];
    gallery[galleryIndex] = gallery[target];
    gallery[target] = a;
    applyEntry({ ...draft, gallery }, true);
  };

  /* ---------- Alt text ---------- */

  const applyAlt = () => {
    if (singleSelection === null) return;
    const alt = { ...(draft.alt ?? {}) };
    const trimmed = altDraft.trim();
    if (trimmed) alt[singleSelection] = trimmed;
    else delete alt[singleSelection];
    const next: Photos = { ...draft };
    if (Object.keys(alt).length > 0) next.alt = alt;
    else delete next.alt;
    applyEntry(next, true);
  };

  /* ---------- Crop / rotate (stage only, like uploads) ---------- */

  /** The editor exports a new file; upload it as a staged photo and swap
   *  the old path for the new one everywhere in the draft. The old file
   *  stays on disk/in the repo — harmless. */
  const applyEditedPhoto = async (file: File) => {
    if (editingPath === null || editBusy) return;
    const oldPath = editingPath;
    setEditBusy(true);
    try {
      const result = await uploadPhotos(slug, [file]);
      const newPath = result.added[0];
      if (!newPath) throw new Error('Upload did not return a photo path.');
      setDraft((prev) => {
        const next: Photos = {
          ...prev,
          hero: prev.hero === oldPath ? newPath : prev.hero,
          gallery: (prev.gallery ?? []).map((p) => (p === oldPath ? newPath : p)),
        };
        if (prev.hidden) {
          next.hidden = prev.hidden.map((p) => (p === oldPath ? newPath : p));
        }
        if (prev.tags && prev.tags[oldPath] !== undefined) {
          const tags = { ...prev.tags };
          tags[newPath] = tags[oldPath];
          delete tags[oldPath];
          next.tags = tags;
        }
        if (prev.alt && prev.alt[oldPath] !== undefined) {
          const alt = { ...prev.alt };
          alt[newPath] = alt[oldPath];
          delete alt[oldPath];
          next.alt = alt;
        }
        return next;
      });
      setStagedFiles((prev) => [...prev, ...result.staged]);
      setPreviews((prev) => {
        const next = { ...prev };
        const oldUrl = next[oldPath];
        if (oldUrl) {
          URL.revokeObjectURL(oldUrl);
          delete next[oldPath];
        }
        next[newPath] = URL.createObjectURL(file);
        return next;
      });
      setSelected(new Set([newPath]));
      setEditingPath(null);
      toast('success', 'Photo edited — publish to make it live.');
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Could not save the edited photo.');
    } finally {
      setEditBusy(false);
    }
  };

  /* ---------- Upload (stage only) ---------- */

  const handleFiles = async (list: FileList | File[] | null) => {
    const files = Array.from(list ?? []).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0 || uploading) return;
    setUploading(true);
    try {
      const result = await uploadPhotos(slug, files);
      setDraft((prev) => ({
        ...prev,
        hero: prev.hero ?? result.added[0] ?? null,
        gallery: [...(prev.gallery ?? []), ...result.added],
      }));
      setStagedFiles((prev) => [...prev, ...result.staged]);
      /* added[i] corresponds to files[i] — build local previews so the
         tiles render before the photos exist on the website. */
      setPreviews((prev) => {
        const next = { ...prev };
        result.added.forEach((path, i) => {
          const file = files[i];
          if (file) next[path] = URL.createObjectURL(file);
        });
        return next;
      });
      const n = result.added.length;
      toast(
        'success',
        `${n} photo${n === 1 ? '' : 's'} added — press Publish changes to put ${
          n === 1 ? 'it' : 'them'
        } on the website.`
      );
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  /* ---------- Publish / discard ---------- */

  const discard = () => {
    setDraft(snapshot);
    setSelected(new Set());
    setStagedFiles([]);
    for (const url of Object.values(previews)) URL.revokeObjectURL(url);
    setPreviews({});
  };

  const publish = async () => {
    if (publishing) return;
    setPublishing(true);
    const nextRecord: PhotoRecord = { ...record, [slug]: draft };
    try {
      await commitStaged({
        message: `update photos for ${slug}`,
        files: stagedFiles,
        content: [{ name: 'photos', data: nextRecord }],
      });
      setRecord(nextRecord);
      setSnapshot(draft);
      /* Keep previews so freshly published tiles still render until reload. */
      setStagedFiles([]);
      toast('success', 'Published — the website updates in about 2 minutes.');
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Could not publish photo changes.');
    } finally {
      setPublishing(false);
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
        lede="Select photos to hide or show them on the website. Hidden photos stay here and can be restored anytime — the website keeps its layout with beige placeholder cards even if everything is hidden. Nothing changes on the website until you press Publish changes."
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
            const isHero = path === draft.hero;
            const isHidden = hiddenSet.has(path);
            const isSelected = selected.has(path);
            const isNew = !snapshotSet.has(path);
            const isLive = !isHidden && (isHero || !hideGallery);
            const galleryOff = !isHidden && !isLive;
            const tag = draft.tags?.[path];
            const label = `Photo ${i + 1}${isHero ? ', hero' : ''}${
              isNew ? ', new — not yet published' : ''
            }${
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
                <img src={previews[path] ?? path} alt="" loading="lazy" />
                <span className="adm-photo-check">
                  <IconCheck />
                </span>
                <span className="adm-photo-flags">
                  {isHero && <span className="adm-photo-flag gold">Hero</span>}
                  {isNew && <span className="adm-photo-flag gold">New</span>}
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
            help="Describes the selected photo for screen readers and search engines. Applied to your draft — publish to put it live."
          >
            <div className="adm-row" style={{ flexWrap: 'nowrap', gap: 8 }}>
              <input
                className="adm-input"
                value={altDraft}
                placeholder="e.g. Renovated kitchen with stainless appliances"
                onChange={(e) => setAltDraft(e.target.value)}
              />
              <button type="button" className="adm-btn sm" onClick={applyAlt}>
                Apply
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
          {singleSelection !== null && (
            <button
              type="button"
              className="adm-btn"
              onClick={() => setEditingPath(singleSelection)}
            >
              <IconCrop />
              Edit photo
            </button>
          )}
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

      {(dirty || stagedFiles.length > 0) && (
        <div className="adm-savebar">
          <span>
            You have unpublished changes
            {newCount > 0 ? ` · ${newCount} new photo${newCount === 1 ? '' : 's'}` : ''}
          </span>
          <div className="adm-row">
            <button
              type="button"
              className="adm-btn ghost"
              style={{
                borderColor: 'rgba(247,243,236,0.4)',
                color: 'var(--adm-ivory)',
                background: 'transparent',
              }}
              onClick={discard}
              disabled={publishing}
            >
              Discard
            </button>
            <button
              type="button"
              className="adm-btn gold"
              disabled={publishing}
              onClick={() => void publish()}
            >
              {publishing && <IconSpinner />}
              Publish changes
            </button>
          </div>
        </div>
      )}

      <ImageEditor
        open={editingPath !== null}
        src={editingPath !== null ? previews[editingPath] ?? editingPath : ''}
        filename={
          editingPath !== null ? editingPath.split('/').pop() ?? undefined : undefined
        }
        busy={editBusy}
        onCancel={() => {
          if (!editBusy) setEditingPath(null);
        }}
        onApply={applyEditedPhoto}
      />
    </>
  );
}
