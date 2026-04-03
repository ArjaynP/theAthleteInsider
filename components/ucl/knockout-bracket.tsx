"use client";

import { cn } from "@/lib/utils";
import type { UCLKnockoutBracket, UCLKnockoutTie, UCLKnockoutTeam } from "@/lib/ucl-types";

// ── Tie card ─────────────────────────────────────────────────────────────────

function TeamRow({
  team,
  score,
  isWinner,
  isFinal,
}: {
  team: UCLKnockoutTeam;
  score?: number;
  isWinner?: boolean;
  isFinal?: boolean;
}) {
  const tbd = team.abbreviation === "TBD";
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded px-2 py-1.5",
        isWinner && !tbd && "bg-primary/10",
        team.isEliminated && "opacity-40"
      )}
    >
      {/* Badge / logo placeholder */}
      <div
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded text-[9px] font-black",
          tbd
            ? "border border-border bg-muted text-muted-foreground"
            : "bg-primary/20 text-primary"
        )}
      >
        {tbd ? "?" : team.abbreviation.slice(0, 3)}
      </div>

      {/* Name */}
      <span
        className={cn(
          "flex-1 truncate text-xs font-bold leading-none",
          tbd ? "text-muted-foreground" : "text-foreground",
          isWinner && !tbd && "text-primary"
        )}
      >
        {tbd ? "TBD" : team.name}
      </span>

      {/* Score */}
      {!tbd && (
        <span
          className={cn(
            "shrink-0 min-w-[1.25rem] text-center text-xs font-black tabular-nums",
            isWinner ? "text-primary" : "text-muted-foreground"
          )}
        >
          {score !== undefined ? score : isFinal ? "-" : "–"}
        </span>
      )}
    </div>
  );
}

function TieCard({ tie, isFinal = false }: { tie: UCLKnockoutTie; isFinal?: boolean }) {
  const tbd = tie.homeTeam.abbreviation === "TBD" && tie.awayTeam.abbreviation === "TBD";

  const homeWinner =
    !tbd &&
    tie.status === "completed" &&
    tie.winnerId === tie.homeTeam.abbreviation;
  const awayWinner =
    !tbd &&
    tie.status === "completed" &&
    tie.winnerId === tie.awayTeam.abbreviation;

  const homeScore = isFinal ? tie.homeScore : tie.homeAgg;
  const awayScore = isFinal ? tie.awayScore : tie.awayAgg;

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-lg border border-border bg-card",
        tbd && "opacity-60"
      )}
    >
      {/* Leg scores strip (two-legged only) */}
      {!isFinal && (tie.leg1 || tie.leg2) && (
        <div className="flex items-center justify-between border-b border-border/50 bg-muted/40 px-2 py-0.5 text-[9px] font-bold text-muted-foreground">
          {tie.leg1 && <span>Leg 1 · {tie.leg1}</span>}
          {tie.leg2 && <span>Leg 2 · {tie.leg2}</span>}
        </div>
      )}

      <div className="flex flex-col p-1 gap-0.5">
        <TeamRow
          team={tie.homeTeam}
          score={homeScore}
          isWinner={homeWinner}
          isFinal={isFinal}
        />
        <TeamRow
          team={tie.awayTeam}
          score={awayScore}
          isWinner={awayWinner}
          isFinal={isFinal}
        />
      </div>

      {/* Aet / pens note */}
      {tie.note && (
        <div className="border-t border-border/50 bg-muted/30 px-2 py-0.5 text-center text-[9px] font-bold text-muted-foreground">
          {tie.note}
        </div>
      )}
    </div>
  );
}

// ── Round column ─────────────────────────────────────────────────────────────

function RoundColumn({
  label,
  ties,
  isFinal = false,
}: {
  label: string;
  ties: UCLKnockoutTie[];
  isFinal?: boolean;
}) {
  return (
    <div className="flex min-w-0 shrink-0 flex-col gap-2" style={{ width: "clamp(140px, 13vw, 185px)" }}>
      <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div
        className={cn(
          "flex flex-col",
          isFinal ? "justify-center flex-1" : "justify-around flex-1 gap-2"
        )}
      >
        {ties.map((tie) => (
          <TieCard key={tie.id} tie={tie} isFinal={isFinal} />
        ))}
      </div>
    </div>
  );
}

// ── Main bracket ─────────────────────────────────────────────────────────────

export function UCLKnockoutBracketView({
  data,
  className,
}: {
  data: UCLKnockoutBracket;
  className?: string;
}) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <div className="flex min-w-max gap-4 pb-4">
        {/* Round of 16 — split left (4) and right (4) around centre */}
        <RoundColumn
          label="Round of 16"
          ties={data.roundOf16.slice(0, 4)}
        />

        <RoundColumn
          label="Quarter-Finals"
          ties={data.quarterFinals.slice(0, 2)}
        />

        <RoundColumn
          label="Semi-Finals"
          ties={data.semiFinals.slice(0, 1)}
        />

        {/* Final */}
        <RoundColumn
          label="Final"
          ties={[data.final]}
          isFinal
        />

        <RoundColumn
          label="Semi-Finals"
          ties={data.semiFinals.slice(1)}
        />

        <RoundColumn
          label="Quarter-Finals"
          ties={data.quarterFinals.slice(2)}
        />

        <RoundColumn
          label="Round of 16"
          ties={data.roundOf16.slice(4)}
        />
      </div>

      {/* Season label */}
      <p className="mt-2 text-center text-xs text-muted-foreground">
        UEFA Champions League {data.season} Knockout Phase
      </p>
    </div>
  );
}
