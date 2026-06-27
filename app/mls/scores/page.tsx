"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MLSMatch } from "@/lib/mls-types";

const MLS_TOTAL_MATCHWEEKS = 34;

// ── status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: MLSMatch["status"] }) {
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

// ── match card ────────────────────────────────────────────────────────────────

function MatchCard({ match }: { match: MLSMatch }) {
  const isUpcoming = match.status === "UPCOMING";
  const isFinal    = match.status === "FINAL";
  const isLive     = match.status === "LIVE";

  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md">
      {/* Matchweek label + badge */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          MLS · MW{match.matchweek}
        </span>
        <StatusBadge status={match.status} />
      </div>

      {/* Teams + score */}
      <div className="flex items-center gap-3">
        {/* Home */}
        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <span className="text-xs font-black text-primary">
              {match.homeTeam.slice(0, 3).toUpperCase()}
            </span>
          </div>
          <span className="max-w-[90px] text-center text-xs font-bold leading-tight text-foreground">
            {match.homeTeam}
          </span>
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

        {/* Away */}
        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <span className="text-xs font-black text-primary">
              {match.awayTeam.slice(0, 3).toUpperCase()}
            </span>
          </div>
          <span className="max-w-[90px] text-center text-xs font-bold leading-tight text-foreground">
            {match.awayTeam}
          </span>
        </div>
      </div>

      {match.venue && (
        <p className="mt-3 text-center text-[10px] text-muted-foreground">{match.venue}</p>
      )}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function MLSScoresPage() {
  const [selectedMW, setSelectedMW]   = useState<number | null>(null);
  const [matches, setMatches]         = useState<MLSMatch[]>([]);
  const [loading, setLoading]         = useState(true);

  const stripRef      = useRef<HTMLDivElement>(null);
  const selectedBtnRef = useRef<HTMLButtonElement>(null);

  // Scroll selected pill into view on mount
  useEffect(() => {
    if (selectedBtnRef.current && stripRef.current) {
      const strip = stripRef.current;
      const btn   = selectedBtnRef.current;
      strip.scrollLeft = btn.offsetLeft - strip.clientWidth / 2 + btn.offsetWidth / 2;
    }
  }, []);

  const fetchMatches = useCallback(async (mw: number | null) => {
    setLoading(true);
    setMatches([]);
    try {
      const query = mw ? `?matchweek=${mw}` : "";
      const res = await fetch(`/api/mls-scores${query}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setMatches(data.matches ?? []);

      // First load: lock onto API-selected current matchweek
      if (selectedMW === null && typeof data.matchweek === "number") {
        setSelectedMW(data.matchweek);
      }
    } catch {
      // leave empty
    } finally {
      setLoading(false);
    }
  }, [selectedMW]);

  useEffect(() => {
    if (selectedMW === null) {
      fetchMatches(null);
      return;
    }
    fetchMatches(selectedMW);
  }, [selectedMW, fetchMatches]);

  // Auto-refresh every 60 s while live matches exist
  useEffect(() => {
    if (selectedMW === null || !matches.some((m) => m.status === "LIVE")) return;
    const id = setInterval(() => fetchMatches(selectedMW), 60_000);
    return () => clearInterval(id);
  }, [matches, selectedMW, fetchMatches]);

  const liveMatches     = matches.filter((m) => m.status === "LIVE");
  const upcomingMatches = matches.filter((m) => m.status === "UPCOMING");
  const finalMatches    = matches.filter((m) => m.status === "FINAL");

  const matchweeks = Array.from({ length: MLS_TOTAL_MATCHWEEKS }, (_, i) => i + 1);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">

          {/* Page header */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <span className="text-base font-black text-primary">MLS</span>
            </div>
            <div className="h-10 w-1.5 rounded-full bg-primary" />
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
                MLS Scores
              </h1>
              <p className="text-sm text-muted-foreground">
                Major League Soccer 2026 · Results &amp; Fixtures
              </p>
            </div>
          </div>

          {/* Matchweek selector strip */}
          <div
            ref={stripRef}
            className="mb-8 flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {matchweeks.map((mw) => {
              const isSel = mw === selectedMW;
              return (
                <button
                  key={mw}
                  ref={isSel ? selectedBtnRef : undefined}
                  onClick={() => setSelectedMW(mw)}
                  className={cn(
                    "flex shrink-0 flex-col items-center justify-center rounded-lg px-3 py-2 transition-all",
                    isSel
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "border border-transparent bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="text-[9px] font-bold uppercase leading-none tracking-wider">MW</span>
                  <span className="text-base font-black leading-none">{mw}</span>
                </button>
              );
            })}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Empty */}
          {!loading && matches.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
              <p className="text-lg font-bold">No fixtures</p>
              <p className="mt-1 text-sm">No MLS matches found{selectedMW ? ` for Matchweek ${selectedMW}` : ""}</p>
            </div>
          )}

          {/* Live */}
          {!loading && liveMatches.length > 0 && (
            <section className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
                </span>
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Live Now</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {liveMatches.map((m) => <MatchCard key={m.id} match={m} />)}
              </div>
            </section>
          )}

          {/* Upcoming */}
          {!loading && upcomingMatches.length > 0 && (
            <section className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-6 w-1 rounded-full bg-primary" />
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Upcoming</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingMatches.map((m) => <MatchCard key={m.id} match={m} />)}
              </div>
            </section>
          )}

          {/* Final */}
          {!loading && finalMatches.length > 0 && (
            <section className="mb-12">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-6 w-1 rounded-full bg-muted-foreground" />
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Final</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {finalMatches.map((m) => <MatchCard key={m.id} match={m} />)}
              </div>
            </section>
          )}

        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
