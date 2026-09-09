'use client';

/* BALTO CMS — Tenant portal: the resident sign-in list shown in the header
   dropdown and on /tenant-portal. Entries are fully client-managed — add a
   building, rename it, re-order the list, or remove one without a deploy.
   Edits content/tenant-portal.json. */

import { useEffect, useMemo, useState } from 'react';
import { getContent, putContent } from '@/components/admin/api';
import {
  IconArrowDown,
  IconArrowUp,
  IconExternal,
  IconGrip,
  IconPlus,
  IconSpinner,
  IconTrash,
} from '@/components/admin/icons';
import { ConfirmDialog, Field, PageHead, useToast } from '@/components/admin/ui';

interface Entry {
  id: string;
  label: string;
  address: string;
  url: string;
}

interface TenantPortal {
  eyebrow: string;
  title: string;
  intro: string;
  /** Label on each building's sign-in link. */
  signInLabel: string;
  /** Shown on the page and in the header menu when there are no buildings. */
  emptyMessage: string;
  /** Header menu footer link through to the full page. */
  allPortalsLabel: string;
  /** Browser-tab title and search-result description for /tenant-portal. */
  meta: { title: string; description: string };
  entries: Entry[];
}

/** Stable key for an entry, derived from its name. Kept as a slug because the
 *  public site uses it as a React key and it reads well in the JSON file. */
function slugify(label: string): string {
  return label
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Give an entry an id no other row is using. */
function uniqueId(base: string, taken: Set<string>): string {
  const root = base || 'portal';
  if (!taken.has(root)) return root;
  let n = 2;
  while (taken.has(root + '-' + n)) n += 1;
  return root + '-' + n;
}

const isHttpUrl = (v: string): boolean => /^https?:\/\/\S+$/i.test(v.trim());

export default function TenantPortalPage() {
  const toast = useToast();
  const [snapshot, setSnapshot] = useState<TenantPortal | null>(null);
  const [value, setValue] = useState<TenantPortal | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<number | null>(null);
  const [drag, setDrag] = useState<{ from: number; over: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getContent<Partial<TenantPortal>>('tenant-portal')
      .then((data) => {
        if (cancelled) return;
        const loaded: TenantPortal = {
          eyebrow: data?.eyebrow ?? '',
          title: data?.title ?? '',
          intro: data?.intro ?? '',
          signInLabel: data?.signInLabel ?? '',
          emptyMessage: data?.emptyMessage ?? '',
          allPortalsLabel: data?.allPortalsLabel ?? '',
          meta: {
            title: data?.meta?.title ?? '',
            description: data?.meta?.description ?? '',
          },
          entries: Array.isArray(data?.entries) ? data.entries : [],
        };
        setSnapshot(loaded);
        setValue(loaded);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(
          err instanceof Error ? err.message : 'Failed to load the tenant portal.'
        );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const dirty = useMemo(
    () => !!value && !!snapshot && JSON.stringify(value) !== JSON.stringify(snapshot),
    [value, snapshot]
  );

  const entries = value?.entries ?? [];

  /* A row is publishable when it has a name and a real http(s) sign-in link —
     the label is the only thing the header dropdown can show, and the link is
     the only thing it does. Address is optional. */
  const rowErrors = entries.map((e) => ({
    label: e.label.trim() === '',
    url: !isHttpUrl(e.url),
  }));
  const valid = rowErrors.every((r) => !r.label && !r.url);

  const setDoc = (patch: Partial<TenantPortal>) =>
    setValue((v) => (v ? { ...v, ...patch } : v));

  const editEntry = (index: number, patch: Partial<Entry>) =>
    setValue((v) =>
      v
        ? {
            ...v,
            entries: v.entries.map((e, i) => (i === index ? { ...e, ...patch } : e)),
          }
        : v
    );

  const addEntry = () =>
    setValue((v) => {
      if (!v) return v;
      const taken = new Set(v.entries.map((e) => e.id));
      return {
        ...v,
        entries: [
          ...v.entries,
          { id: uniqueId('portal', taken), label: '', address: '', url: '' },
        ],
      };
    });

  const confirmRemove = () => {
    if (pendingRemove === null) return;
    setValue((v) =>
      v ? { ...v, entries: v.entries.filter((_, i) => i !== pendingRemove) } : v
    );
    setPendingRemove(null);
  };

  /** Order here is the order residents see, in both the header dropdown and
   *  the /tenant-portal page. */
  const move = (from: number, to: number) =>
    setValue((v) => {
      if (!v) return v;
      if (from < 0 || to < 0 || from >= v.entries.length || to >= v.entries.length) {
        return v;
      }
      if (from === to) return v;
      const next = [...v.entries];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return { ...v, entries: next };
    });

  const save = async () => {
    if (!value || !valid || busy) return;
    setBusy(true);
    /* Re-derive ids from the names on save so a renamed building gets a
       sensible id, while keeping every id unique. */
    const taken = new Set<string>();
    const cleaned: TenantPortal = {
      eyebrow: value.eyebrow.trim(),
      title: value.title.trim(),
      intro: value.intro.trim(),
      signInLabel: value.signInLabel.trim(),
      emptyMessage: value.emptyMessage.trim(),
      allPortalsLabel: value.allPortalsLabel.trim(),
      meta: {
        title: value.meta.title.trim(),
        description: value.meta.description.trim(),
      },
      entries: value.entries.map((e) => {
        const id = uniqueId(slugify(e.label) || slugify(e.id), taken);
        taken.add(id);
        return {
          id,
          label: e.label.trim(),
          address: e.address.trim(),
          url: e.url.trim(),
        };
      }),
    };
    try {
      await putContent('tenant-portal', cleaned);
      setValue(cleaned);
      setSnapshot(cleaned);
      toast('success', 'Tenant portal saved. Changes go live on the next deploy.');
    } catch (err) {
      toast(
        'error',
        err instanceof Error ? err.message : 'Could not save the tenant portal.'
      );
    } finally {
      setBusy(false);
    }
  };

  if (loadError) {
    return (
      <div className="adm-card">
        <div className="adm-empty">
          <div className="t">Something went wrong</div>
          <p>{loadError}</p>
        </div>
      </div>
    );
  }

  if (!value) return <p className="adm-muted">Loading…</p>;

  return (
    <>
      <PageHead
        eyebrow="Residents"
        title="Tenant portal"
        lede="The buildings residents can sign in to. These appear in the Tenant Portal dropdown in the site header and on the Tenant portal page, in the order below."
        actions={
          <button type="button" className="adm-btn ghost sm" onClick={addEntry}>
            <IconPlus />
            Add building
          </button>
        }
      />

      <div className="adm-card">
        <div className="adm-card-head">
          <div className="adm-card-title">Page introduction</div>
        </div>
        <div className="adm-card-pad">
          <div className="adm-form-grid">
            <Field
              label="Eyebrow (small label above the title)"
              help="Also used as the heading inside the header dropdown."
            >
              <input
                className="adm-input"
                value={value.eyebrow}
                onChange={(e) => setDoc({ eyebrow: e.target.value })}
              />
            </Field>
            <Field label="Title">
              <input
                className="adm-input"
                value={value.title}
                onChange={(e) => setDoc({ title: e.target.value })}
              />
            </Field>
            <Field label="Introduction" span2>
              <textarea
                className="adm-textarea"
                rows={3}
                value={value.intro}
                onChange={(e) => setDoc({ intro: e.target.value })}
              />
            </Field>
            <Field
              label="Sign-in link label"
              help="The link at the end of each building row. An arrow is drawn after it."
            >
              <input
                className="adm-input"
                value={value.signInLabel}
                onChange={(e) => setDoc({ signInLabel: e.target.value })}
              />
            </Field>
            <Field
              label="Header menu link label"
              help="The link at the foot of the Tenant Portal menu in the site header."
            >
              <input
                className="adm-input"
                value={value.allPortalsLabel}
                onChange={(e) => setDoc({ allPortalsLabel: e.target.value })}
              />
            </Field>
            <Field
              label="Message when no buildings are listed"
              help="Shown on this page and in the header menu until you add a building."
              span2
            >
              <textarea
                className="adm-textarea"
                rows={2}
                value={value.emptyMessage}
                onChange={(e) => setDoc({ emptyMessage: e.target.value })}
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="adm-card" style={{ marginTop: 22 }}>
        <div className="adm-card-head">
          <div className="adm-card-title">Search engine listing</div>
        </div>
        <div className="adm-card-pad">
          <div className="adm-form-grid">
            <Field
              label="Page title"
              help="Shown in the browser tab and as the blue headline in Google results."
            >
              <input
                className="adm-input"
                value={value.meta.title}
                onChange={(e) =>
                  setDoc({ meta: { ...value.meta, title: e.target.value } })
                }
              />
            </Field>
            <Field
              label="Search result description"
              help="The grey summary under the headline in Google results."
              span2
            >
              <textarea
                className="adm-textarea"
                rows={2}
                value={value.meta.description}
                onChange={(e) =>
                  setDoc({ meta: { ...value.meta, description: e.target.value } })
                }
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="adm-card" style={{ marginTop: 22 }}>
        <div className="adm-card-head">
          <div className="adm-card-title">Resident sign-in links</div>
          <span className="adm-muted">
            {entries.length} building{entries.length === 1 ? '' : 's'}
          </span>
        </div>

        {entries.length === 0 ? (
          <div className="adm-empty">
            <div className="t">No resident portals</div>
            <p>
              The header dropdown and the Tenant portal page both show a
              &lsquo;portals are being set up&rsquo; message until you add one.
            </p>
            <button
              type="button"
              className="adm-btn ghost sm"
              style={{ marginTop: 14 }}
              onClick={addEntry}
            >
              <IconPlus />
              Add building
            </button>
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th scope="col" aria-label="Reorder" style={{ width: 32 }} />
                <th scope="col">Building name</th>
                <th scope="col">City / address</th>
                <th scope="col">Sign-in link</th>
                <th scope="col" aria-label="Move" style={{ width: 76 }} />
                <th scope="col" aria-label="Remove" style={{ width: 44 }} />
              </tr>
            </thead>
            <tbody>
              {entries.map((row, i) => (
                <tr
                  key={i}
                  onDragOver={(e) => {
                    if (!drag) return;
                    e.preventDefault();
                    setDrag((d) => (d && d.over !== i ? { ...d, over: i } : d));
                  }}
                  onDrop={(e) => {
                    if (!drag) return;
                    e.preventDefault();
                    move(drag.from, i);
                    setDrag(null);
                  }}
                  style={{
                    opacity: drag?.from === i ? 0.4 : 1,
                    background:
                      drag && drag.over === i && drag.from !== i
                        ? 'rgba(184,150,90,0.12)'
                        : undefined,
                  }}
                >
                  <td style={{ width: 32, paddingRight: 0 }}>
                    <button
                      type="button"
                      className="adm-btn-bare"
                      aria-label={`Drag to reorder ${row.label.trim() || `building ${i + 1}`}`}
                      title="Drag to reorder"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = 'move';
                        setDrag({ from: i, over: i });
                      }}
                      onDragEnd={() => setDrag(null)}
                      style={{ cursor: 'grab' }}
                    >
                      <IconGrip />
                    </button>
                  </td>
                  <td>
                    <input
                      className="adm-input"
                      style={{ minWidth: 150 }}
                      value={row.label}
                      placeholder="Woodridge"
                      aria-label={`Building name, row ${i + 1}`}
                      aria-invalid={rowErrors[i]?.label || undefined}
                      onChange={(e) => editEntry(i, { label: e.target.value })}
                    />
                    {rowErrors[i]?.label && (
                      <span className="adm-error-text">Give this building a name.</span>
                    )}
                  </td>
                  <td>
                    <input
                      className="adm-input"
                      style={{ minWidth: 140 }}
                      value={row.address}
                      placeholder="Edmonton, AB"
                      aria-label={`City or address, row ${i + 1}`}
                      onChange={(e) => editEntry(i, { address: e.target.value })}
                    />
                  </td>
                  <td>
                    <div className="adm-row" style={{ gap: 6, alignItems: 'center' }}>
                      <input
                        className="adm-input adm-grow"
                        style={{ minWidth: 220 }}
                        value={row.url}
                        placeholder="https://…/userlogin.aspx"
                        aria-label={`Sign-in link, row ${i + 1}`}
                        aria-invalid={rowErrors[i]?.url || undefined}
                        onChange={(e) => editEntry(i, { url: e.target.value })}
                      />
                      {isHttpUrl(row.url) && (
                        <a
                          className="adm-btn-bare"
                          href={row.url.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open the sign-in page for ${row.label.trim() || `building ${i + 1}`}`}
                          title="Open this sign-in page"
                        >
                          <IconExternal />
                        </a>
                      )}
                    </div>
                    {rowErrors[i]?.url && (
                      <span className="adm-error-text">
                        Enter the full sign-in link, starting with https://
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="adm-row" style={{ gap: 2 }}>
                      <button
                        type="button"
                        className="adm-btn-bare"
                        disabled={i === 0}
                        aria-label={`Move ${row.label.trim() || `building ${i + 1}`} up`}
                        title="Move up"
                        onClick={() => move(i, i - 1)}
                      >
                        <IconArrowUp />
                      </button>
                      <button
                        type="button"
                        className="adm-btn-bare"
                        disabled={i === entries.length - 1}
                        aria-label={`Move ${row.label.trim() || `building ${i + 1}`} down`}
                        title="Move down"
                        onClick={() => move(i, i + 1)}
                      >
                        <IconArrowDown />
                      </button>
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="adm-btn-bare danger"
                      aria-label={`Remove ${row.label.trim() || `building ${i + 1}`}`}
                      title="Remove this building"
                      onClick={() => setPendingRemove(i)}
                    >
                      <IconTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {dirty && (
        <div className="adm-savebar">
          <span>You have unsaved changes</span>
          <div className="adm-row">
            <button
              type="button"
              className="adm-btn ghost"
              style={{
                borderColor: 'rgba(247,243,236,0.4)',
                color: 'var(--adm-ivory)',
                background: 'transparent',
              }}
              onClick={() => setValue(snapshot)}
            >
              Discard
            </button>
            <button
              type="button"
              className="adm-btn gold"
              disabled={!valid || busy}
              onClick={() => void save()}
            >
              {busy && <IconSpinner />}
              Save changes
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={pendingRemove !== null}
        title="Remove this building?"
        body={
          <>
            Residents will no longer see{' '}
            <strong>
              {entries[pendingRemove ?? 0]?.label.trim() || 'this building'}
            </strong>{' '}
            in the Tenant Portal menu. You can add it back at any time.
          </>
        }
        confirmLabel="Remove"
        danger
        onConfirm={confirmRemove}
        onCancel={() => setPendingRemove(null)}
      />
    </>
  );
}
