"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const WORLD_CUP_TABS = [
  { label: "News & Analysis", href: "/world-cup" },
  { label: "Group Stage", href: "/world-cup/group-stage" },
  { label: "Scores", href: "/world-cup/scores" },
  { label: "Player Stats", href: "/world-cup/stats" },
];

export function WorldCupTabs() {
  const pathname = usePathname();

  return (
    <div className="mb-8 overflow-x-auto">
      <nav className="inline-flex min-w-full gap-2 rounded-xl border border-border bg-card p-2 sm:min-w-0" aria-label="World Cup sections">
        {WORLD_CUP_TABS.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "whitespace-nowrap rounded-lg px-4 py-2 text-sm font-black uppercase tracking-wide transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
