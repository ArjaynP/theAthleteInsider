"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CalendarDays, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MLSMatch } from "@/lib/mls-types";

function toDateString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getEasternDateString(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function dateFromString(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const SEASON_START = new Date(2026, 1, 21); // Feb 21 2026
const SEASON_END = new Date(2026, 11, 18); // Dec 18 2026

function buildDateRange(): Date[] {
  const days: Date[] = [];
  const cursor = new Date(SEASON_START);
  while (cursor <= SEASON_END) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

const DAY_ABBR = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MON_ABBR = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

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
  const today = getEasternDateString();
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [matches, setMatches] = useState<MLSMatch[]>([]);
  const [loading, setLoading] = useState(true);

  const dateRange = useRef<Date[]>(buildDateRange()).current;
  const stripRef = useRef<HTMLDivElement>(null);
  const todayBtnRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<HTMLInputElement>(null);

  // Scroll selected pill into view on mount
  useEffect(() => {
    if (todayBtnRef.current && stripRef.current) {
      const strip = stripRef.current;
      const btn = todayBtnRef.current;
      strip.scrollLeft = btn.offsetLeft - strip.clientWidth / 2 + btn.offsetWidth / 2;
    }
  }, []);

  const fetchMatches = useCallback(async (date: string) => {
    setLoading(true);
    setMatches([]);
    try {
      const res = await fetch(`/api/mls-scores?date=${date}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setMatches(data.matches ?? []);
    } catch {
      // leave empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches(selectedDate);
  }, [selectedDate, fetchMatches]);

  // Auto-refresh every 60 s while live matches exist
  useEffect(() => {
    if (!matches.some((m) => m.status === "LIVE")) return;
    const id = setInterval(() => fetchMatches(selectedDate), 60_000);
    return () => clearInterval(id);
  }, [matches, selectedDate, fetchMatches]);

  const handleDateSelect = (ds: string) => {
    setSelectedDate(ds);
    const idx = dateRange.findIndex((d) => toDateString(d) === ds);
    if (idx >= 0 && stripRef.current) {
      const btns = stripRef.current.querySelectorAll<HTMLButtonElement>("button[data-date]");
      const btn = btns[idx];
      if (btn) {
        btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  };

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

          {/* Date selector strip */}
          <div className="mb-8 flex items-center gap-2">
            <div
              ref={stripRef}
              className="flex flex-1 gap-1.5 overflow-x-auto py-2 scrollbar-hide"
              style={{ scrollbarWidth: "none" }}
            >
              {dateRange.map((d) => {
                const ds = toDateString(d);
                const isToday = ds === today;
                const isSel = ds === selectedDate;
                const isFirst = d.getDate() === 1;

                return (
                  <button
                    key={ds}
                    ref={isToday ? todayBtnRef : undefined}
                    data-date={ds}
                    onClick={() => handleDateSelect(ds)}
                    className={cn(
                      "relative flex flex-shrink-0 flex-col items-center rounded-lg px-2.5 py-2 text-center transition-all",
                      isSel
                        ? "bg-primary text-primary-foreground shadow-md"
                        : isToday
                          ? "border border-primary/60 bg-primary/10 text-primary"
                          : "border border-transparent bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {isFirst && (
                      <span className="absolute -top-4 left-0 right-0 text-center text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                        {MON_ABBR[d.getMonth()]}
                      </span>
                    )}
                    <span className="text-[9px] font-bold uppercase leading-none">
                      {DAY_ABBR[d.getDay()]}
                    </span>
                    <span className="mt-0.5 text-base font-black leading-none">{d.getDate()}</span>
                    {isToday && !isSel && (
                      <span className="mt-0.5 h-1 w-1 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="relative flex-shrink-0">
              <button
                onClick={() => calendarRef.current?.showPicker()}
                title="Jump to date"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
              >
                <CalendarDays className="h-5 w-5" />
              </button>
              <input
                ref={calendarRef}
                type="date"
                className="absolute inset-0 cursor-pointer opacity-0"
                min={toDateString(SEASON_START)}
                max={toDateString(SEASON_END)}
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) handleDateSelect(e.target.value);
                }}
              />
            </div>
          </div>

          {/* Selected date label */}
          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-lg font-black uppercase tracking-tight text-foreground">
              {selectedDate === today
                ? "Today"
                : dateFromString(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
            </h2>
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
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
              <p className="mt-1 text-sm">No MLS matches found for this date</p>
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
