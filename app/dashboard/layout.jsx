import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';
import { site, dashboard, auth as authCopy } from '@/lib/site';
import { Sidebar } from '@/components/dashboard/sidebar';

export const metadata = {
  robots: { index: false, follow: false },
};

// Real-time console: never prerender — fresh data on every load.
export const dynamic = 'force-dynamic';

async function logout() {
  'use server';
  await signOut({ redirectTo: '/login' });
}

export default async function DashboardLayout({ children }) {
  const session = await auth();
  if (!session) redirect('/login');

  return (
    <div className="min-h-screen bg-[var(--bg-base)] font-grotesk">
      <div aria-hidden className="h-[5px] w-full bg-gradient-to-r from-[#0D65EF] via-[#11DFF5] to-[#0D65EF]" />
      <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:gap-8 lg:px-8">
        <Sidebar
          siteName={site.shortName}
          kicker={dashboard.kicker}
          email={session.user?.email || ''}
          sections={dashboard.sections}
          groups={dashboard.groups}
          logoutLabel={authCopy.logoutLabel}
          backLabel={authCopy.backLabel}
          onLogout={logout}
        />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
