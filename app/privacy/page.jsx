import { NavbarWrapper } from '@/components/navbar-wrapper';
import { site, pages } from '@/lib/site';

export const metadata = {
  title: `Privacy — ${site.name}`,
  description: pages.privacy.desc,
  alternates: { canonical: `${site.url}/privacy` },
  openGraph: {
    title: `Privacy — ${site.name}`,
    description: pages.privacy.desc,
    url: `${site.url}/privacy`,
    siteName: site.name,
    type: 'website',
    images: [{ url: '/home-hero.png', width: 1200, height: 630, alt: `Privacy — ${site.name}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Privacy — ${site.name}`,
    description: pages.privacy.desc,
    images: ['/home-hero.png'],
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] font-grotesk">
      <NavbarWrapper />

      <main className="mx-auto max-w-[880px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="border-[4px] border-[#020F40] bg-[var(--bg-surface)] p-6 sm:p-10 shadow-[8px_8px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[8px_8px_0_0_#11DFF5]">
          <div className="inline-flex border-[3px] border-[#020F40] bg-[#11DFF5] px-3 py-1 text-[11px] font-black tracking-[0.16em] uppercase text-[#020F40] dark:border-[#11DFF5]">
            {pages.privacy.kicker}
          </div>

          <h1 className="mt-4 text-[32px] font-black leading-[0.9] tracking-[-0.03em] text-[var(--text-primary)] sm:text-[44px] lg:text-[52px]">
            {pages.privacy.title[0]}
            <span className="block text-[#0D65EF] dark:text-[#11DFF5]">{pages.privacy.title[1]}</span>
          </h1>

          <p className="mt-3 max-w-[640px] text-[14px] font-medium leading-relaxed text-[var(--text-secondary)]">
            {pages.privacy.desc}
          </p>

          <div className="mt-3 inline-flex border border-[#020F40]/10 bg-[var(--bg-elevated)] px-3 py-1 text-[11px] font-bold tracking-[0.12em] uppercase text-[var(--text-secondary)] dark:border-white/10 dark:bg-white/5 dark:text-white/60">
            {pages.privacy.updated}
          </div>
        </div>

        <div className="mt-8 grid gap-6">
          {pages.privacy.sections.map((s) => (
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
      </main>
    </div>
  );
}
