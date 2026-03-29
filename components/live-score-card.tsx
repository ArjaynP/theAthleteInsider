import type { Game } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { TeamBadge } from "@/components/team-badge";

interface LiveScoreCardProps {
  game: Game;
  teamLogos?: Record<string, string>;
}

function normalizeAbbreviation(value: string, league?: "NBA" | "NFL" | "MLB") {
  const normalized = value.toUpperCase();
  const aliasMap: Record<string, string> = {
    GS: "GSW",
    NY: "NYK",
    NO: "NOP",
    SA: "SAS",
    UTAH: "UTA",
  };
  if (league === "NBA") aliasMap.WSH = "WAS";
  return aliasMap[normalized] ?? normalized;
}

function formatInningTicker(value?: string) {
  if (!value) return "-";
  const raw = value.trim().toUpperCase();
  const match = raw.match(/^(TOP|BOT)\s+(\d{1,2})$/);
  if (!match) return raw;
  const half = match[1] === "TOP" ? "▲" : "▼";
  const inning = Number(match[2]);
  const suffix = inning === 1 ? "ST" : inning === 2 ? "ND" : inning === 3 ? "RD" : "TH";
  return `${half} ${inning}${suffix}`;
}

function LiveMlbDetails({ game }: { game: Game }) {
  const balls = typeof game.balls === "number" ? game.balls : "-";
  const strikes = typeof game.strikes === "number" ? game.strikes : "-";
  const bases = game.bases ?? { first: false, second: false, third: false };
  const outsLabel = typeof game.outs === "number" ? `${game.outs} OUT${game.outs === 1 ? "" : "S"}` : "- OUT";

  return (
    <div className="mt-3 overflow-hidden rounded-md border border-border/60 bg-secondary/20">
      <div className="flex items-center justify-between gap-2 px-2 py-1.5">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-bold uppercase text-foreground">
            {game.currentPitcher ?? "PITCHER TBD"}
          </p>
          <p className="truncate text-[10px] text-muted-foreground">
            {game.currentBatter ?? "BATTER TBD"}
          </p>
        </div>
        <div className="relative h-6 w-6 flex-shrink-0">
          <span
            className={cn(
              "absolute left-2 top-0 h-3 w-3 rotate-45 border",
              bases.second ? "border-amber-400 bg-amber-400" : "border-border bg-transparent"
            )}
          />
          <span
            className={cn(
              "absolute left-3 top-2 h-3 w-3 rotate-45 border",
              bases.first ? "border-amber-400 bg-amber-400" : "border-border bg-transparent"
            )}
          />
          <span
            className={cn(
              "absolute left-1 top-2 h-3 w-3 rotate-45 border",
              bases.third ? "border-amber-400 bg-amber-400" : "border-border bg-transparent"
            )}
          />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border/60 bg-secondary/40 px-2 py-1 text-[10px] font-bold uppercase text-foreground">
        <span>{formatInningTicker(game.quarter)}</span>
        <span>{balls}-{strikes}</span>
        <span>{outsLabel}</span>
      </div>
    </div>
  );
}

export function LiveScoreCard({ game, teamLogos }: LiveScoreCardProps) {
  const isLive = game.status === "LIVE";
  const isFinal = game.status === "FINAL";
  const mlbLiveInningText = game.quarter ? formatInningTicker(game.quarter) : undefined;
  const liveStatusText = game.league === "MLB"
    ? ["LIVE", mlbLiveInningText].filter(Boolean).join(" • ").trim()
    : [game.quarter, game.time].filter(Boolean).join(" ").trim() || "LIVE";
  const badgeLeague = game.league === "NBA" || game.league === "NFL" || game.league === "MLB" ? game.league : null;
  const awayLogo = (badgeLeague === "NBA" || badgeLeague === "MLB")
    ? teamLogos?.[normalizeAbbreviation(game.awayTeam, game.league)]
    : undefined;
  const homeLogo = (badgeLeague === "NBA" || badgeLeague === "MLB")
    ? teamLogos?.[normalizeAbbreviation(game.homeTeam, game.league)]
    : undefined;

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

      {isLive && game.league === "MLB" && <LiveMlbDetails game={game} />}
    </div>
  );
}
