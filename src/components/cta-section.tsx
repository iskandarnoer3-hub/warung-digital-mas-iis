'use client'

import { Button } from '@/components/ui/button'
import { Send, MessageCircle } from 'lucide-react'

export default function CTASection() {
  const handleScrollToChat = () => {
    const el = document.querySelector('#chat')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16">
      <div className="relative bg-gradient-to-r from-violet-950/50 to-black rounded-3xl border border-zinc-800 overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute inset-0 bg-violet-500/5 blur-3xl" />

        <div className="relative z-10 text-center py-16 px-6 sm:px-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Siap Beresin Semua Urusan?
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto mb-8 text-lg">
            Jangan tunda lagi! Hubungi kami sekarang dan dapatkan solusi terbaik
            untuk kebutuhan Anda. Warung Solusi — ada yang bisa, kami solusi!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={handleScrollToChat}
              className="bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white rounded-xl h-12 px-8 text-base font-medium shadow-lg shadow-violet-500/25"
            >
              <Send className="size-4 mr-2" />
              Chat AI
            </Button>
            <a
              href="https://wa.me/62882000858698"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="border-zinc-600 text-white hover:bg-zinc-800 rounded-xl h-12 px-8 text-base"
              >
                <MessageCircle className="size-4 mr-2" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
