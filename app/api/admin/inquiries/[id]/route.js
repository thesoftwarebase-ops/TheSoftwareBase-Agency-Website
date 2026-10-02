import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectToDatabase, ObjectId } from '@/lib/db';

async function requireAdmin() {
  const session = await auth();
  if (!session) return null;
  return session;
}

function badId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

export async function PATCH(request, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  const { id } = await params;
  const _id = badId(id);
  if (!_id) return NextResponse.json({ ok: false, error: 'Bad id.' }, { status: 400 });
  let body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
  }
  try {
    const { db } = await connectToDatabase();
    await db.collection('inquiries').updateOne({ _id }, { $set: { read: body.read !== false } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Update failed.' }, { status: 422 });
  }
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  const { id } = await params;
  const _id = badId(id);
  if (!_id) return NextResponse.json({ ok: false, error: 'Bad id.' }, { status: 400 });
  try {
    const { db } = await connectToDatabase();
    await db.collection('inquiries').deleteOne({ _id });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Delete failed.' }, { status: 422 });
  }
}
