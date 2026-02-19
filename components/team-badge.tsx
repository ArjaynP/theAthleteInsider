import { getTeamColor } from "@/lib/team-colors";
import { cn } from "@/lib/utils";

interface TeamBadgeProps {
  abbreviation: string;
  league: "NBA" | "NFL" | "MLB";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap: Record<NonNullable<TeamBadgeProps["size"]>, string> = {
  sm: "h-7 w-7 text-[11px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
};

export function TeamBadge({ abbreviation, league, size = "md", className }: TeamBadgeProps) {
  const color = getTeamColor(league, abbreviation);
  const label = abbreviation.slice(0, 3).toUpperCase();

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md font-black uppercase",
        sizeMap[size],
        color ? "text-white" : "bg-secondary text-foreground",
        className
      )}
      style={color ? { backgroundColor: color } : undefined}
    >
      {label}
    </div>
  );
}
