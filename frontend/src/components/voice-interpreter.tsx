'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VoiceVisualizer } from '@/components/session/voice-visualizer';

interface VoiceInterpreterProps {
  sessionId: string;
  direction: 'toLocal' | 'toEnglish';
}

export function VoiceInterpreter({ sessionId, direction }: VoiceInterpreterProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    setTranscript('');
    setTranslation('');
    setError('');
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        setIsProcessing(true);

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);

        reader.onloadend = async () => {
          try {
            const base64Audio = (reader.result as string).split(',')[1];

            const res = await fetch('/api/interpreter/process-audio', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioBase64: base64Audio, sessionId, direction }),
            });

            if (!res.ok) throw new Error(`API error: ${res.status}`);

            const data = await res.json();
            setTranscript(data.transcript);
            setTranslation(data.translatedText);

            if (data.audioBase64) {
              try {
                const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
                audio.play().catch(e => console.warn('Could not play audio:', e));
              } catch (e) {
                console.warn('Audio playback failed:', e);
              }
            }
          } catch (err) {
            console.error('Processing error:', err);
            setError('Failed to process audio. Please try again.');
          } finally {
            setIsProcessing(false);
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
            }
          }
        };
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access error:', err);
      setError('Microphone access denied. Please check your browser permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="relative space-y-6">
      {/* ── Atmospheric voice overlay ── */}
      <VoiceVisualizer isListening={isRecording} onCancel={stopRecording} />

      {/* ── Push-to-talk trigger ── */}
      <div className="flex justify-center">
        <motion.button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          whileTap={{ scale: 0.95 }}
          disabled={isProcessing}
          className="flex h-24 w-24 items-center justify-center rounded-full text-white shadow-lg transition-colors"
          style={{
            background: isProcessing
              ? 'var(--surface-3)'
              : 'var(--lavender)',
          }}
          aria-label={isRecording ? 'Release to send' : isProcessing ? 'Processing…' : 'Hold to speak'}
        >
          {isProcessing ? (
            <span className="text-sm font-medium" style={{ color: 'var(--cc-void)' }}>
              Wait…
            </span>
          ) : (
            <div className="flex flex-col items-center gap-1" style={{ color: 'var(--inverse-ink)' }}>
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span className="text-[10px] font-semibold uppercase tracking-wide">Hold</span>
            </div>
          )}
        </motion.button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div
          className="rounded-xl p-4 text-sm"
          style={{
            background: 'rgba(255, 77, 79, 0.08)',
            border: '1px solid rgba(255, 77, 79, 0.2)',
            color: 'var(--cc-emergency)',
          }}
        >
          {error}
        </div>
      )}

      {/* ── Transcript + Translation ── */}
      {(transcript || translation) && (
        <div
          className="space-y-4 rounded-xl p-4"
          style={{ background: 'var(--cc-surface)', border: '1px solid var(--cc-border)' }}
        >
          {transcript && (
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--cc-fg-muted)' }}>
                Heard
              </p>
              <p className="text-sm font-medium" style={{ color: 'var(--cc-fg-primary)' }}>
                {transcript}
              </p>
            </div>
          )}
          {translation && (
            <div style={{ borderTop: '1px solid var(--cc-border)', paddingTop: '12px' }}>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--cc-accent)' }}>
                Translated
              </p>
              <p className="text-lg font-semibold" style={{ color: 'var(--cc-fg-primary)' }}>
                {translation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
