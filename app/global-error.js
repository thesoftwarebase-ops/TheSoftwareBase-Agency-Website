'use client';

import Link from 'next/link';
import { site, pages } from '@/lib/site';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="font-grotesk bg-[#C6EAF4] antialiased">
        <div className="mx-auto flex min-h-screen max-w-[880px] flex-col items-start justify-center px-4 py-16 sm:px-6">
          <div className="w-full border-[4px] border-[#020F40] bg-white p-6 shadow-[8px_8px_0_0_#020F40] sm:p-10">
            <div aria-hidden className="h-[5px] w-full bg-gradient-to-r from-[#0D65EF] via-[#11DFF5] to-[#0D65EF]" />
            <div className="mt-4 inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-[#11DFF5] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#020F40]">
              <span aria-hidden className="h-2 w-2 animate-pulse bg-[#020F40]" />
              {pages.error.kicker}
            </div>
            <h1 className="mt-4 text-[clamp(2.5rem,6vw,4rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-[#020F40]">
              <span className="block">{pages.error.title[0]}</span>
              <span className="block text-[#0D65EF]">{pages.error.title[1]}</span>
            </h1>
            <p className="mt-4 max-w-[560px] border-l-[5px] border-[#0D65EF] pl-4 text-[14px] font-medium leading-relaxed text-[#020F40]/75">
              {pages.error.desc}
            </p>
            {error?.message && (
              <p className="mt-3 max-w-[560px] truncate border-[2px] border-[#020F40]/15 bg-[#020F40]/[0.04] px-3 py-2 font-mono text-[11px] text-[#020F40]/60">
                {error.message}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex items-center justify-center border-[4px] border-[#020F40] bg-[#020F40] px-7 py-3.5 text-[12px] font-black uppercase tracking-[0.14em] text-white shadow-[4px_4px_0_0_#0D65EF] transition hover:translate-x-px hover:translate-y-px"
              >
                {pages.error.retryLabel}
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center border-[3px] border-[#020F40]/30 bg-white px-7 py-3.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#020F40] transition-colors hover:bg-[#020F40] hover:text-white"
              >
                {site.shortName} — {site.name}
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
