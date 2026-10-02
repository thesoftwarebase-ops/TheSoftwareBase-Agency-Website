// Tiny leaf-diff for merge review: what changed elsewhere, path by path.
// Returns [{ path, from, to }] capped for display. JSON-safe values only.
function short(v) {
  if (v === undefined) return '—';
  const s = typeof v === 'string' ? v : JSON.stringify(v);
  return s.length > 90 ? `${s.slice(0, 90)}…` : s;
}

export function diffLeaves(mine, theirs, base = '', out = [], cap = 12) {
  if (out.length >= cap) return out;
  if (JSON.stringify(mine) === JSON.stringify(theirs)) return out;
  if (
    mine !== null &&
    theirs !== null &&
    typeof mine === 'object' &&
    typeof theirs === 'object' &&
    Array.isArray(mine) === Array.isArray(theirs)
  ) {
    const keys = new Set([...Object.keys(mine), ...Object.keys(theirs)]);
    for (const k of keys) {
      if (out.length >= cap) break;
      diffLeaves(mine[k], theirs[k], base ? `${base}.${k}` : `${k}`, out, cap);
    }
    return out;
  }
  out.push({ path: base || '(root)', from: short(theirs), to: short(mine) });
  return out;
}
