import { createHash, timingSafeEqual } from 'node:crypto';
import { connectToDatabase } from '@/lib/db';

// CRM pull API — the future CRM reads inquiries through here, never the DB.
// Auth: ?key=CRM_API_KEY (timing-safe compare). Pagination: ?limit=&before=
// (ISO timestamp — returns items older than `before`, newest first).
// Stable shape — add fields only, never rename, so the CRM never breaks.
export async function GET(request) {
  const secret = process.env.CRM_API_KEY;
  if (!secret) {
    return Response.json({ ok: false, error: 'CRM API not configured.' }, { status: 503 });
  }
  const { searchParams } = new URL(request.url);
  const given = searchParams.get('key') || '';
  const a = Buffer.from(createHash('sha256').update(given).digest());
  const b = Buffer.from(createHash('sha256').update(secret).digest());
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return Response.json({ ok: false, error: 'Bad key.' }, { status: 403 });
  }
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50', 10) || 50, 1), 100);
  const beforeRaw = searchParams.get('before');
  const before = beforeRaw ? new Date(beforeRaw) : null;
  const query = before && !Number.isNaN(before.getTime()) ? { createdAt: { $lt: before } } : {};
  try {
    const { db } = await connectToDatabase();
    const docs = await db
      .collection('inquiries')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .toArray();
    const page = docs.slice(0, limit);
    const last = page[page.length - 1];
    return Response.json({
      ok: true,
      inquiries: page.map((d) => ({
        id: String(d._id),
        name: d.name || '',
        email: d.email || '',
        phone: d.phone || null,
        budget: d.budget || null,
        place: d.place || null,
        lat: d.location && Number.isFinite(d.location.lat) ? d.location.lat : null,
        lon: d.location && Number.isFinite(d.location.lon) ? d.location.lon : null,
        message: d.message || '',
        read: d.read !== false,
        createdAt: d.createdAt || null,
      })),
      nextBefore: docs.length > limit && last ? last.createdAt : null,
    });
  } catch {
    return Response.json({ ok: false, error: 'Read failed.' }, { status: 503 });
  }
}
