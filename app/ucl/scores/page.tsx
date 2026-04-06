"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UCLMatch } from "@/lib/ucl-types";

// ─── UCL rounds ──────────────────────────────────────────────────────────────

const UCL_ROUNDS = [
  "Matchday 1", "Matchday 2", "Matchday 3", "Matchday 4",
  "Matchday 5", "Matchday 6", "Matchday 7", "Matchday 8",
  "KO Playoffs", "Round of 16", "Quarterfinals", "Semi-finals", "Final",
] as const;

type UCLRound = typeof UCL_ROUNDS[number];

// Map start dates so we can default to the current phase on first load
const ROUND_START_DATES: { round: UCLRound; start: Date }[] = [
  { round: "Matchday 1",    start: new Date(2025,  8, 17) },
  { round: "Matchday 2",    start: new Date(2025,  9,  1) },
  { round: "Matchday 3",    start: new Date(2025,  9, 22) },
  { round: "Matchday 4",    start: new Date(2025, 10,  5) },
  { round: "Matchday 5",    start: new Date(2025, 10, 26) },
  { round: "Matchday 6",    start: new Date(2025, 11, 10) },
  { round: "Matchday 7",    start: new Date(2026,  0, 21) },
  { round: "Matchday 8",    start: new Date(2026,  0, 29) },
  { round: "KO Playoffs",   start: new Date(2026,  1, 11) },
  { round: "Round of 16",   start: new Date(2026,  2,  4) },
  { round: "Quarterfinals", start: new Date(2026,  3,  8) },
  { round: "Semi-finals",   start: new Date(2026,  3, 29) },
  { round: "Final",         start: new Date(2026,  4, 30) },
];

function getDefaultRound(): UCLRound {
  const now = new Date();
  let current: UCLRound = "Matchday 1";
  for (const { round, start } of ROUND_START_DATES) {
    if (now >= start) current = round;
  }
  return current;
}

// ─── status badge ────────────────────────────────────────────────────────────

function statusBadge(status: UCLMatch["status"]) {
  if (status === "LIVE") {
    return (
      <span className="flex items-center gap-1 rounded bg-accent px-2 py-0.5 text-[10px] font-black uppercase text-accent-foreground">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-foreground" />
        Live
      </span>
    );
  }
  if (status === "FINAL") {
    return (
      <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-black uppercase text-muted-foreground">
        Final
      </span>
    );
  }
  return (
    <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase text-primary">
      Upcoming
    </span>
  );
}

// ─── match card ──────────────────────────────────────────────────────────────

function MatchCard({ match, logos }: { match: UCLMatch; logos: Record<string, string | null> }) {
  const isUpcoming = match.status === "UPCOMING";
  const isFinal    = match.status === "FINAL";
  const isLive     = match.status === "LIVE";

  const homeName = match.homeTeam;
  const awayName = match.awayTeam;
  const homeLogo = logos[homeName];
  const awayLogo = logos[awayName];

  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md">
      {/* Round label + status badge */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {match.round ?? "UCL"}
        </span>
        {statusBadge(match.status)}
      </div>

      {/* Teams + score */}
      <div className="flex items-center gap-3">
        {/* Home (left) */}
        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-muted">
            {homeLogo ? (
              <Image src={homeLogo} alt={homeName} width={40} height={40} className="object-contain" />
            ) : (
              <span className="text-xs font-black text-primary">{homeName.slice(0, 3).toUpperCase()}</span>
            )}
          </div>
          <span className="max-w-[80px] text-center text-xs font-bold leading-tight text-foreground">{homeName}</span>
        </div>

        {/* Score / time */}
        <div className="flex flex-col items-center gap-1">
          {isUpcoming ? (
            <>
              <span className="text-2xl font-black text-foreground">VS</span>
              {match.kickoffDisplay && (
                <span className="text-xs font-bold text-primary">{match.kickoffDisplay}</span>
              )}
            </>
          ) : (
            <>
              <span className="text-2xl font-black tabular-nums text-foreground">
                {match.homeScore} – {match.awayScore}
              </span>
              {isLive && match.clock && (
                <span className="text-xs font-bold text-accent">{match.clock}</span>
              )}
              {isFinal && (
                <span className="text-[10px] font-bold uppercase text-muted-foreground">FT</span>
              )}
            </>
          )}
        </div>

        {/* Away (right) */}
        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-muted">
            {awayLogo ? (
              <Image src={awayLogo} alt={awayName} width={40} height={40} className="object-contain" />
            ) : (
              <span className="text-xs font-black text-primary">{awayName.slice(0, 3).toUpperCase()}</span>
            )}
          </div>
          <span className="max-w-[80px] text-center text-xs font-bold leading-tight text-foreground">{awayName}</span>
        </div>
      </div>

      {match.venue && (
        <p className="mt-3 text-center text-[10px] text-muted-foreground">{match.venue}</p>
      )}
    </div>
  );
}

// ─── match grid (status sub-sections, used inside leg sections) ─────────────

function MatchGrid({ matches, logos }: { matches: UCLMatch[]; logos: Record<string, string | null> }) {
  const live     = matches.filter((m) => m.status === "LIVE");
  const upcoming = matches.filter((m) => m.status === "UPCOMING");
  const final    = matches.filter((m) => m.status === "FINAL");

  if (matches.length === 0) return null;

  return (
    <div className="flex flex-col gap-5">
      {live.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            <span className="text-sm font-black uppercase tracking-tight text-accent">Live</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {live.map((m) => <MatchCard key={m.id} match={m} logos={logos} />)}
          </div>
        </div>
      )}
      {upcoming.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-4 w-0.5 rounded-full bg-primary" />
            <span className="text-sm font-black uppercase tracking-tight text-primary">Upcoming</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((m) => <MatchCard key={m.id} match={m} logos={logos} />)}
          </div>
        </div>
      )}
      {final.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-4 w-0.5 rounded-full bg-muted-foreground" />
            <span className="text-sm font-black uppercase tracking-tight text-muted-foreground">Final</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {final.map((m) => <MatchCard key={m.id} match={m} logos={logos} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function UCLScoresPage() {
  const [selectedRound, setSelectedRound] = useState<UCLRound>(getDefaultRound);
  const [matches, setMatches]             = useState<UCLMatch[]>([]);
  const [logos, setLogos]                 = useState<Record<string, string | null>>({});
  const [loading, setLoading]             = useState(true);

  const stripRef      = useRef<HTMLDivElement>(null);
  const selectedBtnRef = useRef<HTMLButtonElement>(null);

  // Scroll the selected pill into centre view on first render
  useEffect(() => {
    if (selectedBtnRef.current && stripRef.current) {
      const strip = stripRef.current;
      const btn   = selectedBtnRef.current;
      strip.scrollLeft = btn.offsetLeft - strip.clientWidth / 2 + btn.offsetWidth / 2;
    }
  }, []);

  // Fetch matches when round changes
  const fetchMatches = useCallback(async (round: UCLRound) => {
    setLoading(true);
    setMatches([]);
    try {
      const res = await fetch(`/api/ucl-scores?round=${encodeURIComponent(round)}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      const fetched: UCLMatch[] = data.matches ?? [];
      setMatches(fetched);

      if (fetched.length === 0) return;
      const names = [...new Set(fetched.flatMap((m) => [m.homeTeam, m.awayTeam]))];
      const logoRes = await fetch("/api/ucl-logos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names }),
      });
      if (logoRes.ok) {
        const logoData = await logoRes.json();
        setLogos((prev) => ({ ...prev, ...(logoData.logos ?? {}) }));
      }
    } catch {
      // leave matches empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMatches(selectedRound); }, [selectedRound, fetchMatches]);

  // Auto-refresh every 60 s while live matches exist
  useEffect(() => {
    if (!matches.some((m) => m.status === "LIVE")) return;
    const id = setInterval(() => fetchMatches(selectedRound), 60_000);
    return () => clearInterval(id);
  }, [matches, selectedRound, fetchMatches]);

  const handleRoundSelect = (round: UCLRound) => {
    setSelectedRound(round);
    // Scroll pill into view
    if (stripRef.current) {
      const btn = stripRef.current.querySelector<HTMLButtonElement>(`[data-round="${round}"]`);
      btn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  };

  const isMatchday  = selectedRound.startsWith("Matchday");
  const isKnockout  = !isMatchday;

  const leg1Matches = matches.filter((m) => (m.leg ?? 1) === 1);
  const leg2Matches = matches.filter((m) => m.leg === 2);

  const liveMatches     = matches.filter((m) => m.status === "LIVE");
  const upcomingMatches = matches.filter((m) => m.status === "UPCOMING");
  const finalMatches    = matches.filter((m) => m.status === "FINAL");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">

          {/* Page header */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-primary/10">
              <Image src="/uefa-logo.jpg" alt="UEFA" width={56} height={56} className="h-14 w-14 object-cover" />
            </div>
            <div className="h-10 w-1.5 rounded-full bg-primary" />
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">UCL Scores</h1>
              <p className="text-sm text-muted-foreground">UEFA Champions League 2025–26 results &amp; fixtures</p>
            </div>
          </div>

          {/* Round navigation strip */}
          <div
            ref={stripRef}
            className="mb-8 flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {UCL_ROUNDS.map((round) => {
              const isSel = round === selectedRound;
              // Split matchday pills into two lines for compactness
              const isMatchday = round.startsWith("Matchday");
              return (
                <button
                  key={round}
                  ref={isSel ? selectedBtnRef : undefined}
                  data-round={round}
                  onClick={() => handleRoundSelect(round)}
                  className={cn(
                    "flex shrink-0 flex-col items-center justify-center rounded-lg px-3 py-2 text-center transition-all",
                    isSel
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "border border-transparent bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {isMatchday ? (
                    <>
                      <span className="text-[9px] font-bold uppercase leading-none tracking-wider">MD</span>
                      <span className="text-base font-black leading-none">{round.split(" ")[1]}</span>
                    </>
                  ) : (
                    <span className="whitespace-nowrap text-[11px] font-black uppercase tracking-wide leading-none">{round}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Loading / empty states */}
          {loading && (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {!loading && matches.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
              <p className="text-lg font-bold">No fixtures</p>
              <p className="mt-1 text-sm">No UCL matches found for {selectedRound}</p>
            </div>
          )}

          {/* ── Matchday: Live / Upcoming / Final sections ───────────────────────── */}
          {!loading && isMatchday && matches.length > 0 && (
            <>
              {liveMatches.length > 0 && (
                <section className="mb-8">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
                    </span>
                    <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Live Now</h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {liveMatches.map((m) => <MatchCard key={m.id} match={m} logos={logos} />)}
                  </div>
                </section>
              )}
              {upcomingMatches.length > 0 && (
                <section className="mb-8">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-6 w-1 rounded-full bg-primary" />
                    <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Upcoming</h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {upcomingMatches.map((m) => <MatchCard key={m.id} match={m} logos={logos} />)}
                  </div>
                </section>
              )}
              {finalMatches.length > 0 && (
                <section className="mb-12">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-6 w-1 rounded-full bg-muted-foreground" />
                    <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Final</h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {finalMatches.map((m) => <MatchCard key={m.id} match={m} logos={logos} />)}
                  </div>
                </section>
              )}
            </>
          )}

          {/* ── Knockout rounds: Leg 1 / Leg 2 sections ──────────────────────── */}
          {!loading && isKnockout && matches.length > 0 && (
            <>
              <section className="mb-10">
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-6 w-1 rounded-full bg-primary" />
                  <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Leg 1</h2>
                </div>
                {leg1Matches.length > 0 ? (
                  <MatchGrid matches={leg1Matches} logos={logos} />
                ) : (
                  <p className="text-sm text-muted-foreground">No fixtures confirmed for Leg 1 yet</p>
                )}
              </section>

              {/* Only show Leg 2 for two-legged ties (not Final) */}
              {selectedRound !== "Final" && (
                <section className="mb-12">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="h-6 w-1 rounded-full bg-primary/50" />
                    <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Leg 2</h2>
                  </div>
                  {leg2Matches.length > 0 ? (
                    <MatchGrid matches={leg2Matches} logos={logos} />
                  ) : (
                    <p className="text-sm text-muted-foreground">Fixtures to be confirmed</p>
                  )}
                </section>
              )}
            </>
          )}

        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

