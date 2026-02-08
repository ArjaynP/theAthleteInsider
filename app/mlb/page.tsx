"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LeaguePageContent } from "@/components/league-page-content";

export default function MLBPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <LeaguePageContent league="MLB" />
      </main>
      <SiteFooter />
    </div>
  );
}
