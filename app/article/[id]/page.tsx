import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArticlePage } from "@/components/article-page-content";
import { articles } from "@/lib/mock-data";
import { notFound } from "next/navigation";

export default async function ArticleRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = articles.find((a) => a.id === id);

  if (!article) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <ArticlePage article={article} />
      </main>
      <SiteFooter />
    </div>
  );
}
