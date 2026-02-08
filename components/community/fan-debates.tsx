"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThumbsUp, ThumbsDown, MessageSquare, Flame } from "lucide-react";

interface Debate {
  id: string;
  title: string;
  author: string;
  league: "NBA" | "NFL";
  upvotes: number;
  downvotes: number;
  comments: number;
  hot: boolean;
  timeAgo: string;
}

const debates: Debate[] = [
  {
    id: "d1",
    title: "Luka Doncic is the best player in the NBA right now, and it's not even close",
    author: "HoopsGuru99",
    league: "NBA",
    upvotes: 847,
    downvotes: 312,
    comments: 234,
    hot: true,
    timeAgo: "2h ago",
  },
  {
    id: "d2",
    title: "The Lions winning the Super Bowl would be the greatest sports story of the decade",
    author: "GridironKing",
    league: "NFL",
    upvotes: 1203,
    downvotes: 89,
    comments: 456,
    hot: true,
    timeAgo: "4h ago",
  },
  {
    id: "d3",
    title: "The NBA should eliminate the play-in tournament. Regular season games should matter more.",
    author: "StatsMaster",
    league: "NBA",
    upvotes: 542,
    downvotes: 678,
    comments: 189,
    hot: false,
    timeAgo: "6h ago",
  },
  {
    id: "d4",
    title: "Patrick Mahomes has already surpassed Tom Brady as the GOAT quarterback",
    author: "AllDayAce",
    league: "NFL",
    upvotes: 634,
    downvotes: 891,
    comments: 567,
    hot: true,
    timeAgo: "8h ago",
  },
  {
    id: "d5",
    title: "The Celtics are coasting and will flip the switch come playoffs - they're the real favorites",
    author: "CourtVision",
    league: "NBA",
    upvotes: 389,
    downvotes: 245,
    comments: 112,
    hot: false,
    timeAgo: "12h ago",
  },
  {
    id: "d6",
    title: "NFL overtime rules are still broken - both teams should always get a possession",
    author: "EndZoneExpert",
    league: "NFL",
    upvotes: 1567,
    downvotes: 123,
    comments: 345,
    hot: false,
    timeAgo: "1d ago",
  },
];

export function FanDebates() {
  const [votes, setVotes] = useState<Record<string, "up" | "down" | null>>({});
  const [filter, setFilter] = useState<"ALL" | "NBA" | "NFL">("ALL");

  function handleVote(id: string, type: "up" | "down") {
    setVotes((prev) => ({
      ...prev,
      [id]: prev[id] === type ? null : type,
    }));
  }

  const filtered =
    filter === "ALL" ? debates : debates.filter((d) => d.league === filter);

  return (
    <div className="flex flex-col gap-4">
      {/* Filter */}
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-black uppercase text-foreground">
          Hot Takes & Debates
        </h2>
        <div className="flex rounded-lg border border-border bg-card p-0.5">
          {(["ALL", "NBA", "NFL"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setFilter(l)}
              className={cn(
                "rounded-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all",
                filter === l
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Debate List */}
      {filtered.map((debate) => {
        const userVote = votes[debate.id] || null;
        const score =
          debate.upvotes -
          debate.downvotes +
          (userVote === "up" ? 1 : userVote === "down" ? -1 : 0);

        return (
          <div
            key={debate.id}
            className="flex gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30"
          >
            {/* Vote controls */}
            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={() => handleVote(debate.id, "up")}
                className={cn(
                  "rounded-lg p-2 transition-colors",
                  userVote === "up"
                    ? "bg-accent/20 text-accent"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                aria-label="Upvote"
              >
                <ThumbsUp className="h-4 w-4" />
              </button>
              <span
                className={cn(
                  "text-sm font-black tabular-nums",
                  score > 0
                    ? "text-accent"
                    : score < 0
                      ? "text-destructive"
                      : "text-muted-foreground"
                )}
              >
                {score > 0 ? `+${score}` : score}
              </span>
              <button
                type="button"
                onClick={() => handleVote(debate.id, "down")}
                className={cn(
                  "rounded-lg p-2 transition-colors",
                  userVote === "down"
                    ? "bg-destructive/20 text-destructive"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                aria-label="Downvote"
              >
                <ThumbsDown className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                  {debate.league}
                </span>
                {debate.hot && (
                  <span className="flex items-center gap-1 rounded bg-amber/20 px-2 py-0.5">
                    <Flame className="h-3 w-3 text-amber" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber">
                      Hot
                    </span>
                  </span>
                )}
                <span className="text-[10px] text-muted-foreground">
                  {debate.timeAgo}
                </span>
              </div>
              <h3 className="mb-2 text-base font-bold leading-snug text-foreground">
                {debate.title}
              </h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {debate.author}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {debate.comments} comments
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
