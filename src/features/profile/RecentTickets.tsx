import { useState, type FormEvent } from 'react'
import { ArrowRight, LifeBuoy, MessageCircle, Plus, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toast'
import { cn, formatDate } from '@/lib/utils'
import { useCreateTicket, useSupportTickets } from '@/api/profile'
import type { TicketCategory, TicketStatus } from '@/types'

const categoryLabels: Record<TicketCategory, string> = {
  technical: 'Texnik muammo',
  payment: "To'lov savoli",
  apartment: "Kvartira ma'lumoti",
  other: 'Boshqa',
}

const statusMeta: Record<TicketStatus, { tone: 'warning' | 'brand' | 'success' | 'neutral'; label: string }> = {
  open: { tone: 'warning', label: 'Ochiq' },
  in_review: { tone: 'brand', label: "Ko'rilmoqda" },
  resolved: { tone: 'success', label: 'Hal qilindi' },
  closed: { tone: 'neutral', label: 'Yopilgan' },
}

export function RecentTickets() {
  const { data, isLoading } = useSupportTickets()
  const create = useCreateTicket()
  const { notify } = useToast()
  const [openNew, setOpenNew] = useState(false)
  const [form, setForm] = useState<{ category: TicketCategory; subject: string; description: string }>({
    category: 'technical',
    subject: '',
    description: '',
  })

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await create.mutateAsync(form)
      notify('Murojaat yuborildi', 'success')
      setOpenNew(false)
      setForm({ category: 'technical', subject: '', description: '' })
    } catch {
      notify('Xato yuz berdi', 'error')
    }
  }

  const recent = data?.slice(0, 3)

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between flex-row">
          <CardTitle className="flex items-center gap-2">
            <LifeBuoy className="h-4 w-4 text-brand" />
            So'nggi murojaatlar
          </CardTitle>
          <Button size="sm" onClick={() => setOpenNew(true)} leftIcon={<Plus className="h-4 w-4" />}>
            Yangi
          </Button>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {isLoading ? (
            <>
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </>
          ) : !recent || recent.length === 0 ? (
            <EmptyState
              icon={<MessageCircle className="h-6 w-6" />}
              title="Murojaatlar yo'q"
              description="Savol yoki muammo bo'lsa, biz bilan bog'laning."
            />
          ) : (
            recent.map((t) => {
              const meta = statusMeta[t.status]
              return (
                <div key={t.id} className="rounded-[10px] border border-border p-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-[8px] bg-surface-muted text-ink-muted flex items-center justify-center shrink-0">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{t.subject}</p>
                    <p className="text-[11px] text-ink-muted mt-0.5">
                      {categoryLabels[t.category]} · {formatDate(t.createdAt)}
                    </p>
                  </div>
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                </div>
              )
            })
          )}

          {data && data.length > 0 && (
            <button
              className="w-full text-xs text-brand font-medium flex items-center justify-center gap-1.5 py-2 hover:bg-brand-50 rounded-[8px] mt-1"
              onClick={() => notify('Barcha murojaatlar sahifasi tez kunda', 'info')}
            >
              Barcha murojaatlar ({data.length})
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </CardContent>
      </Card>

      <Modal
        open={openNew}
        onClose={() => setOpenNew(false)}
        title="Yangi murojaat"
        description="Savol yoki muammoni yuboring"
        size="md"
      >
        <form onSubmit={onSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Kategoriya</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(categoryLabels) as TicketCategory[]).map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setForm({ ...form, category: c })}
                  className={cn(
                    'p-2.5 rounded-[8px] border text-sm font-medium transition',
                    form.category === c
                      ? 'bg-brand text-white border-brand'
                      : 'bg-surface border-border text-ink hover:border-brand-200',
                  )}
                >
                  {categoryLabels[c]}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Mavzu"
            placeholder="Qisqacha sarlavha"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Tavsif</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={4}
              placeholder="Muammoni batafsil yozing..."
              className="w-full rounded-[8px] border border-border bg-surface text-sm p-3 focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpenNew(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" loading={create.isPending} leftIcon={<Send className="h-4 w-4" />}>
              Yuborish
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
