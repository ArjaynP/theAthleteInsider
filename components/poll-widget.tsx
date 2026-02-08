"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { toast } from "sonner";
import type { Poll } from "@/lib/mock-data";

interface PollWidgetProps {
  poll: Poll;
}

export function PollWidget({ poll }: PollWidgetProps) {
  const [voted, setVoted] = useState<number | null>(null);
  const [localVotes, setLocalVotes] = useState(poll.options.map((o) => o.votes));

  const totalVotes = localVotes.reduce((a, b) => a + b, 0);

  function handleVote(index: number) {
    if (voted !== null) return;
    setVoted(index);
    setLocalVotes((prev) => prev.map((v, i) => (i === index ? v + 1 : v)));
    toast.success("Vote submitted!");
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
          Poll
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-amber">
          {poll.league}
        </span>
      </div>
      <h3 className="mb-4 text-lg font-black uppercase leading-tight text-foreground">
        {poll.question}
      </h3>

      <div className="flex flex-col gap-3">
        {poll.options.map((option, i) => {
          const pct =
            voted !== null
              ? Math.round((localVotes[i] / (totalVotes + 1)) * 100)
              : 0;

          return (
            <button
              key={option.label}
              type="button"
              onClick={() => handleVote(i)}
              disabled={voted !== null}
              className={cn(
                "relative overflow-hidden rounded-lg border p-3 text-left transition-all",
                voted === null
                  ? "border-border hover:border-primary cursor-pointer"
                  : voted === i
                    ? "border-primary"
                    : "border-border"
              )}
            >
              {voted !== null && (
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 transition-all duration-500",
                    voted === i ? "bg-primary/20" : "bg-secondary/50"
                  )}
                  style={{ width: `${pct}%` }}
                />
              )}
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {voted === i && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-bold",
                      voted === i ? "text-primary" : "text-foreground"
                    )}
                  >
                    {option.label}
                  </span>
                </div>
                {voted !== null && (
                  <span className="text-sm font-black tabular-nums text-foreground">
                    {pct}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {(totalVotes + (voted !== null ? 1 : 0)).toLocaleString()} votes
      </p>
    </div>
  );
}
