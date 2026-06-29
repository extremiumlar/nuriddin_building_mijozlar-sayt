import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  FileSignature,
  Loader2,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'
import {
  contractToUser,
  uysotConfigured,
  uysotContractApi,
} from '@/api/uysot'

interface Props {
  className?: string
}

/**
 * Login by contract number (e.g. "NUR-4"). The Open API /lead/* endpoints
 * are currently scope-blocked, so passport search isn't available yet —
 * shown here as a disabled second tab so the UI hints at what's coming.
 */
export function UysotLoginForm({ className }: Props) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { setTokens, setUser, setUysotIds } = useAuthStore()
  const { notify } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
    '/dashboard'

  if (!uysotConfigured) {
    return (
      <div
        className={cn(
          'rounded-card border border-warning/40 bg-warning-bg/30 p-4 text-sm text-warning-fg',
          className,
        )}
      >
        <p className="font-semibold">Uysot API hali sozlanmagan</p>
        <p className="text-xs mt-1 opacity-80">
          <code>.env</code> faylida <code>VITE_UYSOT_API_URL</code> ni to'ldiring.
        </p>
      </div>
    )
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const q = value.trim()
    if (!q) {
      setError("Shartnoma raqamini kiriting")
      return
    }
    setLoading(true)
    try {
      const list = await uysotContractApi.filter({
        page: 1,
        size: 1,
        contractNumber: q,
      })
      const contractRow = list.data?.[0]
      if (!contractRow) throw new Error("Bunday raqamli shartnoma topilmadi")

      // Get full detail (monthly payments + client + flats live here)
      const contract = await uysotContractApi.getById(contractRow.id)
      const userPart = contractToUser(contract)

      setTokens('uysot-session', 'uysot-session')
      setUser({
        id: userPart.id ?? String(contract.id),
        fullName: userPart.fullName ?? 'Mijoz',
        phone: userPart.phone ?? '',
        role: 'MIJOZ',
        contractNumber: contract.number,
        contractDate: userPart.contractDate,
        registeredAt: userPart.registeredAt ?? new Date().toISOString(),
      })
      setUysotIds({ contractId: contract.id, leadId: contract.client?.id ?? null })
      notify(`Xush kelibsiz, ${(userPart.fullName ?? '').split(' ')[0]}!`, 'success')
      navigate(from, { replace: true })
    } catch (err) {
      const data = (err as { response?: { data?: { message?: string } } }).response?.data
      const msg = data?.message ?? (err as Error).message ?? 'Shartnoma topilmadi'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className={cn('space-y-4', className)}>
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-ink">Shartnoma orqali kirish</h2>
        <p className="text-sm text-ink-muted mt-1">Mavjud mijoz hisobi uchun</p>
      </div>

      <div className="rounded-element border border-border bg-surface-muted/60 p-3 inline-flex items-center gap-2 text-xs text-ink-muted w-full">
        <FileSignature className="h-3.5 w-3.5 text-brand shrink-0" />
        <span>
          Shartnoma raqami (masalan: <code className="font-mono font-semibold text-ink">NUR-4</code>) orqali kirish.
          Passport orqali qidirish hozir Uysot tomondan o'chirilgan.
        </span>
      </div>

      <Input
        label="Shartnoma raqami"
        value={value}
        onChange={(e) => setValue(e.target.value.toUpperCase())}
        placeholder="NUR-4"
        leftIcon={<Search className="h-4 w-4" />}
        error={error ?? undefined}
        autoFocus
        className={cn(error && 'animate-shake', 'font-mono')}
        autoComplete="off"
      />

      <Button
        type="submit"
        loading={loading}
        fullWidth
        size="lg"
        leftIcon={
          loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )
        }
        rightIcon={!loading ? <ArrowRight className="h-4 w-4" /> : undefined}
      >
        Davom etish
      </Button>

      <p className="text-[11px] text-ink-subtle text-center">
        Shartnoma raqami sizga shartnoma imzolagandan keyin berilgan.
      </p>
    </form>
  )
}
