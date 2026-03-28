import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LeaguePageContent } from "@/components/league-page-content";
import { getCachedMLBTeamsList, getCachedMLBSportsRadarStandings } from "@/lib/cachedSportsData";
import type { TeamStanding, LeagueStanding } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ApiTeam = {
  abbreviation?: string;
  logo?: string;
  logoLight?: string;
  logoDark?: string;
};

// ESPN abbreviation → extra keys to store logo under (SportsRadar/mock data uses these)
const MLB_EXTRA_ABBR_KEYS: Record<string, string> = {
  ARI: "AZ",  // ESPN: ARI → SportsRadar: AZ
  CHW: "CWS",   // ESPN: CHW → SportsRadar/mock: CWS
  TBR: "TB",    // ESPN: TBR → SportsRadar: TB
  KCR: "KC",    // ESPN: KCR → SportsRadar: KC
  SDP: "SD",    // ESPN: SDP → SportsRadar: SD
  SFG: "SF",    // ESPN: SFG → SportsRadar: SF
  WSN: "WSH",   // ESPN: WSN → SportsRadar: WSH
};

function normalizeMLBAbr(value: string) {
  const upper = value.toUpperCase();
  return MLB_EXTRA_ABBR_KEYS[upper] ?? upper;
}

export default async function MLBPage() {
  let teamLogos: Record<string, string> = {};
  let apiStandings: TeamStanding[] = [];
  let powerRankings: LeagueStanding[] = [];

  try {
    const teams = await getCachedMLBTeamsList();
    teamLogos = (teams as ApiTeam[]).reduce<Record<string, string>>((acc, team) => {
      if (!team.abbreviation) return acc;
      // Store under both the raw abbr and normalized key so lookups work
      const raw = team.abbreviation.toUpperCase();
      const logo = team.logoLight || team.logo || team.logoDark;
      if (logo) {
        acc[raw] = logo;
        const normalized = normalizeMLBAbr(raw);
        if (normalized !== raw) acc[normalized] = logo;
      }
      return acc;
    }, {});
  } catch {
    // fall back to TeamBadge
  }

  try {
    const raw = await getCachedMLBSportsRadarStandings() as Record<string, unknown>;
    const leagues: any[] = (raw as any)?.league?.season?.leagues ?? [];

    for (const league of leagues) {
      const leagueAlias: string = (league.alias ?? "").toUpperCase();
      for (const division of league.divisions ?? []) {
        const divisionName: string = division.name ?? "";
        for (const t of division.teams ?? []) {
          const wins: number = t.win ?? t.wins ?? 0;
          const losses: number = t.loss ?? t.losses ?? 0;
          const winP: number =
            t.win_p ?? t.win_pct ?? (wins + losses > 0 ? wins / (wins + losses) : 0);
          const gb = t.games_back === 0 ? "-" : t.games_back != null ? String(t.games_back) : "-";
          const streak = t.streak
            ? `${t.streak.kind === "win" ? "W" : "L"}${t.streak.length}`
            : "-";
          const rec = (type: string) => {
            const r = (t.records ?? []).find((x: any) => x.record_type === type);
            return r ? `${r.win}-${r.loss}` : "-";
          };

          apiStandings.push({
            rank: t.rank?.division ?? 99,
            team: `${t.market} ${t.name}`.trim(),
            abbreviation: (t.abbr ?? "").toUpperCase(),
            wins,
            losses,
            pct: winP.toFixed(3),
            gb,
            streak,
            conference: leagueAlias,
            division: divisionName,
            league: "MLB",
            home: rec("home"),
            away: rec("road"),
            last10: rec("last_10"),
          });
        }
      }
    }

    powerRankings = [...apiStandings]
      .sort((a, b) => Number.parseFloat(b.pct || "0") - Number.parseFloat(a.pct || "0"))
      .slice(0, 10)
      .map((t, i) => ({
        rank: i + 1,
        team: t.team,
        abbreviation: t.abbreviation,
        record: `${t.wins}-${t.losses}`,
        lastWeek: i + 1,
        trend: "same" as const,
        summary: `${t.wins}-${t.losses} • ${t.conference} ${t.division}`,
        league: "MLB" as const,
        wins: t.wins,
        losses: t.losses,
        pct: t.pct,
        conference: t.conference,
        division: t.division,
      }));
  } catch {
    // fall back to mock standings in LeaguePageContent
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <LeaguePageContent
          league="MLB"
          teamLogos={teamLogos}
          standingsOverride={apiStandings.length > 0 ? apiStandings : undefined}
          rankingsOverride={powerRankings.length > 0 ? powerRankings : undefined}
          conferencesOverride={["AL", "NL"]}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
