import { StickyHeader } from '@/features/landing/StickyHeader'
import { HeroSection } from '@/features/landing/HeroSection'
import { LiveProofStrip } from '@/features/landing/LiveProofStrip'
import { FeaturesGrid } from '@/features/landing/FeaturesGrid'
import { ProjectShowcase } from '@/features/landing/ProjectShowcase'
import { ConstructionHighlights } from '@/features/landing/ConstructionHighlights'
import { LotteryHighlights } from '@/features/landing/LotteryHighlights'
import { MonthlyMediaSection } from '@/features/landing/MonthlyMediaSection'
import { CommunityAmenities } from '@/features/landing/CommunityAmenities'
import { StatsCounter } from '@/features/landing/StatsCounter'
import { CTASection } from '@/features/landing/CTASection'
import { LandingFooter } from '@/features/landing/Footer'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <StickyHeader />
      <main>
        <HeroSection />
        <LiveProofStrip />
        <FeaturesGrid />
        <ProjectShowcase />
        <ConstructionHighlights />
        <LotteryHighlights />
        <MonthlyMediaSection />
        <CommunityAmenities />
        <StatsCounter />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  )
}
