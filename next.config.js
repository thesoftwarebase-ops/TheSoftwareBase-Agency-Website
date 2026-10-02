/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dev (`npm run dev`) uses `.next`. Prod buildsverification use
  // NEXT_DIST_DIR=.next-prod so prod artifacts can never poison the dev
  // graph (mixed registries caused `__webpack_modules__[id] is not a
  // function` + `originalFactory.call` crashes). `next start` needs the
  // same env value as the build it serves.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // ImageKit uploads served through next/image. If your URL endpoint uses
    // a custom host, add it here.
    remotePatterns: [{ protocol: 'https', hostname: 'ik.imagekit.io', pathname: '/**' }],
  },
  // optimizePackageImports removed: its lucide-react barrel rewrite kept
  // producing broken icon bindings in dev (deleted ESM factories,
  // "reading 'call'" TypeErrors). lucide-react sets sideEffects:false,
  // so production tree-shaking works without it.
  experimental: {},
  // NOTE: no custom Cache-Control headers. A previous broad
  // `*.js → immutable, 1yr` rule also matched /_next dev chunks (whose
  // URLs are stable across edits), so tabs executed ancient cached chunks
  // against fresh runtimes → `originalFactory.call` TypeErrors. Next's
  // defaults are correct (immutable only for hashed prod assets).
};

module.exports = nextConfig;
