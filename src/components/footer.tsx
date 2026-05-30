import Link from 'next/link'
import { MessageCircle, Phone, MapPin } from 'lucide-react'

const quickLinks = [
  { label: 'Jasa', href: '#jasa' },
  { label: 'Chat AI', href: '#chat' },
  { label: 'Artikel', href: '#artikel' },
  { label: 'FAQ', href: '#faq' },
]

export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Logo + Copyright */}
          <div className="flex items-center gap-3">
            <img src="/logo-new.png" alt="Mas Iis" className="w-8 h-8 rounded-lg" />
            <div>
              <p className="text-zinc-400 text-sm font-medium">Mas Iis - Warung Solusi</p>
              <div className="flex items-center gap-1.5 text-zinc-600 text-xs mt-0.5">
                <MapPin className="w-3 h-3" />
                Sindanglaut, Kab. Cirebon
              </div>
            </div>
          </div>

          {/* Center: Quick links */}
          <nav className="flex items-center gap-6">
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-zinc-500 hover:text-white text-sm transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: WhatsApp */}
          <Link
            href="https://wa.me/62882000858698"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-zinc-500 hover:text-emerald-400 text-sm transition-colors"
          >
            <Phone className="size-4" />
            +62 882-0008-58698
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-900 text-center">
          <p className="text-zinc-600 text-xs">
            &copy; 2025 Mas Iis - Warung Solusi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
