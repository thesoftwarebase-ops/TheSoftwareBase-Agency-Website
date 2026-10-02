import { redirect } from 'next/navigation';

export const metadata = {
  title: `Dashboard — Work`,
  robots: { index: false, follow: false },
};

// The work console is split: own products and client work live on
// separate pages sharing one list. This hub just forwards.
export default function DashboardWorkPage() {
  redirect('/dashboard/work/products');
}
