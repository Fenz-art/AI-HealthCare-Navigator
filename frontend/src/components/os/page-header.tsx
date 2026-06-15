type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

/**
 * NATURAL SPRINT — Page Header
 * Lavender eyebrow label. Ink headline. No teal.
 */
export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: "var(--lavender-hover)" }}
          >
            {eyebrow}
          </p>
        )}
        <h1
          className="mt-1 text-[26px] font-semibold leading-tight tracking-tight"
          style={{ color: "var(--ink)", letterSpacing: "-0.6px" }}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed" style={{ color: "var(--ink-subtle)" }}>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
