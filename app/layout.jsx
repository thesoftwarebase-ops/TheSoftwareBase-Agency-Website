import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

import { site } from '@/lib/site';
import { getSection } from '@/lib/content';
import { FooterWrapper } from '@/components/footer-wrapper';

async function siteInfo() {
  try {
    const s = await getSection('site');
    if (s.data && typeof s.data === 'object' && !Array.isArray(s.data)) return s.data;
  } catch {
    // Fall through to lib defaults.
  }
  return site;
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#020F40' },
    { media: '(prefers-color-scheme: dark)', color: '#05070C' },
  ],
  colorScheme: 'light dark',
};

export async function generateMetadata() {
  const s = await siteInfo();
  return {
    metadataBase: new URL(s.url),
    title: {
      default: s.title,
      template: `%s — ${s.name}`,
    },
    description: s.description,
    keywords: s.keywords,
    authors: s.authors,
    creator: s.creator,
    publisher: s.publisher,
    applicationName: s.name,
    referrer: 'origin-when-cross-origin',
    alternates: {
      languages: { 'en-US': '/' },
    },
    openGraph: {
      type: 'website',
      locale: s.locale,
      url: s.url,
      title: s.title,
      description: s.description,
      siteName: s.name,
    images: [
      {
        url: '/home-hero.png',
        width: 1200,
        height: 630,
        alt: `${s.name} — ${s.description}`,
      },
      {
        url: '/thesoftwarebase.png',
        width: 900,
        height: 216,
        alt: s.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: s.title,
    description: s.description,
    creator: '@thesoftwarebase',
    images: ['/home-hero.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  category: 'technology',
  classification: 'Business',
  };
}

const jsonLdFor = (s) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${s.url}/#organization`,
      name: s.name,
      alternateName: s.shortName,
      url: s.url,
      logo: {
        '@type': 'ImageObject',
        url: `${s.url}/thesoftwarebase.png`,
        width: 900,
        height: 216,
      },
      image: `${s.url}/home-hero.png`,
      description: s.description,
      email: s.email,
      foundingDate: '2024',
      sameAs: [],
      contactPoint: {
        '@type': 'ContactPoint',
        email: s.email,
        contactType: 'sales',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${s.url}/#website`,
      url: s.url,
      name: s.name,
      description: s.description,
      publisher: { '@id': `${s.url}/#organization` },
      inLanguage: 'en-US',
    },
  ],
});

export default async function RootLayout({ children }) {
  const [brand, footSection] = await Promise.all([siteInfo(), getSection('footer')]);
  let foot = null;
  try {
    const f = footSection;
    if (f.data && typeof f.data === 'object' && !Array.isArray(f.data)) foot = f.data;
  } catch {
    // Footer falls back to lib defaults inside the component.
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFor(brand)) }} />
      </head>
      <body className="font-grotesk antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <FooterWrapper foot={foot} brand={brand} />
        </ThemeProvider>
      </body>
    </html>
  );
}
