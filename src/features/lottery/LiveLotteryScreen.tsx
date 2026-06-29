import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { Play, Sparkles, Trophy } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CountdownTimer } from './CountdownTimer'
import { cn } from '@/lib/utils'
import type { Lottery } from '@/types'

interface Props {
  lottery: Lottery
}

type DemoState = 'idle' | 'live' | 'revealing' | 'winner'

export function LiveLotteryScreen({ lottery }: Props) {
  const [state, setState] = useState<DemoState>('idle')
  const [digits, setDigits] = useState<string[]>(['_', '_', '_', '_'])
  const [winner] = useState({ name: 'Akbar A.', ticket: '#1042' })
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [])

  const startDemo = () => {
    setState('live')
    setDigits(['?', '?', '?', '?'])

    setTimeout(() => {
      setState('revealing')
      const target = winner.ticket.replace('#', '').split('')
      let idx = 0
      intervalRef.current = window.setInterval(() => {
        setDigits((d) => {
          const next = [...d]
          next[idx] = target[idx]
          return next
        })
        idx += 1
        if (idx >= 4) {
          if (intervalRef.current) window.clearInterval(intervalRef.current)
          setTimeout(() => {
            setState('winner')
            confetti({
              particleCount: 200,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#1A56DB', '#16A34A', '#D97706', '#FBBF24'],
            })
          }, 600)
        }
      }, 700)
    }, 1500)
  }

  const reset = () => {
    setState('idle')
    setDigits(['_', '_', '_', '_'])
  }

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-brand-900 via-brand-700 to-brand-600 text-white">
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <Badge tone="brand" className="bg-white/15 text-white">
              <Sparkles className="h-3 w-3" />
              Oylik omadli mijoz
            </Badge>
            <h2 className="text-2xl lg:text-3xl font-bold mt-2.5">{lottery.name}</h2>
            <p className="text-brand-100 text-sm mt-1">Bosh sovrin: {lottery.prize}</p>
          </div>
          {state === 'idle' && (
            <Button variant="primary" size="lg" onClick={startDemo} leftIcon={<Play className="h-4 w-4" />} className="bg-white text-brand hover:bg-brand-50">
              Efirni boshlash (demo)
            </Button>
          )}
        </div>

        {state === 'idle' && (
          <div className="bg-white/10 backdrop-blur rounded-card p-5">
            <CountdownTimer endDate={lottery.date} label="Omadli mijoz tanlovigacha qoldi" size="lg" />
            <p className="text-xs text-brand-100 mt-4">
              Jami chiptalar: <span className="font-semibold text-white">{lottery.ticketCount.toLocaleString()}</span>
            </p>
          </div>
        )}

        {(state === 'live' || state === 'revealing' || state === 'winner') && (
          <div className="text-center py-6">
            <p className="text-brand-100 text-sm mb-4">G'olib chipta raqami:</p>
            <div className="inline-flex gap-3">
              {digits.map((d, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-24 w-20 lg:h-32 lg:w-24 rounded-[14px] bg-white/15 backdrop-blur flex items-center justify-center',
                    'text-5xl lg:text-7xl font-extrabold transition-all',
                    state === 'live' && 'animate-pulse',
                    state === 'revealing' && d !== '?' && 'bg-white text-brand scale-110',
                    state === 'winner' && 'bg-white text-brand',
                  )}
                  style={state === 'revealing' ? { transitionDelay: `${i * 100}ms` } : undefined}
                >
                  {d}
                </div>
              ))}
            </div>

            {state === 'winner' && (
              <div className="mt-8 animate-slide-up">
                <Trophy className="h-12 w-12 mx-auto text-amber-300" />
                <p className="text-2xl font-bold mt-3">{winner.name}</p>
                <p className="text-brand-100 mt-1">Tabriklaymiz!</p>
                <Button variant="outline" onClick={reset} className="mt-4 bg-white/10 border-white/30 text-white hover:bg-white/20">
                  Yana ko'rish
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
