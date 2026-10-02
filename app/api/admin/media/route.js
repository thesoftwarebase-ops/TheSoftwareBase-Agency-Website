import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectToDatabase, withDbRetry } from '@/lib/db';
import { getImageKit, isMediaConfigured, saveMediaRef } from '@/lib/imagekit';

const MAX_BYTES = 25 * 1024 * 1024;

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  if (!isMediaConfigured()) return NextResponse.json({ ok: true, configured: false, files: [] });
  try {
    const files = await withDbRetry(async () => {
      const { db } = await connectToDatabase();
      return db.collection('media').find({}).sort({ createdAt: -1 }).limit(60).toArray();
    });
    return NextResponse.json({ ok: true, configured: true, files });
  } catch {
    return NextResponse.json({ ok: false, error: 'Media list failed — database unreachable, try again.' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await auth();
  if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  if (!isMediaConfigured()) return NextResponse.json({ ok: false, error: 'Media not configured.' }, { status: 503 });
  let form = null;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid upload.' }, { status: 400 });
  }
  const blob = form.get('file');
  if (!blob || typeof blob.arrayBuffer !== 'function') {
    return NextResponse.json({ ok: false, error: 'No file attached.' }, { status: 422 });
  }
  if (blob.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: 'File over 25MB.' }, { status: 413 });
  }
  const folder = String(form.get('folder') || '/console').slice(0, 60);
  const fileName = String(blob.name || `upload-${Date.now()}`).slice(0, 120);
  const ik = getImageKit();
  let uploaded = null;
  try {
    const buffer = Buffer.from(await blob.arrayBuffer());
    uploaded = await ik.upload({
      file: buffer,
      fileName,
      folder,
      useUniqueFileName: true,
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Upload failed.' }, { status: 500 });
  }
  // The DB ref is what makes a file visible in the library. If it cannot be
  // saved, roll the remote file back — an upload without a ref is an
  // invisible orphan, which reads as "my file is gone".
  try {
    const { db } = await connectToDatabase();
    const saved = await saveMediaRef(db, {
      fileId: uploaded.fileId,
      url: uploaded.url,
      thumbnailUrl: uploaded.thumbnailUrl,
      name: uploaded.name,
      mime: blob.type || null,
      size: blob.size,
    });
    return NextResponse.json({ ok: true, file: saved });
  } catch {
    try {
      await ik.deleteFile(uploaded.fileId);
    } catch {
      // Remote cleanup best-effort; the 500 below still tells the truth.
    }
    return NextResponse.json({ ok: false, error: 'Upload failed — rolled back, try again.' }, { status: 500 });
  }
}
