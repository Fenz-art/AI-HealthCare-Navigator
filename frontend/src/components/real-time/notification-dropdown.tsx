"use client";

import { useEffect, useRef, useState } from "react";
import { useNotificationsStore } from "@/stores/notifications-store";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NOTIFICATION_ICONS: Record<string, string> = {
  PASSPORT_VIEWED: "👁",
  DOCUMENT_PROCESSED: "📄",
  TRANSLATION_READY: "🌐",
  MESSAGE_RECEIVED: "💬",
  AGENT_TASK_COMPLETE: "🤖",
  PROVIDER_RESPONSE: "🏥",
  INTERPRETER_READY: "🎧",
  SHARE_ACCESSED: "🔗",
};

export function NotificationDropdown({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const notifications = useNotificationsStore((s) => s.notifications);
  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const fetchNotifications = useNotificationsStore((s) => s.fetchNotifications);
  const markAsRead = useNotificationsStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationsStore((s) => s.markAllAsRead);
  const loading = useNotificationsStore((s) => s.loading);

  useEffect(() => {
    if (userId) {
      fetchNotifications(userId);
      const interval = setInterval(() => fetchNotifications(userId), 15000);
      return () => clearInterval(interval);
    }
  }, [userId, fetchNotifications]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleNotificationClick = async (id: string) => {
    await markAsRead(id);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-7 w-7 items-center justify-center rounded transition-colors hover:bg-[var(--surface-3)]"
        style={{ color: "var(--ink-subtle)" }}
        aria-label="Notifications"
      >
        <Bell className="size-3.5" />
        {unreadCount > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex min-w-[14px] items-center justify-center rounded-full px-1 text-[9px] font-bold"
            style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-1 w-80 overflow-hidden rounded-xl border shadow-lg"
            style={{
              background: "var(--surface-1)",
              borderColor: "var(--hairline)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            }}
          >
            <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid var(--hairline)" }}>
              <span className="text-[12px] font-semibold" style={{ color: "var(--ink)" }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead(userId)}
                  className="flex items-center gap-1 text-[11px] transition-colors hover:opacity-80"
                  style={{ color: "var(--lavender-hover)" }}
                >
                  <CheckCheck className="size-3" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loading && (
                <div className="flex justify-center py-6">
                  <Loader2 className="size-4 animate-spin" style={{ color: "var(--ink-tertiary)" }} />
                </div>
              )}

              {!loading && notifications.length === 0 && (
                <div className="py-8 text-center">
                  <Bell className="mx-auto size-6" style={{ color: "var(--ink-tertiary)" }} />
                  <p className="mt-2 text-[12px]" style={{ color: "var(--ink-muted)" }}>
                    No notifications yet
                  </p>
                </div>
              )}

              {notifications.slice(0, 20).map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.id)}
                  className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[var(--surface-2)]"
                  style={!notif.read ? { background: "var(--lavender-muted)" } : {}}
                >
                  <span className="mt-0.5 text-base">
                    {NOTIFICATION_ICONS[notif.type] ?? "🔔"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium" style={{ color: "var(--ink)" }}>
                      {notif.title}
                    </p>
                    {notif.body && (
                      <p className="mt-0.5 text-[11px] line-clamp-2" style={{ color: "var(--ink-tertiary)" }}>
                        {notif.body}
                      </p>
                    )}
                    <p className="mt-0.5 text-[10px]" style={{ color: "var(--ink-muted)" }}>
                      {timeAgo(notif.createdAt)}
                    </p>
                  </div>
                  {!notif.read && (
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: "var(--lavender)" }}
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
