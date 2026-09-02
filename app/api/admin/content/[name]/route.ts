import { NextResponse } from 'next/server';
import { authorFor, sessionFromRequest } from '@/lib/admin/auth';
import { currentRole } from '@/lib/admin/users';
import { isContentFile, readContent, writeContent } from '@/lib/admin/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* The content store can fail for reasons that have nothing to do with the
   request: in github mode an expired or revoked GITHUB_TOKEN makes every read
   and write throw. Left unhandled that surfaces as a bare 500 with no body,
   which the admin UI can only render as "Request failed (500)". Report it as
   502 (upstream storage is the thing that failed) and pass the reason through
   so the cause is visible in the UI. 401 is deliberately NOT used here — the
   client maps that to "your session has expired", which would be misleading. */
function storageError(action: 'load' | 'save', name: string, err: unknown) {
  const detail = err instanceof Error ? err.message : String(err);
  console.error(`[cms] ${action} ${name} failed:`, detail);
  return NextResponse.json(
    { error: `Could not ${action} ${name}. ${detail}` },
    { status: 502 }
  );
}

/** Content files only Admins may save. */
const ADMIN_ONLY = new Set(['settings']);

type Params = { params: { name: string } };

export async function GET(_req: Request, { params }: Params) {
  if (!isContentFile(params.name)) {
    return NextResponse.json({ error: 'Unknown content file.' }, { status: 404 });
  }
  try {
    const data = await readContent(params.name);
    return NextResponse.json(data);
  } catch (err) {
    return storageError('load', params.name, err);
  }
}

export async function PUT(req: Request, { params }: Params) {
  if (!isContentFile(params.name)) {
    return NextResponse.json({ error: 'Unknown content file.' }, { status: 404 });
  }
  const session = await sessionFromRequest(req);
  const role = session ? await currentRole(session.email, session.role) : null;
  if (ADMIN_ONLY.has(params.name) && role !== 'admin') {
    return NextResponse.json(
      { error: 'Only admins can change site settings.' },
      { status: 403 }
    );
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body must be valid JSON.' }, { status: 400 });
  }
  if (body === null || typeof body !== 'object') {
    return NextResponse.json(
      { error: 'Body must be a JSON object or array.' },
      { status: 400 }
    );
  }
  try {
    await writeContent(params.name, body, authorFor(session));
  } catch (err) {
    return storageError('save', params.name, err);
  }
  return NextResponse.json({ ok: true });
}
