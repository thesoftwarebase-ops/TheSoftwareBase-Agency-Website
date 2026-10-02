'use client';
import { cn } from '@/lib/utils';
import { Share2, Database, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnimatedBeamMultipleOutputDemo({ className }) {
  return (
    <div className={cn('relative flex h-[300px] w-full items-center justify-center overflow-hidden p-4', className)}>
      <svg aria-hidden viewBox="0 0 300 180" className="absolute inset-0 h-full w-full">
        <path d="M50 90 H120 M180 40 L120 90 M180 90 H120 M180 140 L120 90" stroke="#0D65EF" strokeWidth="2.5" strokeDasharray="6 6" fill="none" className="dark:stroke-[#11DFF5]" />
        <circle cx="50" cy="90" r="18" fill="white" stroke="#020F40" strokeWidth="3" />
        <circle cx="180" cy="40" r="14" fill="#11DFF5" stroke="#020F40" strokeWidth="2" />
        <circle cx="180" cy="90" r="14" fill="#020F40" stroke="#11DFF5" strokeWidth="2" />
        <circle cx="180" cy="140" r="14" fill="white" stroke="#020F40" strokeWidth="2" />
      </svg>
      <div className="relative grid w-full grid-cols-3 gap-4">
        <div className="col-span-1 flex justify-center">
          <span className="flex h-12 w-12 items-center justify-center border-[3px] border-[#020F40] bg-[#020F40] text-[#11DFF5] shadow-[3px_3px_0_0_#11DFF5]">
            <Share2 className="h-6 w-6" />
          </span>
        </div>
        <div className="col-span-2 grid gap-3">
          {[
            { Icon: Database, label: 'MongoDB' },
            { Icon: Zap, label: 'Edge' },
            { Icon: Globe, label: 'Cloudflare' },
          ].map((it, i) => (
            <motion.div
              key={it.label}
              initial={{ x: 8, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.15, repeat: Infinity, repeatDelay: 3 }}
              className="flex items-center gap-2 border-[3px] border-[#020F40] bg-white px-3 py-2 text-[11px] font-black uppercase tracking-[0.08em] shadow-[2px_2px_0_0_#020F40] dark:border-[#11DFF5] dark:bg-[#0B1220] dark:text-white"
            >
              <it.Icon className="h-4 w-4 text-[#0D65EF] dark:text-[#11DFF5]" />
              {it.label}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
