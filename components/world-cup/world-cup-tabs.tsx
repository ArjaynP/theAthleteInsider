import Link from "next/link";
import { cn } from "@/lib/utils";

type WorldCupTabId = "news" | "group-stage" | "scores" | "stats";

const WORLD_CUP_TABS: Array<{ id: WorldCupTabId; label: string; href: string }> = [
  { id: "news", label: "News & Analysis", href: "/world-cup" },
  { id: "group-stage", label: "Group Stage", href: "/world-cup/group-stage" },
  { id: "scores", label: "Scores", href: "/world-cup/scores" },
  { id: "stats", label: "Player Stats", href: "/world-cup/stats" },
];

export function WorldCupTabs({ activeTab }: { activeTab: WorldCupTabId }) {
  return (
    <nav className="mb-8 flex overflow-x-auto rounded-xl border border-border bg-card p-1">
      {WORLD_CUP_TABS.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          className={cn(
            "flex min-w-max flex-1 items-center justify-center whitespace-nowrap rounded-lg px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === tab.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}