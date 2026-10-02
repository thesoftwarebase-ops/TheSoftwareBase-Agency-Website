import { NavbarWrapper } from '@/components/navbar-wrapper';
import { site, pages } from '@/lib/site';
import Link from 'next/link';

export const metadata = {
  title: `Terms — ${site.name}`,
  description: pages.terms.desc,
  alternates: { canonical: `${site.url}/terms` },
  openGraph: {
    title: `Terms — ${site.name}`,
    description: pages.terms.desc,
    url: `${site.url}/terms`,
    siteName: site.name,
    type: 'website',
    images: [{ url: '/home-hero.png', width: 1200, height: 630, alt: `Terms — ${site.name}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Terms — ${site.name}`,
    description: pages.terms.desc,
    images: ['/home-hero.png'],
  },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] font-grotesk">
      <NavbarWrapper />

      <main className="mx-auto max-w-[880px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="border-[4px] border-[#020F40] bg-[#020F40] p-6 sm:p-10 text-white shadow-[8px_8px_0_0_#11DFF5] dark:border-[#11DFF5]">
          <div className="inline-flex border-[3px] border-white bg-[#11DFF5] px-3 py-1 text-[11px] font-black tracking-[0.16em] uppercase text-[#020F40]">
            {pages.terms.kicker}
          </div>

          <h1 className="mt-4 text-[32px] font-black leading-[0.9] tracking-[-0.03em] sm:text-[44px] lg:text-[52px]">
            {pages.terms.title[0]}
            <span className="block text-[#11DFF5]">{pages.terms.title[1]}</span>
          </h1>

          <p className="mt-3 max-w-[640px] text-[14px] font-medium leading-relaxed text-white/80">
            {pages.terms.desc}
          </p>

          <div className="mt-3 inline-flex border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold tracking-[0.12em] uppercase text-white/70">
            {pages.terms.updated}
          </div>
        </div>

        <div className="mt-8 grid gap-6">
          {pages.terms.sections.map((s) => (
            <div key={s.title} className="border-[4px] border-[#020F40] bg-[var(--bg-surface)] p-6 shadow-[4px_4px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[4px_4px_0_0_#11DFF5]">
              <h2 className="text-[13px] font-black tracking-[0.14em] uppercase text-[#0D65EF] dark:text-[#11DFF5]">
                {s.title}
              </h2>

              <p className="mt-2 text-[13px] font-medium leading-relaxed text-[var(--text-secondary)]">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-[4px] border-[#020F40] bg-[var(--bg-surface)] p-6 shadow-[6px_6px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[6px_6px_0_0_#11DFF5]">
          <p className="text-[13px] font-bold tracking-[0.14em] uppercase text-[var(--text-secondary)]">
            {pages.terms.agreeLabel}
          </p>

          <Link href={site.cta.href} className="ml-auto inline-flex border-[3px] border-[#020F40] bg-[#0D65EF] px-6 py-2 text-[12px] font-black tracking-[0.14em] uppercase text-white dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]">
            {site.cta.label}
          </Link>
        </div>
      </main>
    </div>
  );
}
