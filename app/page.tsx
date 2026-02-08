import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSection } from "@/components/home/hero-section";
import { LiveScoresStrip } from "@/components/home/live-scores-strip";
import { FeaturedArticles } from "@/components/home/featured-articles";
import { TrendingSidebar } from "@/components/home/trending-sidebar";
import { NewsletterSignup } from "@/components/newsletter-signup";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <LiveScoresStrip />
        <HeroSection />
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <FeaturedArticles />
            </div>
            <aside className="flex flex-col gap-6">
              <TrendingSidebar />
              <NewsletterSignup />
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
