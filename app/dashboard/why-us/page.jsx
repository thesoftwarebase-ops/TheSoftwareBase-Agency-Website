import { getSection } from '@/lib/content';
import { whyUs } from '@/lib/site';
import { DocEditor } from '@/components/dashboard/doc-editor';

export const metadata = {
  title: `Dashboard — Why us`,
  robots: { index: false, follow: false },
};

const SPEC = [
  { type: 'section', label: 'Reasons' },
  {
    type: 'objlist', path: ['reasons'], label: 'Reasons',
    fields: [{ key: 'n', label: 'No.' }, { key: 'title', label: 'Title' }, { key: 'desc', label: 'Description', textarea: true }],
  },
  { type: 'section', label: 'Stats' },
  {
    type: 'objlist', path: ['stats'], label: 'Stats',
    fields: [{ key: 'v', label: 'Value' }, { key: 'k', label: 'Label' }],
  },
  { type: 'section', label: 'Them vs us' },
  { type: 'list', path: ['compare', 'them'], label: 'Them' },
  { type: 'list', path: ['compare', 'us'], label: 'Us' },
  { type: 'text', path: ['compare', 'badge'], label: 'Compare badge' },
];

export default async function DashboardWhyUsPage() {
  const section = await getSection('whyUs');

  return (
    <div className="grid content-start gap-5">
      <div className="border-[4px] border-[#020F40] bg-[var(--bg-surface)] p-5 shadow-[6px_6px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[6px_6px_0_0_#11DFF5] sm:p-6">
        <span className="inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-[#11DFF5] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#020F40] dark:border-[#11DFF5]">
          Why-us page + Home block
        </span>
        <h1 className="mt-3 text-[clamp(1.5rem,3.5vw,2.25rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-[#020F40] dark:text-white">
          Why <span className="text-[#0D65EF] dark:text-[#11DFF5]">us</span>
        </h1>
      </div>
      <DocEditor
        storageKey="whyUs"
        initial={section.data && typeof section.data === 'object' ? section.data : whyUs}
        source={section.source}
        updatedAt={section.updatedAt}
        spec={SPEC}
        note="The proof itself: reasons, stats, and the them-vs-us table. Headers live under Why-us copy."
      />
    </div>
  );
}
