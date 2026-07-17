import { NextResponse } from 'next/server';
import { sessionFromRequest } from '@/lib/admin/auth';
import { currentRole } from '@/lib/admin/users';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** The signed-in user's identity and role (for role-aware UI). The role is
 *  resolved from the users store — not the session token — so a promotion or
 *  demotion takes effect on the next page load, without a sign-out/in. */
export async function GET(req: Request) {
  const session = await sessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const role = await currentRole(session.email, session.role);
  return NextResponse.json({ email: session.email, name: session.name, role });
}
