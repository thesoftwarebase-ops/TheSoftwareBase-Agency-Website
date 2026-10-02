'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { services, pages as libPages } from '@/lib/site';

export function HomeServices({ items, copy }) {
  const pages = copy || libPages;
  const list = Array.isArray(items) && items.length ? items : services;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.3'],
  });

  const leftY = useTransform(scrollYProgress, [0, 1], [0, -12]);

  return (
    <section
      ref={ref}
      id="services"
      aria-labelledby="services-heading"
      className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16"
    >
      <div className="grid gap-8 lg:grid-cols-[420px_1fr] lg:gap-10">
        {/* LEFT — sticky brutal with progress */}
        <motion.div
          style={{ y: leftY }}
          className="self-start lg:sticky lg:top-[132px]"
        >
          <div className="relative overflow-hidden border-[4px] border-[#020F40] bg-[#020F40] p-6 sm:p-8 text-white shadow-[10px_10px_0_0_#11DFF5] dark:border-[#11DFF5] lg:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(17,223,245,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,223,245,0.06)_1px,transparent_1px)] bg-[size:28px_28px] opacity-40" />

            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#11DFF5]/10 blur-2xl" />

            <div className="relative">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex origin-left border-[3px] border-[#11DFF5] bg-[#11DFF5] px-3 py-1 text-[11px] font-black tracking-[0.18em] uppercase text-[#020F40]"
              >
                {pages.services.kicker}
              </motion.div>

              <h2 id="services-heading" className="mt-4 text-[32px] font-black leading-[0.9] tracking-[-0.03em] sm:text-[36px] lg:text-[40px]">
                <span className="block">{pages.services.homeTitle[0]}</span>
                <span className="block text-[#11DFF5]">{pages.services.homeTitle[1]}</span>
              </h2>

              <p className="mt-3 max-w-[360px] text-[13px] font-medium leading-relaxed text-white/70">
                {pages.services.desc}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={pages.services.primaryCta.href}
                  className="inline-flex items-center justify-center border-[3px] border-white bg-white px-5 py-2.5 text-[11px] font-black tracking-[0.16em] uppercase text-[#020F40] shadow-[3px_3px_0_0_#11DFF5] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_#11DFF5]"
                >
                  {pages.services.primaryCta.label}
                </Link>

                <Link
                  href={pages.services.secondaryCta.href}
                  className="inline-flex items-center justify-center border-[3px] border-white/20 bg-transparent px-5 py-2.5 text-[11px] font-bold tracking-[0.16em] uppercase text-white hover:bg-white hover:text-[#020F40] hover:border-white"
                >
                  {pages.services.secondaryCta.label}
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-2 border-t border-white/10 pt-6">
                {pages.services.homeStats.map((s) => (
                  <div key={s.k} className="text-center">
                    <div className="text-[18px] font-black leading-none text-[#11DFF5]">{s.v}</div>
                    <div className="mt-1 text-[9px] font-black tracking-[0.14em] uppercase text-white/50">{s.k}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* progress rail — extreme */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-white/10">
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="h-full origin-left bg-[#11DFF5] shadow-[0_0_8px_#11DFF5]"
              />
            </div>
          </div>


        </motion.div>

        {/* RIGHT — stacked brutal cards — featured only; /services shows the full list */}
        <div className="flex flex-col gap-6">
          {list
            .filter((s) => s.selected)
            .map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ y: 24, opacity: 0, rotateX: 4 }}
              whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, rotateX: 1, rotateY: -1 }}
              className="group relative flex flex-col overflow-hidden border-[4px] border-[#020F40] bg-[var(--bg-surface)] shadow-[8px_8px_0_0_#020F40] transition-all hover:shadow-[12px_12px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[8px_8px_0_0_#11DFF5] dark:hover:shadow-[12px_12px_0_0_#11DFF5]"
              style={{ transformPerspective: 1000 }}
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden border-b-[4px] border-[#020F40] bg-[#020F40] dark:border-[#11DFF5]">
                <Image
                  src={s.image}
                  alt={`${s.title} — ${s.desc}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={`object-cover ${s.imagePos} grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.02]`}
                />

                <div className="pointer-events-none absolute inset-0 bg-[#0D65EF]/20 mix-blend-color group-hover:bg-transparent transition-colors" />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020F40]/60 via-transparent to-transparent opacity-60" />
              </div>

              <div className="p-6 sm:p-7 lg:p-8">
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(600px_200px_at_0%_0%,rgba(17,223,245,0.08),transparent_70%)]" />

              <div className="absolute -left-3 -top-3 flex h-10 w-10 items-center justify-center border-[3px] border-[#020F40] bg-[#020F40] text-[11px] font-black tracking-[0.12em] text-[#11DFF5] shadow-[3px_3px_0_0_#11DFF5] transition-transform group-hover:rotate-3 dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]">
                0{i + 1}
              </div>

              <div className="pointer-events-none absolute right-4 top-4 hidden select-none text-[56px] font-black leading-none tracking-[-0.04em] text-[#020F40]/[0.04] transition-colors group-hover:text-[#11DFF5]/[0.08] dark:text-white/[0.04] sm:block lg:text-[64px]">
                0{i + 1}
              </div>

              <div className="relative">
                <div className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.18em] uppercase text-[#0D65EF] dark:text-[#11DFF5]">
                  <span className="h-1 w-6 bg-[#11DFF5] shadow-[0_0_6px_#11DFF5]" />
                  {s.kicker}
                </div>

                <h3 className="mt-3 max-w-[520px] text-[20px] font-black uppercase tracking-[-0.02em] leading-none text-[var(--text-primary)] transition-colors group-hover:text-[#0D65EF] dark:group-hover:text-[#11DFF5] sm:text-[22px]">
                  {s.title}
                </h3>

                <p className="mt-3 max-w-[520px] text-[14px] font-medium leading-relaxed text-[var(--text-secondary)]">
                  {s.desc}
                </p>

                <ul className="mt-6 grid gap-2 border-t-[3px] border-[#020F40]/10 pt-5 dark:border-[#11DFF5]/20 sm:grid-cols-3">
                  {s.bullets.map((b, bi) => (
                    <motion.li
                      key={b}
                      initial={{ opacity: 0, x: -6 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.08 + bi * 0.04 }}
                      className="flex items-center gap-2 border-[2px] border-[#020F40]/5 bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-[11px] font-bold tracking-[0.08em] uppercase text-[var(--text-primary)] backdrop-blur-sm transition-colors group-hover:border-[#020F40]/20 group-hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-white/80 dark:group-hover:bg-white/[0.08]"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 bg-[#11DFF5] shadow-[0_0_6px_#11DFF5] transition-transform group-hover:scale-125" />
                      {b}
                    </motion.li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className="mt-5 inline-flex items-center gap-2 self-start border-[3px] border-[#020F40] bg-white px-4 py-2 text-[11px] font-black tracking-[0.12em] uppercase text-[#020F40] shadow-[3px_3px_0_0_#020F40] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_#020F40] hover:bg-[#020F40] hover:text-white dark:border-[#11DFF5] dark:bg-[#0B1220] dark:text-white dark:shadow-[3px_3px_0_0_#11DFF5] dark:hover:bg-[#11DFF5] dark:hover:text-[#020F40]"
                >
                  {pages.services.cardCta}
                  <span aria-hidden>→</span>
                </Link>
              </div>
              </div>

              <motion.div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[4px] bg-[#11DFF5]"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                style={{ originX: 0 }}
              />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 self-start border-[3px] border-[#020F40] bg-white px-6 py-3 text-[12px] font-black tracking-[0.16em] uppercase text-[#020F40] shadow-[4px_4px_0_0_#020F40] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_0_#020F40] hover:bg-[#020F40] hover:text-white dark:border-[#11DFF5] dark:bg-[#0B1220] dark:text-white dark:shadow-[4px_4px_0_0_#11DFF5] dark:hover:bg-[#11DFF5] dark:hover:text-[#020F40]"
            >
              {pages.services.exploreCta}
              <span aria-hidden>→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
