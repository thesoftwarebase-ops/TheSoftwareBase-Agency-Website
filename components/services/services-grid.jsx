'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { services, pages as libPages } from '@/lib/site';
import { Wrench, Layers, Rocket, Palette, TrendingUp, Headphones, ArrowRight, ArrowUpRight, Search, Zap, Grid3X3 } from 'lucide-react';

const ICONS = {
  'Product Engineering': Wrench,
  'Platform & Infra': Layers,
  'AI Systems': Rocket,
  'Design Systems': Palette,
  'Growth Engineering': TrendingUp,
  'Support & Ops': Headphones,
};

export function ServicesGrid({ items, copy }) {
  const pages = copy || libPages;
  const list = Array.isArray(items) && items.length ? items : services;
  const [filter, setFilter] = useState('all');
  const filtered = useMemo(() => {
    if (filter === 'featured') return list.filter((s) => s.selected);
    return list;
  }, [filter, list]);
  const featuredCount = list.filter((s) => s.selected).length;

  return (
    <div className="mt-8">
      {/* filter */}
      <div className="flex flex-wrap items-center gap-3 border-b-[3px] border-[#020F40]/10 pb-4 dark:border-white/10">
        {[
          { id: 'all', label: `All ${list.length}` },
          { id: 'featured', label: `Featured ${featuredCount}` },
        ].map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              suppressHydrationWarning
              onClick={() => setFilter(f.id)}
              aria-pressed={active}
              className={`inline-flex items-center gap-2 border-[3px] px-5 py-2.5 text-[11px] font-black tracking-[0.14em] uppercase transition-all ${
                active
                  ? 'border-[#020F40] bg-[#020F40] text-white shadow-[3px_3px_0_0_#11DFF5] dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]'
                  : 'border-[#020F40]/20 bg-white text-[#020F40] hover:border-[#020F40] hover:bg-[#020F40] hover:text-white dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:bg-white dark:hover:text-[#020F40]'
              }`}
            >
              <Grid3X3 className="h-3 w-3" />
              {f.label}
            </button>
          );
        })}
        <span className="ml-auto hidden items-center gap-1.5 text-[11px] font-black tracking-[0.12em] uppercase text-[var(--text-secondary)]/60 sm:inline-flex">
          <span className="h-1.5 w-1.5 animate-pulse bg-[#0D65EF] dark:bg-[#11DFF5]" />
          {filtered.length} of {list.length} services
        </span>
      </div>

      {/* SERVICE CARDS — uniform bento, full copy, whole-card link */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((s, i) => {
            const Icon = ICONS[s.title] || Search;
            const featured = i === 0 && filtered.length > 1;
            return (
              <motion.article
                key={`${s.title}-${i}`}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.25), ease: [0.16, 1, 0.3, 1] }}
                className={`group relative flex flex-col overflow-hidden border-[4px] border-[#020F40] bg-[var(--bg-surface)] shadow-[6px_6px_0_0_#020F40] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#0D65EF] dark:border-[#11DFF5] dark:shadow-[6px_6px_0_0_#11DFF5] dark:hover:shadow-[10px_10px_0_0_#11DFF5] ${
                  featured ? 'sm:col-span-2 lg:col-span-3 lg:grid lg:grid-cols-2' : ''
                }`}
              >
                {/* image */}
                <div className={`relative w-full shrink-0 overflow-hidden bg-[#020F40] dark:bg-[#05070C] ${featured ? 'aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[320px] lg:border-r-[4px]' : 'aspect-[16/10] border-b-[4px]'} border-[#020F40] dark:border-[#11DFF5]`}>
                  <Image
                    src={s.image}
                    alt={`${s.title} — ${s.desc.slice(0, 70)}`}
                    fill
                    sizes={featured ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
                    priority={i === 0}
                    className={`object-cover ${s.imagePos} transition-transform duration-700 group-hover:scale-[1.04]`}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020F40]/60 via-transparent to-transparent" />
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 bg-[#020F40]/85 px-2.5 py-1 text-[10px] font-black tracking-[0.12em] uppercase text-white backdrop-blur-sm dark:bg-[#11DFF5]/95 dark:text-[#020F40]">
                    <Icon className="h-3 w-3" />
                    {s.kicker}
                  </div>
                  <div className="absolute bottom-3 left-3 font-mono text-[11px] font-black tracking-[0.2em] text-white/70">
                    {String(i + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}
                  </div>
                </div>

                {/* body */}
                <div className={`relative flex flex-1 flex-col p-6 ${featured ? 'lg:justify-center lg:p-8' : ''}`}>
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center border-[2px] border-[#020F40] bg-[#020F40] text-[#11DFF5] dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className={`${featured ? 'text-[22px] sm:text-[24px]' : 'text-[18px] sm:text-[19px]'} font-black uppercase leading-none tracking-[-0.02em] text-[var(--text-primary)]`}>
                      {s.title}
                    </h3>
                  </div>

                  <p className="mt-3 text-[13px] font-medium leading-relaxed text-[var(--text-secondary)] sm:text-[14px]">
                    {s.desc}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {(s.bullets || []).map((b) => (
                      <li
                        key={b}
                        className="inline-flex items-center gap-1.5 border-[2px] border-[#020F40]/15 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-[var(--text-primary)] dark:border-white/15 dark:text-white/80"
                      >
                        <span className="h-1 w-1 shrink-0 bg-[#0D65EF] dark:bg-[#11DFF5]" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-5">
                    <Link
                      href="/contact"
                      aria-label={`${pages.services.cardCta} — ${s.title}`}
                      className="inline-flex items-center gap-2 text-[12px] font-black tracking-[0.14em] uppercase text-[#0D65EF] transition-colors hover:text-[#020F40] dark:text-[#11DFF5] dark:hover:text-white before:absolute before:inset-0 before:content-['']"
                    >
                      {pages.services.cardCta}
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                  <span className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-0 bg-[#0D65EF] transition-all duration-500 group-hover:w-full dark:bg-[#11DFF5]" />
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="mt-8 border-[3px] border-dashed border-[#020F40]/20 p-8 text-center text-[13px] font-medium text-[var(--text-secondary)] dark:border-white/15">
          No services for this filter — add more in the dashboard services editor.
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-2 border-t-[3px] border-[#020F40]/10 pt-4 text-[11px] font-black tracking-[0.12em] uppercase text-[var(--text-secondary)]/60 dark:border-white/10">
        <span className="inline-flex items-center gap-1.5">
          <Zap className="h-3 w-3 text-[#0D65EF] dark:text-[#11DFF5]" />
          {list.length} services, edited from the dashboard
        </span>
        <span className="ml-auto hidden h-px flex-1 bg-[#020F40]/10 dark:bg-white/10 sm:block" />
        <Link href={pages.services.secondaryCta.href} className="inline-flex items-center gap-1 text-[#0D65EF] hover:text-[#020F40] dark:text-[#11DFF5] dark:hover:text-white">
          {pages.services.secondaryCta.label} <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
