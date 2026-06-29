import { Award, Lock, MapPin, ShieldCheck, Ticket, Trophy } from 'lucide-react'
import { ScrollReveal } from '@/components/motion'
import { Skeleton } from '@/components/ui/Skeleton'
import { usePublicWinners } from '@/api/public'
import { cn, formatDate, initials } from '@/lib/utils'

const steps = [
  { icon: Ticket, title: 'Oylik to\'lov qiling', desc: "Har oylik to'lov bilan avtomatik chipta beriladi." },
  { icon: Trophy, title: 'Live efirda kuting', desc: "Har oxirgi kuni jonli efir, shaffof drum-roll." },
  { icon: Award, title: 'Sovrinni qabul qiling', desc: 'iPhone, smart TV, naqd pul va boshqa premium sovrinlar.' },
]

export function LotteryHighlights() {
  const { data: winners, isLoading } = usePublicWinners()

  return (
    <section id="lottery" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-brand/5 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-gold/15 text-gold-700 dark:text-gold-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Trophy className="h-3 w-3" />
              Omadli mijoz
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-ink text-balance">
              Har oy real sovrinlar, real g'oliblar
            </h2>
            <p className="mt-4 text-base text-ink-muted text-pretty">
              Oylik to'lov qiluvchi mijoz avtomatik chipta oladi. Shaffof live efir,
              har g'olib uchun public verification hash.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 steps */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {steps.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 0.05}>
              <div className="bg-surface rounded-card border border-border p-5 h-full text-center">
                <div className="inline-flex h-12 w-12 rounded-element bg-gold/15 text-gold-700 dark:text-gold-300 items-center justify-center mb-3">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-ink">{s.title}</h3>
                <p className="text-sm text-ink-muted mt-1.5">{s.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Recent winners */}
        <ScrollReveal>
          <h3 className="text-lg font-semibold text-ink mb-4 inline-flex items-center gap-2">
            <Award className="h-4 w-4 text-gold" />
            So'nggi g'oliblar
          </h3>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32" />)
          ) : (
            winners?.slice(0, 6).map((w, idx) => (
              <ScrollReveal key={w.id} delay={idx * 0.04}>
                <div
                  className={cn(
                    'rounded-card border-2 p-4 bg-gradient-to-br from-gold-50 to-amber-50',
                    'dark:from-gold/15 dark:to-amber/10 border-gold/30',
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-pill bg-gradient-to-br from-gold to-amber-700 text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {initials(w.winner_name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-ink truncate">{w.winner_name}</p>
                      <p className="text-[11px] text-ink-muted inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {w.city || 'Toshkent'} · {formatDate(w.drawn_at)}
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700 dark:text-gold-300">
                    <Trophy className="h-3.5 w-3.5" />
                    {w.prize}
                  </div>
                  <p className="text-[10px] text-ink-muted mt-1.5">
                    {w.lottery_name} · chipta {w.ticket_number}
                  </p>
                  {w.verification_hash && (
                    <p className="mt-2 font-mono text-[9px] text-ink-subtle inline-flex items-center gap-1 truncate max-w-full">
                      <Lock className="h-2.5 w-2.5 shrink-0" />
                      {w.verification_hash.slice(0, 20)}…
                    </p>
                  )}
                </div>
              </ScrollReveal>
            ))
          )}
        </div>

        {/* Transparency badge */}
        <ScrollReveal delay={0.1}>
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-success-bg text-success-fg text-xs font-semibold mx-auto w-fit block">
            <ShieldCheck className="h-3.5 w-3.5" />
            Mustaqil notarius tasdig'i · public hash · auditga ochiq
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
