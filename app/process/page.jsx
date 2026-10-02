import { NavbarWrapper } from '@/components/navbar-wrapper';
import Link from 'next/link';
import { processSteps, site, pages } from '@/lib/site';
import { getSection, withFallback } from '@/lib/content';
import {
  ArrowRight,
  Clock3,
  Shield,
  Search,
  Wrench,
  Rocket,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { LenisAssembly } from '@/components/process/lenis-assembly';

export async function generateMetadata() {
  const [copySection, brandSection] = await Promise.all([getSection('pages'), getSection('site')]);
  const copy = withFallback(pages, copySection.data);
  const brand = brandSection.data && typeof brandSection.data === 'object' ? brandSection.data : site;
  return {
    title: `Process — ${brand.name}`,
    description: copy.process.desc,
    alternates: { canonical: `${brand.url}/process` },
    openGraph: {
      title: `Process — ${brand.name}`,
      description: copy.process.desc,
      url: `${brand.url}/process`,
      siteName: brand.name,
      type: 'website',
      images: [{
        url: '/home-hero.png',
        width: 1200,
        height: 630,
        alt: `Process — ${brand.name} ${copy.process.title.join(' ')}`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Process — ${brand.name}`,
      description: copy.process.desc,
      images: ['/home-hero.png'],
    },
    robots: { index: true, follow: true },
  };
}

const HERO_ICONS = [Search, Wrench, Rocket, TrendingUp];

export default async function ProcessPage() {
  const [section, copySection] = await Promise.all([getSection('processSteps'), getSection('pages')]);
  const steps = Array.isArray(section.data) && section.data.length ? section.data : processSteps;
  const copy = withFallback(pages, copySection.data);
  const prc = copy.process;
  const lastOdd = steps.length % 2 === 1;
  return (
    <div className="min-h-screen bg-[var(--bg-base)] font-grotesk">
      <NavbarWrapper />

      <section className="relative isolate overflow-hidden border-b-[5px] border-[#11DFF5] bg-[#020F40] text-white">
        {/* All decoration stays behind the content and inside the hero. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(17,223,245,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,223,245,0.09)_1px,transparent_1px)] bg-[size:36px_36px]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_72%_90%_at_75%_15%,rgba(13,101,239,0.28),transparent_72%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(110deg,#020F40_6%,rgba(2,15,64,0.84)_45%,rgba(2,15,64,0.3)_100%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[50%] hidden w-px bg-[#11DFF5]/15 lg:block" />
        <div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-[5px] w-full bg-gradient-to-r from-[#11DFF5] via-[#0D65EF] to-[#11DFF5]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 top-6 h-44 w-44 rotate-45 border-[16px] border-[#11DFF5]/10 sm:h-64 sm:w-64" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-16 bottom-0 h-32 w-32 rotate-45 border-[14px] border-[#0D65EF]/20" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/2 hidden -translate-x-1/2 select-none whitespace-nowrap text-[12vw] font-black leading-none tracking-[-0.07em] text-white/[0.035] lg:block xl:text-[10vw]">
          {prc.kicker.toUpperCase()}
        </div>

        <div className="relative mx-auto grid max-w-[1440px] gap-12 px-4 py-16 sm:gap-14 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-24 xl:gap-16">
          <div className="relative flex min-w-0 flex-col justify-center lg:col-span-6">
            <div className="inline-flex items-center gap-2 self-start border-[3px] border-[#020F40] bg-[#11DFF5] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#020F40] shadow-[3px_3px_0_0_#0D65EF]">
              <span aria-hidden="true" className="h-2 w-2 bg-[#020F40]" />
              {prc.kicker}
            </div>

            <h1 className="relative mt-6 max-w-[650px] text-[clamp(2.75rem,7vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.065em] text-white">
              <span className="block break-words">{prc.title[0]}</span>
              <span className="relative mt-2 block w-fit max-w-full break-words text-[#11DFF5]">
                {prc.title[1]}
                <span aria-hidden="true" className="absolute -bottom-2 left-0 h-[5px] w-full max-w-[85%] bg-[#0D65EF] sm:-bottom-3" />
              </span>
            </h1>

            <div className="mt-9 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 border-l-[5px] border-[#11DFF5] bg-white/[0.055] px-4 py-3 sm:mt-11">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#11DFF5]">
                <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
                {prc.timeline}
              </span>
              <span aria-hidden="true" className="h-1 w-1 shrink-0 bg-[#11DFF5]" />
              <span className="text-[13px] font-medium leading-snug text-white/80">
                {prc.timelineLabel} {prc.timelineSuffix}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap items-stretch gap-3">
              <Link
                href="/contact"
                className="group inline-flex min-h-14 items-center justify-center gap-3 border-[4px] border-[#11DFF5] bg-[#11DFF5] px-5 py-3 text-[12px] font-black uppercase tracking-[0.13em] text-[#020F40] shadow-[5px_5px_0_0_#0D65EF] transition-[transform,box-shadow,background-color] duration-200 hover:translate-x-px hover:translate-y-px hover:bg-white hover:shadow-[4px_4px_0_0_#0D65EF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:px-7"
              >
                {prc.primaryCta}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[#020F40] text-[#11DFF5] transition-transform group-hover:translate-x-0.5">
                  <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                href="#assembly"
                className="inline-flex min-h-14 items-center justify-center border-[3px] border-[#11DFF5]/50 bg-[#020F40]/60 px-5 py-3 text-center text-[11px] font-black uppercase tracking-[0.13em] text-white transition-colors hover:border-[#11DFF5] hover:bg-[#11DFF5] hover:text-[#020F40] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#11DFF5] sm:px-7"
              >
                {prc.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="relative min-w-0 lg:col-span-6 lg:flex lg:flex-col lg:justify-center lg:pl-8">
            <div aria-hidden="true" className="pointer-events-none absolute -inset-3 hidden border-[3px] border-[#11DFF5]/15 sm:block" />
            <div className="relative grid grid-cols-2 gap-3 sm:gap-5">
              {steps.map((step, index) => {
                const Icon = HERO_ICONS[index % HERO_ICONS.length] || Zap;
                const light = index % 2 === 0;

                return (
                  <div
                    key={step.n ?? index}
                    className={`group relative flex min-h-[158px] min-w-0 flex-col overflow-hidden border-[4px] p-3 shadow-[5px_5px_0_0_#0D65EF] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#11DFF5] sm:min-h-[185px] sm:p-5 ${light ? 'border-[#11DFF5] bg-white text-[#020F40]' : 'border-[#11DFF5] bg-[#020F40] text-white'} ${lastOdd && index === steps.length - 1 ? 'col-span-2' : ''}`}
                  >
                    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#020F40_1px,transparent_1px),linear-gradient(to_bottom,#020F40_1px,transparent_1px)] bg-[size:24px_24px] ${light ? 'opacity-[0.035]' : 'opacity-[0.075]'}`} />
                    <div aria-hidden="true" className={`absolute left-0 top-0 h-[5px] w-full ${light ? 'bg-[#0D65EF]' : 'bg-[#11DFF5]'}`} />
                    <div className="relative flex items-start justify-between gap-2">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center border-[3px] sm:h-11 sm:w-11 ${light ? 'border-[#020F40] bg-[#020F40] text-[#11DFF5]' : 'border-[#11DFF5] bg-[#11DFF5] text-[#020F40]'}`}>
                        <Icon aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <span className={`text-[22px] font-black leading-none tracking-[-0.08em] sm:text-[30px] ${light ? 'text-[#0D65EF]' : 'text-[#11DFF5]'}`}>
                        {step.n || String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="relative mt-auto pt-5">
                      <div className={`h-[3px] w-9 ${light ? 'bg-[#0D65EF]' : 'bg-[#11DFF5]'}`} />
                      <div className={`mt-3 break-words text-[clamp(0.85rem,2vw,1.1rem)] font-black uppercase leading-tight tracking-[-0.03em] ${light ? 'text-[#020F40]' : 'text-white'}`}>
                        {step.title}
                      </div>
                      <div className={`mt-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${light ? 'text-[#0D65EF]' : 'text-[#11DFF5]'}`}>
                        {step.duration}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative mt-5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5 border-[3px] border-[#11DFF5]/30 bg-[#020F40] px-4 py-3">
              <span aria-hidden="true" className="h-2 w-2 shrink-0 bg-[#11DFF5] shadow-[0_0_8px_#11DFF5]" />
              <span className="min-w-0 break-words text-[11px] font-black uppercase tracking-[0.12em] text-white/80">
                {prc.badges.stacked} • {prc.badges.overlap}
              </span>
              <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#11DFF5]">
                <Shield aria-hidden="true" className="h-3 w-3" />
                {prc.scalesKicker}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="assembly" className="scroll-mt-24">
        <LenisAssembly steps={steps} copy={copy} />
      </section>
    </div>
  );
}