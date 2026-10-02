import { NavbarWrapper } from '@/components/navbar-wrapper';
import Link from 'next/link';
import Image from 'next/image';
import { workCases, site, pages } from '@/lib/site';
import { getSection, withFallback } from '@/lib/content';

export async function generateMetadata() {
  const [copySection, brandSection] = await Promise.all([getSection('pages'), getSection('site')]);
  const copy = withFallback(pages, copySection.data);
  const brand = brandSection.data && typeof brandSection.data === 'object' ? brandSection.data : site;
  return {
    title: `Products — Work — ${brand.name}`,
    description: copy.work.productsDesc,
    alternates: { canonical: `${brand.url}/work/products` },
    openGraph: {
      title: `Products — ${brand.name}`,
      description: copy.work.productsShort,
      url: `${brand.url}/work/products`,
      type: 'website',
      images: [{ url: '/home-hero.png', width: 1200, height: 630, alt: `Products — ${brand.name} own products` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Products — ${brand.name}`,
      description: copy.work.productsShort,
      images: ['/home-hero.png'],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ProductsWorkPage() {
  const [section, vis, copySection] = await Promise.all([
    getSection('workCases'),
    getSection('workVisibility'),
    getSection('pages'),
  ]);
  const list = Array.isArray(section.data) && section.data.length ? section.data : workCases;
  const products = list.filter((c) => c.kind === 'own');
  const showClients = !vis?.data || vis.data.clientsEnabled !== false;
  const copy = withFallback(pages, copySection.data);
  return (
    <div className="min-h-screen bg-[var(--bg-base)] font-grotesk">
      <NavbarWrapper />
      <section className="relative w-full overflow-clip border-b-[4px] border-[#020F40] bg-[#020F40] dark:border-[#11DFF5]">
        <div className="pointer-events-none absolute inset-0">
          <Image src="/home-hero.png" alt="" fill priority sizes="100vw" className="object-cover opacity-15 grayscale" />
          <div className="absolute inset-0 bg-[#020F40]/80" />
        </div>
        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="inline-flex items-center gap-2 border-[3px] border-[#11DFF5] bg-[#11DFF5] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#020F40]">
            <span className="h-2 w-2 animate-pulse bg-[#020F40]" />
            Work / Products
          </div>
          <h1 className="mt-4 text-[32px] font-black leading-[0.9] tracking-[-0.03em] text-white sm:text-[44px] lg:text-[52px]">
            {copy.work.productsTitle[0]} <span className="text-[#11DFF5]">{copy.work.productsTitle[1]}</span>
          </h1>
          <p className="mt-3 max-w-[640px] text-[15px] font-medium leading-relaxed text-white/80">
            {copy.work.productsDesc}
          </p>
          <div className="mt-6 flex gap-3">
            {showClients && (
              <Link href="/work/clients" className="inline-flex border-[3px] border-white/20 bg-transparent px-6 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-white hover:bg-white hover:text-[#020F40]">
                → Clients
              </Link>
            )}
            <Link href="/work/products" className="inline-flex border-[3px] border-white bg-white px-6 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#020F40]">
              All products
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid gap-6 sm:grid-cols-2">
          {products.map((c, i) => (
            <Link
              key={c.slug}
              href={c.href}
              className="group relative flex flex-col overflow-hidden border-[4px] border-[#020F40] bg-[var(--bg-surface)] shadow-[6px_6px_0_0_#020F40] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[6px_6px_0_0_#11DFF5]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden border-b-[4px] border-[#020F40] bg-[#020F40] dark:border-[#11DFF5]">
                <Image src={c.image} alt={c.title} fill sizes="(max-width:640px) 100vw, 50vw" className="object-contain grayscale group-hover:grayscale-0 transition-all" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="border-[3px] border-[#020F40] bg-[#11DFF5] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#020F40] dark:border-[#11DFF5]">
                    Own · 0{i + 1}
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#0D65EF] dark:text-[#11DFF5]">{c.tag}</span>
                </div>
                <h2 className="mt-2 text-[22px] font-black uppercase leading-none">{c.title}</h2>
                <p className="mt-2 text-justify text-[13px] font-medium leading-relaxed text-[var(--text-secondary)]">{c.desc}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {c.stack.map((s) => (
                    <span key={s} className="border-[2px] border-[#020F40]/10 bg-[var(--bg-elevated)]/60 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.06em] dark:border-white/10 dark:bg-white/5">
                      {s}
                    </span>
                  ))}
                </div>
                <span className="mt-auto inline-flex items-center gap-1.5 self-start pt-5 text-[11px] font-black uppercase tracking-[0.14em] text-[#0D65EF] dark:text-[#11DFF5]">
                  Open case <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
