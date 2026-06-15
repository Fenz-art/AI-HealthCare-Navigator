"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  Stethoscope,
  Shield,
  FileText,
  Compass,
  Clock,
  Languages,
  AlertTriangle,
  Settings,
  MapPin,
  Pill,
  X,
  ArrowRight,
} from "lucide-react";
import { useUIStore } from "@/stores/ui-store";

const COMMANDS = [
  { id: "new-session", label: "Start new session", icon: Stethoscope, shortcut: "N", href: "/app/session/new" },
  { id: "active-session", label: "Go to active session", icon: Compass, shortcut: "A", href: "/app/session/active" },
  { id: "passport", label: "Open Health Passport", icon: Shield, shortcut: "P", href: "/app/passport" },
  { id: "vault", label: "Open Health Vault", icon: FileText, shortcut: "V", href: "/app/vault" },
  { id: "interpreter", label: "Open Interpreter", icon: Languages, shortcut: "I", href: "/app/interpreter" },
  { id: "history", label: "View History", icon: Clock, shortcut: "H", href: "/app/history" },
  { id: "emergency", label: "Emergency mode", icon: AlertTriangle, shortcut: "E", href: "/app/emergency", danger: true },
  { id: "settings", label: "Settings", icon: Settings, shortcut: ",", href: "/app/settings" },
];

const AGENT_SUGGESTIONS = [
  "Find medication equivalent",
  "Nearby pharmacies",
  "Translate medical report",
  "Emergency contacts",
];

export function CommandPalette() {
  const { locale } = useParams() as { locale: string };
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = query
    ? COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : COMMANDS;

  const handleClose = useCallback(() => {
    setCommandPaletteOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, [setCommandPaletteOpen]);

  const handleSelect = useCallback(
    (cmd: (typeof COMMANDS)[0]) => {
      router.push(`/${locale}${cmd.href}`);
      handleClose();
    },
    [router, locale, handleClose]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === "Escape" && commandPaletteOpen) {
        handleClose();
      }
      if (commandPaletteOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
        }
        if (e.key === "Enter" && filtered[selectedIndex]) {
          e.preventDefault();
          handleSelect(filtered[selectedIndex]);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen, handleClose, filtered, selectedIndex, handleSelect]);

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-lg lifted-panel"
            style={{
              background: "var(--surface-2)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
            }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid var(--hairline)" }}>
              <Search className="size-4 shrink-0" style={{ color: "var(--ink-tertiary)" }} />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search commands or ask the agent..."
                className="flex-1 bg-transparent text-[14px] outline-none"
                style={{ color: "var(--ink)", caretColor: "var(--lavender)" }}
              />
              <button
                onClick={handleClose}
                className="flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-[var(--surface-3)]"
                style={{ color: "var(--ink-tertiary)" }}
              >
                <X className="size-3.5" />
              </button>
            </div>

            {/* Agent suggestions (when empty) */}
            {!query && (
              <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--hairline)" }}>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
                  Agent Suggestions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {AGENT_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-[12px] transition-colors hover:bg-[var(--surface-3)]"
                      style={{ background: "var(--surface-3)", color: "var(--ink-subtle)", border: "1px solid var(--hairline)" }}
                    >
                      <Sparkles className="size-3" style={{ color: "var(--lavender)" }} />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Command list */}
            <div className="max-h-[320px] overflow-y-auto py-1">
              {filtered.map((cmd, i) => {
                const Icon = cmd.icon;
                const isSelected = selectedIndex === i;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => handleSelect(cmd)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left transition-colors duration-75"
                    style={{ background: isSelected ? "var(--surface-3)" : "transparent" }}
                  >
                    <Icon
                      className="size-4 shrink-0"
                      style={{
                        color: cmd.danger
                          ? "var(--semantic-red)"
                          : isSelected
                          ? "var(--lavender)"
                          : "var(--ink-tertiary)",
                      }}
                    />
                    <span
                      className="flex-1 text-[13px]"
                      style={{
                        color: cmd.danger ? "var(--semantic-red)" : "var(--ink-muted)",
                        fontWeight: isSelected ? 500 : 400,
                      }}
                    >
                      {cmd.label}
                    </span>
                    {isSelected && <ArrowRight className="size-3.5" style={{ color: "var(--ink-tertiary)" }} />}
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div className="px-4 py-8 text-center text-[13px]" style={{ color: "var(--ink-tertiary)" }}>
                  No commands found
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between px-4 py-2 text-[10px]"
              style={{ borderTop: "1px solid var(--hairline)", color: "var(--ink-tertiary)" }}
            >
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="rounded border px-1 py-0.5 font-mono" style={{ borderColor: "var(--hairline)" }}>↑↓</kbd> Navigate
                </span>
                <span>
                  <kbd className="rounded border px-1 py-0.5 font-mono" style={{ borderColor: "var(--hairline)" }}>↵</kbd> Select
                </span>
              </div>
              <span>
                <kbd className="rounded border px-1 py-0.5 font-mono" style={{ borderColor: "var(--hairline)" }}>esc</kbd> Close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
