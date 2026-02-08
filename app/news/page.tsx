import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { NewsContent } from "@/components/news/news-content"

export const metadata: Metadata = {
  title: "News | The Athlete Insider",
  description: "Latest sports news, analysis, and insider coverage for NBA, NFL, fantasy, and betting.",
}

export default function NewsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6 flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-foreground">News & Analysis</h1>
            <p className="text-sm text-muted-foreground">
              Insider coverage, hot takes, and analysis from our team of contributors
            </p>
          </div>
          <NewsContent />
        </div>
      </main>
      <Footer />
    </div>
  )
}
