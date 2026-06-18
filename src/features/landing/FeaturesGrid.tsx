import { ArrowRight, CalendarRange, CreditCard, HardHat, Sparkles, Ticket, Users } from 'lucide-react'
import { ScrollReveal } from '@/components/motion'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface Feature {
  icon: LucideIcon
  title: string
  desc: string
  color: string
  ring: string
}

const features: Feature[] = [
  {
    icon: HardHat,
    title: 'Qurilish kuzatuvi',
    desc: 'Haftalik bosh injener videosi, foto-hisobotlar va material sertifikatlari.',
    color: 'text-brand bg-brand-50 dark:bg-brand/15',
    ring: 'group-hover:ring-brand/30',
  },
  {
    icon: CreditCard,
    title: 'Smart to\'lov',
    desc: 'UZS/USD, avto-pay, Click/Payme integratsiyasi, real vaqt PDF chek va Reja vs Fakt grafik.',
    color: 'text-success-fg bg-success-bg',
    ring: 'group-hover:ring-success/30',
  },
  {
    icon: Ticket,
    title: 'Jonli loterеya',
    desc: 'WebSocket live efir, 3D drum-roll, shaffof g\'oliblar tarixi va blockchain timestamp.',
    color: 'text-gold-700 bg-gold-50 dark:bg-gold/15',
    ring: 'group-hover:ring-gold/30',
  },
  {
    icon: CalendarRange,
    title: 'Hamjamiyat',
    desc: '10 ta infratuzilma: basseyn, sauna, gym, kinozal, BBQ — bir bosishda bron qiling.',
    color: 'text-purple-700 bg-purple-50 dark:bg-purple-500/15',
    ring: 'group-hover:ring-purple-500/30',
  },
  {
    icon: Sparkles,
    title: 'Mening kvartiram',
    desc: 'Aniq kvartirangiz uchun 6 bosqichli timeline: devor, electric, santehnika, pol, pardoz.',
    color: 'text-rose-700 bg-rose-50 dark:bg-rose-500/15',
    ring: 'group-hover:ring-rose-500/30',
  },
  {
    icon: Users,
    title: 'Referal bonus',
    desc: 'Do\'stim taklif → 1,000,000 so\'m bonus to\'lov hisobiga. Cheklov yo\'q.',
    color: 'text-teal-700 bg-teal-50 dark:bg-teal-500/15',
    ring: 'group-hover:ring-teal-500/30',
  },
]

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-brand/10 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-4">
              IMKONIYATLAR
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-ink text-balance">
              Yagona ilovada barcha kerakli narsalar
            </h2>
            <p className="mt-4 text-base lg:text-lg text-ink-muted text-pretty">
              Shartnomadan kalit topshirishgacha bo'lgan butun yo'lda biz siz bilanmiz.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, idx) => (
            <ScrollReveal key={f.title} delay={idx * 0.05}>
              <article
                className={cn(
                  'group relative bg-surface rounded-card border border-border p-6 h-full',
                  'transition-all duration-300 ease-apple',
                  'hover:-translate-y-1 hover:shadow-card-hover hover:border-transparent',
                  'hover:ring-2',
                  f.ring,
                )}
              >
                <div
                  className={cn(
                    'h-12 w-12 rounded-element flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6',
                    f.color,
                  )}
                >
                  <f.icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{f.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand opacity-0 group-hover:opacity-100 transition-opacity">
                  Batafsil
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
