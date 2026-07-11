import { NextResponse } from 'next/server';
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  createSessionToken,
} from '@/lib/admin/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { email, password } = (await req.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
  };

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.AUTH_SECRET;

  if (!adminEmail || !adminPassword || !secret) {
    return NextResponse.json(
      { error: 'CMS is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and AUTH_SECRET in .env.local.' },
      { status: 500 }
    );
  }

  const ok =
    typeof email === 'string' &&
    typeof password === 'string' &&
    email.trim().toLowerCase() === adminEmail.toLowerCase() &&
    password === adminPassword;

  if (!ok) {
    return NextResponse.json(
      { error: 'That email and password combination is incorrect.' },
      { status: 401 }
    );
  }

  const token = await createSessionToken(adminEmail, secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}
