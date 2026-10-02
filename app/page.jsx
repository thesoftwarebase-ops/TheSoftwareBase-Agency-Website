import { NavbarWrapper } from '@/components/navbar-wrapper';
import { HomeHero } from '@/components/home/home-hero';
import { HomeServices } from '@/components/home/home-services';
import { HomeWork } from '@/components/home/home-work';
import { HomeProcess } from '@/components/home/home-process';
import { HomeWhyUs } from '@/components/home/home-why';
import { HomeCTA } from '@/components/home/home-cta';
import { HomeFAQ } from '@/components/home/home-faq';
import { site, hero, pages, services, workCases, faq, whyUs, processSteps } from '@/lib/site';
import { getSection, withFallback } from '@/lib/content';

export async function generateMetadata() {
  const siteSection = await getSection('site');
  const s = siteSection.data && typeof siteSection.data === 'object' ? siteSection.data : site;
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: s.url },
    openGraph: {
      title: s.title,
      description: hero.desc,
      url: s.url,
      siteName: s.name,
      images: [{ url: '/home-hero.png', width: 1200, height: 630, alt: hero.title.join(' ') }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: s.title,
      description: hero.desc,
      images: ['/home-hero.png'],
    },
  };
}

const breadcrumbFor = (showClients) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
    { '@type': 'ListItem', position: 2, name: 'Services', item: `${site.url}/services` },
    { '@type': 'ListItem', position: 3, name: 'Work Products', item: `${site.url}/work/products` },
    ...(showClients
      ? [{ '@type': 'ListItem', position: 4, name: 'Work Clients', item: `${site.url}/work/clients` }]
      : []),
    { '@type': 'ListItem', position: 5, name: 'Process', item: `${site.url}/process` },
  ],
});

const faqJsonLdFor = (list) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: list.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

const servicesJsonLdFor = (list) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Services',
  itemListElement: list
    .filter((s) => s.selected)
    .map((s, i) => ({
      '@type': 'Service',
      position: i + 1,
      name: s.title,
      description: s.desc,
    })),
});

export default async function Home() {
  const [
    heroSection,
    servicesSection,
    workSection,
    workVis,
    processSection,
    copySection,
    brandSection,
    whySection,
    faqSection,
    footSection,
  ] = await Promise.all([
    getSection('hero'),
    getSection('services'),
    getSection('workCases'),
    getSection('workVisibility'),
    getSection('processSteps'),
    getSection('pages'),
    getSection('site'),
    getSection('whyUs'),
    getSection('faq'),
    getSection('footer'),
  ]);
  const showClients = !workVis?.data || workVis.data.clientsEnabled !== false;
  const copy = withFallback(pages, copySection.data);
  const brand = brandSection.data && typeof brandSection.data === 'object' ? brandSection.data : site;
  const whyData = whySection.data && typeof whySection.data === 'object' ? whySection.data : whyUs;
  const faqData = Array.isArray(faqSection.data) && faqSection.data.length ? faqSection.data : faq;
  const svcData = Array.isArray(servicesSection.data) ? servicesSection.data : services;
  return (
    <div className="min-h-screen bg-[var(--bg-base)] font-grotesk">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbFor(showClients)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLdFor(faqData)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLdFor(svcData)) }} />
      <NavbarWrapper />
      <HomeHero content={heroSection.data || hero} brand={brand} />
      <main id="main-content">
        <HomeServices items={svcData} copy={copy} />
        <HomeWork items={Array.isArray(workSection.data) ? workSection.data : workCases} showClients={showClients} copy={copy} />
        <HomeProcess steps={Array.isArray(processSection.data) ? processSection.data : processSteps} copy={copy} />
        <HomeWhyUs items={whyData} copy={copy} brand={brand} foot={footSection.data} />
        <HomeFAQ items={faqData} copy={copy} brand={brand} />
        <HomeCTA copy={copy} brand={brand} />
      </main>
    </div>
  );
}
