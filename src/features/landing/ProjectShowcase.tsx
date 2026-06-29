import { useEffect, useRef, useState } from 'react'
import {
  Building,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Layers,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { ScrollReveal } from '@/components/motion'
import { cn } from '@/lib/utils'

function ImageWithFallback({
  src,
  alt,
  className,
  loading,
}: {
  src: string
  alt: string
  className?: string
  loading?: 'eager' | 'lazy'
}) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className={cn('flex flex-col items-center justify-center bg-gradient-to-br from-brand-700 to-brand-900 text-gold-300', className)}>
        <ImageIcon className="h-12 w-12 mb-2 opacity-70" />
        <p className="text-xs font-medium uppercase tracking-wider opacity-80">Render tez kunda</p>
        <p className="text-[10px] mt-1 opacity-60 text-center px-4">{alt}</p>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setFailed(true)}
    />
  )
}

interface Render {
  src: string
  alt: string
  caption: string
}

const renders: Render[] = [
  {
    src: '/projects/nurli-diyor-1.jpg',
    alt: 'Nurli Diyor — old tomon, yuqoridan',
    caption: 'Asosiy fasad · aerial ko\'rinish',
  },
  {
    src: '/projects/nurli-diyor-2.jpg',
    alt: 'Nurli Diyor — old, bolalar maydonchasi bilan',
    caption: 'Hovli · bolalar zonasi',
  },
  {
    src: '/projects/nurli-diyor-3.jpg',
    alt: 'Nurli Diyor — yon tomon',
    caption: 'Yon fasad · landshaft',
  },
  {
    src: '/projects/nurli-diyor-4.jpg',
    alt: 'Nurli Diyor — burchak, ko\'cha sathidan',
    caption: 'Burchak · ko\'cha sathidan',
  },
  {
    src: '/projects/nurli-diyor-5.jpg',
    alt: 'Nurli Diyor — orqa, quyosh panellari va sport maydoni',
    caption: 'Orqa · quyosh panellari + sport maydoni',
  },
]

const highlights = [
  { icon: Building, label: '5 blok', sub: 'turli xil planirovkalar' },
  { icon: Layers, label: '9 qavat', sub: 'zamonaviy arxitektura' },
  { icon: Sparkles, label: '10 ta qulaylik', sub: '−1 qavatda' },
  { icon: ShieldCheck, label: 'Quyosh panellari', sub: 'energiya tejamkor' },
  { icon: MapPin, label: 'Lakatsiya', sub: 'Toshkent shahri' },
  { icon: CalendarCheck, label: '2027 / 2028', sub: 'topshirish' },
]

export function ProjectShowcase() {
  const [idx, setIdx] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const goTo = (i: number) => {
    const safe = (i + renders.length) % renders.length
    setIdx(safe)
  }

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(idx + 1)
      if (e.key === 'ArrowLeft') goTo(idx - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx])

  return (
    <section id="projects" className="py-20 lg:py-28 bg-surface-muted/40 dark:bg-surface-muted/20">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-gold/15 text-gold-700 dark:text-gold-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="h-3 w-3" />
              Bizning birinchi loyiha
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-ink text-balance">
              Nurli Diyor Residence
            </h2>
            <p className="mt-4 text-base lg:text-lg text-ink-muted text-pretty">
              Lakatsiya — Toshkent shahrida zamonaviy turar-joy majmuasi. 9 qavat,
              quyosh panellari va −1 qavatda 10 ta maxsus qulaylik.
            </p>
          </div>
        </ScrollReveal>

        {/* Carousel */}
        <ScrollReveal>
          <div className="relative">
            {/* Main image */}
            <div
              ref={trackRef}
              className="relative aspect-[16/9] rounded-dialog overflow-hidden bg-ink shadow-elevated"
            >
              {renders.map((r, i) => (
                <div
                  key={r.src}
                  className={cn(
                    'absolute inset-0 transition-opacity duration-500 ease-apple',
                    i === idx ? 'opacity-100' : 'opacity-0',
                  )}
                >
                  <ImageWithFallback
                    src={r.src}
                    alt={r.alt}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

              {/* Caption */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-end justify-between gap-3 text-white">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gold-300">
                    {idx + 1} / {renders.length}
                  </p>
                  <p className="text-base sm:text-lg font-bold mt-0.5">{renders[idx].caption}</p>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => goTo(idx - 1)}
                    className="h-10 w-10 rounded-pill glass text-ink hover:bg-white press inline-flex items-center justify-center"
                    aria-label="Oldingisi"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => goTo(idx + 1)}
                    className="h-10 w-10 rounded-pill glass text-ink hover:bg-white press inline-flex items-center justify-center"
                    aria-label="Keyingisi"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Mobile arrows (on top of image) */}
              <button
                onClick={() => goTo(idx - 1)}
                className="sm:hidden absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-pill glass text-ink hover:bg-white press inline-flex items-center justify-center"
                aria-label="Oldingisi"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => goTo(idx + 1)}
                className="sm:hidden absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-pill glass text-ink hover:bg-white press inline-flex items-center justify-center"
                aria-label="Keyingisi"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Thumbnail strip */}
            <div className="mt-4 grid grid-cols-5 gap-2">
              {renders.map((r, i) => (
                <button
                  key={r.src}
                  onClick={() => goTo(i)}
                  className={cn(
                    'relative aspect-[16/9] rounded-element overflow-hidden border-2 transition-all',
                    i === idx
                      ? 'border-brand shadow-card-hover'
                      : 'border-transparent opacity-60 hover:opacity-100 hover:border-brand-200',
                  )}
                  aria-label={`${i + 1}-rasm`}
                >
                  <ImageWithFallback src={r.src} alt={r.alt} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Highlights grid */}
        <ScrollReveal delay={0.1}>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {highlights.map((h) => (
              <div
                key={h.label}
                className="rounded-card border border-border bg-surface p-3.5 text-center"
              >
                <div className="inline-flex h-9 w-9 rounded-element bg-brand/10 dark:bg-brand/20 text-brand items-center justify-center mb-2">
                  <h.icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-bold text-ink">{h.label}</p>
                <p className="text-[11px] text-ink-muted mt-0.5">{h.sub}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
