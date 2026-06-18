import { Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { LiveLotteryScreen } from '@/features/lottery/LiveLotteryScreen'
import { MyTicketsCard } from '@/features/lottery/MyTicketsCard'
import { WinnersHistory } from '@/features/lottery/WinnersHistory'
import { WinnersMap } from '@/features/lottery/WinnersMap'
import { Gamification } from '@/features/lottery/Gamification'
import { TransparencyCard } from '@/features/lottery/TransparencyCard'
import { CountdownTimer } from '@/features/lottery/CountdownTimer'
import { useUpcomingLotteries, useMyTickets, useLotteryWinners } from '@/api/lottery'

export function LotteryPage() {
  const { data: lotteries, isLoading: lotLoading } = useUpcomingLotteries()
  const { data: tickets, isLoading: ticketsLoading } = useMyTickets()
  const { data: winners, isLoading: winLoading } = useLotteryWinners()

  const main = lotteries?.[0]

  return (
    <div className="space-y-5">
      {/* 1. Live stage */}
      {lotLoading ? <Skeleton className="h-64" /> : main && <LiveLotteryScreen lottery={main} />}

      {/* 2. Other lotteries */}
      {lotteries && lotteries.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand" />
              Boshqa aksiyalar
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            {lotteries.slice(1).map((l) => (
              <div key={l.id} className="rounded-card border border-border p-4">
                <p className="text-sm font-semibold text-ink">{l.name}</p>
                <p className="text-xs text-ink-muted mt-1">{l.prize}</p>
                <div className="mt-3">
                  <CountdownTimer endDate={l.date} size="sm" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 3. Tickets (flippable 3D) + Gamification */}
      <div className="grid lg:grid-cols-2 gap-5">
        <MyTicketsCard tickets={tickets} isLoading={ticketsLoading} />
        <Gamification />
      </div>

      {/* 4. Winners Map (full width — visual highlight) */}
      <WinnersMap />

      {/* 5. Winners History + Transparency */}
      <div className="grid lg:grid-cols-2 gap-5">
        <WinnersHistory winners={winners} isLoading={winLoading} />
        <TransparencyCard />
      </div>
    </div>
  )
}
