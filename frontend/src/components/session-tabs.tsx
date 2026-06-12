'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface SessionTabsProps {
  activeTab: 'navigation' | 'interpreter' | 'assistance';
  onTabChange: (tab: 'navigation' | 'interpreter' | 'assistance') => void;
  hasAssistance: boolean;
}

export function SessionTabs({ activeTab, onTabChange, hasAssistance }: SessionTabsProps) {
  const t = useTranslations('tabs');
  
  const tabs = [
    { id: 'navigation', label: t('navigation'), icon: '🩺' },
    { id: 'interpreter', label: t('interpreter'), icon: '🗣️' },
    { id: 'assistance', label: t('assistance'), icon: '🤝', badge: hasAssistance ? '!' : null },
  ];

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-lg mx-auto flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as 'navigation' | 'interpreter' | 'assistance')}
            className={`flex-1 py-3 text-sm font-medium relative transition-colors flex items-center justify-center ${
              activeTab === tab.id ? 'text-teal-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="absolute top-2 right-4 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
