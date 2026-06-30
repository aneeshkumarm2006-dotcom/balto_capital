'use client';
import { useState, type FormEvent } from 'react';
import { Eyebrow } from '@/components/Eyebrow';
import { ArrowRight } from '@/components/icons';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
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
              <Eyebrow style={{ marginBottom: 24 }}>INQUIRE</Eyebrow>
              <h1 className="h1 serif" style={{ marginBottom: 24 }}>
                Begin a<br />conversation.
              </h1>
              <p
                className="body muted"
                style={{ fontSize: 17, maxWidth: 440, marginBottom: 40 }}
              >
                Tell us what you&apos;re looking for. A member of our team will respond within one business day.
              </p>

              <div className="divider" style={{ margin: '32px 0' }} />

              <div style={{ marginBottom: 28 }}>
                <Eyebrow style={{ marginBottom: 8 }}>EMAIL</Eyebrow>
                <div className="serif" style={{ fontSize: 19 }}>
                  inquire@baltocapital.com
                </div>
              </div>
              <div style={{ marginBottom: 28 }}>
                <Eyebrow style={{ marginBottom: 8 }}>TELEPHONE</Eyebrow>
                <div className="serif" style={{ fontSize: 19 }}>
                  +1 (XXX) XXX-XXX
                </div>
              </div>
              <div style={{ marginBottom: 28 }}>
                <Eyebrow style={{ marginBottom: 8 }}>OFFICE</Eyebrow>
                <div className="serif" style={{ fontSize: 19 }}>
                  Edmonton, Alberta
                </div>
              </div>

              <div className="divider" style={{ margin: '32px 0' }} />
              <Eyebrow style={{ marginBottom: 8 }}>OFFICE HOURS</Eyebrow>
              <div className="small" style={{ marginBottom: 4 }}>
                Monday to Friday · 9 to 6
              </div>
              <div className="small muted">Saturday by appointment</div>
            </div>

            <div className="card" style={{ padding: 'clamp(32px, 4vw, 56px)' }}>
              {!sent ? (
                <form onSubmit={submit}>
                  <Eyebrow style={{ marginBottom: 32 }}>SEND AN INQUIRY</Eyebrow>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0 24px',
                    }}
                  >
                    <label className="field">
                      <Eyebrow>FULL NAME</Eyebrow>
                      <input
                        className="input"
                        required
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                      />
                    </label>
                    <label className="field">
                      <Eyebrow>EMAIL</Eyebrow>
                      <input
                        className="input"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                      />
                    </label>
                    <label className="field">
                      <Eyebrow>TELEPHONE</Eyebrow>
                      <input
                        className="input"
                        placeholder="Optional"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                      />
                    </label>
                    <label className="field">
                      <Eyebrow>CITY OF INTEREST</Eyebrow>
                      <select
                        className="input"
                        value={form.city}
                        onChange={(e) => update('city', e.target.value)}
                        style={{ background: 'transparent' }}
                      >
                        <option value="">Select a city</option>
                        <option value="saskatoon">Saskatoon</option>
                        <option value="edmonton">Edmonton</option>
                        <option value="regina">Regina</option>
                      </select>
                    </label>
                  </div>
                  <label className="field">
                    <Eyebrow>RESIDENCE OF INTEREST</Eyebrow>
                    <input
                      className="input"
                      placeholder="Optional"
                      value={form.residence}
                      onChange={(e) => update('residence', e.target.value)}
                    />
                  </label>
                  <label className="field">
                    <Eyebrow>MESSAGE</Eyebrow>
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
                    Send inquiry <ArrowRight size={14} />
                  </button>
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                  <Eyebrow style={{ marginBottom: 18 }}>THANK YOU</Eyebrow>
                  <h2 className="h2 serif" style={{ marginBottom: 16 }}>
                    Your inquiry is with us.
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
                    A member of our team will respond within one business day.
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
