"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { fantasyPicks, type FantasyPick } from "@/lib/mock-data";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  TrendingUp,
  TrendingDown,
  Play,
  Pause,
  ShoppingCart,
  Zap,
  Target,
  AlertTriangle,
} from "lucide-react";

function getRecommendationConfig(rec: FantasyPick["recommendation"]) {
  switch (rec) {
    case "START":
      return {
        label: "Start",
        icon: Play,
        color: "bg-accent/20 text-accent border-accent/30",
        badgeColor: "bg-accent text-accent-foreground",
      };
    case "SIT":
      return {
        label: "Sit",
        icon: Pause,
        color: "bg-destructive/20 text-destructive border-destructive/30",
        badgeColor: "bg-destructive text-destructive-foreground",
      };
    case "BUY LOW":
      return {
        label: "Buy Low",
        icon: TrendingDown,
        color: "bg-primary/20 text-primary border-primary/30",
        badgeColor: "bg-primary text-primary-foreground",
      };
    case "SELL HIGH":
      return {
        label: "Sell High",
        icon: TrendingUp,
        color: "bg-amber/20 text-amber border-amber/30",
        badgeColor: "bg-amber text-background",
      };
    case "STREAM":
      return {
        label: "Stream",
        icon: Zap,
        color: "bg-primary/20 text-primary border-primary/30",
        badgeColor: "bg-primary text-primary-foreground",
      };
  }
}

// ============ Waiver Wire ============
interface WaiverPlayer {
  name: string;
  team: string;
  position: string;
  rosteredPct: number;
  reason: string;
  projPts: number;
}

const waiverWire: WaiverPlayer[] = [
  { name: "Cade Cunningham", team: "DET", position: "PG", rosteredPct: 45, reason: "3 straight triple-doubles", projPts: 41.8 },
  { name: "Jalen Williams", team: "OKC", position: "SF", rosteredPct: 62, reason: "Elite efficiency, rising usage", projPts: 36.2 },
  { name: "Chet Holmgren", team: "OKC", position: "C", rosteredPct: 55, reason: "Block party - 3+ blocks in 4 straight", projPts: 33.5 },
  { name: "Scottie Barnes", team: "TOR", position: "PF", rosteredPct: 71, reason: "All-around stats with Raptors tanking", projPts: 38.9 },
];

function WaiverWireSection() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <ShoppingCart className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-black uppercase text-foreground">
          Waiver Wire Pickups
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        {waiverWire.map((player) => (
          <div
            key={player.name}
            className="rounded-lg border border-border p-3 transition-all hover:border-primary/30"
          >
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-foreground">
                  {player.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {player.team} - {player.position}
                </span>
              </div>
              <span className="text-xs font-bold text-accent">
                +{player.projPts} proj
              </span>
            </div>
            <p className="mb-2 text-xs text-muted-foreground">
              {player.reason}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Rostered
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${player.rosteredPct}%` }}
                />
              </div>
              <span className="text-[10px] font-bold tabular-nums text-foreground">
                {player.rosteredPct}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Injury Impact ============
interface InjuryImpact {
  player: string;
  team: string;
  injury: string;
  status: "OUT" | "QUESTIONABLE" | "PROBABLE";
  impact: string;
  beneficiary: string;
}

const injuries: InjuryImpact[] = [
  { player: "Joel Embiid", team: "PHI", injury: "Knee soreness", status: "QUESTIONABLE", impact: "If he sits, Tyrese Maxey becomes a must-start with boosted usage", beneficiary: "Tyrese Maxey" },
  { player: "Jimmy Butler", team: "MIA", injury: "Ankle sprain", status: "OUT", impact: "Tyler Herro steps into primary scorer role. 25+ PPG without Butler", beneficiary: "Tyler Herro" },
  { player: "Kevin Durant", team: "PHX", injury: "Calf tightness", status: "PROBABLE", impact: "Monitor closely. If limited, Devin Booker usage spikes significantly", beneficiary: "Devin Booker" },
];

function InjuryImpactSection() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber" />
        <h3 className="text-lg font-black uppercase text-foreground">
          Injury Impact Analysis
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        {injuries.map((injury) => (
          <div
            key={injury.player}
            className="rounded-lg border border-border p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-black text-foreground">
                {injury.player}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  ({injury.team})
                </span>
              </span>
              <span
                className={cn(
                  "rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
                  injury.status === "OUT"
                    ? "bg-destructive/20 text-destructive"
                    : injury.status === "QUESTIONABLE"
                      ? "bg-amber/20 text-amber"
                      : "bg-accent/20 text-accent"
                )}
              >
                {injury.status}
              </span>
            </div>
            <p className="mb-1 text-xs text-muted-foreground">
              {injury.injury}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {injury.impact}
            </p>
            <p className="mt-2 text-xs font-bold text-accent">
              <Target className="mr-1 inline h-3 w-3" />
              Beneficiary: {injury.beneficiary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Main Page ============
export default function FantasyPage() {
  const [filter, setFilter] = useState<"ALL" | FantasyPick["recommendation"]>(
    "ALL"
  );

  const filtered =
    filter === "ALL"
      ? fantasyPicks
      : fantasyPicks.filter((p) => p.recommendation === filter);

  const filterOptions = ["ALL", "START", "SIT", "BUY LOW", "SELL HIGH", "STREAM"] as const;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <div className="h-10 w-1.5 rounded-full bg-primary" />
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
                Fantasy Hub
              </h1>
              <p className="text-sm text-muted-foreground">
                Start/sit recommendations, waiver wire, and injury analysis
              </p>
            </div>
          </div>

          {/* Filter pills */}
          <div className="mb-8 flex flex-wrap gap-2">
            {filterOptions.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all",
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content - Player Cards */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              <div className="mb-2 flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-primary" />
                <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                  Weekly Recommendations
                </h2>
              </div>

              {filtered.map((pick) => {
                const config = getRecommendationConfig(pick.recommendation);
                const Icon = config.icon;
                return (
                  <div
                    key={pick.player}
                    className={cn(
                      "flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-center",
                      config.color
                    )}
                  >
                    {/* Recommendation badge */}
                    <div className="flex flex-shrink-0 flex-col items-center gap-1">
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-xl",
                          config.badgeColor
                        )}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {config.label}
                      </span>
                    </div>

                    {/* Player info */}
                    <div className="flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black text-foreground">
                          {pick.player}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {pick.team} - {pick.position}
                        </span>
                      </div>
                      <p className="mb-2 text-xs font-bold text-muted-foreground">
                        {pick.opponent}
                      </p>
                      <p className="text-sm leading-relaxed text-foreground/80">
                        {pick.reason}
                      </p>
                    </div>

                    {/* Projected points */}
                    <div className="flex flex-shrink-0 flex-col items-center rounded-lg bg-background/50 px-4 py-3">
                      <span className="text-2xl font-black tabular-nums text-foreground">
                        {pick.projectedPoints}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Proj Pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar */}
            <aside className="flex flex-col gap-6">
              <WaiverWireSection />
              <InjuryImpactSection />
              <NewsletterSignup />
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
