"use client";

/**
 * High-fidelity skeleton screens that mirror the actual UI layout.
 * Eliminates blank-state flash and makes the app feel 2× faster.
 */

// ── Shared pulse wrapper ──────────────────────────────────────────────────────
function SkeletonBlock({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{ background: "var(--cc-elevated)", ...style }}
    />
  );
}

// ── Session workspace skeleton ────────────────────────────────────────────────
export function SessionSkeleton() {
  return (
    <div className="flex h-full flex-col animate-pulse">
      {/* Header bar */}
      <div
        className="flex h-12 shrink-0 items-center gap-3 px-4"
        style={{ borderBottom: "1px solid var(--cc-border)" }}
      >
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-3 w-4" />
        <SkeletonBlock className="h-3 w-32" />
        <div className="ml-auto">
          <SkeletonBlock className="h-5 w-20 rounded-full" />
        </div>
      </div>

      {/* Split pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div
          className="w-80 shrink-0 p-4 space-y-6 overflow-y-auto"
          style={{ borderRight: "1px solid var(--cc-border)" }}
        >
          {/* Symptoms block */}
          <div className="space-y-2">
            <SkeletonBlock className="h-2 w-24" />
            <div className="flex flex-wrap gap-2 mt-2">
              <SkeletonBlock className="h-6 w-16 rounded-md" />
              <SkeletonBlock className="h-6 w-20 rounded-md" />
              <SkeletonBlock className="h-6 w-14 rounded-md" />
            </div>
          </div>

          {/* Severity badge block */}
          <SkeletonBlock
            className="h-20 rounded-lg"
            style={{ border: "1px solid var(--cc-border)" }}
          />

          {/* Medication list block */}
          <div className="space-y-2">
            <SkeletonBlock className="h-2 w-32" />
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2"
                style={{ borderRadius: "6px" }}
              >
                <div className="flex-1 space-y-1.5">
                  <SkeletonBlock className="h-3 w-2/3" />
                  <SkeletonBlock className="h-2 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map area */}
        <div
          className="flex flex-1 items-center justify-center"
          style={{ background: "var(--cc-bg)" }}
        >
          <SkeletonBlock className="h-3 w-48" />
        </div>
      </div>
    </div>
  );
}

// ── Vault / document list skeleton ───────────────────────────────────────────
export function VaultSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <SkeletonBlock className="h-6 w-48" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl p-4"
            style={{ background: "var(--cc-surface)", border: "1px solid var(--cc-border)" }}
          >
            <SkeletonBlock className="h-10 w-10 rounded-md shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-3 w-1/3" />
              <SkeletonBlock className="h-2 w-1/2" />
            </div>
            <SkeletonBlock className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── App home skeleton ─────────────────────────────────────────────────────────
export function AppHomeSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-pulse">
      <div className="space-y-2">
        <SkeletonBlock className="h-2 w-40" />
        <SkeletonBlock className="h-8 w-72" />
        <SkeletonBlock className="h-3 w-48" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <SkeletonBlock
            key={i}
            className="h-40 rounded-2xl"
            style={{ border: "1px solid var(--cc-border)" }}
          />
        ))}
      </div>
    </div>
  );
}
