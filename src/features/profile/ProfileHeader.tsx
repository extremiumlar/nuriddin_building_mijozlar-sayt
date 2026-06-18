import { Edit3, FileSignature, Hash, Phone, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { initials, maskPhone, formatDate } from '@/lib/utils'
import type { User } from '@/types'

interface Props {
  user: User
  onEdit?: () => void
}

export function ProfileHeader({ user, onEdit }: Props) {
  return (
    <Card className="overflow-hidden">
      <div className="h-20 lg:h-28 bg-gradient-to-r from-brand to-brand-800" />
      <div className="px-5 lg:px-6 pb-5">
        {/* Top row: avatar + name + edit */}
        <div className="-mt-10 flex flex-col sm:flex-row sm:items-end gap-4">
          <div
            className="h-[72px] w-[72px] rounded-full bg-surface ring-4 ring-surface flex items-center justify-center text-xl font-bold text-brand shrink-0"
            aria-label="Avatar"
          >
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full rounded-full object-cover" />
            ) : (
              initials(user.fullName)
            )}
          </div>
          <div className="flex-1 min-w-0 sm:pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge tone="success" icon={<ShieldCheck className="h-3 w-3" />}>
                Tasdiqlangan
              </Badge>
              {typeof user.clientOrderNumber === 'number' && (
                <span className="inline-flex items-center gap-1 text-[11px] text-ink-muted">
                  <Hash className="h-3 w-3" />
                  Mijoz №{user.clientOrderNumber}
                </span>
              )}
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-ink mt-1 truncate">{user.fullName}</h2>
          </div>
          {onEdit && (
            <Button variant="outline" onClick={onEdit} leftIcon={<Edit3 className="h-4 w-4" />} className="sm:self-end">
              Profil tahrirlash
            </Button>
          )}
        </div>

        {/* Info grid */}
        <div className="grid sm:grid-cols-3 gap-3 mt-5">
          <Info icon={<Phone className="h-3.5 w-3.5" />} label="Telefon" value={maskPhone(user.phone)} />
          <Info
            icon={<FileSignature className="h-3.5 w-3.5" />}
            label="Shartnoma"
            value={user.contractNumber ?? '—'}
            sub={user.contractDate ? formatDate(user.contractDate, { day: 'numeric', month: 'long', year: 'numeric' }) : undefined}
          />
          <Info label="Ro'yxatdan o'tgan" value={formatDate(user.registeredAt, { day: 'numeric', month: 'long', year: 'numeric' })} />
        </div>
      </div>
    </Card>
  )
}

function Info({
  icon,
  label,
  value,
  sub,
}: {
  icon?: React.ReactNode
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="rounded-[10px] border border-border p-3">
      <div className="flex items-center gap-1.5 text-xs text-ink-muted">
        {icon}
        {label}
      </div>
      <p className="text-sm font-medium text-ink mt-1">{value}</p>
      {sub && <p className="text-[11px] text-ink-muted mt-0.5">{sub}</p>}
    </div>
  )
}
