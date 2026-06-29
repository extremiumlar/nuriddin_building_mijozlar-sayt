import * as Icons from 'lucide-react'
import { ScrollReveal } from '@/components/motion'
import { Skeleton } from '@/components/ui/Skeleton'
import { usePublicAmenities } from '@/api/public'
import { cn, formatUZS } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

const getIcon = (name: string): LucideIcon => {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[name]
  return Icon ?? Icons.Sparkles
}

export function CommunityAmenities() {
  const { data: amenities, isLoading } = usePublicAmenities()

  const totalFree = amenities?.filter((a) => a.is_free).length ?? 0
  const totalPaid = amenities?.filter((a) => !a.is_free).length ?? 0

  return (
    <section
      id="community"
      className="py-20 lg:py-28 bg-gradient-to-b from-surface-muted/30 to-surface-muted/60 dark:from-surface-muted/10 dark:to-surface-muted/30"
    >
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-brand/10 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Icons.Users className="h-3 w-3" />
              Hamjamiyat infratuzilmasi
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-ink text-balance">
              −1 qavatda 10 ta qulaylik
            </h2>
            <p className="mt-4 text-base text-ink-muted text-pretty">
              Aholi uchun maxsus: IT xonasi, kutubxona, sport zali, basseyn, kinozal,
              karaoke va boshqalar. Mijozlar kabinet orqali bron qiladi.
            </p>
            {amenities && (
              <div className="mt-5 inline-flex items-center gap-2 text-xs flex-wrap justify-center">
                <span className="px-2.5 py-1 rounded-pill bg-success-bg text-success-fg font-semibold">
                  {totalFree} ta bepul
                </span>
                <span className="px-2.5 py-1 rounded-pill bg-gold/15 text-gold-700 dark:text-gold-300 font-semibold">
                  {totalPaid} ta pullik
                </span>
              </div>
            )}
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="aspect-square" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {amenities?.map((a, idx) => {
              const Icon = getIcon(a.icon_name)
              return (
                <ScrollReveal key={a.id} delay={idx * 0.03}>
                  <div className="group rounded-card border border-border overflow-hidden bg-surface hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
                    <div className="relative aspect-[4/3] bg-surface-subtle overflow-hidden">
                      {a.image_url && (
                        <img
                          src={a.image_url}
                          alt={a.label}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className={cn('absolute top-2 left-2 h-8 w-8 rounded-element bg-white/90 backdrop-blur flex items-center justify-center', a.color)}>
                        <Icon className="h-4 w-4" strokeWidth={2} />
                      </div>
                      <div className="absolute top-2 right-2">
                        {a.is_free ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-pill font-bold bg-success text-white">
                            BEPUL
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-pill font-bold bg-gold text-white">
                            {formatUZS(a.price_per_hour, { short: true })}/s
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 text-white">
                        <p className="text-sm font-bold leading-tight truncate">{a.label}</p>
                        <p className="text-[10px] text-white/85 inline-flex items-center gap-1 mt-0.5">
                          <Icons.Users className="h-2.5 w-2.5" />
                          {a.capacity} kishilik
                        </p>
                      </div>
                    </div>
                    <p className="px-2.5 py-2 text-[11px] text-ink-muted line-clamp-2">
                      {a.description}
                    </p>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
