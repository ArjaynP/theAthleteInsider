import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-card to-background border border-border/50", className)}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full p-1"
      >
        {/* Thunderbolt Background - Centered */}
        <path
          d="M60 5L35 50H55L45 95L75 45H55L65 5H60Z"
          className="fill-primary stroke-primary-foreground/20"
          strokeWidth="1"
        />
        
        {/* Effects/Glow */}
        <circle cx="50" cy="50" r="35" className="fill-primary/10 blur-xl" />

        {/* Text "A" */}
        {/* Modern angular A with cut for sport feel */}
        <path
          d="M20 80L40 20L60 80H48L44 65H36L32 80H20Z M40 35L42 55H38L40 35Z"
          className="fill-foreground font-black"
          stroke="var(--background)"
          strokeWidth="2" 
        />
        
        {/* Text "I" */}
        {/* Matching angular style */}
        <path
          d="M75 20H90L85 80H70L75 20Z"
          className="fill-foreground font-black"
          stroke="var(--background)"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
