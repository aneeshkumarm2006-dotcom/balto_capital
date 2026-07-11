import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { githubMode } from '@/lib/admin/github';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Change the admin password. Verifies the current password, then rewrites
 *  the ADMIN_PASSWORD line in .env.local. Next.js dev reloads env files
 *  automatically; a deployed server picks it up on restart. */
export async function POST(req: Request) {
  const { current, next } = (await req.json().catch(() => ({}))) as {
    current?: string;
    next?: string;
  };

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'CMS is not configured.' }, { status: 500 });
  }
  if (githubMode()) {
    // No local .env.local to rewrite on the deployed site, and a password
    // must never be committed to the repo.
    return NextResponse.json(
      {
        error:
          'On the deployed site the password lives in Vercel: Project → Settings → Environment Variables → ADMIN_PASSWORD, then redeploy.',
      },
      { status: 400 }
    );
  }
  if (current !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'Your current password is incorrect.' },
      { status: 403 }
    );
  }
  if (!next || next.length < 8) {
    return NextResponse.json(
      { error: 'New password must be at least 8 characters.' },
      { status: 400 }
    );
  }

  const envPath = path.join(process.cwd(), '.env.local');
  let env: string;
  try {
    env = await fs.readFile(envPath, 'utf8');
  } catch {
    return NextResponse.json(
      { error: 'Could not read .env.local on this server.' },
      { status: 500 }
    );
  }
  const line = `ADMIN_PASSWORD=${next}`;
  env = /^ADMIN_PASSWORD=.*$/m.test(env)
    ? env.replace(/^ADMIN_PASSWORD=.*$/m, line)
    : env.trimEnd() + '\n' + line + '\n';
  await fs.writeFile(envPath, env, 'utf8');
  process.env.ADMIN_PASSWORD = next;

  return NextResponse.json({ ok: true });
}
