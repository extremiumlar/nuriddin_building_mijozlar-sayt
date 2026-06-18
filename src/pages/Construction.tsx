import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award,
  FileText,
  HardHat,
  Home,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { OverviewTab } from '@/features/construction/OverviewTab'
import { MyApartmentTab } from '@/features/construction/MyApartmentTab'
import { ReportsTab } from '@/features/construction/ReportsTab'
import { MaterialsTab } from '@/features/construction/MaterialsTab'
import { CertificatesTab } from '@/features/construction/CertificatesTab'

type TabId =
  | 'overview'
  | 'apartment'
  | 'reports'
  | 'materials'
  | 'certificates'

interface Tab {
  id: TabId
  label: string
  icon: LucideIcon
  render: () => React.ReactNode
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Umumiy', icon: LayoutDashboard, render: () => <OverviewTab /> },
  { id: 'apartment', label: 'Mening kvartiram', icon: Home, render: () => <MyApartmentTab /> },
  { id: 'reports', label: 'Hisobotlar', icon: FileText, render: () => <ReportsTab /> },
  { id: 'materials', label: 'Materiallar', icon: HardHat, render: () => <MaterialsTab /> },
  { id: 'certificates', label: 'Sertifikatlar', icon: Award, render: () => <CertificatesTab /> },
]

export function ConstructionPage() {
  const [active, setActive] = useState<TabId>('overview')
  const activeTab = tabs.find((t) => t.id === active)!

  return (
    <div className="space-y-5">
      {/* Sticky tab bar with horizontal scroll */}
      <div className="sticky top-16 z-20 -mx-4 lg:-mx-6 px-4 lg:px-6 py-2 bg-bg/80 backdrop-blur border-b border-border">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin">
          {tabs.map((t) => {
            const isActive = t.id === active
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={cn(
                  'relative inline-flex items-center gap-2 px-3.5 py-2 rounded-element text-sm font-medium whitespace-nowrap transition-colors',
                  isActive ? 'text-brand' : 'text-ink-muted hover:text-ink',
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                {isActive && (
                  <motion.div
                    layoutId="active-tab-underline"
                    className="absolute inset-x-2 -bottom-2 h-0.5 bg-brand rounded-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab content with crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {activeTab.render()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
