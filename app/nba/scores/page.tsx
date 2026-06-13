"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LiveScoreCard } from "@/components/live-score-card";
import { CalendarDays, Loader2 } from "lucide-react";
import type { Game } from "@/lib/mock-data";

// ─── helpers ───────────────────────────────────────────────────────────────

function toDateString(d: Date): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
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

// NBA 2025-26 season bounds (regular season + playoffs/Finals)
const SEASON_START = new Date(2025, 9, 22); // Oct 22 2025
const SEASON_END   = new Date(2026, 5, 30);  // Jun 30 2026

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
const MON_ABBR = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

type ApiTeam = {
  abbreviation?: string;
  logo?: string;
  logoLight?: string;
  logoDark?: string;
};

function normalizeAbbreviation(value: string) {
  const normalized = value.toUpperCase();
  const aliasMap: Record<string, string> = {
    GS: "GSW", NY: "NYK", NO: "NOP", SA: "SAS", UTAH: "UTA", WSH: "WAS",
  };
  return aliasMap[normalized] ?? normalized;
}

// ─── component ─────────────────────────────────────────────────────────────

export default function NBAScoresPage() {
  const today = getEasternDateString();
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamLogos, setTeamLogos] = useState<Record<string, string>>({});

  const dateRange = useRef<Date[]>(buildDateRange()).current;
  const stripRef  = useRef<HTMLDivElement>(null);
  const todayBtnRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<HTMLInputElement>(null);

  // ── scroll the strip so today is centred on first render ──
  useEffect(() => {
    if (todayBtnRef.current && stripRef.current) {
      const strip = stripRef.current;
      const btn   = todayBtnRef.current;
      strip.scrollLeft = btn.offsetLeft - strip.clientWidth / 2 + btn.offsetWidth / 2;
    }
  }, []);

  // ── load team logos once ──
  useEffect(() => {
    fetch("/api/teams", { cache: "no-store" })
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data?.teams)) return;
        const logos = (data.teams as ApiTeam[]).reduce<Record<string, string>>((acc, t) => {
          if (!t.abbreviation) return acc;
          const abbr = normalizeAbbreviation(t.abbreviation);
          const logo = t.logoLight || t.logo || t.logoDark;
          if (logo) acc[abbr] = logo;
          return acc;
        }, {});
        setTeamLogos(logos);
      })
      .catch(() => {});
  }, []);

  // ── fetch scores when date changes ──
  const fetchGames = useCallback(async (date: string) => {
    setLoading(true);
    setGames([]);
    try {
      const res  = await fetch(`/api/nba-scores?date=${date}`, { cache: "no-store" });
      const data = await res.json();
      if (!Array.isArray(data?.games)) return;

      // Map API shape → Game interface used by LiveScoreCard
      const mapped: Game[] = (data.games as {
        id: string; homeTeam: string; awayTeam: string;
        homeScore: number; awayScore: number;
        status: "LIVE" | "FINAL" | "UPCOMING";
        quarter?: string; time?: string; startTime?: string;
        homeRecord: string; awayRecord: string;
      }[]).map(g => ({ ...g, league: "NBA" as const }));

      setGames(mapped);
    } catch {
      // leave games empty – UI shows "no games"
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGames(selectedDate); }, [selectedDate, fetchGames]);

  // ── auto-refresh every 60 s while live games exist ──
  useEffect(() => {
    const live = games.some(g => g.status === "LIVE");
    if (!live) return;
    const id = setInterval(() => fetchGames(selectedDate), 60_000);
    return () => clearInterval(id);
  }, [games, selectedDate, fetchGames]);

  const handleDateSelect = (ds: string) => {
    setSelectedDate(ds);
    // scroll new selection into view
    const idx = dateRange.findIndex(d => toDateString(d) === ds);
    if (idx >= 0 && stripRef.current) {
      const btns = stripRef.current.querySelectorAll<HTMLButtonElement>("button[data-date]");
      const btn  = btns[idx];
      if (btn) {
        btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  };

  const liveGames     = games.filter(g => g.status === "LIVE");
  const finalGames    = games.filter(g => g.status === "FINAL");
  const upcomingGames = games.filter(g => g.status === "UPCOMING");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">

          {/* ── Page header ── */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center text-sm font-black text-primary-foreground shadow-md">
              <img src="/nba-logo-1.png" alt="NBA Logo" />
            </div>
            <div className="h-10 w-1.5 rounded-full bg-primary" />
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
                NBA Scores
              </h1>
              <p className="text-sm text-muted-foreground">
                Live scores and results for all NBA games
              </p>
            </div>
          </div>

          {/* ── Date strip ── */}
          <div className="mb-8 flex items-center gap-2">
            {/* Scrollable strip */}
            <div
              ref={stripRef}
              className="flex flex-1 gap-1.5 overflow-x-auto py-2 scrollbar-hide"
              style={{ scrollbarWidth: "none" }}
            >
              {dateRange.map((d) => {
                const ds      = toDateString(d);
                const isToday = ds === today;
                const isSel   = ds === selectedDate;
                const isFirst = d.getDate() === 1;

                return (
                  <button
                    key={ds}
                    ref={isToday ? todayBtnRef : undefined}
                    data-date={ds}
                    onClick={() => setSelectedDate(ds)}
                    className={[
                      "relative flex flex-shrink-0 flex-col items-center rounded-lg px-2.5 py-2 text-center transition-all",
                      isSel
                        ? "bg-primary text-primary-foreground shadow-md"
                        : isToday
                          ? "border border-primary/60 bg-primary/10 text-primary"
                          : "border border-transparent bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
                    ].join(" ")}
                  >
                    {/* Show month label on first of each month */}
                    {isFirst && (
                      <span className="absolute -top-4 left-0 right-0 text-center text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                        {MON_ABBR[d.getMonth()]}
                      </span>
                    )}
                    <span className="text-[9px] font-bold uppercase leading-none">
                      {DAY_ABBR[d.getDay()]}
                    </span>
                    <span className="mt-0.5 text-base font-black leading-none">
                      {d.getDate()}
                    </span>
                    {isToday && !isSel && (
                      <span className="mt-0.5 h-1 w-1 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Calendar icon – opens native date picker */}
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
                onChange={e => {
                  if (e.target.value) handleDateSelect(e.target.value);
                }}
              />
            </div>
          </div>

          {/* ── Selected date label ── */}
          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-lg font-black uppercase tracking-tight text-foreground">
              {selectedDate === today
                ? "Today"
                : dateFromString(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long", month: "long", day: "numeric",
                  })}
            </h2>
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>

          {/* ── Games ── */}
          {!loading && games.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
              <p className="text-lg font-bold">No games scheduled</p>
              <p className="mt-1 text-sm">Select another date to view scores</p>
            </div>
          )}

          {liveGames.length > 0 && (
            <section className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
                </span>
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Live Now</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {liveGames.map(game => (
                  <LiveScoreCard key={game.id} game={game} teamLogos={teamLogos} />
                ))}
              </div>
            </section>
          )}

          {finalGames.length > 0 && (
            <section className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-6 w-1 rounded-full bg-muted-foreground" />
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Final</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {finalGames.map(game => (
                  <LiveScoreCard key={game.id} game={game} teamLogos={teamLogos} />
                ))}
              </div>
            </section>
          )}

          {upcomingGames.length > 0 && (
            <section className="mb-12">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-6 w-1 rounded-full bg-primary" />
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Upcoming</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingGames.map(game => (
                  <LiveScoreCard key={game.id} game={game} teamLogos={teamLogos} />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
      <SiteFooter />
    </div>
  );
}



