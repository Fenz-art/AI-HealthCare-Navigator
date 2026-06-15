'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface SessionTabsProps {
  activeTab: 'navigation' | 'interpreter' | 'assistance';
  onTabChange: (tab: 'navigation' | 'interpreter' | 'assistance') => void;
  hasAssistance: boolean;
}

/**
 * NATURAL SPRINT — Session tab bar.
 * Lavender active indicator. Surface-1 background. No teal/slate.
 */
export function SessionTabs({ activeTab, onTabChange, hasAssistance }: SessionTabsProps) {
  const t = useTranslations('tabs');

  const tabs = [
    { id: 'navigation',  label: t('navigation'),  icon: '🩺' },
    { id: 'interpreter', label: t('interpreter'),  icon: '🗣️' },
    { id: 'assistance',  label: t('assistance'),   icon: '🤝', badge: hasAssistance },
  ];

  return (
    <div
      className="sticky top-0 z-20"
      style={{ background: "var(--surface-1)", borderBottom: "1px solid var(--hairline)" }}
    >
      <div className="mx-auto flex max-w-lg">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id as typeof activeTab)}
              className="relative flex flex-1 items-center justify-center gap-1.5 py-3 text-[13px] font-medium transition-colors duration-100"
              style={{ color: active ? "var(--ink)" : "var(--ink-tertiary)" }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className="absolute right-4 top-2.5 h-[6px] w-[6px] rounded-full"
                  style={{ background: "var(--semantic-red)" }}
                />
              )}
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: "var(--lavender)" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
