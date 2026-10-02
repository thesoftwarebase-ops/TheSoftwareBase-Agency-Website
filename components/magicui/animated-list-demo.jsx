'use client';
import { cn } from '@/lib/utils';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const notifications = [
  { title: 'Deploy succeeded', desc: 'Production • 2m ago' },
  { title: 'CI passed', desc: 'Preview • 5m ago' },
  { title: 'Evals green', desc: 'AI • 12m ago' },
  { title: 'Uptime 99.9%', desc: 'Infra • now' },
];

export default function AnimatedListDemo({ className }) {
  return (
    <div className={cn('flex flex-col gap-2 p-2', className)}>
      {notifications.map((n, i) => (
        <motion.div
          key={n.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12, repeat: Infinity, repeatDelay: 4, duration: 0.5 }}
          className="flex items-center gap-3 border-[3px] border-[#020F40] bg-white p-3 shadow-[3px_3px_0_0_#020F40] dark:border-[#11DFF5] dark:bg-[#0B1220] dark:shadow-[3px_3px_0_0_#11DFF5]"
        >
          <span className="flex h-8 w-8 items-center justify-center bg-[#11DFF5] text-[#020F40]">
            <Bell className="h-4 w-4" />
          </span>
          <span className="flex flex-col">
            <span className="text-[12px] font-black uppercase leading-none">{n.title}</span>
            <span className="text-[11px] font-bold text-[var(--text-secondary)]">{n.desc}</span>
          </span>
        </motion.div>
      ))}
    </div>
  );
}
