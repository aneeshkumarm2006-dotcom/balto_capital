/* ============================================================
   BALTO CMS — session auth.
   HMAC-SHA256 signed tokens via Web Crypto, so the same code
   runs in Edge middleware and Node API routes. Single-admin
   credentials come from env (.env.local): ADMIN_EMAIL,
   ADMIN_PASSWORD, AUTH_SECRET.
   ============================================================ */

export const SESSION_COOKIE = 'balto_admin_session';
export const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

const encoder = new TextEncoder();

const toB64Url = (bytes: Uint8Array): string => {
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromB64Url = (s: string): string =>
  atob(s.replace(/-/g, '+').replace(/_/g, '/'));

async function hmac(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return toB64Url(new Uint8Array(sig));
}

export async function createSessionToken(
  email: string,
  secret: string
): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = toB64Url(encoder.encode(`${email}|${exp}`));
  const sig = await hmac(payload, secret);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(
  token: string,
  secret: string
): Promise<{ email: string } | null> {
  const dot = token.lastIndexOf('.');
  if (dot < 1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  // Compare HMACs of the signatures rather than the signatures themselves so
  // string comparison timing reveals nothing about the expected value.
  const expected = await hmac(payload, secret);
  if ((await hmac(sig, secret)) !== (await hmac(expected, secret))) return null;
  let decoded: string;
  try {
    decoded = fromB64Url(payload);
  } catch {
    return null;
  }
  const sep = decoded.lastIndexOf('|');
  if (sep < 1) return null;
  const email = decoded.slice(0, sep);
  const exp = Number(decoded.slice(sep + 1));
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return null;
  return { email };
}
