'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { auth as authCopy } from '@/lib/site';
import { ArrowRight, Shield } from 'lucide-react';

function LoginFormInner() {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get('callbackUrl') || '/dashboard';
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setError('');
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await signIn('credentials', {
        email: String(data.email || ''),
        password: String(data.password || ''),
        redirect: false,
        callbackUrl,
      });
      if (!res || res.error) {
        setStatus('error');
        setError(authCopy.errorInvalid);
        return;
      }
      router.push(res.url || callbackUrl);
      router.refresh();
    } catch {
      setStatus('error');
      setError(authCopy.errorGeneric);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label htmlFor="login-email" className="flex min-w-0 flex-col gap-1.5">
        <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#020F40] dark:text-white">
          <span aria-hidden className="text-[#0D65EF] dark:text-[#11DFF5]">01</span>
          {authCopy.emailLabel}
        </span>
        <input
          suppressHydrationWarning
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={status === 'sending'}
          placeholder="admin@thesoftwarebase.com"
          className="min-w-0 border-[3px] border-[#020F40] bg-white px-4 py-3 text-[14px] font-medium text-[#020F40] outline-none transition-all duration-200 placeholder:text-[#020F40]/35 focus:border-[#0D65EF] focus:shadow-[4px_4px_0_0_#0D65EF] disabled:opacity-60 dark:border-[#11DFF5] dark:bg-[#0B1220] dark:text-white dark:placeholder:text-white/30 dark:focus:shadow-[4px_4px_0_0_#11DFF5]"
        />
      </label>
      <label htmlFor="login-password" className="flex min-w-0 flex-col gap-1.5">
        <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#020F40] dark:text-white">
          <Shield aria-hidden className="h-3 w-3 text-[#0D65EF] dark:text-[#11DFF5]" />
          {authCopy.passwordLabel}
        </span>
        <input
          suppressHydrationWarning
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          disabled={status === 'sending'}
          placeholder="••••••••••••"
          className="min-w-0 border-[3px] border-[#020F40] bg-white px-4 py-3 text-[14px] font-medium text-[#020F40] outline-none transition-all duration-200 placeholder:text-[#020F40]/35 focus:border-[#0D65EF] focus:shadow-[4px_4px_0_0_#0D65EF] disabled:opacity-60 dark:border-[#11DFF5] dark:bg-[#0B1220] dark:text-white dark:placeholder:text-white/30 dark:focus:shadow-[4px_4px_0_0_#11DFF5]"
        />
      </label>
      {status === 'error' && (
        <p role="alert" className="border-[3px] border-[#020F40] bg-[#020F40] px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-white dark:border-[#11DFF5]">
          {error || authCopy.errorGeneric}
        </p>
      )}
      <button
        type="submit"
        suppressHydrationWarning
        disabled={status === 'sending'}
        className="group mt-2 inline-flex min-h-14 items-center justify-center gap-3 border-[4px] border-[#020F40] bg-[#0D65EF] px-8 py-4 text-[13px] font-black uppercase tracking-[0.16em] text-white shadow-[5px_5px_0_0_#020F40] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#020F40] disabled:cursor-wait disabled:opacity-70 dark:border-[#11DFF5] dark:bg-[#11DFF5] dark:text-[#020F40] dark:shadow-[5px_5px_0_0_white] dark:hover:shadow-[7px_7px_0_0_white]"
      >
        {status === 'sending' ? authCopy.sendingLabel : authCopy.submitLabel}
        <span className="flex h-6 w-6 items-center justify-center bg-white text-[#0D65EF] transition-transform duration-200 group-hover:translate-x-1 dark:bg-[#020F40] dark:text-[#11DFF5]">
          <ArrowRight aria-hidden className="h-3.5 w-3.5" />
        </span>
      </button>
    </form>
  );
}

export function LoginForm() {
  return (
    <Suspense>
      <LoginFormInner />
    </Suspense>
  );
}
