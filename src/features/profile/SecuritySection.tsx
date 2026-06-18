import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Apple,
  ChevronRight,
  Globe,
  KeyRound,
  LogOut,
  MapPin,
  Phone,
  Shield,
  ShieldOff,
  Smartphone,
  Trash2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/Toast'
import { cn, formatDateTime } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import {
  useActiveDevices,
  useLogoutAllDevices,
  useRevokeDevice,
} from '@/api/profile'
import type { ActiveDevice } from '@/types'

type DialogState =
  | { kind: 'phone' }
  | { kind: 'pin' }
  | { kind: 'logoutAll' }
  | { kind: 'logout' }
  | null

const platformIcon = (p: ActiveDevice['platform']) => {
  if (p === 'ios') return <Apple className="h-4 w-4" />
  if (p === 'android') return <Smartphone className="h-4 w-4" />
  return <Globe className="h-4 w-4" />
}

export function SecuritySection() {
  const { data: devices, isLoading } = useActiveDevices()
  const revoke = useRevokeDevice()
  const logoutAll = useLogoutAllDevices()
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const { notify } = useToast()
  const [dialog, setDialog] = useState<DialogState>(null)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const onRevoke = async (id: string) => {
    try {
      await revoke.mutateAsync(id)
      notify("Qurilma chiqarildi", 'success')
    } catch {
      notify('Xato', 'error')
    }
  }

  const onLogoutAll = async () => {
    try {
      await logoutAll.mutateAsync()
      notify('Barcha boshqa qurilmalar chiqarildi', 'success')
      setDialog(null)
    } catch {
      notify('Xato', 'error')
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-brand" />
            Xavfsizlik
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Account actions */}
          <div className="space-y-2">
            <Action
              icon={<Phone className="h-4 w-4" />}
              label="Telefon raqamni o'zgartirish"
              description="SMS-kod orqali tasdiqlanadi"
              onClick={() => setDialog({ kind: 'phone' })}
            />
            <Action
              icon={<KeyRound className="h-4 w-4" />}
              label="PIN kod o'zgartirish"
              description="Mobil ilova uchun"
              onClick={() => setDialog({ kind: 'pin' })}
            />
          </div>

          {/* Active devices */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-medium text-ink-muted uppercase">Faol qurilmalar</p>
              {devices && devices.length > 1 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDialog({ kind: 'logoutAll' })}
                  leftIcon={<ShieldOff className="h-3.5 w-3.5" />}
                >
                  Hammasidan chiqish
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            ) : (
              <div className="space-y-2">
                {devices?.map((d) => (
                  <div
                    key={d.id}
                    className={cn(
                      'rounded-[10px] border p-3 flex items-start gap-3',
                      d.current ? 'border-success bg-success-bg/40' : 'border-border',
                    )}
                  >
                    <div
                      className={cn(
                        'h-9 w-9 rounded-[8px] flex items-center justify-center shrink-0',
                        d.current ? 'bg-success text-white' : 'bg-surface-muted text-ink-muted',
                      )}
                    >
                      {platformIcon(d.platform)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-ink truncate">{d.deviceName}</p>
                        {d.current && <Badge tone="success">Joriy</Badge>}
                      </div>
                      <p className="text-[11px] text-ink-muted mt-0.5 inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {d.location}
                      </p>
                      <p className="text-[11px] text-ink-subtle mt-0.5">
                        Oxirgi faollik: {formatDateTime(d.lastActive)}
                      </p>
                    </div>
                    {!d.current && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onRevoke(d.id)}
                        aria-label="Qurilmani chiqarish"
                        title="Qurilmani chiqarish"
                      >
                        <Trash2 className="h-4 w-4 text-danger" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Logout */}
          <div className="pt-2 border-t border-border">
            <Button
              variant="danger"
              fullWidth
              onClick={() => setDialog({ kind: 'logout' })}
              leftIcon={<LogOut className="h-4 w-4" />}
            >
              Profildan chiqish
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Phone change dialog */}
      <ChangePhoneDialog
        open={dialog?.kind === 'phone'}
        onClose={() => setDialog(null)}
        onSuccess={() => {
          setDialog(null)
          notify('Telefon raqam o\'zgartirildi', 'success')
        }}
      />

      {/* PIN change dialog */}
      <ChangePinDialog
        open={dialog?.kind === 'pin'}
        onClose={() => setDialog(null)}
        onSuccess={() => {
          setDialog(null)
          notify('PIN kod o\'zgartirildi', 'success')
        }}
      />

      {/* Logout all confirmation */}
      <Modal
        open={dialog?.kind === 'logoutAll'}
        onClose={() => setDialog(null)}
        title="Barcha qurilmalardan chiqish"
        description="Joriy qurilmadan tashqari barcha qurilmalarda sessiya yopiladi."
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDialog(null)}>
              Bekor
            </Button>
            <Button variant="danger" onClick={onLogoutAll} loading={logoutAll.isPending}>
              Tasdiqlash
            </Button>
          </>
        }
      >
        <div className="p-5 text-sm text-ink-muted">
          Bu amal qaytarib bo'lmaydi. Boshqa qurilmalarga kirish uchun qaytadan login qilish kerak bo'ladi.
        </div>
      </Modal>

      {/* Logout confirmation */}
      <Modal
        open={dialog?.kind === 'logout'}
        onClose={() => setDialog(null)}
        title="Chiqishni tasdiqlang"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDialog(null)}>
              Bekor
            </Button>
            <Button variant="danger" onClick={handleLogout} leftIcon={<LogOut className="h-4 w-4" />}>
              Chiqish
            </Button>
          </>
        }
      >
        <div className="p-5 text-sm text-ink-muted">
          Profilingizdan chiqmoqchimisiz? Keyingi safar telefon raqam va SMS-kod bilan qayta kirasiz.
        </div>
      </Modal>
    </>
  )
}

function Action({
  icon,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-[10px] border border-border hover:bg-surface-muted text-left transition-colors"
    >
      <div className="h-9 w-9 rounded-[8px] bg-brand-50 text-brand flex items-center justify-center shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-ink-muted">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-ink-subtle" />
    </button>
  )
}

function ChangePhoneDialog({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('+998')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (step === 'phone') setStep('otp')
      else onSuccess()
    }, 600)
  }

  const close = () => {
    setStep('phone')
    setPhone('+998')
    setOtp('')
    onClose()
  }

  return (
    <Modal open={open} onClose={close} title="Telefon raqamni o'zgartirish" size="sm">
      <form onSubmit={submit} className="p-5 space-y-4">
        {step === 'phone' ? (
          <>
            <Input
              label="Yangi telefon raqam"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="h-4 w-4" />}
              required
            />
            <p className="text-xs text-ink-muted">Yangi raqamga SMS-kod yuboriladi</p>
          </>
        ) : (
          <>
            <p className="text-sm text-ink-muted">
              <span className="font-medium text-ink">{phone}</span> raqamiga 4 xonali kod yuborildi
            </p>
            <Input
              label="SMS-kod"
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="0000"
              required
            />
          </>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={close}>
            Bekor
          </Button>
          <Button type="submit" loading={loading}>
            {step === 'phone' ? 'Kod yuborish' : 'Tasdiqlash'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function ChangePinDialog({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [pin, setPin] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (pin.length !== 4) {
      setErr('PIN 4 xonali bo\'lishi kerak')
      return
    }
    if (pin !== confirm) {
      setErr('PIN kodlar mos kelmaydi')
      return
    }
    setErr(null)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onSuccess()
      setPin('')
      setConfirm('')
    }, 600)
  }

  return (
    <Modal open={open} onClose={onClose} title="PIN kod o'zgartirish" size="sm">
      <form onSubmit={submit} className="p-5 space-y-4">
        <Input
          label="Yangi PIN (4 raqam)"
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          placeholder="••••"
          leftIcon={<KeyRound className="h-4 w-4" />}
          required
        />
        <Input
          label="PIN ni qayta kiriting"
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value.replace(/\D/g, ''))}
          placeholder="••••"
          error={err ?? undefined}
          required
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Bekor
          </Button>
          <Button type="submit" loading={loading}>
            Saqlash
          </Button>
        </div>
      </form>
    </Modal>
  )
}
