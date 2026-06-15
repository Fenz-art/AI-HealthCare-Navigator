"use client";

import { useRef, useState, useEffect, useCallback, type ReactNode } from "react";

interface ElasticTab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface ElasticTabsProps {
  tabs: ElasticTab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export function ElasticTabs({ tabs, defaultTab, onChange }: ElasticTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id);
  const [gliderStyle, setGliderStyle] = useState({ transform: "translateX(0px)", width: "0px" });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateGlider = useCallback(() => {
    const activeIndex = tabs.findIndex((t) => t.id === activeTab);
    const activeEl = tabRefs.current[activeIndex];
    const containerEl = containerRef.current;
    if (!activeEl || !containerEl) return;

    const containerRect = containerEl.getBoundingClientRect();
    const tabRect = activeEl.getBoundingClientRect();
    const left = tabRect.left - containerRect.left;
    const width = tabRect.width;

    setGliderStyle({
      transform: `translateX(${left - 4}px)`,
      width: `${width}px`,
    });
  }, [activeTab, tabs]);

  useEffect(() => {
    updateGlider();
    window.addEventListener("resize", updateGlider);
    return () => window.removeEventListener("resize", updateGlider);
  }, [updateGlider]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div ref={containerRef} className="elastic-tabs">
      <div
        className="elastic-glider"
        style={gliderStyle}
      />
      {tabs.map((tab, i) => (
        <button
          key={tab.id}
          ref={(el) => { tabRefs.current[i] = el; }}
          className={activeTab === tab.id ? "active" : ""}
          onClick={() => handleTabClick(tab.id)}
        >
          <span className="flex items-center gap-1.5">
            {tab.icon}
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}
