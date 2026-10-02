'use client';
import { cn } from '@/lib/utils';

export function Calendar({ className, ...props }) {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const selected = 11;
  return (
    <div className={cn('border-[3px] border-[#020F40] bg-white p-4 shadow-[3px_3px_0_0_#020F40] dark:border-[#11DFF5] dark:bg-[#0B1220]', className)} {...props}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[12px] font-black uppercase tracking-[0.12em]">May 2022</span>
        <span className="h-2 w-2 bg-[#11DFF5]" />
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <span key={`${d}-${i}`} className="py-1 text-[var(--text-secondary)]">
            {d}
          </span>
        ))}
        {days.map((d) => (
          <span
            key={d}
            className={cn(
              'flex h-7 w-7 items-center justify-center border text-[11px]',
              d === selected
                ? 'border-[#020F40] bg-[#020F40] text-white dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]'
                : 'border-transparent hover:border-[#020F40]/20'
            )}
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}
