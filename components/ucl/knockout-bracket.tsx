"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BracketTeam {
  id: string;
  name: string;
  abbreviation: string;
  logoUrl?: string | null;
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
  koPO: BracketTie[];
  r16: BracketTie[];
  qf: BracketTie[];
  sf: BracketTie[];
  final: BracketTie | null;
}

// ── Team row ──────────────────────────────────────────────────────────────────
function TeamRow({ team, agg, isWinner, isTbd }: {
  team: BracketTeam; agg: number | null; isWinner: boolean; isTbd: boolean;
  logos?: Record<string, string | null>;
}) {
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2",
      isWinner && "bg-primary/10",
      !isWinner && !isTbd && "opacity-60"
    )}>
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded overflow-hidden bg-muted">
        {!isTbd && team.logoUrl ? (
          <Image src={team.logoUrl} alt={team.name} width={28} height={28} className="object-contain" />
        ) : (
          <span className={cn(
            "text-[8px] font-black",
            isTbd ? "text-muted-foreground" : "text-foreground"
          )}>
            {isTbd ? "?" : team.abbreviation.slice(0, 3)}
          </span>
        )}
      </div>
      <span className={cn(
        "flex-1 truncate text-[13px] font-bold leading-none",
        isTbd ? "text-muted-foreground" : isWinner ? "text-primary" : "text-foreground"
      )}>
        {isTbd ? "TBD" : team.name}
      </span>
      {!isTbd && (
        <span className={cn(
          "shrink-0 w-5 text-right text-[13px] font-black tabular-nums",
          isWinner ? "text-primary" : "text-muted-foreground"
        )}>
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
  logos?: Record<string, string | null>;
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
        <div className="flex items-center justify-between border-b border-border/40 bg-muted/30 px-3 py-1 text-[10px] font-bold text-muted-foreground">
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

const COL_WIDTH = 260;
const FINAL_COL_WIDTH = 240;

function BracketColumn({
  label,
  ties,
  isFinal = false,
  alignLabel = "left",
}: {
  label: string;
  ties: (BracketTie | null)[];
  isFinal?: boolean;
  logos?: Record<string, string | null>;
  alignLabel?: "left" | "right" | "center";
}) {
  return (
    <div
      className="flex flex-col"
      style={{ width: isFinal ? FINAL_COL_WIDTH : COL_WIDTH }}
    >
      <p
        className={cn(
          "mb-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground",
          alignLabel === "center" && "text-center",
          alignLabel === "right" && "text-right"
        )}
      >
        {label}
      </p>
      <div className="flex flex-1 flex-col justify-around gap-4">
        {ties.map((tie, i) => (
          <TieCard key={tie?.id ?? `tbd-${i}`} tie={tie} isFinal={isFinal} />
        ))}
      </div>
    </div>
  );
}

// ── Connector lines ─────────────────────────────────────────────────────────
// SplitConnectors: joins `count` ties 2:1 into the next round.
function SplitConnectors({
  count,
  direction,
}: {
  count: number;
  direction: "right" | "left";
}) {
  const pairs = Math.ceil(count / 2);
  return (
    <div className="relative shrink-0" style={{ width: 40 }} aria-hidden>
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
            <g key={i} stroke="currentColor" strokeWidth="1" fill="none" className="text-border">
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

// StraightConnectors: 1:1 pass-through lines (KO Playoffs → R16).
function StraightConnectors({ count }: { count: number }) {
  return (
    <div className="relative shrink-0" style={{ width: 28 }} aria-hidden>
      <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
        {Array.from({ length: count }).map((_, i) => {
          const segH = 100 / count;
          const midY = i * segH + segH / 2;
          return (
            <line key={i} stroke="currentColor" strokeWidth="1" className="text-border"
              x1="0%" y1={`${midY}%`} x2="100%" y2={`${midY}%`} />
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
  logos?: Record<string, string | null>;
  className?: string;
}) {
  const pad = <T,>(arr: T[], len: number): (T | null)[] => [
    ...arr,
    ...Array(Math.max(0, len - arr.length)).fill(null),
  ];

  return (
    <div className={cn("w-full overflow-x-auto rounded-xl border border-border bg-card p-6", className)}>
      <div className="flex min-w-max items-stretch gap-0 pb-2" style={{ minHeight: 900 }}>

        <BracketColumn label="KO Playoffs" ties={pad(data.koPO, 8)} />
        <SplitConnectors count={8} direction="right" />
        <BracketColumn label="Round of 16" ties={pad(data.r16, 8)} />
        <SplitConnectors count={8} direction="right" />
        <BracketColumn label="Quarter-Finals" ties={pad(data.qf, 4)} />
        <SplitConnectors count={4} direction="right" />
        <BracketColumn label="Semi-Finals" ties={pad(data.sf, 2)} />
        <SplitConnectors count={2} direction="right" />

        {/* Final */}
        <div className="flex flex-col" style={{ width: FINAL_COL_WIDTH }}>
          <p className="mb-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
            Final · May 30
          </p>
          <div className="flex flex-1 flex-col justify-center gap-4">
            <TieCard tie={data.final} isFinal />
            <TrophyIcon />
          </div>
        </div>

      </div>
    </div>
  );
}
