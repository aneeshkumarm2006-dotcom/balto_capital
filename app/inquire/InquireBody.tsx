'use client';
import { useState, type FormEvent } from 'react';
import { Eyebrow } from '@/components/Eyebrow';
import { ArrowRight } from '@/components/icons';
import { DatePicker } from '@/components/ui/DatePicker';
import { Dropdown } from '@/components/ui/Dropdown';
import { LIVE_CITIES } from '@/lib/data';
import { PAGES } from '@/lib/pages';
import { SETTINGS } from '@/lib/settings';

const CITY_OPTIONS = [
  { value: '', label: PAGES.inquire.form.cityPlaceholderOption },
  ...LIVE_CITIES.map((c) => ({ value: c.slug, label: c.label })),
];

const fieldControlStyle: React.CSSProperties = {
  borderBottom: '1px solid var(--hairline-strong)',
};

function todayKey(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function InquireBody() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    moveIn: '',
    residence: '',
    message: '',
  });
  const update = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSent(true);
  };

  return (
    <main className="page-enter">
      <section className="section bg-ivory">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '0.9fr 1.3fr',
              gap: 'clamp(40px, 7vw, 120px)',
            }}
            className="grid-3-md1"
          >
            <div>
              <Eyebrow style={{ marginBottom: 24 }}>{PAGES.inquire.hero.eyebrow}</Eyebrow>
              <h1 className="h1 serif" style={{ marginBottom: 24 }}>
                {PAGES.inquire.hero.titleLine1}
                <br />
                {PAGES.inquire.hero.titleLine2}
              </h1>
              <p
                className="body muted"
                style={{ fontSize: 17, maxWidth: 440, marginBottom: 40 }}
              >
                {PAGES.inquire.hero.intro}
              </p>

              <div className="divider" style={{ margin: '32px 0' }} />

              <div style={{ marginBottom: 28 }}>
                <Eyebrow style={{ marginBottom: 8 }}>{PAGES.inquire.contact.emailLabel}</Eyebrow>
                <div className="serif" style={{ fontSize: 19 }}>
                  {SETTINGS.contactEmail}
                </div>
              </div>
              <div style={{ marginBottom: 28 }}>
                <Eyebrow style={{ marginBottom: 8 }}>{PAGES.inquire.contact.phoneLabel}</Eyebrow>
                <div className="serif" style={{ fontSize: 19 }}>
                  {SETTINGS.contactPhone}
                </div>
              </div>
              <div style={{ marginBottom: 28 }}>
                <Eyebrow style={{ marginBottom: 8 }}>{PAGES.inquire.contact.officeLabel}</Eyebrow>
                <div className="serif" style={{ fontSize: 19 }}>
                  {SETTINGS.officeLocation}
                </div>
              </div>

              <div className="divider" style={{ margin: '32px 0' }} />
              <Eyebrow style={{ marginBottom: 8 }}>{PAGES.inquire.contact.officeHoursLabel}</Eyebrow>
              <div className="small" style={{ marginBottom: 4 }}>
                {SETTINGS.officeHoursWeekdays}
              </div>
              <div className="small muted">{SETTINGS.officeHoursWeekend}</div>
            </div>

            <div className="card" style={{ padding: 'clamp(32px, 4vw, 56px)' }}>
              {!sent ? (
                <form onSubmit={submit}>
                  <Eyebrow style={{ marginBottom: 32 }}>{PAGES.inquire.form.eyebrow}</Eyebrow>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0 24px',
                    }}
                  >
                    <label className="field">
                      <Eyebrow>{PAGES.inquire.form.nameLabel}</Eyebrow>
                      <input
                        className="input"
                        required
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                      />
                    </label>
                    <label className="field">
                      <Eyebrow>{PAGES.inquire.form.emailLabel}</Eyebrow>
                      <input
                        className="input"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                      />
                    </label>
                    <label className="field">
                      <Eyebrow>{PAGES.inquire.form.phoneLabel}</Eyebrow>
                      <input
                        className="input"
                        placeholder={PAGES.inquire.form.phonePlaceholder}
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                      />
                    </label>
                    <label className="field">
                      <Eyebrow>{PAGES.inquire.form.cityLabel}</Eyebrow>
                      <Dropdown
                        variant="site"
                        ariaLabel={PAGES.inquire.form.cityAriaLabel}
                        value={form.city}
                        onChange={(v) => update('city', v)}
                        options={CITY_OPTIONS}
                        style={fieldControlStyle}
                      />
                    </label>
                    <label className="field">
                      <Eyebrow>{PAGES.inquire.form.moveInLabel}</Eyebrow>
                      <DatePicker
                        variant="site"
                        ariaLabel={PAGES.inquire.form.moveInAriaLabel}
                        placeholder={PAGES.inquire.form.moveInPlaceholder}
                        min={todayKey()}
                        value={form.moveIn || undefined}
                        onChange={(v) => update('moveIn', v ?? '')}
                        style={fieldControlStyle}
                      />
                    </label>
                    <label className="field">
                      <Eyebrow>{PAGES.inquire.form.residenceLabel}</Eyebrow>
                      <input
                        className="input"
                        placeholder={PAGES.inquire.form.residencePlaceholder}
                        value={form.residence}
                        onChange={(e) => update('residence', e.target.value)}
                      />
                    </label>
                  </div>
                  <label className="field">
                    <Eyebrow>{PAGES.inquire.form.messageLabel}</Eyebrow>
                    <textarea
                      className="input"
                      rows={5}
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                    />
                  </label>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ marginTop: 12 }}
                  >
                    {`${PAGES.inquire.form.submitLabel} `}
                    <ArrowRight size={14} />
                  </button>
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                  <Eyebrow style={{ marginBottom: 18 }}>{PAGES.inquire.thankYou.eyebrow}</Eyebrow>
                  <h2 className="h2 serif" style={{ marginBottom: 16 }}>
                    {PAGES.inquire.thankYou.title}
                  </h2>
                  <p
                    className="body muted"
                    style={{
                      marginBottom: 0,
                      maxWidth: 400,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                  >
                    {PAGES.inquire.thankYou.body}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
