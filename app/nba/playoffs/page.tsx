import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PlayoffBracket } from "@/components/nba/playoff-bracket";
import { nbaPlayoffBracket } from "@/lib/nba-playoff-data";

export const metadata = {
  title: "NBA Playoff Bracket | The Athlete Insider",
  description:
    "NBA playoff bracket with Play-In tournament. Western and Eastern Conference brackets leading to the NBA Finals.",
};

export default function NBAPlayoffsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-[1600px] px-4 py-8 2xl:px-6">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center text-sm font-black text-primary-foreground shadow-md">
              <img src="/nba-logo-1.png" alt="NBA Logo" className="h-10 w-10 object-contain" />
            </div>
            <div className="h-10 w-1.5 rounded-full bg-primary" />
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
                NBA Playoffs
              </h1>
              <p className="text-sm text-muted-foreground">
                Play-In bracket and playoff tree
              </p>
            </div>
          </div>

          <PlayoffBracket data={nbaPlayoffBracket} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
