import { Check, Copy, Gift, Send, Users } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useReferral } from '@/api/profile'
import { useToast } from '@/components/ui/Toast'
import { formatUZS, formatDate, initials } from '@/lib/utils'

export function ReferralSystem() {
  const { data, isLoading } = useReferral()
  const { notify } = useToast()
  const [copied, setCopied] = useState(false)

  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Referal tizimi</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48" />
        </CardContent>
      </Card>
    )
  }

  const copy = async () => {
    await navigator.clipboard.writeText(data.code)
    setCopied(true)
    notify('Kod nusxalandi', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  const share = (channel: 'whatsapp' | 'telegram') => {
    const text = encodeURIComponent(`Build Co. mijozlar portali — referal kodim: ${data.code}. Ro'yxatdan o'ting va bonus oling!`)
    const urls = {
      whatsapp: `https://wa.me/?text=${text}`,
      telegram: `https://t.me/share/url?text=${text}`,
    }
    window.open(urls[channel], '_blank')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-4 w-4 text-brand" />
          Referal tizimi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-[12px] bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-200 p-4">
          <p className="text-xs text-brand-700 font-medium">Sizning kodingiz</p>
          <div className="flex items-center justify-between gap-3 mt-2">
            <p className="text-xl lg:text-2xl font-bold text-brand tracking-wider">{data.code}</p>
            <Button size="sm" variant="primary" onClick={copy} leftIcon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}>
              {copied ? 'Nusxalandi' : 'Nusxalash'}
            </Button>
          </div>
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" onClick={() => share('whatsapp')} fullWidth leftIcon={<Send className="h-3.5 w-3.5" />}>
              WhatsApp
            </Button>
            <Button size="sm" variant="outline" onClick={() => share('telegram')} fullWidth leftIcon={<Send className="h-3.5 w-3.5" />}>
              Telegram
            </Button>
          </div>
        </div>

        <div className="rounded-[10px] border border-border p-3.5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-[8px] bg-success-bg text-success-fg flex items-center justify-center">
            <Gift className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-ink-muted">To'plangan bonus</p>
            <p className="text-lg font-bold text-success">{formatUZS(data.totalBonus, { short: true })}</p>
          </div>
        </div>

        <div className="rounded-[8px] bg-warning-bg/50 border border-warning/30 p-3 text-xs text-warning-fg">
          Do'stim taklif qilsam = 1,000,000 so'm bonus. Bonus to'lov hisobiga qo'shiladi.
        </div>

        <div>
          <p className="text-xs font-medium text-ink-muted uppercase mb-2 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Taklif qilingan ({data.referredUsers.length})
          </p>
          <div className="space-y-2">
            {data.referredUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-2.5 rounded-[8px] border border-border">
                <div className="h-9 w-9 rounded-full bg-brand-50 text-brand text-xs font-semibold flex items-center justify-center">
                  {initials(u.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{u.name}</p>
                  <p className="text-[11px] text-ink-muted">{formatDate(u.joinedAt)}</p>
                </div>
                <span className="text-sm font-semibold text-success">+{formatUZS(u.bonus, { short: true })}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
