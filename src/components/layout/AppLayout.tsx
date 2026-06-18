import { Outlet, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Topbar } from './Topbar'
import { navItems } from '@/config/navigation'

const pageSubtitles: Record<string, string> = {
  '/dashboard': 'Umumiy ko\'rinish',
  '/construction': 'Real vaqt qurilish jarayoni',
  '/payments': 'Grafik, tarix va eslatmalar',
  '/lottery': 'Jonli efir va g\'oliblar',
  '/booking': 'Bilyard, tennis, gym, BBQ',
  '/profile': 'Hujjatlar, referal, murojaatlar',
}

export function AppLayout() {
  const { pathname } = useLocation()

  const { title, subtitle } = useMemo(() => {
    const active = navItems.find((n) => pathname.startsWith(n.to))
    return {
      title: active?.label ?? 'Mijoz portali',
      subtitle: pageSubtitles[active?.to ?? ''],
    }
  }, [pathname])

  return (
    <div className="min-h-screen flex bg-bg">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar title={title} subtitle={subtitle} />
        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
