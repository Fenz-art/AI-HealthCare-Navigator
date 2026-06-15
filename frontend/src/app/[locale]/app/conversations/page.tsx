"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Search,
  User,
  ChevronRight,
  Shield,
  Bot,
  Loader2,
} from "lucide-react";
import { useConversationsStore } from "@/stores/conversations-store";
import { useSession } from "next-auth/react";
import { PresenceIndicator } from "@/components/real-time/presence-indicator";
import { usePresenceStore } from "@/stores/presence-store";

export default function ConversationsPage() {
  const { locale } = useParams() as { locale: string };
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const conversations = useConversationsStore((s) => s.conversations);
  const fetchConversations = useConversationsStore((s) => s.fetchConversations);
  const loading = useConversationsStore((s) => s.loading);
  const fetchPresencesForUsers = usePresenceStore((s) => s.fetchPresencesForUsers);

  useEffect(() => {
    if (session?.user?.id) {
      fetchConversations(session.user.id);
    }
  }, [session?.user?.id, fetchConversations]);

  useEffect(() => {
    if (conversations.length > 0) {
      const userIds = conversations.flatMap((c) =>
        c.participants.map((p) => p.userId)
      );
      fetchPresencesForUsers([...new Set(userIds)]);
    }
  }, [conversations, fetchPresencesForUsers]);

  const filtered = conversations.filter((c) => {
    const search = query.toLowerCase();
    return c.title?.toLowerCase().includes(search) ||
      c.participants.some((p) => p.user.name?.toLowerCase().includes(search));
  });

  const initials = (name: string | null) =>
    (name || "?").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const lastMessage = (conv: typeof conversations[0]) => {
    const msgs = conv.messages;
    if (msgs.length === 0) return "No messages yet";
    const last = msgs[msgs.length - 1];
    return last.content.length > 80 ? last.content.slice(0, 80) + "..." : last.content;
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--lavender-hover)" }}>
            Communication
          </p>
          <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-tight" style={{ color: "var(--ink)", letterSpacing: "-0.6px" }}>
            Conversations
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "var(--ink-subtle)" }}>
            Persistent threads · Share passports, records, translations
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--ink-tertiary)" }} />
        <input value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search conversations..."
          className="h-10 w-full rounded-xl pl-10 pr-4 text-[13px] outline-none transition-colors focus:ring-2"
          style={{ background: "var(--surface-1)", border: "1px solid var(--hairline)", color: "var(--ink)", caretColor: "var(--lavender)" }} />
      </div>

      <motion.div initial="hidden" animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        className="divide-y overflow-hidden rounded-xl border"
        style={{ borderColor: "var(--hairline)" }}>
        {loading && conversations.length === 0 && (
          <div className="flex flex-col items-center py-16">
            <Loader2 className="size-8 animate-spin" style={{ color: "var(--lavender)" }} />
            <p className="mt-3 text-[13px]" style={{ color: "var(--ink-tertiary)" }}>Loading conversations...</p>
          </div>
        )}
        {!loading && filtered.map((conv) => {
          const other = conv.participants.find((p) => p.userId !== session?.user?.id) || conv.participants[0];
          return (
            <Link key={conv.id} href={`/${locale}/app/conversations/${conv.id}`}
              className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--surface-2)]"
              style={{ background: "var(--surface-1)" }}>
              <div className="relative shrink-0">
                {other.user.image ? (
                  <img src={other.user.image} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full text-[12px] font-bold"
                    style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}>
                    {other.user.role === "DOCTOR" ? "MD" : initials(other.user.name)}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5">
                  <PresenceIndicator userId={other.userId} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-semibold truncate" style={{ color: "var(--ink)" }}>
                    {other.user.name || "Unknown"}
                  </p>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>
                  <span className="flex items-center gap-1">
                    {other.role === "AGENT" ? <Bot className="size-3" /> : <User className="size-3" />}
                    {other.role || other.user.role || "Participant"}
                  </span>
                </div>
                <p className="mt-1 text-[13px] truncate" style={{ color: "var(--ink-tertiary)" }}>
                  {lastMessage(conv)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[11px] tabular-nums" style={{ color: "var(--ink-tertiary)" }}>
                  {conv.messages.length > 0 ? timeAgo(conv.messages[conv.messages.length - 1].createdAt) : ""}
                </span>
                <ChevronRight className="size-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" style={{ color: "var(--ink-tertiary)" }} />
              </div>
            </Link>
          );
        })}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center py-16">
            <MessageCircle className="size-10" style={{ color: "var(--ink-tertiary)" }} />
            <p className="mt-4 text-[15px] font-medium" style={{ color: "var(--ink-muted)" }}>No conversations yet</p>
            <p className="mt-1 text-[13px]" style={{ color: "var(--ink-tertiary)" }}>Start a session or share your passport to connect</p>
          </div>
        )}
      </motion.div>

      <div className="flex items-center gap-3 rounded-xl px-4 py-3"
        style={{ background: "var(--surface-1)", border: "1px solid var(--hairline)" }}>
        <Shield className="size-4 shrink-0" style={{ color: "var(--lavender)" }} />
        <p className="text-[12px]" style={{ color: "var(--ink-subtle)" }}>No internal identifiers shown. Only avatar, name, role, and language are visible.</p>
      </div>
    </div>
  );
}
