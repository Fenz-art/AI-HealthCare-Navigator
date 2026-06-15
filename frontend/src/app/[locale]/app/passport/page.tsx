"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Heart,
  Pill,
  User,
  Phone,
  Shield,
  Droplets,
  Download,
  Share2,
  Globe,
  Sparkles,
  CheckCircle2,
  Loader2,
  Link2,
  CheckCheck,
  MessageCircle,
  Brain,
  Syringe,
  Stethoscope,
  QrCode,
  Clock,
  XCircle,
  History,
  Eye,
  Ban,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { PageHeader } from "@/components/os/page-header";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { api } from "@/lib/api";
import type { MemorySummary, ShareTimelineItem, ShareType } from "@/lib/types";

const SHARE_OPTIONS: { type: ShareType; label: string; desc: string; duration: string }[] = [
  { type: "QUICK", label: "Quick Share", desc: "For immediate needs", duration: "Expires in 24h" },
  { type: "PROVIDER", label: "Provider Share", desc: "For clinic or pharmacy", duration: "Expires in 7 days" },
  { type: "EMERGENCY", label: "Emergency Share", desc: "Permanent until revoked", duration: "No expiry" },
];

export default function PassportPage() {
  const { data: session } = useSession();
  const onboarding = useOnboardingStore((s) => s.data);
  const [memory, setMemory] = useState<MemorySummary | null>(null);
  const [memoryLoading, setMemoryLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [shareResult, setShareResult] = useState<{
    shareUrl: string;
    shareToken: string;
    shareType: ShareType;
    qrCodeUrl: string | null;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedShareType, setSelectedShareType] = useState<ShareType>("QUICK");
  const [showShareModal, setShowShareModal] = useState(false);
  const [timeline, setTimeline] = useState<ShareTimelineItem[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;
    api.getMemorySummary(session.user.id)
      .then(setMemory)
      .catch(() => {})
      .finally(() => setMemoryLoading(false));
  }, [session?.user?.id]);

  const fetchTimeline = async () => {
    if (!session?.user?.id) return;
    setTimelineLoading(true);
    try {
      const items = await api.getShareTimeline(session.user.id);
      setTimeline(items);
    } catch {}
    setTimelineLoading(false);
  };

  const handleShare = async () => {
    if (!session?.user?.id) return;
    setSharing(true);
    setShareResult(null);

    try {
      const result = await api.sharePassport({
        createdBy: session.user.id,
        shareType: selectedShareType,
      });
      setShareResult({
        shareUrl: result.shareUrl,
        shareToken: result.shareToken,
        shareType: result.shareType,
        qrCodeUrl: result.qrCodeUrl,
      });
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setSharing(false);
    }
  };

  const handleRevoke = async (token: string) => {
    if (!session?.user?.id) return;
    setRevoking(token);
    try {
      await api.revokeShare(token, session.user.id);
      setTimeline((prev) => prev.map((t) => t.shareToken === token ? { ...t, revoked: true } : t));
    } catch {}
    setRevoking(null);
  };

  const copyLink = () => {
    if (!shareResult) return;
    navigator.clipboard.writeText(shareResult.shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const name = onboarding.identity.name || session?.user?.name || "Traveler";
  const bloodGroup = onboarding.bloodGroup || "—";
  const allergies = memory?.allergies?.length
    ? memory.allergies
    : onboarding.allergies.filter((a) => a !== "None");
  const conditions = memory?.conditions?.length
    ? memory.conditions
    : onboarding.conditions.filter((c) => c !== "None");
  const medications = memory?.medications?.length
    ? memory.medications
    : onboarding.medications.map((m) => `${m.name} ${m.dosage}`);
  const vaccinations = memory?.vaccinations ?? [];
  const hasInsurance = onboarding.hasInsurance === "yes" || (memory?.insurance?.length ?? 0) > 0;
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const syncCount = (memory?.conditions?.length ?? 0) + (memory?.medications?.length ?? 0) +
    (memory?.allergies?.length ?? 0) + (memory?.vaccinations?.length ?? 0) +
    (memory?.procedures?.length ?? 0) + (memory?.insurance?.length ?? 0);

  const sections = [
    {
      icon: Droplets,
      label: "Blood Type",
      color: "var(--semantic-red)",
      items: bloodGroup !== "—" ? [bloodGroup] : [],
      empty: "Not set",
    },
    {
      icon: AlertTriangle,
      label: "Allergies",
      color: "var(--semantic-red)",
      items: allergies,
      empty: "None recorded",
      memoryCount: memory?.allergies?.length,
    },
    {
      icon: Pill,
      label: "Current medications",
      color: "var(--semantic-blue)",
      items: medications,
      empty: "None",
      memoryCount: memory?.medications?.length,
    },
    {
      icon: Heart,
      label: "Conditions",
      color: "var(--semantic-purple)",
      items: conditions,
      empty: "None recorded",
      memoryCount: memory?.conditions?.length,
    },
    {
      icon: Syringe,
      label: "Vaccinations",
      color: "var(--semantic-success)",
      items: vaccinations,
      empty: "None recorded",
      memoryCount: memory?.vaccinations?.length,
    },
    {
      icon: Stethoscope,
      label: "Procedures",
      color: "var(--lavender-hover)",
      items: memory?.procedures ?? [],
      empty: "None recorded",
      memoryCount: memory?.procedures?.length,
    },
    {
      icon: Phone,
      label: "Emergency contacts",
      color: "var(--lavender-hover)",
      items: onboarding.emergencyContacts.length > 0
        ? onboarding.emergencyContacts.map((c) => `${c.name} · ${c.phone}`)
        : [],
      empty: "Not set",
    },
    {
      icon: Shield,
      label: "Insurance",
      color: "var(--semantic-success)",
      items: hasInsurance
        ? [onboarding.insuranceProvider || memory?.insurance?.[0] || "On file"]
        : [],
      empty: "Not provided",
      memoryCount: memory?.insurance?.length,
    },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        eyebrow="Travel ready"
        title="Health Passport"
        description="Your medical identity — auto-synced from Health Memory. Share with providers instantly."
        action={
          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={() => { setShowShareModal(true); setShareResult(null); }}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-medium transition-all"
              style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}>
              <Share2 className="size-4" /> Share
            </motion.button>
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={() => { fetchTimeline(); setShowTimeline(!showTimeline); }}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-medium transition-all"
              style={{ border: "1px solid var(--hairline)", color: "var(--ink-subtle)" }}>
              <History className="size-4" /> History
            </motion.button>
          </div>
        }
      />

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border" style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}>
            <div className="p-4">
              <p className="text-[13px] font-semibold mb-3" style={{ color: "var(--ink)" }}>Share your passport</p>

              {/* Share type selector */}
              <div className="flex gap-2 mb-4">
                {SHARE_OPTIONS.map((opt) => (
                  <button key={opt.type} onClick={() => setSelectedShareType(opt.type)}
                    className="flex-1 rounded-lg border p-3 text-left transition-all"
                    style={{
                      borderColor: selectedShareType === opt.type ? "var(--lavender)" : "var(--hairline)",
                      background: selectedShareType === opt.type ? "color-mix(in srgb, var(--lavender) 8%, transparent)" : "transparent",
                    }}>
                    <p className="text-[12px] font-medium" style={{ color: "var(--ink)" }}>{opt.label}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--ink-tertiary)" }}>{opt.desc}</p>
                    <p className="text-[9px] mt-0.5" style={{ color: "var(--ink-tertiary)" }}>{opt.duration}</p>
                  </button>
                ))}
              </div>

              {/* Share button or result */}
              {shareResult ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 rounded-lg border p-2" style={{ borderColor: "var(--hairline)", background: "white" }}>
                      <QRCodeSVG value={shareResult.shareUrl} size={120} level="M" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium" style={{ color: "var(--ink)" }}>Share link generated</p>
                      <p className="text-[11px] mt-1 truncate" style={{ color: "var(--ink-tertiary)" }}>{shareResult.shareUrl}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={{
                            background: selectedShareType === "EMERGENCY" ? "color-mix(in srgb, var(--semantic-red) 15%, transparent)" : "color-mix(in srgb, var(--lavender) 15%, transparent)",
                            color: selectedShareType === "EMERGENCY" ? "var(--semantic-red)" : "var(--lavender)",
                          }}>
                          {SHARE_OPTIONS.find((o) => o.type === shareResult.shareType)?.label || shareResult.shareType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={copyLink}
                      className="flex-1 rounded-lg py-2 text-[12px] font-medium transition-colors hover:bg-[var(--surface-2)]"
                      style={{ border: "1px solid var(--hairline)", color: "var(--ink-muted)" }}>
                      {copied ? <span className="flex items-center justify-center gap-1.5"><CheckCheck className="size-3.5" /> Copied!</span> : <span className="flex items-center justify-center gap-1.5"><Link2 className="size-3.5" /> Copy link</span>}
                    </button>
                    <button onClick={() => { setShowShareModal(false); setShareResult(null); }}
                      className="rounded-lg px-4 py-2 text-[12px] font-medium transition-colors hover:bg-[var(--surface-2)]"
                      style={{ border: "1px solid var(--hairline)", color: "var(--ink-muted)" }}>
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={handleShare} disabled={sharing}
                  className="w-full rounded-lg py-2.5 text-[13px] font-medium transition-all disabled:opacity-50"
                  style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}>
                  {sharing ? <span className="flex items-center justify-center gap-2"><Loader2 className="size-4 animate-spin" /> Generating...</span> : <span className="flex items-center justify-center gap-2"><QrCode className="size-4" /> Generate share link</span>}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Timeline */}
      <AnimatePresence>
        {showTimeline && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border" style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>Share History</p>
                {timeline.length > 0 && (
                  <span className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>{timeline.filter((t) => !t.revoked).length} active</span>
                )}
              </div>
              {timelineLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="size-5 animate-spin" style={{ color: "var(--lavender)" }} />
                </div>
              ) : timeline.length === 0 ? (
                <div className="flex flex-col items-center py-6">
                  <History className="size-8" style={{ color: "var(--ink-tertiary)" }} />
                  <p className="mt-2 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>No shares yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {timeline.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-lg p-3" style={{ background: "var(--surface-2)" }}>
                      <div className="flex size-9 items-center justify-center rounded-lg"
                        style={{
                          background: item.revoked
                            ? "color-mix(in srgb, var(--semantic-red) 10%, transparent)"
                            : "color-mix(in srgb, var(--lavender) 10%, transparent)",
                        }}>
                        {item.revoked
                          ? <XCircle className="size-4" style={{ color: "var(--semantic-red)" }} />
                          : <Shield className="size-4" style={{ color: "var(--lavender)" }} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[12px] font-medium truncate" style={{ color: "var(--ink)" }}>
                            {SHARE_OPTIONS.find((o) => o.type === item.shareType)?.label || item.shareType}
                          </p>
                          {item.revoked && (
                            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded" style={{ color: "var(--semantic-red)" }}>Revoked</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[10px]" style={{ color: "var(--ink-tertiary)" }}>
                          <span className="flex items-center gap-1"><Eye className="size-3" />{item.accessCount} views</span>
                          <span className="flex items-center gap-1"><Clock className="size-3" />{new Date(item.createdAt).toLocaleDateString()}</span>
                          {item.lastViewedAt && (
                            <span>Last viewed {new Date(item.lastViewedAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      {!item.revoked && (
                        <button onClick={() => handleRevoke(item.shareToken)} disabled={revoking === item.shareToken}
                          className="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-[var(--surface-3)]"
                          style={{ color: "var(--semantic-red)" }}>
                          {revoking === item.shareToken ? <Loader2 className="size-3.5 animate-spin" /> : <Ban className="size-3.5" />}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Health Memory sync indicator */}
      {!memoryLoading && syncCount > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl border px-4 py-3"
          style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}>
          <Brain className="size-5 shrink-0" style={{ color: "var(--lavender)" }} />
          <div className="flex-1">
            <p className="text-[12px] font-medium" style={{ color: "var(--ink)" }}>
              Auto-synced from Health Memory
            </p>
            <p className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
              {syncCount} records synced from document extractions
            </p>
          </div>
          <CheckCircle2 className="size-5 shrink-0" style={{ color: "var(--semantic-success)" }} />
        </motion.div>
      )}

      {!onboarding.identity.name && !memoryLoading && (!memory || syncCount === 0) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-xl border py-12"
          style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
          <Shield className="size-12" style={{ color: "var(--ink-tertiary)" }} />
          <p className="mt-4 text-[15px] font-medium" style={{ color: "var(--ink-muted)" }}>No passport data yet</p>
          <p className="mt-1 text-[13px]" style={{ color: "var(--ink-tertiary)" }}>
            Complete onboarding or upload documents to generate your health passport
          </p>
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-medium"
            style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}>
            <Sparkles className="size-4" /> Generate Passport
          </motion.button>
        </motion.div>
      )}

      {(onboarding.identity.name || (memory && syncCount > 0)) && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="lifted-panel overflow-hidden rounded-md"
          style={{ background: "var(--surface-1)" }}>
          {/* Identity header */}
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid var(--hairline)" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold"
                style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}>
                {initials || <User className="size-4" />}
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
                  CareCompass · Health Passport
                </p>
                <p className="text-[15px] font-semibold tracking-tight" style={{ color: "var(--ink)" }}>{name || "Patient"}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] inline-flex items-center gap-1" style={{ color: "var(--ink-tertiary)" }}>
                    <Globe className="size-3" />{onboarding.homeCountry || "—"}
                  </span>
                  {onboarding.identity.language && (
                    <>
                      <span style={{ color: "var(--ink-tertiary)" }}>·</span>
                      <span className="text-[10px]" style={{ color: "var(--ink-tertiary)" }}>
                        {onboarding.identity.language.toUpperCase()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>Blood type</p>
              <p className="text-[18px] font-bold" style={{ color: "var(--ink)" }}>{bloodGroup}</p>
            </div>
          </div>

          {/* Medical sections */}
          <motion.div className="divide-y" variants={staggerContainer} initial="hidden" animate="visible">
            {sections.map((section) => {
              const Icon = section.icon;
              const hasItems = section.items.length > 0;
              const isMemorySynced = section.memoryCount && section.memoryCount > 0;
              return (
                <motion.div key={section.label} variants={staggerItem}
                  className="flex gap-4 px-5 py-4" style={{ borderTop: "1px solid var(--hairline)" }}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded"
                    style={{ background: `color-mix(in srgb, ${section.color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${section.color} 20%, transparent)` }}>
                    <Icon className="size-4" style={{ color: section.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--ink-tertiary)" }}>
                        {section.label}
                      </p>
                      {isMemorySynced && (
                        <Brain className="size-3" style={{ color: "var(--lavender)" }} />
                      )}
                    </div>
                    {hasItems ? (
                      <ul className="mt-1.5 space-y-0.5">
                        {section.items.map((item) => (
                          <li key={item} className="text-[13px]" style={{ color: "var(--ink-muted)" }}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1.5 text-[13px]" style={{ color: "var(--ink-tertiary)" }}>{section.empty}</p>
                    )}
                  </div>
                  {hasItems && (
                    <CheckCircle2 className="size-4 shrink-0 mt-1" style={{ color: "var(--semantic-success)" }} />
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Footer with share count */}
          <div className="px-5 py-3 flex items-center justify-between"
            style={{ borderTop: "1px solid var(--hairline)", background: "var(--surface-2)" }}>
            <p className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
              Auto-synced from Health Memory · {syncCount} records
              {timeline.length > 0 && ` · Shared ${timeline.length} times`}
            </p>
            <Shield className="size-4" style={{ color: "var(--lavender)" }} />
          </div>
        </motion.div>
      )}
    </div>
  );
}
