"use client"

import { useState } from "react"
import { articles, type Article } from "@/lib/data"

const categories = ["All", "NBA", "NFL", "Fantasy", "Betting"]

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

function FeaturedArticle({ article }: { article: Article }) {
  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-card transition-colors hover:border-primary/30 md:flex-row">
      {/* Content */}
      <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
        <div className="mb-3 flex items-center gap-2">
          <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${getCategoryColor(article.category)}`}>
            {article.category}
          </span>
          <span className="text-xs text-muted-foreground">Featured</span>
        </div>
        <h2 className="mb-3 text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary md:text-2xl">
          {article.title}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{article.author}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground" />
          <span>{article.date}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground" />
          <span>{article.readTime}</span>
        </div>
      </div>
      {/* Placeholder visual */}
      <div className="flex h-48 items-center justify-center rounded-b-2xl bg-secondary/50 md:h-auto md:w-80 md:rounded-r-2xl md:rounded-bl-none">
        <span className="text-3xl font-bold text-secondary-foreground/20">{article.category}</span>
      </div>
    </article>
  )
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
      <div className="mb-3 flex items-center gap-2">
        <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${getCategoryColor(article.category)}`}>
          {article.category}
        </span>
        <span className="text-xs text-muted-foreground">{article.date}</span>
      </div>
      <h3 className="mb-2 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
        {article.title}
      </h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
        {article.excerpt}
      </p>
      <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{article.author}</span>
        <span>{article.readTime}</span>
      </div>
    </article>
  )
}

export function NewsContent() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filtered = activeCategory === "All"
    ? articles
    : articles.filter((a) => a.category === activeCategory)

  const featured = filtered.filter((a) => a.featured)
  const rest = filtered.filter((a) => !a.featured)

  return (
    <div>
      {/* Category filter */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured articles */}
      {featured.length > 0 && (
        <div className="mb-8 flex flex-col gap-6">
          {featured.map((article) => (
            <FeaturedArticle key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Article grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex items-center justify-center rounded-xl border border-border bg-card py-16">
          <p className="text-sm text-muted-foreground">No articles found for this category.</p>
        </div>
      )}
    </div>
  )
}
