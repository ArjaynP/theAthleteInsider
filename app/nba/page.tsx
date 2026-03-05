import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LeaguePageContent } from "@/components/league-page-content";
import { getCachedNBATeamsList } from "@/lib/cachedSportsData";

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

export default async function NBAPage() {
  let teamLogos: Record<string, string> = {};
  try {
    const teams = await getCachedNBATeamsList();
    teamLogos = (teams as ApiTeam[]).reduce<Record<string, string>>((acc, team) => {
      if (!team.abbreviation) return acc;
      const abbr = normalizeAbbreviation(team.abbreviation);
      const logo = team.logoLight || team.logo || team.logoDark;
      if (logo) acc[abbr] = logo;
      return acc;
    }, {});
  } catch {
    // fall back to TeamBadge
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <LeaguePageContent league="NBA" teamLogos={teamLogos} />
      </main>
      <SiteFooter />
    </div>
  );
}
