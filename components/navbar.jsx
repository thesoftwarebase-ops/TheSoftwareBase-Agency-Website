'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { site, footer } from '@/lib/site';

// ---------------------------------------------------------------------------
// NAV CONFIG — single source: lib/site.js — brutal hero, centered
// ---------------------------------------------------------------------------

const NAV_LINKS = site.nav;
const CONTACT_HREF = site.cta.href;

// ---------------------------------------------------------------------------
// HOOKS — headroom + lock, responsive perfection
// ---------------------------------------------------------------------------

function useScrollState(threshold = 10) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(y > threshold);

          const delta = y - lastY.current;

          if (y > 140) {
            if (delta > 8 && !hidden) setHidden(true);
            if (delta < -10 && hidden) setHidden(false);
          } else if (hidden) {
            setHidden(false);
          }

          lastY.current = y;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold, hidden]);

  return { scrolled, hidden };
}

function useLockBody(lock) {
  useEffect(() => {
    if (!lock) return;

    const originalOverflow = document.body.style.overflow;

    // brutal fix: no paddingRight compensation — that causes squashed layout
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [lock]);
}

function useEsc(close) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);
}

// ---------------------------------------------------------------------------
// ATOMS — brutal, clean, no emoji, no numbers
// ---------------------------------------------------------------------------

function HoverUnderline({ active }) {
  return (
    <span
      aria-hidden
      className={`
        pointer-events-none
        absolute
        -bottom-1
        left-0
        h-[3px]
        bg-[#11DFF5]
        transition-all
        duration-200
        ease-out
        ${active ? 'w-full' : 'w-0 group-hover:w-full'}
      `}
    />
  );
}

function Arrow({ className = '' }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M5 8h8M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

function CircuitRail() {
  return (
    <div
      aria-hidden
      className="
        pointer-events-none
        absolute
        inset-x-0
        bottom-0
        h-px
        bg-[#11DFF5]/40
      "
    >
      <span
        className="
          absolute
          left-[6%]
          top-1/2
          h-[8px]
          w-[8px]
          -translate-y-1/2
          rounded-full
          border-2
          border-[#11DFF5]
          bg-[var(--bg-surface)]
        "
      />
      <span
        className="
          absolute
          left-[18%]
          top-1/2
          h-[4px]
          w-[4px]
          -translate-y-1/2
          rounded-full
          bg-[#11DFF5]
        "
      />
      <span
        className="
          absolute
          right-[18%]
          top-1/2
          h-[8px]
          w-[8px]
          -translate-y-1/2
          rounded-full
          border-2
          border-[#11DFF5]
          bg-[var(--bg-surface)]
        "
      />
      <span
        className="
          absolute
          right-[6%]
          top-1/2
          h-[4px]
          w-[4px]
          -translate-y-1/2
          rounded-full
          bg-[#11DFF5]
        "
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// DESKTOP NAV ITEM — brutal but clean, centered layout
// ---------------------------------------------------------------------------

function DesktopNavItem({ href, label, isActive, children, pathname }) {
  const hasChildren = Array.isArray(children) && children.length > 0;
  const isParentActive = isActive || (hasChildren && pathname?.startsWith(href));

  if (!hasChildren) {
    return (
      <Link
        href={href}
        aria-current={isActive ? 'page' : undefined}
        className={`
        group
        relative
        inline-flex
        items-center
        justify-center
        border-[3px]
        px-6
        xl:px-7
        py-3.5
        text-[13.5px]
        xl:text-[14px]
        font-semibold
        tracking-[0.16em]
        uppercase
        leading-none
        font-grotesk
        transition-all
        duration-200
        ${isActive
            ? 'border-[#020F40] bg-[#020F40] text-white shadow-[4px_4px_0_0_#11DFF5] dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40] dark:shadow-[4px_4px_0_0_#11DFF5]'
            : 'border-transparent bg-transparent text-[var(--text-primary)] hover:border-[#020F40] hover:bg-white hover:text-[#020F40] hover:shadow-[4px_4px_0_0_#020F40] hover:-translate-y-px active:translate-y-0 active:shadow-[2px_2px_0_0_#020F40] dark:text-[#C6EAF4] dark:hover:border-[#11DFF5] dark:hover:bg-[#0B1220] dark:hover:text-white dark:hover:shadow-[4px_4px_0_0_#11DFF5]'
          }
      `}
      >
        <span className="relative py-1">
          {label}
          <HoverUnderline active={isActive} />
        </span>
      </Link>
    );
  }

  return (
    <div className="group relative inline-flex">
      <button
        type="button"
        suppressHydrationWarning
        aria-current={isParentActive ? 'page' : undefined}
        aria-haspopup="menu"
        aria-expanded="false"
        className={`
        relative
        inline-flex
        items-center
        justify-center
        gap-1.5
        border-[3px]
        px-6
        xl:px-7
        py-3.5
        text-[13.5px]
        xl:text-[14px]
        font-semibold
        tracking-[0.16em]
        uppercase
        leading-none
        font-grotesk
        transition-all
        duration-200
        ${isParentActive
            ? 'border-[#020F40] bg-[#020F40] text-white shadow-[4px_4px_0_0_#11DFF5] dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40] dark:shadow-[4px_4px_0_0_#11DFF5]'
            : 'border-transparent bg-transparent text-[var(--text-primary)] hover:border-[#020F40] hover:bg-white hover:text-[#020F40] hover:shadow-[4px_4px_0_0_#020F40] dark:text-[#C6EAF4] dark:hover:border-[#11DFF5] dark:hover:bg-[#0B1220] dark:hover:text-white dark:hover:shadow-[4px_4px_0_0_#11DFF5]'
          }
      `}
      >
        <span className="relative py-1 inline-flex items-center gap-1">
          {label}
          <span aria-hidden className="text-[10px] transition-transform group-hover:rotate-180">▼</span>
          <HoverUnderline active={isParentActive} />
        </span>
      </button>

      <div
        role="menu"
        className="absolute left-1/2 top-full z-50 hidden min-w-[320px] -translate-x-1/2 pt-3 group-hover:block"
      >
        <div className="pointer-events-none absolute inset-x-0 -top-3 h-3" aria-hidden />
        <div className="border-[4px] border-[#020F40] bg-white p-2 shadow-[6px_6px_0_0_#020F40] dark:border-[#11DFF5] dark:bg-[#0B1220] dark:shadow-[6px_6px_0_0_#11DFF5]">
          {children.map((child) => {
            const childActive = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                role="menuitem"
                className={`flex items-center justify-between gap-3 border-[3px] px-4 py-3 transition-all ${childActive ? 'border-[#020F40] bg-[#020F40] text-white dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40]' : 'border-transparent bg-transparent text-[var(--text-primary)] hover:border-[#020F40] hover:bg-[#020F40] hover:text-white dark:text-white dark:hover:border-[#11DFF5] dark:hover:bg-[#11DFF5] dark:hover:text-[#020F40]'}`}
              >
                <span className="flex flex-col text-left">
                  <span className="text-[13px] font-black uppercase tracking-[0.08em] leading-none">{child.label}</span>
                  <span className={`mt-1 text-[11px] font-medium tracking-[0.08em] leading-none ${childActive ? 'text-white/70 dark:text-[#020F40]/70' : 'text-[var(--text-secondary)]'}`}>{child.desc}</span>
                </span>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center border-[2px] text-[12px] ${childActive ? 'border-white bg-white text-[#020F40]' : 'border-[#020F40] bg-white text-[#020F40] dark:border-[#11DFF5]'}`}>→</span>
              </Link>
            );
          })}

        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FULLSCREEN MOBILE — brutal, occupies whole screen, responsive
// ---------------------------------------------------------------------------

function FullscreenMobile({
  open,
  onClose,
  pathname,
  links = NAV_LINKS,
  ctaHref = CONTACT_HREF,
  ctaLabel = site.cta.label,
  watermark = footer.watermark,
}) {
  useLockBody(open);
  useEsc(onClose);

  return (
    <div
      aria-hidden={!open}
      className={`
        lg:hidden
        fixed
        inset-0
        z-[70]
        flex
        flex-col
        bg-[var(--bg-surface)]
        font-grotesk
        transition-all
        duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)]
        ${open
          ? 'translate-x-0 opacity-100 pointer-events-auto'
          : 'translate-x-full opacity-0 pointer-events-none'
        }
      `}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      {/* fullscreen header — LOGO EVEN MORE MASSIVE, EXTREME LEFT, beautified */}
      <div
        className="
          flex
          h-[92px]
          sm:h-[108px]
          shrink-0
          items-center
          justify-between
          border-b-[4px]
          border-[#020F40]
          bg-[var(--bg-surface)]
          pl-0
          pr-4
          sm:pr-6
          dark:border-[#11DFF5]
        "
      >
        <Link
          href="/"
          onClick={onClose}
          aria-label={`${site.name} — home`}
          className="
            flex
            shrink-0
            items-center
            self-stretch
            m-0
            p-0
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#11DFF5]
          "
        >
          <Image
            src="/thesoftwarebase.png"
            alt="The Software Base"
            width={900}
            height={216}
            className="
              block
              h-[84px]
              sm:h-[96px]
              w-auto
              max-w-[74vw]
              object-contain
              object-left
              m-0
              p-0
            "
          />
        </Link>

        <div
          className="
            flex
            shrink-0
            items-center
            gap-2
            sm:gap-3
          "
        >
          <ThemeToggle />

          <button
            type="button"
            suppressHydrationWarning
            onClick={onClose}
            aria-label={site.ui.closeNavigation}
            className="
              inline-flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              border-[3px]
              border-[#020F40]
              bg-[#0D65EF]
              text-white
            shadow-[3px_3px_0_0_#020F40]
            transition-all
            hover:translate-x-px
            hover:translate-y-px
            hover:shadow-[2px_2px_0_0_#020F40]
            active:translate-x-[3px]
            active:translate-y-[3px]
            active:shadow-none
            dark:border-[#11DFF5]
            dark:shadow-[3px_3px_0_0_#11DFF5]
          "
        >
          <span
            className="
              relative
              block
              h-[14px]
              w-[14px]
            "
          >
            <span
              className="
                absolute
                left-1/2
                top-1/2
                h-[2px]
                w-[18px]
                -translate-x-1/2
                -translate-y-1/2
                rotate-45
                bg-white
              "
            />
            <span
              className="
                absolute
                left-1/2
                top-1/2
                h-[2px]
                w-[18px]
                -translate-x-1/2
                -translate-y-1/2
                -rotate-45
                bg-white
              "
            />
          </span>
        </button>
        </div>
      </div>

      {/* body — brutal stack, responsive, scrollable */}
      <div
        className="
          flex
          flex-1
          flex-col
          overflow-y-auto
          overscroll-contain
          px-4
          sm:px-6
          py-6
          sm:py-8
        "
      >
        <div
          className="
            mb-5
            flex
            items-center
            gap-3
          "
        >
          <span
            className="
              h-px
              flex-1
              bg-[#020F40]
              dark:bg-[#11DFF5]/30
            "
          />
          <span
            className="
              text-[11px]
              font-black
              tracking-[0.2em]
              uppercase
              text-[var(--text-secondary)]
            "
          >
            {site.ui.navTitle}
          </span>
          <span
            className="
              h-px
              flex-1
              bg-[#020F40]
              dark:bg-[#11DFF5]/30
            "
          />
        </div>

        <nav
          aria-label="Mobile primary"
          className="
            flex
            flex-col
            gap-3
            sm:gap-4
          "
        >
          {links.map((link, i) => {
            const active = pathname === link.href || (link.children && pathname?.startsWith(link.href));
            const hasChildren = Array.isArray(link.children) && link.children.length > 0;

            if (!hasChildren) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  style={{ transitionDelay: open ? `${i * 70}ms` : '0ms' }}
                  className={`
                  group
                  relative
                  flex
                  items-center
                  justify-between
                  gap-4
                  border-[4px]
                  px-5
                  sm:px-6
                  py-6
                  sm:py-7
                  transition-all
                  duration-500
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  ${open ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}
                  ${active ? 'border-[#020F40] bg-[#0D65EF] text-white shadow-[6px_6px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[6px_6px_0_0_#11DFF5]' : 'border-[#020F40] bg-[var(--bg-base)] text-[var(--text-primary)] shadow-[6px_6px_0_0_#020F40] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_0_#020F40] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none dark:border-[#11DFF5] dark:shadow-[6px_6px_0_0_#11DFF5] dark:hover:shadow-[4px_4px_0_0_#11DFF5]'}
                `}
                >
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate text-[22px] xs:text-[24px] sm:text-[28px] font-black tracking-[-0.02em] uppercase leading-none">{link.label}</span>
                    <span className={`truncate text-[11px] sm:text-[12px] font-semibold tracking-[0.12em] uppercase leading-none ${active ? 'text-white/80' : 'text-[var(--text-secondary)]'}`}>{link.desc}</span>
                  </span>
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center border-[3px] transition-colors ${active ? 'border-white bg-white text-[#0D65EF]' : 'border-[#020F40] bg-white text-[#020F40] group-hover:bg-[#0D65EF] group-hover:text-white group-hover:border-[#0D65EF] dark:border-[#11DFF5]'}`}>
                    <Arrow className="h-4 w-4" />
                  </span>
                </Link>
              );
            }

            return (
              <div
                key={link.href}
                style={{ transitionDelay: open ? `${i * 70}ms` : '0ms' }}
                className={`group relative flex flex-col gap-3 border-[4px] bg-[var(--bg-base)] p-3 shadow-[6px_6px_0_0_#020F40] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] dark:border-[#11DFF5] dark:shadow-[6px_6px_0_0_#11DFF5] ${open ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'} ${active ? 'border-[#020F40] bg-[#020F40] dark:bg-[#0B1220]' : 'border-[#020F40]'}`}
              >
                <div
                  className={`flex cursor-default select-none items-center justify-between gap-3 border-[3px] px-4 py-3 ${active ? 'border-[#11DFF5] bg-[#11DFF5] text-[#020F40]' : 'border-[#020F40] bg-white text-[#020F40] dark:border-[#11DFF5] dark:bg-transparent dark:text-white'}`}
                >
                  <span className="flex flex-col">
                    <span className="text-[16px] font-black uppercase tracking-[-0.02em] leading-none">{link.label}</span>
                    <span className={`text-[11px] font-semibold tracking-[0.12em] uppercase ${active ? 'text-[#020F40]/70' : 'text-[var(--text-secondary)]'}`}>{link.desc}</span>
                  </span>
                  <span className="text-[12px] font-black">▼</span>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {link.children.map((child) => {
                    const childActive = pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onClose}
                        className={`flex items-center justify-between gap-2 border-[3px] px-3 py-3 text-left ${childActive ? 'border-[#11DFF5] bg-[#11DFF5] text-[#020F40] shadow-[3px_3px_0_0_white]' : 'border-[#020F40]/15 bg-white text-[#020F40] hover:border-[#020F40] hover:bg-[#020F40] hover:text-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white dark:hover:text-[#020F40]'}`}
                      >
                        <span className="flex flex-col">
                          <span className="text-[13px] font-black uppercase leading-none">{child.label}</span>
                          <span className="mt-1 text-[10px] font-bold leading-none tracking-[0.08em] opacity-70">{child.desc}</span>
                        </span>
                        <span className="text-[11px]">→</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <Link
          href={ctaHref}
          onClick={onClose}
          className="
            group
            mt-6
            flex
            w-full
            items-center
            justify-center
            gap-3
            border-[4px]
            border-[#020F40]
            bg-[#0D65EF]
            px-6
            py-5
            sm:py-6
            text-[13px]
            sm:text-[14px]
            font-black
            tracking-[0.16em]
            uppercase
            text-white
            shadow-[6px_6px_0_0_#020F40]
            transition-all
            hover:translate-x-1
            hover:translate-y-1
            hover:shadow-[4px_4px_0_0_#020F40]
            active:translate-x-[6px]
            active:translate-y-[6px]
            active:shadow-none
            dark:border-[#11DFF5]
            dark:shadow-[6px_6px_0_0_#11DFF5]
            dark:hover:shadow-[4px_4px_0_0_#11DFF5]
          "
        >
          <span>
            {ctaLabel}
          </span>

          <Arrow
            className="
              h-4
              w-4
              transition-transform
              group-hover:translate-x-1
            "
          />
        </Link>

        <div
          className="
            mt-auto
            pt-8
            sm:pt-10
          "
        >
          <div
            className="
              flex
              flex-col
              sm:flex-row
              items-center
              justify-between
              gap-3
              border-[3px]
              border-[#020F40]
              bg-[#05070C]
              px-4
              py-3
              text-[10px]
              font-black
              tracking-[0.16em]
              uppercase
              text-[#81ABCA]
              dark:border-[#11DFF5]
            "
          >
            <span
              className="
                inline-flex
                items-center
                gap-2
              "
            >
              <span
                className="
                  h-2
                  w-2
                  shrink-0
                  rounded-full
                  bg-[#11DFF5]
                  shadow-[0_0_10px_#11DFF5]
                "
              />
              {site.ui.systemOperational}
            </span>

           
          </div>

          <div
            className="
              mt-4
              flex
              items-center
              justify-center
              gap-2
              text-[10px]
              font-black
              tracking-[0.2em]
              uppercase
              text-[#2E729F]
            "
          >
            <span
              className="
                h-px
                flex-1
                bg-[#020F40]
                dark:bg-[#11DFF5]/20
              "
            />
            {watermark}
            <span
              className="
                h-px
                flex-1
                bg-[#020F40]
                dark:bg-[#11DFF5]/20
              "
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN NAVBAR — LOGO HERO NO BORDERS, CENTERED NAV, CTA NEXT TO TOGGLE, RESPONSIVE FIXED
// ---------------------------------------------------------------------------

export function Navbar({ showClients = true, nav, cta, mark }) {
  const pathname = usePathname();
  const navLinks = Array.isArray(nav) && nav.length ? nav : NAV_LINKS;
  const links = navLinks.map((l) =>
    Array.isArray(l.children)
      ? { ...l, children: l.children.filter((c) => showClients || c.href !== '/work/clients') }
      : l
  );
  const ctaHref = (cta && cta.href) || CONTACT_HREF;
  const ctaLabel = (cta && cta.label) || site.cta.label;
  const watermark = mark || footer.watermark;
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrolled, hidden } = useScrollState(12);
  const headerRef = useRef(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024 && mobileOpen) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [mobileOpen]);

  const toggleMobile = useCallback(() => {
    setMobileOpen((v) => !v);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:border-[3px] focus:border-[#020F40] focus:bg-[#11DFF5] focus:px-4 focus:py-2 focus:text-[12px] focus:font-black focus:uppercase focus:tracking-[0.14em] focus:text-[#020F40]"
      >
        {site.ui.skipToContent}
      </a>
      <header
        ref={headerRef}
        className={`
          sticky
          top-0
          z-50
          w-full
          select-none
          font-grotesk
          transition-transform
          duration-300
          ease-out
          ${hidden && !mobileOpen ? '-translate-y-full' : 'translate-y-0'}
        `}
        role="banner"
      >
      {/* BRUTAL BAR — BIG, NO BORDERS/MARGINS, touches top+bottom, Space Grotesk core */}
      <nav
        aria-label="Primary"
        className={`
          relative
          flex
          w-full
          items-center
          gap-2
          sm:gap-4
          bg-[var(--bg-surface)]
          border-b-[4px]
          border-[#020F40]
          dark:border-[#11DFF5]
          pl-0
          pr-3
          sm:pr-4
          lg:pr-6
          xl:pr-8
          transition-all
          duration-300
          font-grotesk
          m-0
          rounded-none
          shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_0_rgba(2,15,64,0.04)]
          dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
          ${scrolled
            ? 'h-[92px] sm:h-[96px] lg:h-[108px]'
            : 'h-[104px] sm:h-[112px] lg:h-[124px]'
          }
        `}
      >
        {/* LEFT — LOGO HERO, EXTREME LEFT, NO PADDING, CONSUMES SPACE — EVEN MORE MASSIVE, BEAUTIFIED */}
        <Link
          href="/"
          onClick={closeMobile}
          aria-label={`${site.name} — home`}
          className="
            flex
            shrink-0
            items-center
            self-stretch
            m-0
            p-0
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#11DFF5]
            focus-visible:ring-offset-2
            focus-visible:ring-offset-[var(--bg-surface)]
            min-w-0
          "
        >
          <Image
            src="/thesoftwarebase.png"
            alt="The Software Base"
            width={900}
            height={216}
            priority
            sizes="(max-width: 380px) 90vw, (max-width: 640px) 84vw, (max-width: 1024px) 560px, 860px"
            className={`
              block
              w-auto
              max-w-[78vw]
              sm:max-w-none
              object-contain
              object-left
              select-none
              m-0
              p-0
              transition-all
              duration-300
              ${scrolled
                ? 'h-[84px] sm:h-[88px] lg:h-[100px] xl:h-[100px]'
                : 'h-[92px] sm:h-[96px] lg:h-[112px] xl:h-[116px]'
              }
            `}
          />
        </Link>

        {/* CENTER — NAVLINKS CENTERED */}
        <div
          className="
            hidden
            lg:flex
            flex-1
            items-center
            justify-center
            min-w-0
            px-4
            xl:px-8
          "
        >
          <div
            className="
              flex
              items-center
              justify-center
              gap-2
              xl:gap-3
            "
          >
            {links.map((link) => {
              const active = pathname === link.href || (link.children && pathname?.startsWith(link.href));
              return (
                <DesktopNavItem
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  isActive={active}
                  pathname={pathname}
                  children={link.children}
                />
              );
            })}
          </div>
        </div>

        {/* RIGHT — CTA NEXT TO TOGGLE, brutal core Space Grotesk */}
        <div
          className="
            hidden
            lg:flex
            shrink-0
            items-center
            gap-3
            xl:gap-4
            font-grotesk
          "
        >
          <Link
            href={ctaHref}
            className="
              group
              inline-flex
              items-center
              justify-center
              gap-2
              border-[4px]
              border-[#020F40]
              bg-[#020F40]
              px-7
              xl:px-8
              py-4
              xl:py-4
              text-[13px]
              xl:text-[13px]
              font-black
              tracking-[0.18em]
              uppercase
              leading-none
              text-white
              shadow-[5px_5px_0_0_#11DFF5]
              transition-all
              duration-200
              hover:translate-x-px
              hover:translate-y-px
              hover:shadow-[3px_3px_0_0_#11DFF5]
              active:translate-x-[5px]
              active:translate-y-[5px]
              active:shadow-none
              whitespace-nowrap
              dark:border-[#11DFF5]
              dark:bg-[#0D65EF]
              dark:shadow-[5px_5px_0_0_#11DFF5]
              font-grotesk
            "
          >
            <span>
              {ctaLabel}
            </span>

            <Arrow
              className="
                hidden
                xl:inline
                h-4
                w-4
                transition-transform
                group-hover:translate-x-0.5
              "
            />
          </Link>

          <ThemeToggle />
        </div>

        {/* MOBILE — toggle + hamburger, responsive fixed */}
        <div
          className="
            flex
            lg:hidden
            shrink-0
            items-center
            gap-2
            sm:gap-3
            ml-auto
          "
        >
          <span
            className="
              hidden
              xs:inline-flex
              lg:hidden
            "
          >
            <ThemeToggle />
          </span>

          <span
            className="
              inline-flex
              xs:hidden
            "
          >
            <ThemeToggle />
          </span>

          <button
            type="button"
            suppressHydrationWarning
            onClick={toggleMobile}
            aria-label={mobileOpen ? site.ui.closeNavigation : site.ui.openNavigation}
            aria-expanded={mobileOpen}
            aria-controls="mobile-drawer"
            className={`
              relative
              inline-flex
              h-[46px]
              w-[46px]
              sm:h-[52px]
              sm:w-[52px]
              shrink-0
              items-center
              justify-center
              border-[3px]
              sm:border-[4px]
              bg-[var(--bg-surface)]
              text-[var(--text-primary)]
              shadow-[3px_3px_0_0_#020F40]
              sm:shadow-[4px_4px_0_0_#020F40]
              transition-all
              duration-200
              hover:translate-x-px
              hover:translate-y-px
              hover:shadow-[2px_2px_0_0_#020F40]
              sm:hover:shadow-[3px_3px_0_0_#020F40]
              active:translate-x-[3px]
              active:translate-y-[3px]
              active:shadow-none
              dark:border-[#11DFF5]
              dark:shadow-[3px_3px_0_0_#11DFF5]
              sm:dark:shadow-[4px_4px_0_0_#11DFF5]
              ${mobileOpen
                ? 'border-[#020F40] bg-[#0D65EF] text-white shadow-[3px_3px_0_0_#020F40] sm:shadow-[4px_4px_0_0_#020F40] dark:border-[#11DFF5]'
                : 'border-[#020F40] dark:border-[#11DFF5]'
              }
            `}
          >
            <span
              className="
                relative
                flex
                h-[16px]
                sm:h-[18px]
                w-[20px]
                sm:w-[22px]
                flex-col
                items-center
                justify-between
              "
            >
              <span
                className={`
                  block
                  h-[3px]
                  w-full
                  bg-current
                  transition-all
                  duration-300
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  ${mobileOpen
                    ? 'translate-y-[6.5px] sm:translate-y-[7.5px] rotate-45'
                    : 'translate-y-0 rotate-0'
                  }
                `}
              />

              <span
                className={`
                  block
                  h-[3px]
                  w-full
                  bg-current
                  transition-all
                  duration-200
                  ${mobileOpen
                    ? 'opacity-0 scale-x-0'
                    : 'opacity-100 scale-x-100'
                  }
                `}
              />

              <span
                className={`
                  block
                  h-[3px]
                  w-full
                  bg-current
                  transition-all
                  duration-300
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  ${mobileOpen
                    ? '-translate-y-[6.5px] sm:-translate-y-[7.5px] -rotate-45'
                    : 'translate-y-0 rotate-0'
                  }
                `}
              />
            </span>
          </button>
        </div>
      </nav>
    </header>

      {/* FULLSCREEN MOBILE — whole screen, OUTSIDE header to avoid transform containing block squashing */}
      <FullscreenMobile
        open={mobileOpen}
        onClose={closeMobile}
        pathname={pathname}
        links={links}
        ctaHref={ctaHref}
        ctaLabel={ctaLabel}
        watermark={watermark}
      />
    </>
  );
}
