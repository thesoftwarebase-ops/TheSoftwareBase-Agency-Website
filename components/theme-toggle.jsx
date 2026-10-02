'use client';

import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { site } from '@/lib/site';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        aria-hidden
        className="
          inline-flex
          h-[44px]
          w-[44px]
          items-center
          justify-center
          border-[3px]
          border-[#020F40]
          bg-[var(--bg-surface)]
          shadow-[3px_3px_0_0_#020F40]
          dark:border-[#11DFF5]
          dark:shadow-[3px_3px_0_0_#11DFF5]
        "
      />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      suppressHydrationWarning
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? site.ui.themeLight : site.ui.themeDark}
      title={isDark ? site.ui.themeLightShort : site.ui.themeDarkShort}
      className="
        inline-flex
        h-[44px]
        w-[44px]
        items-center
        justify-center
        border-[3px]
        border-[#020F40]
        bg-[var(--bg-surface)]
        text-[var(--text-primary)]
        shadow-[3px_3px_0_0_#020F40]
        transition-all
        duration-200
        hover:translate-x-px
        hover:translate-y-px
        hover:shadow-[2px_2px_0_0_#020F40]
        active:translate-x-[3px]
        active:translate-y-[3px]
        active:shadow-none
        dark:border-[#11DFF5]
        dark:shadow-[3px_3px_0_0_#11DFF5]
        dark:hover:shadow-[2px_2px_0_0_#11DFF5]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#11DFF5]
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[var(--bg-surface)]
      "
    >
      <span
        className="
          relative
          flex
          h-5
          w-5
          items-center
          justify-center
        "
      >
        {isDark ? (
          <SunIcon
            className="
              h-5
              w-5
              text-[#11DFF5]
            "
          />
        ) : (
          <MoonIcon
            className="
              h-5
              w-5
              text-[#093375]
            "
          />
        )}
      </span>
    </button>
  );
}
