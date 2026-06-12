'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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
      // Cleanup: stop any active streams
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
            
            if (!res.ok) {
              throw new Error(`API error: ${res.status}`);
            }

            const data = await res.json();
            setTranscript(data.transcript);
            setTranslation(data.translatedText);
            
            // Play response audio if available
            if (data.audioBase64) {
              try {
                const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
                audio.play().catch(e => console.warn('Could not play audio:', e));
              } catch (e) {
                console.warn('Audio playback failed:', e);
              }
            }
          } catch (error) {
            console.error('Processing error:', error);
            setError('Failed to process audio. Please try again.');
          } finally {
            setIsProcessing(false);
            // Stop all tracks
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
            }
          }
        };
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone access error:', error);
      setError('Microphone access denied. Please check your browser permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <motion.button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          whileTap={{ scale: 0.95 }}
          className={`w-32 h-32 rounded-full flex items-center justify-center text-white shadow-lg transition-colors ${
            isRecording ? 'bg-red-500' : isProcessing ? 'bg-amber-500' : 'bg-teal-600 hover:bg-teal-700'
          }`}
          disabled={isProcessing}
        >
          {isRecording ? (
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-white rounded-sm animate-pulse" />
              <span className="mt-2 text-xs font-medium">Release</span>
            </div>
          ) : isProcessing ? (
            <span className="text-sm font-medium">Wait...</span>
          ) : (
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span className="mt-2 text-xs font-medium">Hold</span>
            </div>
          )}
        </motion.button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {(transcript || translation) && (
        <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          {transcript && (
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Heard:</p>
              <p className="text-slate-900 font-medium">{transcript}</p>
            </div>
          )}
          {translation && (
            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs font-medium text-teal-600 mb-1">Translated:</p>
              <p className="text-slate-900 font-semibold text-lg">{translation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
