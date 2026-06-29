import { Building, CalendarCheck, Layers, Sparkles } from 'lucide-react'
import { AnimatedNumber, ScrollReveal } from '@/components/motion'

interface Stat {
  icon: typeof Building
  value: number
  suffix?: string
  prefix?: string
  label: string
  description: string
}

const stats: Stat[] = [
  { icon: Building, value: 1, label: 'Birinchi loyiha', description: 'Nurli Diyor Residence' },
  { icon: Layers, value: 9, label: 'Qavat', description: 'zamonaviy arxitektura' },
  { icon: Sparkles, value: 10, label: 'Maxsus qulaylik', description: "−1 qavatda" },
  { icon: CalendarCheck, value: 2027, label: 'Topshirish', description: 'oxiri / 2028 boshi' },
]

export function StatsCounter() {
  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900" />
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 30%, rgba(201, 169, 97, 0.5) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(201, 169, 97, 0.3) 0%, transparent 50%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((s, idx) => (
            <ScrollReveal key={s.label} delay={idx * 0.08}>
              <div className="text-white">
                <div className="h-10 w-10 rounded-element bg-gold/20 backdrop-blur flex items-center justify-center mb-3 text-gold-300">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="text-4xl lg:text-5xl font-extrabold tracking-tighter">
                  <AnimatedNumber
                    value={s.value}
                    startOnView
                    duration={1500}
                    format={(n) => `${s.prefix ?? ''}${n}${s.suffix ?? ''}`}
                  />
                </div>
                <p className="mt-1 text-sm font-semibold text-white">{s.label}</p>
                <p className="text-xs text-gold-200/80 mt-0.5">{s.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
