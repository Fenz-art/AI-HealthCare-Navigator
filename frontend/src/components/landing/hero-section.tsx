"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { ArrowRight, MapPin, Search, Stethoscope } from "lucide-react";
import { WorldMap } from "@/components/landing/world-map";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const t = useTranslations("landing");
  const params = useParams();
  const locale = params.locale as string;

  return (
    <section className="relative overflow-hidden pb-16 pt-12 sm:pb-24 sm:pt-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--lavender-hover)" }}>
            {t("badge")}
          </p>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-[52px] sm:leading-[1.15]">
            {t("title")}{" "}
            <span style={{ color: "var(--lavender-hover)" }}>{t("titleHighlight")}</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
            {t("subtitle")}
          </p>

          {/* Search orb */}
          <div
            className="mt-8 hidden max-w-lg items-center rounded-full p-2 sm:flex lifted-panel"
            style={{ background: "var(--surface-1)" }}
          >
            <div
              className="flex flex-1 items-center gap-3 px-4 py-2"
              style={{ borderRight: "1px solid var(--hairline)" }}
            >
              <MapPin className="size-4 shrink-0" style={{ color: "var(--ink-tertiary)" }} />
              <div>
                <p className="text-[11px] font-semibold" style={{ color: "var(--ink)" }}>
                  Where
                </p>
                <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                  Any city, any country
                </p>
              </div>
            </div>
            <div className="flex flex-1 items-center gap-3 px-4 py-2">
              <Stethoscope className="size-4 shrink-0" style={{ color: "var(--ink-tertiary)" }} />
              <div>
                <p className="text-[11px] font-semibold" style={{ color: "var(--ink)" }}>
                  Symptoms
                </p>
                <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                  Tell us how you feel
                </p>
              </div>
            </div>
            <Link
              href={`/${locale}/app/session/new`}
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-full transition-colors duration-150"
              )}
              style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background = "var(--lavender-hover)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background = "var(--lavender)")
              }
              aria-label="Start session"
            >
              <Search className="size-5" />
            </Link>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={`/${locale}/app/session/new`} className="btn-primary gap-2">
              {t("cta")}
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link href={`/${locale}/how-it-works`} className="btn-secondary gap-2">
              How it works
            </Link>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/3] w-full max-w-lg lg:max-w-none">
          <div
            className="absolute inset-0 overflow-hidden rounded-xl p-6 lifted-panel"
            style={{ background: "var(--surface-1)" }}
          >
            <WorldMap />
          </div>
          <div
            className="absolute -bottom-4 -left-2 rounded-md px-4 py-3 lifted-panel sm:-left-4"
            style={{ background: "var(--surface-2)" }}
          >
            <p className="text-xs font-medium" style={{ color: "var(--ink-tertiary)" }}>
              Active in
            </p>
            <p className="text-lg font-semibold" style={{ color: "var(--ink)" }}>
              20+ countries
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
