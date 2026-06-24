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
        <div className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-gold/20 text-gold-200 text-[10px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="h-3 w-3" />
              Nurli Diyor Residence
            </div>
            <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight">−1 qavatdagi qulayliklar</h1>
            <p className="text-gold-100/90 text-sm mt-1">
              {facilityList.length} ta maxsus joy — sport, dam olish, ijod va o'yin uchun
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

      {/* Facility cards grid — image preview on each card */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {filtered.map((f) => {
          const isActive = facility === f.type
          return (
            <button
              key={f.type}
              onClick={() => setFacility(f.type)}
              className={cn(
                'group rounded-card border overflow-hidden text-left transition-all relative',
                isActive
                  ? 'border-brand shadow-card-hover ring-2 ring-brand/30 scale-[1.02]'
                  : 'border-border hover:border-brand-200 hover:shadow-card-hover hover:-translate-y-0.5',
              )}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] bg-surface-subtle overflow-hidden">
                <img
                  src={f.imageUrl}
                  alt={f.label}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                {/* Icon badge */}
                <div className={cn('absolute top-2 left-2 h-8 w-8 rounded-element backdrop-blur flex items-center justify-center', f.color, 'bg-white/85')}>
                  <f.icon className="h-4 w-4" strokeWidth={2} />
                </div>
                {/* Price badge */}
                <div className="absolute top-2 right-2">
                  {f.isFree ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-pill font-bold bg-success text-white">
                      BEPUL
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-pill font-bold bg-gold text-white">
                      {formatUZS(f.pricePerHour ?? 0, { short: true })}/s
                    </span>
                  )}
                </div>
                {/* Bottom info */}
                <div className="absolute bottom-2 left-2 right-2 text-white">
                  <p className="text-sm font-bold leading-tight truncate">{f.label}</p>
                  <p className="text-[10px] text-white/80 inline-flex items-center gap-1 mt-0.5">
                    <Users className="h-2.5 w-2.5" />
                    {f.capacity} kishilik
                  </p>
                </div>
              </div>

              {/* Description (only on active or hover) */}
              <div
                className={cn(
                  'px-2.5 py-2 text-[11px] line-clamp-2',
                  isActive ? 'bg-brand text-white' : 'bg-surface text-ink-muted',
                )}
              >
                {f.description}
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
          {/* Hero card with large image */}
          <Card className="overflow-hidden">
            <div className="relative aspect-[21/9] bg-surface-subtle">
              <img
                src={active.imageUrl}
                alt={active.label}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Floating tag */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-gold/95 text-white text-[10px] font-bold uppercase tracking-wider">
                Nurli Diyor · −1 qavat
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <div className="flex items-end justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className={cn('h-14 w-14 rounded-element flex items-center justify-center backdrop-blur', active.color, 'bg-white/90')}>
                      <active.icon className="h-7 w-7" strokeWidth={2} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold tracking-tight">{active.label}</h2>
                      <p className="text-sm text-white/85">{active.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-pill bg-white/15 backdrop-blur text-xs font-semibold">
                    🕐 {String(active.hoursFrom).padStart(2, '0')}:00 – {String(active.hoursTo).padStart(2, '0')}:00
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-pill bg-white/15 backdrop-blur text-xs font-semibold">
                    <Users className="h-3 w-3" />
                    {active.capacity} kishi
                  </span>
                  {active.isFree ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-pill bg-success text-white text-xs font-bold uppercase tracking-wider">
                      Bepul
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-pill bg-gold text-white text-xs font-bold">
                      {formatUZS(active.pricePerHour ?? 0, { short: true })}/soat
                    </span>
                  )}
                </div>
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
