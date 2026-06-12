"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Globe,
  Lock,
  Search,
  Share2,
  Upload,
} from "lucide-react";
import { PageHeader } from "@/components/os/page-header";
import { motion as motionTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";

const DOCUMENTS = [
  {
    id: "1",
    name: "Prescription · Lisinopril",
    type: "Prescription",
    lang: "EN",
    date: "Mar 2026",
    translated: true,
  },
  {
    id: "2",
    name: "Vaccination record",
    type: "Immunization",
    lang: "EN",
    date: "Jan 2026",
    translated: false,
  },
  {
    id: "3",
    name: "Lab results · CBC",
    type: "Lab report",
    lang: "EN",
    date: "Dec 2025",
    translated: true,
  },
];

export default function VaultPage() {
  const [query, setQuery] = useState("");
  const filtered = DOCUMENTS.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        eyebrow="Health memory"
        title="Health Vault"
        description="Your medical documents — valuable, translatable, searchable, shareable. Apple Wallet meets Notion."
        action={
          <button type="button" className="btn-primary gap-2">
            <Upload className="size-4" />
            Add document
          </button>
        }
      />

      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--cc-text-secondary)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search prescriptions, labs, vaccination records…"
          className="h-12 w-full rounded-2xl border hairline bg-[var(--cc-surface)] pl-11 pr-4 text-sm outline-none placeholder:text-[var(--cc-text-secondary)] focus:ring-2 focus:ring-[var(--cc-pharmacy)]/30"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((doc, i) => (
          <motion.article
            key={doc.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: motionTokens.normal, ease: motionTokens.ease }}
            className="group cc-panel relative overflow-hidden transition-colors duration-200 hover:border-[rgba(59,130,246,0.2)]"
          >
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[4rem] bg-gradient-to-bl from-[var(--cc-pharmacy)]/10 to-transparent" />
            <div className="flex items-start justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--cc-elevated)]">
                <FileText className="size-5 text-[var(--cc-pharmacy)]" />
              </div>
              <span className="rounded-full border hairline px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--cc-text-secondary)]">
                {doc.type}
              </span>
            </div>
            <h3 className="font-display mt-4 font-bold leading-snug">{doc.name}</h3>
            <p className="mt-1 text-xs text-[var(--cc-text-secondary)]">{doc.date}</p>
            <div className="mt-4 flex items-center gap-2">
              {doc.translated ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(82,196,26,0.12)] px-2 py-0.5 text-[10px] font-medium text-[var(--cc-success)]">
                  <Globe className="size-3" />
                  Translated
                </span>
              ) : (
                <span className="text-[10px] text-[var(--cc-text-secondary)]">
                  Tap to translate
                </span>
              )}
            </div>
            <div className="mt-5 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border hairline py-2 text-xs font-medium transition-colors hover:bg-[var(--cc-elevated)]"
              >
                <Share2 className="size-3.5" />
                Share
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border hairline py-2 text-xs font-medium transition-colors hover:bg-[var(--cc-elevated)]"
              >
                <Globe className="size-3.5" />
                Translate
              </button>
            </div>
          </motion.article>
        ))}

        <button
          type="button"
          className={cn(
            "cc-panel flex min-h-[200px] flex-col items-center justify-center gap-3",
            "border-dashed transition-colors duration-200 hover:border-[var(--cc-pharmacy)]/30 hover:bg-[var(--cc-elevated)]/40"
          )}
        >
          <div className="flex size-12 items-center justify-center rounded-2xl border border-dashed hairline">
            <Upload className="size-5 text-[var(--cc-text-secondary)]" />
          </div>
          <p className="text-sm font-medium">Drop a document</p>
          <p className="text-xs text-[var(--cc-text-secondary)]">PDF, image, or photo</p>
        </button>
      </div>

      <div className="cc-elevated flex items-center gap-4 rounded-2xl p-5">
        <Lock className="size-5 shrink-0 text-[var(--cc-text-secondary)]" />
        <p className="text-sm text-[var(--cc-text-secondary)]">
          End-to-end encrypted at rest. You control what gets shared with providers or
          emergency contacts.
        </p>
      </div>
    </div>
  );
}
