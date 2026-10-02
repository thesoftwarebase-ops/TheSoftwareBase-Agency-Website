'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/footer';

export function FooterWrapper({ foot, brand }) {
  const pathname = usePathname();

  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/login')) {
    return null;
  }

  return <Footer data={foot} brand={brand} />;
}
