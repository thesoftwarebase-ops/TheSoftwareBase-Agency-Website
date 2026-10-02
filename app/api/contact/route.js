import { contact } from '@/lib/site';
import { getSection } from '@/lib/content';
import { connectToDatabase } from '@/lib/db';

async function contactCopy() {
  try {
    const s = await getSection('contact');
    if (s.data && typeof s.data === 'object' && !Array.isArray(s.data)) return s.data;
  } catch {
    // Fall through to lib defaults.
  }
  return contact;
}

export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid payload.' }, { status: 400 });
  }
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim();
  const budget = String(body.budget || '').trim();
  const phoneRaw = String(body.phone || '').trim();
  const countryCode = String(body.countryCode || '').trim();
  const phone = phoneRaw ? `${countryCode} ${phoneRaw}`.trim() : '';
  const copy = await contactCopy();
  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: 'Name, valid email, and message are required.' }, { status: 422 });
  }
  if (countryCode && !/^\+\d{1,4}$/.test(countryCode)) {
    return Response.json({ ok: false, error: copy.phoneError }, { status: 422 });
  }
  if (phone && !/^[+\d][\d\s\-().]{5,34}$/.test(phone)) {
    return Response.json({ ok: false, error: copy.phoneError }, { status: 422 });
  }
  const lat = Number(body.latitude);
  const lon = Number(body.longitude);
  const acc = Number(body.locationAccuracy);
  const placeName = String(body.placeName || '').trim().slice(0, 120);
  const location =
    Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180
      ? { place: placeName || null, lat, lon, acc: Number.isFinite(acc) ? acc : null }
      : null;
  if (!location) {
    return Response.json({ ok: false, error: copy.locationRequired }, { status: 422 });
  }
  const inquiry = {
    name,
    email,
    phone: phone || null,
    budget: budget || null,
    place: placeName || null,
    location,
    message: message.slice(0, 2000),
    read: false,
    createdAt: new Date(),
  };
  try {
    const { db } = await connectToDatabase();
    await db.collection('inquiries').insertOne(inquiry);
  } catch {
    console.log('[contact] inquiry (db unavailable)', { name, email, budget, location });
  }
  // Owner alert runs INSIDE the request: fire-and-forget stalls on serverless
  // (frozen after the response) and lands minutes late. Still never fails
  // the save — a slow/failed email only gets logged.
  try {
    await Promise.race([
      notifyOwner(inquiry),
      new Promise((_, reject) => setTimeout(() => reject(new Error('email-timeout')), 20000)),
    ]);
  } catch (err) {
    console.log('[contact] owner notify failed', err instanceof Error ? err.message : err);
  }
  return Response.json({ ok: true });
}

// New-inquiry email via your own Gmail (SMTP, no domain needed).
// Needs SMTP_USER (your Gmail) + SMTP_PASS (a Google App Password) +
// INQUIRY_TO_EMAIL. Silent no-op until all three exist.
async function notifyOwner(q) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.INQUIRY_TO_EMAIL;
  if (!user || !pass || !to) {
    console.log('[contact] email disabled — SMTP_USER/SMTP_PASS/INQUIRY_TO_EMAIL missing');
    return;
  }
  const { default: nodemailer } = await import('nodemailer');
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
  const lines = [
    `Name: ${q.name}`,
    `Email: ${q.email}`,
    q.phone ? `Phone: ${q.phone}` : null,
    q.budget ? `Budget: ${q.budget}` : null,
    q.place ? `Location: ${q.place}` : null,
    q.location && Number.isFinite(q.location.lat)
      ? `Map: https://www.google.com/maps?q=${q.location.lat},${q.location.lon}`
      : null,
    '',
    q.message,
  ].filter((l) => l !== null);
  await transporter.sendMail({
    from: `TSB Website <${user}>`,
    to,
    replyTo: q.email,
    subject: `New inquiry — ${q.name}${q.budget ? ` (${q.budget})` : ''}`,
    text: lines.join('\n'),
  });
  console.log('[contact] owner notified', { to, name: q.name });
}
