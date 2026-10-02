import { getSection } from '@/lib/content';
import { contact } from '@/lib/site';
import { DocEditor } from '@/components/dashboard/doc-editor';

export const metadata = {
  title: `Dashboard — Contact`,
  robots: { index: false, follow: false },
};

const SPEC = [
  { type: 'section', label: 'Header + promise' },
  { type: 'text', path: ['kicker'], label: 'Kicker' },
  { type: 'text', path: ['promise'], label: 'Promise line' },
  { type: 'text', path: ['formKicker'], label: 'Form kicker' },
  { type: 'text', path: ['uplinkKicker'], label: 'Uplink kicker' },
  { type: 'text', path: ['stepsKicker'], label: 'Steps kicker' },
  { type: 'text', path: ['globeKicker'], label: 'Globe kicker' },
  { type: 'text', path: ['globeLive'], label: 'Globe — live' },
  { type: 'text', path: ['globeWaiting'], label: 'Globe — waiting' },
  { type: 'section', label: 'What happens next' },
  {
    type: 'objlist', path: ['steps'], label: 'Steps',
    fields: [{ key: 'n', label: 'No.' }, { key: 'text', label: 'Text', textarea: true }],
  },
  { type: 'section', label: 'Budgets' },
  { type: 'text', path: ['budgetsKicker'], label: 'Budgets kicker' },
  { type: 'text', path: ['budgetLabel'], label: 'Budget label' },
  { type: 'list', path: ['budgets'], label: 'Budget options' },
  { type: 'section', label: 'Buttons + states' },
  { type: 'text', path: ['submitLabel'], label: 'Submit' },
  { type: 'text', path: ['sendingLabel'], label: 'Sending' },
  { type: 'text', path: ['retryLabel'], label: 'Retry' },
  { type: 'text', path: ['newLabel'], label: 'New transmission' },
  { type: 'text', path: ['errorDesc'], label: 'Error description', textarea: true },
  { type: 'text', path: ['phoneError'], label: 'Phone error' },
  { type: 'pair', path: ['success', 'title'], label: 'Success title' },
  { type: 'text', path: ['success', 'desc'], label: 'Success description', textarea: true },
  { type: 'section', label: 'Location lines' },
  { type: 'text', path: ['locationAttached'], label: 'Attached' },
  { type: 'text', path: ['locationMissing'], label: 'Missing' },
  { type: 'text', path: ['locationEnable'], label: 'Enable CTA' },
  { type: 'text', path: ['locationLocating'], label: 'Locating…' },
  { type: 'text', path: ['locationRequired'], label: 'Required error', textarea: true },
  { type: 'text', path: ['countryCodeLabel'], label: 'Country-code label' },
];

export default async function DashboardContactPage() {
  const section = await getSection('contact');

  return (
    <div className="grid content-start gap-5">
      <div className="border-[4px] border-[#020F40] bg-[var(--bg-surface)] p-5 shadow-[6px_6px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[6px_6px_0_0_#11DFF5] sm:p-6">
        <span className="inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-[#11DFF5] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#020F40] dark:border-[#11DFF5]">
          Contact page + form + inbox validation
        </span>
        <h1 className="mt-3 text-[clamp(1.5rem,3.5vw,2.25rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-[#020F40] dark:text-white">
          Contact <span className="text-[#0D65EF] dark:text-[#11DFF5]">copy</span>
        </h1>
      </div>
      <DocEditor
        storageKey="contact"
        initial={section.data && typeof section.data === 'object' ? section.data : contact}
        source={section.source}
        updatedAt={section.updatedAt}
        spec={SPEC}
        note="Form fields and country codes are structural and stay in code — every word a visitor reads is editable here, including the validation errors the API returns."
        hideNav
      />
    </div>
  );
}
