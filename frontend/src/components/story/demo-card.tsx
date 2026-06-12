"use client";

import { cn } from "@/lib/utils";

type DemoCardProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
};

export function DemoCard({
  eyebrow,
  title,
  subtitle,
  children,
  className,
  footer,
}: DemoCardProps) {
  return (
    <div className={cn("mk-demo-card", className)}>
      <div className="mk-demo-header">
        {eyebrow ? <p className="mk-mono mb-2">{eyebrow}</p> : null}
        <h3 className="font-display text-xl font-bold tracking-tight text-[var(--mk-text)] sm:text-2xl">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-1.5 text-sm text-[var(--mk-text-secondary)]">{subtitle}</p>
        ) : null}
      </div>
      <div className="mk-demo-body">{children}</div>
      {footer ? (
        <div className="border-t mk-hairline px-5 py-3 sm:px-7">{footer}</div>
      ) : null}
    </div>
  );
}
