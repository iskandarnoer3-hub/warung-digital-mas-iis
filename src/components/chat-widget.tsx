'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Halo! Ada yang bisa saya bantu? Tanya aja tentang jasa Mas Iis!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef(
    typeof window !== 'undefined'
      ? localStorage.getItem('prof_sid') || 'p' + Date.now().toString(36)
      : 'p1'
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  // Auto open after 4 seconds (only first visit)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!localStorage.getItem('prof_chat_opened')) {
        setOpen(true);
        localStorage.setItem('prof_chat_opened', '1');
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages((prev) => [...prev, { role: 'user', content: text.trim() }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          sessionId: sessionIdRef.current,
        }),
      });
      const data = await res.json();
      const reply =
        data.reply || data.data?.reply || 'Maaf kak, coba lagi ya.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Server sibuk. WA Mas Iis: 0882-0008-58698' },
      ]);
    }
    setLoading(false);
  }, [loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 text-white shadow-[0_8px_30px_rgba(139,92,246,0.5)] hover:shadow-[0_8px_40px_rgba(139,92,246,0.7)] flex items-center justify-center transition-all hover:scale-110 group"
        style={{
          animation: !open ? 'pulse-glow 2s infinite' : 'none',
        }}
        aria-label="Chat dengan AI"
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#09090b] animate-pulse" />
        )}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-[#111113] border border-[#262626] rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          style={{ animation: 'slide-up 0.3s ease-out' }}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-violet-600 to-violet-500 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white text-sm">
                AI Mas Iis
              </div>
              <div className="flex items-center gap-1 text-xs text-white/80">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                Online
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 h-[350px] overflow-y-auto p-4 space-y-3"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'ml-auto bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-br-sm'
                    : 'bg-[#1a1a1e] border border-[#262626] text-zinc-200 rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="max-w-[85%] px-4 py-3 bg-[#1a1a1e] border border-[#262626] rounded-2xl rounded-bl-sm flex gap-1.5">
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-[#262626] flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya jasa..."
              disabled={loading}
              className="flex-1 bg-[#0a0a0b] border-[#262626] text-white text-sm placeholder:text-zinc-500 rounded-xl"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              size="sm"
              className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes pulse-glow {
          0% {
            box-shadow: 0 8px 30px rgba(139, 92, 246, 0.5),
              0 0 0 0 rgba(139, 92, 246, 0.4);
          }
          70% {
            box-shadow: 0 8px 30px rgba(139, 92, 246, 0.5),
              0 0 0 15px rgba(139, 92, 246, 0);
          }
          100% {
            box-shadow: 0 8px 30px rgba(139, 92, 246, 0.5),
              0 0 0 0 rgba(139, 92, 246, 0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
