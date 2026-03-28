"use client";

import { useEffect, useState, useCallback } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LiveScoreCard } from "@/components/live-score-card";
import type { Game } from "@/lib/mock-data";

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
    const [teamLogos, setTeamLogos] = useState<Record<string, string>>({});
    const [mlbGames, setMlbGames] = useState<Game[]>([]);

    const fetchGames = useCallback(async () => {
      try {
        const res = await fetch("/api/mlb-scores", { cache: "no-store" });
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
        }[]).map((g) => ({ ...g, league: "MLB" as const }));

        setMlbGames(mapped);
      } catch {
        setMlbGames([]);
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
      fetchGames();
    }, [fetchGames]);

    useEffect(() => {
      const intervalMs = liveGames.length > 0 ? 30_000 : 120_000;
      const id = setInterval(() => fetchGames(), intervalMs);
      return () => clearInterval(id);
    }, [liveGames.length, fetchGames]);

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
            {mlbGames.length === 0 && (
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
