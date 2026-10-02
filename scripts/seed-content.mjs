// Structured content seed: one Mongo collection per section key.
// - Migrates any docs from the legacy shared `content` collection first
//   (preserves dashboard edits), then drops it.
// - Safe to re-run — uses $setOnInsert so existing docs are never clobbered.
// Usage: `node scripts/seed-content.mjs` (reads .env.local, no dotenv needed).
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MongoClient } from 'mongodb';

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
if (!uri) throw new Error('MONGODB_URI missing (.env.local).');

const { pathToFileURL } = await import('node:url');
const siteModule = await import(pathToFileURL(join(root, 'lib', 'site.js')).href);

const KEYS = [
  'site', 'pages', 'hero', 'services', 'workCases', 'processSteps',
  'whyUs', 'contact', 'faq', 'workDetail', 'footer', 'dashboard', 'auth',
];

const client = new MongoClient(uri);
await client.connect();
const db = client.db(dbName);
const now = new Date();

// 1. Migrate legacy shared bucket → per-section collections (keeps edits).
const legacyNames = (await db.listCollections({ name: 'content' }).toArray()).map((c) => c.name);
if (legacyNames.length > 0) {
  const legacy = await db.collection('content').find({}).toArray();
  for (const doc of legacy) {
    if (!KEYS.includes(doc.key) || doc.data === undefined) continue;
    await db.collection(doc.key).updateOne(
      { _id: doc.key },
      {
        $set: { data: doc.data, updatedAt: doc.updatedAt || now, updatedBy: doc.updatedBy || 'migrate' },
        $setOnInsert: { createdAt: doc.createdAt || now },
      },
      { upsert: true }
    );
    console.log(`migrated ${doc.key} → collection/${doc.key}`);
  }
  await db.collection('content').drop();
  console.log('dropped legacy collection: content');
}

// 2. Seed anything still missing from lib defaults (never overwrites).
for (const key of KEYS) {
  const data = siteModule[key];
  if (data === undefined) {
    console.log(`skip ${key}: not exported`);
    continue;
  }
  const res = await db.collection(key).updateOne(
    { _id: key },
    { $setOnInsert: { data, createdAt: now, updatedAt: now, updatedBy: 'seed' } },
    { upsert: true }
  );
  console.log(`${key}: ${res.upsertedCount ? 'inserted' : 'kept existing'}`);
}
await client.close();
console.log('content seed done');
