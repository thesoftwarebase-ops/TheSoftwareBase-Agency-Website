// One-time admin seeder. Reads .env.local manually (no dotenv dependency).
// Usage: set ADMIN_EMAIL + ADMIN_PASSWORD, then `node scripts/seed-admin.mjs`.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const envFile = join(root, '.env.local');
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'thesoftwarebase';
const email = String(process.env.ADMIN_EMAIL || '').toLowerCase().trim();
const password = String(process.env.ADMIN_PASSWORD || '');

if (!uri) throw new Error('MONGODB_URI missing (.env.local).');
if (!email || !password) throw new Error('Set ADMIN_EMAIL + ADMIN_PASSWORD env vars first.');
if (password.length < 10) throw new Error('ADMIN_PASSWORD must be 10+ characters (12+ recommended).');
if (password.length < 12) console.log('warning: password under 12 chars — rotate to a longer one later.');

const client = new MongoClient(uri);
await client.connect();
const db = client.db(dbName);
const passwordHash = await bcrypt.hash(password, 12);
const res = await db.collection('users').updateOne(
  { email },
  { $set: { email, name: 'Admin', role: 'admin', passwordHash, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
  { upsert: true }
);
console.log(`admin ready: ${email} (${res.upsertedCount ? 'created' : 'updated'})`);
await client.close();
