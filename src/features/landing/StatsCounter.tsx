import { Award, Building, ShieldCheck, Users } from 'lucide-react'
import { AnimatedNumber, ScrollReveal } from '@/components/motion'

interface Stat {
  icon: typeof Users
  value: number
  suffix?: string
  label: string
  description: string
}

const stats: Stat[] = [
  { icon: Users, value: 320, suffix: '+', label: 'Mamnun mijoz', description: 'Topshirilgan kvartiralar' },
  { icon: Award, value: 12, label: 'Yillik tajriba', description: 'Bozorda 2014-yildan' },
  { icon: Building, value: 2, label: 'Faol qurilish', description: 'Navruz Residence + Salom Plaza' },
  { icon: ShieldCheck, value: 98, suffix: '%', label: 'Mamnunlik', description: '240 ta sharhlar bo\'yicha' },
]

export function StatsCounter() {
  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand-700 to-brand-900" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(245, 158, 11, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(143, 174, 248, 0.4) 0%, transparent 50%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((s, idx) => (
            <ScrollReveal key={s.label} delay={idx * 0.08}>
              <div className="text-white">
                <div className="h-10 w-10 rounded-element bg-white/15 backdrop-blur flex items-center justify-center mb-3">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="text-4xl lg:text-5xl font-extrabold tracking-tighter">
                  <AnimatedNumber
                    value={s.value}
                    startOnView
                    duration={1500}
                    format={(n) => `${n}${s.suffix ?? ''}`}
                  />
                </div>
                <p className="mt-1 text-sm font-semibold text-white">{s.label}</p>
                <p className="text-xs text-brand-100 mt-0.5">{s.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
