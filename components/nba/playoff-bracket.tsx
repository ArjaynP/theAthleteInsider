"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { MatchupCard } from "@/components/nba/matchup-card";
import type {
  NBAPlayoffBracket,
  ConferenceBracket,
  PlayInGame,
  PlayoffMatchup,
} from "@/lib/nba-playoff-data";
import { Trophy } from "lucide-react";

interface PlayoffBracketProps {
  data: NBAPlayoffBracket;
  className?: string;
}

/** Row height for vertical alignment: Semis centered between FR pairs, Conf Finals centered. */
const BRACKET_SLOT_H = 80;

function PlayInSection({
  playIn,
  isEast,
}: {
  playIn: PlayInGame[];
  isEast?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        Play-In
      </p>
      <div className="flex flex-col gap-3">
        {playIn.map((game) => (
          <div key={game.id} className="bracket-slot flex flex-col gap-1">
            {(game.advancesToSeed === 7 || game.advancesToSeed8) && (
              <span className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground">
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-foreground/80 text-[8px] font-black text-background">
                  W
                </span>
                {game.advancesToSeed === 7 ? "→ 7 seed" : "→ 8 seed"}
              </span>
            )}
            <MatchupCard
              label={game.label}
              topTeam={game.topTeam}
              bottomTeam={game.bottomTeam}
              topScore={game.topScore}
              bottomScore={game.bottomScore}
              winnerId={game.winnerId}
              size="sm"
            />
            {game.loserEliminated && (
              <span className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground">
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-muted-foreground/60 text-[8px] font-black text-muted-foreground">
                  L
                </span>
                Eliminated
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** West/East conference bracket columns with 4-2-1 structure: First Round -> Semis -> Conference Finals. */
function ConferenceBracketColumn({
  bracket,
  side,
}: {
  bracket: ConferenceBracket;
  side: "left" | "right";
}) {
  const isEast = side === "right";
  const roundLabel = (r: string) =>
    r === "first"
      ? "First Round"
      : r === "semifinals"
        ? "Conference Semis"
        : "Conference Finals";

  const colClass = "flex min-w-0 shrink-0 flex-col w-24 sm:w-28 md:w-32 lg:w-36 xl:w-40 max-w-[180px] overflow-hidden";

  const playInCol = (
    <div className={cn(colClass)} data-column="playin">
      <PlayInSection playIn={bracket.playIn} isEast={isEast} />
    </div>
  );

  const firstRoundCol = (
    <div className={cn(colClass, "gap-2")} data-column="first">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        {roundLabel("first")}
      </p>
      <div className="flex flex-col gap-2" style={{ minHeight: 4 * BRACKET_SLOT_H }}>
        {bracket.firstRound.map((m) => (
          <div key={m.id} className="bracket-slot flex min-h-[72px] items-center" style={{ minHeight: BRACKET_SLOT_H }}>
            <MatchupCard
              topTeam={m.topTeam}
              bottomTeam={m.bottomTeam}
              topScore={m.topScore}
              bottomScore={m.bottomScore}
              winnerId={m.winnerId}
              size="sm"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const semisCol = (
    <div className={cn(colClass, "gap-2")} data-column="semis">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        {roundLabel("semifinals")}
      </p>
      <div
        className="grid w-full grid-cols-1"
        style={{ minHeight: 4 * BRACKET_SLOT_H, gridTemplateRows: `repeat(4, ${BRACKET_SLOT_H}px)` }}
      >
        <div className="col-span-1 flex items-center justify-center" style={{ gridRow: "1 / 3" }}>
          <div className="w-full min-w-0 max-w-[160px]">
            <MatchupCard
              topTeam={bracket.semifinals[0].topTeam}
              bottomTeam={bracket.semifinals[0].bottomTeam}
              topScore={bracket.semifinals[0].topScore}
              bottomScore={bracket.semifinals[0].bottomScore}
              winnerId={bracket.semifinals[0].winnerId}
              size="md"
            />
          </div>
        </div>
        <div className="col-span-1 flex items-center justify-center" style={{ gridRow: "3 / 5" }}>
          <div className="w-full min-w-0 max-w-[160px]">
            <MatchupCard
              topTeam={bracket.semifinals[1].topTeam}
              bottomTeam={bracket.semifinals[1].bottomTeam}
              topScore={bracket.semifinals[1].topScore}
              bottomScore={bracket.semifinals[1].bottomScore}
              winnerId={bracket.semifinals[1].winnerId}
              size="md"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const confFinalsCol = bracket.conferenceFinals ? (
    <div className={cn(colClass, "gap-2")} data-column="conffinals">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        {roundLabel("conference_finals")}
      </p>
      <div
        className="flex w-full items-center justify-center"
        style={{ minHeight: 4 * BRACKET_SLOT_H }}
      >
        <div className="w-full min-w-0 max-w-[160px]">
          <MatchupCard
            topTeam={bracket.conferenceFinals.topTeam}
            bottomTeam={bracket.conferenceFinals.bottomTeam}
            topScore={bracket.conferenceFinals.topScore}
            bottomScore={bracket.conferenceFinals.bottomScore}
            winnerId={bracket.conferenceFinals.winnerId}
            size="md"
          />
        </div>
      </div>
    </div>
  ) : null;

  const columns = isEast
    ? [confFinalsCol, semisCol, firstRoundCol, playInCol]
    : [playInCol, firstRoundCol, semisCol, confFinalsCol];

  return (
    <div className="flex items-start gap-3 sm:gap-4 md:gap-5">
      {columns.map((col, i) => (
        <div key={i} className="flex items-start">
          {col}
        </div>
      ))}
    </div>
  );
}

/** Vertical strip label (WEST / EAST) like CBS. */
function ConferenceStrip({ label, isWest }: { label: string; isWest: boolean }) {
  return (
    <div
      className={cn(
        "flex min-h-[160px] w-6 shrink-0 items-center justify-center rounded py-2 sm:w-8",
        isWest ? "bg-red-600/90 text-white" : "bg-blue-600/90 text-white"
      )}
    >
      <span className="-rotate-90 whitespace-nowrap text-[9px] font-black uppercase tracking-widest sm:text-[10px]">
        {label}
      </span>
    </div>
  );
}

function FinalsSection({ matchup }: { matchup: PlayoffMatchup | null }) {
  if (!matchup) return null;

  return (
    <div
      className="flex shrink-0 flex-col items-center justify-center gap-2 px-2 py-4 sm:px-4 sm:py-6"
      style={{ minHeight: 4 * BRACKET_SLOT_H }}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2 py-1 sm:px-4 sm:py-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 sm:text-xs">
            2026 NBA Finals
          </span>
        </div>
        <div className="mx-auto w-full max-w-[140px] sm:max-w-[180px] xl:max-w-[220px]">
          <MatchupCard
            topTeam={matchup.topTeam}
            bottomTeam={matchup.bottomTeam}
            topScore={matchup.topScore}
            bottomScore={matchup.bottomScore}
            winnerId={matchup.winnerId}
            size="lg"
          />
        </div>
        <img
          src="/nbachamp.png"
          alt="NBA Champions"
          className="mt-2 h-auto w-24 object-contain sm:w-28"
        />
      </div>
    </div>
  );
}

export function PlayoffBracket({ data, className }: PlayoffBracketProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = 0;
  }, []);

  return (
    <div
      className={cn(
        "w-full max-w-full overflow-hidden rounded-2xl border border-border bg-background/80 p-4 sm:p-5 md:p-6",
        className
      )}
    >
      <div className="mb-6 text-center">
        <h2 className="text-xl font-black uppercase tracking-tight text-foreground sm:text-2xl">
          2025-2026 NBA POSTSEASON
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Play-In → First Round → Conference Semis → Conference Finals → NBA Finals
        </p>
      </div>

      {/* Horizontal bracket: West | Finals | East — scroll to start so West Play-In is visible */}
      <div ref={scrollRef} className="overflow-x-auto overflow-y-hidden rounded-xl scroll-smooth" id="playoff-bracket-scroll">
        <div className="flex min-w-max flex-col items-stretch gap-4 pl-2 lg:flex-row lg:items-start lg:justify-start lg:gap-3 lg:pl-3">
          {/* WEST: strip + bracket columns (left edge; ensure Play-In visible) */}
          <div className="flex min-w-max flex-shrink-0 items-start justify-start lg:justify-end">
            <ConferenceStrip label="WEST" isWest />
            <div className="flex items-start gap-1 pl-1 sm:gap-2 sm:pl-2">
              <ConferenceBracketColumn bracket={data.west} side="left" />
            </div>
          </div>

          <FinalsSection matchup={data.nbaFinals} />

          {/* EAST: bracket columns + strip */}
          <div className="flex min-w-max flex-shrink-0 items-start justify-start lg:justify-start">
            <div className="flex items-start gap-1 pr-1 sm:gap-2 sm:pr-2">
              <ConferenceBracketColumn bracket={data.east} side="right" />
            </div>
            <ConferenceStrip label="EAST" isWest={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
