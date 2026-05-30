'use client'

import { useEffect, useRef, useState } from 'react'
import { Zap, Users, Shield, Clock } from 'lucide-react'

const stats = [
  {
    icon: Zap,
    value: 17,
    suffix: '+',
    label: 'Jasa Lengkap',
    color: 'text-violet-400',
  },
  {
    icon: Users,
    value: 500,
    suffix: '+',
    label: 'Client Puas',
    color: 'text-emerald-400',
  },
  {
    icon: Shield,
    value: 30,
    suffix: ' Hari',
    label: 'Garansi',
    color: 'text-amber-400',
  },
  {
    icon: Clock,
    value: 24,
    suffix: '/7',
    label: 'AI Support',
    color: 'text-sky-400',
  },
]

function useCountUp(target: number, duration: number = 1500, start: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return

    let startTime: number | null = null
    let rafId: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))

      if (progress < 1) {
        rafId = requestAnimationFrame(step)
      }
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [target, duration, start])

  return count
}

function StatCard({
  icon: Icon,
  value,
  suffix,
  label,
  color,
  inView,
}: {
  icon: React.ComponentType<{ className?: string }>
  value: number
  suffix: string
  label: string
  color: string
  inView: boolean
}) {
  const count = useCountUp(value, 1500, inView)

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center gap-3 text-center hover:border-zinc-700 transition-colors">
      <Icon className={`size-6 ${color}`} />
      <p className="text-3xl font-bold text-white">
        {count}
        <span className="text-lg">{suffix}</span>
      </p>
      <p className="text-zinc-500 text-sm">{label}</p>
    </div>
  )
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} inView={inView} />
        ))}
      </div>
    </section>
  )
}
