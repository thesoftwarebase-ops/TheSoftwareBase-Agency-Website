import ImageKit from 'imagekit';

// SERVER-ONLY: uses the private key. Never import from client components.
let client = null;

function env(name) {
  // Accept both IMAGEKIT_* and IMAGE_KIT_* spellings.
  return process.env[name] || process.env[name.replace('IMAGEKIT', 'IMAGE_KIT')] || '';
}

export function isMediaConfigured() {
  return Boolean(env('IMAGEKIT_PUBLIC_KEY') && env('IMAGEKIT_PRIVATE_KEY') && env('IMAGEKIT_URL_ENDPOINT'));
}

export function getImageKit() {
  if (client) return client;
  if (!isMediaConfigured()) {
    throw new Error('Media not configured — add ImageKit keys to use uploads.');
  }
  client = new ImageKit({
    publicKey: env('IMAGEKIT_PUBLIC_KEY'),
    privateKey: env('IMAGEKIT_PRIVATE_KEY'),
    urlEndpoint: env('IMAGEKIT_URL_ENDPOINT'),
  });
  return client;
}

export async function saveMediaRef(db, file) {
  const doc = {
    fileId: file.fileId,
    url: file.url,
    thumbnailUrl: file.thumbnailUrl || file.url,
    name: file.name,
    contentType: file.mime || file.contentType || null,
    size: file.size || null,
    createdAt: new Date(),
  };
  await db.collection('media').insertOne(doc);
  return doc;
}
