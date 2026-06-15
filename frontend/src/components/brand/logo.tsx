import Link from "next/link";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  href?: string;
  variant?: "default" | "marketing";
}

export function Logo({
  className,
  showWordmark = true,
  href = "/",
  variant = "default",
}: LogoProps) {
  const isMarketing = variant === "marketing";

  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-md ring-1",
          isMarketing
            ? "bg-[var(--mk-elevated)] ring-[var(--mk-border)]"
            : "bg-[var(--surface-2)] ring-[var(--hairline)]"
        )}
      >
        <Compass
          className={cn("size-4", isMarketing ? "text-[var(--mk-text)]" : "text-[var(--lavender)]")}
          strokeWidth={2}
        />
      </span>
      {showWordmark ? (
        <span className="font-display text-base font-bold tracking-tight">
          CareCompass
        </span>
      ) : null}
    </Link>
  );
}
