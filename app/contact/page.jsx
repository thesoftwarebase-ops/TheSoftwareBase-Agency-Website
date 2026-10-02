import { NavbarWrapper } from '@/components/navbar-wrapper';
import { site, contact, pages } from '@/lib/site';
import { getSection, withFallback } from '@/lib/content';
import { ContactForm } from '@/components/contact/contact-form';
import { UplinkMonitor } from '@/components/contact/uplink';
import { Smooth } from '@/components/contact/smooth';
import { Clock3 } from 'lucide-react';

export async function generateMetadata() {
  const [copySection, brandSection] = await Promise.all([getSection('pages'), getSection('site')]);
  const copy = withFallback(pages, copySection.data);
  const brand = brandSection.data && typeof brandSection.data === 'object' ? brandSection.data : site;
  return {
    title: `Contact — ${brand.name}`,
    description: copy.contact.desc,
    alternates: { canonical: `${brand.url}/contact` },
    openGraph: {
      title: `Contact — ${brand.name}`,
      description: copy.contact.desc,
      url: `${brand.url}/contact`,
      siteName: brand.name,
      type: 'website',
      images: [{ url: '/home-hero.png', width: 1200, height: 630, alt: `Contact — ${brand.name}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Contact — ${brand.name}`,
      description: copy.contact.desc,
      images: ['/home-hero.png'],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ContactPage() {
  const [tSection, copySection, brandSection] = await Promise.all([
    getSection('contact'),
    getSection('pages'),
    getSection('site'),
  ]);
  const t = tSection.data && typeof tSection.data === 'object' ? tSection.data : contact;
  const copy = withFallback(pages, copySection.data);
  const cp = copy.contact;
  const brand = brandSection.data && typeof brandSection.data === 'object' ? brandSection.data : site;
  return (
    <div className="min-h-screen bg-[var(--bg-base)] font-grotesk">
      <NavbarWrapper />
      <style>{`
        .contact-rise { opacity: 0; transform: translateY(26px); animation: contact-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes contact-rise { to { opacity: 1; transform: translateY(0); } }
        .contact-field { transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease; }
        .contact-field:focus { transform: translateY(-1px); }
        .toast-in { animation: toast-in 0.35s cubic-bezier(0.22, 1, 0.36, 1); }
        @keyframes toast-in { from { opacity: 0; transform: translateY(14px) scale(0.98); } }
        @media (prefers-reduced-motion: reduce) {
          .contact-rise { opacity: 1; transform: none; animation: none; }
          .contact-field:focus { transform: none; }
          .toast-in { animation: none; }
        }
      `}</style>

      {/* STATUS BAR — compact entry with H1 for SEO */}
      <div className="relative border-b-[4px] border-[#020F40] bg-[#C6EAF4] dark:border-[#11DFF5] dark:bg-[#020F40]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(2,15,64,0.07)_1px,transparent_1px)] bg-[size:28px_28px] dark:bg-[linear-gradient(to_right,rgba(17,223,245,0.07)_1px,transparent_1px)]"
        />
        <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-[4px] w-full bg-gradient-to-r from-[#0D65EF] via-[#11DFF5] to-[#0D65EF]" />
        <div className="contact-rise relative mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 border-[3px] border-[#020F40] bg-[#11DFF5] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#020F40] shadow-[2px_2px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[2px_2px_0_0_white]">
            <span aria-hidden className="h-1.5 w-1.5 animate-pulse bg-[#020F40]" />
            {t.kicker}
          </span>
          <h1 className="min-w-0 flex-1 break-words text-[15px] font-black uppercase leading-none tracking-[-0.01em] text-[#020F40] dark:text-white sm:text-[17px]">
            {cp.title[0]}{' '}
            <span className="text-[#0D65EF] dark:text-[#11DFF5]">{cp.title[1]}</span>
          </h1>
          <span className="hidden items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#020F40]/60 dark:text-white/60 md:inline-flex">
            <Clock3 aria-hidden className="h-3.5 w-3.5 text-[#0D65EF] dark:text-[#11DFF5]" />
            {t.promise}
          </span>
        </div>
      </div>

      <Smooth>
        <main id="main-content" className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <p
            className="contact-rise mx-auto mt-8 max-w-[720px] border-l-[5px] border-[#0D65EF] bg-[var(--bg-surface)] py-3 pl-5 pr-4 text-center text-[14px] font-medium leading-relaxed text-[var(--text-secondary)] shadow-[4px_4px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[4px_4px_0_0_#11DFF5] sm:text-[15px]"
            style={{ animationDelay: '90ms' }}
          >
            {cp.desc}
          </p>

          <div className="mt-8 grid gap-6 pb-14 lg:grid-cols-12 lg:gap-8">
            {/* FORM MACHINE — fields, budget, location-as-words, submit */}
            <div
              className="contact-rise relative scroll-mt-24 overflow-hidden border-[4px] border-[#020F40] bg-[var(--bg-surface)] shadow-[8px_8px_0_0_#020F40] dark:border-[#11DFF5] dark:shadow-[8px_8px_0_0_#11DFF5] lg:col-span-7"
              style={{ animationDelay: '160ms' }}
            >
              <div aria-hidden className="h-[5px] w-full bg-gradient-to-r from-[#0D65EF] via-[#11DFF5] to-[#0D65EF]" />
              <div className="flex flex-wrap items-center gap-3 border-b-[4px] border-[#020F40] bg-[#020F40] px-5 py-3.5 dark:border-[#11DFF5] dark:bg-[#0B1220] sm:px-7">
                <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#11DFF5]">
                  <span aria-hidden className="h-2 w-2 animate-pulse bg-[#11DFF5]" />
                  {t.formKicker}
                </span>
                <span aria-hidden className="hidden h-px flex-1 bg-white/10 sm:block" />
                <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/50">
                  {String(t.fields.length + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="p-5 sm:p-7">
                <ContactForm t={t} />
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t-[3px] border-[#020F40]/10 px-5 py-3.5 dark:border-white/10 sm:px-7">
                <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0D65EF] dark:bg-[#11DFF5]" />
                <span className="min-w-0 flex-1 break-words text-[10px] font-black uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                  {t.promise}
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#0D65EF] dark:text-[#11DFF5]">
                  {brand.shortName}
                </span>
              </div>
            </div>

            {/* UPLINK RAIL — live radar + promise */}
            <div
              className="contact-rise grid content-start gap-6 lg:col-span-5"
              style={{ animationDelay: '240ms' }}
            >
              <UplinkMonitor
                kicker={t.uplinkKicker}
                liveLabel={t.globeLive}
                waitingLabel={t.globeWaiting}
                ringText={`${brand.name} • ${t.kicker} • ${t.promise} • `}
              />
              <div className="flex min-w-0 items-center gap-3 border-[4px] border-[#020F40] bg-[#020F40] px-4 py-3.5 shadow-[5px_5px_0_0_#0D65EF] dark:border-[#11DFF5] dark:shadow-[5px_5px_0_0_#11DFF5] sm:px-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border-[3px] border-[#11DFF5] bg-[#11DFF5] text-[#020F40]">
                  <Clock3 aria-hidden className="h-4 w-4" />
                </span>
                <span className="min-w-0 break-words text-[12px] font-black uppercase tracking-[0.1em] text-[#11DFF5]">
                  {t.promise}
                </span>
              </div>
            </div>
          </div>
        </main>
      </Smooth>
    </div>
  );
}
