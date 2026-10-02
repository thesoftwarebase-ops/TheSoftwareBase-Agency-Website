import { connectToDatabase } from '@/lib/db';
import { Inbox } from '@/components/dashboard/inbox';

export const metadata = {
  title: `Dashboard — Inquiries`,
  robots: { index: false, follow: false },
};

export default async function DashboardInquiriesPage() {
  let items = [];
  try {
    const { db } = await connectToDatabase();
    const docs = await db.collection('inquiries').find({}).sort({ createdAt: -1 }).limit(200).toArray();
    items = docs.map((d) => ({ ...d, _id: String(d._id) }));
  } catch {
    items = [];
  }

  return (
    <div className="grid content-start gap-5">
      <div className="border-[4px] border-[#020F40] bg-[var(--bg-surface)] p-5 shadow-[6px_6px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[6px_6px_0_0_#11DFF5] sm:p-6">
        <span className="inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-[#11DFF5] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#020F40] dark:border-[#11DFF5]">
          Every contact submission
        </span>
        <h1 className="mt-3 text-[clamp(1.5rem,3.5vw,2.25rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-[#020F40] dark:text-white">
          Inbox <span className="text-[#0D65EF] dark:text-[#11DFF5]">({items.filter((q) => !q.read).length} new)</span>
        </h1>
      </div>
      <Inbox initial={items} />
    </div>
  );
}
