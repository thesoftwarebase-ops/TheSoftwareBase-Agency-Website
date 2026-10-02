import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSection, setSection, hasSection, sectionKeys } from '@/lib/content';
import { connectToDatabase } from '@/lib/db';

async function requireAdmin() {
  const session = await auth();
  if (!session) return null;
  return session;
}

export async function GET(request, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  const { key } = await params;
  if (!hasSection(key)) {
    return NextResponse.json({ ok: false, error: 'Unknown section.', keys: sectionKeys() }, { status: 404 });
  }
  const section = await getSection(key);
  return NextResponse.json({ ok: true, key, ...section });
}

export async function PUT(request, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  const { key } = await params;
  if (!hasSection(key)) {
    return NextResponse.json({ ok: false, error: 'Unknown section.', keys: sectionKeys() }, { status: 404 });
  }
  let body = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || body.data === undefined) {
    return NextResponse.json({ ok: false, error: 'Body must be { data }.' }, { status: 422 });
  }
  // Fail closed: never blank a whole section in one write. Delete cards
  // individually in the editor — every save is snapshotted, blanks are not.
  const d = body.data;
  const blank =
    d === null ||
    (Array.isArray(d) && d.length === 0) ||
    (typeof d === 'object' && !Array.isArray(d) && Object.keys(d).length === 0);
  if (blank) {
    return NextResponse.json(
      { ok: false, error: 'Refusing to blank this section. Remove items one by one instead.' },
      { status: 422 }
    );
  }
  // Work cases drive per-slug pages — slugs must be unique and non-empty,
  // or detail routes collide.
  if (key === 'workCases' && Array.isArray(d)) {
    const slugs = d.map((c) => (c && typeof c.slug === 'string' ? c.slug.trim() : ''));
    if (slugs.some((s) => !s)) {
      return NextResponse.json({ ok: false, error: 'Every case needs a slug.' }, { status: 422 });
    }
    if (new Set(slugs).size !== slugs.length) {
      return NextResponse.json({ ok: false, error: 'Duplicate slugs — make each slug unique.' }, { status: 422 });
    }
  }
  // Optimistic concurrency: editors send the updatedAt they loaded. If the
  // section moved since (another tab, another save), refuse instead of
  // silently overwriting newer data with stale state.
  if (typeof body.baseUpdatedAt === 'string' && body.baseUpdatedAt) {
    const base = new Date(body.baseUpdatedAt);
    if (!Number.isNaN(base.getTime())) {
      try {
        const { db } = await connectToDatabase();
        const current = await db.collection(key).findOne({ _id: key }, { projection: { data: 1, updatedAt: 1, updatedBy: 1 } });
        const curTs = current?.updatedAt ? new Date(current.updatedAt).getTime() : 0;
        if (curTs > base.getTime()) {
          const when = current?.updatedAt ? new Date(current.updatedAt).toLocaleString('en-GB') : 'unknown time';
          const who = current?.updatedBy || 'someone';
          return NextResponse.json(
            {
              ok: false,
              error: `Changed by ${who} at ${when} — review below, then keep yours or take theirs.`,
              conflict: {
                updatedAt: current?.updatedAt || null,
                updatedBy: current?.updatedBy || null,
                data: current?.data,
              },
            },
            { status: 409 }
          );
        }
      } catch {
        return NextResponse.json({ ok: false, error: 'Save failed.' }, { status: 422 });
      }
    }
  }
  try {
    const saved = await setSection(key, body.data, session.user?.email || null);
    return NextResponse.json({ ok: true, ...saved });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : 'Save failed.' }, { status: 422 });
  }
}
