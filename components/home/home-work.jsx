import Link from 'next/link';
import Image from 'next/image';
import { workCases, pages as libPages } from '@/lib/site';

export function HomeWork({ items, showClients = true, copy }) {
  const pages = copy || libPages;
  const list = Array.isArray(items) && items.length ? items : workCases;
  const own = list.filter((c) => c.kind === 'own');
  const clients = showClients ? list.filter((c) => c.kind === 'client' && c.selected) : [];

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex border-[3px] border-[#020F40] bg-[#020F40] px-3 py-1 text-[11px] font-black tracking-[0.16em] uppercase text-[#11DFF5] dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]">
            {pages.work.homeKicker}
          </div>

          <h2 id="work-heading" className="mt-3 text-[28px] font-black leading-[0.9] tracking-[-0.03em] sm:text-[32px] lg:text-[36px]">
            <span className="block">{pages.work.homeTitle[0]}</span>
            <span className="block text-[#0D65EF] dark:text-[#11DFF5]">{pages.work.homeTitle[1]}</span>
          </h2>
        </div>

        <Link href="/work/products" className="hidden sm:inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-white px-5 py-2 text-[11px] font-black tracking-[0.14em] uppercase text-[#020F40] shadow-[3px_3px_0_0_#020F40] hover:bg-[#020F40] hover:text-white dark:border-[#11DFF5] dark:bg-[#0B1220] dark:text-white dark:shadow-[3px_3px_0_0_#11DFF5] sm:gap-3">
          {pages.work.viewAllLabel}
          <span aria-hidden>→</span>
        </Link>
      </div>

      {/* OWN — 2 brutal hero cards */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {own.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className="group relative flex flex-col overflow-hidden border-[4px] border-[#020F40] bg-white shadow-[8px_8px_0_0_#020F40] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[6px_6px_0_0_#020F40] dark:border-[#11DFF5] dark:bg-[#0B1220] dark:shadow-[8px_8px_0_0_#11DFF5] dark:hover:shadow-[6px_6px_0_0_#11DFF5]"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden border-b-[4px] border-[#020F40] bg-[#020F40] dark:border-[#11DFF5]">
              <Image
                src={c.image}
                alt={`${c.title} — ${c.desc}`}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-contain grayscale transition-all duration-500 group-hover:grayscale-0"
              />
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="border-[3px] border-[#020F40] bg-[#11DFF5] px-2 py-0.5 text-[10px] font-black tracking-[0.14em] uppercase text-[#020F40] dark:border-[#11DFF5]">
                  {pages.work.ownBadge}
                </span>
                <span className="text-[11px] font-black tracking-[0.16em] uppercase text-[#0D65EF] dark:text-[#11DFF5]">{c.tag}</span>
              </div>
              <h3 className="mt-1 text-[20px] font-black uppercase tracking-[-0.02em] leading-none">{c.title}</h3>
              <p className="mt-2 text-[13px] font-medium leading-relaxed text-[var(--text-secondary)]">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* CLIENTS — horizontal snap brutal, hidden with the section */}
      {clients.length > 0 && (
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-[12px] font-black tracking-[0.16em] uppercase text-[var(--text-secondary)]">
            {pages.work.clientsKicker}
          </h3>

          <span className="hidden text-[11px] font-bold tracking-[0.12em] uppercase text-[var(--text-secondary)]/60 sm:inline">
            {pages.work.scrollHint}
          </span>
        </div>

        <div className="mt-3 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-pl-0 pb-4 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {clients.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group relative flex w-[300px] shrink-0 snap-start flex-col overflow-hidden border-[4px] border-[#020F40] bg-[var(--bg-surface)] shadow-[6px_6px_0_0_#020F40] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[6px_6px_0_0_#11DFF5] sm:w-[360px]"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden border-b-[4px] border-[#020F40] bg-[#020F40] dark:border-[#11DFF5]">
                <Image src={c.image} alt={`${c.title} — ${c.desc}`} fill sizes="(max-width:640px) 100vw, 33vw" className="object-contain opacity-90 grayscale group-hover:grayscale-0 transition-all" />
              </div>

              <div className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="border-[2px] border-[#020F40] bg-white px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#020F40] dark:border-white/25 dark:bg-transparent dark:text-white">
                    {pages.work.clientBadge}
                  </span>
                  <span className="text-[10px] font-black tracking-[0.14em] uppercase text-[#0D65EF] dark:text-[#11DFF5]">{c.tag}</span>
                </div>
                <h4 className="mt-1 text-[16px] font-black uppercase leading-none">{c.title}</h4>
                <p className="mt-2 text-[12px] font-medium leading-relaxed text-[var(--text-secondary)]">{c.desc}</p>
              </div>
            </Link>
          ))}

          <Link
            href="/work/clients"
            className="flex w-[220px] shrink-0 snap-start flex-col items-center justify-center border-[4px] border-dashed border-[#020F40]/20 bg-[var(--bg-elevated)]/50 p-6 text-center dark:border-white/15 dark:bg-white/[0.03] sm:w-[260px]"
          >
            <div className="text-[11px] font-black tracking-[0.16em] uppercase text-[var(--text-secondary)]">{pages.work.moreWorkTitle}</div>
            <div className="mt-2 text-[13px] font-black uppercase text-[#0D65EF] dark:text-[#11DFF5]">{pages.work.moreWorkCta}</div>
          </Link>
        </div>
      </div>
      )}
    </section>
  );
}
