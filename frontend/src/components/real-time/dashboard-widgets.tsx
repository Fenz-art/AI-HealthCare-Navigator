"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Activity,
  ArrowRight,
  MessageCircle,
  Shield,
  FileText,
  Clock,
  Bot,
} from "lucide-react";
import { useActivityStore } from "@/stores/activity-store";
import { useNotificationsStore } from "@/stores/notifications-store";
import { useConversationsStore } from "@/stores/conversations-store";
import { api } from "@/lib/api";

export function RecentActivityWidget() {
  const { locale } = useParams() as { locale: string };
  const { data: session } = useSession();
  const activities = useActivityStore((s) => s.activities);
  const fetchUserActivity = useActivityStore((s) => s.fetchUserActivity);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserActivity(session.user.id, 5);
    }
  }, [session?.user?.id, fetchUserActivity]);

  if (activities.length === 0) return null;

  return (
    <div className="divide-y overflow-hidden rounded-xl border" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
      {activities.slice(0, 5).map((item) => (
        <div key={item.id} className="flex items-center gap-3 px-4 py-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--surface-2)" }}>
            <Activity className="size-4" style={{ color: "var(--ink-subtle)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium truncate" style={{ color: "var(--ink)" }}>{item.title}</p>
            {item.description && (
              <p className="text-[12px] truncate" style={{ color: "var(--ink-subtle)" }}>{item.description}</p>
            )}
          </div>
          <span className="shrink-0 text-[11px] tabular-nums" style={{ color: "var(--ink-tertiary)" }}>
            {timeAgo(item.createdAt)}
          </span>
        </div>
      ))}
      <Link href={`/${locale}/app/activity`} className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-[12px] transition-colors hover:bg-[var(--surface-2)]" style={{ color: "var(--ink-tertiary)" }}>
        View all activity <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}

export function UnreadConversationsWidget() {
  const { locale } = useParams() as { locale: string };
  const { data: session } = useSession();
  const conversations = useConversationsStore((s) => s.conversations);
  const fetchConversations = useConversationsStore((s) => s.fetchConversations);

  useEffect(() => {
    if (session?.user?.id) {
      fetchConversations(session.user.id);
    }
  }, [session?.user?.id, fetchConversations]);

  const unread = conversations.filter((c) => {
    const myParticipation = c.participants.find((p) => p.userId === session?.user?.id);
    if (!myParticipation?.lastReadAt) return c.messages.length > 0;
    const lastMsg = c.messages[c.messages.length - 1];
    if (!lastMsg) return false;
    return new Date(lastMsg.createdAt) > new Date(myParticipation.lastReadAt);
  });

  if (conversations.length === 0) return null;

  return (
    <div className="divide-y overflow-hidden rounded-xl border" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="text-[11px] font-semibold" style={{ color: "var(--ink)" }}>Conversations</span>
        {unread.length > 0 && (
          <span className="rounded-full px-1.5 py-0.5 text-[10px] font-medium" style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}>
            {unread.length} unread
          </span>
        )}
      </div>
      {conversations.slice(0, 4).map((conv) => {
        const other = conv.participants.find((p) => p.userId !== session?.user?.id) || conv.participants[0];
        const lastMsg = conv.messages[conv.messages.length - 1];
        return (
          <Link key={conv.id} href={`/${locale}/app/conversations/${conv.id}`}
            className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--surface-2)]">
            <MessageCircle className="size-4 shrink-0" style={{ color: "var(--ink-tertiary)" }} />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium truncate" style={{ color: "var(--ink)" }}>{other.user.name || "Unknown"}</p>
              {lastMsg && (
                <p className="text-[11px] truncate" style={{ color: "var(--ink-tertiary)" }}>{lastMsg.content}</p>
              )}
            </div>
          </Link>
        );
      })}
      <Link href={`/${locale}/app/conversations`} className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-[12px] transition-colors hover:bg-[var(--surface-2)]" style={{ color: "var(--ink-tertiary)" }}>
        View all conversations <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}

export function PendingTasksWidget() {
  const { locale } = useParams() as { locale: string };
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<{ running: number; queued: number; failed: number }>({ running: 0, queued: 0, failed: 0 });

  useEffect(() => {
    if (!session?.user?.id) return;
    api.getUserTasksGrouped(session.user.id).then((grouped) => {
      setTasks({
        running: grouped.running.length,
        queued: grouped.queued.length,
        failed: grouped.failed.length,
      });
    }).catch(() => {});
  }, [session?.user?.id]);

  const total = tasks.running + tasks.queued;
  if (total === 0 && tasks.failed === 0) return null;

  return (
    <div className="rounded-xl border p-4" style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bot className="size-4" style={{ color: "var(--ink-subtle)" }} />
          <span className="text-[11px] font-semibold" style={{ color: "var(--ink)" }}>Agent Tasks</span>
        </div>
        <Link href={`/${locale}/app/agent`} className="text-[11px]" style={{ color: "var(--lavender-hover)" }}>
          View all
        </Link>
      </div>
      <div className="flex gap-3">
        {total > 0 && (
          <div className="flex-1 rounded-lg p-3" style={{ background: "var(--surface-2)" }}>
            <p className="text-[20px] font-semibold" style={{ color: "var(--lavender)" }}>{total}</p>
            <p className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>Active</p>
          </div>
        )}
        {tasks.failed > 0 && (
          <div className="flex-1 rounded-lg p-3" style={{ background: "var(--surface-2)" }}>
            <p className="text-[20px] font-semibold" style={{ color: "#ef4444" }}>{tasks.failed}</p>
            <p className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>Failed</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function PassportSharesWidget() {
  const { locale } = useParams() as { locale: string };
  const { data: session } = useSession();
  const [shares, setShares] = useState<number>(0);

  useEffect(() => {
    if (!session?.user?.id) return;
    api.getUserSharedPassports(session.user.id).then((data) => {
      setShares(Array.isArray(data) ? data.length : 0);
    }).catch(() => {});
  }, [session?.user?.id]);

  if (shares === 0) return null;

  return (
    <Link href={`/${locale}/app/passport/shares`}
      className="flex items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-[var(--surface-2)]"
      style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}>
      <div className="flex size-9 items-center justify-center rounded-lg" style={{ background: "var(--surface-2)" }}>
        <Shield className="size-4" style={{ color: "var(--lavender)" }} />
      </div>
      <div className="flex-1">
        <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>{shares} Shared Passport{shares !== 1 ? "s" : ""}</p>
        <p className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>Active shares across conversations</p>
      </div>
      <ArrowRight className="size-4" style={{ color: "var(--ink-tertiary)" }} />
    </Link>
  );
}

export function DocumentProcessingWidget() {
  const { data: session } = useSession();
  const [processing, setProcessing] = useState(0);

  useEffect(() => {
    if (!session?.user?.id) return;
    api.getUserTasks(session.user.id, "PROCESSING").then((tasks) => {
      setProcessing(tasks.length);
    }).catch(() => {});
  }, [session?.user?.id]);

  if (processing === 0) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl border p-4" style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}>
      <div className="flex size-9 items-center justify-center rounded-lg" style={{ background: "var(--lavender-muted)" }}>
        <FileText className="size-4" style={{ color: "var(--lavender)" }} />
      </div>
      <div className="flex-1">
        <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>Processing {processing} document{processing !== 1 ? "s" : ""}</p>
        <div className="mt-1 h-1.5 w-full rounded-full" style={{ background: "var(--surface-3)" }}>
          <div className="h-1.5 animate-pulse rounded-full" style={{ background: "var(--lavender)", width: "60%" }} />
        </div>
      </div>
    </div>
  );
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
