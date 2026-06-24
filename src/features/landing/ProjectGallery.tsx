import { useRef } from 'react'
import { Building, CheckCircle2, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { ScrollReveal } from '@/components/motion'

interface Project {
  name: string
  year: string
  apartments: number
  location: string
  status: 'completed' | 'active' | 'planned'
  accent: string
}

const projects: Project[] = [
  { name: 'Nurli Diyor Residence', year: '2026', apartments: 38, location: 'Lakatsiya, Toshkent', status: 'active', accent: 'from-brand to-brand-900' },
  { name: 'Bahor Park', year: '2025', apartments: 24, location: 'Mirzo-Ulug\'bek, Toshkent', status: 'completed', accent: 'from-success to-emerald-900' },
  { name: 'Quyosh Tower', year: '2024', apartments: 96, location: 'Yunusobod, Toshkent', status: 'completed', accent: 'from-purple-500 to-purple-900' },
  { name: 'Oltin Tepa', year: '2024', apartments: 42, location: 'Chilonzor, Toshkent', status: 'completed', accent: 'from-gold to-amber-700' },
  { name: 'Yashil Bog\'', year: '2023', apartments: 28, location: 'Sergeli, Toshkent', status: 'completed', accent: 'from-teal-500 to-teal-900' },
  { name: 'Salom Plaza', year: '2027', apartments: 64, location: 'Mirobod, Toshkent', status: 'planned', accent: 'from-rose-500 to-rose-900' },
]

const statusLabel = {
  active: 'Faol qurilish',
  completed: 'Topshirilgan',
  planned: 'Rejada',
}

export function ProjectGallery() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    const node = scrollRef.current
    if (!node) return
    const offset = 360
    node.scrollBy({ left: dir === 'left' ? -offset : offset, behavior: 'smooth' })
  }

  return (
    <section id="projects" className="py-20 lg:py-28 bg-surface-muted/40 dark:bg-surface-muted/20">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="flex items-end justify-between gap-4 flex-wrap mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-brand/10 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-4">
                BIZNING LOYIHALAR
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-ink text-balance">
                12 yil · 320+ topshirilgan kvartira
              </h2>
              <p className="mt-3 text-base text-ink-muted max-w-lg text-pretty">
                Har loyiha — shartnomada belgilangan muddatda yoki vaqtidan oldin topshirildi.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="h-11 w-11 rounded-pill bg-surface border border-border text-ink-muted hover:text-ink hover:border-brand-200 transition-colors inline-flex items-center justify-center press"
                aria-label="Chapga"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="h-11 w-11 rounded-pill bg-surface border border-border text-ink-muted hover:text-ink hover:border-brand-200 transition-colors inline-flex items-center justify-center press"
                aria-label="O'ngga"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-thin snap-x snap-mandatory pb-4 -mx-6 px-6"
        >
          {projects.map((p) => (
            <article
              key={p.name}
              className="snap-start shrink-0 w-[320px] lg:w-[360px] group cursor-pointer"
            >
              <div
                className={`aspect-[4/5] rounded-card overflow-hidden bg-gradient-to-br ${p.accent} relative shadow-card transition-all duration-300 group-hover:shadow-elevated group-hover:-translate-y-1`}
              >
                {/* SVG building silhouette */}
                <svg viewBox="0 0 320 400" className="absolute inset-x-0 bottom-0 w-full opacity-90">
                  <rect x="40" y="120" width="240" height="280" rx="6" fill="white" opacity="0.15" />
                  <rect x="38" y="115" width="244" height="10" rx="2" fill="white" opacity="0.25" />
                  {Array.from({ length: 5 }).map((_, f) =>
                    Array.from({ length: 5 }).map((__, c) => (
                      <rect
                        key={`${f}-${c}`}
                        x={58 + c * 42}
                        y={140 + f * 50}
                        width={30}
                        height={36}
                        rx={2}
                        fill="white"
                        opacity={Math.random() > 0.4 ? 0.7 : 0.25}
                      />
                    )),
                  )}
                </svg>

                {/* Top badge */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                  <div className="px-2.5 py-1 rounded-pill bg-white/20 backdrop-blur text-[10px] font-bold text-white uppercase tracking-wider">
                    {statusLabel[p.status]}
                  </div>
                  {p.status === 'completed' && (
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  )}
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-xl font-bold text-white tracking-tight">{p.name}</h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-white/80">
                    <span className="inline-flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {p.apartments} kvartira
                    </span>
                    <span>·</span>
                    <span>{p.year}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-white/80">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{p.location}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
