import { Link } from 'react-router-dom'
import { Award, ArrowRight, ShieldCheck, Star, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/Logo'
import { FadeUp, Stagger, StaggerItem } from '@/components/motion'

const trustBadges = [
  { icon: Award, label: '12 yillik tajriba' },
  { icon: Users, label: '320+ topshirilgan' },
  { icon: Star, label: '4.9 · 240 sharh' },
  { icon: ShieldCheck, label: 'ISO 9001' },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgb(26 86 219 / 0.15) 1px, transparent 0)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(circle at 50% 40%, rgba(0,0,0,1), transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 40%, rgba(0,0,0,1), transparent 70%)',
        }}
      />
      {/* Decorative gradient blob */}
      <div className="absolute -top-40 -right-32 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-brand/20 to-gold/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div>
            <Stagger staggerChildren={0.08}>
              <StaggerItem>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-gold/15 text-gold-700 dark:text-gold-300 text-xs font-bold uppercase tracking-wider">
                  <Award className="h-3 w-3" />
                  Premium · Cheklangan
                </div>
              </StaggerItem>

              <StaggerItem>
                <h1 className="mt-6 text-5xl lg:text-7xl font-extrabold tracking-tighter leading-[1.05] text-ink">
                  Uy emas, <br />
                  <span className="text-gradient-brand">orzu quramiz</span>
                </h1>
              </StaggerItem>

              <StaggerItem>
                <p className="mt-6 text-lg text-ink-muted leading-relaxed max-w-xl text-pretty">
                  Qadriyatli qo'shnilar — hammaga sotilmaydi. Premium turar-joy majmualari,
                  smart to'lov grafigi va hamjamiyat — bitta yagona portalda.
                </p>
              </StaggerItem>

              <StaggerItem>
                <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <Link to="/login">
                    <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                      Mijoz kabinetiga kirish
                    </Button>
                  </Link>
                  <a href="#features">
                    <Button variant="outline" size="lg">
                      Imkoniyatlarni ko'rish
                    </Button>
                  </a>
                </div>
              </StaggerItem>

              {/* Trust badges row */}
              <StaggerItem>
                <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
                  {trustBadges.map((b) => (
                    <div
                      key={b.label}
                      className="flex items-center gap-2 px-3 py-2 rounded-element bg-surface/60 border border-border backdrop-blur"
                    >
                      <b.icon className="h-3.5 w-3.5 text-brand shrink-0" />
                      <span className="text-[11px] font-medium text-ink-muted truncate">{b.label}</span>
                    </div>
                  ))}
                </div>
              </StaggerItem>
            </Stagger>
          </div>

          {/* Right: visual */}
          <FadeUp delay={0.3} y={32} className="relative">
            <BuildingShowcase />
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

function BuildingShowcase() {
  return (
    <div className="relative aspect-[4/5] lg:aspect-[5/6] rounded-dialog overflow-hidden bg-gradient-to-br from-brand to-brand-900 shadow-elevated">
      {/* Decorative layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-transparent to-transparent" />

      {/* Animated SVG building */}
      <svg
        viewBox="0 0 400 500"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYEnd meet"
      >
        <defs>
          <linearGradient id="buildingGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="windowGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Background skyline */}
        <rect x="20" y="320" width="50" height="180" rx="4" fill="white" opacity="0.08" />
        <rect x="340" y="280" width="40" height="220" rx="4" fill="white" opacity="0.08" />

        {/* Main building */}
        <rect x="100" y="140" width="200" height="360" rx="8" fill="url(#buildingGrad)" />

        {/* Roof */}
        <rect x="95" y="135" width="210" height="14" rx="2" fill="white" opacity="0.95" />

        {/* Windows grid — 5 floors x 4 windows, last floor highlighted (yours) */}
        {Array.from({ length: 5 }).map((_, floor) => {
          const y = 165 + floor * 64
          const isYours = floor === 2
          return Array.from({ length: 4 }).map((__, col) => {
            const x = 120 + col * 42
            return (
              <g key={`${floor}-${col}`}>
                <rect
                  x={x}
                  y={y}
                  width={30}
                  height={48}
                  rx={3}
                  fill={isYours ? 'url(#windowGrad)' : 'white'}
                  opacity={isYours ? 1 : 0.3}
                >
                  {!isYours && (col + floor) % 3 === 0 && (
                    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="4s" begin={`${col * 0.3}s`} repeatCount="indefinite" />
                  )}
                </rect>
              </g>
            )
          })
        })}

        {/* Entrance */}
        <rect x="180" y="450" width="40" height="50" rx="4" fill="white" opacity="0.85" />
      </svg>

      {/* Floating info chips */}
      <div className="absolute top-6 left-6 right-6 flex items-start justify-between pointer-events-none">
        <div className="glass rounded-element px-3 py-2 shadow-card">
          <p className="text-[10px] text-ink-muted uppercase tracking-wider">Loyiha</p>
          <p className="text-sm font-bold text-ink leading-tight">Nurli Diyor</p>
        </div>
        <div className="glass rounded-element px-3 py-2 shadow-card">
          <p className="text-[10px] text-ink-muted uppercase tracking-wider">Topshirish</p>
          <p className="text-sm font-bold text-ink leading-tight">Dek 2026</p>
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="glass rounded-element p-4 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] text-ink-muted uppercase tracking-wider">1-blok · 5 qavat</p>
              <p className="text-base font-bold text-ink mt-0.5">3 qavat tugallandi</p>
            </div>
            <Logo size={40} background="dark" />
          </div>
          <div className="mt-3 h-1.5 bg-surface-subtle rounded-pill overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand to-success rounded-pill" style={{ width: '72%' }} />
          </div>
          <p className="text-[10px] text-ink-muted mt-1.5">72% qurilish tugadi · ~192 kun qoldi</p>
        </div>
      </div>
    </div>
  )
}
