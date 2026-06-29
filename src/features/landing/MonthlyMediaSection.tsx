import { useState } from 'react'
import { Play, Image, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { ScrollReveal } from '@/components/motion'
import { Skeleton } from '@/components/ui/Skeleton'
import { usePublicMonthlyMedia } from '@/api/public'
import type { PublicMonthlyMedia } from '@/api/public'
import { cn } from '@/lib/utils'

function formatMonth(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long' })
}

function MediaCard({ item, onClick }: { item: PublicMonthlyMedia; onClick: () => void }) {
  const thumb = item.thumbnail_url || item.media_url
  return (
    <button
      onClick={onClick}
      className="group relative w-full rounded-card overflow-hidden border border-border bg-surface text-left focus-visible:ring-2 focus-visible:ring-brand"
    >
      {thumb ? (
        <img
          src={thumb}
          alt={item.title}
          className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full aspect-video bg-gradient-to-br from-brand/10 to-gold/10 flex items-center justify-center">
          <Image className="h-10 w-10 text-ink-subtle" />
        </div>
      )}

      {item.media_type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 rounded-pill bg-white/80 backdrop-blur flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
            <Play className="h-5 w-5 text-brand fill-brand ml-0.5" />
          </div>
        </div>
      )}

      <div className="p-3">
        <p className="text-xs text-ink-muted inline-flex items-center gap-1 mb-1">
          <Calendar className="h-3 w-3" />
          {formatMonth(item.month)}
        </p>
        <p className="text-sm font-semibold text-ink line-clamp-2">{item.title}</p>
        {item.description && (
          <p className="text-xs text-ink-muted mt-1 line-clamp-2">{item.description}</p>
        )}
      </div>
    </button>
  )
}

function VideoModal({ item, onClose }: { item: PublicMonthlyMedia; onClose: () => void }) {
  const isYoutube = item.media_url.includes('youtube.com') || item.media_url.includes('youtu.be')
  const embedUrl = isYoutube
    ? item.media_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')
    : null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-surface rounded-card overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full aspect-video"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        ) : (
          <video src={item.media_url} controls autoPlay className="w-full aspect-video" />
        )}
        <div className="p-4">
          <p className="text-sm font-semibold text-ink">{item.title}</p>
          <p className="text-xs text-ink-muted mt-1">{formatMonth(item.month)}</p>
        </div>
      </div>
    </div>
  )
}

export function MonthlyMediaSection() {
  const { data: items, isLoading } = usePublicMonthlyMedia()
  const [activeVideo, setActiveVideo] = useState<PublicMonthlyMedia | null>(null)
  const [page, setPage] = useState(0)

  const PER_PAGE = 6
  const total = items?.length ?? 0
  const pages = Math.ceil(total / PER_PAGE)
  const slice = items?.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE) ?? []

  if (!isLoading && total === 0) return null

  return (
    <>
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider mb-3">
                  <Play className="h-3 w-3" />
                  Har oylik materialar
                </div>
                <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-ink">
                  Omadli mijoz — video va rasmlar
                </h2>
                <p className="mt-2 text-sm text-ink-muted">
                  Har oy o'tkaziladigan omadli mijoz tantanasi hujjatlashtiriladi
                </p>
              </div>

              {pages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                    className={cn(
                      'h-8 w-8 rounded-element border border-border flex items-center justify-center transition-colors',
                      page === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-surface-hover',
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-ink-muted">
                    {page + 1} / {pages}
                  </span>
                  <button
                    disabled={page === pages - 1}
                    onClick={() => setPage((p) => p + 1)}
                    className={cn(
                      'h-8 w-8 rounded-element border border-border flex items-center justify-center transition-colors',
                      page === pages - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-surface-hover',
                    )}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-video rounded-card" />
                ))
              : slice.map((item, idx) => (
                  <ScrollReveal key={item.id} delay={idx * 0.04}>
                    <MediaCard
                      item={item}
                      onClick={() => item.media_type === 'video' && setActiveVideo(item)}
                    />
                  </ScrollReveal>
                ))}
          </div>
        </div>
      </section>

      {activeVideo && (
        <VideoModal item={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </>
  )
}
