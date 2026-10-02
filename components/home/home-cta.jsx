import Link from 'next/link';
import { site as libSite, pages as libPages } from '@/lib/site';

export function HomeCTA({ copy, brand }) {
  const pages = copy || libPages;
  const site = brand || libSite;
  return (
    <section id="cta" aria-labelledby="cta-heading" className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 mt-10 pb-16">
      <div className="flex flex-col items-center justify-between gap-6 border-[4px] border-[#020F40] bg-[#0D65EF] p-6 sm:p-8 text-white shadow-[8px_8px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[8px_8px_0_0_#11DFF5] sm:flex-row">
        <div>
          <h2 id="cta-heading" className="text-[22px] sm:text-[28px] font-black uppercase leading-none tracking-[-0.02em]">{pages.homeCta.title}</h2>
          <p className="mt-1 text-[13px] font-medium text-white/80">{pages.homeCta.desc}</p>
        </div>

        <Link href={site.cta.href} className="inline-flex shrink-0 items-center justify-center border-[3px] border-white bg-white px-8 py-3 text-[13px] font-black tracking-[0.16em] uppercase text-[#020F40] hover:bg-[#11DFF5] hover:border-[#11DFF5]">
          {site.cta.label}
        </Link>
      </div>
    </section>
  );
}
