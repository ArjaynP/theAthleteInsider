import Link from "next/link";
import { cn } from "@/lib/utils";

const worldCupLinks = [
  { id: "group-stage", label: "Group Stage", href: "/world-cup/group-stage" },
  { id: "news-analysis", label: "News & Analysis", href: "/world-cup" },
  { id: "scores", label: "Scores", href: "/world-cup/scores" },
  { id: "player-stats", label: "Player Stats", href: "/world-cup/stats" },
] as const;

type WorldCupTabId = (typeof worldCupLinks)[number]["id"];

export function WorldCupNav({ activeTab }: { activeTab: WorldCupTabId }) {
  return (
    <div className="mb-8 flex overflow-x-auto rounded-2xl border border-border bg-card p-1">
      {worldCupLinks.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          className={cn(
            "flex flex-1 items-center justify-center whitespace-nowrap rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === tab.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
