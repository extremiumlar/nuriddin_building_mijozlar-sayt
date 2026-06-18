import { useState } from 'react'
import { motion } from 'framer-motion'
import { Info, QrCode, Share2, Sparkles, Ticket, Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toast'
import { cn, formatDate } from '@/lib/utils'
import type { LotteryTicket } from '@/types'

interface Props {
  tickets: LotteryTicket[] | undefined
  isLoading?: boolean
}

export function MyTicketsCard({ tickets, isLoading }: Props) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between flex-row">
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-4 w-4 text-brand" />
          Mening chiptalarim
          {tickets && <Badge tone="brand">{tickets.length}</Badge>}
        </CardTitle>
        <button className="text-ink-subtle hover:text-ink-muted" title="Qanday chipta olish mumkin?">
          <Info className="h-4 w-4" />
        </button>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <>
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </>
        ) : !tickets || tickets.length === 0 ? (
          <EmptyState
            icon={<Ticket className="h-6 w-6" />}
            title="Hozircha chipta yo'q"
            description="Oylik to'lovni amalga oshirsangiz, avtomatik chipta beriladi."
          />
        ) : (
          tickets.map((t) => <FlippableTicket key={t.id} ticket={t} />)
        )}
      </CardContent>
    </Card>
  )
}

function FlippableTicket({ ticket }: { ticket: LotteryTicket }) {
  const [flipped, setFlipped] = useState(false)
  const { notify } = useToast()

  const onShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    notify('Story rasm yuklanmoqda...', 'info')
  }

  return (
    <div
      className="relative w-full h-28 cursor-pointer"
      onClick={() => setFlipped((f) => !f)}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className={cn(
            'absolute inset-0 rounded-card border overflow-hidden',
            ticket.isWinner
              ? 'bg-gradient-to-r from-gold-100 to-amber-100 dark:from-gold/20 dark:to-amber/20 border-gold/40'
              : 'bg-surface border-border',
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Perforation column */}
          <div
            className={cn(
              'absolute left-[68%] top-2 bottom-2 flex flex-col justify-between',
            )}
          >
            {Array.from({ length: 7 }).map((_, i) => (
              <span
                key={i}
                className={cn('h-1 w-1 rounded-full', ticket.isWinner ? 'bg-gold-400' : 'bg-border')}
              />
            ))}
          </div>

          {/* Winner sparkles */}
          {ticket.isWinner && (
            <>
              <Sparkles className="absolute top-2 right-2 h-3 w-3 text-gold animate-sparkle" style={{ animationDelay: '0s' }} />
              <Sparkles className="absolute bottom-3 left-3 h-3 w-3 text-gold animate-sparkle" style={{ animationDelay: '0.4s' }} />
              <Sparkles className="absolute top-1/2 left-[40%] h-2 w-2 text-amber-500 animate-sparkle" style={{ animationDelay: '0.8s' }} />
            </>
          )}

          <div className="relative h-full flex items-center gap-3 p-3.5 pr-[35%]">
            <div
              className={cn(
                'h-12 w-12 rounded-element flex items-center justify-center shrink-0',
                ticket.isWinner ? 'bg-gradient-to-br from-gold to-amber-700 text-white shadow-glow-gold' : 'bg-brand-50 dark:bg-brand/15 text-brand',
              )}
            >
              {ticket.isWinner ? <Trophy className="h-5 w-5" /> : <Ticket className="h-5 w-5" />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink truncate">{ticket.lotteryName}</p>
              <p className="text-xs text-ink-muted mt-0.5">{formatDate(ticket.lotteryDate)}</p>
              {ticket.isWinner && (
                <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gold-700 dark:text-gold-300">
                  <Trophy className="h-2.5 w-2.5" />
                  G'OLDIM
                </span>
              )}
            </div>
          </div>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-right">
            <p
              className={cn(
                'text-[9px] font-bold uppercase tracking-wider',
                ticket.isWinner ? 'text-gold-700 dark:text-gold-300' : 'text-ink-muted',
              )}
            >
              Chipta
            </p>
            <p
              className={cn(
                'text-xl font-extrabold tracking-tight',
                ticket.isWinner ? 'text-gradient-gold' : 'text-ink',
              )}
            >
              {ticket.number}
            </p>
          </div>
        </div>

        {/* Back */}
        <div
          className={cn(
            'absolute inset-0 rounded-card border flex flex-col items-center justify-center text-center p-4',
            ticket.isWinner
              ? 'bg-gradient-to-br from-gold to-amber-700 text-white border-gold/40'
              : 'bg-gradient-to-br from-brand to-brand-900 text-white border-brand/40',
          )}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <QrCode className="h-12 w-12 mb-1.5" />
          <p className="text-xs font-bold opacity-90">{ticket.number} · {ticket.lotteryName}</p>
          <button
            onClick={onShare}
            className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold bg-white/20 hover:bg-white/30 px-2 py-1 rounded-pill transition-colors"
          >
            <Share2 className="h-3 w-3" />
            Story qilish
          </button>
        </div>
      </motion.div>
    </div>
  )
}
