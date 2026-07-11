/* BALTO CMS — client-side API helpers. All admin pages talk to the content
   store through these. Non-OK responses throw with the server's message. */

async function toError(res: Response): Promise<Error> {
  let message = `Request failed (${res.status})`;
  try {
    const body = await res.json();
    if (body?.error) message = body.error;
  } catch {
    /* keep default */
  }
  if (res.status === 401) message = 'Your session has expired. Please sign in again.';
  return new Error(message);
}

export async function getContent<T>(name: string): Promise<T> {
  const res = await fetch(`/api/admin/content/${name}`, { cache: 'no-store' });
  if (!res.ok) throw await toError(res);
  return res.json();
}

export async function putContent(name: string, data: unknown): Promise<void> {
  const res = await fetch(`/api/admin/content/${name}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await toError(res);
}

export async function uploadPhotos(
  slug: string,
  files: File[]
): Promise<string[]> {
  const form = new FormData();
  form.set('slug', slug);
  for (const f of files) form.append('files', f);
  const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
  if (!res.ok) throw await toError(res);
  const body = await res.json();
  return body.added as string[];
}

export async function logout(): Promise<void> {
  await fetch('/api/admin/logout', { method: 'POST' });
}
