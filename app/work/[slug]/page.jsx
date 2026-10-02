import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { NavbarWrapper } from '@/components/navbar-wrapper';
import { workCases, site, workDetail } from '@/lib/site';
import { getSection } from '@/lib/content';

async function caseList() {
  const section = await getSection('workCases');
  return Array.isArray(section.data) && section.data.length ? section.data : workCases;
}

export async function generateStaticParams() {
  return (await caseList()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = (await caseList()).find((x) => x.slug === slug);
  const brandSection = await getSection('site');
  const brand = brandSection.data && typeof brandSection.data === 'object' ? brandSection.data : site;
  if (!c) return { title: `Work — ${brand.name}` };
  const title = `${c.title} — ${brand.name}`;
  const desc = (c.longDesc || c.desc).slice(0, 155);
  return {
    title,
    description: desc,
    alternates: { canonical: `${brand.url}/work/${c.slug}` },
    openGraph: {
      title,
      description: desc,
      url: `${brand.url}/work/${c.slug}`,
      siteName: brand.name,
      images: [{ url: c.image, width: 1200, height: 630, alt: `${c.title} — ${c.tag}` }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [c.image],
    },
    robots: { index: true, follow: true },
  };
}

export default async function WorkDetail({ params }) {
  const { slug } = await params;
  const c = (await caseList()).find((x) => x.slug === slug);
  if (!c) notFound();
  const [vis, detailSection] = await Promise.all([getSection('workVisibility'), getSection('workDetail')]);
  if (c.kind === 'client') {
    if (vis?.data && vis.data.clientsEnabled === false) notFound();
  }

  const isOwn = c.kind === 'own';
  const d = detailSection.data && typeof detailSection.data === 'object' ? detailSection.data : workDetail;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': isOwn ? 'SoftwareApplication' : 'CreativeWork',
    name: c.title,
    description: c.longDesc || c.desc,
    image: `${site.url}${c.image}`,
    url: `${site.url}/work/${c.slug}`,
    author: { '@type': 'Organization', name: site.name, url: site.url },
    keywords: c.stack.join(', '),
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] font-grotesk">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NavbarWrapper />

      {/* breadcrumb — brutal */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em]">
          <Link href={c.kind === 'own' ? '/work/products' : '/work/clients'} className="inline-flex items-center gap-1.5 border-[3px] border-transparent px-2 py-1 text-[var(--text-secondary)] hover:border-[#020F40] hover:bg-white hover:text-[#020F40] dark:hover:border-[#11DFF5] dark:hover:bg-[#0B1220] dark:hover:text-white">
            {d.breadcrumb.work}
          </Link>
          <span aria-hidden className="h-1 w-1 bg-[#020F40]/20 dark:bg-white/20" />
          <Link
            href={c.kind === 'own' ? '/work/products' : '/work/clients'}
            className="hidden sm:inline-flex items-center gap-1.5 border-[3px] border-transparent px-2 py-1 text-[var(--text-secondary)] hover:border-[#020F40] hover:bg-white sm:flex dark:hover:border-[#11DFF5]"
          >
            {c.kind === 'own' ? d.breadcrumb.products : d.breadcrumb.clients}
          </Link>
          <span aria-hidden className="hidden h-1 w-1 bg-[#020F40]/20 dark:bg-white/20 sm:block" />
          <span aria-current="page" className="inline-flex items-center gap-1.5 border-[3px] border-[#020F40] bg-[#020F40] px-3 py-1 text-white shadow-[2px_2px_0_0_#11DFF5] dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]">
            <span className="h-1.5 w-1.5 animate-pulse bg-[#11DFF5] dark:bg-[#020F40]" />
            {c.title}
          </span>
        </nav>
      </div>

      {/* HERO — landscape banner first, sequenced content below */}
      <section className="mx-auto mt-6 max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="group relative overflow-hidden border-[4px] border-[#020F40] bg-[#020F40] shadow-[8px_8px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[8px_8px_0_0_#11DFF5]">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-black sm:aspect-[21/9]">
            <Image
              src={c.image}
              alt={`${c.title} — ${c.desc}`}
              fill
              priority
              sizes="100vw"
              className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* content — sequenced: identity + story | facts + actions */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <article className="relative min-w-0 overflow-hidden border-[4px] border-[#020F40] bg-[var(--bg-surface)] p-6 shadow-[6px_6px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[6px_6px_0_0_#11DFF5] sm:p-8">
            <div className="relative">
              <div className="inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-[#11DFF5] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#020F40] dark:border-[#11DFF5]">
                <span className="h-1.5 w-1.5 bg-[#020F40] dark:bg-[#020F40]" />
                {c.kind === 'own' ? d.kindLabel.own : d.kindLabel.client}{c.stack[0]}
              </div>

              <h1 className="mt-3 text-[32px] font-black leading-[0.9] tracking-[-0.03em] sm:text-[40px] lg:text-[48px]">
                <span className="block text-[var(--text-primary)]">{c.title}</span>
                <span className="mt-2 block text-[12px] font-black uppercase tracking-[0.16em] text-[#0D65EF] dark:text-[#11DFF5]">
                  {isOwn ? d.badges.own : d.badges.client} — {c.tag}
                </span>
              </h1>

              <p className="mt-3 max-w-[560px] text-justify text-[15px] font-bold leading-relaxed text-[var(--text-primary)]">
                {c.desc}
              </p>

              <p className="mt-3 max-w-[560px] border-l-[3px] border-[#11DFF5]/60 pl-4 text-justify text-[14px] font-medium leading-relaxed text-[var(--text-secondary)]">
                {c.longDesc}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {c.external ? (
                  <a
                    href={c.external}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 border-[4px] border-[#020F40] bg-[#0D65EF] px-6 py-3 text-[12px] font-black uppercase tracking-[0.14em] text-white shadow-[4px_4px_0_0_#020F40] transition hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[4px_4px_0_0_#11DFF5]"
                  >
                    {d.visitLive} <span aria-hidden>↗</span>
                  </a>
                ) : isOwn ? (
                  <span className="inline-flex items-center gap-2 border-[4px] border-dashed border-[#020F40]/40 px-6 py-3 text-[12px] font-black uppercase tracking-[0.14em] text-[var(--text-secondary)] dark:border-white/25">
                    {d.internalUse}
                  </span>
                ) : null}
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center border-[3px] border-[#020F40] bg-white px-6 py-3 text-[12px] font-black uppercase tracking-[0.14em] text-[#020F40] shadow-[4px_4px_0_0_#020F40] transition hover:bg-[#020F40] hover:text-white dark:border-[#11DFF5] dark:bg-[#0B1220] dark:text-white dark:hover:bg-[#11DFF5] dark:hover:text-[#020F40]"
                >
                  {d.startSimilar}
                </Link>
              </div>
            </div>
          </article>

          {/* facts column — stack, highlights, meta */}
          <aside className="flex min-w-0 flex-col gap-4">
            <div className="border-[4px] border-[#020F40] bg-[var(--bg-surface)] p-5 shadow-[5px_5px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[5px_5px_0_0_#11DFF5]">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-secondary)]">Stack</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.stack.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 border-[2px] border-[#020F40] bg-[var(--bg-elevated)] px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.10em] text-[var(--text-primary)] dark:border-white/15 dark:bg-white/10 dark:text-white"
                  >
                    <span className="h-1.5 w-1.5 bg-[#11DFF5] shadow-[0_0_4px_#11DFF5]" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <ul className="grid gap-2">
              {c.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 border-[3px] border-[#020F40] bg-[#020F40] px-3 py-3 shadow-[2px_2px_0_0_#11DFF5] dark:border-[#11DFF5] dark:bg-[#11DFF5]">
                  <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 bg-[#11DFF5] shadow-[0_0_6px_#11DFF5] dark:bg-[#020F40] dark:shadow-none" />
                  <span className="text-[12px] font-bold leading-relaxed tracking-[0.02em] text-white dark:text-[#020F40]">
                    {h}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-l-[3px] border-[#11DFF5] bg-[#0D65EF]/10 px-4 py-3 text-[12px] font-medium leading-relaxed text-[#0D65EF] dark:border-[#11DFF5] dark:bg-[#11DFF5]/10 dark:text-[#C6EAF4]">
              <span className="font-black uppercase tracking-[0.12em]">{c.kind === 'own' ? d.kindLabel.own : d.kindLabel.client}</span>
              {c.tag}
            </div>
          </aside>
        </div>
      </section>

      {/* nav */}
      <nav aria-label="Work navigation" className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-3 border-t-[3px] border-[#020F40]/10 px-4 py-6 dark:border-white/10 sm:px-6 lg:px-8 mt-8">
        <Link
          href={c.kind === 'own' ? '/work/products' : '/work/clients'}
          className="inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-white px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#020F40] shadow-[3px_3px_0_0_#020F40] transition hover:bg-[#020F40] hover:text-white dark:border-[#11DFF5] dark:bg-transparent dark:text-white dark:hover:bg-[#11DFF5] dark:hover:text-[#020F40]"
        >
          ← {d.backToWork} {c.kind === 'own' ? d.breadcrumb.products : d.breadcrumb.clients}
        </Link>
        <Link
          href={c.kind === 'own' ? '/work/products' : '/work/clients'}
          className="inline-flex items-center gap-2 border-[3px] border-[#020F40]/15 bg-[var(--bg-elevated)]/50 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-primary)] hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white"
        >
          {c.kind === 'own' ? d.moreProducts : d.moreClients} →
        </Link>
        {c.external ? (
          <a
            href={c.external}
            target="_blank"
            rel="noreferrer noopener"
            className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#0D65EF] hover:text-[#020F40] dark:text-[#11DFF5] dark:hover:text-white"
          >
            {d.visitLive} <span aria-hidden>↗</span>
          </a>
        ) : isOwn ? (
          <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--text-secondary)]">
            {d.internalUse}
          </span>
        ) : null}
      </nav>
    </div>
  );
}
