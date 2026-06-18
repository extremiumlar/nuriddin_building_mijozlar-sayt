import { StickyHeader } from '@/features/landing/StickyHeader'
import { HeroSection } from '@/features/landing/HeroSection'
import { LiveProofStrip } from '@/features/landing/LiveProofStrip'
import { FeaturesGrid } from '@/features/landing/FeaturesGrid'
import { ProjectGallery } from '@/features/landing/ProjectGallery'
import { StatsCounter } from '@/features/landing/StatsCounter'
import { TestimonialsCarousel } from '@/features/landing/TestimonialsCarousel'
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
        <ProjectGallery />
        <StatsCounter />
        <TestimonialsCarousel />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  )
}
