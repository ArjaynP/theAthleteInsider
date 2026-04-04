"use client";

import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BracketTeam {
  id: string;
  name: string;
  abbreviation: string;
}

export interface BracketTie {
  id: string;
  homeTeam: BracketTeam;
  awayTeam: BracketTeam;
  leg1: string | null;
  leg2: string | null;
  homeAgg: number | null;
  awayAgg: number | null;
  status: "upcoming" | "in_progress" | "completed";
  winnerId: string | null;
}

export interface UCLBracketData {
  r16: BracketTie[];
  qf: BracketTie[];
  sf: BracketTie[];
  final: BracketTie | null;
}

// ── Team row ──────────────────────────────────────────────────────────────────

function TeamRow({
  team,
  agg,
  isWinner,
  isTbd,
}: {
  team: BracketTeam;
  agg: number | null;
  isWinner: boolean;
  isTbd: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2 py-1",
        isWinner && "bg-primary/10",
        !isWinner && !isTbd && "opacity-60"
      )}
    >
      <div
        className={cn(
          "flex h-5 w-9 shrink-0 items-center justify-center rounded text-[8px] font-black",
          isTbd
            ? "border border-border/50 bg-muted text-muted-foreground"
            : "bg-secondary text-foreground"
        )}
      >
        {isTbd ? "TBD" : team.abbreviation.slice(0, 3)}
      </div>
      <span
        className={cn(
          "flex-1 truncate text-[11px] font-bold leading-none",
          isTbd
            ? "text-muted-foreground"
            : isWinner
            ? "text-primary"
            : "text-foreground"
        )}
      >
        {isTbd ? "TBD" : team.name}
      </span>
      {!isTbd && (
        <span
          className={cn(
            "shrink-0 w-4 text-right text-[11px] font-black tabular-nums",
            isWinner ? "text-primary" : "text-muted-foreground"
          )}
        >
          {agg ?? "–"}
        </span>
      )}
    </div>
  );
}

// ── Tie card ──────────────────────────────────────────────────────────────────

function TieCard({
  tie,
  isFinal = false,
  className,
}: {
  tie: BracketTie | null;
  isFinal?: boolean;
  className?: string;
}) {
  if (!tie) {
    return (
      <div className={cn("w-full rounded-lg border border-border/40 bg-card/60 p-2 opacity-40", className)}>
        <div className="h-6 rounded bg-muted/30" />
        <div className="mt-0.5 h-6 rounded bg-muted/30" />
      </div>
    );
  }

  const homeTbd = tie.homeTeam.abbreviation === "TBD" || tie.homeTeam.name === "TBD";
  const awayTbd = tie.awayTeam.abbreviation === "TBD" || tie.awayTeam.name === "TBD";
  const isTbd = homeTbd || awayTbd;

  const homeWins = tie.status === "completed" && tie.winnerId === tie.homeTeam.id;
  const awayWins = tie.status === "completed" && tie.winnerId === tie.awayTeam.id;

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-lg border bg-card",
        isTbd ? "border-border/40 opacity-60" : "border-border",
        className
      )}
    >
      {/* Leg scores header */}
      {!isFinal && (tie.leg1 || tie.leg2) && (
        <div className="flex items-center justify-between border-b border-border/40 bg-muted/30 px-2 py-0.5 text-[9px] font-bold text-muted-foreground">
          {tie.leg1 && <span>Leg 1 · {tie.leg1}</span>}
          {tie.leg2 && <span>Leg 2 · {tie.leg2}</span>}
        </div>
      )}
      <div className="flex flex-col divide-y divide-border/40">
        <TeamRow
          team={tie.homeTeam}
          agg={tie.homeAgg}
          isWinner={homeWins}
          isTbd={homeTbd}
        />
        <TeamRow
          team={tie.awayTeam}
          agg={tie.awayAgg}
          isWinner={awayWins}
          isTbd={awayTbd}
        />
      </div>
    </div>
  );
}

// ── Bracket column ─────────────────────────────────────────────────────────────

const COL_WIDTH = 190;
const FINAL_COL_WIDTH = 180;

function BracketColumn({
  label,
  ties,
  isFinal = false,
  alignLabel = "left",
}: {
  label: string;
  ties: (BracketTie | null)[];
  isFinal?: boolean;
  alignLabel?: "left" | "right" | "center";
}) {
  return (
    <div
      className="flex flex-col"
      style={{ width: isFinal ? FINAL_COL_WIDTH : COL_WIDTH }}
    >
      <p
        className={cn(
          "mb-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground",
          alignLabel === "center" && "text-center",
          alignLabel === "right" && "text-right"
        )}
      >
        {label}
      </p>
      <div className="flex flex-1 flex-col justify-around gap-3">
        {ties.map((tie, i) => (
          <TieCard key={tie?.id ?? `tbd-${i}`} tie={tie} isFinal={isFinal} />
        ))}
      </div>
    </div>
  );
}

// ── Connector lines ─────────────────────────────────────────────────────────
// Joins `count` ties on the wide side to `count/2` on the narrow side.

function Connectors({
  count,
  direction,
}: {
  count: number;
  direction: "right" | "left";
}) {
  const pairs = Math.ceil(count / 2);
  return (
    <div className="relative shrink-0" style={{ width: 24 }} aria-hidden>
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        preserveAspectRatio="none"
      >
        {Array.from({ length: pairs }).map((_, i) => {
          const segH = 100 / count;
          const topY = i * 2 * segH + segH / 2;
          const botY = (i * 2 + 1) * segH + segH / 2;
          const midY = (topY + botY) / 2;
          const inX = direction === "right" ? "0%" : "100%";
          const outX = direction === "right" ? "100%" : "0%";
          return (
            <g
              key={i}
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              className="text-border"
            >
              <line x1={inX} y1={`${topY}%`} x2="50%" y2={`${topY}%`} />
              <line x1="50%" y1={`${topY}%`} x2="50%" y2={`${botY}%`} />
              <line x1={inX} y1={`${botY}%`} x2="50%" y2={`${botY}%`} />
              <line x1="50%" y1={`${midY}%`} x2={outX} y2={`${midY}%`} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Trophy ────────────────────────────────────────────────────────────────────

function TrophyIcon() {
  return (
    <svg
      viewBox="0 0 80 100"
      className="h-16 w-12 text-primary/30"
      fill="currentColor"
    >
      <path d="M40 72c-8 0-15-2-15-4v-8c0 2 7 4 15 4s15-2 15-4v8c0 2-7 4-15 4z" />
      <rect x="34" y="68" width="12" height="14" rx="2" />
      <rect x="26" y="82" width="28" height="5" rx="2" />
      <path d="M20 10h40v2c0 18-8 32-20 38C28 44 20 30 20 12v-2z" />
      <path d="M20 14H8c0 14 6 22 14 26" />
      <path d="M60 14h12c0 14-6 22-14 26" />
    </svg>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function UCLKnockoutBracketView({
  data,
  className,
}: {
  data: UCLBracketData;
  className?: string;
}) {
  const r16L = data.r16.slice(0, 4);
  const r16R = data.r16.slice(4, 8);
  const qfL = data.qf.slice(0, 2);
  const qfR = data.qf.slice(2, 4);
  const sfL = data.sf.slice(0, 1);
  const sfR = data.sf.slice(1, 2);

  // Pad arrays to expected lengths with nulls so layout is stable
  const pad = <T,>(arr: T[], len: number): (T | null)[] => [
    ...arr,
    ...Array(Math.max(0, len - arr.length)).fill(null),
  ];

  return (
    <div className={cn("w-full overflow-x-auto rounded-xl border border-border bg-card p-4", className)}>
      <div className="flex min-w-max items-stretch gap-0 pb-2">

        {/* Left half */}
        <BracketColumn label="Round of 16" ties={pad(r16L, 4)} />
        <Connectors count={4} direction="right" />
        <BracketColumn label="Quarter-Finals" ties={pad(qfL, 2)} />
        <Connectors count={2} direction="right" />
        <BracketColumn label="Semi-Finals" ties={pad(sfL, 1)} />
        <Connectors count={1} direction="right" />

        {/* Centre: Final */}
        <div className="flex flex-col items-center" style={{ width: FINAL_COL_WIDTH }}>
          <p className="mb-3 text-center text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            Final · May 30
          </p>
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <TieCard tie={data.final} isFinal />
            <TrophyIcon />
          </div>
        </div>

        {/* Right half */}
        <Connectors count={1} direction="left" />
        <BracketColumn label="Semi-Finals" ties={pad(sfR, 1)} alignLabel="right" />
        <Connectors count={2} direction="left" />
        <BracketColumn label="Quarter-Finals" ties={pad(qfR, 2)} alignLabel="right" />
        <Connectors count={4} direction="left" />
        <BracketColumn label="Round of 16" ties={pad(r16R, 4)} alignLabel="right" />

      </div>
    </div>
  );
}
