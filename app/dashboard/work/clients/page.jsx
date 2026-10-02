import Link from 'next/link';
import { getSection } from '@/lib/content';
import { WorkEditor } from '@/components/dashboard/work-editor';
import { WorkVisibility } from '@/components/dashboard/work-visibility';

export const metadata = {
  title: `Dashboard — Client work`,
  robots: { index: false, follow: false },
};

export default async function DashboardClientWorkPage() {
  const section = await getSection('workCases');
  const vis = await getSection('workVisibility');

  return (
    <div className="grid content-start gap-5">
      <div className="border-[4px] border-[#020F40] bg-[var(--bg-surface)] p-5 shadow-[6px_6px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[6px_6px_0_0_#11DFF5] sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-[#11DFF5] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#020F40] dark:border-[#11DFF5]">
            Work — Client work
          </span>
          <Link
            href="/dashboard/work/products"
            className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#0D65EF] hover:text-[#020F40] dark:text-[#11DFF5] dark:hover:text-white"
          >
            → Own products
          </Link>
        </div>
        <h1 className="mt-3 text-[clamp(1.5rem,3.5vw,2.25rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-[#020F40] dark:text-white">
          Client <span className="text-[#0D65EF] dark:text-[#11DFF5]">work</span>
        </h1>
      </div>
      <WorkVisibility
        initial={vis?.data && typeof vis.data === 'object' ? vis.data : { clientsEnabled: false }}
        source={vis?.source}
        updatedAt={vis?.updatedAt}
      />
      <WorkEditor
        initial={Array.isArray(section.data) ? section.data : []}
        source={section.source}
        updatedAt={section.updatedAt}
        kindFilter="client"
      />
    </div>
  );
}
