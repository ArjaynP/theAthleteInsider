import type { Game } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { TeamBadge } from "@/components/team-badge";

interface LiveScoreCardProps {
  game: Game;
  teamLogos?: Record<string, string>;
}

function normalizeAbbreviation(value: string) {
  const normalized = value.toUpperCase();
  const aliasMap: Record<string, string> = {
    GS: "GSW",
    NY: "NYK",
    NO: "NOP",
    SA: "SAS",
    UTAH: "UTA",
    WSH: "WAS",
  };
  return aliasMap[normalized] ?? normalized;
}

export function LiveScoreCard({ game, teamLogos }: LiveScoreCardProps) {
  const isLive = game.status === "LIVE";
  const isFinal = game.status === "FINAL";
  const liveStatusText = [game.quarter, game.time].filter(Boolean).join(" ").trim() || "LIVE";
  const badgeLeague = game.league === "NBA" || game.league === "NFL" || game.league === "MLB" ? game.league : null;
  const awayLogo = badgeLeague === "NBA" ? teamLogos?.[normalizeAbbreviation(game.awayTeam)] : undefined;
  const homeLogo = badgeLeague === "NBA" ? teamLogos?.[normalizeAbbreviation(game.homeTeam)] : undefined;

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
          {isLive ? liveStatusText : game.status === "UPCOMING" ? game.startTime : game.status}
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
            {awayLogo ? (
              <img src={awayLogo} alt={`${game.awayTeam} logo`} className="h-8 w-8 object-contain" />
            ) : badgeLeague ? (
              <TeamBadge abbreviation={game.awayTeam} league={badgeLeague} size="md" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-xs font-black text-foreground">
                {game.awayTeam.charAt(0)}
              </div>
            )}
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
            {homeLogo ? (
              <img src={homeLogo} alt={`${game.homeTeam} logo`} className="h-8 w-8 object-contain" />
            ) : badgeLeague ? (
              <TeamBadge abbreviation={game.homeTeam} league={badgeLeague} size="md" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-xs font-black text-foreground">
                {game.homeTeam.charAt(0)}
              </div>
            )}
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
