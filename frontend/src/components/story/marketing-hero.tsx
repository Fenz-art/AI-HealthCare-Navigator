"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import { ProductPreview } from "@/components/marketing/product-preview";
import { motion as motionTokens } from "@/lib/motion";

const LOGOS = ["Tokyo Medical", "NHS", "Apollo", "Kaiser", "Bumrungrad", "Charité"];

export function MarketingHero() {
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionTokens.slow, ease: motionTokens.ease }}
            className="mk-label"
          >
            Healthcare Navigation OS
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionTokens.slow, delay: 0.06, ease: motionTokens.ease }}
            className="mk-display-xl mt-6 text-balance"
          >
            The healthcare navigation system for global travelers.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionTokens.slow, delay: 0.14, ease: motionTokens.ease }}
            className="mk-subhead mx-auto mt-6 max-w-xl"
          >
            CareCompass is shaped by the practices that keep travelers calm — severity routing,
            medication mapping, provider location, and medical interpretation in one operating system.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionTokens.slow, delay: 0.22, ease: motionTokens.ease }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link href={`/${locale}/signup`} className="mk-btn-inverse gap-2 px-5">
              Get started
              <ArrowRight className="size-4" />
            </Link>
            <Link href={`/${locale}/how-it-works`} className="mk-btn-outline gap-2 px-5">
              See how it works
            </Link>
          </motion.div>
        </div>

        <ProductPreview />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-20 border-t pt-12"
          style={{ borderColor: "var(--hairline)" }}
        >
          <p className="text-center text-[13px]" style={{ color: "var(--ink-tertiary)" }}>
            Powering navigation for travelers across
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {LOGOS.map((name) => (
              <span
                key={name}
                className="text-sm font-medium"
                style={{ color: "var(--ink-subtle)" }}
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
