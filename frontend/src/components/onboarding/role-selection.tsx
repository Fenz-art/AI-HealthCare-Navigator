"use client";

import { motion } from "framer-motion";
import {
  User,
  Stethoscope,
  Pill,
  Microscope,
  Building2,
  HeartPulse,
  ArrowRight,
} from "lucide-react";
import { type UserRole, useOnboardingStore } from "@/stores/onboarding-store";
import { cn } from "@/lib/utils";

type RoleOption = {
  id: UserRole;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
};

const ROLES: RoleOption[] = [
  {
    id: "PATIENT",
    label: "Patient",
    description: "Access your health passport, vault, interpreter, and healthcare navigation.",
    icon: User,
    color: "var(--lavender)",
  },
  {
    id: "MEDICAL_ASSISTANT",
    label: "Medical Assistant",
    description: "Manage assigned travelers, translation requests, passport reviews, and escalations.",
    icon: HeartPulse,
    color: "#27a644",
  },
  {
    id: "PHARMACIST",
    label: "Pharmacist",
    description: "Medication lookup, traveler conversations, shared passports, and translation requests.",
    icon: Pill,
    color: "#f59e0b",
  },
  {
    id: "DOCTOR",
    label: "Doctor",
    description: "Shared cases, shared passports, translation requests, and patient conversations.",
    icon: Stethoscope,
    color: "#3b82f6",
  },
  {
    id: "CLINIC_STAFF",
    label: "Clinic Staff",
    description: "Manage clinic operations, patient intake, and provider coordination.",
    icon: Microscope,
    color: "#8b5cf6",
  },
  {
    id: "HOSPITAL_STAFF",
    label: "Hospital Staff",
    description: "Hospital-wide coordination, referrals, and multi-department collaboration.",
    icon: Building2,
    color: "#ef4444",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function RoleSelection() {
  const { data, updateData, setStep } = useOnboardingStore();

  return (
    <div>
      <div
        className="mb-5 flex size-10 items-center justify-center rounded-xl"
        style={{ background: "var(--lavender-muted)", border: "1px solid rgba(94,106,210,0.15)" }}
      >
        <User className="size-5" style={{ color: "var(--lavender)" }} />
      </div>
      <h1
        className="text-[28px] font-semibold leading-tight tracking-tight"
        style={{ color: "var(--ink)", letterSpacing: "-0.6px" }}
      >
        Who are you?
      </h1>
      <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--ink-subtle)" }}>
        Select your role to configure your CareCompass workspace.
      </p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mt-6 grid gap-2.5"
      >
        {ROLES.map((role) => {
          const Icon = role.icon;
          const selected = data.role === role.id;
          return (
            <motion.button
              key={role.id}
              type="button"
              variants={cardVariants}
              onClick={() => {
                updateData({ role: role.id });
                setStep(1);
              }}
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                "group relative flex items-start gap-4 overflow-hidden rounded-xl border p-4 text-left transition-all duration-200",
                selected && "border-[var(--lavender)]",
              )}
              style={{
                borderColor: selected ? role.color : "var(--hairline)",
                background: selected
                  ? `color-mix(in srgb, ${role.color} 8%, transparent)`
                  : "var(--surface-1)",
              }}
            >
              {/* Glow */}
              <div
                className={cn(
                  "pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300",
                  selected && "opacity-100",
                )}
                style={{
                  background: selected
                    ? `radial-gradient(600px circle at 50% 50%, ${role.color}08, transparent 60%)`
                    : "none",
                }}
              />

              <div
                className={cn(
                  "relative flex size-11 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
                  selected
                    ? "shadow-lg"
                    : "group-hover:scale-105",
                )}
                style={{
                  background: selected
                    ? `linear-gradient(135deg, ${role.color}, ${role.color}cc)`
                    : "var(--surface-2)",
                }}
              >
                <Icon
                  className="size-5"
                  style={{
                    color: selected ? "white" : "var(--ink-tertiary)",
                  }}
                />
              </div>

              <div className="relative min-w-0 flex-1">
                <p
                  className="text-[15px] font-semibold"
                  style={{ color: selected ? "var(--ink)" : "var(--ink)" }}
                >
                  {role.label}
                </p>
                <p className="mt-0.5 text-[12px] leading-relaxed" style={{ color: "var(--ink-subtle)" }}>
                  {role.description}
                </p>
              </div>

              <ArrowRight
                className={cn(
                  "relative mt-2 size-4 transition-all duration-200",
                  selected
                    ? "translate-x-0 opacity-100"
                    : "opacity-0 group-hover:translate-x-0.5 group-hover:opacity-60",
                )}
                style={{ color: role.color }}
              />
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
