'use client';

/* BALTO CMS — Units & availability editor: the rows here power the public
   "Available suites" table and the advertised from-prices. Removing every
   row makes the site show "no suites available" for the building. */

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getContent, putContent } from '@/components/admin/api';
import { ConfirmDialog, PageHead, useToast } from '@/components/admin/ui';
import { PropertyTabs } from '@/components/admin/PropertyTabs';
import { Dropdown, type DropdownOption } from '@/components/ui/Dropdown';
import { IconPlus, IconSpinner, IconTrash } from '@/components/admin/icons';

interface Building {
  slug: string;
  name: string;
  address: string;
}

interface UnitRow {
  unit: string;
  type: string;
  rent: number;
  image?: string;
  images?: string[];
  applyUrl?: string;
}

interface Taxonomies {
  unitTypes: Array<{ label: string; bedrooms: number }>;
}

type UnitsRecord = Record<string, UnitRow[]>;

const FALLBACK_UNIT_TYPES = ['Studio', '1 Bedroom', '2 Bedroom', '3 Bedroom'];

export default function PropertyUnitsPage() {
  const { slug } = useParams<{ slug: string }>();
  const toast = useToast();

  const [buildings, setBuildings] = useState<Building[] | null>(null);
  const [record, setRecord] = useState<UnitsRecord>({});
  const [rows, setRows] = useState<UnitRow[]>([]);
  const [snapshot, setSnapshot] = useState<UnitRow[]>([]);
  const [unitTypes, setUnitTypes] = useState<string[]>(FALLBACK_UNIT_TYPES);
  const [pendingRemove, setPendingRemove] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getContent<Building[]>('buildings'),
      getContent<UnitsRecord>('units'),
      getContent<Taxonomies>('taxonomies'),
    ])
      .then(([b, u, tax]) => {
        if (cancelled) return;
        setBuildings(Array.isArray(b) ? b : []);
        const labels = (Array.isArray(tax?.unitTypes) ? tax.unitTypes : [])
          .map((t) => t?.label)
          .filter((l): l is string => typeof l === 'string' && l !== '');
        if (labels.length > 0) setUnitTypes(labels);
        const rec = u ?? {};
        setRecord(rec);
        const initial = Array.isArray(rec[slug]) ? rec[slug] : [];
        setRows(initial);
        setSnapshot(initial);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : 'Failed to load units.');
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const building = buildings?.find((b) => b.slug === slug);

  const dirty = JSON.stringify(rows) !== JSON.stringify(snapshot);
  const valid = rows.every((r) => r.unit.trim() !== '' && r.rent > 0);

  const editRow = (index: number, patch: Partial<UnitRow>) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const addUnit = () => {
    setRows((prev) => [
      ...prev,
      { unit: '', type: unitTypes.includes('1 Bedroom') ? '1 Bedroom' : unitTypes[0] ?? '', rent: 0 },
    ]);
  };

  /** Per-row options: keep an unknown legacy type selectable instead of blanking it. */
  const typeOptions = (current: string): DropdownOption[] => {
    const opts = unitTypes.map((t) => ({ value: t, label: t }));
    if (current && !unitTypes.includes(current)) opts.unshift({ value: current, label: current });
    return opts;
  };

  const confirmRemove = () => {
    if (pendingRemove === null) return;
    setRows((prev) => prev.filter((_, i) => i !== pendingRemove));
    setPendingRemove(null);
  };

  const save = async () => {
    if (!valid || busy) return;
    setBusy(true);
    const cleaned = rows.map((r) => {
      const next: UnitRow = { ...r, unit: r.unit.trim(), rent: Number(r.rent) || 0 };
      const applyUrl = r.applyUrl?.trim();
      if (applyUrl) next.applyUrl = applyUrl;
      else delete next.applyUrl;
      return next;
    });
    const nextRecord: UnitsRecord = { ...record };
    if (cleaned.length === 0) delete nextRecord[slug];
    else nextRecord[slug] = cleaned;
    try {
      await putContent('units', nextRecord);
      setRecord(nextRecord);
      setRows(cleaned);
      setSnapshot(cleaned);
      toast('success', 'Availability saved.');
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Could not save availability.');
    } finally {
      setBusy(false);
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
        eyebrow="Availability"
        title={`${building.name} — Units`}
        lede='These units power the "Available suites" table and the advertised from-prices on the website. Remove all units to show "no suites available".'
      />

      <div className="adm-card">
        {rows.length === 0 ? (
          <div className="adm-empty">
            <div className="t">No available suites</div>
            <p>
              The website shows &lsquo;There are no suites available at the
              moment.&rsquo; for this building.
            </p>
            <button
              type="button"
              className="adm-btn ghost sm"
              style={{ marginTop: 14 }}
              onClick={addUnit}
            >
              <IconPlus />
              Add unit
            </button>
          </div>
        ) : (
          <>
            <table className="adm-table">
              <thead>
                <tr>
                  <th scope="col">Unit #</th>
                  <th scope="col">Type</th>
                  <th scope="col">Monthly rent</th>
                  <th scope="col">Apply URL</th>
                  <th scope="col">Photos</th>
                  <th scope="col" aria-label="Remove" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    <td>
                      <input
                        className="adm-input"
                        style={{ width: 90 }}
                        value={row.unit}
                        aria-label={`Unit number, row ${i + 1}`}
                        onChange={(e) => editRow(i, { unit: e.target.value })}
                      />
                    </td>
                    <td>
                      <Dropdown
                        variant="admin"
                        ariaLabel={`Unit type, row ${i + 1}`}
                        style={{ width: 150 }}
                        value={row.type}
                        options={typeOptions(row.type)}
                        onChange={(type) => editRow(i, { type })}
                      />
                    </td>
                    <td>
                      <div className="adm-row" style={{ flexWrap: 'nowrap', gap: 8 }}>
                        <span className="adm-muted">$</span>
                        <input
                          type="number"
                          className="adm-input num"
                          style={{ width: 110 }}
                          min={0}
                          value={row.rent === 0 ? '' : row.rent}
                          aria-label={`Monthly rent, row ${i + 1}`}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            editRow(i, { rent: Number.isFinite(v) ? v : 0 });
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <input
                        type="url"
                        className="adm-input"
                        style={{ minWidth: 220 }}
                        placeholder="Optional — ZenRentals apply link"
                        value={row.applyUrl ?? ''}
                        aria-label={`Apply URL, row ${i + 1}`}
                        onChange={(e) => editRow(i, { applyUrl: e.target.value })}
                      />
                    </td>
                    <td>
                      <span className="adm-muted">
                        {row.images?.length
                          ? `${row.images.length} photo${row.images.length === 1 ? '' : 's'}`
                          : '—'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="adm-btn-bare"
                        aria-label={`Remove unit ${row.unit.trim() || `#${i + 1}`}`}
                        onClick={() => setPendingRemove(i)}
                      >
                        <IconTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '14px 24px' }}>
              <button type="button" className="adm-btn ghost sm" onClick={addUnit}>
                <IconPlus />
                Add unit
              </button>
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={pendingRemove !== null}
        title={`Remove unit ${
          pendingRemove !== null
            ? rows[pendingRemove]?.unit.trim() || `#${pendingRemove + 1}`
            : ''
        }?`}
        body="The website will stop advertising it immediately after you save."
        confirmLabel="Remove"
        danger
        onConfirm={confirmRemove}
        onCancel={() => setPendingRemove(null)}
      />

      {dirty && (
        <>
          {!valid && (
            <p className="adm-error-text" style={{ marginTop: 16, marginBottom: 0 }}>
              Every unit needs a unit number and a monthly rent above $0 before you
              can save.
            </p>
          )}
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
                onClick={() => setRows(snapshot)}
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
        </>
      )}
    </>
  );
}
