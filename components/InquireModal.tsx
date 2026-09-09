'use client';
import { useEffect, useState, type FormEvent } from 'react';
import type { Residence } from '@/lib/data';
import { PAGES } from '@/lib/pages';
import { Eyebrow } from './Eyebrow';
import { CloseIcon } from './icons';

interface Props {
  open: boolean;
  onClose: () => void;
  residence: Residence;
}

export function InquireModal({ open, onClose, residence }: Props) {
  const [sent, setSent] = useState(false);
  useEffect(() => {
    if (!open) setSent(false);
  }, [open]);

  return (
    <div
      className={'modal-backdrop' + (open ? ' open' : '')}
      onClick={onClose}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button
          aria-label={PAGES.inquire.modal.closeAriaLabel}
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'transparent',
            border: 0,
          }}
        >
          <CloseIcon size={18} />
        </button>
        {!sent ? (
          <>
            <Eyebrow style={{ marginBottom: 14 }}>{PAGES.inquire.modal.eyebrow}</Eyebrow>
            <h2 className="h2 serif" style={{ marginBottom: 8 }}>
              {residence.name}
            </h2>
            <p className="small muted" style={{ marginBottom: 32 }}>
              {PAGES.inquire.modal.intro}
            </p>
            <form
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <label className="field">
                <Eyebrow>{PAGES.inquire.modal.nameLabel}</Eyebrow>
                <input className="input" required />
              </label>
              <label className="field">
                <Eyebrow>{PAGES.inquire.modal.emailLabel}</Eyebrow>
                <input className="input" type="email" required />
              </label>
              <label className="field">
                <Eyebrow>{PAGES.inquire.modal.messageLabel}</Eyebrow>
                <textarea
                  className="input"
                  rows={3}
                  defaultValue={PAGES.inquire.modal.messageDefault.replaceAll(
                    '{residence}',
                    residence.name,
                  )}
                />
              </label>
              <button
                type="submit"
                className="btn btn-primary full-w"
                style={{ width: '100%', marginTop: 12 }}
              >
                {PAGES.inquire.modal.submitLabel}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Eyebrow style={{ marginBottom: 14 }}>{PAGES.inquire.modal.thankYou.eyebrow}</Eyebrow>
            <h2 className="h2 serif" style={{ marginBottom: 12 }}>
              {PAGES.inquire.modal.thankYou.title}
            </h2>
            <p className="body muted" style={{ marginBottom: 28 }}>
              {PAGES.inquire.modal.thankYou.body}
            </p>
            <button className="btn btn-ghost" onClick={onClose}>
              {PAGES.inquire.modal.thankYou.closeLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
