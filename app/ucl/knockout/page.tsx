"use client";

import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { UCLKnockoutBracketView } from "@/components/ucl/knockout-bracket";
import type { UCLBracketData, BracketTie, BracketTeam } from "@/components/ucl/knockout-bracket";

/** Inject logos fetched client-side into any team slot that still has logoUrl == null. */
async function enrichWithLogos(data: UCLBracketData): Promise<UCLBracketData> {
  const allTies: (BracketTie | null)[] = [
    ...data.koPO, ...data.r16, ...data.qf, ...data.sf, data.final,
  ];
  const missingNames = [
    ...new Set(
      allTies
        .filter(Boolean)
        .flatMap((t) => [t!.homeTeam, t!.awayTeam])
        .filter((tm) => !tm.logoUrl && tm.name !== "TBD")
        .map((tm) => tm.name)
    ),
  ];

  if (missingNames.length === 0) return data;

  let extraLogos: Record<string, string | null> = {};
  try {
    const res = await fetch("/api/ucl-logos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ names: missingNames }),
    });
    if (res.ok) {
      const json = await res.json();
      extraLogos = json.logos ?? {};
    }
  } catch {
    return data;
  }

  const injectLogo = (tm: BracketTeam): BracketTeam => ({
    ...tm,
    logoUrl: tm.logoUrl ?? extraLogos[tm.name] ?? null,
  });
  const enrichTie = (tie: BracketTie): BracketTie => ({
    ...tie,
    homeTeam: injectLogo(tie.homeTeam),
    awayTeam: injectLogo(tie.awayTeam),
  });

  return {
    koPO:  data.koPO.map(enrichTie),
    r16:   data.r16.map(enrichTie),
    qf:    data.qf.map(enrichTie),
    sf:    data.sf.map(enrichTie),
    final: data.final ? enrichTie(data.final) : null,
  };
}

export default function UCLKnockoutPage() {
  const [bracket, setBracket] = useState<UCLBracketData | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    (async () => {
      try {
        const r = await fetch("/api/ucl-bracket");
        if (!r.ok) throw new Error("API error");
        const data: UCLBracketData = await r.json();
        // Top-up any team logos that the server couldn't resolve
        const enriched = await enrichWithLogos(data);
        if (mounted.current) {
          setBracket(enriched);
          setLoading(false);
        }
      } catch {
        if (mounted.current) setLoading(false);
      }
    })();
    return () => { mounted.current = false; };
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
              { label: "KO Playoffs", desc: "Feb 17–18 / Feb 24–25" },
              { label: "Round of 16", desc: "Mar 10–11 / Mar 17–18" },
              { label: "Quarter-Finals", desc: "Apr 7–8 / Apr 14–15" },
              { label: "Semi-Finals", desc: "Apr 28–29 / May 5–6" },
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

          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !bracket ? (
            <div className="flex min-h-[400px] items-center justify-center text-muted-foreground text-sm">
              Failed to load bracket data.
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

