"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LiveScoreCard } from "@/components/live-score-card";
import { games } from "@/lib/mock-data";

type ApiTeam = {
  abbreviation?: string;
  logo?: string;
  logoLight?: string;
  logoDark?: string;
};

function normalizeAbbreviation(value: string) {
  const normalized = value.toUpperCase();
  const aliasMap: Record<string, string> = {
    GS: "GSW",
    NY: "NYK",
    NO: "NOP",
    SA: "SAS",
    UTAH: "UTA",
    WSH: "WAS",
  };
  return aliasMap[normalized] ?? normalized;
}

export default function NBAScoresPage() {
  const [teamLogos, setTeamLogos] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchTeamLogos() {
      try {
        const response = await fetch("/api/teams", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok || !Array.isArray(data?.teams)) {
          return;
        }

        const logos = (data.teams as ApiTeam[]).reduce<Record<string, string>>((acc, team) => {
          if (!team.abbreviation) return acc;
          const abbreviation = normalizeAbbreviation(team.abbreviation);
          const logo = team.logoLight || team.logo || team.logoDark;
          if (logo) {
            acc[abbreviation] = logo;
          }
          return acc;
        }, {});

        setTeamLogos(logos);
      } catch {
      }
    }

    fetchTeamLogos();
  }, []);

  const nbaGames = games.filter((g) => g.league === "NBA");
  const liveGames = nbaGames.filter((g) => g.status === "LIVE");
  const finalGames = nbaGames.filter((g) => g.status === "FINAL");
  const upcomingGames = nbaGames.filter((g) => g.status === "UPCOMING");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
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
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
