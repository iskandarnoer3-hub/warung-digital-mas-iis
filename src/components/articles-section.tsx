'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink, Clock } from 'lucide-react'

interface Article {
  id: string
  title: string
  excerpt: string
  createdAt: string
  slug: string
  [key: string]: unknown
}

// Fallback articles when API is not available
const fallbackArticles: Article[] = [
  {
    id: '1',
    title: '5 Tips Merawat Laptop Agar Awet',
    excerpt:
      'Laptop yang dirawat dengan baik bisa bertahan bertahun-tahun. Berikut tips sederhana yang bisa Anda lakukan untuk menjaga performa laptop tetap optimal.',
    createdAt: '2025-01-15',
    slug: 'tips-merawat-laptop',
  },
  {
    id: '2',
    title: 'Panduan Memilih Jasa Service Komputer',
    excerpt:
      'Tidak semua tempat service komputer sama. Ketahui apa saja yang harus Anda perhatikan sebelum mempercayakan perangkat Anda ke tukang service.',
    createdAt: '2025-01-10',
    slug: 'panduan-jasa-service',
  },
  {
    id: '3',
    title: 'Cara Mengatasi Laptop Lemot',
    excerpt:
      'Laptop yang lemot bisa sangat mengganggu produktivitas. Simak langkah-langkah mudah untuk mengembalikan kecepatan laptop Anda tanpa harus beli baru.',
    createdAt: '2025-01-05',
    slug: 'cara-mengatasi-laptop-lemot',
  },
]

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export default function ArticlesSection() {
  const [articles, setArticles] = useState<Article[]>(fallbackArticles)

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch('/api/articles?published=true')
        if (res.ok) {
          const json = await res.json()
          // API returns { success: true, data: [...] }
          const data = json.data ?? json
          if (Array.isArray(data) && data.length > 0) {
            setArticles(data)
          }
        }
      } catch {
        // Use fallback data
      }
    }
    fetchArticles()
  }, [])

  if (articles.length === 0) return null

  return (
    <section id="artikel" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Artikel Terbaru
        </h2>
        <p className="text-zinc-400 max-w-lg mx-auto">
          Tips dan informasi seputar teknologi dan layanan kami
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.slice(0, 6).map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className="bg-zinc-950 border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all duration-300 py-0 gap-0 h-full flex flex-col">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center gap-2 text-zinc-500 text-xs mb-2">
                  <Clock className="size-3" />
                  <span>{formatDate(article.createdAt)}</span>
                </div>
                <CardTitle className="text-white text-base font-semibold leading-snug line-clamp-2">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-1 flex-1 flex flex-col justify-between">
                <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-4">
                  {article.excerpt}
                </p>
                <button
                  onClick={() => {
                    // Could navigate to article page in the future
                    const chatSection = document.querySelector('#chat')
                    if (chatSection) {
                      chatSection.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors self-start"
                >
                  Baca Selengkapnya
                  <ExternalLink className="size-3.5" />
                </button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
