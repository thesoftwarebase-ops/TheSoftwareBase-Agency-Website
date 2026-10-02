// Shared visitor-location helpers — runtime data only, nothing hardcoded.

const placeCache = new Map();

export function requestPosition(timeout = 10000) {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('unsupported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout,
      maximumAge: 60000,
    });
  });
}

// Coordinates → words (city, country) via a free no-key reverse-geocode API.
// Returns '' on any failure so callers fall back to their lib copy.
export async function placeNameFor(lat, lon) {
  const key = `${Number(lat).toFixed(2)},${Number(lon).toFixed(2)}`;
  if (placeCache.has(key)) return placeCache.get(key);
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&localityLanguage=en`
    );
    if (!res.ok) throw new Error('lookup failed');
    const data = await res.json();
    const place = [data.city || data.locality, data.countryName].filter(Boolean).join(', ');
    placeCache.set(key, place);
    return place;
  } catch {
    placeCache.set(key, '');
    return '';
  }
}
