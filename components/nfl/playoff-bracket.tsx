"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";
import type {
  NFLConferenceBracket,
  NFLPlayoffTeam,
  NFLPostseasonBracket,
} from "@/lib/nfl-playoff-data";

interface NFLPlayoffBracketProps {
  data: NFLPostseasonBracket;
  className?: string;
}

const BRACKET_SLOT_H = 84;

function TeamChip({ team }: { team: NFLPlayoffTeam }) {
  return (
    <div
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[9px] font-black text-white",
        !team.primaryColor && "bg-secondary text-foreground"
      )}
      style={team.primaryColor ? { backgroundColor: team.primaryColor } : undefined}
    >
      {team.abbreviation.slice(0, 2)}
    </div>
  );
}

function ByeCard({ team }: { team: NFLPlayoffTeam }) {
  return (
    <div className="w-full min-w-0 rounded-xl border border-border bg-card p-2">
      <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        Bye
      </p>
      <div className="flex items-center gap-2 rounded-lg bg-secondary/30 px-2 py-1.5">
        <TeamChip team={team} />
        <p className="whitespace-nowrap text-xs font-bold text-foreground">
          <span className="mr-1 text-muted-foreground">#{team.seed}</span>
          {team.name}
        </p>
      </div>
    </div>
  );
}

function NFLMatchupCard({
  label,
  topTeam,
  bottomTeam,
  topScore,
  bottomScore,
  winnerId,
  size = "md",
}: {
  label?: string;
  topTeam: NFLPlayoffTeam;
  bottomTeam: NFLPlayoffTeam;
  topScore: number;
  bottomScore: number;
  winnerId: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const rowTextSize = size === "sm" ? "text-[11px]" : size === "md" ? "text-xs" : "text-sm";
  const scoreSize = size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg";

  const Row = ({ team, score }: { team: NFLPlayoffTeam; score: number }) => {
    const isWinner = winnerId === team.id;
    const isLoser = !!winnerId && !isWinner;

    return (
      <div
        className={cn(
          "flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 transition-colors",
          isWinner && "bg-primary/15 ring-1 ring-primary/40",
          isLoser && "opacity-60"
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <TeamChip team={team} />
          <span className={cn("whitespace-nowrap font-bold text-foreground", rowTextSize)}>
            {team.name}
          </span>
          <span className="shrink-0 text-[10px] font-bold text-muted-foreground">#{team.seed}</span>
        </div>
        <span className={cn("shrink-0 tabular-nums font-black", scoreSize, isWinner ? "text-foreground" : "text-muted-foreground")}>
          {score}
        </span>
      </div>
    );
  };

  return (
    <div className="min-w-0">
      {label && (
        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
      )}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="space-y-1 p-1.5">
          <Row team={topTeam} score={topScore} />
          <Row team={bottomTeam} score={bottomScore} />
        </div>
      </div>
    </div>
  );
}

function ConferenceStrip({ label, isAfc }: { label: string; isAfc: boolean }) {
  return (
    <div
      className={cn(
        "flex min-h-[160px] w-6 shrink-0 items-center justify-center rounded py-2 sm:w-8",
        isAfc ? "bg-red-600/90 text-white" : "bg-blue-600/90 text-white"
      )}
    >
      <span className="-rotate-90 whitespace-nowrap text-[9px] font-black uppercase tracking-widest sm:text-[10px]">
        {label}
      </span>
    </div>
  );
}

function ConferenceBracketColumn({
  conference,
  side,
}: {
  conference: NFLConferenceBracket;
  side: "left" | "right";
}) {
  const isRight = side === "right";
  const colClass = "flex min-w-0 shrink-0 flex-col w-28 sm:w-32 md:w-36 lg:w-40 xl:w-44 max-w-[220px] overflow-hidden";

  const wildCardCol = (
    <div className={cn(colClass, "gap-2")} data-column="wildcard">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        Wild Card
      </p>
      <div className="flex flex-col gap-2" style={{ minHeight: 4 * BRACKET_SLOT_H }}>
        <div className="bracket-slot flex items-center" style={{ minHeight: BRACKET_SLOT_H }}>
          <ByeCard team={conference.byeTeam} />
        </div>
        {conference.wildCard.map((game) => (
          <div key={game.id} className="bracket-slot flex items-center" style={{ minHeight: BRACKET_SLOT_H }}>
            <NFLMatchupCard
              label={game.label}
              topTeam={game.topTeam}
              bottomTeam={game.bottomTeam}
              topScore={game.topScore}
              bottomScore={game.bottomScore}
              winnerId={game.winnerId}
              size="sm"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const divisionalCol = (
    <div className={cn(colClass, "gap-2")} data-column="divisional">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        Divisional
      </p>
      <div
        className="grid w-full grid-cols-1"
        style={{ minHeight: 4 * BRACKET_SLOT_H, gridTemplateRows: `repeat(4, ${BRACKET_SLOT_H}px)` }}
      >
        <div className="col-span-1 flex items-center justify-center" style={{ gridRow: "1 / 3" }}>
          <div className="w-full min-w-0 max-w-[190px]">
            <NFLMatchupCard
              label={conference.divisional[0].label}
              topTeam={conference.divisional[0].topTeam}
              bottomTeam={conference.divisional[0].bottomTeam}
              topScore={conference.divisional[0].topScore}
              bottomScore={conference.divisional[0].bottomScore}
              winnerId={conference.divisional[0].winnerId}
              size="md"
            />
          </div>
        </div>
        <div className="col-span-1 flex items-center justify-center" style={{ gridRow: "3 / 5" }}>
          <div className="w-full min-w-0 max-w-[190px]">
            <NFLMatchupCard
              label={conference.divisional[1].label}
              topTeam={conference.divisional[1].topTeam}
              bottomTeam={conference.divisional[1].bottomTeam}
              topScore={conference.divisional[1].topScore}
              bottomScore={conference.divisional[1].bottomScore}
              winnerId={conference.divisional[1].winnerId}
              size="md"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const conferenceCol = (
    <div className={cn(colClass, "gap-2")} data-column="conference">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        Conference Finals
      </p>
      <div className="flex w-full items-center justify-center" style={{ minHeight: 4 * BRACKET_SLOT_H }}>
        <div className="w-full min-w-0 max-w-[190px]">
          <NFLMatchupCard
            label={conference.conferenceChampionship.label}
            topTeam={conference.conferenceChampionship.topTeam}
            bottomTeam={conference.conferenceChampionship.bottomTeam}
            topScore={conference.conferenceChampionship.topScore}
            bottomScore={conference.conferenceChampionship.bottomScore}
            winnerId={conference.conferenceChampionship.winnerId}
            size="md"
          />
        </div>
      </div>
    </div>
  );

  const columns = isRight
    ? [conferenceCol, divisionalCol, wildCardCol]
    : [wildCardCol, divisionalCol, conferenceCol];

  return <div className="flex items-start gap-3 sm:gap-4 md:gap-5">{columns}</div>;
}

function SuperBowlSection({ data }: { data: NFLPostseasonBracket }) {
  const champion =
    data.superBowl.winnerId === data.superBowl.topTeam.id
      ? data.superBowl.topTeam
      : data.superBowl.bottomTeam;

  return (
    <div
      className="flex shrink-0 flex-col items-center justify-center gap-3 px-2 py-4 sm:px-4 sm:py-6"
      style={{ minHeight: 4 * BRACKET_SLOT_H }}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2 py-1 sm:px-4 sm:py-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 sm:text-xs">
            Super Bowl LX
          </span>
        </div>
        <div className="mx-auto w-full max-w-[140px] sm:max-w-[180px] xl:max-w-[220px]">
          <NFLMatchupCard
            label={data.superBowl.label}
            topTeam={data.superBowl.topTeam}
            bottomTeam={data.superBowl.bottomTeam}
            topScore={data.superBowl.topScore}
            bottomScore={data.superBowl.bottomScore}
            winnerId={data.superBowl.winnerId}
            size="lg"
          />
        </div>
        <img
          src="/lombardi.png"
          alt="Lombardi Trophy"
          className="mt-2 h-auto w-24 object-contain sm:w-28"
        />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          {champion.name} • {data.championLabel}
        </p>
      </div>
    </div>
  );
}

export function NFLPlayoffBracket({ data, className }: NFLPlayoffBracketProps) {
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
          {data.seasonLabel}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Wild Card → Divisional → Conference Finals → Super Bowl
        </p>
      </div>

      <div ref={scrollRef} className="overflow-x-auto overflow-y-hidden rounded-xl scroll-smooth">
        <div className="mx-auto flex w-fit min-w-max flex-col items-stretch gap-4 lg:flex-row lg:items-start lg:justify-center lg:gap-3">
          <div className="flex min-w-max flex-shrink-0 items-start justify-start lg:justify-end">
            <ConferenceStrip label="AFC" isAfc />
            <div className="flex items-start gap-1 pl-1 sm:gap-2 sm:pl-2">
              <ConferenceBracketColumn conference={data.afc} side="left" />
            </div>
          </div>

          <SuperBowlSection data={data} />

          <div className="flex min-w-max flex-shrink-0 items-start justify-start lg:justify-start">
            <div className="flex items-start gap-1 pr-1 sm:gap-2 sm:pr-2">
              <ConferenceBracketColumn conference={data.nfc} side="right" />
            </div>
            <ConferenceStrip label="NFC" isAfc={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
