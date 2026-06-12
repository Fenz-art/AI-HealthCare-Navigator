'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

export function AssistanceChat({ sessionId, onRequestChange }: AssistanceChatProps) {
  const t = useTranslations('assistance');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [hasRequested, setHasRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll for messages
  useEffect(() => {
    if (!hasRequested) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat?sessionId=${sessionId}`);
        const { data } = await res.json();
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [sessionId, hasRequested]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleRequestAssistance = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/assistance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (res.ok) {
        setHasRequested(true);
      }
    } catch (error) {
      console.error('Failed to request assistance:', error);
    } finally {
      setIsLoading(false);
    }
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
      
      // Fetch updated messages
      const res = await fetch(`/api/chat?sessionId=${sessionId}`);
      const { data } = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!hasRequested) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] p-6 text-center space-y-4">
        <div className="text-5xl">🤝</div>
        <h2 className="text-xl font-semibold text-slate-900">Need Human Help?</h2>
        <p className="text-sm text-slate-500 max-w-xs">
          Connect with a CareCompass assistant. They already know your symptoms, allergies, and location.
        </p>
        <Button 
          className="bg-teal-600 hover:bg-teal-700 text-white px-8"
          onClick={handleRequestAssistance}
          disabled={isLoading}
        >
          {isLoading ? 'Requesting...' : 'Request Assistance'}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            Waiting for an assistant to join...
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.senderType === 'TRAVELER' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                  msg.senderType === 'TRAVELER' 
                    ? 'bg-teal-600 text-white' 
                    : msg.senderType === 'SYSTEM' 
                    ? 'bg-slate-200 text-slate-700 italic' 
                    : 'bg-white border border-slate-200 text-slate-900'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex gap-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="bg-slate-50 border-slate-200"
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim()}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
