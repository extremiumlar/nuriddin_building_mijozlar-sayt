import { Award, Flame, Sparkles, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { AnimatedNumber } from '@/components/motion'

export function Gamification() {
  // Mock user stats — would come from API
  const stats = {
    luck: 78,
    streak: 5,
    participations: 7,
    nextBonusIn: 2,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-gold" />
          Sizning omadingiz
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Luck meter */}
        <div className="rounded-element bg-gradient-to-br from-gold-50 to-amber-100 dark:from-gold/15 dark:to-amber-500/10 border border-gold/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-ink">Omad ko'rsatkichi</span>
            <span className="text-2xl font-extrabold text-gradient-gold tracking-tight">
              <AnimatedNumber value={stats.luck} startOnView />
              %
            </span>
          </div>
          <div className="relative h-3 bg-white/40 dark:bg-ink/30 rounded-pill overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-300 via-gold-500 to-amber-600 rounded-pill"
              style={{ width: `${stats.luck}%` }}
            />
          </div>
          <p className="text-[11px] text-ink-muted mt-2">
            Bu — siz ishtirok etgan loterеyalardagi statistik o'rtacha (qiziqarli ko'rsatkich)
          </p>
        </div>

        {/* Streak + participations + bonus */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-element border border-border p-3 text-center">
            <Flame className="h-4 w-4 text-orange-500 mx-auto mb-1" />
            <p className="text-xl font-extrabold text-ink tracking-tight">
              <AnimatedNumber value={stats.streak} startOnView />
            </p>
            <p className="text-[10px] text-ink-muted">Streak (oy)</p>
          </div>
          <div className="rounded-element border border-border p-3 text-center">
            <TrendingUp className="h-4 w-4 text-brand mx-auto mb-1" />
            <p className="text-xl font-extrabold text-ink tracking-tight">
              <AnimatedNumber value={stats.participations} startOnView />
            </p>
            <p className="text-[10px] text-ink-muted">Ishtirok</p>
          </div>
          <div className="rounded-element border border-border p-3 text-center">
            <Award className="h-4 w-4 text-gold mx-auto mb-1" />
            <p className="text-xl font-extrabold text-ink tracking-tight">
              <AnimatedNumber value={stats.nextBonusIn} startOnView />
            </p>
            <p className="text-[10px] text-ink-muted">Bonusgacha (oy)</p>
          </div>
        </div>

        {/* Reward strip */}
        <div className="rounded-element bg-brand-50 dark:bg-brand/10 border border-brand/30 p-3 text-xs">
          <p className="font-bold text-brand-700 dark:text-brand-300">
            🎁 5 oy ketma-ket to'lov qildingiz!
          </p>
          <p className="text-ink-muted mt-1">
            Yana 2 oy davom etsangiz — keyingi loterеyada <span className="font-semibold">2x chipta bonus</span> olasiz.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
