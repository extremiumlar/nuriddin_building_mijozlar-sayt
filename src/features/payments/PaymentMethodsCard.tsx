import { CheckCircle2, CreditCard, Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'
import { useSavedCards } from '@/api/payments'
import type { CardBrand, SavedCard } from '@/types'

const brandStyle: Record<CardBrand, { label: string; gradient: string }> = {
  visa: { label: 'VISA', gradient: 'from-blue-700 to-blue-900' },
  mastercard: { label: 'mastercard', gradient: 'from-red-600 to-amber-500' },
  humo: { label: 'HUMO', gradient: 'from-emerald-600 to-emerald-800' },
  uzcard: { label: 'UZCARD', gradient: 'from-sky-500 to-indigo-700' },
}

export function PaymentMethodsCard() {
  const { data, isLoading } = useSavedCards()
  const { notify } = useToast()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-brand" />
            To'lov usullari
          </CardTitle>
          <Button size="sm" variant="ghost" leftIcon={<Plus className="h-4 w-4" />} onClick={() => notify('Yangi karta qo\'shish tez kunda', 'info')}>
            Qo'shish
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <>
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </>
        ) : (
          data?.map((card) => <CardTile key={card.id} card={card} onDelete={() => notify('Karta o\'chirildi', 'success')} />)
        )}
      </CardContent>
    </Card>
  )
}

function CardTile({ card, onDelete }: { card: SavedCard; onDelete: () => void }) {
  const b = brandStyle[card.brand]
  return (
    <div
      className={cn(
        'relative rounded-[14px] p-4 text-white overflow-hidden shadow-card-hover bg-gradient-to-br',
        b.gradient,
      )}
    >
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-6 -right-12 h-20 w-20 rounded-full bg-white/10 pointer-events-none" />

      {/* Top row */}
      <div className="relative flex items-start justify-between">
        <div className="h-7 w-9 rounded-md bg-gradient-to-br from-amber-300 to-amber-500 shadow-inner" />
        <div className="flex items-center gap-1.5">
          {card.isDefault && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="h-2.5 w-2.5" />
              Asosiy
            </span>
          )}
          {!card.isDefault && (
            <button
              onClick={onDelete}
              className="h-6 w-6 inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              aria-label="O'chirish"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Card number */}
      <div className="relative mt-4 font-mono text-base tracking-[0.18em]">
        •••• •••• •••• {card.last4}
      </div>

      {/* Bottom row */}
      <div className="relative mt-3 flex items-end justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-white/70">Egasi</p>
          <p className="text-xs font-semibold mt-0.5 truncate max-w-[140px]">{card.holderName}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-wider text-white/70">Muddat</p>
          <p className="text-xs font-semibold mt-0.5">{card.expiresAt}</p>
        </div>
        <span className="text-sm font-bold italic">{b.label}</span>
      </div>
    </div>
  )
}
