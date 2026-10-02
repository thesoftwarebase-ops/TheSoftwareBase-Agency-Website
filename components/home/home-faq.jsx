'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { faq as libFaq, pages as libPages, site as libSite } from '@/lib/site';
import { HelpCircle, MessageCircle, ArrowRight, Zap, Shield } from 'lucide-react';

export function HomeFAQ({ items, copy, brand }) {
  const [open, setOpen] = useState(0);
  const faq = Array.isArray(items) && items.length ? items : libFaq;
  const pages = copy || libPages;
  const site = brand || libSite;
  const total = faq.length;

  return (
    <section id="faq" aria-labelledby="faq-heading" className="relative w-full overflow-clip bg-[var(--bg-base)] py-12 sm:py-16 lg:py-20">
      {/* bg — full bleed */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#020F40_1px,transparent_1px),linear-gradient(to_bottom,#020F40_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.03] dark:opacity-[0.06]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_400px_at_50%_0%,rgba(13,101,239,0.06),transparent_70%)] dark:bg-[radial-gradient(800px_400px_at_50%_0%,rgba(17,223,245,0.08),transparent_70%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[92%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#0D65EF]/15 to-transparent dark:via-[#11DFF5]/15" />

      {/* watermark */}
      <div aria-hidden className="pointer-events-none absolute left-0 right-0 top-[56px] hidden select-none overflow-hidden lg:block">
        <div className="mx-auto max-w-[1440px] px-8">
          <div className="text-[110px] font-black leading-none tracking-[-0.05em] text-[#020F40]/[0.035] dark:text-white/[0.035] xl:text-[128px]">
            FAQ
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[400px_1fr] lg:gap-10 xl:grid-cols-[420px_1fr] xl:gap-12">
          {/* LEFT — sticky header */}
          <div className="self-start lg:sticky lg:top-[104px]">
            <div className="relative overflow-hidden border-[4px] border-[#020F40] bg-[#020F40] p-6 text-white shadow-[8px_8px_0_0_#11DFF5] dark:border-[#11DFF5] sm:p-7 lg:p-8">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(17,223,245,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,223,245,0.06)_1px,transparent_1px)] bg-[size:28px_28px] opacity-40" />
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#11DFF5]/10 blur-2xl" />

              <div className="relative">
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center gap-2 border-[3px] border-[#11DFF5] bg-[#11DFF5] px-3 py-1 text-[11px] font-black tracking-[0.16em] uppercase text-[#020F40]"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  {pages.homeFaq.kicker}
                  <span className="hidden h-px w-4 bg-[#020F40]/20 sm:block" />
                  <span className="hidden text-[10px] font-bold tracking-[0.12em] text-[#020F40]/60 sm:inline-flex">
                    0{total} {pages.homeFaq.countLabel}
                  </span>
                </motion.div>

                <h2 id="faq-heading" className="mt-4 text-[32px] font-black leading-[0.9] tracking-[-0.04em] sm:text-[36px] lg:text-[42px]">
                  <span className="block text-white">{pages.homeFaq.title}</span>
                  <span className="block text-[#11DFF5]">{pages.homeFaq.desc.split(' —')[0] || ''}</span>
                </h2>

                <p className="mt-3 max-w-[360px] text-[13px] font-medium leading-relaxed text-white/70">
                  {pages.homeFaq.desc}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={pages.homeFaq.cta.href}
                    className="inline-flex items-center justify-center gap-2 border-[3px] border-white bg-white px-5 py-2.5 text-[11px] font-black tracking-[0.16em] uppercase text-[#020F40] shadow-[3px_3px_0_0_#11DFF5] transition hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_#11DFF5]"
                  >
                    {pages.homeFaq.cta.label}
                    <MessageCircle className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href={site.cta.href}
                    className="inline-flex items-center justify-center border-[3px] border-white/20 bg-transparent px-5 py-2.5 text-[11px] font-bold tracking-[0.16em] uppercase text-white hover:bg-white hover:text-[#020F40] hover:border-white"
                  >
                    {site.cta.label}
                  </Link>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-2 border-t border-white/10 pt-6">
                  {[
                    { v: String(total), k: pages.homeFaq.countLabel },
                    ...pages.homeFaq.stats,
                  ].map((s) => (
                    <div key={s.k} className="text-center">
                      <div className="text-[18px] font-black leading-none text-[#11DFF5]">{s.v}</div>
                      <div className="mt-1 text-[9px] font-black tracking-[0.14em] uppercase text-white/50">{s.k}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 h-1 w-full bg-white/10">
                <div className="h-full w-[68%] bg-[#11DFF5] shadow-[0_0_8px_#11DFF5]" />
              </div>
            </div>

            <div className="mt-3 hidden items-center justify-between border-[3px] border-[#020F40] bg-white px-3 py-2 shadow-[3px_3px_0_0_#020F40] dark:border-[#11DFF5] dark:bg-[#0B1220] dark:shadow-[3px_3px_0_0_#11DFF5] lg:flex">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.14em] uppercase text-[var(--text-secondary)]">
                <Shield className="h-3 w-3 text-[#0D65EF] dark:text-[#11DFF5]" />
                {site.ui.systemOperational}
              </span>
              <span className="text-[10px] font-bold tracking-[0.08em] text-[#0D65EF] dark:text-[#11DFF5]">
                {site.email}
              </span>
            </div>
          </div>

          {/* RIGHT — brutal FAQ deck, full width */}
          <div className="flex flex-col gap-4">
            {faq.map((f, i) => {
              const isOpen = open === i;
              const num = String(i + 1).padStart(2, '0');
              return (
                <motion.div
                  key={f.q}
                  initial={{ y: 16, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className={`group relative overflow-hidden border-[4px] bg-[var(--bg-surface)] p-0 shadow-[6px_6px_0_0_#020F40] transition-all dark:shadow-[6px_6px_0_0_#11DFF5] ${
                    isOpen
                      ? 'border-[#020F40] dark:border-[#11DFF5] shadow-[8px_8px_0_0_#020F40] dark:shadow-[8px_8px_0_0_#11DFF5]'
                      : 'border-[#020F40] dark:border-[#11DFF5]/70 hover:shadow-[8px_8px_0_0_#020F40] dark:hover:border-[#11DFF5]'
                  }`}
                >
                  {/* ghost number */}
                  <div className="pointer-events-none absolute -right-2 top-1 hidden select-none text-[64px] font-black leading-none tracking-[-0.05em] text-[#020F40]/[0.06] dark:text-white/[0.06] sm:block">
                    {num}
                  </div>
                  <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#020F40_1px,transparent_1px),linear-gradient(to_bottom,#020F40_1px,transparent_1px)] bg-[size:22px_22px] dark:opacity-[0.06]" />

                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="relative flex w-full items-center gap-4 p-5 text-left sm:p-6"
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center border-[3px] text-[11px] font-black shadow-[3px_3px_0_0_#020F40] transition-all dark:shadow-[3px_3px_0_0_#11DFF5] ${
                        isOpen
                          ? 'border-[#020F40] bg-[#020F40] text-[#11DFF5] dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]'
                          : 'border-[#020F40] bg-white text-[#020F40] group-hover:bg-[#020F40] group-hover:text-white dark:border-[#11DFF5] dark:bg-transparent dark:text-white dark:group-hover:bg-[#11DFF5] dark:group-hover:text-[#020F40]'
                      }`}
                    >
                      {num}
                    </span>

                    <span className="min-w-0 flex-1 pr-2 text-[14px] font-black uppercase tracking-[-0.01em] leading-tight text-[var(--text-primary)] sm:text-[15px]">
                      {f.q}
                    </span>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center border-[3px] text-[16px] font-black leading-none transition-all ${
                        isOpen
                          ? 'border-[#020F40] bg-[#020F40] text-white dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40] rotate-0'
                          : 'border-[#020F40] bg-white text-[#020F40] dark:border-[#11DFF5] dark:bg-transparent dark:text-white'
                      }`}
                    >
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="leading-none"
                      >
                        +
                      </motion.span>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="border-t-[4px] border-[#020F40]/10 bg-[var(--bg-elevated)]/40 px-5 pb-5 pt-4 dark:border-white/10 dark:bg-white/[0.03] sm:px-6 sm:pb-6 sm:pt-4">
                          <div className="flex gap-3">
                            <span className="mt-1 hidden h-6 w-1 shrink-0 bg-[#11DFF5] shadow-[0_0_8px_#11DFF5] sm:block" />
                            <p className="max-w-[640px] text-[13px] font-medium leading-relaxed text-[var(--text-secondary)] sm:text-[14px]">
                              {f.a}
                            </p>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#020F40]/10 pt-4 dark:border-white/10">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.08em] uppercase text-[var(--text-secondary)]">
                              <Zap className="h-3 w-3 text-[#0D65EF] dark:text-[#11DFF5]" />
                              {pages.homeFaq.answerLabel}
                            </span>
                            <span className="ml-auto hidden h-px flex-1 bg-[#020F40]/10 dark:bg-white/10 sm:block" />
                            <Link
                              href={site.cta.href}
                              className="inline-flex items-center gap-1 text-[11px] font-black tracking-[0.12em] uppercase text-[#0D65EF] hover:text-[#020F40] dark:text-[#11DFF5] dark:hover:text-white"
                            >
                              {site.cta.label} <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* bottom brutal accent */}
                  <div className={`pointer-events-none absolute bottom-0 left-0 h-[3px] bg-[#11DFF5] transition-all duration-500 dark:bg-white ${isOpen ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-3 border-[3px] border-[#020F40]/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/[0.04] sm:px-5"
            >
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-[0.12em] uppercase text-[var(--text-secondary)]">
                <MessageCircle className="h-3.5 w-3.5 text-[#0D65EF] dark:text-[#11DFF5]" />
                {total} {pages.homeFaq.countLabel} • {pages.homeFaq.desc}
              </span>
              <Link
                href={pages.homeFaq.cta.href}
                className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-black tracking-[0.12em] uppercase text-[#0D65EF] hover:text-[#020F40] dark:text-[#11DFF5] dark:hover:text-white"
              >
                {pages.homeFaq.cta.label} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
