'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Loader2, Send } from 'lucide-react';

interface Message {
  id: string;
  senderType: 'TRAVELER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  createdAt: string;
}

interface AssistanceChatProps {
  sessionId: string;
  onRequestChange?: (hasRequested: boolean) => void;
}

/**
 * NATURAL SPRINT — Assistance chat.
 * Surface ladder. Lavender CTAs. No teal/slate.
 */
export function AssistanceChat({ sessionId, onRequestChange }: AssistanceChatProps) {
  const t = useTranslations('assistance');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [hasRequested, setHasRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasRequested) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat?sessionId=${sessionId}`);
        const { data } = await res.json();
        setMessages(data);
      } catch {}
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [sessionId, hasRequested]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleRequest = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/assistance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      if (res.ok) { setHasRequested(true); onRequestChange?.(true); }
    } catch {}
    finally { setIsLoading(false); }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const message = input;
    setInput('');
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, content: message, senderType: 'TRAVELER' }),
      });
      const res = await fetch(`/api/chat?sessionId=${sessionId}`);
      const { data } = await res.json();
      setMessages(data);
    } catch {}
  };

  if (!hasRequested) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 px-6 py-16 text-center">
        <div className="text-4xl">🤝</div>
        <div>
          <h2 className="text-[16px] font-semibold" style={{ color: "var(--ink)" }}>Need human help?</h2>
          <p className="mt-1 text-[13px] max-w-xs" style={{ color: "var(--ink-subtle)" }}>
            Connect with a CareCompass assistant. They already know your symptoms, allergies, and location.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary gap-2"
          onClick={handleRequest}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="size-3.5 animate-spin" />}
          {isLoading ? 'Requesting…' : 'Request Assistance'}
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex h-[70vh] flex-col overflow-hidden rounded-md lifted-panel"
      style={{ background: "var(--surface-1)" }}
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-[13px]" style={{ color: "var(--ink-tertiary)" }}>
            Waiting for an assistant to join…
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.senderType === 'TRAVELER' ? 'justify-end' : 'justify-start'}`}>
              <div
                className="max-w-[78%] rounded px-3 py-2 text-[13px]"
                style={{
                  background:
                    msg.senderType === 'TRAVELER' ? 'var(--lavender)'
                    : msg.senderType === 'SYSTEM'   ? 'var(--surface-3)'
                    : 'var(--surface-2)',
                  color:
                    msg.senderType === 'TRAVELER' ? 'var(--inverse-ink)'
                    : msg.senderType === 'SYSTEM'  ? 'var(--ink-tertiary)'
                    : 'var(--ink-muted)',
                  border: msg.senderType !== 'TRAVELER' ? '1px solid var(--hairline)' : 'none',
                  fontStyle: msg.senderType === 'SYSTEM' ? 'italic' : 'normal',
                }}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input row */}
      <div className="flex gap-2 p-3" style={{ borderTop: "1px solid var(--hairline)" }}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message…"
          className="flex-1 text-[13px]"
          style={{
            background: "var(--surface-3)",
            border: "1px solid var(--hairline)",
            color: "var(--ink)",
          }}
        />
        <button
          type="button"
          className="btn-primary gap-1.5"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          <Send className="size-3.5" />
          Send
        </button>
      </div>
    </div>
  );
}
