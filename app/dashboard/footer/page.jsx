import { getSection } from '@/lib/content';
import { footer } from '@/lib/site';
import { DocEditor } from '@/components/dashboard/doc-editor';

export const metadata = {
  title: `Dashboard — Footer`,
  robots: { index: false, follow: false },
};

const SPEC = [
  { type: 'section', label: 'Top line' },
  { type: 'text', path: ['tagline'], label: 'Tagline', textarea: true },
  { type: 'text', path: ['status'], label: 'Status line' },
  { type: 'text', path: ['statusShort'], label: 'Status short' },
  { type: 'section', label: 'MSME / Govt verified' },
  { type: 'text', path: ['msme', 'label'], label: 'Badge label' },
  { type: 'text', path: ['msme', 'number'], label: 'Udyam registration number' },
  { type: 'section', label: 'Link columns' },
  { type: 'text', path: ['cols', 0, 'title'], label: 'Column 1 title' },
  {
    type: 'objlist', path: ['cols', 0, 'links'], label: 'Column 1 links',
    fields: [{ key: 'label', label: 'Label' }, { key: 'href', label: 'Href' }],
  },
  { type: 'text', path: ['cols', 1, 'title'], label: 'Column 2 title' },
  {
    type: 'objlist', path: ['cols', 1, 'links'], label: 'Column 2 links',
    fields: [{ key: 'label', label: 'Label' }, { key: 'href', label: 'Href' }],
  },
  { type: 'section', label: 'Manifesto' },
  { type: 'text', path: ['manifesto', 'kicker'], label: 'Kicker' },
  { type: 'text', path: ['manifesto', 'title'], label: 'Title' },
  { type: 'text', path: ['manifesto', 'desc'], label: 'Description', textarea: true },
  { type: 'text', path: ['manifesto', 'badge'], label: 'Badge' },
  { type: 'section', label: 'Bottom bar' },
  { type: 'text', path: ['legal'], label: 'Legal line' },
  { type: 'text', path: ['watermark'], label: 'Watermark (also in nav)' },
  { type: 'text', path: ['remoteNote'], label: 'Remote note' },
  { type: 'text', path: ['shipNote'], label: 'Ship note (badge pill)' },
  { type: 'text', path: ['builtNote'], label: 'Built note' },
  { type: 'text', path: ['craftedPrefix'], label: 'Crafted prefix' },
  { type: 'text', path: ['backToTop'], label: 'Back-to-top label' },
];

export default async function DashboardFooterPage() {
  const section = await getSection('footer');
  // Backfill lib defaults: a doc saved before a key existed (e.g. msme)
  // would otherwise show empty fields. DB values always win when present.
  const db = section.data && typeof section.data === 'object' ? section.data : {};
  const dbMsme = db.msme && typeof db.msme === 'object' ? db.msme : {};
  const dbManifesto = db.manifesto && typeof db.manifesto === 'object' ? db.manifesto : {};
  const initial = {
    ...footer,
    ...db,
    msme: { ...footer.msme, ...dbMsme },
    manifesto: { ...footer.manifesto, ...dbManifesto },
  };

  return (
    <div className="grid content-start gap-5">
      <div className="border-[4px] border-[#020F40] bg-[var(--bg-surface)] p-5 shadow-[6px_6px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[6px_6px_0_0_#11DFF5] sm:p-6">
        <span className="inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-[#11DFF5] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#020F40] dark:border-[#11DFF5]">
          Global footer on every page
        </span>
        <h1 className="mt-3 text-[clamp(1.5rem,3.5vw,2.25rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-[#020F40] dark:text-white">
          Footer <span className="text-[#0D65EF] dark:text-[#11DFF5]">copy</span>
        </h1>
      </div>
      <DocEditor
        storageKey="footer"
        initial={initial}
        source={section.source}
        updatedAt={section.updatedAt}
        spec={SPEC}
      />
    </div>
  );
}
