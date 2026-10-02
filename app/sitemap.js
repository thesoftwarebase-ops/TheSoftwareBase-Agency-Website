import { site, workCases } from '@/lib/site';
import { getSection } from '@/lib/content';

export default async function sitemap() {
  let cases = workCases;
  let showClients = true;
  let brand = site;
  try {
    const [w, v, s] = await Promise.all([
      getSection('workCases'),
      getSection('workVisibility'),
      getSection('site'),
    ]);
    if (Array.isArray(w.data) && w.data.length) cases = w.data;
    if (v && v.data && v.data.clientsEnabled === false) showClients = false;
    if (s.data && typeof s.data === 'object' && !Array.isArray(s.data)) brand = s.data;
  } catch {
    // DB unreadable — fall back to lib data, show everything.
  }
  const base = brand.url.replace(/\/$/, '');
  const now = new Date();
  const staticRoutes = [
    '',
    '/services',
    '/work/products',
    ...(showClients ? ['/work/clients'] : []),
    '/process',
    '/why-us',
    '/contact',
    '/privacy',
    '/terms',
  ];
  // Hidden client work never reaches crawlers — no dead listing, no dead slugs.
  const visible = cases.filter((c) => showClients || (c.kind || 'client') !== 'client');
  const workRoutes = visible.map((c) => c.href || `/work/${c.slug}`);
  const routes = [...staticRoutes, ...workRoutes];
  return routes.map((route) => ({
    url: `${base}${route || '/'}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : route.startsWith('/work/') ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/services' || route === '/work/products' || route === '/work/clients' ? 0.9 : route.startsWith('/work/') ? 0.8 : 0.7,
  }));
}
