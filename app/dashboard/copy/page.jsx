import { redirect } from 'next/navigation';

export const metadata = {
  title: `Dashboard — Page copy`,
  robots: { index: false, follow: false },
};

// Page copy moved into its owners (Services, Work, Process, Why-us,
// Contact, Home). This route just forwards to the home copy section.
export default function DashboardCopyPage() {
  redirect('/dashboard/home');
}
