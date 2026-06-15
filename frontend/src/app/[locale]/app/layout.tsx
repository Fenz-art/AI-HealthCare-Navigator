import type { ReactNode } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { CommandPalette } from '@/components/command-palette';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <AppShell>
      {children}
      <CommandPalette />
    </AppShell>
  );
}
