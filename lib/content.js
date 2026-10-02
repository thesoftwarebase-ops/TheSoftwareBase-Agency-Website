import { revalidatePath } from 'next/cache';
import { cache } from 'react';
import { connectToDatabase, ObjectId } from './db';
import {
  site,
  pages,
  hero,
  services,
  workCases,
  workVisibility,
  processSteps,
  whyUs,
  contact,
  faq,
  workDetail,
  footer,
  dashboard,
  auth,
} from './site';

// One Mongo collection per section — no shared bucket.
// lib/site.js stays as compiled-in fallback so the public site never breaks
// when Mongo is empty or unreachable.
// SERVER-ONLY: imports lib/db (mongodb). Never import from client components.
const FALLBACKS = {
  site,
  pages,
  hero,
  services,
  workCases,
  workVisibility,
  processSteps,
  whyUs,
  contact,
  faq,
  workDetail,
  footer,
  dashboard,
  auth,
};

function collectionFor(key) {
  return key;
}

export function sectionKeys() {
  return Object.keys(FALLBACKS);
}

export function hasSection(key) {
  return Object.prototype.hasOwnProperty.call(FALLBACKS, key);
}

// Deep-merge DB data over lib defaults: the DB doc wins wherever it has
// values, but keys added to lib later (new copy fields) still resolve.
// Arrays are replaced wholesale — lists are always edited as a whole.
function deepMerge(lib, db) {
  if (Array.isArray(lib)) return Array.isArray(db) ? db : lib;
  if (lib && typeof lib === 'object' && db && typeof db === 'object' && !Array.isArray(db)) {
    const out = { ...lib };
    for (const k of Object.keys(db)) {
      out[k] = k in out ? deepMerge(out[k], db[k]) : db[k];
    }
    return out;
  }
  return db === undefined ? lib : db;
}

export function withFallback(lib, data) {
  if (!data || typeof data !== 'object') return lib;
  return deepMerge(lib, data);
}

// Per-request memoized: generateMetadata + page component asking for the
// same key share one query instead of doubling every render.
export const getSection = cache(async function getSection(key) {
  if (!hasSection(key)) return { data: null, source: 'missing', updatedAt: null };
  try {
    const { db } = await connectToDatabase();
    const doc = await db.collection(collectionFor(key)).findOne({ _id: key });
    if (doc && doc.data !== undefined) {
      return { data: doc.data, source: 'db', updatedAt: doc.updatedAt || null };
    }
  } catch {
    // DB unreachable — fail fast (10s timeouts in lib/db) to lib defaults.
  }
  return { data: FALLBACKS[key], source: 'lib', updatedAt: null };
});

export async function getSectionsStatus() {
  const out = [];
  try {
    const { db } = await connectToDatabase();
    for (const key of sectionKeys()) {
      const doc = await db.collection(key).findOne({ _id: key });
      out.push({
        key,
        source: doc && doc.data !== undefined ? 'db' : 'lib',
        updatedAt: doc?.updatedAt || null,
        updatedBy: doc?.updatedBy || null,
      });
    }
  } catch {
    for (const key of sectionKeys()) {
      out.push({ key, source: 'lib', updatedAt: null, updatedBy: null });
    }
  }
  return out;
}

// Public paths each section renders on — revalidated on every save so
// dashboard edits reach the live site without a rebuild.
const ALL = ['/', '/services', '/process', '/why-us', '/contact', '/work/products', '/work/clients'];
const SECTION_PATHS = {
  site: ALL,
  pages: [...ALL, '/work'],
  hero: ['/'],
  services: ['/', '/services'],
  workCases: ['/', '/work/products', '/work/clients'],
  workVisibility: ['/', '/work/products', '/work/clients'],
  processSteps: ['/', '/process'],
  whyUs: ['/', '/why-us'],
  contact: ['/contact'],
  faq: ['/'],
  workDetail: ['/work'],
  footer: ALL,
  dashboard: [],
  auth: [],
};

async function revalidateSection(key, data) {
  try {
    const paths = new Set([...(SECTION_PATHS[key] || []), '/', ]);
    // Work slugs render per-case pages — refresh each one explicitly.
    // workDetail labels render on those same pages.
    if (key === 'workCases' && Array.isArray(data)) {
      for (const c of data) {
        if (c && c.slug) paths.add(`/work/${c.slug}`);
      }
    }
    if (key === 'workDetail') {
      try {
        const { db } = await connectToDatabase();
        const cases = await db.collection('workCases').findOne({ _id: 'workCases' });
        for (const c of (cases && cases.data) || []) {
          if (c && c.slug) paths.add(`/work/${c.slug}`);
        }
      } catch {
        // Best-effort — the listing revalidations above still land.
      }
    }
    // Site-wide chrome (nav/footer/meta) lives in the root layout.
    if (key === 'site' || key === 'pages' || key === 'footer') {
      revalidatePath('/', 'layout');
    }
    for (const p of paths) revalidatePath(p);
  } catch {
    // Revalidation is best-effort (e.g. during local script runs).
  }
}

export async function setSection(key, data, by) {
  if (!hasSection(key)) throw new Error(`Unknown section: ${key}`);
  if (!data || typeof data !== 'object') throw new Error('Section data must be an object or array.');
  const { db } = await connectToDatabase();
  const now = new Date();
  // Snapshot the outgoing version first — every save (and restore) is undoable.
  try {
    const prev = await db.collection(collectionFor(key)).findOne({ _id: key });
    if (prev && prev.data !== undefined) {
      await db.collection('history').insertOne({
        key,
        data: prev.data,
        updatedAt: prev.updatedAt || null,
        updatedBy: prev.updatedBy || null,
        savedAt: now,
        savedBy: by || null,
      });
      // Cap history per section — keep the newest entries.
      const excess = await db
        .collection('history')
        .find({ key })
        .sort({ savedAt: -1, _id: -1 })
        .skip(HISTORY_LIMIT)
        .project({ _id: 1 })
        .toArray();
      if (excess.length) {
        await db
          .collection('history')
          .deleteMany({ _id: { $in: excess.map((e) => e._id) } });
      }
    }
  } catch {
    // History is best-effort — never block the save itself.
  }
  await db.collection(collectionFor(key)).updateOne(
    { _id: key },
    { $set: { data, updatedAt: now, updatedBy: by || null }, $setOnInsert: { createdAt: now } },
    { upsert: true }
  );
  revalidateSection(key, data);
  return { key, updatedAt: now };
}

const HISTORY_LIMIT = 10;

export async function listHistory(limit = 20) {
  try {
    const { db } = await connectToDatabase();
    const docs = await db
      .collection('history')
      .find({})
      .sort({ savedAt: -1 })
      .limit(limit)
      .project({ key: 1, savedAt: 1, savedBy: 1, updatedAt: 1, updatedBy: 1, data: 1 })
      .toArray();
    return docs.map((d) => ({
      id: String(d._id),
      key: d.key,
      savedAt: d.savedAt || null,
      savedBy: d.savedBy || null,
      items: Array.isArray(d.data) ? d.data.length : d.data && typeof d.data === 'object' ? Object.keys(d.data).length : 0,
    }));
  } catch {
    return [];
  }
}

export async function historyCount(key) {
  try {
    const { db } = await connectToDatabase();
    return await db.collection('history').countDocuments({ key });
  } catch {
    return 0;
  }
}

export async function restoreSection(key, historyId, by) {
  if (!hasSection(key)) throw new Error(`Unknown section: ${key}`);
  let oid = null;
  try {
    oid = new ObjectId(historyId);
  } catch {
    throw new Error('Invalid backup id.');
  }
  const { db } = await connectToDatabase();
  const snap = await db.collection('history').findOne({ _id: oid, key });
  if (!snap || snap.data === undefined) throw new Error('Backup not found.');
  // setSection snapshots the current version first — a restore is itself undoable.
  return setSection(key, snap.data, `${by || 'admin'} (restore)`);
}
