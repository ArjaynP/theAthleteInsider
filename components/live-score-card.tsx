import type { Game } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface LiveScoreCardProps {
  game: Game;
}

export function LiveScoreCard({ game }: LiveScoreCardProps) {
  const isLive = game.status === "LIVE";
  const isFinal = game.status === "FINAL";

  return (
    <div
      className={cn(
        "flex min-w-[240px] flex-col rounded-xl border bg-card p-4 transition-all hover:border-primary/30",
        isLive ? "border-accent" : "border-border"
      )}
    >
      {/* Status bar */}
      <div className="mb-3 flex items-center justify-between">
        <span
          className={cn(
            "rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
            isLive
              ? "bg-accent text-accent-foreground"
              : isFinal
                ? "bg-secondary text-secondary-foreground"
                : "bg-primary/20 text-primary"
          )}
        >
          {isLive ? `${game.quarter} ${game.time}` : game.status === "UPCOMING" ? game.startTime : game.status}
        </span>
        {isLive && (
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-xs font-black text-foreground">
              {game.awayTeam.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-black uppercase text-foreground">
                {game.awayTeam}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {game.awayRecord}
              </p>
            </div>
          </div>
          <span
            className={cn(
              "text-xl font-black tabular-nums",
              game.status === "UPCOMING"
                ? "text-muted-foreground"
                : game.awayScore > game.homeScore
                  ? "text-foreground"
                  : "text-muted-foreground"
            )}
          >
            {game.status === "UPCOMING" ? "-" : game.awayScore}
          </span>
        </div>

        <div className="h-px bg-border" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-xs font-black text-foreground">
              {game.homeTeam.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-black uppercase text-foreground">
                {game.homeTeam}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {game.homeRecord}
              </p>
            </div>
          </div>
          <span
            className={cn(
              "text-xl font-black tabular-nums",
              game.status === "UPCOMING"
                ? "text-muted-foreground"
                : game.homeScore > game.awayScore
                  ? "text-foreground"
                  : "text-muted-foreground"
            )}
          >
            {game.status === "UPCOMING" ? "-" : game.homeScore}
          </span>
        </div>
      </div>
    </div>
  );
}
