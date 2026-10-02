// DNS-over-HTTPS fallback for broken local resolvers.
//
// The machine's OS DNS intermittently fails (ENOTFOUND on good hostnames,
// external resolvers blocked on UDP/53) while HTTPS works fine. The MongoDB
// driver resolves via node:dns, so one flaky lookup kills every connection.
// This module keeps OS DNS as the fast path and falls back to DoH
// (Cloudflare, then Google) only when the OS lookup fails — in-process,
// no admin rights, no hosts file, nothing on disk.
//
// SERVER-ONLY (node:dns). Imported from lib/db — never from edge code.
import dns from 'dns';

// Prefer IPv4: on networks with dead IPv6, the resolver returns AAAA first
// and every connection stalls. Atlas shards are IPv4 — go straight there.
try {
  dns.setDefaultResultOrder('ipv4first');
} catch {
  // Older runtimes ignore this — harmless.
}

const cache = new Map(); // host -> { ips, exp }
const srvCache = new Map(); // host -> { recs, exp }

async function doh(type, name) {
  const urls = [
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`,
    `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`,
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { accept: 'application/dns-json' },
        signal: AbortSignal.timeout(8000),
      });
      const json = await res.json().catch(() => ({}));
      if (json && (json.Status === 0 || json.Status === 3)) return json;
    } catch {
      // Try the next endpoint.
    }
  }
  return null;
}

async function dohAddresses(host) {
  const now = Date.now();
  const hit = cache.get(host);
  if (hit && hit.exp > now && hit.ips.length) return hit.ips;
  const json = await doh('A', host);
  const ips = ((json && json.Answer) || []).filter((a) => a.type === 1).map((a) => a.data);
  if (!ips.length) {
    const err = new Error(`DoH ENOTFOUND ${host}`);
    err.code = 'ENOTFOUND';
    throw err;
  }
  cache.set(host, { ips, exp: now + 60000 });
  return ips;
}

async function dohSrvRecords(host) {
  const now = Date.now();
  const hit = srvCache.get(host);
  if (hit && hit.exp > now && hit.recs.length) return hit.recs;
  const json = await doh('SRV', host);
  const recs = (((json && json.Answer) || []).filter((a) => a.type === 33) || []).map((a) => {
    const parts = String(a.data).split(' ');
    return {
      priority: Number(parts[0] || 0),
      weight: Number(parts[1] || 0),
      port: Number(parts[2] || 27017),
      name: (parts[3] || '').replace(/\.$/, ''),
    };
  });
  if (!recs.length) {
    const err = new Error(`DoH ENOTFOUND SRV ${host}`);
    err.code = 'ENOTFOUND';
    throw err;
  }
  srvCache.set(host, { recs, exp: now + 60000 });
  return recs;
}

function dnsFailure(err) {
  return !!err && ['ENOTFOUND', 'EAI_AGAIN', 'ETIMEOUT', 'ESERVFAIL'].includes(err.code);
}

if (!dns.__dohPatched) {
  const origLookup = dns.lookup.bind(dns);
  dns.lookup = function dohLookup(hostname, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    origLookup(hostname, options || {}, (err, address, family) => {
      if (!err) {
        callback(null, address, family);
        return;
      }
      if (!dnsFailure(err)) {
        callback(err);
        return;
      }
      dohAddresses(hostname).then(
        (ips) => {
          if (options && typeof options === 'object' && options.all) {
            callback(
              null,
              ips.map((ip) => ({ address: ip, family: 4 }))
            );
          } else {
            callback(null, ips[0], 4);
          }
        },
        () => callback(err)
      );
    });
  };

  const origResolveSrv = dns.resolveSrv.bind(dns);
  dns.resolveSrv = function dohResolveSrv(hostname, callback) {
    origResolveSrv(hostname, (err, recs) => {
      if (!err) {
        callback(null, recs);
        return;
      }
      if (!dnsFailure(err)) {
        callback(err);
        return;
      }
      dohSrvRecords(hostname).then(
        (found) => callback(null, found),
        () => callback(err)
      );
    });
  };

  // SRV-adjacent TXT (Atlas connection options): absent is fine when the
  // URI already carries explicit options — never fail the connect for it.
  const origResolveTxt = dns.resolveTxt.bind(dns);
  dns.resolveTxt = function dohResolveTxt(hostname, callback) {
    origResolveTxt(hostname, (err, recs) => {
      if (!err) {
        callback(null, recs);
        return;
      }
      if (!dnsFailure(err)) {
        callback(err);
        return;
      }
      callback(null, []);
    });
  };

  dns.__dohPatched = true;
}
