import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NFLPlayoffBracket } from "@/components/nfl/playoff-bracket";
import { nflPostseasonBracket } from "@/lib/nfl-playoff-data";

export const metadata: Metadata = {
  title: "NFL Playoffs | The Athlete Insider",
  description:
    "NFL playoffs bracket featuring AFC/NFC paths from Wild Card Weekend to the Super Bowl.",
};

export default function NFLPlayoffsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-[1800px] px-4 py-8 2xl:px-6">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center text-sm font-black text-primary-foreground shadow-md">
              <img src="/nfl-logo-2.png" alt="NFL Logo" className="h-14 w-14 object-contain" />
            </div>
            <div className="h-10 w-1.5 rounded-full bg-primary" />
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
                NFL Postseason
              </h1>
              <p className="text-sm text-muted-foreground">
                Playoff bracket from Wild Card Weekend through the Super Bowl
              </p>
            </div>
          </div>

          <NFLPlayoffBracket data={nflPostseasonBracket} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
