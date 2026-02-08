import Link from "next/link"
import { articles } from "@/lib/data"

function getCategoryColor(category: string) {
  switch (category) {
    case "NBA":
      return "text-destructive bg-destructive/10"
    case "NFL":
      return "text-primary bg-primary/10"
    case "Fantasy":
      return "text-accent bg-accent/10"
    case "Betting":
      return "text-yellow-400 bg-yellow-400/10"
    default:
      return "text-primary bg-primary/10"
  }
}

export function LatestNews() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Latest News</h2>
        <Link
          href="/news"
          className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          View All
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 6).map((article) => (
          <article
            key={article.id}
            className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${getCategoryColor(article.category)}`}>
                {article.category}
              </span>
              <span className="text-xs text-muted-foreground">{article.date}</span>
            </div>
            <h3 className="mb-2 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
              {article.title}
            </h3>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{article.author}</span>
              <span>{article.readTime}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
