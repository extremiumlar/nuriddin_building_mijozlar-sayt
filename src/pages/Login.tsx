import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Fingerprint,
  Lock,
  Phone,
  QrCode,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore } from '@/store/auth'
import { authApi } from '@/api/auth'
import { appConfig } from '@/config/app'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/Logo'
import { AnimatedNumber, FadeUp, Stagger, StaggerItem } from '@/components/motion'

type Step = 'phone' | 'otp' | 'success'

const facts = [
  { headline: "Uy emas, orzu quramiz", kicker: 'SHIORIMIZ' },
  { headline: "Qadriyatli qo'shnilar — hammaga sotilmaydi", kicker: 'PREMIUM' },
  { headline: 'Iyun loterеyada iPhone 16 Pro yutib oling', kicker: 'AKSIYA' },
  { headline: '320+ mamnun mijoz portal orqali kuzatadi', kicker: 'STATISTIKA' },
  { headline: '98% mijoz mamnunlik koeffitsienti', kicker: 'REYTING' },
]

const trustBadges = [
  { label: 'SSL', desc: '256-bit shifr' },
  { label: 'GDPR', desc: "Ma'lumot himoyasi" },
  { label: 'PCI DSS', desc: "To'lov xavfsizligi" },
]

const stats = [
  { value: 320, suffix: '+', label: 'Mijoz' },
  { value: 12, suffix: '', label: 'Yil tajriba' },
  { value: 98, suffix: '%', label: 'Mamnunlik' },
]

const langs = [
  { code: 'uz', label: "O'zbek" },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
]

export function LoginPage() {
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('+998')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendIn, setResendIn] = useState(60)
  const [activeFact, setActiveFact] = useState(0)
  const [activeLang, setActiveLang] = useState('uz')
  const [showQr, setShowQr] = useState(false)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  const { setTokens, setUser, setRememberMe } = useAuthStore()
  const { notify } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/dashboard'

  // Rotating fact strip
  useEffect(() => {
    const id = setInterval(() => setActiveFact((p) => (p + 1) % facts.length), 4000)
    return () => clearInterval(id)
  }, [])

  // Resend countdown
  useEffect(() => {
    if (step !== 'otp') return
    const t = setInterval(() => setResendIn((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [step])

  const submitPhone = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (phone.replace(/\D/g, '').length < 12) {
      setError("Telefon raqami to'liq kiritilmagan")
      return
    }
    setLoading(true)
    try {
      await authApi.requestOtp({ phone })
      setStep('otp')
      setResendIn(60)
      notify('SMS-kod yuborildi. Test kod: 1234', 'info')
      setTimeout(() => inputsRef.current[0]?.focus(), 250)
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } }).response?.data?.message
      setError(msg ?? "Xato. Iltimos, qaytadan urinib ko'ring.")
    } finally {
      setLoading(false)
    }
  }

  const onOtpChange = (i: number, val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 1)
    const next = [...otp]
    next[i] = clean
    setOtp(next)
    if (clean && i < 3) inputsRef.current[i + 1]?.focus()
    if (next.every((d) => d) && i === 3) {
      void submitOtp(next.join(''))
    }
  }

  const onOtpKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputsRef.current[i - 1]?.focus()
  }

  const onOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (pasted.length === 4) {
      e.preventDefault()
      setOtp(pasted.split(''))
      inputsRef.current[3]?.focus()
      void submitOtp(pasted)
    }
  }

  const submitOtp = async (codeArg?: string) => {
    const code = codeArg ?? otp.join('')
    if (code.length !== 4) return
    setError(null)
    setLoading(true)
    try {
      const res = await authApi.verifyOtp({ phone, code, rememberMe: remember })
      setTokens(res.accessToken, res.refreshToken)
      setUser(res.user)
      setRememberMe(remember)
      setStep('success')
      // Brief success state then navigate
      setTimeout(() => {
        notify(`Xush kelibsiz, ${res.user.fullName.split(' ')[0]}!`, 'success')
        navigate(from, { replace: true })
      }, 900)
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } }).response?.data?.message
      setError(msg ?? "Kod noto'g'ri")
      setOtp(['', '', '', ''])
      inputsRef.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const resend = async () => {
    if (resendIn > 0) return
    setLoading(true)
    try {
      await authApi.requestOtp({ phone })
      setResendIn(60)
      notify('Yangi kod yuborildi', 'info')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg grid lg:grid-cols-[1.05fr_1fr]">
      {/* Left side — gradient marketing panel */}
      <div className="hidden lg:flex relative flex-col justify-between p-12 bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 text-white overflow-hidden">
        {/* Decorative gradients */}
        <div className="absolute -top-32 -right-32 h-[460px] w-[460px] rounded-full bg-gold/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-gold/15 blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #C9A961 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-3">
            <Logo size={44} />
            <div>
              <p className="text-base font-extrabold tracking-tight leading-none">NURIDDIN</p>
              <p className="text-[10px] text-gold-300 tracking-[0.2em] font-medium mt-1">BUILDINGS</p>
            </div>
          </Link>
        </div>

        <div className="relative space-y-8">
          {/* Rotating fact strip */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFact}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-gold/20 text-gold-200 backdrop-blur text-[10px] font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="h-3 w-3" />
                  {facts[activeFact].kicker}
                </div>
                <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-[1.15] text-balance min-h-[5rem]">
                  {facts[activeFact].headline}
                </h2>
              </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="mt-6 flex gap-1.5">
              {facts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveFact(idx)}
                  className={cn(
                    'h-1 rounded-pill transition-all',
                    idx === activeFact ? 'w-8 bg-gold' : 'w-1 bg-white/30 hover:bg-white/50',
                  )}
                  aria-label={`Fakt ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gold/20">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl xl:text-3xl font-extrabold tracking-tight">
                  <AnimatedNumber value={s.value} startOnView format={(n) => `${n}${s.suffix}`} />
                </p>
                <p className="text-[11px] text-gold-200/80 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 pb-4 border-b border-gold/15">
            {trustBadges.map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-gold-300 shrink-0" />
                <div>
                  <p className="text-white font-semibold leading-tight">{b.label}</p>
                  <p className="text-[10px] text-gold-200/80 leading-tight">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-gold-200/70">© 2026 {appConfig.companyName}</p>
        </div>
      </div>

      {/* Right side — auth form */}
      <div className="flex items-center justify-center p-6 lg:p-12 relative">
        {/* Top right mobile logo */}
        <div className="lg:hidden absolute top-6 left-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <Logo size={36} background="dark" />
            <div>
              <p className="text-sm font-extrabold tracking-tight leading-none text-ink">NURIDDIN</p>
              <p className="text-[9px] text-ink-muted tracking-[0.2em] font-medium mt-0.5">BUILDINGS</p>
            </div>
          </Link>
        </div>

        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait" initial={false}>
            {step === 'phone' && (
              <motion.form
                key="phone"
                onSubmit={submitPhone}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-5"
              >
                <FadeUp delay={0.05}>
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-ink">Kirish</h1>
                    <p className="text-sm text-ink-muted mt-1.5">
                      Shartnomada ko'rsatilgan telefon raqamingiz orqali kiring
                    </p>
                  </div>
                </FadeUp>

                <Stagger delayChildren={0.1} staggerChildren={0.06}>
                  <StaggerItem>
                    <Input
                      label="Telefon raqam"
                      type="tel"
                      inputMode="tel"
                      placeholder="+998 90 123 45 67"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      leftIcon={<Phone className="h-4 w-4" />}
                      error={error ?? undefined}
                      autoFocus
                      className={cn(error && 'animate-shake')}
                    />
                  </StaggerItem>

                  <StaggerItem>
                    <label className="flex items-center gap-2 text-sm text-ink select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="h-4 w-4 rounded border-border-strong text-brand focus:ring-brand/30"
                      />
                      Meni eslab qolish (30 kun)
                    </label>
                  </StaggerItem>

                  <StaggerItem>
                    <Button
                      type="submit"
                      loading={loading}
                      fullWidth
                      size="lg"
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      SMS-kod yuborish
                    </Button>
                  </StaggerItem>

                  <StaggerItem>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                        <span className="bg-bg px-2 text-ink-muted">yoki</span>
                      </div>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setShowQr(true)}
                        className="flex items-center justify-center gap-2 h-11 rounded-element border border-border bg-surface hover:border-brand-200 transition-colors text-sm font-medium text-ink press"
                      >
                        <QrCode className="h-4 w-4" />
                        Telegram QR
                      </button>
                      <button
                        type="button"
                        onClick={() => notify('Biometric tez kunda', 'info')}
                        className="flex items-center justify-center gap-2 h-11 rounded-element border border-border bg-surface hover:border-brand-200 transition-colors text-sm font-medium text-ink press"
                      >
                        <Fingerprint className="h-4 w-4" />
                        Biometric
                      </button>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <p className="text-[11px] text-ink-subtle text-center inline-flex items-center justify-center gap-1.5 w-full">
                      <Lock className="h-3 w-3" />
                      Davom etish orqali siz <a className="underline hover:text-ink">foydalanish shartlari</a> bilan rozisiz
                    </p>
                  </StaggerItem>
                </Stagger>
              </motion.form>
            )}

            {step === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-5"
              >
                <div>
                  <button
                    onClick={() => {
                      setStep('phone')
                      setError(null)
                      setOtp(['', '', '', ''])
                    }}
                    className="text-xs text-brand font-semibold mb-3 inline-flex items-center gap-1 hover:underline"
                  >
                    ← Telefon raqamni o'zgartirish
                  </button>
                  <h1 className="text-3xl font-extrabold tracking-tight text-ink">SMS-kodni kiriting</h1>
                  <p className="text-sm text-ink-muted mt-1.5">
                    <span className="font-semibold text-ink">{phone}</span> raqamiga 4 xonali kod yuborildi
                  </p>
                </div>

                <div className={cn('flex justify-center gap-3', error && 'animate-shake')} onPaste={onOtpPaste}>
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputsRef.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={(e) => onOtpChange(i, e.target.value)}
                      onKeyDown={(e) => onOtpKey(i, e)}
                      className={cn(
                        'h-16 w-14 text-center text-2xl font-extrabold bg-surface border-2 rounded-element',
                        'focus:outline-none transition-all duration-200',
                        d ? 'border-brand scale-105' : 'border-border focus:border-brand focus:scale-105',
                      )}
                    />
                  ))}
                </div>

                {error && <p className="text-sm text-danger text-center">{error}</p>}

                <Button
                  onClick={() => submitOtp()}
                  loading={loading}
                  fullWidth
                  size="lg"
                  leftIcon={<ShieldCheck className="h-4 w-4" />}
                >
                  Tasdiqlash
                </Button>

                <div className="text-center text-sm">
                  {resendIn > 0 ? (
                    <span className="text-ink-muted">
                      Qayta yuborish: <span className="font-mono font-semibold text-ink">{resendIn}s</span>
                    </span>
                  ) : (
                    <button onClick={resend} className="text-brand font-semibold hover:underline">
                      Kodni qayta yuborish
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                  className="mx-auto h-20 w-20 rounded-pill bg-success-bg flex items-center justify-center"
                >
                  <Check className="h-10 w-10 text-success" strokeWidth={3} />
                </motion.div>
                <FadeUp delay={0.3}>
                  <h2 className="mt-6 text-2xl font-extrabold text-ink">Xush kelibsiz!</h2>
                  <p className="mt-1 text-sm text-ink-muted">Profilingizga yo'naltirilmoqda...</p>
                </FadeUp>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Language switcher */}
          {step !== 'success' && (
            <div className="mt-8 flex items-center justify-center gap-1 bg-surface border border-border rounded-pill p-0.5 mx-auto w-fit">
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setActiveLang(l.code)}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-pill transition-colors',
                    activeLang === l.code
                      ? 'bg-brand text-white'
                      : 'text-ink-muted hover:text-ink',
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Telegram QR modal */}
        <AnimatePresence>
          {showQr && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
              onClick={() => setShowQr(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="bg-surface rounded-dialog p-8 max-w-sm w-full text-center shadow-elevated"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-bold text-ink">Telegram orqali kirish</h3>
                <p className="text-sm text-ink-muted mt-1.5">
                  Telegram ilovasida QR-kodni skanerlang
                </p>
                <div className="mt-6 mx-auto aspect-square w-48 bg-surface-subtle rounded-element border-2 border-border flex items-center justify-center">
                  <QrCode className="h-24 w-24 text-ink-subtle" />
                </div>
                <p className="mt-4 text-[11px] text-ink-muted">@buildco_login_bot</p>
                <Button onClick={() => setShowQr(false)} variant="outline" fullWidth className="mt-4">
                  Yopish
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
