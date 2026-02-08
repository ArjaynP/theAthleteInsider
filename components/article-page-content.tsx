"use client";

import Link from "next/link";
import { articles, polls, type Article } from "@/lib/mock-data";
import { PollWidget } from "@/components/poll-widget";
import { ArticleCard } from "@/components/article-card";
import { NewsletterSignup } from "@/components/newsletter-signup";
import {
  Clock,
  Share2,
  ArrowLeft,
  Twitter,
  Facebook,
  Link2,
} from "lucide-react";
import { toast } from "sonner";

interface ArticlePageProps {
  article: Article;
}

export function ArticlePage({ article }: ArticlePageProps) {
  const relatedArticles = articles
    .filter((a) => a.league === article.league && a.id !== article.id)
    .slice(0, 3);

  const relevantPoll = polls.find((p) => p.league === article.league);

  const paragraphs = article.content.split("\n").filter((p) => p.trim());

  function handleShare() {
    toast.success("Link copied to clipboard!");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Back link */}
      <Link
        href={`/${article.league.toLowerCase()}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {article.league}
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Article content */}
        <article className="lg:col-span-2">
          {/* Hero area */}
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                {article.league}
              </span>
              <span className="rounded bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-secondary-foreground">
                {article.category}
              </span>
            </div>

            <h1 className="mb-4 text-balance text-3xl font-black uppercase leading-none tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              {article.excerpt}
            </p>

            {/* Byline */}
            <div className="flex items-center justify-between border-b border-t border-border py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {article.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {article.author}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{article.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Share buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label="Copy link"
                >
                  <Link2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Article body */}
          <div className="prose-dark mb-8 max-w-none">
            {paragraphs.map((paragraph, i) => (
              <p
                key={`p-${i}`}
                className="mb-6 text-base leading-relaxed text-foreground/90"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Embedded poll */}
          {relevantPoll && (
            <div className="mb-8">
              <PollWidget poll={relevantPoll} />
            </div>
          )}

          {/* Tags */}
          <div className="mb-8 flex flex-wrap gap-2">
            {[article.league, article.category, "Analysis", "Trending"].map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-widest text-secondary-foreground"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </article>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-primary" />
              <h3 className="text-lg font-black uppercase text-foreground">
                Related Stories
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {relatedArticles.map((a) => (
                <ArticleCard key={a.id} article={a} variant="compact" />
              ))}
            </div>
          </div>

          <NewsletterSignup />
        </aside>
      </div>
    </div>
  );
}
