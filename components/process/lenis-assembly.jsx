'use client';

import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { processSteps, pages as libPages } from '@/lib/site';
import { ArrowRight, ArrowUpRight, Check, Layers, Shield, Sparkles, Zap } from 'lucide-react';

const numberFor = (step, i) => step.n || String(i + 1).padStart(2, '0');

function Circuit() {
  return <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.06]">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#020F40_1px,transparent_1px),linear-gradient(to_bottom,#020F40_1px,transparent_1px)] bg-[size:28px_28px]" />
  </div>;
}

function StepCard({ step, next, index, side, reduced, copy }) {
  const pages = copy || libPages;
  const rowRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: rowRef, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-2%', '2%']);
  const number = numberFor(step, index);
  const src = step.image === '/home-hero.png' ? '/home-hero.webp' : step.image;
  return <div ref={rowRef} data-process-row data-side={side} className="process-row relative min-w-0">
    <div className={`process-cell min-w-0 ${side === 'left' ? 'is-left' : 'is-right'}`}>
      <article data-process-card className={`group relative ml-10 flex max-w-[560px] min-w-0 flex-col border-[4px] border-[#020F40] bg-white shadow-[8px_8px_0_0_#020F40] dark:border-[#11DFF5] dark:bg-[#0B1220] dark:shadow-[8px_8px_0_0_#11DFF5] sm:ml-12 md:ml-0 md:max-w-none ${side === 'left' ? 'md:mr-8 lg:mr-12 xl:mr-16' : 'md:ml-8 lg:ml-12 xl:ml-16'}`}>
        <div className={`h-[4px] w-full ${index % 2 ? 'bg-[#11DFF5]' : 'bg-[#0D65EF]'}`} />
        <div className="flex h-[36px] items-center border-b-[4px] border-[#020F40] bg-[#020F40] px-3 dark:border-[#11DFF5] dark:bg-[#0B1220]"><span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white"><span className={`h-1.5 w-1.5 rounded-full bg-[#11DFF5] ${reduced ? '' : 'animate-pulse'}`} />{pages.process.card.phaseLabel} {number}</span></div>
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b-[4px] border-[#020F40] bg-[#020F40] dark:border-[#11DFF5]">
          {src ? <motion.div style={reduced ? undefined : { y: imageY }} className="absolute -inset-y-[3%] inset-x-0"><Image src={src} alt={`${step.title} — ${step.desc.slice(0, 60)}`} fill priority={index === 0} sizes="(max-width: 767px) 100vw, (max-width: 1440px) 50vw, 560px" className={`object-cover ${step.imagePos || 'object-center'}`} /></motion.div> : <div className="absolute inset-0 flex items-center justify-center bg-[#020F40]"><Zap className="h-12 w-12 text-[#11DFF5]/40" /></div>}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020F40]/65 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4"><span className="inline-flex max-w-full border-[3px] border-white bg-white px-3 py-1.5 text-[11px] font-black uppercase text-[#020F40] shadow-[3px_3px_0_0_#11DFF5] dark:border-[#11DFF5]">{step.title}</span></div>
        </div>
        <div className="relative flex flex-1 flex-col p-6 sm:p-7">
          <Circuit />
          {/* Keep copy fully visible. A tall card may never satisfy an intersection percentage threshold. */}
          <div className="relative opacity-100">
            <div className="inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-[#11DFF5] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#020F40] shadow-[2px_2px_0_0_#020F40]"><Zap className="h-3 w-3" />{number} — {step.title}</div>
            <h3 className="mt-3 text-[20px] font-black uppercase leading-none tracking-[-0.02em] text-[#020F40] dark:text-white sm:text-[22px]">{step.title}</h3>
            <p className="mt-3 text-[13px] font-medium leading-relaxed text-[#020F40]/75 dark:text-white/75 sm:text-[14px]">{step.desc}</p>
          </div>
          <ul className="mt-6 grid gap-2.5 border-t-[3px] border-[#020F40]/10 pt-5 dark:border-white/10 sm:grid-cols-2">{(step.items || []).map((item, j) => <li key={`${item}-${j}`} className="flex min-w-0 items-center gap-2.5 border-[2px] border-[#020F40]/10 bg-[#020F40]/[0.03] px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.06em] text-[#020F40] dark:border-white/10 dark:bg-white/[0.04] dark:text-white"><span className="flex h-5 w-5 shrink-0 items-center justify-center bg-[#020F40] text-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]"><Check className="h-3 w-3" /></span><span className="min-w-0 flex-1 break-words">{item}</span></li>)}</ul>
          <div className="mt-6 flex flex-wrap items-center gap-2 border-[3px] border-[#020F40]/10 bg-[#020F40]/[0.03] px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]"><span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#020F40]/75 dark:text-white/75"><Sparkles className="h-3 w-3 text-[#0D65EF] dark:text-[#11DFF5]" />{pages.process.card.yieldsLabel}</span><span className="min-w-0 break-words text-[12px] font-black text-[#020F40] dark:text-white">{next ? `${numberFor(next, index + 1)} — ${next.title}` : pages.process.card.productionFallback}</span><Link href="/contact" className="ml-auto inline-flex items-center gap-1 rounded-full border-[2px] border-[#020F40] bg-white px-2.5 py-1 text-[10px] font-black uppercase text-[#020F40] hover:bg-[#020F40] hover:text-white dark:border-[#11DFF5] dark:bg-transparent dark:text-white dark:hover:bg-[#11DFF5] dark:hover:text-[#020F40]">{pages.process.card.goLabel}<ArrowUpRight className="h-3 w-3" /></Link></div>
          <div className="mt-6 flex flex-wrap items-center gap-3"><Link href="/contact" className="group inline-flex items-center gap-2 border-[4px] border-[#020F40] bg-[#020F40] px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.14em] text-white shadow-[4px_4px_0_0_#11DFF5] transition hover:translate-x-px hover:translate-y-px dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]">{pages.process.card.activateLabel}<ArrowRight className="h-4 w-4" /></Link><span className="inline-flex items-center gap-1.5 border-[2px] border-[#020F40]/10 bg-white px-3 py-2 text-[10px] font-black uppercase text-[#020F40]/75 dark:border-white/10 dark:bg-white/5 dark:text-white/75"><Shield className="h-3 w-3" />{pages.process.card.dbBadge}</span></div>
          <div className={`pointer-events-none absolute bottom-0 left-0 h-[4px] w-full ${index % 2 ? 'bg-[#11DFF5]' : 'bg-[#0D65EF]'}`} />
        </div>
      </article>
    </div>
  </div>;
}

function routeBetween(from, to, desktop) {
  const start = { x: from.left + from.width / 2, y: from.top + from.height };
  const end = { x: desktop && to.side === 'left' ? to.left + to.width : to.left, y: to.top + to.height / 2 };
  if (!desktop) {
    const gutter = Math.min(from.left, to.left) / 2;
    return { start, end, d: `M ${start.x} ${start.y} H ${gutter} V ${end.y} H ${end.x}` };
  }
  const dy = end.y - start.y;
  return { start, end, d: `M ${start.x} ${start.y} C ${start.x} ${start.y + dy / 2} ${end.x} ${end.y} ${end.x} ${end.y}` };
}

function TimelineWires({ timelineRef, reduced, count }) {
  const svgRef = useRef(null);
  const [geometry, setGeometry] = useState(null);

  useEffect(() => {
    const root = timelineRef.current;
    if (!root || count < 2) return;
    let frame = 0;
    let alive = true;
    const observer = new ResizeObserver(schedule);
    function measure() {
      frame = 0;
      const rootRect = root.getBoundingClientRect();
      const desktop = window.matchMedia('(min-width: 768px)').matches;
      const cards = [...root.querySelectorAll('[data-process-row]')].map((row) => {
        const el = row.querySelector('[data-process-card]');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return { side: row.dataset.side, left: rect.left - rootRect.left, top: rect.top - rootRect.top, width: rect.width, height: rect.height };
      }).filter(Boolean);
      if (cards.length < 2) return;
      const routes = cards.slice(0, -1).map((card, i) => routeBetween(card, cards[i + 1], desktop));
      const signature = [rootRect.width, rootRect.height, Number(desktop), ...cards.flatMap((c) => [c.left, c.top, c.width, c.height])].map((v) => v.toFixed(1)).join(',');
      setGeometry((old) => old?.signature === signature ? old : { signature, width: Math.max(1, rootRect.width), height: Math.max(1, rootRect.height), routes });
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(measure); }
    observer.observe(root);
    root.querySelectorAll('[data-process-row], [data-process-card]').forEach((el) => observer.observe(el));
    window.addEventListener('resize', schedule, { passive: true });
    document.fonts?.ready.then(() => { if (alive) schedule(); });
    schedule();
    return () => { alive = false; observer.disconnect(); window.removeEventListener('resize', schedule); if (frame) cancelAnimationFrame(frame); };
  }, [timelineRef, count]);

  useEffect(() => {
    const root = timelineRef.current;
    const svg = svgRef.current;
    if (!geometry || !root || !svg || reduced) return;
    let frame = 0;
    const paths = [...svg.querySelectorAll('[data-wire-path]')];
    const beads = [...svg.querySelectorAll('[data-wire-bead]')];
    function update() {
      frame = 0;
      const targetY = window.innerHeight * 0.55 - root.getBoundingClientRect().top;
      paths.forEach((path, i) => {
        const route = geometry.routes[i];
        const bead = beads[i];
        if (!route || !bead) return;
        if (targetY <= route.start.y || targetY >= route.end.y) {
          bead.style.opacity = '0';
          return;
        }
        const length = path.getTotalLength();
        let low = 0;
        let high = length;
        for (let j = 0; j < 10; j += 1) {
          const middle = (low + high) / 2;
          if (path.getPointAtLength(middle).y < targetY) low = middle;
          else high = middle;
        }
        const point = path.getPointAtLength((low + high) / 2);
        bead.setAttribute('transform', `translate(${point.x} ${point.y})`);
        bead.style.opacity = '1';
      });
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    schedule();
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); if (frame) cancelAnimationFrame(frame); };
  }, [timelineRef, geometry, reduced]);

  if (!geometry) return null;
  return <svg ref={svgRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden" viewBox={`0 0 ${geometry.width} ${geometry.height}`} preserveAspectRatio="none">
    {geometry.routes.map((route, i) => <g key={i}>
      <path data-wire-path d={route.d} fill="none" stroke="#11DFF5" strokeOpacity="0.55" strokeWidth="3" strokeDasharray="3 10" strokeLinecap="round" />
      <circle cx={route.start.x} cy={route.start.y} r="5" fill="#020F40" stroke="#11DFF5" strokeWidth="2" />
      <circle cx={route.end.x} cy={route.end.y} r="7" fill="#11DFF5" stroke="#020F40" strokeWidth="2" />
      {!reduced && <g data-wire-bead style={{ opacity: 0 }}><circle r="16" fill="#11DFF5" opacity="0.22" /><circle r="8" fill="#020F40" stroke="#11DFF5" strokeWidth="3" /><circle r="3" fill="white" /></g>}
    </g>)}
  </svg>;
}

function DeepDive({ steps, copy }) {
  const pages = copy || libPages;
  const list = Array.isArray(steps) && steps.length ? steps : processSteps;
  const groups = list.map((s, i) => ({
    title: s.title,
    entries: (s.items || []).slice(0, 3),
    dark: i % 2 === 1,
    cyan: i % 4 === 2,
  }));
  return <section className="relative mt-12 overflow-hidden border-[4px] border-[#020F40] bg-white shadow-[8px_8px_0_0_#020F40] dark:border-[#11DFF5] dark:bg-[#0B1220] dark:shadow-[8px_8px_0_0_#11DFF5] sm:mt-16">
    <Circuit />
    <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-3"><div className="flex flex-col gap-3"><span className="inline-flex items-center gap-2 self-start border-[3px] border-[#020F40] bg-[#020F40] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#11DFF5]"><Layers className="h-3 w-3" />Deep Dive</span><h3 className="text-[18px] font-black uppercase leading-none tracking-[-0.02em] text-[#020F40] dark:text-white">What ships <span className="text-[#0D65EF] dark:text-[#11DFF5]">every stage</span></h3><p className="text-[13px] font-medium leading-relaxed text-[#020F40]/75 dark:text-white/75">Hard gates, not slides. Each stage must pass strict checks before wire advances.</p></div><div className="grid gap-3 sm:grid-cols-2 lg:col-span-2">{groups.map((group) => <div key={group.title} className={`border-[3px] p-4 ${group.cyan ? 'border-[#020F40] bg-[#11DFF5] text-[#020F40] shadow-[3px_3px_0_0_#020F40] dark:border-[#11DFF5]' : group.dark ? 'border-[#020F40] bg-[#020F40] text-white shadow-[3px_3px_0_0_#11DFF5] dark:border-[#11DFF5]' : 'border-[#020F40] bg-white text-[#020F40] shadow-[3px_3px_0_0_#020F40] dark:border-white/10 dark:bg-[#0B1220] dark:text-white'}`}><div className={`text-[11px] font-black uppercase tracking-[0.12em] ${group.cyan ? 'text-[#020F40]' : group.dark ? 'text-[#11DFF5]' : 'text-[#0D65EF] dark:text-[#11DFF5]'}`}>{group.title}</div><ul className="mt-2 grid gap-1.5 text-[11px] font-bold uppercase tracking-[0.06em]">{group.entries.map((entry) => <li key={entry} className="flex gap-2"><span className={`mt-1.5 h-1.5 w-1.5 shrink-0 ${group.cyan ? 'bg-[#020F40]' : 'bg-[#11DFF5]'}`} />{entry}</li>)}</ul></div>)}</div></div><div className="h-[4px] w-full bg-gradient-to-r from-[#0D65EF] via-[#11DFF5] to-[#11DFF5] opacity-60" />
  </section>;
}

export function LenisAssembly({ manageLenis = true, steps = processSteps, copy }) {
  const pages = copy || libPages;
  const timelineRef = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!manageLenis || reduced) return;
    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true, syncTouch: false, anchors: true });
    let rafId = 0;
    const raf = (time) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, [manageLenis, reduced]);
  return <div className="relative mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
    <style jsx global>{`
      .process-row { display: flex; flex-direction: column; }
      .process-cell { width: 100%; }
      @media (min-width: 768px) {
        .process-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: stretch; }
        .process-cell.is-left { grid-column: 1; grid-row: 1; }
        .process-cell.is-right { grid-column: 2; grid-row: 1; }
      }
    `}</style>
    <div className="flex flex-wrap items-center gap-3"><h2 className="inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-[#020F40] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#11DFF5] dark:border-[#11DFF5]"><Zap className={`h-3 w-3 ${reduced ? '' : 'animate-pulse'}`} />Assembly — {String(steps.length).padStart(2, '0')} stages</h2><span className="hidden h-px flex-1 bg-[#020F40]/10 dark:bg-white/10 sm:block" /><span className="hidden items-center gap-2 border-[3px] border-[#020F40] bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#020F40] dark:border-[#11DFF5] dark:bg-[#0B1220] dark:text-white sm:inline-flex"><Shield className="h-3 w-3 text-[#0D65EF] dark:text-[#11DFF5]" />{pages.process.card.dbBadge}</span></div>
    <p className="mt-3 max-w-[640px] text-[13px] font-medium leading-relaxed text-[#020F40]/75 dark:text-white/75">{pages.process.headerExtra}{' '}<span className="font-black text-[#0D65EF] dark:text-[#11DFF5]">{pages.process.timeline} to prod</span></p>
    <div ref={timelineRef} className="relative isolate mt-10 sm:mt-12"><div className="relative z-10 flex flex-col gap-12 sm:gap-14 lg:gap-20">{steps.map((step, index) => <StepCard key={step.id ?? step.n ?? index} step={step} next={steps[index + 1]} index={index} side={index % 2 ? 'right' : 'left'} reduced={reduced} copy={copy} />)}</div><TimelineWires timelineRef={timelineRef} reduced={reduced} count={steps.length} /></div>
    <DeepDive steps={steps} copy={copy} />
    <div className="relative mt-6 h-[4px] w-full overflow-hidden border-y border-[#020F40]/10 bg-white dark:border-white/10 dark:bg-[#0B1220]"><div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,#020F40_0_12px,transparent_12px_24px)] opacity-10 dark:opacity-20" /><div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-[#020F40] bg-[#11DFF5] dark:border-[#11DFF5]" /></div>
    <section className="mt-12 sm:mt-16"><div className="relative overflow-hidden border-[4px] border-[#020F40] bg-[#020F40] p-6 shadow-[10px_10px_0_0_#11DFF5] dark:border-[#11DFF5] sm:p-8"><Circuit /><div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#11DFF5]/10 blur-2xl" /><div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"><div className="max-w-[640px]"><div className="inline-flex items-center gap-2 border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/70"><span className={`h-1.5 w-1.5 bg-[#11DFF5] ${reduced ? '' : 'animate-pulse'}`} />{pages.process.scalesKicker}</div><p className="mt-3 text-[18px] font-black uppercase leading-none tracking-[-0.01em] text-white sm:text-[20px]">{pages.process.timelineLabel}: <span className="text-[#11DFF5]">{pages.process.timeline}</span>{' '}{pages.process.timelineSuffix}</p><p className="mt-2 text-[13px] font-medium leading-relaxed text-white/60">{pages.process.ctaDesc} <span className="text-white/80">{pages.process.ctaDescSuffix}</span></p></div><div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center"><Link href="/contact" className="group inline-flex items-center gap-2 border-[4px] border-white bg-white px-7 py-3.5 text-[12px] font-black uppercase tracking-[0.16em] text-[#020F40] shadow-[4px_4px_0_0_#11DFF5] hover:translate-x-px hover:translate-y-px hover:border-[#11DFF5] hover:bg-[#11DFF5] hover:shadow-[3px_3px_0_0_#11DFF5]">{pages.process.primaryCta}<span className="flex h-6 w-6 items-center justify-center bg-[#020F40] text-white"><ArrowRight className="h-3.5 w-3.5" /></span></Link><Link href="/process" className="inline-flex items-center justify-center border-[3px] border-white/20 bg-transparent px-6 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-white hover:bg-white hover:text-[#020F40]">{pages.process.secondaryCta}</Link></div></div><div className="pointer-events-none absolute bottom-0 left-0 h-[4px] w-full bg-gradient-to-r from-[#0D65EF] via-[#11DFF5] to-[#11DFF5] opacity-60" /></div><div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#020F40]/75 dark:text-white/75"><Shield className="h-3 w-3 text-[#0D65EF] dark:text-[#11DFF5]" />{pages.process.scalesKicker} • {pages.process.card.dbBadge} • {String(steps.length).padStart(2, '0')} stages</div></section>
  </div>;
}