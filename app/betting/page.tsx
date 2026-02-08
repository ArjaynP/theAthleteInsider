"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { oddsData, type OddsData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Star,
  BookOpen,
  ArrowRight,
  Zap,
  CheckCircle2,
  Info,
} from "lucide-react";

// ============ Odds Comparison Table ============
function OddsComparisonTable({
  odds,
}: {
  odds: OddsData[];
}) {
  return (
    <div className="flex flex-col gap-4">
      {odds.map((game) => (
        <div
          key={game.id}
          className="overflow-hidden rounded-xl border border-border bg-card"
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-3">
              <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                {game.league}
              </span>
              <span className="text-sm font-black uppercase text-foreground">
                {game.awayTeam} @ {game.homeTeam}
              </span>
            </div>
            {game.bestBet && (
              <span className="flex items-center gap-1 rounded-lg bg-accent/20 px-3 py-1">
                <Star className="h-3 w-3 text-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                  Best: {game.bestBet}
                </span>
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="px-5 py-3 text-left font-bold uppercase tracking-widest">
                    Sportsbook
                  </th>
                  <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                    Spread
                  </th>
                  <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                    Moneyline
                  </th>
                  <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    { name: "FanDuel", data: game.fanduel },
                    { name: "DraftKings", data: game.draftkings },
                    { name: "BetMGM", data: game.betmgm },
                  ] as const
                ).map((book) => {
                  const isBest =
                    game.bestBet?.includes(book.name) ?? false;
                  return (
                    <tr
                      key={book.name}
                      className={cn(
                        "border-b border-border/50 transition-colors hover:bg-secondary/30",
                        isBest && "bg-accent/5"
                      )}
                    >
                      <td className="px-5 py-3">
                        <span
                          className={cn(
                            "font-bold",
                            isBest ? "text-accent" : "text-foreground"
                          )}
                        >
                          {book.name}
                          {isBest && (
                            <CheckCircle2 className="ml-1 inline h-3 w-3 text-accent" />
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center font-bold tabular-nums text-foreground">
                        {book.data.spread}
                      </td>
                      <td className="px-5 py-3 text-center font-bold tabular-nums text-foreground">
                        {book.data.moneyline}
                      </td>
                      <td className="px-5 py-3 text-center font-bold tabular-nums text-foreground">
                        {book.data.total}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============ Value Picks ============
interface ValuePick {
  game: string;
  pick: string;
  odds: string;
  confidence: number;
  reason: string;
  book: string;
}

const valuePicks: ValuePick[] = [
  {
    game: "LAL vs BOS",
    pick: "Lakers ML",
    odds: "-130",
    confidence: 72,
    reason:
      "Lakers on a 7-game streak. Celtics 2-4 on the road in their last 6. Home court advantage is massive here.",
    book: "BetMGM",
  },
  {
    game: "GSW vs MIL",
    pick: "Over 230.5",
    odds: "-110",
    confidence: 68,
    reason:
      "Both teams rank top-10 in pace. Last 4 meetings have gone over. Combined 245+ in 3 of last 5.",
    book: "DraftKings",
  },
  {
    game: "KC vs DET",
    pick: "Lions +1.5",
    odds: "-105",
    confidence: 65,
    reason:
      "Lions defense is historically good. Getting points in the Super Bowl with this unit is a gift.",
    book: "FanDuel",
  },
];

function ValuePicksSection() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Zap className="h-5 w-5 text-amber" />
        <h3 className="text-lg font-black uppercase text-foreground">
          Value Picks
        </h3>
      </div>
      <div className="flex flex-col gap-4">
        {valuePicks.map((pick) => (
          <div
            key={pick.pick}
            className="rounded-lg border border-border p-4 transition-all hover:border-primary/30"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black uppercase text-foreground">
                  {pick.pick}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({pick.odds})
                </span>
              </div>
              <span className="text-xs font-bold text-muted-foreground">
                {pick.book}
              </span>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
              {pick.reason}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Confidence
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn(
                    "h-full rounded-full",
                    pick.confidence >= 70
                      ? "bg-accent"
                      : pick.confidence >= 50
                        ? "bg-primary"
                        : "bg-amber"
                  )}
                  style={{ width: `${pick.confidence}%` }}
                />
              </div>
              <span className="text-xs font-black tabular-nums text-foreground">
                {pick.confidence}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Betting Education ============
interface GlossaryTerm {
  term: string;
  definition: string;
}

const glossary: GlossaryTerm[] = [
  { term: "Spread", definition: "The margin of victory that a team must cover. A -3 spread means that team must win by more than 3 points." },
  { term: "Moneyline", definition: "A straight-up bet on who will win. Negative odds indicate the favorite, positive odds indicate the underdog." },
  { term: "Over/Under", definition: "A bet on the total combined score of both teams. You wager whether the actual total will be over or under the set number." },
  { term: "Parlay", definition: "A single bet that combines two or more individual wagers. All selections must win for the bet to pay out, but the potential return is higher." },
  { term: "Prop Bet", definition: "A bet on a specific event within a game that doesn't directly relate to the final outcome, like player stats." },
  { term: "Juice/Vig", definition: "The commission the sportsbook charges. Standard juice is -110, meaning you risk $110 to win $100." },
];

function BettingEducation() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-black uppercase text-foreground">
          Betting 101 Glossary
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        {glossary.map((item) => (
          <div
            key={item.term}
            className="rounded-lg border border-border p-3"
          >
            <div className="mb-1 flex items-center gap-2">
              <Info className="h-3 w-3 text-primary" />
              <span className="text-sm font-black uppercase text-foreground">
                {item.term}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {item.definition}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Main Page ============
export default function BettingPage() {
  const [filter, setFilter] = useState<"ALL" | "NBA" | "NFL">("ALL");

  const filteredOdds =
    filter === "ALL"
      ? oddsData
      : oddsData.filter((o) => o.league === filter);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1.5 rounded-full bg-primary" />
              <div>
                <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
                  Betting Odds
                </h1>
                <p className="text-sm text-muted-foreground">
                  Compare odds across top sportsbooks
                </p>
              </div>
            </div>

            <div className="flex rounded-lg border border-border bg-card p-1">
              {(["ALL", "NBA", "NFL"] as const).map((league) => (
                <button
                  key={league}
                  type="button"
                  onClick={() => setFilter(league)}
                  className={cn(
                    "rounded-md px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all",
                    filter === league
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {league}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="flex flex-col gap-8 lg:col-span-2">
              {/* Disclaimer */}
              <div className="flex items-start gap-3 rounded-xl border border-amber/30 bg-amber/5 px-5 py-4">
                <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Odds are for informational purposes only. Please gamble
                  responsibly. If you or someone you know has a gambling
                  problem, call 1-800-GAMBLER.
                </p>
              </div>

              <OddsComparisonTable odds={filteredOdds} />
            </div>

            <aside className="flex flex-col gap-6">
              <ValuePicksSection />
              <BettingEducation />
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
