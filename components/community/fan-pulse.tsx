"use client";

import { cn } from "@/lib/utils";

interface TeamSentiment {
  team: string;
  abbreviation: string;
  league: "NBA" | "NFL";
  sentiment: number; // -100 to 100
  trend: "up" | "down" | "neutral";
  recentEvent: string;
}

const teamSentiments: TeamSentiment[] = [
  { team: "Los Angeles Lakers", abbreviation: "LAL", league: "NBA", sentiment: 88, trend: "up", recentEvent: "7-game win streak" },
  { team: "Boston Celtics", abbreviation: "BOS", league: "NBA", sentiment: 82, trend: "neutral", recentEvent: "Cruising to #1 seed" },
  { team: "Kansas City Chiefs", abbreviation: "KC", league: "NFL", sentiment: 92, trend: "up", recentEvent: "Super Bowl bound" },
  { team: "Detroit Lions", abbreviation: "DET", league: "NFL", sentiment: 95, trend: "up", recentEvent: "First Super Bowl appearance" },
  { team: "New York Knicks", abbreviation: "NYK", league: "NBA", sentiment: 71, trend: "up", recentEvent: "Physical style winning games" },
  { team: "Golden State Warriors", abbreviation: "GSW", league: "NBA", sentiment: 45, trend: "down", recentEvent: "Inconsistent play" },
  { team: "Philadelphia Eagles", abbreviation: "PHI", league: "NFL", sentiment: 55, trend: "down", recentEvent: "Early playoff exit" },
  { team: "Phoenix Suns", abbreviation: "PHX", league: "NBA", sentiment: 32, trend: "down", recentEvent: "3-game losing streak" },
  { team: "Dallas Cowboys", abbreviation: "DAL", league: "NFL", sentiment: 28, trend: "down", recentEvent: "Another disappointing season" },
  { team: "Miami Heat", abbreviation: "MIA", league: "NBA", sentiment: 40, trend: "neutral", recentEvent: "Middling in the East" },
];

function getSentimentLabel(sentiment: number) {
  if (sentiment >= 80) return "Ecstatic";
  if (sentiment >= 60) return "Optimistic";
  if (sentiment >= 40) return "Neutral";
  if (sentiment >= 20) return "Frustrated";
  return "Furious";
}

function getSentimentColor(sentiment: number) {
  if (sentiment >= 80) return "bg-accent";
  if (sentiment >= 60) return "bg-primary";
  if (sentiment >= 40) return "bg-amber";
  if (sentiment >= 20) return "bg-amber";
  return "bg-destructive";
}

function getSentimentTextColor(sentiment: number) {
  if (sentiment >= 80) return "text-accent";
  if (sentiment >= 60) return "text-primary";
  if (sentiment >= 40) return "text-amber";
  if (sentiment >= 20) return "text-amber";
  return "text-destructive";
}

export function FanPulse() {
  const sorted = [...teamSentiments].sort(
    (a, b) => b.sentiment - a.sentiment
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-black uppercase text-foreground">
          Fan Pulse - Live Sentiment Tracker
        </h2>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-accent">
            Happiest Fans
          </p>
          <p className="text-xl font-black text-foreground">
            {sorted[0].abbreviation}
          </p>
          <p className="text-xs text-muted-foreground">
            {sorted[0].sentiment}% positive
          </p>
        </div>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-destructive">
            Most Frustrated
          </p>
          <p className="text-xl font-black text-foreground">
            {sorted[sorted.length - 1].abbreviation}
          </p>
          <p className="text-xs text-muted-foreground">
            {sorted[sorted.length - 1].sentiment}% positive
          </p>
        </div>
      </div>

      {/* Sentiment bars */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
            All Teams
          </h3>
        </div>

        <div className="divide-y divide-border/50">
          {sorted.map((team) => (
            <div
              key={team.abbreviation}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/30"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-black text-foreground">
                {team.abbreviation.charAt(0)}
              </div>

              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      {team.team}
                    </span>
                    <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                      {team.league}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-sm font-black tabular-nums",
                        getSentimentTextColor(team.sentiment)
                      )}
                    >
                      {team.sentiment}%
                    </span>
                  </div>
                </div>

                {/* Sentiment bar */}
                <div className="mb-1 h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      getSentimentColor(team.sentiment)
                    )}
                    style={{ width: `${team.sentiment}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    {team.recentEvent}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      getSentimentTextColor(team.sentiment)
                    )}
                  >
                    {getSentimentLabel(team.sentiment)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
