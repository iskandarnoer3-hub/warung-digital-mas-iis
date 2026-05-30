'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const navLinks = [
  { label: 'Jasa', href: '#jasa' },
  { label: 'Chat AI', href: '#chat' },
  { label: 'Artikel', href: '#artikel' },
  { label: 'FAQ', href: '#faq' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  const handleNavClick = (href: string) => {
    setOpen(false)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <img src="/logo-new.png" alt="Mas Iis" className="w-10 h-10 rounded-xl" />
          <div className="hidden sm:block">
            <p className="text-white font-semibold text-sm leading-tight">
              Mas Iis
            </p>
            <p className="text-zinc-500 text-xs leading-tight">Warung Solusi</p>
          </div>
        </div>

        {/* Center: Nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800/50"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right: WhatsApp + Mobile menu */}
        <div className="flex items-center gap-3">
          <Link
            href="https://wa.me/62882000858698"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-white text-black hover:bg-zinc-200 rounded-xl h-9 px-4 text-sm font-medium hidden sm:inline-flex">
              <MessageCircle className="size-4 mr-1" />
              WhatsApp
            </Button>
          </Link>

          {/* Mobile hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-zinc-400 hover:text-white">
                <Menu className="size-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#111113] border-zinc-800 w-72">
              <SheetHeader>
                <SheetTitle className="text-white text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 mt-4">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="px-4 py-3 text-sm text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800/50 text-left"
                  >
                    {link.label}
                  </button>
                ))}
                <Link
                  href="https://wa.me/62882000858698"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4"
                >
                  <Button className="w-full bg-white text-black hover:bg-zinc-200 rounded-xl h-10 text-sm font-medium">
                    <MessageCircle className="size-4 mr-2" />
                    WhatsApp
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
