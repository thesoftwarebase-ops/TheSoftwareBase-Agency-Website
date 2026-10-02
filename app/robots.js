import { site } from '@/lib/site';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/api/'],
      },
    ],
    sitemap: `${site.url.replace(/\/$/, '')}/sitemap.xml`,
    host: site.url.replace(/\/$/, ''),
  };
}
