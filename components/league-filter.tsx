"use client"

const filters = [
  { id: "all", label: "All" },
  { id: "NBA", label: "NBA" },
  { id: "NFL", label: "NFL" },
]

interface LeagueFilterProps {
  active: string
  onChange: (id: string) => void
}

export function LeagueFilter({ active, onChange }: LeagueFilterProps) {
  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onChange(filter.id)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            active === filter.id
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
