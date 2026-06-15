"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  Heart,
  Pill,
  Phone,
  Droplets,
  Loader2,
  Globe,
  User,
  CheckCircle2,
  Clock,
  Languages,
  Syringe,
  Stethoscope,
} from "lucide-react";
import { api } from "@/lib/api";
import type { SharedPassportView } from "@/lib/types";

const SHARE_LABELS: Record<string, string> = {
  QUICK: "Quick Share · 24h",
  PROVIDER: "Provider Share · 7 days",
  EMERGENCY: "Emergency Share",
};

export default function SharedPassportPage() {
  const { token } = useParams() as { token: string };
  const [data, setData] = useState<SharedPassportView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await api.getSharedPassport(token);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Passport not found or expired");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin" style={{ color: "var(--lavender)" }} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3">
        <AlertTriangle className="size-10" style={{ color: "var(--semantic-red)" }} />
        <p className="text-[15px] font-medium" style={{ color: "var(--ink-muted)" }}>
          {error || "Passport not available"}
        </p>
        <p className="text-[13px]" style={{ color: "var(--ink-tertiary)" }}>
          The share link may have expired or been revoked.
        </p>
      </div>
    );
  }

  const { passport, user: profile } = data;
  const initials = (profile.name || "?").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const sections = [
    { icon: Droplets, label: "Blood Type", color: "var(--semantic-red)", items: passport.bloodGroup ? [passport.bloodGroup] : [], empty: "Not provided" },
    { icon: AlertTriangle, label: "Allergies", color: "var(--semantic-red)", items: passport.allergies, empty: "None recorded" },
    { icon: Pill, label: "Current medications", color: "var(--semantic-blue)", items: passport.currentMedications, empty: "None" },
    { icon: Heart, label: "Chronic conditions", color: "var(--semantic-purple)", items: passport.chronicConditions, empty: "None recorded" },
    { icon: Syringe, label: "Vaccinations", color: "var(--semantic-success)", items: passport.vaccinations, empty: "Not provided" },
    { icon: Stethoscope, label: "Emergency contacts", color: "var(--lavender-hover)", items: passport.emergencyContacts, empty: "Not set" },
  ];

  return (
    <div className="mx-auto max-w-lg min-h-screen py-8 px-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-xl border shadow-sm"
        style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--hairline)" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold"
              style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}>
              {initials}
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
                CareCompass · Health Passport
              </p>
              <p className="text-[15px] font-semibold tracking-tight" style={{ color: "var(--ink)" }}>{profile.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {profile.homeCountry && (
                  <span className="text-[10px] inline-flex items-center gap-1" style={{ color: "var(--ink-tertiary)" }}>
                    <Globe className="size-3" />{profile.homeCountry}
                  </span>
                )}
                {profile.preferredLanguage && (
                  <span className="text-[10px] inline-flex items-center gap-1" style={{ color: "var(--ink-tertiary)" }}>
                    <Languages className="size-3" />{profile.preferredLanguage.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{
                background: data.shareType === "EMERGENCY" ? "color-mix(in srgb, var(--semantic-red) 15%, transparent)" : "color-mix(in srgb, var(--lavender) 15%, transparent)",
                color: data.shareType === "EMERGENCY" ? "var(--semantic-red)" : "var(--lavender)",
              }}>
              {SHARE_LABELS[data.shareType] || data.shareType}
            </span>
            <div className="flex items-center gap-1 text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
              <Clock className="size-3" />
              {new Date(data.sharedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Medical sections */}
        <div className="divide-y">
          {sections.map((section) => {
            const Icon = section.icon;
            const hasItems = section.items.length > 0;
            return (
              <div key={section.label} className="flex gap-4 px-5 py-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded"
                  style={{ background: `color-mix(in srgb, ${section.color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${section.color} 20%, transparent)` }}>
                  <Icon className="size-4" style={{ color: section.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--ink-tertiary)" }}>
                    {section.label}
                  </p>
                  {hasItems ? (
                    <ul className="mt-1.5 space-y-0.5">
                      {section.items.map((item, i) => (
                        <li key={i} className="text-[13px]" style={{ color: "var(--ink-muted)" }}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1.5 text-[13px]" style={{ color: "var(--ink-tertiary)" }}>{section.empty}</p>
                  )}
                </div>
                {hasItems && (
                  <CheckCircle2 className="size-4 shrink-0 mt-1" style={{ color: "var(--semantic-success)" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 flex items-center justify-between"
          style={{ borderTop: "1px solid var(--hairline)", background: "var(--surface-2)" }}>
          <p className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
            Shared via CareCompass · Secure medical passport
          </p>
          <Shield className="size-4" style={{ color: "var(--lavender)" }} />
        </div>
      </motion.div>
    </div>
  );
}
