import { StickyHeader } from '@/features/landing/StickyHeader'
import { HeroSection } from '@/features/landing/HeroSection'
import { LiveProofStrip } from '@/features/landing/LiveProofStrip'
import { FeaturesGrid } from '@/features/landing/FeaturesGrid'
import { ProjectShowcase } from '@/features/landing/ProjectShowcase'
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
        <StatsCounter />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  )
}
