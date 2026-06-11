"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const sectionItems = [
  { label: "News & Analysis", href: "/world-cup" },
  { label: "Group Stage", href: "/world-cup/group-stage" },
  { label: "Scores", href: "/world-cup/scores" },
  { label: "Player Stats", href: "/world-cup/stats" },
] as const;

export function WorldCupSectionNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex overflow-x-auto rounded-2xl border border-border bg-card p-1">
      {sectionItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 items-center justify-center whitespace-nowrap rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
