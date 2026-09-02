'use client';

/* BALTO CMS — Pages: the site-copy editor for the four marketing pages
   (Homepage, About, Why Balto, Careers). Edits content/pages.json as ONE
   document: a single draft + snapshot spans all four tabs, so switching
   tabs never loses work and one Save publishes everything.

   The forms are driven by a section config (SECTION_TABS below) so each
   field carries a human label instead of its camelCase key. Array lengths
   are structural — the public layouts are designed for exactly N items —
   so lists render fixed, numbered sub-blocks with no add/remove. */

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  commitStaged,
  getContent,
  uploadLibraryFiles,
  type StagedFile,
} from '@/components/admin/api';
import { IconSpinner, IconUpload, IconX } from '@/components/admin/icons';
import { Field, PageHead, useToast } from '@/components/admin/ui';
import type { PagesContent } from '@/lib/pages';

/* ============================================================
   Draft helpers (path-based read/write on the pages document)
   ============================================================ */

type Path = ReadonlyArray<string | number>;

function getAt(obj: unknown, path: Path): unknown {
  let cur: unknown = obj;
  for (const key of path) {
    if (cur === null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string | number, unknown>)[key];
  }
  return cur;
}

function setAt<T>(obj: T, path: Path, value: string): T {
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

/** Counts strings anywhere in the document that are empty after trimming. */
function countEmpty(v: unknown): number {
  if (typeof v === 'string') return v.trim() === '' ? 1 : 0;
  if (Array.isArray(v)) return v.reduce((n: number, x) => n + countEmpty(x), 0);
  if (v !== null && typeof v === 'object') {
    return Object.values(v).reduce((n: number, x) => n + countEmpty(x), 0);
  }
  return 0;
}

/* ============================================================
   Section config — human labels, no raw keys shown to the client
   ============================================================ */

type Kind = 'input' | 'textarea' | 'textareaWide' | 'image';

interface FieldDef {
  key: string;
  label: string;
  kind: Kind;
  help?: string;
}

interface ListDef {
  key: string;
  itemLabel: string;
  /** Fields per item; omit when the items are plain strings. */
  fields?: FieldDef[];
  /** Control used for plain-string items (default 'input'). */
  stringKind?: Kind;
}

interface SectionDef {
  title: string;
  path: Path;
  fields?: FieldDef[];
  list?: ListDef;
  /** Fields rendered below the list (matches the on-page order). */
  fieldsAfter?: FieldDef[];
}

interface TabDef {
  id: 'home' | 'about' | 'whyBalto' | 'careers';
  label: string;
  sections: SectionDef[];
}

const EYEBROW: FieldDef = {
  key: 'eyebrow',
  label: 'Eyebrow (small label above the title)',
  kind: 'input',
};
const TITLE: FieldDef = { key: 'title', label: 'Title', kind: 'input' };

const SECTION_TABS: TabDef[] = [
  {
    id: 'home',
    label: 'Homepage',
    sections: [
      {
        title: 'Hero',
        path: ['home', 'hero'],
        fields: [
          EYEBROW,
          TITLE,
          { key: 'subtitle', label: 'Subtitle', kind: 'textareaWide' },
          { key: 'searchButton', label: 'Search button label', kind: 'input' },
          {
            key: 'disclaimer',
            label: 'Pricing disclaimer (fine print under the search button)',
            kind: 'textarea',
          },
          { key: 'image', label: 'Hero image', kind: 'image' },
        ],
      },
      {
        title: 'Our cities',
        path: ['home', 'cities'],
        fields: [
          EYEBROW,
          TITLE,
          { key: 'blurb', label: 'Blurb', kind: 'textareaWide' },
          { key: 'comingSoonBadge', label: 'Coming-soon badge', kind: 'input' },
          { key: 'comingSoonCta', label: 'Coming-soon link label', kind: 'input' },
          { key: 'liveCta', label: 'Live-city link label', kind: 'input' },
        ],
      },
      {
        title: 'Featured residences',
        path: ['home', 'featured'],
        fields: [
          EYEBROW,
          TITLE,
          { key: 'viewAllLabel', label: 'View-all button label', kind: 'input' },
        ],
      },
      {
        title: 'Benefits (why rent with Balto)',
        path: ['home', 'benefits'],
        fields: [
          EYEBROW,
          TITLE,
          { key: 'subtitle', label: 'Subtitle', kind: 'textareaWide' },
        ],
        list: {
          key: 'items',
          itemLabel: 'Benefit',
          fields: [
            TITLE,
            { key: 'body', label: 'Body', kind: 'textarea' },
          ],
        },
      },
      {
        title: 'How to rent',
        path: ['home', 'steps'],
        fields: [EYEBROW, TITLE],
        list: { key: 'items', itemLabel: 'Step', stringKind: 'input' },
      },
      {
        title: 'Our story',
        path: ['home', 'story'],
        fields: [
          EYEBROW,
          TITLE,
          { key: 'paragraph', label: 'Paragraph', kind: 'textareaWide' },
          { key: 'image', label: 'Story image', kind: 'image' },
        ],
        list: {
          key: 'timeline',
          itemLabel: 'Timeline entry',
          fields: [
            { key: 'year', label: 'Year', kind: 'input' },
            { key: 'label', label: 'Label', kind: 'input' },
          ],
        },
        fieldsAfter: [{ key: 'ctaLabel', label: 'Button label', kind: 'input' }],
      },
      {
        title: 'Call to action',
        path: ['home', 'cta'],
        fields: [
          EYEBROW,
          TITLE,
          { key: 'body', label: 'Body', kind: 'textareaWide' },
          { key: 'primaryLabel', label: 'Primary button label', kind: 'input' },
          { key: 'secondaryLabel', label: 'Secondary button label', kind: 'input' },
        ],
      },
    ],
  },
  {
    id: 'about',
    label: 'About',
    sections: [
      {
        title: 'Hero',
        path: ['about', 'hero'],
        fields: [
          EYEBROW,
          {
            key: 'titleItalic',
            label: 'Title — italic part',
            kind: 'input',
            help: 'Rendered in italics before the rest of the title.',
          },
          { key: 'titleRest', label: 'Title — remaining part', kind: 'input' },
          { key: 'subtitle', label: 'Subtitle', kind: 'textareaWide' },
          { key: 'image', label: 'Hero video poster image', kind: 'image' },
        ],
      },
      {
        title: 'Our story',
        path: ['about', 'story'],
        fields: [
          EYEBROW,
          { key: 'lead', label: 'Lead paragraph', kind: 'textareaWide' },
        ],
        list: {
          key: 'cards',
          itemLabel: 'Card',
          fields: [
            { key: 'numeral', label: 'Numeral (I, II, III…)', kind: 'input' },
            { key: 'eyebrow', label: 'Eyebrow', kind: 'input' },
            { key: 'quote', label: 'Quote', kind: 'textareaWide' },
            { key: 'body', label: 'Body', kind: 'textareaWide' },
          ],
        },
        fieldsAfter: [
          { key: 'close', label: 'Closing paragraph', kind: 'textareaWide' },
        ],
      },
      {
        title: 'Standards',
        path: ['about', 'standards'],
        fields: [EYEBROW, TITLE],
        list: { key: 'items', itemLabel: 'Standard', stringKind: 'textarea' },
      },
      {
        title: 'Figures',
        path: ['about', 'figures'],
        fields: [
          EYEBROW,
          TITLE,
          { key: 'blurb', label: 'Blurb', kind: 'textareaWide' },
        ],
        list: {
          key: 'items',
          itemLabel: 'Figure',
          fields: [
            { key: 'value', label: 'Value (the large number)', kind: 'input' },
            { key: 'label', label: 'Label', kind: 'input' },
            { key: 'body', label: 'Body', kind: 'textarea' },
          ],
        },
      },
      {
        title: 'Call to action',
        path: ['about', 'cta'],
        fields: [
          EYEBROW,
          TITLE,
          { key: 'buttonLabel', label: 'Button label', kind: 'input' },
        ],
      },
    ],
  },
  {
    id: 'whyBalto',
    label: 'Why Balto',
    sections: [
      {
        title: 'Hero',
        path: ['whyBalto', 'hero'],
        fields: [
          EYEBROW,
          TITLE,
          { key: 'image', label: 'Hero background image', kind: 'image' },
        ],
      },
      {
        title: 'Introduction',
        path: ['whyBalto', 'intro'],
        fields: [
          { key: 'pullQuote', label: 'Pull quote', kind: 'textareaWide' },
          { key: 'attribution', label: 'Quote attribution', kind: 'input' },
          { key: 'paragraph1', label: 'First paragraph', kind: 'textareaWide' },
          { key: 'paragraph2', label: 'Second paragraph', kind: 'textareaWide' },
        ],
      },
      {
        title: 'Pillars',
        path: ['whyBalto'],
        list: {
          key: 'pillars',
          itemLabel: 'Pillar',
          fields: [
            { key: 'eyebrow', label: 'Eyebrow (numeral and theme)', kind: 'input' },
            TITLE,
            { key: 'body', label: 'Body', kind: 'textareaWide' },
            { key: 'image', label: 'Pillar image', kind: 'image' },
          ],
        },
      },
      {
        title: 'Statistics',
        path: ['whyBalto'],
        list: {
          key: 'stats',
          itemLabel: 'Stat',
          fields: [
            { key: 'value', label: 'Value (the large number)', kind: 'input' },
            { key: 'label', label: 'Label', kind: 'input' },
          ],
        },
      },
      {
        title: 'Call to action',
        path: ['whyBalto', 'cta'],
        fields: [
          TITLE,
          { key: 'buttonLabel', label: 'Button label', kind: 'input' },
        ],
      },
    ],
  },
  {
    id: 'careers',
    label: 'Careers',
    sections: [
      {
        title: 'Hero',
        path: ['careers', 'hero'],
        fields: [
          EYEBROW,
          TITLE,
          { key: 'subtitle', label: 'Subtitle', kind: 'textareaWide' },
        ],
      },
      {
        title: 'Openings',
        path: ['careers', 'openings'],
        fields: [
          EYEBROW,
          TITLE,
          {
            key: 'noOpeningsMessage',
            label: 'No-openings message (also shown in the top navigation)',
            kind: 'textarea',
          },
          {
            key: 'contactIntro',
            label: 'Contact line (shown before the email address)',
            kind: 'textarea',
          },
          { key: 'buttonLabel', label: 'Button label', kind: 'input' },
        ],
      },
      {
        title: 'Key benefits',
        path: ['careers', 'benefits'],
        fields: [EYEBROW, TITLE],
        list: { key: 'items', itemLabel: 'Benefit', stringKind: 'input' },
      },
    ],
  },
];

/* ============================================================
   Field + section renderers
   ============================================================ */

type UpdateFn = (path: Path, value: string) => void;

function CopyField({
  def,
  path,
  draft,
  onChange,
}: {
  def: FieldDef;
  path: Path;
  draft: PagesContent;
  onChange: UpdateFn;
}) {
  const full = [...path, def.key];
  const raw = getAt(draft, full);
  const value = typeof raw === 'string' ? raw : '';
  const empty = value.trim() === '';
  const wide = def.kind === 'textareaWide';
  return (
    <Field label={def.label} help={def.help} span2={wide} required>
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
}: {
  label: string;
  kind: Kind;
  path: Path;
  draft: PagesContent;
  onChange: UpdateFn;
}) {
  const raw = getAt(draft, path);
  const value = typeof raw === 'string' ? raw : '';
  const empty = value.trim() === '';
  return (
    <Field label={label} span2={kind === 'textareaWide'} required>
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
  draft: PagesContent;
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

function SectionCard({
  section,
  draft,
  onChange,
  controls,
}: {
  section: SectionDef;
  draft: PagesContent;
  onChange: UpdateFn;
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
              The design uses exactly {items.length} items — edit the text, the
              layout stays fixed.
            </p>
            {listFields ? (
              items.map((_, i) => (
                <div key={i} style={{ marginTop: 16 }}>
                  <span
                    className="adm-label"
                    style={{ display: 'block', marginBottom: 10 }}
                  >
                    {list.itemLabel} {i + 1}
                  </span>
                  <div className="adm-form-grid">
                    {listFields.map((f) => renderField(f, [...listPath, i]))}
                  </div>
                </div>
              ))
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
                  />
                ))}
              </div>
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
   Page
   ============================================================ */

export default function PagesPage() {
  const toast = useToast();
  const [snapshot, setSnapshot] = useState<PagesContent | null>(null);
  const [value, setValue] = useState<PagesContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<TabDef['id']>('home');
  /* Page-image editing: staged uploads publish alongside the pages JSON in one
     commit; previews render freshly-uploaded images before they're saved. */
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const previewsRef = useRef<Record<string, string>>({});
  previewsRef.current = previews;
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [pickerPath, setPickerPath] = useState<Path | null>(null);

  /* Free object URLs when the page unmounts. */
  useEffect(
    () => () => {
      for (const u of Object.values(previewsRef.current)) URL.revokeObjectURL(u);
    },
    []
  );

  useEffect(() => {
    let cancelled = false;
    getContent<PagesContent>('pages')
      .then((p) => {
        if (cancelled) return;
        setSnapshot(p);
        setValue(p);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load page copy.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const dirty = useMemo(
    () => !!value && !!snapshot && JSON.stringify(value) !== JSON.stringify(snapshot),
    [value, snapshot]
  );

  const emptyCount = useMemo(() => (value ? countEmpty(value) : 0), [value]);

  const update: UpdateFn = (path, v) =>
    setValue((cur) => (cur ? setAt(cur, path, v) : cur));

  const uploadImage = async (path: Path, file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploadingKey(JSON.stringify(path));
    try {
      const result = await uploadLibraryFiles([file]);
      const added = result.added[0];
      if (!added) throw new Error('Upload did not return an image path.');
      setValue((cur) => (cur ? setAt(cur, path, added) : cur));
      setStagedFiles((prev) => [...prev, ...result.staged]);
      setPreviews((prev) => ({ ...prev, [added]: URL.createObjectURL(file) }));
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploadingKey(null);
    }
  };

  const controls: ImageControls = {
    previews,
    uploadingKey,
    onUpload: (path, file) => void uploadImage(path, file),
    onPick: (path) => setPickerPath(path),
  };

  const selectImage = (imgPath: string) => {
    setValue((cur) => (cur && pickerPath ? setAt(cur, pickerPath, imgPath) : cur));
    setPickerPath(null);
  };

  const save = async () => {
    if (!value || saving || emptyCount > 0) return;
    setSaving(true);
    try {
      await commitStaged({
        message: 'update pages',
        files: stagedFiles,
        content: [{ name: 'pages', data: value }],
      });
      setSnapshot(value);
      setStagedFiles([]);
      toast('success', 'Pages saved. Live in about 2 minutes on the deployed site.');
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Failed to save the pages.');
    } finally {
      setSaving(false);
    }
  };

  const head = (
    <PageHead
      eyebrow="Site copy"
      title="Pages"
      lede="Edit the wording of the Homepage, About, Why Balto and Careers pages; layout and photos stay as designed."
    />
  );

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

  if (!value) {
    return (
      <>
        {head}
        <p className="adm-muted">Loading…</p>
      </>
    );
  }

  const active = SECTION_TABS.find((t) => t.id === tab) ?? SECTION_TABS[0];

  return (
    <>
      {head}

      <div className="adm-tabs" role="tablist" aria-label="Pages">
        {SECTION_TABS.map((t) => (
          <button
            key={t.id}
            id={`pages-tab-${t.id}`}
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`pages-panel-${t.id}`}
            className={`adm-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`pages-panel-${active.id}`}
        aria-labelledby={`pages-tab-${active.id}`}
      >
        {active.sections.map((s) => (
          <SectionCard
            key={s.title}
            section={s}
            draft={value}
            onChange={update}
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
                {emptyCount === 1
                  ? '1 field is empty'
                  : `${emptyCount} fields are empty`}
                {' — every field needs text before you can save.'}
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
