"use client";

import { cn } from "@/lib/utils";
import type { PlayoffTeam } from "@/lib/nba-playoff-data";

interface MatchupCardProps {
  topTeam: PlayoffTeam;
  bottomTeam: PlayoffTeam;
  topScore: number;
  bottomScore: number;
  winnerId: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Optional label above the card (e.g. "7 vs 8") */
  label?: string;
}

function TeamRow({
  team,
  score,
  isWinner,
  isEliminated,
  size,
}: {
  team: PlayoffTeam;
  score: number;
  isWinner: boolean | null;
  isEliminated?: boolean;
  size: "sm" | "md" | "lg";
}) {
  const logoSize = size === "sm" ? "h-7 w-7 text-xs" : size === "md" ? "h-8 w-8 text-sm" : "h-10 w-10 text-base";
  const nameSize = size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base";

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 transition-colors",
        isEliminated && "opacity-50",
        isWinner === true && "bg-primary/15 ring-1 ring-primary/40"
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-md font-black text-white",
            logoSize,
            team.primaryColor ? "" : "bg-secondary text-foreground"
          )}
          style={team.primaryColor ? { backgroundColor: team.primaryColor } : undefined}
        >
          {team.abbreviation.slice(0, 2)}
        </div>
        <span className={cn("truncate font-bold uppercase text-foreground", nameSize)}>
          {team.abbreviation}
        </span>
        <span className="shrink-0 text-[10px] font-bold text-muted-foreground">
          #{team.seed}
        </span>
      </div>
      <span
        className={cn(
          "tabular-nums font-black",
          size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg",
          isWinner === true ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {score}
      </span>
    </div>
  );
}

export function MatchupCard({
  topTeam,
  bottomTeam,
  topScore,
  bottomScore,
  winnerId,
  size = "md",
  className,
  label,
}: MatchupCardProps) {
  const topWins = winnerId === topTeam.id;
  const bottomWins = winnerId === bottomTeam.id;

  return (
    <div className={cn("min-w-0", className)}>
      {label && (
        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
      )}
      <div
        className={cn(
          "rounded-xl border border-border bg-card overflow-hidden",
          size === "lg" && "border-primary/30 shadow-lg shadow-primary/5"
        )}
      >
        <div className="divide-y divide-border p-1.5">
          <TeamRow
            team={topTeam}
            score={topScore}
            isWinner={winnerId ? topWins : null}
            isEliminated={winnerId ? !topWins : false}
            size={size}
          />
          <TeamRow
            team={bottomTeam}
            score={bottomScore}
            isWinner={winnerId ? bottomWins : null}
            isEliminated={winnerId ? !bottomWins : false}
            size={size}
          />
        </div>
      </div>
    </div>
  );
}
