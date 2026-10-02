import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth as authLib, site } from '@/lib/site';
import { auth } from '@/auth';
import { NavbarWrapper } from '@/components/navbar-wrapper';
import { LoginForm } from '@/components/auth/login-form';
import { Shield } from 'lucide-react';

export const metadata = {
  title: `Login — ${site.name}`,
  description: authLib.loginDesc,
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-[var(--bg-base)] font-grotesk">
      <NavbarWrapper />
      <main id="main-content" className="mx-auto max-w-[560px] px-4 sm:px-6 py-12 sm:py-16">
        <div className="relative overflow-hidden border-[4px] border-[#020F40] bg-[var(--bg-surface)] shadow-[8px_8px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[8px_8px_0_0_#11DFF5]">
          <div aria-hidden className="h-[5px] w-full bg-gradient-to-r from-[#0D65EF] via-[#11DFF5] to-[#0D65EF]" />
          <div className="flex items-center gap-3 border-b-[4px] border-[#020F40] bg-[#020F40] px-5 py-3.5 dark:border-[#11DFF5] dark:bg-[#0B1220] sm:px-7">
            <Shield aria-hidden className="h-4 w-4 text-[#11DFF5]" />
            <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#11DFF5]">
              {authLib.loginKicker}
            </span>
          </div>
          <div className="p-5 sm:p-7">
            <h1 className="text-[clamp(2rem,5vw,2.75rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-[#020F40] dark:text-white">
              <span className="block">{authLib.loginTitle[0]}</span>
              <span className="block text-[#0D65EF] dark:text-[#11DFF5]">{authLib.loginTitle[1]}</span>
            </h1>
            <p className="mt-3 max-w-[480px] border-l-[4px] border-[#0D65EF] pl-4 text-[13px] font-medium leading-relaxed text-[var(--text-secondary)] dark:border-[#11DFF5] sm:text-[14px]">
              {authLib.loginDesc}
            </p>
            <div className="mt-6">
              <LoginForm />
            </div>
            <div className="mt-5 border-t-[3px] border-[#020F40]/10 pt-4 text-center dark:border-white/10">
              <Link
                href="/"
                className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--text-secondary)] hover:text-[#0D65EF] dark:hover:text-[#11DFF5]"
              >
                ← {authLib.backLabel}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
