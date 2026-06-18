import { Award, Download, FileText, ShieldCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useCertificates } from '@/api/construction'
import { cn, formatDate } from '@/lib/utils'
import type { QualityCertificate } from '@/types'

const typeStyles: Record<QualityCertificate['type'], { gradient: string; label: string }> = {
  ISO: { gradient: 'from-brand to-brand-900', label: 'ISO' },
  GOST: { gradient: 'from-rose-600 to-rose-900', label: 'GOST' },
  FSC: { gradient: 'from-success to-emerald-900', label: 'FSC' },
  EN: { gradient: 'from-purple-600 to-purple-900', label: 'EN' },
  TR: { gradient: 'from-gold to-amber-700', label: 'TR' },
}

export function CertificatesTab() {
  const { data, isLoading } = useCertificates()

  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-60" />)}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Hero info banner */}
      <Card className="bg-gradient-to-br from-success/10 to-brand/10 border-success/30">
        <CardContent className="flex items-start gap-3.5">
          <div className="h-12 w-12 rounded-element bg-success-bg text-success-fg flex items-center justify-center shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-ink">Barcha materiallar sertifikatlangan</h3>
            <p className="text-sm text-ink-muted mt-1">
              {data?.length ?? 0} ta rasmiy hujjat — ISO, GOST, FSC, EN va Bojxona Ittifoqi reglamentlari bo'yicha.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Certificates grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((cert) => {
          const style = typeStyles[cert.type]
          return (
            <Card key={cert.id} hoverable className="overflow-hidden">
              {/* Visual hero */}
              <div className={cn('relative h-32 bg-gradient-to-br flex items-center justify-center', style.gradient)}>
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5) 0%, transparent 50%)',
                  }}
                />
                <div className="relative text-center text-white">
                  <Award className="h-10 w-10 mx-auto mb-1 opacity-90" />
                  <p className="text-3xl font-extrabold tracking-tight">{style.label}</p>
                </div>
              </div>

              <CardContent className="space-y-3">
                <div>
                  <h3 className="text-base font-bold text-ink leading-tight">{cert.title}</h3>
                  <p className="text-xs text-ink-muted mt-1">{cert.issuer}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-xs">
                  <div>
                    <p className="text-[10px] text-ink-muted uppercase tracking-wider">Berilgan</p>
                    <p className="font-semibold text-ink mt-0.5">{formatDate(cert.issuedAt, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  {cert.expiresAt && (
                    <div>
                      <p className="text-[10px] text-ink-muted uppercase tracking-wider">Amal qiladi</p>
                      <p className="font-semibold text-ink mt-0.5">{formatDate(cert.expiresAt, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  )}
                </div>

                {cert.expiresAt && (
                  <Badge tone="success">
                    <ShieldCheck className="h-3 w-3" />
                    Faol
                  </Badge>
                )}

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" fullWidth leftIcon={<FileText className="h-3.5 w-3.5" />}>
                    Ko'rish
                  </Button>
                  <Button size="sm" variant="ghost" leftIcon={<Download className="h-3.5 w-3.5" />}>
                    PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
