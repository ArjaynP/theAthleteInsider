"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Image from "next/image";
import { Loader2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UCLMatch } from "@/lib/ucl-types";
import { uclMatches, UCL_ABBREV_TO_NAME } from "@/lib/ucl-data";

// ─── helpers ────────────────────────────────────────────────────────────────

function statusBadge(status: UCLMatch["status"]) {
  if (status === "LIVE") {
    return (
      <span className="flex items-center gap-1 rounded bg-accent px-2 py-0.5 text-[10px] font-black uppercase text-accent-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-foreground animate-pulse" />
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
      {/* Match time shown separately */}
      Upcoming
    </span>
  );
}

function MatchCard({ match, logos }: { match: UCLMatch; logos: Record<string, string | null> }) {
  const isUpcoming = match.status === "UPCOMING";
  const isFinal = match.status === "FINAL";
  const isLive = match.status === "LIVE";

  const homeName = UCL_ABBREV_TO_NAME[match.homeTeam] ?? match.homeTeam;
  const awayName = UCL_ABBREV_TO_NAME[match.awayTeam] ?? match.awayTeam;
  const homeLogo = logos[homeName];
  const awayLogo = logos[awayName];

  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md">
      {/* Round + status */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {match.round ?? "UCL"}
        </span>
        {statusBadge(match.status)}
      </div>

      {/* Teams + score */}
      <div className="flex items-center gap-3">
        {/* Away team */}
        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-muted">
            {awayLogo ? (
              <Image src={awayLogo} alt={awayName} width={40} height={40} className="object-contain" />
            ) : (
              <span className="text-xs font-black text-primary">{match.awayTeam}</span>
            )}
          </div>
          <span className="text-xs font-bold text-foreground">{awayName}</span>
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
                {match.awayScore} – {match.homeScore}
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

        {/* Home team */}
        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-muted">
            {homeLogo ? (
              <Image src={homeLogo} alt={homeName} width={40} height={40} className="object-contain" />
            ) : (
              <span className="text-xs font-black text-primary">{match.homeTeam}</span>
            )}
          </div>
          <span className="text-xs font-bold text-foreground">{homeName}</span>
        </div>
      </div>

      {/* Venue */}
      {match.venue && (
        <p className="mt-3 text-center text-[10px] text-muted-foreground">{match.venue}</p>
      )}
    </div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function UCLScoresPage() {
  // TODO: Replace mock data with API fetch when provider is integrated.
  // Pattern: fetch("/api/ucl-scores?date=YYYY-MM-DD") returning { matches: UCLMatch[] }
  const [matches, setMatches] = useState<UCLMatch[]>([]);
  const [logos, setLogos] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated async load — swap this for a real fetch call to /api/ucl-scores
    const timer = setTimeout(async () => {
      setMatches(uclMatches);
      setLoading(false);
      // Fetch logos for all unique teams
      const names = [
        ...new Set(
          uclMatches.flatMap((m) => [
            UCL_ABBREV_TO_NAME[m.homeTeam] ?? m.homeTeam,
            UCL_ABBREV_TO_NAME[m.awayTeam] ?? m.awayTeam,
          ])
        ),
      ];
      try {
        const res = await fetch("/api/ucl-logos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ names }),
        });
        if (res.ok) {
          const data = await res.json();
          setLogos(data.logos ?? {});
        }
      } catch {
        // logos remain empty; abbreviations shown as fallback
      }
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Group by round
  const byRound = matches.reduce<Record<string, UCLMatch[]>>((acc, m) => {
    const key = m.round ?? "UCL";
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-primary/10">
              <Image src="/uefa-logo.jpg" alt="UEFA" width={56} height={56} className="h-14 w-14 object-cover" />
            </div>
            <div className="h-10 w-1.5 rounded-full bg-primary" />
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
                UCL Scores
              </h1>
              <p className="text-sm text-muted-foreground">
                UEFA Champions League 2025–26 results &amp; fixtures
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : matches.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-muted-foreground">
              <Calendar className="h-10 w-10 opacity-40" />
              <p className="font-bold">No fixtures today</p>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {Object.entries(byRound).map(([round, roundMatches]) => (
                <section key={round}>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-6 w-1 rounded-full bg-primary" />
                    <h2 className="text-lg font-black uppercase tracking-tight text-foreground">
                      {round}
                    </h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {roundMatches.map((m) => (
                      <MatchCard key={m.id} match={m} logos={logos} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
