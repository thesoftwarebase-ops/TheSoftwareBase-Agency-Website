import { NavbarWrapper } from '@/components/navbar-wrapper';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { workCases, site, pages } from '@/lib/site';
import { getSection, withFallback } from '@/lib/content';

export async function generateMetadata() {
  const [copySection, brandSection] = await Promise.all([getSection('pages'), getSection('site')]);
  const copy = withFallback(pages, copySection.data);
  const brand = brandSection.data && typeof brandSection.data === 'object' ? brandSection.data : site;
  return {
    title: `Clients — Work — ${brand.name}`,
    description: copy.work.clientsDesc,
    alternates: { canonical: `${brand.url}/work/clients` },
    openGraph: {
      title: `Clients — ${brand.name}`,
      description: copy.work.clientsShort,
      url: `${brand.url}/work/clients`,
      type: 'website',
      images: [{ url: '/home-hero.png', width: 1200, height: 630, alt: `Clients — ${brand.name} client projects` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Clients — ${brand.name}`,
      description: copy.work.clientsShort,
      images: ['/home-hero.png'],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ClientsWorkPage() {
  const [vis, section, copySection] = await Promise.all([
    getSection('workVisibility'),
    getSection('workCases'),
    getSection('pages'),
  ]);
  if (vis?.data && vis.data.clientsEnabled === false) notFound();
  const list = Array.isArray(section.data) && section.data.length ? section.data : workCases;
  const clients = list.filter((c) => c.kind === 'client');
  const copy = withFallback(pages, copySection.data);
  return (
    <div className="min-h-screen bg-[var(--bg-base)] font-grotesk">
      <NavbarWrapper />
      <section className="relative w-full overflow-clip border-b-[4px] border-[#020F40] bg-white dark:border-[#11DFF5] dark:bg-[#0B1220]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#020F40_1px,transparent_1px),linear-gradient(to_bottom,#020F40_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.04] dark:opacity-[0.06]" />
        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-[#020F40] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#11DFF5] dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]">
            <span className="h-2 w-2 animate-pulse bg-[#11DFF5] dark:bg-[#020F40]" />
            Work / Clients
          </div>
          <h1 className="mt-4 text-[32px] font-black leading-[0.9] tracking-[-0.03em] text-[var(--text-primary)] sm:text-[44px] lg:text-[52px]">
            {copy.work.clientsTitle[0]} <span className="text-[#0D65EF] dark:text-[#11DFF5]">{copy.work.clientsTitle[1]}</span>
          </h1>
          <p className="mt-3 max-w-[640px] text-[15px] font-medium leading-relaxed text-[var(--text-secondary)]">
            {copy.work.clientsDesc}
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/work/products" className="inline-flex border-[3px] border-[#020F40] bg-white px-6 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#020F40] dark:border-[#11DFF5] dark:bg-transparent dark:text-white">
              ← Products
            </Link>
            <Link href="/work/clients" className="inline-flex border-[4px] border-[#020F40] bg-[#020F40] px-6 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-white dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]">
              All clients
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid gap-6">
          {clients.map((c, i) => (
            <Link
              key={c.slug}
              href={c.href}
              className="group relative flex flex-col overflow-hidden border-[4px] border-[#020F40] bg-[var(--bg-surface)] shadow-[6px_6px_0_0_#020F40] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[6px_6px_0_0_#11DFF5]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden border-b-[4px] border-[#020F40] bg-[#020F40] dark:border-[#11DFF5] sm:aspect-[21/9]">
                <Image src={c.image} alt={`${c.title} — ${c.desc}`} fill sizes="100vw" className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all" />
              </div>
              <div className="grid gap-5 p-6 sm:grid-cols-[1fr_1fr] sm:gap-8 sm:p-7">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="border-[3px] border-[#020F40] bg-white px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#020F40] dark:border-white/25 dark:bg-transparent dark:text-white">
                      Client · 0{i + 1}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0D65EF] dark:text-[#11DFF5]">{c.tag}</span>
                  </div>
                  <h2 className="mt-2 text-[22px] font-black uppercase leading-none sm:text-[26px]">{c.title}</h2>
                  <p className="mt-2 text-justify text-[14px] font-medium leading-relaxed text-[var(--text-secondary)]">{c.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {c.highlights.map((h) => (
                      <span key={h} className="border-[2px] border-[#020F40]/10 bg-[var(--bg-elevated)]/60 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.06em] dark:border-white/10 dark:bg-white/5">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex min-w-0 flex-col border-t-[3px] border-[#020F40]/10 pt-4 dark:border-white/10 sm:border-l-[3px] sm:border-t-0 sm:pl-6 sm:pt-0">
                  <p className="text-justify text-[14px] font-medium leading-relaxed text-[var(--text-secondary)]">{c.longDesc}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 self-start pt-5 text-[11px] font-black uppercase tracking-[0.14em] text-[#0D65EF] dark:text-[#11DFF5]">
                    Open case <span aria-hidden>→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
