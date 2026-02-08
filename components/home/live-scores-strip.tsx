"use client";

import { games } from "@/lib/mock-data";
import { LiveScoreCard } from "@/components/live-score-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export function LiveScoresStrip() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = 280;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  const liveGames = games.filter((g) => g.status === "LIVE");

  return (
    <section className="border-b border-border bg-card/50">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        {liveGames.length > 0 && (
          <div className="flex items-center gap-2 pr-3 border-r border-border">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              Live
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => scroll("left")}
          className="hidden flex-shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground md:block"
          aria-label="Scroll scores left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div
          ref={scrollRef}
          className="flex flex-1 gap-3 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {games.map((game) => (
            <LiveScoreCard key={game.id} game={game} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="hidden flex-shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground md:block"
          aria-label="Scroll scores right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
