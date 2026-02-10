"use client";

import { leaderboard } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function PredictionLeaderboard() {
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="flex flex-col gap-6">
      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-3">
        {/* 2nd Place */}
        <div className="flex flex-col items-center rounded-xl border border-border bg-card p-5 pt-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          </div>
          <span className="text-2xl font-black text-muted-foreground">2</span>
          <p className="mt-1 text-center text-sm font-bold text-foreground">
            {top3[1].username}
          </p>
          <p className="text-xs text-muted-foreground">
            {top3[1].score.toLocaleString()} pts
          </p>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-xs font-bold text-amber">
              {top3[1].streak} streak
            </span>
          </div>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center rounded-xl border border-amber/30 bg-amber/5 p-5 pt-4">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber/20">
          </div>
          <span className="text-3xl font-black text-amber">1</span>
          <p className="mt-1 text-center text-sm font-bold text-foreground">
            {top3[0].username}
          </p>
          <p className="text-xs text-muted-foreground">
            {top3[0].score.toLocaleString()} pts
          </p>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-xs font-bold text-amber">
              {top3[0].streak} streak
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-xs font-bold text-accent">
              {Math.round(
                (top3[0].correctPicks / top3[0].totalPicks) * 100
              )}
              % accuracy
            </span>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center rounded-xl border border-border bg-card p-5 pt-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          </div>
          <span className="text-2xl font-black text-muted-foreground">3</span>
          <p className="mt-1 text-center text-sm font-bold text-foreground">
            {top3[2].username}
          </p>
          <p className="text-xs text-muted-foreground">
            {top3[2].score.toLocaleString()} pts
          </p>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-xs font-bold text-amber">
              {top3[2].streak} streak
            </span>
          </div>
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
            Global Leaderboard
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-5 py-3 text-left font-bold uppercase tracking-widest">
                  Rank
                </th>
                <th className="px-5 py-3 text-left font-bold uppercase tracking-widest">
                  Player
                </th>
                <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                  Score
                </th>
                <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                  Streak
                </th>
                <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                  Accuracy
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, i) => {
                const accuracy = Math.round(
                  (entry.correctPicks / entry.totalPicks) * 100
                );
                return (
                  <tr
                    key={entry.username}
                    className={cn(
                      "border-b border-border/50 transition-colors hover:bg-secondary/30",
                      i < 3 && "bg-primary/5"
                    )}
                  >
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "text-lg font-black tabular-nums",
                          i === 0
                            ? "text-amber"
                            : i < 3
                              ? "text-primary"
                              : "text-muted-foreground"
                        )}
                      >
                        {entry.rank}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-bold text-foreground">
                        {entry.username}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-center font-bold tabular-nums text-foreground">
                      {entry.score.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="inline-flex items-center gap-1">
                        <span className="text-sm font-bold text-foreground">
                          {entry.streak}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-bold text-foreground">
                          {accuracy}%
                        </span>
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              accuracy >= 80
                                ? "bg-accent"
                                : accuracy >= 60
                                  ? "bg-primary"
                                  : "bg-amber"
                            )}
                            style={{ width: `${accuracy}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
