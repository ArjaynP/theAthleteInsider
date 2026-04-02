"use client";

import React from "react"

import { useState } from "react";
import { Mail, ArrowRight, Zap } from "lucide-react";
import { toast } from "sonner";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success("You're in! Check your inbox for confirmation.");
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-accent bg-accent/10 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
          <Zap className="h-6 w-6 text-accent-foreground" />
        </div>
        <h3 className="mb-2 text-xl font-black uppercase text-foreground">
          You&apos;re In!
        </h3>
        <p className="text-sm text-muted-foreground">
          Welcome to the insider circle. Check your inbox for the next edition.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-8">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Mail className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-black uppercase text-foreground">
            The Insider Newsletter
          </h3>
          <p className="text-xs text-muted-foreground">
            Weekly analysis, hot takes, and betting insights
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
        >
          Join
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
