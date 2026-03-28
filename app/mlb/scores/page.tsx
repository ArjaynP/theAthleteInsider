"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LiveScoreCard } from "@/components/live-score-card";
import type { Game } from "@/lib/mock-data";
import { CalendarDays, Loader2 } from "lucide-react";

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

function buildDateRange(year: number): Date[] {
  const start = new Date(year, 2, 1);  // Mar 1
  const end = new Date(year, 10, 30);  // Nov 30
  const days: Date[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

const DAY_ABBR = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MON_ABBR = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

// ESPN abbreviation → extra keys (SportsRadar/mock may use different abbrs)
const MLB_EXTRA_ABBR_KEYS: Record<string, string> = {
  ARI: "AZ", CHW: "CWS", TBR: "TB", KCR: "KC", SDP: "SD", SFG: "SF", WSN: "WSH",
};

type ApiTeam = {
  abbreviation?: string;
  logo?: string;
  logoLight?: string;
  logoDark?: string;
};

export default function MLBScoresPage() {
    const today = getEasternDateString();
    const todayDate = dateFromString(today);
    const seasonYear = todayDate.getMonth() < 2 ? todayDate.getFullYear() - 1 : todayDate.getFullYear();
    const seasonStart = new Date(seasonYear, 2, 1);
    const seasonEnd = new Date(seasonYear, 10, 30);
    const initialSelectedDate =
      todayDate < seasonStart
        ? toDateString(seasonStart)
        : todayDate > seasonEnd
          ? toDateString(seasonEnd)
          : today;
    const dateRange = useRef<Date[]>(buildDateRange(seasonYear)).current;

    const [selectedDate, setSelectedDate] = useState<string>(initialSelectedDate);
    const [teamLogos, setTeamLogos] = useState<Record<string, string>>({});
    const [mlbGames, setMlbGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    const stripRef = useRef<HTMLDivElement>(null);
    const todayBtnRef = useRef<HTMLButtonElement>(null);
    const calendarRef = useRef<HTMLInputElement>(null);

    const fetchGames = useCallback(async (date: string) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/mlb-scores?date=${date}`, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !Array.isArray(data?.games)) {
          setMlbGames([]);
          return;
        }

        const mapped: Game[] = (data.games as {
          id: string;
          homeTeam: string;
          awayTeam: string;
          homeScore: number;
          awayScore: number;
          status: "LIVE" | "FINAL" | "UPCOMING";
          quarter?: string;
          time?: string;
          startTime?: string;
          league: "MLB";
          homeRecord: string;
          awayRecord: string;
          currentPitcher?: string;
          currentBatter?: string;
          outs?: number;
          balls?: number;
          strikes?: number;
          bases?: {
            first: boolean;
            second: boolean;
            third: boolean;
          };
        }[]).map((g) => ({ ...g, league: "MLB" as const }));

        setMlbGames(mapped);
      } catch {
        setMlbGames([]);
      } finally {
        setLoading(false);
      }
    }, []);

    const liveGames = mlbGames.filter((g) => g.status === "LIVE");
    const finalGames = mlbGames.filter((g) => g.status === "FINAL");
    const upcomingGames = mlbGames.filter((g) => g.status === "UPCOMING");

    useEffect(() => {
      async function fetchLogos() {
        try {
          const res = await fetch("/api/mlb-teams");
          const data = await res.json();
          if (!res.ok || !Array.isArray(data?.teams)) return;
          const logos = (data.teams as ApiTeam[]).reduce<Record<string, string>>((acc, team) => {
            if (!team.abbreviation) return acc;
            const abbr = team.abbreviation.toUpperCase();
            const logo = team.logoLight || team.logo || team.logoDark;
            if (logo) {
              acc[abbr] = logo;
              const extra = MLB_EXTRA_ABBR_KEYS[abbr];
              if (extra) acc[extra] = logo;
            }
            return acc;
          }, {});
          setTeamLogos(logos);
        } catch {
          // logos non-critical
        }
      }
      fetchLogos();
    }, []);

    useEffect(() => {
      if (todayBtnRef.current && stripRef.current) {
        const strip = stripRef.current;
        const btn = todayBtnRef.current;
        strip.scrollLeft = btn.offsetLeft - strip.clientWidth / 2 + btn.offsetWidth / 2;
      }
    }, []);

    useEffect(() => {
      fetchGames(selectedDate);
    }, [fetchGames, selectedDate]);

    useEffect(() => {
      const intervalMs = liveGames.length > 0 ? 30_000 : 120_000;
      const id = setInterval(() => fetchGames(selectedDate), intervalMs);
      return () => clearInterval(id);
    }, [liveGames.length, fetchGames, selectedDate]);

    function handleDateSelect(ds: string) {
      setSelectedDate(ds);
      const idx = dateRange.findIndex((d) => toDateString(d) === ds);
      if (idx >= 0 && stripRef.current) {
        const btns = stripRef.current.querySelectorAll<HTMLButtonElement>("button[data-date]");
        const btn = btns[idx];
        if (btn) btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }

    return (
        <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
            <div className="mx-auto max-w-7xl px-4 py-8">
            {/* Header */}
            <div className="mb-8 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center bg-primary text-sm font-black text-primary-foreground shadow-md">
                    <img src="/mlb-logo.png" alt="MLB Logo" />
                </div>
                <div className="h-10 w-1.5 rounded-full bg-primary" />
                <div>
                <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
                    MLB Scores
                </h1>
                <p className="text-sm text-muted-foreground">
                    Live scores and results for all MLB games
                </p>
                </div>
            </div>

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
                      className={[
                        "relative flex flex-shrink-0 flex-col items-center rounded-lg px-2.5 py-2 text-center transition-all",
                        isSel
                          ? "bg-primary text-primary-foreground shadow-md"
                          : isToday
                            ? "border border-primary/60 bg-primary/10 text-primary"
                            : "border border-transparent bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
                      ].join(" ")}
                    >
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
                  min={toDateString(dateRange[0])}
                  max={toDateString(dateRange[dateRange.length - 1])}
                  value={selectedDate}
                  onChange={(e) => {
                    if (e.target.value) handleDateSelect(e.target.value);
                  }}
                />
              </div>
            </div>

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

            {/* Live Games */}
            {liveGames.length > 0 && (
                <section className="mb-8">
                <div className="mb-4 flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
                    </span>
                    <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
                    Live Now
                    </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {liveGames.map((game) => (
                    <LiveScoreCard key={game.id} game={game} teamLogos={teamLogos} />
                    ))}
                </div>
                </section>
            )}

            {/* Final Games */}
            {finalGames.length > 0 && (
                <section className="mb-8">
                <div className="mb-4 flex items-center gap-3">
                    <div className="h-6 w-1 rounded-full bg-muted-foreground" />
                    <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
                    Final
                    </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {finalGames.map((game) => (
                    <LiveScoreCard key={game.id} game={game} teamLogos={teamLogos} />
                    ))}
                </div>
                </section>
            )}

            {/* Upcoming Games */}
            {upcomingGames.length > 0 && (
                <section className="mb-12">
                <div className="mb-4 flex items-center gap-3">
                    <div className="h-6 w-1 rounded-full bg-primary" />
                    <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
                    Upcoming
                    </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {upcomingGames.map((game) => (
                    <LiveScoreCard key={game.id} game={game} teamLogos={teamLogos} />
                    ))}
                </div>
                </section>
            )}

            {/* Fallback if no games */}
            {!loading && mlbGames.length === 0 && (
                <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-border bg-card p-8 text-center">
                <h3 className="mb-2 text-xl font-bold text-foreground">No Games Scheduled</h3>
                <p className="text-muted-foreground">Check back later for MLB action.</p>
                </div>
            )}
            </div>
        </main>
        <SiteFooter />
        </div>
    );
}
