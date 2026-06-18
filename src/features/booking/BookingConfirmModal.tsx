import { Bell, Calendar, Clock, Wallet } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { formatDate, formatUZS } from '@/lib/utils'
import { facilityMeta } from '@/config/facilities'
import type { FacilityType } from '@/types'

interface Props {
  open: boolean
  facility: FacilityType
  date: string
  time: string
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
}

export function BookingConfirmModal({ open, facility, date, time, onClose, onConfirm, loading }: Props) {
  const meta = facilityMeta[facility]
  const endTime = `${String(+time.split(':')[0] + 1).padStart(2, '0')}:00`

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Bronni tasdiqlash"
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button onClick={onConfirm} loading={loading}>
            Tasdiqlash
          </Button>
        </>
      }
    >
      <div className="p-5 space-y-3.5">
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 rounded-[10px] flex items-center justify-center ${meta.color}`}>
            <meta.icon className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-xs text-ink-muted">Xizmat</p>
            <p className="text-base font-semibold text-ink">{meta.label}</p>
            <p className="text-[11px] text-ink-muted">{meta.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[10px] border border-border p-3">
            <div className="flex items-center gap-1.5 text-ink-muted text-xs">
              <Calendar className="h-3.5 w-3.5" />
              Sana
            </div>
            <p className="text-sm font-semibold text-ink mt-1">{formatDate(date, { day: 'numeric', month: 'short' })}</p>
          </div>
          <div className="rounded-[10px] border border-border p-3">
            <div className="flex items-center gap-1.5 text-ink-muted text-xs">
              <Clock className="h-3.5 w-3.5" />
              Vaqt
            </div>
            <p className="text-sm font-semibold text-ink mt-1">
              {time} – {endTime}
            </p>
          </div>
        </div>

        <div className={`rounded-[10px] border p-3 flex items-start gap-2.5 text-xs ${
          meta.isFree
            ? 'bg-success-bg border-success/20 text-success-fg'
            : 'bg-warning-bg border-warning/20 text-warning-fg'
        }`}>
          <Wallet className="h-4 w-4 shrink-0 mt-0.5" />
          <p>
            {meta.isFree
              ? "Bepul (mijozlar uchun)"
              : `Narx: ${formatUZS(meta.pricePerHour ?? 0)} / soat`}
          </p>
        </div>

        <div className="rounded-[10px] bg-brand-50 border border-brand-100 p-3 flex items-start gap-2.5 text-xs text-brand-700">
          <Bell className="h-4 w-4 shrink-0 mt-0.5" />
          <p>1 soat oldin push-eslatma yuboriladi.</p>
        </div>
      </div>
    </Modal>
  )
}
