import { useState } from 'react'
import { Map, MapPin, Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useLotteryWinners } from '@/api/lottery'
import { cn, formatDate, initials } from '@/lib/utils'

// Approximate normalized positions on Uzbekistan map outline (0..1)
const cities: Record<string, { x: number; y: number; name: string }> = {
  tashkent: { x: 0.78, y: 0.34, name: 'Toshkent' },
  samarkand: { x: 0.55, y: 0.52, name: 'Samarqand' },
  bukhara: { x: 0.42, y: 0.55, name: 'Buxoro' },
  fergana: { x: 0.88, y: 0.45, name: "Farg'ona" },
  andijan: { x: 0.92, y: 0.42, name: 'Andijon' },
  namangan: { x: 0.86, y: 0.36, name: 'Namangan' },
  khorezm: { x: 0.28, y: 0.42, name: 'Xorazm' },
  nukus: { x: 0.18, y: 0.28, name: "Qoraqalpog'iston" },
  jizzakh: { x: 0.62, y: 0.42, name: 'Jizzax' },
  navoiy: { x: 0.48, y: 0.45, name: 'Navoiy' },
}

const cityKeys = Object.keys(cities)

export function WinnersMap() {
  const { data, isLoading } = useLotteryWinners()
  const [hovered, setHovered] = useState<number | null>(null)

  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>G'oliblar xaritasi</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-72" />
        </CardContent>
      </Card>
    )
  }

  // Assign deterministic city to each winner
  const placed = data.map((w, idx) => ({
    ...w,
    city: cities[cityKeys[idx % cityKeys.length]],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-4 w-4 text-brand" />
          G'oliblar O'zbekiston bo'ylab
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-[2/1] rounded-element overflow-hidden bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand/10 dark:to-brand/5 border border-border">
          {/* Stylized Uzbekistan outline */}
          <svg viewBox="0 0 800 400" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="landGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgb(255 255 255 / 0.5)" />
                <stop offset="100%" stopColor="rgb(255 255 255 / 0.2)" />
              </linearGradient>
            </defs>
            {/* Simplified country shape */}
            <path
              d="M 110 130 Q 145 95 200 100 L 280 90 Q 340 95 380 120 L 460 150 Q 510 165 540 200 L 590 215 Q 640 220 685 195 L 730 185 Q 750 200 745 220 L 720 240 Q 690 255 650 270 L 600 280 Q 570 300 580 320 L 600 345 Q 580 360 540 350 L 480 340 Q 420 335 380 305 L 320 275 Q 270 270 220 265 L 160 250 Q 130 230 120 195 Z"
              fill="url(#landGrad)"
              stroke="rgb(26 86 219 / 0.3)"
              strokeWidth="1.5"
            />
          </svg>

          {/* Winner markers */}
          {placed.map((w, idx) => {
            const cx = w.city.x * 800
            const cy = w.city.y * 400
            const active = hovered === idx
            return (
              <button
                key={w.id}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${(cx / 800) * 100}%`, top: `${(cy / 400) * 100}%` }}
              >
                <div className="relative">
                  <span className="absolute inset-0 rounded-full bg-gold/40 animate-ping" style={{ animationDelay: `${idx * 0.3}s` }} />
                  <span className={cn(
                    'relative inline-flex h-3 w-3 rounded-full bg-gold ring-2 ring-white shadow-card transition-all',
                    active && 'scale-150',
                  )} />
                </div>
                {active && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 whitespace-nowrap">
                    <div className="bg-ink text-white text-[11px] rounded-element px-2.5 py-1.5 shadow-elevated">
                      <p className="font-bold">{w.winnerName}</p>
                      <p className="text-white/70 text-[10px]">{w.city.name} · {w.prize}</p>
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Legend / list */}
        <div className="mt-4 space-y-2">
          {placed.map((w, idx) => (
            <div
              key={w.id}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                'flex items-center gap-3 p-2.5 rounded-element border transition-colors',
                hovered === idx ? 'bg-surface-muted border-brand-200' : 'border-border',
              )}
            >
              <div className="h-9 w-9 rounded-pill bg-gradient-to-br from-gold to-amber-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {initials(w.winnerName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{w.winnerName}</p>
                <p className="text-[11px] text-ink-muted inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {w.city.name} · {formatDate(w.date)}
                </p>
              </div>
              <div className="inline-flex items-center gap-1 text-xs font-semibold text-gold-700 dark:text-gold-300">
                <Trophy className="h-3.5 w-3.5" />
                <span className="truncate max-w-[140px]">{w.prize}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
