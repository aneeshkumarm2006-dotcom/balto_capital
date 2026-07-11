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

/* Vercel functions reject request bodies over ~4.5 MB (HTTP 413), so images
   are downscaled in the browser first and sent ONE per request. */

const CLIENT_MAX_EDGE = 1800;
const REQUEST_LIMIT = 4 * 1024 * 1024; // stay safely under Vercel's 4.5 MB

async function compressForUpload(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const scale = Math.min(1, CLIENT_MAX_EDGE / Math.max(bmp.width, bmp.height));
    const w = Math.max(1, Math.round(bmp.width * scale));
    const h = Math.max(1, Math.round(bmp.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.85)
    );
    // Keep the original if the browser couldn't encode or made it bigger.
    return blob && blob.size < file.size ? blob : file;
  } catch {
    // Formats the browser can't decode (e.g. HEIC on Chrome) go up as-is.
    return file;
  }
}

async function uploadOne(
  fields: Record<string, string>,
  file: File
): Promise<string[]> {
  const blob = await compressForUpload(file);
  if (blob.size > REQUEST_LIMIT) {
    throw new Error(
      `"${file.name}" is too large to upload (over 4 MB even after compression). Export it as JPG and try again.`
    );
  }
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
  form.append('files', blob, name);
  const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
  if (!res.ok) throw await toError(res);
  const body = await res.json();
  return (body.added ?? []) as string[];
}

export async function uploadPhotos(
  slug: string,
  files: File[]
): Promise<string[]> {
  const added: string[] = [];
  for (const f of files) added.push(...(await uploadOne({ slug }, f)));
  return added;
}

export async function uploadLibraryFiles(files: File[]): Promise<string[]> {
  const added: string[] = [];
  for (const f of files) added.push(...(await uploadOne({ dest: 'library' }, f)));
  return added;
}

/** Upload photos for one unit. Returns the new paths — the units editor puts
 *  them on the row and persists via its own Save button. */
export async function uploadUnitPhotos(
  slug: string,
  unit: string,
  files: File[]
): Promise<string[]> {
  const added: string[] = [];
  for (const f of files) {
    added.push(...(await uploadOne({ dest: 'unit', slug, unit }, f)));
  }
  return added;
}

export async function logout(): Promise<void> {
  await fetch('/api/admin/logout', { method: 'POST' });
}
