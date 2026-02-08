import { articles } from "@/lib/mock-data";
import { ArticleCard } from "@/components/article-card";
import { PollWidget } from "@/components/poll-widget";
import { polls } from "@/lib/mock-data";

export function FeaturedArticles() {
  const nonFeatured = articles.filter((a) => !a.featured);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="mb-6 flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-primary" />
          <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
            Latest Stories
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {nonFeatured.slice(0, 4).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>

      {/* Inline Poll */}
      <PollWidget poll={polls[1]} />

      <div>
        <div className="mb-6 flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-amber" />
          <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
            More Headlines
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          {nonFeatured.slice(4).map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="compact"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
