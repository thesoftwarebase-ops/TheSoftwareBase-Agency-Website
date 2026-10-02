'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { whyUs as libWhyUs, pages as libPages, site as libSite, footer as libFooter } from '@/lib/site';
import { Check, X, ArrowRight, Shield, Layers, Zap } from 'lucide-react';

export function HomeWhyUs({ items, copy, brand, foot }) {
  const whyUs = items && typeof items === 'object' && !Array.isArray(items) ? items : libWhyUs;
  const pages = copy || libPages;
  const site = brand || libSite;
  const footer = foot || libFooter;
  return (
    <section id="why-us" aria-labelledby="why-us-heading" className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
      {/* header — lib-driven */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#020F40_1px,transparent_1px),linear-gradient(to_bottom,#020F40_1px,transparent_1px)] bg-[size:28px_28px] opacity-[0.04] dark:opacity-[0.07]" />
        <div className="pointer-events-none absolute -right-8 -top-8 hidden select-none text-[96px] font-black leading-none tracking-[-0.05em] text-[#020F40]/[0.04] dark:text-white/[0.04] lg:block">
          {pages.whyUs.kicker.replace('?', '').toUpperCase()}
        </div>

        <div className="relative">
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-[#020F40] px-3 py-1 text-[11px] font-black tracking-[0.16em] uppercase text-[#11DFF5] dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]"
          >
            <span className="h-2 w-2 animate-pulse bg-[#11DFF5] dark:bg-[#020F40]" />
            {pages.whyUs.kicker}
            <span className="hidden h-px w-5 bg-white/20 sm:block dark:bg-[#020F40]/20" />
            <span className="hidden items-center gap-1 text-[10px] font-bold tracking-[0.12em] text-white/60 dark:text-[#020F40]/60 sm:inline-flex">
              <Shield className="h-3 w-3" />
              {String(whyUs.reasons.length).padStart(2, '0')} {pages.whyUs.reasonsSuffix}
            </span>
          </motion.div>

          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            id="why-us-heading" className="mt-4 text-[30px] font-black leading-[0.9] tracking-[-0.04em] sm:text-[36px] lg:text-[42px]"
          >
            <span className="block text-[var(--text-primary)]">{pages.whyUs.title[0]}</span>
            <span className="block text-[#0D65EF] dark:text-[#11DFF5]">{pages.whyUs.title[1]}</span>
          </motion.h2>

          <p className="mt-3 max-w-[640px] text-[13px] font-medium leading-relaxed text-[var(--text-secondary)] sm:text-[14px]">
            {pages.whyUs.desc}
          </p>
        </div>
      </div>

      {/* INNOVATIVE FACTORY TABLE — reasons fused with compare, no separate cards */}
      <div className="mt-8 overflow-hidden border-[4px] border-[#020F40] bg-[var(--bg-surface)] shadow-[8px_8px_0_0_#020F40] dark:border-[#11DFF5] dark:bg-[#020F40] dark:shadow-[8px_8px_0_0_#11DFF5]">
        {/* brutal header — 3 cols: REASON | THEM | US */}
        <div className="hidden grid-cols-[1.35fr_0.9fr_1.1fr] items-center gap-0 border-b-[4px] border-[#020F40] bg-[#020F40] px-4 py-3 text-[11px] font-black tracking-[0.16em] uppercase sm:grid lg:px-5 dark:border-[#11DFF5] dark:bg-[#0B1220]">
          <span className="inline-flex items-center gap-2 text-white">
            <span className="flex h-6 w-6 items-center justify-center border border-white/20 bg-white/10 text-white">
              <Layers className="h-3.5 w-3.5" />
            </span>
            Reason — solid split
          </span>
          <span className="inline-flex items-center justify-center gap-2 text-white/60">
            <X className="h-3.5 w-3.5" /> Them
          </span>
          <span className="inline-flex items-center justify-end gap-2 text-[#11DFF5]">
            Us <Check className="h-3.5 w-3.5" />
          </span>
        </div>

        {/* mobile header */}
        <div className="flex items-center justify-between border-b-[4px] border-[#020F40] bg-[#020F40] px-4 py-3 text-[11px] font-black tracking-[0.16em] uppercase text-white dark:border-[#11DFF5] dark:bg-[#0B1220] sm:hidden">
          <span className="inline-flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-[#11DFF5]" />
            Solid reasons
          </span>
          <span className="text-[#11DFF5]">{String(whyUs.reasons.length).padStart(2, '0')} splits</span>
        </div>

        {/* rows — each reason IS the comparison */}
        <div className="divide-y-[4px] divide-[#020F40] dark:divide-[#11DFF5]/40">
          {whyUs.reasons.map((r, i) => {
            const them = whyUs.compare.them[i] || whyUs.compare.them[whyUs.compare.them.length - 1];
            const us = whyUs.compare.us[i] || whyUs.compare.us[whyUs.compare.us.length - 1];
            return (
              <motion.div
                key={r.n}
                initial={{ y: 12, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="group relative grid gap-0 bg-white dark:bg-[#0B1220] sm:grid-cols-[1.35fr_0.9fr_1.1fr]"
              >
                {/* ghost number */}
                <div className="pointer-events-none absolute -right-2 top-1 hidden select-none text-[64px] font-black leading-none tracking-[-0.05em] text-[#020F40]/[0.05] dark:text-white/[0.06] sm:block lg:text-[72px]">
                  {r.n}
                </div>

                {/* REASON — solid */}
                <div className="relative border-b-[4px] border-[#020F40]/10 bg-white p-5 dark:border-white/10 dark:bg-[#0B1220] sm:border-b-0 sm:border-r-[4px] sm:p-6">
                  <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#020F40_1px,transparent_1px),linear-gradient(to_bottom,#020F40_1px,transparent_1px)] bg-[size:20px_20px] dark:opacity-[0.06]" />
                  <div className="relative">
                    <div className="inline-flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center border-[3px] border-[#020F40] bg-[#020F40] text-[11px] font-black text-[#11DFF5] shadow-[2px_2px_0_0_#11DFF5] dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]">
                        {r.n}
                      </span>
                      <span className="hidden h-px w-6 bg-[#020F40]/10 dark:bg-white/10 sm:block" />
                      <span className="inline-flex items-center gap-1 text-[10px] font-black tracking-[0.14em] uppercase text-[#0D65EF] dark:text-[#11DFF5]">
                        <Zap className="h-3 w-3" />
                        Split {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="mt-3 text-[15px] font-black uppercase tracking-[-0.02em] leading-none text-[#020F40] dark:text-white sm:text-[16px]">
                      {r.title}
                    </h3>
                    <p className="mt-2 text-[12.5px] font-medium leading-relaxed text-[#2E729F] dark:text-[#C6EAF4]/80">
                      {r.desc}
                    </p>
                  </div>
                  {/* hover accent */}
                  <div className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-0 bg-[#0D65EF] transition-all duration-500 group-hover:w-full dark:bg-[#11DFF5]" />
                </div>

                {/* THEM — muted */}
                <div className="relative flex flex-col justify-center gap-2 border-b-[4px] border-[#020F40]/10 bg-[#F0F4F8] p-4 dark:border-white/10 dark:bg-white/[0.04] sm:border-b-0 sm:border-r-[4px] sm:p-5">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.14em] uppercase text-[#2E729F]/60 dark:text-white/40">
                    <X className="h-3 w-3" /> Them
                  </span>
                  <span className="flex items-start gap-2.5 text-[13px] font-medium leading-snug text-[#2E729F] dark:text-white/60">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center border-[2px] border-[#020F40]/10 bg-white text-[#020F40]/30 dark:border-white/10 dark:bg-white/5 dark:text-white/30">
                      <X className="h-3 w-3" />
                    </span>
                    <span className="min-w-0">{them}</span>
                  </span>
                </div>

                {/* US — brutal */}
                <div className="relative flex flex-col justify-center gap-2 bg-[#020F40] p-4 text-white dark:bg-[#11DFF5] dark:text-[#020F40] sm:p-5">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.14em] uppercase text-white/60 dark:text-[#020F40]/60">
                    <Check className="h-3 w-3" /> Us
                  </span>
                  <span className="flex items-start gap-2.5 text-[13px] font-bold leading-snug">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-[2px] border-[#11DFF5] bg-[#11DFF5] text-[#020F40] shadow-[1px_1px_0_0_white] dark:border-[#020F40] dark:bg-[#020F40] dark:text-[#11DFF5]">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="min-w-0">{us}</span>
                  </span>
                  {/* innovation: micro-proof */}
                  <span className="mt-1 hidden items-center gap-1.5 text-[10px] font-black tracking-[0.12em] uppercase text-white/50 dark:text-[#020F40]/50 sm:inline-flex">
                    <span className="h-1 w-6 bg-[#11DFF5] dark:bg-[#020F40]" />
                    Proven at scale
                  </span>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* footer — stats as brutal inline, not cards */}
        <div className="grid grid-cols-2 divide-x-[3px] divide-[#020F40]/10 border-t-[4px] border-[#020F40] bg-white dark:divide-white/10 dark:border-[#11DFF5] dark:bg-[#0B1220] sm:grid-cols-4">
          {whyUs.stats.map((s) => (
            <div key={s.k} className="p-4 text-center sm:p-5">
              <div className="text-[20px] font-black leading-none tracking-[-0.03em] text-[#0D65EF] dark:text-[#11DFF5] sm:text-[22px]">
                {s.v}
              </div>
              <div className="mt-1 text-[10px] font-black tracking-[0.14em] uppercase text-[var(--text-secondary)] dark:text-white/60">
                {s.k}
              </div>
            </div>
          ))}
        </div>

        {/* bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t-[4px] border-[#020F40] bg-[#020F40] px-4 py-3 dark:border-[#11DFF5] sm:px-5">
          <span className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.12em] uppercase text-white/70">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#11DFF5]" />
            {site.year} • {site.shortName} • {footer.manifesto.badge}
          </span>
          <Link
            href="/why-us"
            className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-[0.14em] uppercase text-[#11DFF5] hover:text-white"
          >
            {pages.whyUs.homeCta} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* CTA — no extra cards */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={site.cta.href}
          className="inline-flex items-center justify-center gap-2 border-[4px] border-[#020F40] bg-[#020F40] px-6 py-3 text-[12px] font-black tracking-[0.16em] uppercase text-white shadow-[4px_4px_0_0_#11DFF5] transition hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0_0_#11DFF5] dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]"
        >
          {site.cta.label} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/why-us"
          className="inline-flex items-center justify-center border-[3px] border-[#020F40] bg-white px-6 py-3 text-[12px] font-black tracking-[0.16em] uppercase text-[#020F40] shadow-[4px_4px_0_0_#020F40] hover:bg-[#020F40] hover:text-white dark:border-[#11DFF5] dark:bg-transparent dark:text-white dark:shadow-[4px_4px_0_0_#11DFF5] dark:hover:bg-[#11DFF5] dark:hover:text-[#020F40]"
        >
          {pages.whyUs.homeCta}
        </Link>
      </div>
    </section>
  );
}
