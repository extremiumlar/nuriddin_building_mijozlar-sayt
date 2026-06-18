import { useMemo, useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn, formatDate } from '@/lib/utils'
import { useSlots, useCancelBooking } from '@/api/bookings'
import { useToast } from '@/components/ui/Toast'
import { facilityMeta } from '@/config/facilities'
import type { BookingSlot, FacilityType } from '@/types'

interface Props {
  facility: FacilityType
  onPickSlot: (slot: BookingSlot, date: string) => void
}

export function BookingCalendar({ facility, onPickSlot }: Props) {
  const meta = facilityMeta[facility]
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const { data: slots, isLoading } = useSlots(facility, date)
  const cancel = useCancelBooking()
  const { notify } = useToast()

  const shiftDay = (delta: number) => {
    const d = new Date(date)
    d.setDate(d.getDate() + delta)
    setDate(d.toISOString().slice(0, 10))
  }

  const visibleSlots = useMemo(() => {
    if (!slots) return undefined
    return slots.filter((s) => {
      const h = parseInt(s.time.split(':')[0], 10)
      return h >= meta.hoursFrom && h <= meta.hoursTo
    })
  }, [slots, meta.hoursFrom, meta.hoursTo])

  const onSlotClick = async (slot: BookingSlot) => {
    if (slot.status === 'free') {
      onPickSlot(slot, date)
    } else if (slot.status === 'mine' && slot.bookingId) {
      try {
        await cancel.mutateAsync(slot.bookingId)
        notify('Bron bekor qilindi', 'success')
      } catch {
        notify('Xato', 'error')
      }
    }
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-brand" />
          <h3 className="text-sm font-semibold text-ink">Sana tanlash</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <Button size="icon" variant="outline" onClick={() => shiftDay(-1)} aria-label="Oldingi kun">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().slice(0, 10)}
            className="h-10 px-3 rounded-[8px] border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-brand/25"
          />
          <Button size="icon" variant="outline" onClick={() => shiftDay(1)} aria-label="Keyingi kun">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <p className="text-xs text-ink-muted flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {formatDate(date, { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })}
        </p>
        <p className="text-[11px] text-ink-muted">
          Ish vaqti: {String(meta.hoursFrom).padStart(2, '0')}:00 – {String(meta.hoursTo).padStart(2, '0')}:00
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {Array.from({ length: 15 }).map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {visibleSlots?.map((slot) => (
            <button
              key={slot.time}
              onClick={() => onSlotClick(slot)}
              disabled={slot.status === 'taken'}
              className={cn(
                'h-12 rounded-[8px] border text-sm font-medium transition-all',
                slot.status === 'free' && 'bg-success-bg border-success/30 text-success-fg hover:bg-success hover:text-white',
                slot.status === 'taken' && 'bg-surface-muted border-border text-ink-subtle cursor-not-allowed line-through',
                slot.status === 'mine' && 'bg-brand text-white border-brand',
              )}
            >
              {slot.time}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-4 text-xs flex-wrap">
        <LegendDot color="bg-success-bg border-success/30" label="Bo'sh" />
        <LegendDot color="bg-surface-muted border-border" label="Band" />
        <LegendDot color="bg-brand" label="Sizning bronlaringiz" />
      </div>
    </Card>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-ink-muted">
      <span className={cn('h-3 w-3 rounded border', color)} />
      {label}
    </span>
  )
}
