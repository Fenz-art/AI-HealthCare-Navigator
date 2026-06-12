"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ActionItem {
  label: string;
  icon: string;
  action: string;
}

export function AgentCommand() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const actions: ActionItem[] = [
    { label: "Translate Document", icon: "📄", action: "/app/vault" },
    { label: "Generate Travel Summary", icon: "🛂", action: "/app/passport" },
    { label: "Prepare Provider Handoff", icon: "🤝", action: "/app/session/active" },
    { label: "Find Local Medication", icon: "💊", action: "/app/session/new" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-2xl -translate-x-1/2 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl"
          >
            <div className="border-b border-slate-100 pb-3">
              <input
                type="text"
                placeholder="What do you need help with?"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg outline-none transition focus:border-teal-500"
                autoFocus
              />
            </div>
            <div className="space-y-2 py-3">
              {actions.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition hover:bg-slate-50"
                  onClick={() => {
                    window.location.href = item.action;
                  }}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium text-slate-900">{item.label}</span>
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Press <kbd className="rounded border border-slate-200 bg-white px-2 py-1 font-mono text-xs">Ctrl</kbd> + <kbd className="rounded border border-slate-200 bg-white px-2 py-1 font-mono text-xs">K</kbd> to toggle
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
