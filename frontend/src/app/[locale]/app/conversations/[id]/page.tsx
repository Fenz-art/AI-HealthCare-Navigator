"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Image,
  FileText,
  Shield,
  BookOpen,
  Languages,
  Headphones,
  User,
  CheckCheck,
  Bot,
  Loader2,
  Stethoscope,
  Pill,
  Globe,
  Clock,
  Sparkles,
} from "lucide-react";
import { useConversationsStore } from "@/stores/conversations-store";
import { useSession } from "next-auth/react";
import { PresenceIndicator } from "@/components/real-time/presence-indicator";
import { TypingIndicator } from "@/components/real-time/typing-indicator";
import { ReadReceipt } from "@/components/real-time/read-receipt";
import { EventTimeline } from "@/components/real-time/event-timeline";
import { PatientContextPanel } from "@/components/provider/patient-context-panel";
import { usePresenceStore } from "@/stores/presence-store";
import { api } from "@/lib/api";

const SHARE_OPTIONS = [
  { type: "passport", label: "Share Passport", icon: Shield, desc: "Your health passport" },
  { type: "record", label: "Share Medical Record", icon: FileText, desc: "From your vault" },
  { type: "translation", label: "Share Translation", icon: Languages, desc: "Translated document" },
  { type: "summary", label: "Share Summary", icon: Stethoscope, desc: "Provider summary" },
  { type: "travel", label: "Travel Package", icon: Globe, desc: "Trip health kit" },
];

export default function ConversationDetailPage() {
  const { locale, id } = useParams() as { locale: string; id: string };
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [showShare, setShowShare] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = useConversationsStore((s) => s.activeConversation);
  const fetchConversation = useConversationsStore((s) => s.fetchConversation);
  const sendMessage = useConversationsStore((s) => s.sendMessage);
  const sendAttachment = useConversationsStore((s) => s.sendAttachment);
  const sharePassportInConversation = useConversationsStore((s) => s.sharePassportInConversation);
  const loading = useConversationsStore((s) => s.loading);
  const fetchPresencesForUsers = usePresenceStore((s) => s.fetchPresencesForUsers);

  useEffect(() => {
    fetchConversation(id);
  }, [id, fetchConversation]);

  useEffect(() => {
    if (conversation?.participants) {
      const userIds = conversation.participants.map((p) => p.userId);
      fetchPresencesForUsers(userIds);
    }
  }, [conversation?.participants, fetchPresencesForUsers]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages.length]);

  useEffect(() => {
    if (!conversation || !session?.user?.id) return;
    api.markConversationReadAll(id, session.user.id).catch(() => {});
  }, [id, conversation?.messages.length, session?.user?.id]);

  const handleSend = useCallback(() => {
    if (!input.trim() || !session?.user?.id) return;
    sendMessage(id, session.user.id, input);
    setInput("");
  }, [input, id, session?.user?.id, sendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  if (loading && !conversation) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin" style={{ color: "var(--lavender)" }} />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p style={{ color: "var(--ink-tertiary)" }}>Conversation not found</p>
      </div>
    );
  }

  const userRole = session?.user?.role as string | undefined;
  const isProvider = ["DOCTOR", "PHARMACIST", "MEDICAL_ASSISTANT", "CLINIC_STAFF", "HOSPITAL_STAFF"].includes(userRole ?? "");
  const other = conversation.participants.find((p) => p.userId !== session?.user?.id) || conversation.participants[0];
  const patientParticipant = isProvider ? (conversation.participants.find((p) => p.user.role === "PATIENT") || other) : other;
  const senderId = session?.user?.id || "";
  const isMe = (msgSenderId: string | null) => msgSenderId === senderId;

  const initials = (name: string | null) =>
    (name || "?").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleShare = (type: string) => {
    const labels: Record<string, string> = {
      passport: "Health Passport", record: "Medical Record", translation: "Translated Document",
      summary: "Provider Summary", travel: "Travel Package",
    };
    if (type === "passport") {
      sharePassportInConversation(id, senderId, "QUICK");
    } else {
      sendAttachment(id, senderId, type, labels[type] || type);
    }
    setShowShare(false);
  };

  const handleAttach = (type: string) => {
    sendAttachment(id, senderId, type, type === "image" ? "Image.jpeg" : "Document.pdf");
    setShowAttach(false);
  };

  const renderAttachment = (attachment: { type: string; name: string }) => {
    const iconMap: Record<string, typeof Shield> = {
      image: Image, passport: Shield, translation: Languages, document: FileText,
      record: FileText, summary: Stethoscope, travel: Globe, medication: Pill,
    };
    const colorMap: Record<string, string> = {
      image: "var(--ink-tertiary)", passport: "var(--lavender)", translation: "#10b981",
      document: "var(--lavender-hover)", record: "var(--lavender-hover)", summary: "#3b82f6",
      travel: "#8b5cf6", medication: "#f59e0b",
    };
    const Icon = iconMap[attachment.type] || FileText;
    const color = colorMap[attachment.type] || "var(--ink-tertiary)";

    return (
      <div
        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors hover:opacity-90"
        style={{ background: `${color}12`, border: `1px solid ${color}20` }}
      >
        <div className="flex size-8 items-center justify-center rounded-lg" style={{ background: `${color}18` }}>
          <Icon className="size-4" style={{ color }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-medium truncate" style={{ color: "var(--ink)" }}>
            {attachment.name}
          </p>
          <p className="text-[10px]" style={{ color: "var(--ink-tertiary)" }}>
            {attachment.type.charAt(0).toUpperCase() + attachment.type.slice(1)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4" style={{ borderBottom: "1px solid var(--hairline)" }}>
        <Link href={`/${locale}/app/conversations`}
          className="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-[var(--surface-2)]"
          style={{ color: "var(--ink-tertiary)" }}>
          <ArrowLeft className="size-4" />
        </Link>
        <div className="relative shrink-0">
          {other.user.image ? (
            <img src={other.user.image} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold"
              style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}>
              {initials(other.user.name)}
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5">
            <PresenceIndicator userId={other.userId} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold truncate" style={{ color: "var(--ink)" }}>{other.user.name || "Unknown"}</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
              {other.role === "AGENT" ? <Bot className="size-3" /> : <User className="size-3" />}
              {other.role || other.user.role || "Participant"}
            </div>
            <span style={{ color: "var(--hairline-strong)" }}>·</span>
            <PresenceIndicator userId={other.userId} showLabel />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {isProvider && (
            <button
              onClick={() => setShowContext(!showContext)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors hover:bg-[var(--surface-2)]"
              style={{
                color: showContext ? "var(--lavender-hover)" : "var(--ink-subtle)",
                border: "1px solid var(--hairline)",
              }}
            >
              <Stethoscope className="size-3.5" />
              Context
            </button>
          )}
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors hover:bg-[var(--surface-2)]"
            style={{
              color: showTimeline ? "var(--lavender-hover)" : "var(--ink-subtle)",
              border: "1px solid var(--hairline)",
            }}
          >
            <Clock className="size-3.5" />
            Events
          </button>
          <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors hover:bg-[var(--surface-2)]"
            style={{ color: "var(--lavender-hover)", border: "1px solid rgba(94,106,210,0.2)" }}>
            <Headphones className="size-3.5" />
            Interpreter
          </button>
        </div>
      </div>

      {/* Messages + Timeline */}
      <div className="flex flex-1 gap-0 overflow-hidden">
        {/* Messages */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-3 overflow-y-auto py-4 px-1">
            {conversation.messages.map((msg) => {
              const mine = isMe(msg.senderId);
              return (
                <motion.div key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] space-y-1 ${mine ? "items-end" : "items-start"}`}>
                    {!mine && (
                      <p className="text-[11px] font-medium px-1" style={{ color: "var(--ink-tertiary)" }}>
                        {conversation.participants.find((p) => p.userId === msg.senderId)?.user.name || msg.senderType}
                      </p>
                    )}
                    <div className={`rounded-2xl px-4 py-2.5 ${mine ? "rounded-br-md" : "rounded-bl-md"}`}
                      style={{
                        background: mine ? "var(--lavender)" : "var(--surface-2)",
                        color: mine ? "var(--inverse-ink)" : "var(--ink)",
                      }}>
                      {msg.attachments.length > 0 ? (
                        <div className="space-y-1.5">
                          {msg.attachments.map((att) => (
                            <div key={att.id}>{renderAttachment(att)}</div>
                          ))}
                          {msg.content && !msg.content.startsWith("Shared:") && (
                            <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                    <div className={`flex items-center gap-2 px-1 ${mine ? "justify-end" : "justify-start"}`}>
                      <p className="text-[10px]" style={{ color: "var(--ink-tertiary)" }}>{formatTime(msg.createdAt)}</p>
                      <ReadReceipt messageId={msg.id} messageStatus={msg.status} isMine={mine} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div className="px-1">
              <TypingIndicator conversationId={id} currentUserId={senderId} />
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Share menu */}
          <AnimatePresence>
            {showShare && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="mb-2 rounded-xl border p-3" style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: "var(--ink-tertiary)" }}>Share from your workspace</p>
                <div className="flex flex-wrap gap-2">
                  {SHARE_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button key={opt.type} onClick={() => handleShare(opt.type)}
                        className="flex flex-1 flex-col items-center gap-1.5 rounded-lg border p-3 min-w-[100px] transition-colors hover:bg-[var(--surface-2)]"
                        style={{ borderColor: "var(--hairline)" }}>
                        <Icon className="size-5" style={{ color: "var(--lavender)" }} />
                        <span className="text-[11px] font-medium" style={{ color: "var(--ink)" }}>{opt.label}</span>
                        <span className="text-[10px]" style={{ color: "var(--ink-tertiary)" }}>{opt.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Attach menu */}
          <AnimatePresence>
            {showAttach && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="mb-2 rounded-xl border p-3" style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: "var(--ink-tertiary)" }}>Attach file</p>
                <div className="flex gap-2">
                  <button onClick={() => handleAttach("image")}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-[12px] transition-colors hover:bg-[var(--surface-2)]"
                    style={{ borderColor: "var(--hairline)" }}>
                    <Image className="size-4" style={{ color: "var(--ink-tertiary)" }} /> Image
                  </button>
                  <button onClick={() => handleAttach("document")}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-[12px] transition-colors hover:bg-[var(--surface-2)]"
                    style={{ borderColor: "var(--hairline)" }}>
                    <FileText className="size-4" style={{ color: "var(--ink-tertiary)" }} /> Document
                  </button>
                  <button onClick={() => handleAttach("medication")}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-[12px] transition-colors hover:bg-[var(--surface-2)]"
                    style={{ borderColor: "var(--hairline)" }}>
                    <Pill className="size-4" style={{ color: "var(--ink-tertiary)" }} /> Medication
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          <div className="flex items-end gap-2 pb-1 pt-3" style={{ borderTop: "1px solid var(--hairline)" }}>
            <div className="relative flex flex-1 items-end rounded-xl border px-3 py-2"
              style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}>
              <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="max-h-32 min-h-[24px] flex-1 resize-none bg-transparent text-[13px] outline-none"
                style={{ color: "var(--ink)", caretColor: "var(--lavender)" }} />
              <div className="flex items-center gap-1 ml-2">
                <button onClick={() => { setShowShare(false); setShowAttach(!showAttach); }}
                  className="flex size-7 items-center justify-center rounded-lg transition-colors hover:bg-[var(--surface-2)]"
                  style={{ color: "var(--ink-tertiary)" }}>
                  <Paperclip className="size-4" />
                </button>
                <button onClick={() => { setShowAttach(false); setShowShare(!showShare); }}
                  className="flex size-7 items-center justify-center rounded-lg transition-colors hover:bg-[var(--surface-2)]"
                  style={{ color: "var(--lavender)" }}>
                  <Shield className="size-4" />
                </button>
              </div>
            </div>
            <button onClick={handleSend} disabled={!input.trim() || !senderId}
              className="flex size-10 items-center justify-center rounded-xl transition-all disabled:opacity-40"
              style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}>
              <Send className="size-4" />
            </button>
          </div>
        </div>

        {/* Patient Context Panel sidebar */}
        {showContext && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 overflow-hidden"
            style={{ borderLeft: "1px solid var(--hairline)" }}
          >
            <div className="w-[280px] overflow-y-auto max-h-[calc(100vh-200px)]">
              <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--hairline)" }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
                  Patient Context
                </p>
              </div>
              <PatientContextPanel
                patientId={patientParticipant?.userId ?? undefined}
                patientName={patientParticipant?.user?.name ?? undefined}
              />
            </div>
          </motion.div>
        )}

        {/* Event Timeline sidebar */}
        {showTimeline && !showContext && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 overflow-hidden"
            style={{ borderLeft: "1px solid var(--hairline)" }}
          >
            <div className="w-[260px]">
              <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--hairline)" }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
                  Event Timeline
                </p>
              </div>
              <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                <EventTimeline conversationId={id} />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
