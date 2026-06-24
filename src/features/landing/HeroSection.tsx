import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, ArrowRight, Building, Layers, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/Logo'
import { FadeUp, Stagger, StaggerItem } from '@/components/motion'

const trustBadges = [
  { icon: Award, label: 'Premium loyiha' },
  { icon: Layers, label: '9 qavat' },
  { icon: Sparkles, label: '10 ta qulaylik' },
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
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <div className="relative aspect-[4/5] lg:aspect-[5/6] rounded-dialog overflow-hidden bg-gradient-to-br from-brand to-brand-900 shadow-elevated">
      {/* Real project render with fallback */}
      {!imgFailed ? (
        <img
          src="/projects/nurli-diyor-1.jpg"
          alt="Nurli Diyor Residence — aerial render"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gold-300">
          <Building className="h-20 w-20 mb-3 opacity-80" />
          <p className="text-sm font-bold uppercase tracking-wider opacity-90">Nurli Diyor Residence</p>
          <p className="text-xs mt-1 opacity-70">Render tez kunda yuklanadi</p>
        </div>
      )}
      {/* Gradient overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-900/10 to-transparent" />

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
              <p className="text-[10px] text-ink-muted uppercase tracking-wider">9 qavat · 1 blok</p>
              <p className="text-base font-bold text-ink mt-0.5">Birinchi loyiha</p>
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
