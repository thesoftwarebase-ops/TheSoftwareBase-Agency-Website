import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { restoreSection, hasSection, sectionKeys } from '@/lib/content';
import { connectToDatabase } from '@/lib/db';

export async function POST(request, { params }) {
  const session = await auth();
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
  // { historyId } restores a specific snapshot; { latest: true } is the
  // one-click undo — newest snapshot for this section.
  let historyId = typeof body?.historyId === 'string' && body.historyId ? body.historyId : null;
  if (!historyId && body?.latest === true) {
    try {
      const { db } = await connectToDatabase();
      const newest = await db
        .collection('history')
        .find({ key })
        .sort({ savedAt: -1, _id: -1 })
        .limit(1)
        .project({ _id: 1 })
        .toArray();
      if (!newest.length) {
        return NextResponse.json({ ok: false, error: 'No backups yet for this section.' }, { status: 404 });
      }
      historyId = String(newest[0]._id);
    } catch {
      return NextResponse.json({ ok: false, error: 'Restore failed.' }, { status: 500 });
    }
  }
  if (!historyId) {
    return NextResponse.json({ ok: false, error: 'Body must be { historyId } or { latest: true }.' }, { status: 422 });
  }
  try {
    const saved = await restoreSection(key, historyId, session.user?.email || null);
    return NextResponse.json({ ok: true, ...saved });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : 'Restore failed.' }, { status: 422 });
  }
}
