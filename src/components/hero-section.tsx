'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageCircle, Send, MapPin, Star, Users, Zap } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const stats = [
  { icon: <Zap className="w-4 h-4" />, label: '17 Jasa Lengkap', value: '' },
  { icon: <Users className="w-4 h-4" />, label: '500+ Pelanggan', value: '' },
  { icon: <Star className="w-4 h-4" />, label: 'Rating 4.9/5', value: '' },
]

export default function HeroSection() {
  const [heroImage, setHeroImage] = useState('/hero-bg-new.png')

  useEffect(() => {
    async function loadHeroImage() {
      try {
        // CRITICAL: cache: 'no-store' to always get fresh data from DB
        // Without this, browser caches old hero_image and new upload won't show
        const res = await fetch('/api/site-config', { cache: 'no-store' })
        const data = await res.json()
        if (data.success && data.data?.hero_image) {
          setHeroImage(data.data.hero_image)
        }
      } catch {
        // Use default hero image
      }
    }
    loadHeroImage()
  }, [])

  const handleScrollToChat = () => {
    const el = document.querySelector('#chat')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative pt-16 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Mas Iis Warung Solusi"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/90 to-[#09090b]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-[#09090b]/50" />
      </div>

      <div className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column */}
          <motion.div
            className="flex flex-col gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 px-3 py-1.5 text-sm font-medium rounded-full">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                AI Online 24/7
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
              variants={itemVariants}
            >
              <span className="bg-gradient-to-r from-violet-400 via-violet-500 to-pink-500 bg-clip-text text-transparent">
                Warung Solusi
              </span>
              <br />
              <span className="text-white">Terpercaya di</span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                Cirebon
              </span>
            </motion.h1>

            <motion.p
              className="text-zinc-400 text-lg max-w-md leading-relaxed"
              variants={itemVariants}
            >
              Dari servis laptop, bimbingan skripsi, hingga hias taman - semua
              bisa ditanyakan langsung ke AI kami yang siap melayani 24 jam.
            </motion.p>

            <motion.div className="flex items-center gap-2 text-zinc-500 text-sm" variants={itemVariants}>
              <MapPin className="w-4 h-4 text-violet-400" />
              <span>Sindanglaut, Kab. Cirebon</span>
            </motion.div>

            <motion.div className="flex flex-wrap gap-3" variants={itemVariants}>
              <Button
                onClick={handleScrollToChat}
                className="bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white rounded-xl h-12 px-6 text-base font-medium shadow-lg shadow-violet-500/25"
              >
                <Send className="size-4 mr-2" />
                Chat AI Sekarang
              </Button>
              <a
                href="https://wa.me/62882000858698"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl h-12 px-6 text-base"
                >
                  <MessageCircle className="size-4 mr-2" />
                  WhatsApp
                </Button>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div className="flex flex-wrap gap-6 mt-2" variants={itemVariants}>
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2 text-zinc-400 text-sm">
                  <span className="text-violet-400">{stat.icon}</span>
                  {stat.label}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right column: Professional image with chat overlay */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-violet-500/5 rounded-3xl blur-2xl" />

              {/* Main image */}
              <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
                <img
                  src={heroImage}
                  alt="Mas Iis Warung Solusi"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent" />

                {/* Floating chat bubble */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-[#111113]/90 backdrop-blur-xl border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center overflow-hidden">
                        <img src="/logo-new.png" alt="Mas Iis" className="w-6 h-6 rounded-full" />
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">Mas Iis AI</div>
                        <div className="text-emerald-400 text-xs flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Online
                        </div>
                      </div>
                    </div>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      Halo! Saya AI Mas Iis. Silakan tanyakan tentang layanan kami - servis laptop, bimbingan skripsi, desain grafis, dan 14 jasa lainnya!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
