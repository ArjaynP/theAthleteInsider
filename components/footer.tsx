import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-xs font-bold text-primary-foreground">AI</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold leading-tight tracking-tight text-foreground">
                  THE ATHLETE
                </span>
                <span className="text-[10px] font-semibold leading-tight tracking-widest text-primary">
                  INSIDER
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The scrappy alternative to corporate sports media. Community-driven coverage, elite fantasy analytics, and real talk.
            </p>
          </div>

          {/* Coverage */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Coverage</h3>
            <ul className="flex flex-col gap-2">
              {["NBA", "NFL", "Fantasy Hub", "Betting"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Company</h3>
            <ul className="flex flex-col gap-2">
              {["About Us", "Write For Us", "Careers", "Contact"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Morning Brief</h3>
            <p className="mb-3 text-sm text-muted-foreground">
              Get the top sports stories delivered every morning.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          2026 The Athlete Insider. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
