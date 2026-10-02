'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { dashboard } from '@/lib/site';
import { Layers, Mail, Menu, Rocket, Shield, Search, TrendingUp, Wrench, X, Zap } from 'lucide-react';

const ICONS = {
  overview: Zap,
  hero: Zap,
  services: Layers,
  work: Rocket,
  process: Wrench,
  'why-us': Shield,
  faq: Search,
  contact: Mail,
  footer: TrendingUp,
};

export function Sidebar({ siteName, kicker, email, sections, groups, logoutLabel, backLabel, onLogout }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Collapse the menu on every navigation (small screens).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open ]);

  const isActive = (href) => pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}/`));

  const byId = Object.fromEntries(sections.map((s) => [s.id, s]));

  const links = (
    <nav aria-label="Dashboard sections" className="mt-4 grid gap-4">
      <Link
        href="/dashboard"
        aria-current={pathname === '/dashboard' ? 'page' : undefined}
        className={`flex items-center gap-2.5 border-[3px] px-3 py-2.5 text-[11px] font-black uppercase tracking-[0.1em] transition-colors ${
          pathname === '/dashboard'
            ? 'border-[#11DFF5] bg-[#11DFF5] text-[#020F40]'
            : 'border-white/15 bg-white/[0.04] text-white/80 hover:border-[#11DFF5] hover:bg-white/[0.08] hover:text-white'
        }`}
      >
        <Zap aria-hidden className={`h-3.5 w-3.5 shrink-0 ${pathname === '/dashboard' ? 'text-[#020F40]' : 'text-[#11DFF5]'}`} />
        <span className="min-w-0 flex-1 truncate">Overview</span>
      </Link>
      {groups.map((g) => (
        <div key={g.page}>
          {g.href ? (
            <Link
              href={g.href}
              className="block px-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-[#11DFF5]"
            >
              {g.page} ↗
            </Link>
          ) : (
            <span className="block px-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/50">
              {g.page}
            </span>
          )}
          <div className="mt-1.5 grid gap-1.5 border-l-2 border-white/10 pl-2">
            {g.items.map((id) => {
              const s = byId[id];
              if (!s) return null;
              const Icon = ICONS[s.id] || Zap;
              const active = isActive(s.href);
              // Editors ship incrementally — unbuilt sections render inert,
              // never a link to a missing page.
              if (!s.ready) {
                return (
                  <span
                    key={s.id}
                    aria-disabled="true"
                    title={dashboard.soonLabel}
                    className="flex cursor-not-allowed items-center gap-2.5 border-[3px] border-white/10 bg-transparent px-3 py-2 text-[11px] font-black uppercase tracking-[0.1em] text-white/40"
                  >
                    <Icon aria-hidden className="h-3.5 w-3.5 shrink-0 text-white/30" />
                    <span className="min-w-0 flex-1 truncate">{s.label}</span>
                    <span className="border border-white/20 px-1 py-px text-[9px] tracking-[0.12em]">{dashboard.soonLabel}</span>
                  </span>
                );
              }
              return (
                <Link
                  key={s.id}
                  href={s.href}
                  aria-current={active ? 'page' : undefined}
                  className={`group flex items-center gap-2.5 border-[3px] px-3 py-2 text-[11px] font-black uppercase tracking-[0.1em] transition-colors ${
                    active
                      ? 'border-[#11DFF5] bg-[#11DFF5] text-[#020F40]'
                      : 'border-white/15 bg-white/[0.04] text-white/80 hover:border-[#11DFF5] hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  <Icon aria-hidden className={`h-3.5 w-3.5 shrink-0 ${active ? 'text-[#020F40]' : 'text-[#11DFF5]'}`} />
                  <span className="min-w-0 flex-1 truncate">{s.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* MOBILE BAR — hamburger + identity */}
      <div className="flex items-center gap-3 border-[4px] border-[#020F40] bg-[#020F40] p-3 text-white shadow-[4px_4px_0_0_#0D65EF] dark:border-[#11DFF5] lg:hidden">
        <button
          type="button"
          suppressHydrationWarning
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="dashboard-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex h-10 w-10 shrink-0 items-center justify-center border-[3px] border-[#11DFF5] bg-[#11DFF5] text-[#020F40]"
        >
          {open ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-black uppercase leading-none tracking-[-0.01em]">
            {siteName} <span className="text-[#11DFF5]">{kicker}</span>
          </div>
          <div className="mt-1 truncate text-[10px] font-bold uppercase tracking-[0.1em] text-white/60">
            {email}
          </div>
        </div>
        <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${open ? 'bg-[#11DFF5]' : 'animate-pulse bg-[#11DFF5]'}`} />
      </div>

      {/* MOBILE DRAWER */}
      {open && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div aria-hidden className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div id="dashboard-menu" className="absolute bottom-0 left-0 top-0 w-[min(85vw,320px)] overflow-y-auto border-r-[4px] border-[#11DFF5] bg-[#020F40] p-4">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-black uppercase text-white">
                {siteName} <span className="text-[#11DFF5]">{kicker}</span>
              </span>
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center border-[3px] border-[#11DFF5] text-[#11DFF5]"
              >
                <X aria-hidden className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-[0.1em] text-white/60">
              {email}
            </p>
            {links}
            <div className="mt-4 grid gap-2 border-t border-white/10 pt-4">
              <Link
                href="/"
                className="text-center text-[10px] font-black uppercase tracking-[0.14em] text-white/60 hover:text-white"
              >
                ← {backLabel}
              </Link>
              <form action={onLogout}>
                <button
                  type="submit"
                  suppressHydrationWarning
                  className="w-full border-[3px] border-[#11DFF5] bg-transparent px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#11DFF5] transition-colors hover:bg-[#11DFF5] hover:text-[#020F40]"
                >
                  {logoutLabel}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <style>{`
        .dash-scroll { scrollbar-width: thin; scrollbar-color: #11DFF5 #020F40; }
        .dash-scroll::-webkit-scrollbar { width: 8px; }
        .dash-scroll::-webkit-scrollbar-track { background: #020F40; }
        .dash-scroll::-webkit-scrollbar-thumb { background: #11DFF5; border: 2px solid #020F40; }
      `}</style>
      <aside className="hidden lg:block lg:sticky lg:top-6 lg:self-start">
        <div className="dash-scroll border-[4px] border-[#020F40] bg-[#020F40] p-5 text-white shadow-[6px_6px_0_0_#0D65EF] dark:border-[#11DFF5] dark:shadow-[6px_6px_0_0_#11DFF5] lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto">
          <Link href="/dashboard" className="block text-[16px] font-black uppercase leading-none tracking-[-0.02em]">
            {siteName} <span className="text-[#11DFF5]">{kicker}</span>
          </Link>
          <p className="mt-1.5 truncate text-[11px] font-bold uppercase tracking-[0.1em] text-white/60">
            {email}
          </p>
          {links}
          <div className="mt-4 grid gap-2 border-t border-white/10 pt-4">
            <Link
              href="/"
              className="text-center text-[10px] font-black uppercase tracking-[0.14em] text-white/60 hover:text-white"
            >
              ← {backLabel}
            </Link>
            <form action={onLogout}>
              <button
                type="submit"
                suppressHydrationWarning
                className="w-full border-[3px] border-[#11DFF5] bg-transparent px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#11DFF5] transition-colors hover:bg-[#11DFF5] hover:text-[#020F40]"
              >
                {logoutLabel}
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
