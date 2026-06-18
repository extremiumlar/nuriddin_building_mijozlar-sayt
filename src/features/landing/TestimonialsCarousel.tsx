import { useState } from 'react'
import { ChevronLeft, ChevronRight, Quote, ShieldCheck, Star } from 'lucide-react'
import { ScrollReveal } from '@/components/motion'
import { initials, cn } from '@/lib/utils'

interface Testimonial {
  name: string
  apartment: string
  rating: number
  quote: string
  avatarBg: string
  movedIn: string
}

const items: Testimonial[] = [
  {
    name: 'Akbar Aliyev',
    apartment: 'Navruz Residence · 304',
    rating: 5,
    quote:
      "Har juma bosh injener videosi keladi — bu shaffoflikni hech qachon ko'rmagandim. To'lov grafigi ham juda tushunarli, hatto qariyalar uchun ham qulay.",
    avatarBg: 'from-brand to-brand-700',
    movedIn: '2026 may',
  },
  {
    name: 'Marjona Yusupova',
    apartment: 'Bahor Park · 215',
    rating: 5,
    quote:
      "Kvartirani sotib olishdan oldin 5 ta kompaniyani solishtirdim. Faqat shunda real foto va sertifikat ko'rsatadigan kompaniya bo'ldi. Tanlovim to'g'ri bo'ldi.",
    avatarBg: 'from-rose-500 to-rose-700',
    movedIn: '2025 sentyabr',
  },
  {
    name: 'Dilshod Karimov',
    apartment: 'Quyosh Tower · 1207',
    rating: 5,
    quote:
      "Shartnoma muddati 6 oy edi — 5 oyda topshirildi. Ilova orqali har bosqichni ko'rib bordim. Buni boshqa qurilish kompaniyasidan kutib bo'lmaydi.",
    avatarBg: 'from-success to-emerald-700',
    movedIn: '2024 dekabr',
  },
]

export function TestimonialsCarousel() {
  const [i, setI] = useState(0)
  const active = items[i]

  return (
    <section id="testimonials" className="py-20 lg:py-28">
      <div className="max-w-5xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-brand/10 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-4">
              MIJOZLAR FIKRI
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-ink">
              Real mijozlar, real iqtiboslar
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="relative bg-surface rounded-dialog border border-border shadow-card p-6 lg:p-10">
            <Quote className="absolute top-6 right-6 h-10 w-10 text-brand/10" />

            <div className="flex items-start gap-4 lg:gap-6">
              <div className={cn('h-16 w-16 lg:h-20 lg:w-20 rounded-pill bg-gradient-to-br shrink-0 flex items-center justify-center text-xl lg:text-2xl font-bold text-white shadow-card', active.avatarBg)}>
                {initials(active.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-base lg:text-lg font-bold text-ink">{active.name}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-success">
                    <ShieldCheck className="h-3 w-3" />
                    Tasdiqlangan
                  </span>
                </div>
                <p className="text-sm text-ink-muted mt-0.5">{active.apartment} · {active.movedIn}</p>
                <div className="flex items-center gap-0.5 mt-2">
                  {Array.from({ length: active.rating }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-6 text-lg lg:text-xl text-ink leading-relaxed text-pretty">
              "{active.quote}"
            </p>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-1.5">
                {items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setI(idx)}
                    className={cn(
                      'h-1.5 rounded-pill transition-all',
                      idx === i ? 'w-8 bg-brand' : 'w-1.5 bg-border hover:bg-border-strong',
                    )}
                    aria-label={`${idx + 1}-sharh`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setI((p) => (p - 1 + items.length) % items.length)}
                  className="h-10 w-10 rounded-pill bg-surface border border-border hover:border-brand-200 transition-colors inline-flex items-center justify-center text-ink-muted hover:text-ink press"
                  aria-label="Oldingisi"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setI((p) => (p + 1) % items.length)}
                  className="h-10 w-10 rounded-pill bg-surface border border-border hover:border-brand-200 transition-colors inline-flex items-center justify-center text-ink-muted hover:text-ink press"
                  aria-label="Keyingisi"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
