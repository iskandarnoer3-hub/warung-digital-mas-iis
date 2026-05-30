'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Sparkles, Monitor, GraduationCap, Flower2, Video, Coins } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_BUTTONS = [
  { label: 'Servis Laptop', icon: <Monitor className="w-3.5 h-3.5" />, query: 'Servis laptop & MacBook berapa?' },
  { label: 'Bimbingan Skripsi', icon: <GraduationCap className="w-3.5 h-3.5" />, query: 'Bimbingan skripsi/tesis/disertasi berapa?' },
  { label: 'Hias Taman', icon: <Flower2 className="w-3.5 h-3.5" />, query: 'Jasa hias taman profesional berapa?' },
  { label: 'Agency Acara', icon: <Video className="w-3.5 h-3.5" />, query: 'Jasa agency acara lengkap berapa?' },
  { label: 'Cek Turnitin & AI', icon: <Coins className="w-3.5 h-3.5" />, query: 'Jasa cek Turnitin & AI berapa?' },
];

export default function ChatSection() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Halo! Saya AI CS Mas Iis. Ada 17 jasa: servis laptop, bimbingan skripsi, bikin website, jasa MC, dan lainnya. Mau tanya yang mana?',
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

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
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
        data.reply || data.data?.reply || 'Maaf kak, coba lagi ya. Langsung WA Mas Iis: 0882-0008-58698';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Maaf, server lagi sibuk. Langsung WA Mas Iis: 0882-0008-58698',
        },
      ]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('prof_sid', sessionIdRef.current);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Listen for custom events from service cards
  useEffect(() => {
    const handler = (e: Event) => {
      const query = (e as CustomEvent).detail as string;
      if (query) {
        sendMessage(query);
      }
    };
    window.addEventListener('ask-ai', handler as EventListener);
    return () =>
      window.removeEventListener('ask-ai', handler as EventListener);
  }, [sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) sendMessage(input);
  };

  return (
    <section id="chat" className="py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Tanya AI Mas Iis
          </h2>
          <p className="text-zinc-400">
            Chat 24/7, balas 3 detik. Tanya harga, jadwal, atau apapun.
          </p>
        </div>

        <div className="bg-[#111113] border border-[#262626] rounded-2xl overflow-hidden">
          {/* Chat Header */}
          <div className="px-5 py-4 border-b border-[#262626] bg-[#0a0a0b] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">
                AI Mas Iis
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Online • Balas 3 detik
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="h-[400px] overflow-y-auto p-5 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center ${
                      msg.role === 'user'
                        ? 'bg-violet-600'
                        : 'bg-[#1a1a1e] border border-[#262626]'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-br-sm'
                        : 'bg-[#1a1a1e] border border-[#262626] text-zinc-200 rounded-bl-sm'
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: msg.content.replace(/\n/g, '<br/>'),
                    }}
                  />
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#1a1a1e] border border-[#262626] flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <div className="px-4 py-3 bg-[#1a1a1e] border border-[#262626] rounded-2xl rounded-bl-sm flex gap-1.5">
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Buttons */}
          <div className="px-4 py-2 border-t border-[#262626] flex gap-2 overflow-x-auto scrollbar-hide">
            {QUICK_BUTTONS.map((btn) => (
              <button
                key={btn.label}
                onClick={() => sendMessage(btn.query)}
                disabled={loading}
                className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-[#1a1a1e] border border-[#262626] rounded-full text-xs text-zinc-300 hover:bg-violet-600 hover:border-violet-600 hover:text-white transition-all disabled:opacity-50"
              >
                {btn.icon}
                {btn.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-[#262626] flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pertanyaan..."
              disabled={loading}
              className="flex-1 bg-[#0a0a0b] border-[#262626] text-white placeholder:text-zinc-500 rounded-xl focus:border-violet-500 focus:ring-violet-500/20"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white rounded-xl px-5"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
