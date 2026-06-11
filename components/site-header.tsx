"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Trophy,
  BarChart3,
  Users,
  TrendingUp,
  BookOpen,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand-logo";

const navItems = [
  {
    label: "NBA",
    href: "/nba",
    icon: Trophy,
    children: [
      { label: "News & Analysis", href: "/nba" },
      { label: "Scores", href: "/nba/scores" },
      { label: "Standings", href: "/nba/standings" },
      { label: "Playoffs", href: "/nba/playoffs" },
      { label: "Player Stats", href: "/nba/stats" },
    ],
  },
  {
    label: "MLB",
    href: "/mlb",
    icon: Trophy,
    children: [
      { label: "News & Analysis", href: "/mlb" },
      { label: "Scores", href: "/mlb/scores" },
      { label: "Standings", href: "/mlb/standings" },
      { label: "Player Stats", href: "/mlb/stats" },
    ],
  },
  {
    label: "UCL",
    href: "/ucl",
    icon: Trophy,
    children: [
      { label: "News & Analysis", href: "/ucl" },
      { label: "Scores", href: "/ucl/scores" },
      { label: "Standings", href: "/ucl/standings" },
      { label: "Knockout Phase", href: "/ucl/knockout" },
      { label: "Player Stats", href: "/ucl/stats" },
    ],
  },
  {
    label: "World Cup",
    href: "/world-cup",
    icon: Globe,
    children: [
      { label: "News & Analysis", href: "/world-cup" },
      { label: "Group Stage", href: "/world-cup/group-stage" },
      { label: "Scores", href: "/world-cup/scores" },
      { label: "Player Stats", href: "/world-cup/stats" },
    ],
  },
  {
    label: "MLS",
    href: "/mls",
    icon: Trophy,
    children: [
      { label: "News & Analysis", href: "/mls" },
      { label: "Scores", href: "/mls/scores" },
      { label: "Table", href: "/mls/standings" },
      { label: "Player Stats", href: "/mls/stats" },
    ],
  },
  { label: "Scores", href: "/scores", icon: BarChart3 },
  { label: "Community", href: "/community", icon: Users },
  { label: "Betting", href: "/betting", icon: TrendingUp },
  { label: "Fantasy", href: "/fantasy", icon: BookOpen },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <BrandLogo className="h-10 w-10 shadow-lg shadow-primary/20 transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="text-sm font-black uppercase leading-none tracking-wider text-foreground">
              The Athlete
            </span>
            <span className="text-[10px] font-bold uppercase leading-none tracking-[0.2em] text-primary mt-0.5">
              Insider
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() =>
                item.children && setOpenDropdown(item.label)
              }
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors",
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                {item.children && <ChevronDown className="h-3 w-3" />}
              </Link>

              {item.children && openDropdown === item.label && (
                <div className="absolute left-0 top-full z-50 min-w-48 rounded-lg border border-border bg-card p-2 shadow-2xl">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/newsletter"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
          >
            Subscribe
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="rounded-md p-2 text-foreground lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-card lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-4">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-bold uppercase tracking-wide",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-10 flex flex-col gap-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="px-3 py-2 text-sm text-muted-foreground"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-4 border-t border-border pt-4">
              <Link
                href="/newsletter"
                className="block rounded-lg bg-primary px-4 py-3 text-center text-sm font-bold uppercase tracking-wide text-primary-foreground"
                onClick={() => setMobileOpen(false)}
              >
                Subscribe to Newsletter
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
