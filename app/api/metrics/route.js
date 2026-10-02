import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic'; // always dynamic for API routes

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const data = await db.collection('metrics').find({}).sort({ createdAt: -1 }).limit(10).toArray();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

const ALLOWED_KEYS = ['name', 'value', 'unit', 'source'];

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
    }
    const clean = {};
    for (const key of ALLOWED_KEYS) {
      const v = body[key];
      if (typeof v === 'string' && v.length <= 200) clean[key] = v;
      else if (typeof v === 'number' && Number.isFinite(v)) clean[key] = v;
    }
    if (Object.keys(clean).length === 0) {
      return NextResponse.json({ error: 'Empty payload.' }, { status: 422 });
    }
    const { db } = await connectToDatabase();
    const result = await db.collection('metrics').insertOne({
      ...clean,
      createdAt: new Date(),
    });
    return NextResponse.json({ insertedId: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to insert data' }, { status: 500 });
  }
}
