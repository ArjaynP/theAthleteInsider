import { Header } from "@/components/header"
import { ScoresTicker } from "@/components/scores-ticker"
import { HeroSection } from "@/components/home/hero-section"
import { LatestNews } from "@/components/home/latest-news"
import { StandingsPreview } from "@/components/home/standings-preview"
import { PowerRankingsPreview } from "@/components/home/power-rankings-preview"
import { BettingPreview } from "@/components/home/betting-preview"
import { NewsletterCTA } from "@/components/home/newsletter-cta"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <ScoresTicker />
      <main className="flex-1">
        <HeroSection />
        <LatestNews />
        <StandingsPreview />
        <PowerRankingsPreview />
        <BettingPreview />
        <NewsletterCTA />
      </main>
      <Footer />
    </div>
  )
}
