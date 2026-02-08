export function NewsletterCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center md:p-12">
        <h2 className="text-2xl font-bold text-foreground">The Morning Brief</h2>
        <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
          Start your day with the top sports stories, fantasy insights, and betting edges. 
          Delivered every morning before tip-off. Join 10,000+ insiders.
        </p>
        <div className="flex w-full max-w-md gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Subscribe
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Free. No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}
