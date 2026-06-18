import { Download, FileText, Share2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { useDocuments } from '@/api/profile'
import { formatDate } from '@/lib/utils'
import type { DocumentType } from '@/types'

const typeLabels: Record<DocumentType, string> = {
  contract: 'Shartnoma',
  receipt: 'Kvitansiya',
  act: 'Dalolatnoma',
  passport: 'Texnik pasport',
  other: 'Boshqa',
}

const typeTones: Record<DocumentType, 'brand' | 'success' | 'warning' | 'neutral'> = {
  contract: 'brand',
  receipt: 'success',
  act: 'warning',
  passport: 'neutral',
  other: 'neutral',
}

const formatBytes = (n: number) => {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

export function DocumentsSection() {
  const { data, isLoading } = useDocuments()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-brand" />
          Hujjatlar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)
          : data?.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-3 rounded-[10px] border border-border">
                <div className="h-10 w-10 rounded-[8px] bg-brand-50 text-brand flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{doc.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge tone={typeTones[doc.type]} className="text-[10px]">
                      {typeLabels[doc.type]}
                    </Badge>
                    <span className="text-[11px] text-ink-muted">
                      {formatBytes(doc.fileSize)} · {formatDate(doc.uploadedAt)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" aria-label="Yuklab olish" title="Yuklab olish">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" aria-label="Ulashish" title="Ulashish">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
      </CardContent>
    </Card>
  )
}
