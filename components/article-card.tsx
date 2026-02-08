import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import type { Article } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  variant?: "featured" | "default" | "compact";
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  if (variant === "featured") {
    return (
      <Link
        href={`/article/${article.id}`}
        className="group relative flex min-h-[400px] flex-col justify-end overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 md:min-h-[480px]"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
              {article.league}
            </span>
            <span className="rounded bg-amber px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-background">
              Featured
            </span>
            <span className="text-xs text-muted-foreground">
              {article.category}
            </span>
          </div>
          <h2 className="mb-2 text-2xl font-black uppercase leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary md:text-3xl">
            {article.title}
          </h2>
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">
              {article.author}
            </span>
            <span>{article.date}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readTime}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/article/${article.id}`}
        className="group flex items-start gap-4 rounded-lg border border-transparent p-3 transition-all hover:border-border hover:bg-card"
      >
        <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-secondary" />
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              {article.league}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {article.category}
            </span>
          </div>
          <h3 className="text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
            {article.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">{article.date}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/article/${article.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50"
    >
      <div className="relative h-48 bg-secondary">
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
            {article.league}
          </span>
          <span className="text-[10px] font-medium text-foreground">
            {article.category}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 text-lg font-black uppercase leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary">
          {article.title}
        </h3>
        <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-foreground">
              {article.author}
            </span>
            <span>{article.date}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>
    </Link>
  );
}
