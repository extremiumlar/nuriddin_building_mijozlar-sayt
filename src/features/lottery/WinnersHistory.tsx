import { Award, Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatDate, initials } from '@/lib/utils'
import type { LotteryWinner } from '@/types'

interface Props {
  winners: LotteryWinner[] | undefined
  isLoading?: boolean
}

export function WinnersHistory({ winners, isLoading }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-4 w-4 text-brand" />
          G'oliblar tarixi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)
          : winners?.map((w) => (
              <div key={w.id} className="flex items-center gap-3 p-3 rounded-[10px] border border-border">
                <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-semibold text-sm shrink-0">
                  {initials(w.winnerName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{w.winnerName}</p>
                  <p className="text-xs text-ink-muted">
                    {w.lotteryName} · {formatDate(w.date)}
                  </p>
                </div>
                <div className="text-right">
                  <Badge tone="gold" icon={<Trophy className="h-3 w-3" />}>
                    {w.prize}
                  </Badge>
                  <p className="text-[11px] text-ink-subtle mt-1">{w.ticketNumber}</p>
                </div>
              </div>
            ))}
      </CardContent>
    </Card>
  )
}
