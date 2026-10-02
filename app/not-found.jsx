import Link from 'next/link';
import { NavbarWrapper } from '@/components/navbar-wrapper';
import { site, pages } from '@/lib/site';

export const metadata = {
  title: `404 — ${site.name}`,
  description: pages.notFound.desc,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] font-grotesk">
      <NavbarWrapper />

      <main className="mx-auto flex max-w-[720px] flex-col items-center px-4 sm:px-6 py-16 sm:py-24 text-center">
        <div className="border-[4px] border-[#020F40] bg-[#020F40] px-4 py-1 text-[11px] font-black tracking-[0.18em] uppercase text-[#11DFF5] dark:border-[#11DFF5]">
          {pages.notFound.kicker}
        </div>

        <h1 className="mt-6 text-[56px] sm:text-[84px] font-black tracking-[-0.04em] leading-[0.85] text-[var(--text-primary)]">
          {pages.notFound.title[0]}
          <span className="block text-[#0D65EF] dark:text-[#11DFF5]">{pages.notFound.title[1]}</span>
        </h1>

        <p className="mt-4 max-w-[520px] text-[14px] font-medium leading-relaxed text-[var(--text-secondary)]">
          {pages.notFound.desc}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={pages.notFound.primaryCta.href}
            className="inline-flex items-center justify-center border-[4px] border-[#020F40] bg-[#0D65EF] px-7 py-3 text-[13px] font-black tracking-[0.16em] uppercase text-white shadow-[4px_4px_0_0_#020F40] hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[4px_4px_0_0_#11DFF5]"
          >
            {pages.notFound.primaryCta.label}
          </Link>

          <Link
            href={pages.notFound.secondaryCta.href}
            className="inline-flex items-center justify-center border-[3px] border-[#020F40] bg-[var(--bg-surface)] px-7 py-3 text-[13px] font-bold tracking-[0.16em] uppercase text-[var(--text-primary)] shadow-[4px_4px_0_0_#020F40] hover:bg-white dark:border-[#11DFF5] dark:shadow-[4px_4px_0_0_#11DFF5]"
          >
            {pages.notFound.secondaryCta.label}
          </Link>
        </div>

        <div className="mt-12 flex w-full items-center gap-3">
          <span className="h-px flex-1 bg-[#020F40] dark:bg-[#11DFF5]/30" />
          <span className="text-[10px] font-black tracking-[0.18em] uppercase text-[#2E729F]">{site.shortName} • 404</span>
          <span className="h-px flex-1 bg-[#020F40] dark:bg-[#11DFF5]/30" />
        </div>
      </main>
    </div>
  );
}
