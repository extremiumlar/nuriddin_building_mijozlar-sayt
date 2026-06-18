import { Check, ExternalLink, Lock, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

const recentDraws = [
  {
    name: 'May oylik loterеya',
    date: '2026-05-30',
    winner: 'Akbar A.',
    hash: '0x4a7f9bc2e8d35f1a92bd5e7c08f4a3b6',
  },
  {
    name: 'Aprel oylik loterеya',
    date: '2026-04-30',
    winner: 'Dilshod K.',
    hash: '0x8c1e3d7b4a92f5e6c0d8b3a7f1e9c4d2',
  },
  {
    name: 'Mart oylik loterеya',
    date: '2026-03-30',
    winner: 'Marjona Y.',
    hash: '0x2f9b6d4e8c7a1f3b5d0e9c8a4f7b2d1e',
  },
]

const features = [
  { label: 'Mersenne Twister algoritmi', desc: 'PRNG, kriptografik darajada xolis' },
  { label: 'Mustaqil notarius', desc: 'Har efir tasdiqlanadi (video)' },
  { label: 'Auditda har chipta', desc: 'Public hash, qayta tekshiriladigan' },
]

export function TransparencyCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-success" />
          Shaffoflik va xolislik
        </CardTitle>
        <p className="text-xs text-ink-muted mt-1">
          Har g'olib uchun cryptographic timestamp va public hash mavjud
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Features */}
        <div className="space-y-2">
          {features.map((f) => (
            <div key={f.label} className="flex items-start gap-2.5">
              <div className="h-5 w-5 rounded-pill bg-success-bg text-success-fg flex items-center justify-center shrink-0 mt-0.5">
                <Check className="h-3 w-3" strokeWidth={3} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{f.label}</p>
                <p className="text-xs text-ink-muted">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent draws with hashes */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
            Oxirgi 3 efir · public hash
          </p>
          {recentDraws.map((d) => (
            <div key={d.hash} className="rounded-element border border-border p-3 bg-surface-muted/50">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <p className="text-sm font-semibold text-ink">{d.name}</p>
                  <p className="text-[11px] text-ink-muted">G'olib: {d.winner} · {d.date}</p>
                </div>
                <Badge tone="success" className="text-[10px]">
                  <Lock className="h-2.5 w-2.5" />
                  Tasdiqlangan
                </Badge>
              </div>
              <p className="mt-2 font-mono text-[10px] text-ink-muted break-all">
                {d.hash}
              </p>
            </div>
          ))}
        </div>

        <Button variant="outline" fullWidth rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
          Audit qoidalarini ko'rish
        </Button>
      </CardContent>
    </Card>
  )
}
