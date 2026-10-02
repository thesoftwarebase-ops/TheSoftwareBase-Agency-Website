import { getSection } from '@/lib/content';
import { site } from '@/lib/site';
import { DocEditor } from '@/components/dashboard/doc-editor';

export const metadata = {
  title: `Dashboard — Site & nav`,
  robots: { index: false, follow: false },
};

const SPEC = [
  { type: 'section', label: 'Brand + SEO' },
  { type: 'text', path: ['name'], label: 'Site name' },
  { type: 'text', path: ['shortName'], label: 'Short name' },
  { type: 'text', path: ['title'], label: 'Default title (SEO)' },
  { type: 'text', path: ['description'], label: 'Description (SEO)', textarea: true },
  { type: 'text', path: ['url'], label: 'Canonical URL' },
  { type: 'list', path: ['keywords'], label: 'Keywords' },
  { type: 'section', label: 'Contact channels' },
  { type: 'text', path: ['email'], label: 'Email' },
  { type: 'section', label: 'Main CTA' },
  { type: 'cta', path: ['cta'], label: 'Site CTA' },
  { type: 'section', label: 'Navigation' },
  {
    type: 'objlist', path: ['nav'], label: 'Nav links',
    fields: [{ key: 'label', label: 'Label' }, { key: 'href', label: 'Href' }, { key: 'desc', label: 'Description' }],
  },
];

export default async function DashboardSitePage() {
  const section = await getSection('site');

  return (
    <div className="grid content-start gap-5">
      <div className="border-[4px] border-[#020F40] bg-[var(--bg-surface)] p-5 shadow-[6px_6px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[6px_6px_0_0_#11DFF5] sm:p-6">
        <span className="inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-[#11DFF5] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#020F40] dark:border-[#11DFF5]">
          Brand, SEO, nav, channels
        </span>
        <h1 className="mt-3 text-[clamp(1.5rem,3.5vw,2.25rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-[#020F40] dark:text-white">
          Site <span className="text-[#0D65EF] dark:text-[#11DFF5]">& nav</span>
        </h1>
      </div>
      <DocEditor
        storageKey="site"
        initial={section.data && typeof section.data === 'object' ? section.data : site}
        source={section.source}
        updatedAt={section.updatedAt}
        spec={SPEC}
        note="The Work dropdown, theme labels and legal boilerplate stay in code — brand, SEO, nav links and contact channels are editable here and go live everywhere."
      />
    </div>
  );
}
