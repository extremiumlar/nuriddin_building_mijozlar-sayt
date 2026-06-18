import { Apple, Edit3, Globe, History, LogIn, ShieldAlert, Smartphone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDateTime } from '@/lib/utils'

type AuditKind = 'login' | 'profile_edit' | 'password_change' | 'failed_login' | 'logout'

interface AuditItem {
  id: string
  kind: AuditKind
  device: string
  platform: 'ios' | 'android' | 'web'
  location: string
  at: string
  ip: string
}

const mockLog: AuditItem[] = [
  {
    id: 'a-1',
    kind: 'login',
    device: 'iPhone 15 Pro · Safari',
    platform: 'ios',
    location: 'Toshkent, O\'zbekiston',
    at: '2026-06-11T08:00:00Z',
    ip: '195.158.31.42',
  },
  {
    id: 'a-2',
    kind: 'profile_edit',
    device: 'iPhone 15 Pro · Safari',
    platform: 'ios',
    location: 'Toshkent, O\'zbekiston',
    at: '2026-06-10T15:30:00Z',
    ip: '195.158.31.42',
  },
  {
    id: 'a-3',
    kind: 'login',
    device: 'Chrome · Windows 11',
    platform: 'web',
    location: 'Toshkent, O\'zbekiston',
    at: '2026-06-10T09:15:00Z',
    ip: '84.54.94.12',
  },
  {
    id: 'a-4',
    kind: 'failed_login',
    device: 'Unknown · Safari',
    platform: 'web',
    location: 'Tashkent, Uzbekistan',
    at: '2026-06-09T22:48:00Z',
    ip: '37.110.214.5',
  },
  {
    id: 'a-5',
    kind: 'login',
    device: 'Samsung Galaxy S24',
    platform: 'android',
    location: 'Samarqand, O\'zbekiston',
    at: '2026-06-05T11:15:00Z',
    ip: '195.158.224.17',
  },
]

const kindMeta: Record<AuditKind, { icon: React.ReactNode; label: string; tone: 'brand' | 'neutral' | 'warning' | 'danger' }> = {
  login: { icon: <LogIn className="h-3.5 w-3.5" />, label: 'Kirish', tone: 'brand' },
  profile_edit: { icon: <Edit3 className="h-3.5 w-3.5" />, label: 'Profil tahrirlandi', tone: 'neutral' },
  password_change: { icon: <ShieldAlert className="h-3.5 w-3.5" />, label: 'Parol o\'zgartirildi', tone: 'warning' },
  failed_login: { icon: <ShieldAlert className="h-3.5 w-3.5" />, label: 'Muvaffaqiyatsiz urinish', tone: 'danger' },
  logout: { icon: <LogIn className="h-3.5 w-3.5 rotate-180" />, label: 'Chiqish', tone: 'neutral' },
}

const platformIcon = (p: AuditItem['platform']) => {
  if (p === 'ios') return <Apple className="h-4 w-4" />
  if (p === 'android') return <Smartphone className="h-4 w-4" />
  return <Globe className="h-4 w-4" />
}

export function AuditLog() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-4 w-4 text-brand" />
          Audit log
        </CardTitle>
        <p className="text-xs text-ink-muted mt-1">
          Hisobingizdagi so'nggi {mockLog.length} ta harakat
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {mockLog.map((item) => {
          const m = kindMeta[item.kind]
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-element border border-border"
            >
              <div className="h-9 w-9 rounded-element bg-surface-muted text-ink-muted flex items-center justify-center shrink-0">
                {platformIcon(item.platform)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-ink truncate">{item.device}</p>
                  <Badge tone={m.tone}>
                    {m.icon}
                    {m.label}
                  </Badge>
                </div>
                <p className="text-[11px] text-ink-muted mt-0.5">
                  {item.location} · IP {item.ip}
                </p>
                <p className="text-[11px] text-ink-subtle mt-0.5">{formatDateTime(item.at)}</p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
