import { useState, type FormEvent } from 'react'
import { LifeBuoy, MessageCircle, Plus, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toast'
import { useCreateTicket, useSupportTickets } from '@/api/profile'
import { cn, formatDate } from '@/lib/utils'
import type { TicketCategory, TicketStatus } from '@/types'

const categoryLabels: Record<TicketCategory, string> = {
  technical: 'Texnik muammo',
  payment: "To'lov savoli",
  apartment: "Kvartira ma'lumoti",
  other: 'Boshqa',
}

const statusMeta: Record<TicketStatus, { tone: 'warning' | 'brand' | 'success' | 'neutral'; label: string }> = {
  open: { tone: 'warning', label: 'Yangi' },
  in_review: { tone: 'brand', label: "Ko'rib chiqilmoqda" },
  resolved: { tone: 'success', label: 'Hal qilindi' },
  closed: { tone: 'neutral', label: 'Yopilgan' },
}

export function SupportTickets() {
  const { data, isLoading } = useSupportTickets()
  const create = useCreateTicket()
  const { notify } = useToast()
  const [open, setOpen] = useState(false)
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
      setOpen(false)
      setForm({ category: 'technical', subject: '', description: '' })
    } catch {
      notify('Xato yuz berdi', 'error')
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between flex-row">
          <CardTitle className="flex items-center gap-2">
            <LifeBuoy className="h-4 w-4 text-brand" />
            Murojaatlar
          </CardTitle>
          <Button size="sm" onClick={() => setOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
            Yangi
          </Button>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {isLoading ? (
            <>
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </>
          ) : !data || data.length === 0 ? (
            <EmptyState
              icon={<MessageCircle className="h-6 w-6" />}
              title="Murojaatlar yo'q"
              description="Texnik muammo yoki savol bo'lsa, biz bilan bog'laning."
            />
          ) : (
            data.map((t) => {
              const meta = statusMeta[t.status]
              return (
                <div key={t.id} className="rounded-[10px] border border-border p-3.5">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <p className="text-sm font-medium text-ink">{t.subject}</p>
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                  </div>
                  <p className="text-xs text-ink-muted line-clamp-2">{t.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-ink-subtle">
                    <span>{categoryLabels[t.category]}</span>
                    <span>·</span>
                    <span>{formatDate(t.createdAt)}</span>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Yangi murojaat"
        description="Bizga muammoingiz yoki savolingizni yuboring"
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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
