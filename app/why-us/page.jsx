import { NavbarWrapper } from '@/components/navbar-wrapper';
import Link from 'next/link';
import { whyUs, site, pages } from '@/lib/site';
import { getSection, withFallback } from '@/lib/content';
import { ArrowRight, Zap, Shield, Layers, Rocket, TrendingUp, Check, X } from 'lucide-react';

export async function generateMetadata() {
  const [copySection, brandSection] = await Promise.all([getSection('pages'), getSection('site')]);
  const copy = withFallback(pages, copySection.data);
  const brand = brandSection.data && typeof brandSection.data === 'object' ? brandSection.data : site;
  return {
    title: `Why us — ${brand.name}`,
    description: copy.whyUs.desc,
    alternates: { canonical: `${brand.url}/why-us` },
    openGraph: {
      title: `Why us — ${brand.name}`,
      description: copy.whyUs.desc,
      url: `${brand.url}/why-us`,
      siteName: brand.name,
      type: 'website',
      images: [{ url: '/home-hero.png', width: 1200, height: 630, alt: `Why us — ${brand.name}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Why us — ${brand.name}`,
      description: copy.whyUs.desc,
      images: ['/home-hero.png'],
    },
    robots: { index: true, follow: true },
  };
}

const REASON_ICONS = [Zap, Layers, Rocket, Shield];
const STAT_ICONS = [TrendingUp, Shield, Zap, Rocket];

export default async function WhyUsPage() {
  const [copySection, whySection, brandSection] = await Promise.all([
    getSection('pages'),
    getSection('whyUs'),
    getSection('site'),
  ]);
  const copy = withFallback(pages, copySection.data);
  const wu = copy.whyUs;
  const whyData = whySection.data && typeof whySection.data === 'object' && !Array.isArray(whySection.data) ? whySection.data : whyUs;
  const brand = brandSection.data && typeof brandSection.data === 'object' ? brandSection.data : site;
  return (
    <div className="min-h-screen bg-[var(--bg-base)] font-grotesk">
      <NavbarWrapper />

      {/* HERO — GODLIKE, color-responsive (light/dark), all copy from lib */}
      <section className="relative w-full overflow-clip border-b-[4px] border-[#020F40] bg-[#C6EAF4] dark:border-[#11DFF5] dark:bg-[#020F40]">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(2,15,64,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(2,15,64,0.08)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,rgba(17,223,245,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,223,245,0.07)_1px,transparent_1px)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(1100px_600px_at_18%_0%,rgba(13,101,239,0.16),transparent_70%)] dark:bg-[radial-gradient(1100px_600px_at_18%_0%,rgba(17,223,245,0.14),transparent_72%)]" />
        <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-[5px] w-full bg-gradient-to-r from-[#0D65EF] via-[#11DFF5] to-[#0D65EF]" />
        <div aria-hidden className="pointer-events-none absolute -right-12 top-8 h-44 w-44 rotate-45 border-[16px] border-[#020F40]/10 dark:border-[#11DFF5]/10 sm:h-64 sm:w-64" />
        <div aria-hidden className="pointer-events-none absolute -left-16 bottom-0 h-32 w-32 rotate-45 border-[14px] border-[#0D65EF]/15 dark:border-[#0D65EF]/25" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-[50%] hidden w-px bg-[#020F40]/10 dark:bg-[#11DFF5]/15 lg:block" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 hidden -translate-x-1/2 select-none whitespace-nowrap text-[12vw] font-black leading-none tracking-[-0.06em] text-[#020F40]/[0.05] dark:text-white/[0.04] lg:block xl:text-[10vw]">
          {wu.kicker.toUpperCase()}
        </div>
        <div className="relative mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8 py-16 sm:py-20 lg:py-24">
          {/* LEFT — godlike type, adaptive colors */}
          <div className="relative flex min-w-0 flex-col justify-center lg:col-span-6">
            <div className="inline-flex items-center gap-2 self-start border-[3px] border-[#020F40] bg-[#11DFF5] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#020F40] shadow-[3px_3px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[3px_3px_0_0_white]">
              <span aria-hidden className="h-2 w-2 animate-pulse bg-[#020F40]" />
              {wu.kicker}
            </div>
            <h1 className="mt-6 max-w-[620px] text-[clamp(2.75rem,7vw,5.75rem)] font-black uppercase leading-[0.88] tracking-[-0.05em] text-[#020F40] dark:text-white">
              <span className="block break-words">{wu.title[0]}</span>
              <span className="relative mt-2 block w-fit max-w-full break-words text-[#0D65EF] [text-shadow:0_0_28px_rgba(13,101,239,0.35)] dark:text-[#11DFF5] dark:[text-shadow:0_0_28px_rgba(17,223,245,0.5)]">
                {wu.title[1]}
                <span aria-hidden className="absolute -bottom-2 left-0 h-[5px] w-full max-w-[85%] bg-[#11DFF5] dark:bg-[#0D65EF] sm:-bottom-3" />
              </span>
            </h1>
            <p className="mt-9 max-w-[560px] border-l-[5px] border-[#0D65EF] bg-white/60 py-3 pl-5 pr-4 text-[15px] font-medium leading-relaxed text-[#020F40]/80 dark:border-[#11DFF5] dark:bg-white/[0.055] dark:text-white/80 sm:text-[16px]">
              {wu.desc}
            </p>
            <div className="mt-8 flex flex-wrap items-stretch gap-3">
              <Link href={wu.primaryCta.href} className="group inline-flex min-h-14 items-center justify-center gap-3 border-[4px] border-[#020F40] bg-[#020F40] px-5 py-3 text-[12px] font-black uppercase tracking-[0.13em] text-white shadow-[5px_5px_0_0_#0D65EF] transition-[transform,box-shadow,background-color] duration-200 hover:translate-x-px hover:translate-y-px hover:shadow-[4px_4px_0_0_#0D65EF] dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40] dark:shadow-[5px_5px_0_0_white] dark:hover:bg-white dark:hover:shadow-[4px_4px_0_0_white] sm:px-7">
                {wu.primaryCta.label}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[#11DFF5] text-[#020F40] transition-transform group-hover:translate-x-0.5 dark:bg-[#020F40] dark:text-[#11DFF5]"><ArrowRight className="h-3.5 w-3.5" /></span>
              </Link>
              <Link href={wu.secondaryCta.href} className="inline-flex min-h-14 items-center justify-center border-[3px] border-[#020F40]/30 bg-white/50 px-5 py-3 text-center text-[11px] font-black uppercase tracking-[0.13em] text-[#020F40] transition-colors hover:border-[#020F40] hover:bg-[#020F40] hover:text-white dark:border-[#11DFF5]/50 dark:bg-transparent dark:text-white dark:hover:border-[#11DFF5] dark:hover:bg-[#11DFF5] dark:hover:text-[#020F40] sm:px-7">
                {wu.secondaryCta.label}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-[#020F40]/15 py-3 dark:border-white/15">
              <span aria-hidden className="h-2 w-2 animate-pulse bg-[#0D65EF] shadow-[0_0_8px_#0D65EF] dark:bg-[#11DFF5] dark:shadow-[0_0_8px_#11DFF5]" />
              <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[#020F40]/70 dark:text-white/70">
                {String(whyData.reasons.length).padStart(2, '0')} {wu.reasonsKicker}
              </span>
              <span aria-hidden className="h-1 w-1 bg-[#020F40]/25 dark:bg-white/25" />
              <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[#0D65EF] dark:text-[#11DFF5]">
                {brand.shortName} — {whyData.compare.badge}
              </span>
            </div>
          </div>

          {/* RIGHT — godlike 2x2 stat UI, adaptive colors, all from lib */}
          <div className="relative min-w-0 lg:col-span-6 lg:flex lg:flex-col lg:justify-center lg:pl-8">
            <div aria-hidden className="pointer-events-none absolute -inset-3 hidden border-[3px] border-[#020F40]/15 dark:border-[#11DFF5]/15 sm:block" />
            <div className="relative grid grid-cols-2 gap-3 sm:gap-5">
              {whyData.stats.map((s, idx) => {
                const Icon = STAT_ICONS[idx % STAT_ICONS.length];
                const light = idx % 2 === 0;
                return (
                  <div
                    key={s.k}
                    className={`group relative flex min-h-[158px] min-w-0 flex-col overflow-hidden border-[4px] p-3 shadow-[5px_5px_0_0_#020F40] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 dark:shadow-[5px_5px_0_0_#11DFF5] hover:dark:shadow-[7px_7px_0_0_#11DFF5] sm:min-h-[185px] sm:p-5 ${light ? 'border-[#020F40] bg-white text-[#020F40] dark:border-[#11DFF5] dark:bg-[#0B1220] dark:text-white' : 'border-[#020F40] bg-[#020F40] text-white dark:border-[#11DFF5] dark:bg-white/[0.05]'}`}
                  >
                    <div aria-hidden className={`pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#020F40_1px,transparent_1px),linear-gradient(to_bottom,#020F40_1px,transparent_1px)] bg-[size:24px_24px] ${light ? 'opacity-[0.04] dark:opacity-[0.07]' : 'opacity-[0.07]'}`} />
                    <div aria-hidden className={`absolute left-0 top-0 h-[5px] w-full ${light ? 'bg-[#0D65EF]' : 'bg-[#11DFF5]'}`} />
                    <div className="relative flex items-start justify-between gap-2">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center border-[3px] sm:h-11 sm:w-11 ${light ? 'border-[#020F40] bg-[#020F40] text-[#11DFF5]' : 'border-[#11DFF5] bg-[#11DFF5] text-[#020F40]'}`}>
                        <Icon aria-hidden className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <span className={`text-[22px] font-black leading-none tracking-[-0.08em] sm:text-[30px] ${light ? 'text-[#0D65EF] dark:text-[#11DFF5]' : 'text-[#11DFF5]'}`}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="relative mt-auto pt-5">
                      <div className={`h-[3px] w-9 ${light ? 'bg-[#0D65EF]' : 'bg-[#11DFF5]'}`} />
                      <div className={`mt-3 break-words text-[clamp(1.4rem,3vw,1.9rem)] font-black leading-none tracking-[-0.03em] ${light ? 'text-[#020F40] dark:text-white' : 'text-white'}`}>{s.v}</div>
                      <div className={`mt-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${light ? 'text-[#0D65EF] dark:text-[#11DFF5]' : 'text-[#11DFF5]'}`}>{s.k}</div>
                    </div>
                    <div aria-hidden className={`pointer-events-none absolute bottom-0 left-0 h-[4px] w-0 transition-all duration-500 group-hover:w-full ${light ? 'bg-[#0D65EF]' : 'bg-[#11DFF5]'}`} />
                  </div>
                );
              })}
            </div>
            <div className="relative mt-5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5 border-[3px] border-[#020F40]/20 bg-white/70 px-4 py-3 dark:border-[#11DFF5]/30 dark:bg-white/[0.04]">
              <span aria-hidden className="h-2 w-2 shrink-0 animate-pulse bg-[#0D65EF] shadow-[0_0_8px_#0D65EF] dark:bg-[#11DFF5] dark:shadow-[0_0_8px_#11DFF5]" />
              <span className="min-w-0 break-words text-[11px] font-black uppercase tracking-[0.12em] text-[#020F40]/80 dark:text-white/80">
                {wu.compareKicker}
              </span>
              <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#0D65EF] dark:text-[#11DFF5]">
                <Shield aria-hidden className="h-3 w-3" />
                {whyData.compare.badge}
              </span>
            </div>
          </div>
        </div>
      </section>

      <main id="main-content" className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* reasons — LEDGER ROWS, ghost numbers, charge bars, all from lib */}
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-[#020F40] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#11DFF5] dark:border-[#11DFF5]">
            <Zap aria-hidden className="h-3 w-3 animate-pulse" />
            {wu.reasonsKicker}
          </h2>
          <span className="hidden h-px flex-1 bg-[#020F40]/10 dark:bg-white/10 sm:block" />
          <span className="inline-flex items-center gap-2 border-[3px] border-[#020F40]/15 bg-[var(--bg-surface)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--text-secondary)] dark:border-white/15">
            {String(whyData.reasons.length).padStart(2, '0')} {wu.reasonsKicker}
          </span>
        </div>
        <div className="mt-8 grid gap-5 lg:gap-6">
          {whyData.reasons.map((r, idx) => {
            const Icon = REASON_ICONS[idx % REASON_ICONS.length];
            const flip = idx % 2 === 1;
            return (
              <article
                key={r.n}
                className="group relative grid gap-4 overflow-hidden border-[4px] border-[#020F40] bg-[var(--bg-surface)] p-5 shadow-[6px_6px_0_0_#020F40] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_#0D65EF] dark:border-[#11DFF5] dark:shadow-[6px_6px_0_0_#11DFF5] sm:p-6 md:grid-cols-12 md:items-center lg:gap-6"
              >
                <div aria-hidden className={`absolute left-0 top-0 h-[5px] w-full ${flip ? 'bg-[#11DFF5]' : 'bg-[#0D65EF]'}`} />
                {/* ghost number rail */}
                <div className="relative flex items-center gap-3 md:col-span-3 lg:col-span-2">
                  <span aria-hidden className="text-[52px] font-black leading-none tracking-[-0.05em] text-[#020F40]/10 dark:text-white/10 sm:text-[64px]">
                    {r.n}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#0D65EF] dark:text-[#11DFF5]">
                    {String(idx + 1).padStart(2, '0')}/{String(whyData.reasons.length).padStart(2, '0')}
                  </span>
                </div>
                {/* icon + copy */}
                <div className="min-w-0 md:col-span-6 lg:col-span-7">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center border-[3px] shadow-[3px_3px_0_0_#020F40] dark:shadow-[3px_3px_0_0_#11DFF5] ${flip ? 'border-[#020F40] bg-[#020F40] text-[#11DFF5] dark:border-[#11DFF5]' : 'border-[#020F40] bg-[#11DFF5] text-[#020F40] dark:border-[#11DFF5]'}`}>
                      <Icon aria-hidden className="h-5 w-5" />
                    </span>
                    <h2 className="min-w-0 break-words text-[17px] font-black uppercase leading-tight tracking-[-0.02em] text-[var(--text-primary)] sm:text-[19px]">
                      {r.title}
                    </h2>
                  </div>
                  <p className="mt-2.5 max-w-[640px] text-[13px] font-medium leading-relaxed text-[var(--text-secondary)] sm:text-[14px]">
                    {r.desc}
                  </p>
                </div>
                {/* charge rail */}
                <div className="min-w-0 border-[3px] border-[#020F40]/10 bg-[var(--bg-base)] p-3.5 dark:border-white/10 md:col-span-3">
                  <div className="flex items-center justify-between gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                    <span>{wu.reasonsKicker}</span>
                    <span className="text-[#0D65EF] dark:text-[#11DFF5]">{r.n}</span>
                  </div>
                  <div className="mt-2 h-[8px] w-full border-[2px] border-[#020F40]/15 bg-white dark:border-white/15 dark:bg-white/5">
                    <div className={`h-full ${flip ? 'bg-[#11DFF5]' : 'bg-[#0D65EF]'}`} style={{ width: `${((idx + 1) / whyData.reasons.length) * 100}%` }} />
                  </div>
                  <div className="mt-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#0D65EF] dark:text-[#11DFF5]">
                    {brand.shortName} — {whyData.compare.badge}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* compare — HEAD-TO-HEAD SCOREBOARD, round rows, all from lib */}
        <div className="relative mt-12 overflow-hidden border-[4px] border-[#020F40] bg-[#020F40] p-6 shadow-[8px_8px_0_0_#0D65EF] dark:border-[#11DFF5] dark:shadow-[8px_8px_0_0_#11DFF5] sm:p-8">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(17,223,245,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,223,245,0.06)_1px,transparent_1px)] bg-[size:28px_28px]" />
          <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-[5px] w-full bg-gradient-to-r from-[#0D65EF] via-[#11DFF5] to-[#0D65EF]" />
          <div className="relative flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 border-[3px] border-[#11DFF5] bg-[#11DFF5] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#020F40]">
              <Shield aria-hidden className="h-3 w-3" />
              {wu.compareKicker}
            </div>
            <span className="hidden h-px flex-1 bg-white/10 sm:block" />
            <span className="inline-flex items-center gap-1.5 border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/70">
              {String(whyData.compare.them.length).padStart(2, '0')} — {whyData.compare.badge}
            </span>
          </div>
          <h3 className="relative mt-5 max-w-[640px] text-[clamp(1.75rem,4vw,2.5rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-white">
            <span className="block">{wu.compareTitle[0]}</span>
            <span className="block text-[#11DFF5]">{wu.compareTitle[1]}</span>
          </h3>
          <div className="relative mt-7 grid gap-4">
            {whyData.compare.them.map((t, i) => (
              <div key={t} className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]">
                <div className="min-w-0 border-[3px] border-white/15 bg-white/[0.04] p-4 backdrop-blur">
                  <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
                    <X aria-hidden className="h-3.5 w-3.5" />
                    {wu.themTitle}
                  </div>
                  <p className="mt-2 min-w-0 break-words text-[13px] font-medium leading-relaxed text-white/60">
                    {t}
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <span className="flex h-11 w-11 flex-col items-center justify-center border-[3px] border-[#11DFF5] bg-[#11DFF5] text-[#020F40] shadow-[3px_3px_0_0_white] md:rotate-0">
                    <Zap aria-hidden className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-black leading-none tracking-[0.08em]">{String(i + 1).padStart(2, '0')}</span>
                  </span>
                </div>
                <div className="min-w-0 border-[3px] border-[#11DFF5] bg-white p-4 text-[#020F40] shadow-[4px_4px_0_0_#11DFF5] dark:bg-white">
                  <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#0D65EF]">
                    <Check aria-hidden className="h-3.5 w-3.5" />
                    {brand.name}
                  </div>
                  <p className="mt-2 min-w-0 break-words text-[13px] font-bold leading-relaxed text-[#020F40]">
                    {whyData.compare.us[i] ?? t}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* closer CTA — reuses lib CTAs, no hardcode */}
        <div className="mt-8 flex flex-col gap-4 border-[4px] border-[#020F40] bg-[#11DFF5] p-6 shadow-[6px_6px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[6px_6px_0_0_#11DFF5] sm:p-7 lg:flex-row lg:items-center">
          <div className="min-w-0">
            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#020F40]/70">
              {brand.name} — {wu.kicker}
            </div>
            <div className="mt-1 break-words text-[20px] font-black uppercase leading-none tracking-[-0.02em] text-[#020F40] sm:text-[24px]">
              {wu.title[0]} {wu.title[1]}
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3 lg:ml-auto">
            <Link href={wu.primaryCta.href} className="group inline-flex items-center gap-2 border-[4px] border-[#020F40] bg-[#020F40] px-6 py-3 text-[12px] font-black uppercase tracking-[0.14em] text-white shadow-[4px_4px_0_0_white] transition hover:translate-x-px hover:translate-y-px">
              {wu.primaryCta.label}
              <ArrowRight aria-hidden className="h-4 w-4 text-[#11DFF5] transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href={wu.secondaryCta.href} className="inline-flex items-center justify-center border-[3px] border-[#020F40] bg-white px-6 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-[#020F40] transition-colors hover:bg-[#020F40] hover:text-white">
              {wu.secondaryCta.label}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
