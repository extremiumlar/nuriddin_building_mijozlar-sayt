import { useEffect, useState } from 'react'
import { Bell, Mail, MessageCircle, Smartphone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'
import { useNotificationSettings, useUpdateNotificationSettings } from '@/api/payments'

const daysOptions = [1, 3, 7] as const

export function NotificationSettings() {
  const { data, isLoading } = useNotificationSettings()
  const update = useUpdateNotificationSettings()
  const { notify } = useToast()

  const [form, setForm] = useState<typeof data | null>(null)

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  if (isLoading || !form) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Eslatma sozlamalari</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48" />
        </CardContent>
      </Card>
    )
  }

  const onSave = async () => {
    if (!form) return
    try {
      await update.mutateAsync(form)
      notify('Sozlamalar saqlandi', 'success')
    } catch {
      notify('Xato yuz berdi', 'error')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-brand" />
          Eslatma sozlamalari
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2.5">
          <Channel
            icon={<MessageCircle className="h-4 w-4" />}
            label="SMS-eslatma"
            description="Telefon raqamingizga"
            checked={form.sms}
            onChange={(v) => setForm({ ...form, sms: v })}
          />
          <Channel
            icon={<Mail className="h-4 w-4" />}
            label="Email-eslatma"
            description="Pochta orqali"
            checked={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />
          <Channel
            icon={<Smartphone className="h-4 w-4" />}
            label="Push-eslatma"
            description="Mobil ilovada"
            checked={form.push}
            onChange={(v) => setForm({ ...form, push: v })}
          />
        </div>

        <div>
          <p className="text-sm font-medium text-ink mb-2">Necha kun oldin eslatish?</p>
          <div className="flex gap-2">
            {daysOptions.map((d) => (
              <button
                key={d}
                onClick={() => setForm({ ...form, daysBefore: d })}
                className={cn(
                  'flex-1 py-2.5 rounded-[10px] border text-sm font-medium transition-colors',
                  form.daysBefore === d
                    ? 'bg-brand text-white border-brand'
                    : 'bg-surface border-border text-ink hover:border-brand-200',
                )}
              >
                {d} kun
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Input
            label="Telefon"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            disabled={!form.sms}
          />
          <Input
            label="Email"
            type="email"
            value={form.email_addr}
            onChange={(e) => setForm({ ...form, email_addr: e.target.value })}
            disabled={!form.email}
          />
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
    <label className="flex items-center gap-3 p-3 rounded-[10px] border border-border cursor-pointer hover:bg-surface-muted">
      <div className="h-9 w-9 rounded-[8px] bg-brand-50 text-brand flex items-center justify-center">{icon}</div>
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
          'relative h-6 w-11 rounded-full transition-colors',
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
