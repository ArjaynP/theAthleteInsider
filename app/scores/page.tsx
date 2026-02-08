import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScoresContent } from "@/components/scores/scores-content"

export const metadata: Metadata = {
  title: "Live Scores | The Athlete Insider",
  description: "Real-time scores and game updates for NBA, NFL, and more.",
}

export default function ScoresPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6 flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-foreground">Live Scores</h1>
            <p className="text-sm text-muted-foreground">
              Real-time scores and game updates across all leagues
            </p>
          </div>
          <ScoresContent />
        </div>
      </main>
      <Footer />
    </div>
  )
}
