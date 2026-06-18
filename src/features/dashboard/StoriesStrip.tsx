import { useEffect, useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award,
  ChevronLeft,
  ChevronRight,
  HardHat,
  Ticket,
  Trophy,
  Waves,
  X,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Story {
  id: string
  title: string
  kicker: string
  icon: LucideIcon
  gradient: string
  content: ReactNode
}

const stories: Story[] = [
  {
    id: 'pool',
    title: 'Basseyn ochildi',
    kicker: 'YANGI',
    icon: Waves,
    gradient: 'from-blue-500 to-cyan-500',
    content: (
      <div className="text-center">
        <Waves className="h-12 w-12 mx-auto mb-4 opacity-90" />
        <h3 className="text-2xl font-extrabold">25m basseyn</h3>
        <p className="mt-2 text-white/85">Birinchi hafta bepul demo</p>
        <p className="mt-4 text-sm text-white/75">07:00 – 22:00 · Ichki, isitiladigan</p>
      </div>
    ),
  },
  {
    id: 'engineer',
    title: 'Bosh injener',
    kicker: 'VIDEO',
    icon: HardHat,
    gradient: 'from-brand to-brand-900',
    content: (
      <div className="text-center">
        <HardHat className="h-12 w-12 mx-auto mb-4 opacity-90" />
        <h3 className="text-xl font-extrabold">Haftalik hisobot</h3>
        <p className="mt-2 text-white/85 text-sm">
          "Bu hafta 4-qavat devori 80% tugadi, deraza ramkalari o'rnatildi."
        </p>
        <p className="mt-4 text-xs text-white/70">— Akmal Yusupov, bosh injener</p>
      </div>
    ),
  },
  {
    id: 'lottery',
    title: 'Loterеya',
    kicker: 'AKSIYA',
    icon: Ticket,
    gradient: 'from-gold to-amber-700',
    content: (
      <div className="text-center">
        <Ticket className="h-12 w-12 mx-auto mb-4 opacity-90" />
        <h3 className="text-2xl font-extrabold">iPhone 16 Pro</h3>
        <p className="mt-2 text-white/85">Iyun oylik bosh sovrin</p>
        <p className="mt-4 text-sm text-white/75">30-iyun · 18:00 · Jonli efir</p>
      </div>
    ),
  },
  {
    id: 'milestone',
    title: 'Bosqich',
    kicker: 'BAJARILDI',
    icon: Trophy,
    gradient: 'from-success to-emerald-700',
    content: (
      <div className="text-center">
        <Trophy className="h-12 w-12 mx-auto mb-4 opacity-90" />
        <h3 className="text-2xl font-extrabold">3-qavat tugadi</h3>
        <p className="mt-2 text-white/85">Sizning qavatingiz to'liq tayyor</p>
        <p className="mt-4 text-sm text-white/75">Keyingisi: 4-qavat pardoz</p>
      </div>
    ),
  },
  {
    id: 'reward',
    title: 'Mukofot',
    kicker: 'BONUS',
    icon: Award,
    gradient: 'from-purple-500 to-purple-800',
    content: (
      <div className="text-center">
        <Award className="h-12 w-12 mx-auto mb-4 opacity-90" />
        <h3 className="text-2xl font-extrabold">+2,000,000 so'm</h3>
        <p className="mt-2 text-white/85">Referal bonus to'plandi</p>
        <p className="mt-4 text-sm text-white/75">Sizning hisobingizga qo'shildi</p>
      </div>
    ),
  },
]

const STORY_DURATION = 5000

export function StoriesStrip() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [seenIds, setSeenIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem('seen-stories')
      return raw ? new Set(JSON.parse(raw)) : new Set()
    } catch {
      return new Set()
    }
  })

  const openStory = (id: string) => {
    setOpenId(id)
    setSeenIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      try {
        localStorage.setItem('seen-stories', JSON.stringify([...next]))
      } catch {
        /* ignore */
      }
      return next
    })
  }

  return (
    <>
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-thin pb-1 -mx-1 px-1">
        {stories.map((s) => {
          const seen = seenIds.has(s.id)
          return (
            <button
              key={s.id}
              onClick={() => openStory(s.id)}
              className="group shrink-0 flex flex-col items-center gap-1.5 press"
              aria-label={s.title}
            >
              <div
                className={cn(
                  'h-16 w-16 rounded-pill p-[2.5px] transition-all',
                  seen
                    ? 'bg-border'
                    : 'bg-gradient-to-tr from-brand via-gold to-rose-500 group-hover:scale-105',
                )}
              >
                <div className="h-full w-full rounded-pill bg-surface p-[2px]">
                  <div
                    className={cn(
                      'h-full w-full rounded-pill flex items-center justify-center text-white bg-gradient-to-br',
                      s.gradient,
                    )}
                  >
                    <s.icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-medium text-ink-muted max-w-[72px] truncate">
                {s.title}
              </span>
            </button>
          )
        })}
      </div>

      <StoryViewer
        openId={openId}
        onClose={() => setOpenId(null)}
        onNavigate={(id) => openStory(id)}
      />
    </>
  )
}

function StoryViewer({
  openId,
  onClose,
  onNavigate,
}: {
  openId: string | null
  onClose: () => void
  onNavigate: (id: string) => void
}) {
  const idx = openId ? stories.findIndex((s) => s.id === openId) : -1
  const story = idx >= 0 ? stories[idx] : null
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!story) return
    setProgress(0)
    const start = performance.now()
    let raf = 0
    const tick = (ts: number) => {
      const elapsed = ts - start
      const next = Math.min(elapsed / STORY_DURATION, 1)
      setProgress(next)
      if (next < 1) raf = requestAnimationFrame(tick)
      else {
        // Auto-advance
        const nextIdx = idx + 1
        if (nextIdx < stories.length) onNavigate(stories[nextIdx].id)
        else onClose()
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.id])

  useEffect(() => {
    if (!story) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') {
        const nx = idx + 1
        if (nx < stories.length) onNavigate(stories[nx].id)
        else onClose()
      }
      if (e.key === 'ArrowLeft' && idx > 0) onNavigate(stories[idx - 1].id)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [story?.id, idx, onClose, onNavigate])

  return (
    <AnimatePresence>
      {story && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            key={story.id}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'relative w-full max-w-sm aspect-[9/14] rounded-dialog shadow-elevated overflow-hidden',
              'bg-gradient-to-br',
              story.gradient,
            )}
          >
            {/* Progress bars */}
            <div className="absolute top-3 left-3 right-3 flex gap-1 z-20">
              {stories.map((s, i) => (
                <div key={s.id} className="flex-1 h-0.5 bg-white/30 rounded-pill overflow-hidden">
                  <div
                    className="h-full bg-white transition-none"
                    style={{
                      width: i < idx ? '100%' : i === idx ? `${progress * 100}%` : '0%',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-20">
              <div className="inline-flex items-center gap-2 text-white">
                <div className="h-9 w-9 rounded-pill bg-white/20 backdrop-blur flex items-center justify-center">
                  <story.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{story.title}</p>
                  <p className="text-[10px] text-white/70 uppercase tracking-wider">
                    {story.kicker}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-pill bg-white/10 hover:bg-white/20 inline-flex items-center justify-center text-white press"
                aria-label="Yopish"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nav arrows */}
            {idx > 0 && (
              <button
                onClick={() => onNavigate(stories[idx - 1].id)}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-pill bg-white/10 hover:bg-white/20 inline-flex items-center justify-center text-white press"
                aria-label="Oldingisi"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            {idx < stories.length - 1 && (
              <button
                onClick={() => onNavigate(stories[idx + 1].id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-pill bg-white/10 hover:bg-white/20 inline-flex items-center justify-center text-white press"
                aria-label="Keyingisi"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center px-8 text-white">
              {story.content}
            </div>

            {/* Bottom decorative */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
