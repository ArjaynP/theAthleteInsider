"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DailyTrivia } from "@/components/community/daily-trivia";
import { PredictionLeaderboard } from "@/components/community/prediction-leaderboard";
import { FanDebates } from "@/components/community/fan-debates";
import { FanPulse } from "@/components/community/fan-pulse";
import { PollWidget } from "@/components/poll-widget";
import { polls } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

const tabs = [
  { id: "trivia", label: "Daily Trivia" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "debates", label: "Fan Debates" },
  { id: "pulse", label: "Fan Pulse" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<TabId>("trivia");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <div className="h-10 w-1.5 rounded-full bg-primary" />
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
                Community
              </h1>
              <p className="text-sm text-muted-foreground">
                Trivia, debates, predictions, and fan engagement
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8 flex overflow-x-auto rounded-xl border border-border bg-card p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {activeTab === "trivia" && <DailyTrivia />}
              {activeTab === "leaderboard" && <PredictionLeaderboard />}
              {activeTab === "debates" && <FanDebates />}
              {activeTab === "pulse" && <FanPulse />}
            </div>
            <aside className="flex flex-col gap-6">
              <PollWidget poll={polls[2]} />
              <PollWidget poll={polls[0]} />
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
