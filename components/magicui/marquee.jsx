import { cn } from '@/lib/utils';

export function Marquee({ className, pauseOnHover, children, ...props }) {
  return (
    <div
      className={cn(
        'group flex overflow-hidden [--duration:20s] [--gap:1rem] [gap:var(--gap)]',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'flex shrink-0 animate-[marquee_var(--duration)_linear_infinite] justify-around [gap:var(--gap)]',
          pauseOnHover && 'group-hover:[animation-play-state:paused]'
        )}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          'flex shrink-0 animate-[marquee_var(--duration)_linear_infinite] justify-around [gap:var(--gap)]',
          pauseOnHover && 'group-hover:[animation-play-state:paused]'
        )}
      >
        {children}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(calc(-100% - var(--gap))) } }`}</style>
    </div>
  );
}
