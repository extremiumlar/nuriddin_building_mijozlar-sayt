import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  Bell,
  CreditCard,
  FileText,
  HardHat,
  Mail,
  MessageCircle,
  Smartphone,
  Ticket,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'
import { useProfileNotifications, useUpdateProfileNotifications } from '@/api/profile'
import type { ProfileNotificationConfig } from '@/types'

const daysOptions = [1, 3, 7] as const

export function ProfileNotificationSettings() {
  const { data, isLoading } = useProfileNotifications()
  const update = useUpdateProfileNotifications()
  const { notify } = useToast()
  const [form, setForm] = useState<ProfileNotificationConfig | null>(null)

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  if (isLoading || !form) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Xabarnoma sozlamalari</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-72" />
        </CardContent>
      </Card>
    )
  }

  const onSave = async () => {
    try {
      await update.mutateAsync(form)
      notify('Sozlamalar saqlandi', 'success')
    } catch {
      notify('Xato yuz berdi', 'error')
    }
  }

  const setChannel = (key: keyof ProfileNotificationConfig['channels'], v: boolean) =>
    setForm({ ...form, channels: { ...form.channels, [key]: v } })

  const setEvent = <K extends keyof ProfileNotificationConfig['events']>(key: K, v: ProfileNotificationConfig['events'][K]) =>
    setForm({ ...form, events: { ...form.events, [key]: v } })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-brand" />
          Xabarnoma sozlamalari
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Channels */}
        <div>
          <p className="text-xs font-medium text-ink-muted uppercase mb-2.5">Kanallar</p>
          <div className="space-y-2">
            <Channel
              icon={<MessageCircle className="h-4 w-4" />}
              label="SMS"
              description="Telefon raqamingizga"
              checked={form.channels.sms}
              onChange={(v) => setChannel('sms', v)}
            />
            <Channel
              icon={<Smartphone className="h-4 w-4" />}
              label="Push"
              description="Mobil ilovada va brauzerda"
              checked={form.channels.push}
              onChange={(v) => setChannel('push', v)}
            />
            <Channel
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              description="Pochta orqali"
              checked={form.channels.email}
              onChange={(v) => setChannel('email', v)}
            />
          </div>
        </div>

        {/* Events */}
        <div>
          <p className="text-xs font-medium text-ink-muted uppercase mb-2.5">Hodisalar</p>

          {/* Payment reminder timing */}
          <div className="rounded-[10px] border border-border p-3.5 mb-2">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-[8px] bg-brand-50 text-brand flex items-center justify-center shrink-0">
                <CreditCard className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink">To'lov muddati eslatmasi</p>
                <p className="text-xs text-ink-muted mt-0.5 mb-2">Necha kun oldin xabar berish kerak?</p>
                <div className="flex gap-2">
                  {daysOptions.map((d) => (
                    <button
                      key={d}
                      onClick={() => setEvent('paymentReminder', d)}
                      className={cn(
                        'flex-1 py-1.5 rounded-[8px] border text-xs font-medium transition-colors',
                        form.events.paymentReminder === d
                          ? 'bg-brand text-white border-brand'
                          : 'bg-surface border-border text-ink hover:border-brand-200',
                      )}
                    >
                      {d} kun
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Channel
              icon={<AlertTriangle className="h-4 w-4" />}
              label="Qarzdorlik ogohlantirishi"
              description="Kechikkan to'lovlar haqida"
              checked={form.events.debtWarning}
              onChange={(v) => setEvent('debtWarning', v)}
            />
            <Channel
              icon={<HardHat className="h-4 w-4" />}
              label="Qurilish yangiliklari"
              description="Yangi haftalik hisobot bo'lganda"
              checked={form.events.constructionUpdate}
              onChange={(v) => setEvent('constructionUpdate', v)}
            />
            <Channel
              icon={<Ticket className="h-4 w-4" />}
              label="Loterеya natijalari"
              description="G'oliblar aniqlanganda"
              checked={form.events.lotteryResult}
              onChange={(v) => setEvent('lotteryResult', v)}
            />
            <Channel
              icon={<FileText className="h-4 w-4" />}
              label="Yangi hujjat"
              description="Hujjat qo'shilganda"
              checked={form.events.newDocument}
              onChange={(v) => setEvent('newDocument', v)}
            />
          </div>
        </div>

        <Button onClick={onSave} loading={update.isPending} fullWidth>
          Saqlash
        </Button>
      </CardContent>
    </Card>
  )
}

function Channel({
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-3 p-3 rounded-[10px] border border-border cursor-pointer hover:bg-surface-muted transition-colors">
      <div className="h-9 w-9 rounded-[8px] bg-brand-50 text-brand flex items-center justify-center shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-ink-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 rounded-full transition-colors shrink-0',
          checked ? 'bg-brand' : 'bg-border-strong',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
            checked && 'translate-x-5',
          )}
        />
      </button>
    </label>
  )
}
