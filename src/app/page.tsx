'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import StatsBar from '@/components/stats-bar';
import ServicesSection from '@/components/services-section';
import ChatSection from '@/components/chat-section';
import ArticlesSection from '@/components/articles-section';
import FAQSection from '@/components/faq-section';
import CTASection from '@/components/cta-section';
import Footer from '@/components/footer';
import ChatWidget from '@/components/chat-widget';
import AdminPanel from '@/components/admin-panel';
import ServiceFullPage from '@/components/service-full-page';

export default function Home() {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const handleAskAI = useCallback((query: string) => {
    // Navigate back to home first, then trigger chat
    setSelectedServiceId(null);
    // Use setTimeout to ensure we're on the home page before scrolling
    setTimeout(() => {
      const event = new CustomEvent('ask-ai', { detail: query });
      window.dispatchEvent(event);
      const chatEl = document.getElementById('chat');
      if (chatEl) {
        chatEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }, []);

  // If a service is selected, show the full-page service view
  if (selectedServiceId) {
    return (
      <ServiceFullPage
        serviceId={selectedServiceId}
        onBack={() => setSelectedServiceId(null)}
        onAskAI={handleAskAI}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b]">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <StatsBar />
        <ServicesSection onSelectService={setSelectedServiceId} />
        <ChatSection />
        <ArticlesSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />

      {/* Floating Chat Widget */}
      <ChatWidget />

      {/* Admin Panel (Ctrl+Shift+A) */}
      <AdminPanel />
    </div>
  );
}
