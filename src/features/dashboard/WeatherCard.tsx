import { AlertTriangle, Cloud, CloudRain, Snowflake, Sun } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { useForecast } from '@/api/dashboard'
import { cn } from '@/lib/utils'
import type { DailyForecast } from '@/types'

const condIcon = (c: DailyForecast['condition'], size = 'h-4 w-4') => {
  const cls = `${size}`
  switch (c) {
    case 'sunny':
      return <Sun className={cn(cls, 'text-amber-500')} />
    case 'cloudy':
      return <Cloud className={cn(cls, 'text-ink-muted')} />
    case 'rainy':
      return <CloudRain className={cn(cls, 'text-blue-500')} />
    case 'snowy':
      return <Snowflake className={cn(cls, 'text-blue-300')} />
  }
}

const dayName = (d: string) => {
  const date = new Date(d)
  const days = ['Yak', 'Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha']
  return days[date.getDay()]
}

export function WeatherCard() {
  const { data, isLoading } = useForecast()

  if (isLoading || !data) {
    return <Skeleton className="h-48 rounded-card" />
  }

  const affected = data.filter((f) => f.worksAffected).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">☀️ Hava prognozi</CardTitle>
        <p className="text-xs text-ink-muted mt-0.5">Qurilish sayti uchun · 5 kun</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-5 gap-1.5">
          {data.map((f) => (
            <div
              key={f.date}
              className={cn(
                'rounded-[10px] border p-2 text-center',
                f.worksAffected ? 'border-warning/40 bg-warning-bg/40' : 'border-border',
              )}
            >
              <p className="text-[10px] font-semibold text-ink-muted">{dayName(f.date)}</p>
              <div className="flex justify-center my-1">{condIcon(f.condition, 'h-5 w-5')}</div>
              <p className="text-xs font-semibold text-ink">{f.tempMax}°</p>
              <p className="text-[10px] text-ink-muted">{f.tempMin}°</p>
            </div>
          ))}
        </div>

        {affected > 0 ? (
          <div className="flex items-start gap-2 rounded-[8px] bg-warning-bg/50 border border-warning/30 p-2.5 text-xs text-warning-fg">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>{affected} kunda ob-havo qurilish ishlariga ta'sir qilishi mumkin</span>
          </div>
        ) : (
          <Badge tone="success" className="w-full justify-center py-1">
            Ish kunlari uchun yaxshi prognoz
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}
