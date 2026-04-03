"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { UCLKnockoutBracketView } from "@/components/ucl/knockout-bracket";
import type { UCLKnockoutBracket } from "@/lib/ucl-types";
import { uclKnockoutBracket } from "@/lib/ucl-data";

export default function UCLKnockoutPage() {
  // TODO: Replace with API fetch when provider is integrated.
  // Pattern: fetch("/api/ucl-bracket") returning { bracket: UCLKnockoutBracket }
  const [bracket, setBracket] = useState<UCLKnockoutBracket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBracket(uclKnockoutBracket);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-[1600px] px-4 py-8 2xl:px-6">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-primary/10">
              <Image src="/uefa-logo.jpg" alt="UEFA" width={56} height={56} className="h-14 w-14 object-cover" />
            </div>
            <div className="h-10 w-1.5 rounded-full bg-primary" />
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
                Knockout Phase
              </h1>
              <p className="text-sm text-muted-foreground">
                UEFA Champions League 2025–26 · R16 · QF · SF · Final
              </p>
            </div>
          </div>

          {/* Round labels strip */}
          <div className="mb-6 flex flex-wrap gap-3">
            {[
              { label: "Round of 16", desc: "Apr 8–9 / Apr 15–16" },
              { label: "Quarter-Finals", desc: "Apr 22–23 / Apr 29–30" },
              { label: "Semi-Finals", desc: "Apr 29–30 / May 6–7" },
              { label: "Final", desc: "May 30 · Munich" },
            ].map((r) => (
              <div
                key={r.label}
                className="rounded-lg border border-border bg-card px-4 py-2"
              >
                <p className="text-xs font-black uppercase tracking-wide text-foreground">{r.label}</p>
                <p className="text-[10px] text-muted-foreground">{r.desc}</p>
              </div>
            ))}
          </div>

          {loading || !bracket ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <UCLKnockoutBracketView data={bracket} />
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
