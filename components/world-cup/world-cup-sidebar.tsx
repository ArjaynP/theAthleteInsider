import Link from "next/link";
import { Globe } from "lucide-react";

const links = [
  { label: "News & Analysis", href: "/world-cup" },
  { label: "Group Stage", href: "/world-cup/group-stage" },
  { label: "Scores", href: "/world-cup/scores" },
  { label: "Player Stats", href: "/world-cup/stats" },
] as const;

export function WorldCupSidebar() {
  return (
    <aside className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="font-black uppercase tracking-tight text-foreground">Coming Soon</h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          This World Cup hub is ready for the next API drop. When the feed is connected,
          these page sections can be populated without changing navigation or layout.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-foreground">
          Quick Links
        </h3>
        <div className="flex flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
            >
              {link.label}
              <span className="text-muted-foreground">→</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
