import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function BentoGrid({ children, className }) {
  return (
    <div className={cn('grid w-full grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3', className)}>
      {children}
    </div>
  );
}

const ACCENTS = [
  'bg-[#0D65EF]',
  'bg-[#11DFF5]',
  'bg-[#020F40] dark:bg-[#11DFF5]',
  'bg-[#0D65EF]',
];

const SPANS = ['lg:col-span-1', 'lg:col-span-2', 'lg:col-span-2', 'lg:col-span-1'];

export function BentoCard({ Icon, name, description, href, cta, background, index = 0 }) {
  const accent = ACCENTS[index % ACCENTS.length];
  const id = `EXP-${String(index + 1).padStart(2, '0')}`;
  const span = SPANS[index % SPANS.length];
  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden border-[4px] border-[#020F40] bg-[#05070C] shadow-[6px_6px_0_0_#020F40] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#0D65EF] dark:border-[#11DFF5] dark:shadow-[6px_6px_0_0_#11DFF5] dark:hover:shadow-[10px_10px_0_0_#11DFF5]',
        span
      )}
    >
      {/* console header */}
      <div className="relative z-10 flex items-center gap-2 border-b-[4px] border-[#020F40] bg-[#020F40] px-4 py-2 dark:border-[#11DFF5] dark:bg-[#0B1220]">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#11DFF5] shadow-[0_0_8px_#11DFF5]" />
        <span className="font-mono text-[10px] font-black tracking-[0.2em] text-[#11DFF5]">{id}</span>
        <span className="hidden h-px flex-1 bg-white/10 sm:block" />
        <span className="font-mono text-[10px] font-black tracking-[0.2em] text-white/50">STATUS: LIVE</span>
      </div>

      {/* live viewport */}
      <div className="relative h-56 overflow-hidden sm:h-64">
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]">{background}</div>
        {/* HUD */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_right,rgba(17,223,245,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,223,245,0.05)_1px,transparent_1px)] bg-[size:28px_28px]" />
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#05070C]/70 via-transparent to-[#05070C]/25" />
        <span className="pointer-events-none absolute left-3 top-3 z-20 h-4 w-4 border-l-[3px] border-t-[3px] border-[#11DFF5]/70" />
        <span className="pointer-events-none absolute right-3 top-3 z-20 h-4 w-4 border-r-[3px] border-t-[3px] border-[#11DFF5]/70" />
        <span className="pointer-events-none absolute bottom-3 left-3 z-20 h-4 w-4 border-b-[3px] border-l-[3px] border-[#11DFF5]/70" />
        <span className="pointer-events-none absolute bottom-3 right-3 z-20 h-4 w-4 border-b-[3px] border-r-[3px] border-[#11DFF5]/70" />
      </div>

      {/* readout + controls */}
      <div className="relative z-10 flex flex-1 flex-col gap-3 border-t-[4px] border-[#020F40] bg-[var(--bg-surface)] p-5 dark:border-[#11DFF5] sm:p-6">
        <div className={`h-1 w-12 ${accent}`} />
        <h3 className="text-[19px] font-black uppercase leading-none tracking-[-0.02em] text-[var(--text-primary)] sm:text-[21px]">
          {name}
        </h3>
        <p className="max-w-[560px] text-[13px] font-medium leading-relaxed text-[var(--text-secondary)] sm:min-h-[66px] sm:text-[14px]">
          {description}
        </p>
        <div className="mt-auto flex items-center gap-3 pt-4">
          <Link
            href={href}
            className="inline-flex flex-1 items-center justify-center gap-2 border-[4px] border-[#020F40] bg-[#020F40] px-5 py-3 text-[12px] font-black tracking-[0.16em] uppercase text-white shadow-[4px_4px_0_0_#0D65EF] transition hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_#0D65EF] hover:bg-[#0D65EF] dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40] dark:shadow-[4px_4px_0_0_white] sm:flex-none sm:px-8"
          >
            {cta}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <span className="ml-auto hidden font-mono text-[10px] tracking-[0.2em] text-[var(--text-secondary)]/60 sm:block">
            {id}
          </span>
        </div>
      </div>
    </div>
  );
}
