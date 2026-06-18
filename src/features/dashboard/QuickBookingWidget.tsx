import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { facilityList } from '@/config/facilities'
import { cn, formatUZS } from '@/lib/utils'

export function QuickBookingWidget() {
  const featured = facilityList.slice(0, 6)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            🎯 Tezkor bron
          </CardTitle>
          <Link to="/booking" className="text-xs text-brand font-medium inline-flex items-center gap-1">
            Hammasi <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <p className="text-xs text-ink-muted mt-1">Hamjamiyat infratuzilmasi · {facilityList.length} ta joy</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {featured.map((f) => (
            <Link
              key={f.type}
              to={`/booking?facility=${f.type}`}
              className="rounded-[10px] border border-border p-3 hover:border-brand-200 hover:shadow-card transition-all"
            >
              <div className={cn('h-9 w-9 rounded-[8px] flex items-center justify-center', f.color)}>
                <f.icon className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <p className="text-sm font-semibold text-ink mt-2 truncate">{f.label}</p>
              <div className="flex items-center gap-1 mt-1.5">
                {f.isFree ? (
                  <Badge tone="success" className="text-[9px]">BEPUL</Badge>
                ) : (
                  <Badge tone="warning" className="text-[9px]">
                    {formatUZS(f.pricePerHour ?? 0, { short: true })}/s
                  </Badge>
                )}
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
