'use client';

import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import Link from 'next/link';
import { hero, site as libSite } from '@/lib/site';

export const WordsPullUp = ({ text, className = '', showAsterisk = false, style }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(' ');

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : '0.25em' }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

export const WordsPullUpMultiStyle = ({ segments, className = '', style }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const words = [];
  segments.forEach((seg) => {
    seg.text.split(' ').forEach((w) => {
      if (w) words.push({ word: w, className: seg.className });
    });
  });

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`} style={style}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-block ${w.className ?? ''}`}
          style={{ marginRight: '0.25em' }}
        >
          {w.word}
        </motion.span>
      ))}
    </div>
  );
};
export const HomeHero = ({ content, brand }) => {

  const h = content || hero;
  const site = brand || libSite;
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="h-[calc(100vh-92px)] w-full border-b-[4px] border-[#020F40] bg-[#05070C] font-grotesk shadow-[0_4px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[0_4px_0_0_#11DFF5] sm:h-[calc(100vh-96px)] lg:h-[calc(100vh-104px)]"
    >
      <div className="relative h-full w-full overflow-hidden">
        {/* Performance: poster webp 111KB, video only >=1024px, lazy, no autoplay on mobile */}
        <img
          src={h.poster || '/home-hero.webp'}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover lg:hidden"
        />
        {h.video ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            preload="auto"
            poster={h.poster || '/home-hero.webp'}
            aria-label={`${site.name} hero background video`}
            title={`${h.title.join(' ')} — ${h.kicker}`}
            className="absolute inset-0 hidden h-full w-full object-cover lg:block"
            src={h.video}
          />
        ) : null}

        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.25] mix-blend-overlay" />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#05070C]/60 via-[#05070C]/20 to-[#020F40]/90" />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(17,223,245,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,223,245,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />

        <div className="absolute inset-0 flex items-center px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 py-8 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
            <div className="max-w-[720px]">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex border-[3px] border-[#11DFF5] bg-[#11DFF5] px-3 py-1 text-[11px] font-black tracking-[0.16em] uppercase text-[#020F40]"
              >
                {h.kicker}
              </motion.div>

              <h1 id="hero-heading" className="mt-4 font-black leading-[0.85] tracking-[-0.04em] drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
                <span className="block text-[11vw] sm:text-[8vw] lg:text-[64px] xl:text-[76px] text-[#F7FAFC] [text-shadow:0_1px_0_#020F40,0_0_20px_rgba(17,223,245,0.35)]" aria-hidden="true">
                  <WordsPullUp text={site.name} />
                </span>
                <span className="sr-only">{site.name} — {h.title.join(' ')}</span>
                <span className="mt-3 block text-[13px] font-black tracking-[0.16em] uppercase text-[#81ABCA] sm:text-[15px] lg:text-[16px]">
                  {h.title[0]} <span className="text-[#11DFF5] [text-shadow:0_0_12px_rgba(17,223,245,0.6)]">{h.title[1]}</span>
                </span>
              </h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 max-w-[560px] border-l-[3px] border-[#11DFF5]/70 pl-4 text-[14px] font-medium leading-relaxed text-[#C6EAF4] [text-shadow:0_1px_8px_rgba(0,0,0,0.8)] sm:text-[15px]"
              >
                {h.desc}
              </motion.p>
            </div>

            <div className="flex shrink-0 flex-col gap-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap gap-3"
              >
                <Link
                  href={h.primaryCta.href}
                  className="group inline-flex items-center gap-2 border-[4px] border-[#11DFF5] bg-[#11DFF5] px-7 py-3 text-[13px] font-black tracking-[0.16em] uppercase text-[#020F40] shadow-[4px_4px_0_0_white] transition-all hover:bg-white hover:border-white hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0_0_white]"
                >
                  {h.primaryCta.label}
                  <span className="flex h-6 w-6 items-center justify-center bg-[#020F40] text-[#11DFF5] transition-transform group-hover:translate-x-0.5 group-hover:bg-[#020F40]">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>

                <Link
                  href={h.secondaryCta.href}
                  className="inline-flex items-center justify-center border-[3px] border-white bg-white/95 px-7 py-3 text-[13px] font-black tracking-[0.16em] uppercase text-[#020F40] shadow-[3px_3px_0_0_#11DFF5] backdrop-blur-md hover:bg-[#020F40] hover:text-white hover:border-[#020F40]"
                >
                  {h.secondaryCta.label}
                </Link>
              </motion.div>

              {Array.isArray(h.stats) && h.stats.length > 0 && (
                <motion.dl
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-3 divide-x divide-white/15 border-[3px] border-white/20 bg-black/40 backdrop-blur-md"
                >
                  {h.stats.slice(0, 3).map((s) => (
                    <div key={s.k} className="flex flex-col px-3 py-2.5 text-center sm:px-4">
                      <dt className="order-2 mt-1 block text-[9px] font-black uppercase tracking-[0.14em] text-white/60">
                        {s.k}
                      </dt>
                      <dd className="order-1 text-[18px] font-black leading-none tracking-[-0.02em] text-[#11DFF5] [text-shadow:0_0_12px_rgba(17,223,245,0.6)] sm:text-[22px]">
                        {s.v}
                      </dd>
                    </div>
                  ))}
                </motion.dl>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
