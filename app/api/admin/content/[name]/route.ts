import { NextResponse } from 'next/server';
import { isContentFile, readContent, writeContent } from '@/lib/admin/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = { params: { name: string } };

export async function GET(_req: Request, { params }: Params) {
  if (!isContentFile(params.name)) {
    return NextResponse.json({ error: 'Unknown content file.' }, { status: 404 });
  }
  const data = await readContent(params.name);
  return NextResponse.json(data);
}

export async function PUT(req: Request, { params }: Params) {
  if (!isContentFile(params.name)) {
    return NextResponse.json({ error: 'Unknown content file.' }, { status: 404 });
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
  await writeContent(params.name, body);
  return NextResponse.json({ ok: true });
}
