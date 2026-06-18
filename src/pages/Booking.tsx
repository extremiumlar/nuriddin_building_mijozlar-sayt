import { useState } from 'react'
import { Gift, Search, Sparkles, Users, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { Skeleton } from '@/components/ui/Skeleton'
import { BookingCalendar } from '@/features/booking/BookingCalendar'
import { BookingConfirmModal } from '@/features/booking/BookingConfirmModal'
import { useCreateBooking, useMyBookings } from '@/api/bookings'
import { facilityList, facilityMeta } from '@/config/facilities'
import { cn, formatDate, formatUZS } from '@/lib/utils'
import type { FacilityType } from '@/types'

export function BookingPage() {
  const [facility, setFacility] = useState<FacilityType>('billiard')
  const [search, setSearch] = useState('')
  const [confirm, setConfirm] = useState<{ open: boolean; time: string; date: string }>({
    open: false,
    time: '',
    date: '',
  })
  const { data: myBookings, isLoading: bookingsLoading } = useMyBookings()
  const create = useCreateBooking()
  const { notify } = useToast()

  const active = facilityMeta[facility]

  const filtered = facilityList.filter((f) => {
    if (!search) return true
    const q = search.toLowerCase()
    return f.label.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)
  })

  const onConfirm = async () => {
    try {
      await create.mutateAsync({ facility, date: confirm.date, startTime: confirm.time })
      notify('Bron qilindi!', 'success')
      setConfirm({ open: false, time: '', date: '' })
    } catch {
      notify('Xato yuz berdi', 'error')
    }
  }

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand via-brand-700 to-brand-900 rounded-card p-5 lg:p-6 text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight">Hamjamiyat infratuzilmasi</h1>
            <p className="text-brand-100 text-sm mt-1">
              {facilityList.length} ta joy mavjud — sport, dam olish, ish va kulgi uchun
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Stat label="Bepul" value={`${facilityList.filter((f) => f.isFree).length} ta`} />
              <Stat label="Pullik" value={`${facilityList.filter((f) => !f.isFree).length} ta`} />
              <Stat label="Bron'larim" value={`${myBookings?.length ?? 0} ta`} />
            </div>
          </div>

          {/* Loyalty mini-widget */}
          <LoyaltyMini bookingsCount={myBookings?.length ?? 0} />
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle" />
        <input
          type="search"
          placeholder="Joy qidirish (sauna, gym, basseyn...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 rounded-[10px] border border-border bg-surface pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 inline-flex items-center justify-center rounded-full hover:bg-surface-subtle"
            aria-label="Tozalash"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Facility cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {filtered.map((f) => {
          const isActive = facility === f.type
          return (
            <button
              key={f.type}
              onClick={() => setFacility(f.type)}
              className={cn(
                'rounded-card border p-3.5 text-left transition-all relative',
                isActive
                  ? 'bg-brand text-white border-brand shadow-card-hover scale-[1.02]'
                  : 'bg-surface border-border hover:border-brand-200 hover:shadow-card-hover',
              )}
            >
              <div
                className={cn(
                  'h-10 w-10 rounded-[10px] flex items-center justify-center',
                  isActive ? 'bg-white/15 text-white' : f.color,
                )}
              >
                <f.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <p className={cn('text-sm font-semibold mt-2.5', isActive ? 'text-white' : 'text-ink')}>{f.label}</p>
              <p className={cn('text-[11px] mt-0.5 line-clamp-1', isActive ? 'text-brand-100' : 'text-ink-muted')}>
                {f.description}
              </p>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {f.isFree ? (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                      isActive ? 'bg-white/15 text-white' : 'bg-success-bg text-success-fg',
                    )}
                  >
                    BEPUL
                  </span>
                ) : (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                      isActive ? 'bg-white/15 text-white' : 'bg-warning-bg text-warning-fg',
                    )}
                  >
                    {formatUZS(f.pricePerHour ?? 0, { short: true })}/soat
                  </span>
                )}
                <span
                  className={cn(
                    'text-[10px] inline-flex items-center gap-0.5',
                    isActive ? 'text-brand-100' : 'text-ink-subtle',
                  )}
                >
                  <Users className="h-2.5 w-2.5" />
                  {f.capacity}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <Card className="p-8 text-center text-ink-muted text-sm">
          "{search}" bo'yicha joy topilmadi
        </Card>
      )}

      {/* Active facility info + calendar */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4 flex items-center gap-4">
            <div
              className={cn(
                'h-14 w-14 rounded-[12px] flex items-center justify-center shrink-0',
                active.color,
              )}
            >
              <active.icon className="h-7 w-7" strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-ink">{active.label}</h2>
              <p className="text-xs text-ink-muted">{active.description}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge tone="neutral">
                  {String(active.hoursFrom).padStart(2, '0')}:00 – {String(active.hoursTo).padStart(2, '0')}:00
                </Badge>
                <Badge tone="neutral">
                  <Users className="h-3 w-3" />
                  Sig'imi: {active.capacity} kishi
                </Badge>
                {active.isFree ? (
                  <Badge tone="success">Bepul</Badge>
                ) : (
                  <Badge tone="warning">{formatUZS(active.pricePerHour ?? 0, { short: true })}/soat</Badge>
                )}
              </div>
            </div>
          </Card>

          <BookingCalendar
            facility={facility}
            onPickSlot={(slot, date) => setConfirm({ open: true, time: slot.time, date })}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mening bronlarim</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {bookingsLoading ? (
              <>
                <Skeleton className="h-14" />
                <Skeleton className="h-14" />
              </>
            ) : myBookings && myBookings.length > 0 ? (
              myBookings.map((b) => {
                const m = facilityMeta[b.facility]
                return (
                  <div key={b.id} className="rounded-[10px] border border-border p-3 flex items-start gap-3">
                    <div className={cn('h-9 w-9 rounded-[8px] flex items-center justify-center', m.color)}>
                      <m.icon className="h-4 w-4" strokeWidth={1.75} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink">{m.label}</p>
                      <p className="text-xs text-ink-muted mt-0.5">
                        {formatDate(b.date)} · {b.startTime}–{b.endTime}
                      </p>
                      <Badge tone="brand" className="mt-1.5">
                        Faol
                      </Badge>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-ink-muted text-center py-6">Hozircha bronlaringiz yo'q</p>
            )}
          </CardContent>
        </Card>
      </div>

      <BookingConfirmModal
        open={confirm.open}
        facility={facility}
        date={confirm.date}
        time={confirm.time}
        onClose={() => setConfirm({ open: false, time: '', date: '' })}
        onConfirm={onConfirm}
        loading={create.isPending}
      />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur rounded-full px-2.5 py-1 text-xs">
      <span className="text-brand-100">{label}:</span>
      <span className="font-semibold">{value}</span>
    </span>
  )
}

function LoyaltyMini({ bookingsCount }: { bookingsCount: number }) {
  // Mock loyalty: every 10 bookings = 1 free hour reward
  const target = 10
  const progress = bookingsCount % target
  const reached = Math.floor(bookingsCount / target)

  return (
    <div className="bg-white/10 backdrop-blur rounded-element p-3 min-w-[200px]">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-brand-100 mb-1.5">
        <Gift className="h-3 w-3" />
        Loyalty
      </div>
      <p className="text-sm font-bold">
        {progress} / {target} bron
      </p>
      <div className="mt-2 h-1.5 bg-white/15 rounded-pill overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold-300 to-gold rounded-pill transition-all"
          style={{ width: `${(progress / target) * 100}%` }}
        />
      </div>
      <p className="text-[10px] text-brand-100 mt-1.5 inline-flex items-center gap-1">
        <Sparkles className="h-2.5 w-2.5" />
        {target - progress} ta qoldi — bepul soat
      </p>
      {reached > 0 && (
        <p className="text-[10px] mt-1 font-bold">+{reached} ta bepul soat to'plandi</p>
      )}
    </div>
  )
}
