import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const facts = [
  { label: 'Yangilik', value: 'Basseyn bugundan boshlab faol — birinchi hafta bepul' },
  { label: 'Aksiya', value: 'Iyun loterеyasi · bosh sovrin iPhone 16 Pro' },
  { label: 'Hisobot', value: 'Haftalik bosh injener videosi har juma kuni' },
  { label: 'Statistika', value: '320+ mamnun mijoz · 98% mamnunlik koeffitsienti' },
  { label: 'Loyiha', value: '2 ta yangi blok rejada — 2027-yil ochilishi' },
]

export function LiveProofStrip() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % facts.length), 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="border-y border-border bg-surface/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <Sparkles className="h-3.5 w-3.5 text-brand" />
          <span className="text-[10px] font-semibold text-brand uppercase tracking-wider">Yangiliklar</span>
        </div>

        <div className="flex-1 min-w-0 relative h-5 overflow-hidden">
          {facts.map((f, idx) => (
            <div
              key={idx}
              className={cn(
                'absolute inset-0 flex items-center gap-2 text-sm transition-all duration-500 ease-apple',
                idx === i ? 'translate-y-0 opacity-100' : idx === (i - 1 + facts.length) % facts.length ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0',
              )}
            >
              <span className="text-ink-muted">{f.label}</span>
              <span className="font-semibold text-ink truncate">{f.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
