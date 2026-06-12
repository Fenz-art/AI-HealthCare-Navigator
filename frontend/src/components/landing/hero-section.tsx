"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { ArrowRight, MapPin, Search, Stethoscope } from "lucide-react";
import { WorldMap } from "@/components/landing/world-map";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const t = useTranslations('landing');
  const params = useParams();
  const locale = params.locale as string;

  return (
    <section className="relative overflow-hidden pb-16 pt-12 sm:pb-24 sm:pt-20">
      <div className="compass-gradient absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-sm font-medium text-[var(--compass-teal)]">
            {t('badge')}
          </p>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-[52px] sm:leading-[1.15]">
            {t('title')} <span className="text-[var(--compass-teal)]">{t('titleHighlight')}</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
            {t('subtitle')}
          </p>

          {/* Airbnb search-orb pattern */}
          <div className="mt-8 hidden max-w-lg items-center rounded-full border border-border bg-card p-2 shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px,rgba(0,0,0,0.08)_0_4px_8px] sm:flex">
            <div className="flex flex-1 items-center gap-3 border-r border-border px-4 py-2">
              <MapPin className="size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-[11px] font-semibold text-foreground">Where</p>
                <p className="text-xs text-muted-foreground">Any city, any country</p>
              </div>
            </div>
            <div className="flex flex-1 items-center gap-3 px-4 py-2">
              <Stethoscope className="size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-[11px] font-semibold text-foreground">Symptoms</p>
                <p className="text-xs text-muted-foreground">Tell us how you feel</p>
              </div>
            </div>
            <Link
              href={`/${locale}/app/session/new`}
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-full",
                "bg-[var(--compass-teal)] text-white transition-colors",
                "hover:bg-[color-mix(in_srgb,var(--compass-teal),black_8%)]"
              )}
              aria-label="Start session"
            >
              <Search className="size-5" />
            </Link>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={`/${locale}/app/session/new`}
              className="pill-cta-primary inline-flex w-full sm:w-auto"
            >
              {t('cta')}
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link
              href={`/${locale}/how-it-works`}
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-6 text-base font-medium transition-colors hover:bg-muted"
            >
              How it works
            </Link>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/3] w-full max-w-lg lg:max-w-none">
          <div className="card-elevated absolute inset-0 overflow-hidden rounded-3xl bg-card p-6">
            <WorldMap />
          </div>
          <div className="absolute -bottom-4 -left-2 surface-card px-4 py-3 sm:-left-4">
            <p className="text-xs font-medium text-muted-foreground">Active in</p>
            <p className="text-lg font-semibold">20+ countries</p>
          </div>
        </div>
      </div>
    </section>
  );
}
