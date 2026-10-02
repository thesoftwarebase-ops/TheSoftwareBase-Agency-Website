import Link from 'next/link';
import { dashboard } from '@/lib/site';
import { getSectionsStatus } from '@/lib/content';
import { connectToDatabase } from '@/lib/db';
import { ArrowRight, Inbox, Layers, Mail, Rocket, Shield, Search, TrendingUp, Users, Wrench, Zap } from 'lucide-react';

const ICONS = {
  hero: Zap,
  services: Layers,
  work: Rocket,
  process: Wrench,
  'why-us': Shield,
  faq: Search,
  contact: Mail,
  inquiries: Inbox,
  footer: TrendingUp,
};

export const metadata = {
  title: `Dashboard — Mission control`,
  robots: { index: false, follow: false },
};

function fmtDate(v) {
  if (!v) return '—';
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default async function DashboardPage() {
  const [statuses, counts, inquiries, metrics] = await Promise.all([
    getSectionsStatus(),
    (async () => {
      try {
        const { db } = await connectToDatabase();
        const [users, inquiriesCount, metricsCount, unread] = await Promise.all([
          db.collection('users').countDocuments(),
          db.collection('inquiries').countDocuments(),
          db.collection('metrics').countDocuments(),
          db.collection('inquiries').countDocuments({ read: { $ne: true } }),
        ]);
        return { users, inquiries: inquiriesCount, metrics: metricsCount, unread };
      } catch {
        return { users: 0, inquiries: 0, metrics: 0, unread: 0 };
      }
    })(),
    (async () => {
      try {
        const { db } = await connectToDatabase();
        return await db.collection('inquiries').find({}).sort({ createdAt: -1 }).limit(5).toArray();
      } catch {
        return [];
      }
    })(),
    (async () => {
      try {
        const { db } = await connectToDatabase();
        return await db.collection('metrics').find({}).sort({ createdAt: -1 }).limit(5).toArray();
      } catch {
        return [];
      }
    })(),
  ]);

  const live = statuses.filter((s) => s.source === 'db').length;
  const stats = [
    { label: 'Admins', value: String(counts.users) },
    { label: 'Sections live', value: `${live}/${statuses.length}` },
    { label: 'Inquiries', value: String(counts.inquiries) },
  ];

  return (
    <div className="grid content-start gap-6">
      {/* HEADER */}
      <div className="border-[4px] border-[#020F40] bg-[var(--bg-surface)] p-5 shadow-[6px_6px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[6px_6px_0_0_#11DFF5] sm:p-6">
        <span className="inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-[#11DFF5] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#020F40] dark:border-[#11DFF5]">
          <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#020F40]" />
          {dashboard.kicker} — live
        </span>
        <h1 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-[#020F40] dark:text-white">
          <span className="block">{dashboard.homeTitle[0]}</span>
          <span className="block text-[#0D65EF] dark:text-[#11DFF5]">{dashboard.homeTitle[1]}</span>
        </h1>
        <p className="mt-2 max-w-[560px] text-[13px] font-medium leading-relaxed text-[var(--text-secondary)] sm:text-[14px]">
          {dashboard.homeDesc}
        </p>
      </div>

      {/* LIVE STATS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="border-[4px] border-[#020F40] bg-[var(--bg-surface)] p-5 shadow-[4px_4px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[4px_4px_0_0_#11DFF5]">
            <h2 className="mb-2 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#0D65EF] dark:text-[#11DFF5]">
              <Users aria-hidden className="h-3 w-3" />
              {s.label}
            </h2>
            <p className="text-3xl font-black tabular-nums tracking-[-0.02em] text-[#020F40] dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* PAGES → SECTIONS — live source badges */}
      <div className="grid gap-6">
        {dashboard.groups.map((g, gi) => (
          <section key={g.page} aria-label={g.page}>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-[#020F40] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#11DFF5] dark:border-[#11DFF5]">
                {String(gi + 1).padStart(2, '0')} — {g.page}
              </h2>
              <span aria-hidden className="hidden h-px flex-1 bg-[#020F40]/10 dark:bg-white/10 sm:block" />
              {g.href && (
                <Link
                  href={g.href}
                  className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#0D65EF] hover:text-[#020F40] dark:text-[#11DFF5] dark:hover:text-white"
                >
                  View live <ArrowRight aria-hidden className="h-3 w-3" />
                </Link>
              )}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {g.items.map((id) => {
                const s = dashboard.sections.find((x) => x.id === id);
                if (!s) return null;
                const Icon = ICONS[s.id] || Zap;
                const statusKey = s.id === 'why-us' ? 'whyUs' : (s.id === 'home' || s.id.endsWith('-copy') ? 'pages' : s.id);
                const st = statuses.find((x) => x.key === statusKey);
                const isLive = st?.source === 'db';
                // Editors ship incrementally — unbuilt sections render inert,
                // never a link to a missing page.
                if (!s.ready) {
                  return (
                    <span
                      key={s.id}
                      aria-disabled="true"
                      title={dashboard.soonLabel}
                      className="relative flex min-w-0 cursor-not-allowed items-center gap-4 overflow-hidden border-[4px] border-dashed border-[#020F40]/25 bg-[var(--bg-surface)] p-5 opacity-70 dark:border-white/20"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center border-[3px] border-[#020F40]/20 text-[var(--text-secondary)] dark:border-white/20">
                        <Icon aria-hidden className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] font-black uppercase tracking-[-0.01em] text-[#020F40] dark:text-white">
                          {s.label}
                        </span>
                        <span className="mt-0.5 block truncate text-[12px] font-medium text-[var(--text-secondary)]">{s.desc}</span>
                      </span>
                      <span className="shrink-0 border-[2px] border-[#020F40]/30 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.12em] text-[var(--text-secondary)] dark:border-white/20">
                        {dashboard.soonLabel}
                      </span>
                    </span>
                  );
                }
                return (
                  <Link
                    key={s.id}
                    href={s.href}
                    className="group relative flex min-w-0 items-center gap-4 overflow-hidden border-[4px] border-[#020F40] bg-[var(--bg-surface)] p-5 shadow-[5px_5px_0_0_#020F40] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#0D65EF] dark:border-[#11DFF5] dark:shadow-[5px_5px_0_0_#11DFF5]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center border-[3px] border-[#020F40] bg-[#020F40] text-[#11DFF5] dark:border-[#11DFF5]">
                      <Icon aria-hidden className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-black uppercase tracking-[-0.01em] text-[#020F40] dark:text-white">
                        {s.label}
                      </span>
                      <span className="mt-0.5 block truncate text-[12px] font-medium text-[var(--text-secondary)]">{s.desc}</span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 border-[2px] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.1em] ${isLive ? 'border-[#0D65EF] bg-[#0D65EF]/10 text-[#0D65EF] dark:border-[#11DFF5] dark:bg-[#11DFF5]/10 dark:text-[#11DFF5]' : 'border-[#020F40]/20 text-[var(--text-secondary)] dark:border-white/20'}`}>
                          <span aria-hidden className={`h-1 w-1 rounded-full ${isLive ? 'animate-pulse bg-current' : 'bg-current opacity-50'}`} />
                          {isLive ? 'database' : 'defaults'}
                        </span>
                        {st?.updatedAt && (
                          <span className="font-mono text-[10px] text-[var(--text-secondary)]">{fmtDate(st.updatedAt)}</span>
                        )}
                      </span>
                    </span>
                    <ArrowRight aria-hidden className="h-4 w-4 shrink-0 text-[#020F40]/30 transition-transform group-hover:translate-x-1 group-hover:text-[#0D65EF] dark:text-white/30 dark:group-hover:text-[#11DFF5]" />
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* INBOX — latest inquiries, live */}
      <div className="border-[4px] border-[#020F40] bg-[var(--bg-surface)] p-5 shadow-[4px_4px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[4px_4px_0_0_#11DFF5] sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h2 className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#0D65EF] dark:text-[#11DFF5]">
            <Inbox aria-hidden className="h-3.5 w-3.5" />
            Inbox
          </h2>
          {counts.unread > 0 && (
            <span className="inline-flex items-center border-[2px] border-[#020F40] bg-[#11DFF5] px-2 py-0.5 text-[10px] font-black text-[#020F40] dark:border-[#11DFF5]">
              {counts.unread} new
            </span>
          )}
          <span className="ml-auto font-mono text-[10px] text-[var(--text-secondary)]">{counts.inquiries} total</span>
          <Link
            href="/dashboard/inquiries"
            className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#0D65EF] hover:text-[#020F40] dark:text-[#11DFF5] dark:hover:text-white"
          >
            Open inbox <ArrowRight aria-hidden className="h-3 w-3" />
          </Link>
        </div>
        {inquiries.length === 0 ? (
          <p className="border-[3px] border-dashed border-[#020F40]/20 px-4 py-6 text-center text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)] dark:border-white/15">
            No inquiries yet — new contact submissions land here live
          </p>
        ) : (
          <div className="space-y-3">
            {inquiries.map((q) => (
              <div key={String(q._id)} className="border-[3px] border-[#020F40]/10 bg-[var(--bg-base)] px-4 py-3 dark:border-white/10">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="font-bold text-[#020F40] dark:text-white">{q.name}</p>
                  <p className="font-mono text-[11px] text-[var(--text-secondary)]">{q.email}</p>
                  <p className="ml-auto font-mono text-[10px] text-[var(--text-secondary)]">{fmtDate(q.createdAt)}</p>
                </div>
                <p className="mt-1 line-clamp-2 break-words text-[13px] text-[var(--text-secondary)]">{q.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
