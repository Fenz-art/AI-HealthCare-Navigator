import type { ReactNode } from 'react';

interface SessionLayoutProps {
  children: ReactNode;
}

export default function SessionLayout({ children }: SessionLayoutProps) {
  return children;
}
