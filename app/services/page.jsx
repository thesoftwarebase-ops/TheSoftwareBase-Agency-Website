import { NavbarWrapper } from '@/components/navbar-wrapper';
import Link from 'next/link';
import Image from 'next/image';
import { services, site, pages } from '@/lib/site';
import { getSection, withFallback } from '@/lib/content';
import { ServicesGrid } from '@/components/services/services-grid';
import { BentoGrid, BentoCard } from '@/components/magicui/bento-grid';
import { Marquee } from '@/components/magicui/marquee';
import { FileText, Calendar as CalendarLucide, Bell, Share2 } from 'lucide-react';

export async function generateMetadata() {
  const [copySection, brandSection] = await Promise.all([getSection('pages'), getSection('site')]);
  const copy = withFallback(pages, copySection.data);
  const brand = brandSection.data && typeof brandSection.data === 'object' ? brandSection.data : site;
  return {
    title: `Services — ${brand.name}`,
    description: copy.services.desc,
    alternates: { canonical: `${brand.url}/services` },
    openGraph: {
      title: `Services — ${brand.name}`,
      description: copy.services.desc,
      url: `${brand.url}/services`,
      siteName: brand.name,
      images: [{ url: '/home-hero.png', width: 1200, height: 630, alt: copy.services.title.join(' ') }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Services — ${brand.name}`,
      description: copy.services.desc,
      images: ['/home-hero.png'],
    },
  };
}

const jsonLdFor = (list, svc, brand) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: `Services — ${brand.name}`,
  description: svc.desc,
  url: `${brand.url}/services`,
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: list.length,
    itemListElement: list.map((s, i) => ({
      '@type': 'Service',
      position: i + 1,
      name: s.title,
      description: s.desc,
      image: `${brand.url}${s.image}`,
    })),
  },
});

// Bullets accessor — never crashes if services shrink below 4 entries.
const labBulletsFrom = (list) => (i) => (list[i % list.length] || {}).bullets || [];

const bentoFeaturesFor = (svcList, svc) => {
  const list = Array.isArray(svcList) && svcList.length ? svcList : services;
  const labBullets = labBulletsFrom(list);
  return [
  {
    Icon: FileText,
    ...svc.labs[0],
    className: svc.labs[0].span,
    background: (
      <div className="absolute inset-0 z-0 [mask-image:linear-gradient(to_top,transparent_25%,#000_100%)]">
        <Image src="/home-hero.png" alt="" fill sizes="(max-width:1024px) 100vw, 33vw" className="object-cover object-top opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-transparent to-transparent opacity-60" />
        <svg aria-hidden viewBox="0 0 200 120" className="absolute inset-0 h-full w-full text-[#020F40] dark:text-white opacity-[0.06]">
          <rect x="12" y="12" width="176" height="96" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="100" cy="60" r="10" fill="#11DFF5" stroke="currentColor" strokeWidth="2" />
        </svg>
        <Marquee pauseOnHover className="absolute bottom-2 [--duration:16s] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          {labBullets(0).map((b, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 border-[3px] border-[#020F40] bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-[#020F40] shadow-[2px_2px_0_0_#020F40] dark:border-[#11DFF5] dark:bg-[#0B1220] dark:text-white"
            >
              <span className="h-1.5 w-1.5 bg-[#11DFF5] shadow-[0_0_6px_#11DFF5]" />
              {b}
            </span>
          ))}
        </Marquee>
      </div>
    ),
  },
  {
    Icon: Bell,
    ...svc.labs[1],
    className: svc.labs[1].span,
    background: (
      <div className="absolute inset-0 z-0 [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)]">
        <Image src="/home-hero.png" alt="" fill sizes="(max-width:1024px) 100vw, 66vw" className="object-cover object-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-[var(--bg-surface)]/40 to-transparent" />
        <div className="absolute right-2 top-6 w-[88%] scale-[0.84] [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-500 group-hover:scale-[0.96]">
          <div className="grid gap-1.5">
            {labBullets(1).map((b) => (
              <div key={b} className="flex items-center gap-2 border-[3px] border-[#020F40] bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-[0.06em] shadow-[2px_2px_0_0_#020F40] dark:border-[#11DFF5] dark:bg-[#0B1220] dark:text-white">
                <span className="h-1.5 w-1.5 bg-[#11DFF5] shadow-[0_0_6px_#11DFF5]" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    Icon: Share2,
    ...svc.labs[2],
    className: svc.labs[2].span,
    background: (
      <div className="absolute inset-0 z-0 [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)]">
        <Image src="/home-hero.png" alt="" fill sizes="(max-width:1024px) 100vw, 66vw" className="object-cover object-bottom opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-transparent to-transparent opacity-70" />
        <div className="absolute right-4 top-4 hidden gap-1.5 lg:flex">
          {labBullets(2).slice(0, 3).map((b) => (
            <span key={b} className="border-[2px] border-[#020F40] bg-[#11DFF5] px-2 py-1 text-[10px] font-black uppercase tracking-[0.06em] text-[#020F40] shadow-[2px_2px_0_0_#020F40]">
              {b.split(' ')[0]}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    Icon: CalendarLucide,
    ...svc.labs[3],
    className: svc.labs[3].span,
    background: (
      <div className="absolute inset-0 z-0 [mask-image:linear-gradient(to_top,transparent_30%,#000_100%)]">
        <Image src="/home-hero.png" alt="" fill sizes="(max-width:1024px) 100vw, 33vw" className="object-cover object-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-transparent to-transparent opacity-60" />
        <svg aria-hidden viewBox="0 0 200 140" className="absolute inset-0 h-full w-full text-[#020F40] dark:text-white opacity-[0.05]">
          <rect x="20" y="20" width="160" height="100" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M20 45 H180" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <div className="absolute bottom-4 left-3 right-3 grid grid-cols-3 gap-1">
          {labBullets(3).map((b) => (
            <span key={b} className="border bg-white px-1 py-1 text-center text-[9px] font-black uppercase leading-none tracking-[0.06em] shadow-[1px_1px_0_0_#020F40] dark:bg-[#0B1220] dark:text-white">
              {b.split(' ')[0]}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  ];
};

export default async function ServicesPage() {
  const [servicesSection, copySection, brandSection] = await Promise.all([
    getSection('services'),
    getSection('pages'),
    getSection('site'),
  ]);
  const svcList = Array.isArray(servicesSection.data) && servicesSection.data.length ? servicesSection.data : services;
  const copy = withFallback(pages, copySection.data);
  const svc = copy.services;
  const brand = brandSection.data && typeof brandSection.data === 'object' ? brandSection.data : site;
  return (
    <div className="min-h-screen bg-[var(--bg-base)] font-grotesk">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFor(svcList, svc, brand)) }} />
      <NavbarWrapper />

      {/* HERO — full width brutal with image + SVG */}
      <section className="relative w-full overflow-clip border-b-[4px] border-[#020F40] bg-[#05070C] dark:border-[#11DFF5]">
        <div className="pointer-events-none absolute inset-0">
          <Image src="/home-hero.png" alt="Services hero" fill priority sizes="100vw" className="object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020F40]/85 via-[#020F40]/60 to-[#020F40]/30 dark:from-[#020F40]/90 dark:via-[#020F40]/70" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(17,223,245,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,223,245,0.06)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />
        </div>

        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <div className="inline-flex items-center gap-2 border-[3px] border-[#11DFF5] bg-[#11DFF5] px-3 py-1 text-[11px] font-black tracking-[0.16em] uppercase text-[#020F40]">
            <span className="h-2 w-2 animate-pulse bg-[#020F40]" />
            {svc.kicker}
            <span className="hidden h-px w-6 bg-[#020F40]/20 sm:block" />
            <span className="hidden text-[10px] font-bold tracking-[0.12em] text-[#020F40]/60 sm:inline-flex">
              {svcList.length} {svc.countSuffix}
            </span>
          </div>

          <h1 className="mt-4 max-w-[720px] text-[32px] font-black leading-[0.9] tracking-[-0.03em] text-white sm:text-[44px] lg:text-[56px]">
            <span className="block">{svc.title[0]}</span>
            <span className="block text-[#11DFF5]">{svc.title[1]}</span>
          </h1>

          <p className="mt-4 max-w-[720px] border-l-[3px] border-[#11DFF5]/60 pl-4 text-[15px] font-medium leading-relaxed text-white/80 sm:text-[16px]">
            {svc.desc}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={svc.primaryCta.href}
              className="inline-flex items-center justify-center gap-2 border-[4px] border-[#11DFF5] bg-[#11DFF5] px-7 py-3 text-[13px] font-black tracking-[0.16em] uppercase text-[#020F40] shadow-[4px_4px_0_0_white] transition hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0_0_white]"
            >
              {svc.primaryCta.label}
              <span aria-hidden>→</span>
            </Link>
            <Link
              href={svc.secondaryCta.href}
              className="inline-flex items-center justify-center border-[3px] border-white/20 bg-transparent px-7 py-3 text-[13px] font-bold tracking-[0.16em] uppercase text-white hover:bg-white hover:text-[#020F40] hover:border-white"
            >
              {svc.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      <main id="main-content" className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* LAB — Proof of Craft — top : not services duplicate */}
        <section id="lab" aria-labelledby="bento-heading">
          <div className="flex items-center gap-3">
            <h2 id="bento-heading" className="text-[18px] font-black uppercase tracking-[-0.02em] sm:text-[20px]">
              {svc.labTitle[0]} <span className="text-[#0D65EF] dark:text-[#11DFF5]">{svc.labTitle[1]}</span>
            </h2>
            <span className="hidden h-px flex-1 bg-[#020F40]/10 dark:bg-white/10 sm:block" />
            <span className="hidden text-[11px] font-black uppercase tracking-[0.12em] text-[var(--text-secondary)]/60 sm:inline-flex">
              {svc.labs.length} {svc.labCountSuffix}
            </span>
          </div>
          <p className="mt-2 max-w-[640px] text-[13px] font-medium leading-relaxed text-[var(--text-secondary)]">
            {svc.labDesc}
          </p>
          <div className="mt-6">
            <BentoGrid>
              {bentoFeaturesFor(svcList, svc).map((f, idx) => (
                <BentoCard key={idx} index={idx} {...f} />
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* LIBRARY — Services in detail, below lab */}
        <section id="services-details" aria-labelledby="services-details-heading" className="mt-12 sm:mt-16 scroll-mt-28">
          <div className="flex items-center gap-3 border-t-[4px] border-[#020F40] pt-6 dark:border-[#11DFF5]">
            <h2 id="services-details-heading" className="text-[18px] font-black uppercase tracking-[-0.02em] sm:text-[20px]">
              Services <span className="text-[#0D65EF] dark:text-[#11DFF5]">in detail</span>
            </h2>
            <span className="h-1 w-6 bg-[#11DFF5] shadow-[0_0_6px_#11DFF5]" />
            <span className="hidden text-[11px] font-black uppercase tracking-[0.12em] text-[var(--text-secondary)]/60 sm:inline-flex">
              {svcList.length} core services • {svc.desc.slice(0, 40)}…
            </span>
          </div>
          <ServicesGrid items={svcList} />
        </section>

        {/* bottom brutal bar */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-[4px] border-[#020F40] bg-[var(--bg-surface)] p-5 shadow-[6px_6px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[6px_6px_0_0_#11DFF5] sm:p-6">
          <p className="max-w-[560px] text-[13px] font-medium leading-relaxed text-[var(--text-secondary)]">
            {svc.desc}
          </p>
          <Link
            href={brand.cta.href}
            className="inline-flex items-center justify-center border-[4px] border-[#020F40] bg-[#020F40] px-6 py-3 text-[12px] font-black tracking-[0.16em] uppercase text-white shadow-[4px_4px_0_0_#11DFF5] hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0_0_#11DFF5] dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]"
          >
            {brand.cta.label}
          </Link>
        </div>
      </main>
    </div>
  );
}
