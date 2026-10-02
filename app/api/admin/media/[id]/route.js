import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/db';
import { sectionKeys } from '@/lib/content';
import { getImageKit, isMediaConfigured } from '@/lib/imagekit';

export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  if (!isMediaConfigured()) return NextResponse.json({ ok: false, error: 'Media not configured.' }, { status: 503 });
  const { id } = await params;
  try {
    const { db } = await connectToDatabase();
    const doc = await db.collection('media').findOne({ fileId: id });
    if (!doc) return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });
    // Fail closed: a file referenced by any live section cannot be deleted.
    // Replace it in those sections first — the picker swap does that.
    if (doc.url) {
      const usedBy = [];
      for (const k of sectionKeys()) {
        const sdoc = await db.collection(k).findOne({ _id: k }, { projection: { data: 1 } });
        if (sdoc && sdoc.data !== undefined && JSON.stringify(sdoc.data).includes(doc.url)) {
          usedBy.push(k);
        }
      }
      if (usedBy.length) {
        return NextResponse.json(
          { ok: false, error: `In use by: ${usedBy.join(', ')}. Replace it there first.` },
          { status: 409 }
        );
      }
    }
    const ik = getImageKit();
    try {
      await ik.deleteFile(id);
    } catch {
      // Remote already gone — still drop the local ref.
    }
    await db.collection('media').deleteOne({ fileId: id });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Delete failed.' }, { status: 500 });
  }
}
