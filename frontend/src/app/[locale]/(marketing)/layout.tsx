import type { ReactNode } from 'react';
import { MarketingShell } from '@/components/layout/marketing-shell';

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <MarketingShell>
      {children}
    </MarketingShell>
  );
}
