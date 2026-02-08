import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FantasyDashboard } from "@/components/fantasy/fantasy-dashboard"

export const metadata: Metadata = {
  title: "Fantasy Hub | The Athlete Insider",
  description: "Advanced NBA fantasy analytics, start/sit recommendations, injury impact analysis, and weekly projections.",
}

export default function FantasyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Fantasy Hub</h1>
              <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                NBA
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Advanced analytics, start/sit recommendations, and weekly projections
            </p>
          </div>
          <FantasyDashboard />
        </div>
      </main>
      <Footer />
    </div>
  )
}
