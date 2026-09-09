'use client';

/* BALTO CMS - the shared content-editor engine.

   Every Studio screen that edits a content/*.json document as a form is built
   on this: give it a file name and a tab config and it handles loading, the
   draft/snapshot dirty state, per-field validation, image upload and Library
   picking, growable lists, and publishing (content + staged photos in ONE
   commit, so one save is one deploy).

   The config carries a human label for every field, so the client never sees
   a camelCase key. */

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  commitStaged,
  getContent,
  uploadLibraryFiles,
  type StagedFile,
} from './api';
import {
  IconArrowDown,
  IconArrowUp,
  IconPlus,
  IconSpinner,
  IconTrash,
  IconUpload,
  IconX,
} from './icons';
import { Field, PageHead, useToast } from './ui';

/** The edited document. Screens keep their own typed view of it; the engine
 *  only needs to walk it by path. Typed as an object rather than `unknown`
 *  so the useState updater overload still resolves. */
type Doc = Record<string, unknown>;

/* ============================================================
   Draft helpers (path-based read/write on the document)
   ============================================================ */

export type Path = ReadonlyArray<string | number>;

export function getAt(obj: unknown, path: Path): unknown {
  let cur: unknown = obj;
  for (const key of path) {
    if (cur === null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string | number, unknown>)[key];
  }
  return cur;
}

function setAt<T>(obj: T, path: Path, value: unknown): T {
  const head = path[0];
  if (head === undefined) return value as unknown as T;
  const rest = path.slice(1);
  if (Array.isArray(obj)) {
    const copy = [...(obj as unknown[])];
    copy[head as number] = setAt(copy[head as number], rest, value);
    return copy as unknown as T;
  }
  const rec = { ...(obj as Record<string | number, unknown>) };
  rec[head] = setAt(rec[head], rest, value);
  return rec as T;
}

/* Emptiness is judged against the CONFIG, not the whole document: only the
   fields a tab actually exposes are required, and a field marked `optional`
   is allowed to be blank. Walking the raw document instead would block Save
   on any empty string the editor does not even show. */
function countEmptyIn(doc: unknown, tabs: TabDef[]): number {
  let n = 0;
  const check = (path: Path, optional?: boolean) => {
    if (optional) return;
    const v = getAt(doc, path);
    if (typeof v === 'string' && v.trim() === '') n += 1;
  };
  for (const tab of tabs) {
    for (const s of tab.sections) {
      for (const f of s.fields ?? []) check([...s.path, f.key], f.optional);
      for (const f of s.fieldsAfter ?? []) check([...s.path, f.key], f.optional);
      const list = s.list;
      if (!list) continue;
      const listPath = [...s.path, list.key];
      const raw = getAt(doc, listPath);
      const items = Array.isArray(raw) ? raw : [];
      items.forEach((_, i) => {
        if (list.fields) {
          for (const f of list.fields) check([...listPath, i, f.key], f.optional);
        } else {
          check([...listPath, i], list.optional);
        }
      });
    }
  }
  return n;
}

/* ============================================================
   Section config — human labels, no raw keys shown to the client
   ============================================================ */

export type Kind = 'input' | 'textarea' | 'textareaWide' | 'image';

export interface FieldDef {
  key: string;
  label: string;
  kind: Kind;
  help?: string;
  /** Allowed to be blank. Use for genuinely optional copy (a note the client
   *  may not want, a social handle they do not have). */
  optional?: boolean;
}

export interface ListDef {
  key: string;
  itemLabel: string;
  /** Fields per item; omit when the items are plain strings. */
  fields?: FieldDef[];
  /** Control used for plain-string items (default 'input'). */
  stringKind?: Kind;
  /** When true the client can add, remove and re-order items. Leave off for
   *  lists whose count is fixed by the public layout. */
  growable?: boolean;
  /** Fewest items the section still renders correctly with (default 1). */
  min?: number;
  /** Most items the section can hold, when the layout has a ceiling. */
  max?: number;
  /** Sentence shown under the list on a growable section. */
  help?: string;
  /** Plain-string items are allowed to be blank. */
  optional?: boolean;
}

export interface SectionDef {
  title: string;
  path: Path;
  fields?: FieldDef[];
  list?: ListDef;
  /** Fields rendered below the list (matches the on-page order). */
  fieldsAfter?: FieldDef[];
}

export interface TabDef {
  /** Stable id — used for the tab's DOM ids and the active-tab state. */
  id: string;
  label: string;
  sections: SectionDef[];
}

export const EYEBROW: FieldDef = {
  key: 'eyebrow',
  label: 'Eyebrow (small label above the title)',
  kind: 'input',
};
export const TITLE: FieldDef = { key: 'title', label: 'Title', kind: 'input' };
/* ============================================================
   Field + section renderers
   ============================================================ */

type UpdateFn = (path: Path, value: string) => void;

/** Applies a whole-array replacement at `listPath` — used by add / remove /
 *  re-order on growable sections. */
type MutateListFn = (listPath: Path, next: (items: unknown[]) => unknown[]) => void;

/** A blank item matching the shape of an existing one, so a new row renders
 *  the same controls. Strings blank out; nested lists keep one blank entry so
 *  the item is still editable. */
function blankLike(sample: unknown): unknown {
  if (typeof sample === 'string') return '';
  if (typeof sample === 'number') return 0;
  if (typeof sample === 'boolean') return false;
  if (Array.isArray(sample)) {
    return sample.length > 0 ? [blankLike(sample[0])] : [];
  }
  if (sample !== null && typeof sample === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(sample)) out[k] = blankLike(v);
    return out;
  }
  return '';
}

/** Blank item built from the section config when the list is empty and there
 *  is no existing item to copy the shape from. */
function blankFromDef(list: ListDef): unknown {
  if (!list.fields) return '';
  const out: Record<string, unknown> = {};
  for (const f of list.fields) out[f.key] = '';
  return out;
}

function CopyField({
  def,
  path,
  draft,
  onChange,
}: {
  def: FieldDef;
  path: Path;
  draft: Doc;
  onChange: UpdateFn;
}) {
  const full = [...path, def.key];
  const raw = getAt(draft, full);
  const value = typeof raw === 'string' ? raw : '';
  /* Only a required field counts as "empty" - an optional one is allowed to be
     blank, so it shows neither the asterisk nor the error. */
  const empty = value.trim() === '' && !def.optional;
  const wide = def.kind === 'textareaWide';
  return (
    <Field label={def.label} help={def.help} span2={wide} required={!def.optional}>
      {def.kind === 'input' ? (
        <input
          className="adm-input"
          type="text"
          value={value}
          aria-invalid={empty || undefined}
          onChange={(e) => onChange(full, e.target.value)}
        />
      ) : (
        <textarea
          className="adm-textarea"
          value={value}
          aria-invalid={empty || undefined}
          onChange={(e) => onChange(full, e.target.value)}
        />
      )}
      {empty && <span className="adm-error-text">This field cannot be empty.</span>}
    </Field>
  );
}

function StringItemField({
  label,
  kind,
  path,
  draft,
  onChange,
  optional,
}: {
  label: string;
  kind: Kind;
  path: Path;
  draft: Doc;
  onChange: UpdateFn;
  optional?: boolean;
}) {
  const raw = getAt(draft, path);
  const value = typeof raw === 'string' ? raw : '';
  const empty = value.trim() === '' && !optional;
  return (
    <Field label={label} span2={kind === 'textareaWide'} required={!optional}>
      {kind === 'input' ? (
        <input
          className="adm-input"
          type="text"
          value={value}
          aria-invalid={empty || undefined}
          onChange={(e) => onChange(path, e.target.value)}
        />
      ) : (
        <textarea
          className="adm-textarea"
          value={value}
          aria-invalid={empty || undefined}
          onChange={(e) => onChange(path, e.target.value)}
        />
      )}
      {empty && <span className="adm-error-text">This field cannot be empty.</span>}
    </Field>
  );
}

/* ---------- Image field ---------- */

interface ImageControls {
  /** Local object-URLs for freshly uploaded (not-yet-saved) images. */
  previews: Record<string, string>;
  /** JSON.stringify(path) of the image currently uploading, or null. */
  uploadingKey: string | null;
  onUpload: (path: Path, file: File) => void;
  onPick: (path: Path) => void;
}

function ImageField({
  def,
  path,
  draft,
  controls,
}: {
  def: FieldDef;
  path: Path;
  draft: Doc;
  controls: ImageControls;
}) {
  const full = [...path, def.key];
  const raw = getAt(draft, full);
  const value = typeof raw === 'string' ? raw : '';
  const src = controls.previews[value] ?? value;
  const uploading = controls.uploadingKey === JSON.stringify(full);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Field label={def.label} help={def.help} span2>
      <div className="adm-row" style={{ gap: 16, alignItems: 'flex-start', flexWrap: 'nowrap' }}>
        <div
          style={{
            width: 132,
            height: 96,
            flex: 'none',
            border: '1px solid var(--adm-hairline)',
            background: 'var(--adm-cream, #efe8dc)',
            overflow: 'hidden',
          }}
        >
          {src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) controls.onUpload(full, f);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            className="adm-btn ghost sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? <IconSpinner /> : <IconUpload />}
            {uploading ? 'Uploading…' : 'Upload new'}
          </button>
          <button
            type="button"
            className="adm-btn ghost sm"
            onClick={() => controls.onPick(full)}
          >
            Choose from Library
          </button>
        </div>
      </div>
    </Field>
  );
}

/* ---------- Library image picker ---------- */

interface MediaItem {
  path: string;
  name: string;
  group: string;
}

function LibraryPicker({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
}) {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  useEffect(() => {
    if (!open) return;
    setItems(null);
    fetch('/api/admin/site-media', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d?.items) ? d.items : []))
      .catch(() => setItems([]));
  }, [open]);
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10,25,41,0.55)',
        zIndex: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--adm-bone, #fff)',
          width: 'min(900px, 96vw)',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          className="adm-card-head"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <h2 className="adm-card-title">Choose an image from the Library</h2>
          <button type="button" className="adm-btn-bare" aria-label="Close" onClick={onClose}>
            <IconX />
          </button>
        </div>
        <div style={{ padding: 20, overflowY: 'auto' }}>
          {items === null ? (
            <p className="adm-muted">
              <IconSpinner style={{ verticalAlign: '-0.15em', marginRight: 8 }} />
              Loading…
            </p>
          ) : items.length === 0 ? (
            <p className="adm-muted">No images in the Library yet. Upload one instead.</p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: 12,
              }}
            >
              {items.map((it) => (
                <button
                  key={it.path}
                  type="button"
                  onClick={() => onSelect(it.path)}
                  title={`${it.name} · ${it.group}`}
                  style={{
                    border: '1px solid var(--adm-hairline)',
                    background: 'var(--adm-cream, #efe8dc)',
                    padding: 0,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    textAlign: 'left',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.path}
                    alt=""
                    loading="lazy"
                    style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }}
                  />
                  <div
                    className="adm-caption"
                    style={{
                      padding: '6px 8px',
                      fontSize: 11,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {it.name}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Add / move / remove controls for one item of a growable list. */
function ListItemTools({
  index,
  count,
  itemLabel,
  canRemove,
  onMove,
  onRemove,
}: {
  index: number;
  count: number;
  itemLabel: string;
  canRemove: boolean;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="adm-row" style={{ gap: 2, alignItems: 'center' }}>
      <button
        type="button"
        className="adm-btn-bare"
        disabled={index === 0}
        aria-label={`Move ${itemLabel} ${index + 1} up`}
        title="Move up"
        onClick={() => onMove(index, index - 1)}
      >
        <IconArrowUp />
      </button>
      <button
        type="button"
        className="adm-btn-bare"
        disabled={index === count - 1}
        aria-label={`Move ${itemLabel} ${index + 1} down`}
        title="Move down"
        onClick={() => onMove(index, index + 1)}
      >
        <IconArrowDown />
      </button>
      <button
        type="button"
        className="adm-btn-bare danger"
        disabled={!canRemove}
        aria-label={`Remove ${itemLabel} ${index + 1}`}
        title={
          canRemove
            ? `Remove this ${itemLabel.toLowerCase()}`
            : `At least one ${itemLabel.toLowerCase()} is required`
        }
        onClick={() => onRemove(index)}
      >
        <IconTrash />
      </button>
    </div>
  );
}

function SectionCard({
  section,
  draft,
  onChange,
  onMutateList,
  controls,
}: {
  section: SectionDef;
  draft: Doc;
  onChange: UpdateFn;
  onMutateList: MutateListFn;
  controls: ImageControls;
}) {
  const renderField = (f: FieldDef, fieldPath: Path) =>
    f.kind === 'image' ? (
      <ImageField key={f.key} def={f} path={fieldPath} draft={draft} controls={controls} />
    ) : (
      <CopyField key={f.key} def={f} path={fieldPath} draft={draft} onChange={onChange} />
    );
  const list = section.list;
  const listFields = list?.fields;
  const listPath = list ? [...section.path, list.key] : null;
  const rawItems = listPath ? getAt(draft, listPath) : null;
  const items: unknown[] = Array.isArray(rawItems) ? rawItems : [];

  const growable = Boolean(list?.growable);
  const min = list?.min ?? 1;
  const max = list?.max;
  const canRemove = growable && items.length > min;
  const canAdd = growable && (max === undefined || items.length < max);

  const addItem = () => {
    if (!list || !listPath) return;
    onMutateList(listPath, (cur) => [
      ...cur,
      cur.length > 0 ? blankLike(cur[cur.length - 1]) : blankFromDef(list),
    ]);
  };

  const removeItem = (index: number) => {
    if (!listPath) return;
    onMutateList(listPath, (cur) => cur.filter((_, i) => i !== index));
  };

  const moveItem = (from: number, to: number) => {
    if (!listPath) return;
    onMutateList(listPath, (cur) => {
      if (from < 0 || to < 0 || from >= cur.length || to >= cur.length || from === to) {
        return cur;
      }
      const next = [...cur];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  return (
    <div className="adm-card" style={{ marginBottom: 22 }}>
      <div className="adm-card-head">
        <h2 className="adm-card-title">{section.title}</h2>
      </div>
      <div className="adm-card-pad">
        {section.fields && section.fields.length > 0 && (
          <div className="adm-form-grid">
            {section.fields.map((f) => renderField(f, section.path))}
          </div>
        )}

        {list && listPath && (
          <>
            <p
              className="adm-help"
              style={{ margin: section.fields ? '18px 0 0' : '0' }}
            >
              {growable
                ? list.help ??
                  `Add, re-order or remove ${list.itemLabel.toLowerCase()}s — the page follows this order.`
                : `The design uses exactly ${items.length} items — edit the text, the layout stays fixed.`}
            </p>

            {growable && items.length === 0 && (
              <p className="adm-muted" style={{ marginTop: 14 }}>
                This section is empty and will not appear on the website.
              </p>
            )}

            {listFields ? (
              items.map((_, i) => (
                <div key={i} style={{ marginTop: 16 }}>
                  <div
                    className="adm-row"
                    style={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <span className="adm-label" style={{ display: 'block' }}>
                      {list.itemLabel} {i + 1}
                    </span>
                    {growable && (
                      <ListItemTools
                        index={i}
                        count={items.length}
                        itemLabel={list.itemLabel}
                        canRemove={canRemove}
                        onMove={moveItem}
                        onRemove={removeItem}
                      />
                    )}
                  </div>
                  <div className="adm-form-grid">
                    {listFields.map((f) => renderField(f, [...listPath, i]))}
                  </div>
                </div>
              ))
            ) : growable ? (
              <div style={{ marginTop: 16 }}>
                {items.map((_, i) => (
                  <div
                    key={i}
                    className="adm-row"
                    style={{ gap: 10, alignItems: 'flex-start', marginBottom: 12 }}
                  >
                    <div className="adm-grow">
                      <StringItemField
                        label={`${list.itemLabel} ${i + 1}`}
                        kind={list.stringKind ?? 'input'}
                        path={[...listPath, i]}
                        draft={draft}
                        onChange={onChange}
                        optional={list.optional}
                      />
                    </div>
                    <div style={{ paddingTop: 22 }}>
                      <ListItemTools
                        index={i}
                        count={items.length}
                        itemLabel={list.itemLabel}
                        canRemove={canRemove}
                        onMove={moveItem}
                        onRemove={removeItem}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="adm-form-grid" style={{ marginTop: 16 }}>
                {items.map((_, i) => (
                  <StringItemField
                    key={i}
                    label={`${list.itemLabel} ${i + 1}`}
                    kind={list.stringKind ?? 'input'}
                    path={[...listPath, i]}
                    draft={draft}
                    onChange={onChange}
                    optional={list.optional}
                  />
                ))}
              </div>
            )}

            {growable && (
              <button
                type="button"
                className="adm-btn ghost sm"
                style={{ marginTop: 16 }}
                disabled={!canAdd}
                title={
                  canAdd
                    ? undefined
                    : `This section holds at most ${max} ${list.itemLabel.toLowerCase()}s.`
                }
                onClick={addItem}
              >
                <IconPlus />
                Add {list.itemLabel.toLowerCase()}
              </button>
            )}
          </>
        )}

        {section.fieldsAfter && section.fieldsAfter.length > 0 && (
          <div className="adm-form-grid" style={{ marginTop: 16 }}>
            {section.fieldsAfter.map((f) => renderField(f, section.path))}
          </div>
        )}
      </div>
    </div>
  );
}


/* ============================================================
   The editor
   ============================================================ */

export function ContentEditor({
  file,
  tabs,
  eyebrow,
  title,
  lede,
  commitMessage,
  savedMessage,
  intro,
}: {
  /** content/<file>.json — must be listed in lib/admin/store.ts. */
  file: string;
  tabs: TabDef[];
  eyebrow: string;
  title: string;
  lede?: string;
  /** Commit subject used when publishing. */
  commitMessage: string;
  /** Toast shown after a successful save. */
  savedMessage: string;
  /** Optional block rendered above the tabs. */
  intro?: ReactNode;
}) {
  const toast = useToast();
  const [snapshot, setSnapshot] = useState<Doc | null>(null);
  const [value, setValue] = useState<Doc | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<string>(tabs[0]?.id ?? '');
  /* Image editing: staged uploads publish alongside the JSON in one commit;
     previews render freshly-uploaded images before they are saved. */
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const previewsRef = useRef<Record<string, string>>({});
  previewsRef.current = previews;
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [pickerPath, setPickerPath] = useState<Path | null>(null);

  /* Free object URLs when the screen unmounts. */
  useEffect(
    () => () => {
      for (const u of Object.values(previewsRef.current)) URL.revokeObjectURL(u);
    },
    []
  );

  useEffect(() => {
    let cancelled = false;
    getContent<Doc>(file)
      .then((d) => {
        if (cancelled) return;
        setSnapshot(d);
        setValue(d);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load this content.');
      });
    return () => {
      cancelled = true;
    };
  }, [file]);

  const dirty = useMemo(
    () =>
      value !== null &&
      snapshot !== null &&
      JSON.stringify(value) !== JSON.stringify(snapshot),
    [value, snapshot]
  );

  const emptyCount = useMemo(
    () => (value === null ? 0 : countEmptyIn(value, tabs)),
    [value, tabs]
  );

  const update: UpdateFn = (path, v) =>
    setValue((cur) => (cur === null ? cur : setAt(cur, path, v)));

  const mutateList: MutateListFn = (listPath, next) =>
    setValue((cur) => {
      if (cur === null) return cur;
      const raw = getAt(cur, listPath);
      return setAt(cur, listPath, next(Array.isArray(raw) ? raw : []));
    });

  const uploadImage = async (path: Path, fileToUpload: File) => {
    if (!fileToUpload.type.startsWith('image/')) return;
    setUploadingKey(JSON.stringify(path));
    try {
      const result = await uploadLibraryFiles([fileToUpload]);
      const added = result.added[0];
      if (!added) throw new Error('Upload did not return an image path.');
      setValue((cur) => (cur === null ? cur : setAt(cur, path, added)));
      setStagedFiles((prev) => [...prev, ...result.staged]);
      setPreviews((prev) => ({ ...prev, [added]: URL.createObjectURL(fileToUpload) }));
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploadingKey(null);
    }
  };

  const controls: ImageControls = {
    previews,
    uploadingKey,
    onUpload: (path, f) => void uploadImage(path, f),
    onPick: (path) => setPickerPath(path),
  };

  const selectImage = (imgPath: string) => {
    setValue((cur) => (cur !== null && pickerPath ? setAt(cur, pickerPath, imgPath) : cur));
    setPickerPath(null);
  };

  const save = async () => {
    if (value === null || saving || emptyCount > 0) return;
    setSaving(true);
    try {
      await commitStaged({
        message: commitMessage,
        files: stagedFiles,
        content: [{ name: file, data: value }],
      });
      setSnapshot(value);
      setStagedFiles([]);
      toast('success', savedMessage);
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const head = <PageHead eyebrow={eyebrow} title={title} lede={lede} />;

  if (error) {
    return (
      <>
        {head}
        <div className="adm-card">
          <div className="adm-empty">
            <div className="t">Something went wrong</div>
            <p>{error}</p>
          </div>
        </div>
      </>
    );
  }

  if (value === null) {
    return (
      <>
        {head}
        <p className="adm-muted">Loading…</p>
      </>
    );
  }

  const active = tabs.find((t) => t.id === tab) ?? tabs[0];
  if (!active) {
    return (
      <>
        {head}
        <div className="adm-card">
          <div className="adm-empty">
            <div className="t">Nothing to edit here yet</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {head}
      {intro}

      {tabs.length > 1 && (
        <div className="adm-tabs" role="tablist" aria-label={title}>
          {tabs.map((t) => (
            <button
              key={t.id}
              id={'ce-tab-' + t.id}
              role="tab"
              aria-selected={active.id === t.id}
              aria-controls={'ce-panel-' + t.id}
              className={'adm-tab' + (active.id === t.id ? ' active' : '')}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div
        role="tabpanel"
        id={'ce-panel-' + active.id}
        aria-labelledby={'ce-tab-' + active.id}
      >
        {active.sections.map((s) => (
          <SectionCard
            key={s.title}
            section={s}
            draft={value}
            onChange={update}
            onMutateList={mutateList}
            controls={controls}
          />
        ))}
      </div>

      {(dirty || stagedFiles.length > 0) && (
        <div className="adm-savebar">
          <span>
            You have unsaved changes
            {emptyCount > 0 && (
              <span
                className="adm-error-text"
                style={{ display: 'block', marginTop: 4, color: '#e8a79b' }}
              >
                {emptyCount === 1 ? '1 field is empty' : emptyCount + ' fields are empty'}
                {' — every required field needs text before you can save.'}
              </span>
            )}
          </span>
          <div className="adm-row" style={{ flexWrap: 'nowrap' }}>
            <button
              className="adm-btn ghost"
              style={{
                borderColor: 'rgba(247,243,236,0.4)',
                color: 'var(--adm-ivory)',
                background: 'transparent',
              }}
              onClick={() => {
                setValue(snapshot);
                setStagedFiles([]);
                for (const u of Object.values(previews)) URL.revokeObjectURL(u);
                setPreviews({});
              }}
              disabled={saving}
            >
              Discard
            </button>
            <button
              className="adm-btn gold"
              onClick={() => void save()}
              disabled={saving || emptyCount > 0}
            >
              {saving && <IconSpinner />}
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      )}

      <LibraryPicker
        open={pickerPath !== null}
        onClose={() => setPickerPath(null)}
        onSelect={selectImage}
      />
    </>
  );
}
