"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { processSteps, pages as libPages } from "@/lib/site";
import {
  Search,
  Wrench,
  Rocket,
  TrendingUp,
  Clock3,
  Zap,
  ArrowRight,
  ArrowUpRight,
  Shield,
  Layers,
} from "lucide-react";

const ICONS = [Search, Wrench, Rocket, TrendingUp];

export function HomeProcess({ steps: stepsProp, copy }) {
  const pages = copy || libPages;
  const steps = Array.isArray(stepsProp) && stepsProp.length ? stepsProp : processSteps;
  const total = steps.length;
  const sectionRef = useRef(null);

  // global progress for rail + header bar
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "end 0.55"],
  });
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="process"
      aria-labelledby="process-heading"
      className="relative w-full overflow-clip py-12 sm:py-16 lg:py-20"
    >
      {/* bg — full bleed */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#020F40_1px,transparent_1px),linear-gradient(to_bottom,#020F40_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.035] dark:opacity-[0.06]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_-8%,rgba(13,101,239,0.08),transparent_70%)] dark:bg-[radial-gradient(900px_520px_at_50%_-8%,rgba(17,223,245,0.10),transparent_70%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[92%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#0D65EF]/20 to-transparent dark:via-[#11DFF5]/20" />

      {/* watermark — from lib */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-[72px] hidden select-none overflow-hidden lg:block"
      >
        <div className="mx-auto max-w-[1440px] px-8">
          <div className="text-[112px] font-black leading-none tracking-[-0.05em] text-[#020F40]/[0.035] dark:text-white/[0.035] xl:text-[128px]">
            {pages.process.kicker.toUpperCase()}
          </div>
        </div>
      </div>

      {/* top progress — full bleed */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px] bg-[#020F40]/10 dark:bg-white/10">
        <motion.div
          style={{ scaleX: barScale }}
          className="h-[3px] w-full origin-left bg-gradient-to-r from-[#0D65EF] via-[#11DFF5] to-[#0D65EF] dark:from-[#11DFF5] dark:via-white dark:to-[#11DFF5]"
        />
      </div>

      {/* ---------- HEADER — constrained ---------- */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="max-w-[640px]">
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 border-[3px] border-[#020F40] bg-[#020F40] px-3 py-1.5 text-[11px] font-black tracking-[0.16em] uppercase text-[#11DFF5] dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]"
            >
              <span className="h-2 w-2 animate-pulse bg-[#11DFF5] dark:bg-[#020F40]" />
              {pages.process.kicker}
              <span className="hidden h-px w-5 bg-white/20 sm:block dark:bg-[#020F40]/20" />
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.14em] text-white/60 dark:text-[#020F40]/60">
                <Layers className="h-3 w-3" />0{total}{" "}
                {pages.process.deckMetaSuffix}
              </span>
            </motion.div>

            <motion.h2
              id="process-heading"
              initial={{ y: 12, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-4 text-[34px] font-black leading-[0.88] tracking-[-0.04em] sm:text-[44px] lg:text-[52px]"
            >
              <span className="block text-[var(--text-primary)]">
                {pages.process.title[0]}
              </span>
              <span className="block text-[#0D65EF] dark:text-[#11DFF5]">
                {pages.process.title[1]}
              </span>
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.65,
                delay: 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-3 h-[3px] w-20 origin-left bg-[#0D65EF] dark:bg-[#11DFF5]"
            />

            <motion.p
              initial={{ y: 8, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-4 max-w-[560px] text-[14px] font-medium leading-relaxed text-[var(--text-secondary)] sm:text-[15px]"
            >
              {pages.process.desc}{" "}
              <span className="inline-flex items-center gap-1.5 font-black text-[#0D65EF] dark:text-[#11DFF5]">
                <Clock3 className="h-3.5 w-3.5" />
                {pages.process.timeline}
              </span>{" "}
              {pages.process.toProd}. {pages.process.headerExtra}
            </motion.p>
          </div>

          {/* header aside — desktop */}
          <div className="hidden shrink-0 lg:block">
            <div className="flex items-end gap-3">
              <div className="hidden flex-col gap-2 xl:flex">
                <div className="inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-white px-3 py-1 text-[10px] font-black tracking-[0.14em] uppercase text-[#020F40] dark:border-[#11DFF5] dark:bg-[#0B1220] dark:text-white">
                  <Shield className="h-3 w-3 text-[#0D65EF] dark:text-[#11DFF5]" />
                  {pages.process.badges.stacked}
                </div>
                <div className="inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-[#020F40] px-3 py-1 text-[10px] font-black tracking-[0.14em] uppercase text-white dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]">
                  <Zap className="h-3 w-3 text-[#11DFF5] dark:text-[#020F40]" />
                  {pages.process.badges.overlap}
                </div>
              </div>
              <div className="border-[4px] border-[#020F40] bg-[#020F40] px-5 py-3 text-right shadow-[4px_4px_0_0_#0D65EF] dark:border-[#11DFF5] dark:shadow-[4px_4px_0_0_#11DFF5]">
                <div className="text-[10px] font-black tracking-[0.16em] uppercase text-white/60">
                  {pages.process.timelineLabel}
                </div>
                <div className="mt-0.5 text-[20px] font-black leading-none tracking-[-0.03em] text-[#11DFF5]">
                  {pages.process.timeline}
                </div>
                <div className="mt-1 text-[10px] font-bold tracking-[0.12em] uppercase text-white/50">
                  {String(total).padStart(2, "0")} {pages.process.stagesSuffix}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* progress + counter row — sticky feel */}
        <div className="mt-6 flex items-center gap-3 sm:mt-7">
          <div className="h-[3px] flex-1 bg-[#020F40]/10 dark:bg-white/10">
            <motion.div
              style={{ scaleX: barScale }}
              className="h-[3px] w-full origin-left bg-[#0D65EF] dark:bg-[#11DFF5]"
            />
          </div>
          <span className="hidden shrink-0 text-[11px] font-black tracking-[0.14em] uppercase text-[var(--text-secondary)] sm:inline-flex">
            {pages.process.hintBar.scrollHint} • 0{total}
          </span>
        </div>
      </div>

      {/* ---------- STACKED LANDSCAPE DECK — FULL BLEED LEFT+RIGHT ---------- */}
      {/* Hint bar — constrained — tight, no awkward gap */}
      <div className="relative z-10 mx-auto mt-4 flex max-w-[1440px] items-center justify-between px-4 sm:mt-5 sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-white px-3 py-1 text-[11px] font-black tracking-[0.12em] uppercase text-[#020F40] shadow-[3px_3px_0_0_#020F40] dark:border-[#11DFF5] dark:bg-[#0B1220] dark:text-white dark:shadow-[3px_3px_0_0_#11DFF5] lg:hidden">
          <span className="h-1.5 w-1.5 animate-pulse bg-[#0D65EF] dark:bg-[#11DFF5]" />
          {pages.process.hintBar.mobile}
        </span>
        <span className="ml-auto hidden text-[11px] font-bold tracking-[0.12em] uppercase text-[var(--text-secondary)]/70 sm:inline-flex lg:hidden">
          {pages.process.hintBar.desktop}
        </span>
      </div>

      <div className="relative z-10 mt-2 w-full sm:mt-3">
        {/*
           Stack container — each card is sticky, so next card overlaps previous.
           Works for any length: add items in lib/site.js or fetch from DB → UI just maps.
           Image is required per card but falls back to /home-hero.png if missing (DB-safe).
           FULL WIDTH + FULL HEIGHT — edge-to-edge viewport
         */}
        <div className="flex flex-col">
          {steps.map((s, i) => {
            const Icon = ICONS[i % ICONS.length] || Zap;
            const isEven = i % 2 === 0;
            const imgSrc = s.image || "/home-hero.png";
            const imgPos = s.imagePos || "object-center";
            // brutal accent cycling for infinite scalability
            const accent =
              i % 4 === 0
                ? "from-[#0D65EF] to-[#11DFF5]"
                : i % 4 === 1
                  ? "from-[#11DFF5] to-[#0D65EF]"
                  : i % 4 === 2
                    ? "from-[#020F40] to-[#0D65EF] dark:from-[#11DFF5] dark:to-white"
                    : "from-[#093375] to-[#11DFF5]";
            const num = s.n || String(i + 1).padStart(2, "0");

            return (
              <div
                key={`${num}-${s.title}-${i}`}
                style={{ zIndex: i + 1 }}
                className="sticky top-0 flex h-[100dvh] w-screen items-center justify-center will-change-transform"
              >
                <motion.div
                  initial={{ y: 28, opacity: 0, rotateX: 2 }}
                  whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.65,
                    delay: Math.min(i * 0.05, 0.2),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`group relative flex h-[100dvh] w-screen flex-col overflow-hidden border-[4px] border-[#020F40] bg-[var(--bg-surface)] shadow-none dark:border-[#11DFF5] dark:bg-[#0B1220] lg:shadow-none ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* ghost number */}
                  <div className="pointer-events-none absolute -right-3 top-1 hidden select-none text-[104px] font-black leading-none tracking-[-0.06em] text-[#020F40]/[0.04] dark:text-white/[0.04] sm:block lg:text-[118px] xl:text-[126px]">
                    {num}
                  </div>

                  {/* grid + sheen */}
                  <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#020F40_1px,transparent_1px),linear-gradient(to_bottom,#020F40_1px,transparent_1px)] bg-[size:22px_22px] dark:opacity-[0.07]" />
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(560px_220px_at_0%_0%,rgba(17,223,245,0.08),transparent_70%)]" />

                  {/* IMAGE — landscape pane */}
                  <div
                    className={`relative flex w-full shrink-0 flex-col overflow-hidden bg-[#020F40] dark:bg-[#05070C] lg:h-full lg:min-h-0 lg:w-[46%] xl:w-[44%] ${
                      isEven
                        ? "border-b-[4px] lg:border-b-0 lg:border-r-[4px]"
                        : "border-b-[4px] lg:border-b-0 lg:border-l-[4px]"
                    } border-[#020F40] dark:border-[#11DFF5]`}
                  >
                    {/* image — fills full-screen card height on desktop */}
                    <div className="relative aspect-[16/10] w-full flex-1 overflow-hidden sm:aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-0">
                      <Image
                        src={imgSrc}
                        alt={`${s.title} — ${s.desc.slice(0, 60)}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 44vw"
                        className={`object-cover ${imgPos} grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.03]`}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-[#0D65EF]/18 mix-blend-color transition-colors group-hover:bg-transparent" />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020F40]/70 via-[#020F40]/10 to-transparent opacity-80" />

                      {/* top tape */}
                      <div className="absolute left-0 right-0 top-0 flex items-center justify-between gap-2 bg-[#020F40]/85 px-3 py-2 backdrop-blur-sm dark:bg-[#11DFF5]/95">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.14em] uppercase text-white dark:text-[#020F40]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#11DFF5] shadow-[0_0_8px_#11DFF5] dark:bg-[#020F40]" />
                          {pages.process.card.phaseLabel} {num} —{" "}
                          {String(i + 1).padStart(2, "0")}/
                          {String(total).padStart(2, "0")}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-black tracking-[0.1em] text-white backdrop-blur dark:border-[#020F40]/10 dark:bg-[#020F40]/10 dark:text-[#020F40]">
                          <Clock3 className="h-3 w-3" />
                          {s.duration}
                        </span>
                      </div>

                      {/* big number badge on image */}
                      <div className="absolute left-3 top-[42px] flex h-[52px] w-[52px] items-center justify-center border-[3px] border-[#020F40] bg-[#020F40] text-[20px] font-black tracking-[-0.02em] text-[#11DFF5] shadow-[4px_4px_0_0_#11DFF5] dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40] sm:left-4 sm:h-[60px] sm:w-[60px] sm:text-[22px] lg:left-5 lg:top-12">
                        {num}
                      </div>

                      {/* icon + title pill on image bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                        <div className="inline-flex max-w-full items-center gap-2 border-[3px] border-white bg-white px-3 py-2 shadow-[4px_4px_0_0_#020F40] dark:border-[#11DFF5] dark:bg-[#0B1220] dark:shadow-[4px_4px_0_0_#11DFF5]">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center border-[2px] border-[#020F40] bg-[#020F40] text-white dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="truncate text-[13px] font-black uppercase tracking-[-0.01em] text-[#020F40] dark:text-white sm:text-[14px]">
                            {s.title}
                          </span>
                        </div>
                        <div className="mt-2 hidden max-w-[92%] text-[11px] font-bold leading-snug text-white/75 [text-shadow:0_1px_10px_rgba(0,0,0,0.8)] sm:block">
                          {s.desc}
                        </div>
                      </div>

                      {/* corner bracket */}
                      <span className="pointer-events-none absolute right-0 top-0 h-6 w-6 border-r-[3px] border-t-[3px] border-white/30" />
                      <span className="pointer-events-none absolute bottom-0 left-0 h-6 w-6 border-b-[3px] border-l-[3px] border-white/30" />
                    </div>

                    {/* thin accent line under image on mobile only */}
                    <div
                      className={`h-[4px] w-full bg-gradient-to-r ${accent} lg:hidden`}
                    />
                  </div>

                  {/* CONTENT — landscape pane — fills full-screen card */}
                  <div className="relative flex flex-1 flex-col p-5 sm:p-6 lg:h-full lg:min-h-0 lg:p-7 xl:p-8">
                    {/* top meta */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 border-[2px] border-[#020F40] bg-[#020F40] px-2.5 py-1 text-[10px] font-black tracking-[0.14em] uppercase text-[#11DFF5] dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]">
                        <Icon className="h-3 w-3" />
                        {String(i + 1).padStart(2, "0")} — {s.title}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border-[2px] border-[#0D65EF]/15 bg-[#0D65EF]/10 px-2.5 py-1 text-[10px] font-black tracking-[0.1em] text-[#0D65EF] dark:border-[#11DFF5]/25 dark:bg-[#11DFF5]/10 dark:text-[#11DFF5]">
                        <Clock3 className="h-3 w-3" />
                        {s.duration}
                      </span>
                      <span className="ml-auto hidden items-center gap-1.5 text-[10px] font-black tracking-[0.14em] uppercase text-[var(--text-secondary)] sm:inline-flex">
                        {pages.process.card.stepLabel} {num} /{" "}
                        {String(total).padStart(2, "0")}
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0D65EF] dark:bg-[#11DFF5]" />
                      </span>
                    </div>

                    <h3 className="mt-4 text-[22px] font-black uppercase tracking-[-0.02em] leading-none text-[var(--text-primary)] sm:text-[26px] lg:text-[28px]">
                      {s.title}
                      <span className="ml-2 inline-block h-[3px] w-8 translate-y-[-5px] bg-[#11DFF5] shadow-[0_0_8px_#11DFF5] sm:w-10" />
                    </h3>

                    <p className="mt-3 max-w-[560px] text-[13px] font-medium leading-relaxed text-[var(--text-secondary)] sm:text-[14px]">
                      {s.desc}
                    </p>

                    {/* items — brutal grid */}
                    <ul className="mt-5 grid gap-2 border-t-[3px] border-[#020F40]/10 pt-5 dark:border-white/10 sm:grid-cols-2">
                      {s.items.map((item, bi) => (
                        <motion.li
                          key={`${item}-${bi}`}
                          initial={{ opacity: 0, x: -6 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + bi * 0.04 }}
                          className="flex items-center gap-2.5 border-[2px] border-[#020F40]/10 bg-[var(--bg-elevated)]/60 px-3 py-2.5 text-[11px] font-bold tracking-[0.08em] uppercase text-[var(--text-primary)] backdrop-blur-sm transition-colors group-hover:border-[#020F40]/20 group-hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-white/85 dark:group-hover:bg-white/[0.07]"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-[#11DFF5] text-[#020F40] shadow-[1px_1px_0_0_#020F40] dark:shadow-[1px_1px_0_0_#11DFF5]">
                            <Zap className="h-3 w-3" />
                          </span>
                          <span className="min-w-0 truncate">{item}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* yields + CTA */}
                    <div className="mt-auto pt-5">
                      <div className="flex flex-wrap items-center gap-2 border-[3px] border-[#020F40]/10 bg-[#020F40]/[0.03] px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.03]">
                        <span className="text-[10px] font-black tracking-[0.14em] uppercase text-[var(--text-secondary)]">
                          {pages.process.card.yieldsLabel}
                        </span>
                        <span className="text-[12px] font-black tracking-[-0.01em] text-[var(--text-primary)]">
                          {i === total - 1
                            ? pages.process.card.productionFallback
                            : `${pages.process.card.phaseLabel} ${steps[i + 1]?.n || String(i + 2).padStart(2, "0")} — ${steps[i + 1]?.title}`}
                        </span>
                        <span className="ml-auto hidden h-px flex-1 bg-[#020F40]/10 dark:bg-white/10 sm:block" />
                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-1 text-[11px] font-black tracking-[0.12em] uppercase text-[#0D65EF] hover:text-[#020F40] dark:text-[#11DFF5] dark:hover:text-white"
                        >
                          {pages.process.card.goLabel}{" "}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2.5">
                        <Link
                          href="/contact"
                          className="inline-flex items-center justify-center gap-2 border-[3px] border-[#020F40] bg-[#020F40] px-5 py-2.5 text-[11px] font-black tracking-[0.14em] uppercase text-white shadow-[3px_3px_0_0_#11DFF5] transition hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_#11DFF5] dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]"
                        >
                          {pages.process.card.activateLabel}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <span className="hidden items-center gap-1.5 border-[2px] border-[#020F40]/10 bg-white px-3 py-2 text-[10px] font-black tracking-[0.12em] uppercase text-[var(--text-secondary)] dark:border-white/10 dark:bg-white/5 dark:text-white/60 sm:inline-flex">
                          <Shield className="h-3 w-3" />
                          {pages.process.card.dbBadge}
                        </span>
                      </div>
                    </div>

                    {/* bottom accent */}
                    <div
                      className={`pointer-events-none absolute bottom-0 left-0 h-[4px] w-full bg-gradient-to-r ${accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                    />
                    <div className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-0 bg-[#11DFF5] transition-all duration-700 group-hover:w-full dark:bg-white" />
                  </div>

                  {/* corner brackets */}
                  <span className="pointer-events-none absolute left-0 top-0 hidden h-4 w-4 border-l-[3px] border-t-[3px] border-[#020F40] opacity-25 group-hover:opacity-100 dark:border-[#11DFF5] lg:block" />
                  <span className="pointer-events-none absolute right-0 top-0 hidden h-4 w-4 border-r-[3px] border-t-[3px] border-[#020F40] opacity-25 group-hover:opacity-100 dark:border-[#11DFF5] lg:block" />
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* marquee — from lib */}
      <div className="relative z-10 mt-2 overflow-hidden border-y-[4px] border-[#020F40] bg-[#020F40] py-2.5 dark:border-[#11DFF5] sm:mt-4">
        <div className="flex animate-[marquee_18s_linear_infinite] whitespace-nowrap will-change-transform">
          {Array.from({ length: 6 }).map((_, k) => (
            <span
              key={k}
              className="mx-6 inline-flex items-center gap-6 text-[11px] font-black tracking-[0.18em] uppercase text-white"
            >
              <span className="h-1 w-1 bg-[#11DFF5] shadow-[0_0_6px_#11DFF5]" />
              {steps.map((s) => s.title).join(" • ")}{" "}
              <span className="text-[#11DFF5]">•</span>{" "}
              {pages.process.timeline.toUpperCase()}
              <span className="h-1 w-1 bg-[#11DFF5] shadow-[0_0_6px_#11DFF5]" />
            </span>
          ))}
        </div>
      </div>

      {/* final CTA — constrained, not full bleed */}
      <div className="relative z-10 mx-auto mt-6 max-w-[1440px] px-4 sm:mt-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative border-[4px] border-[#020F40] bg-[#020F40] p-5 shadow-[8px_8px_0_0_#11DFF5] dark:border-[#11DFF5] sm:p-7 lg:p-8"
        >
          <div className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(to_right,rgba(17,223,245,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,223,245,0.06)_1px,transparent_1px)] bg-[size:28px_28px]" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[620px]">
              <div className="inline-flex items-center gap-2 border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-black tracking-[0.14em] uppercase text-white/70">
                <span className="h-1.5 w-1.5 animate-pulse bg-[#11DFF5]" />
                {pages.process.scalesKicker}
              </div>
              <p className="mt-3 text-[15px] font-black uppercase tracking-[-0.01em] leading-none text-white sm:text-[18px]">
                {pages.process.timelineLabel}:{" "}
                <span className="text-[#11DFF5]">{pages.process.timeline}</span>{" "}
                {pages.process.timelineSuffix}
              </p>
              <p className="mt-2 text-[12px] font-medium leading-relaxed text-white/60 sm:text-[13px]">
                {pages.process.ctaDesc}
                <span className="hidden sm:inline">
                  {" "}
                  {pages.process.ctaDescSuffix}
                </span>
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-[3px] border-white bg-white px-7 py-3.5 text-[12px] font-black tracking-[0.16em] uppercase text-[#020F40] shadow-[4px_4px_0_0_#11DFF5] transition hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_#11DFF5] hover:bg-[#11DFF5] hover:border-[#11DFF5]"
              >
                {pages.process.primaryCta}
                <span className="flex h-6 w-6 items-center justify-center bg-[#020F40] text-white">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                href="/process"
                className="inline-flex items-center justify-center border-[3px] border-white/20 bg-transparent px-6 py-3 text-[11px] font-black tracking-[0.14em] uppercase text-white hover:border-white hover:bg-white hover:text-[#020F40]"
              >
                {pages.process.secondaryCta}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`@keyframes marquee { 0% { transform: translateX(0)} 100% { transform: translateX(-50%) } }`}</style>
    </section>
  );
}
