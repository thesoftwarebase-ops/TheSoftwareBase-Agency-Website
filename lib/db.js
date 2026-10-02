import { MongoClient, ObjectId } from 'mongodb';
import './dns-doh';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'thesoftwarebase';

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });
  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export { ObjectId };

// Transient Atlas flaps (DNS hiccups, slow server selection) must not
// surface as instant 500s. Retry a few times with backoff; the driver's
// cached client makes a successful reconnect sticky for later calls.
export async function withDbRetry(fn, attempts = 3) {
  let lastErr = null;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      cachedClient = null;
      cachedDb = null;
      if (i < attempts) await new Promise((r) => setTimeout(r, 800 * i));
    }
  }
  throw lastErr;
}
