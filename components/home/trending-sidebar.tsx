import { trendingTopics, polls } from "@/lib/mock-data";
import { Flame, TrendingUp } from "lucide-react";
import { PollWidget } from "@/components/poll-widget";

export function TrendingSidebar() {
  return (
    <div className="flex flex-col gap-6">
      {/* Quick Poll */}
      <PollWidget poll={polls[0]} />

      {/* Trending Topics */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-black uppercase text-foreground">
            Trending Now
          </h3>
        </div>
        <div className="flex flex-col gap-3">
          {trendingTopics.map((topic, i) => (
            <div
              key={topic.id}
              className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary"
            >
              <span className="text-lg font-black tabular-nums text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">
                    {topic.title}
                  </span>
                  {topic.hot && (
                    <Flame className="h-3 w-3 text-amber" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    {topic.league}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {topic.count}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
