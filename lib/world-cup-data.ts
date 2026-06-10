export const WORLD_CUP_GROUPS = [
  {
    name: "Group A",
    teams: ["United States", "Mexico", "Japan", "Morocco"],
  },
  {
    name: "Group B",
    teams: ["Argentina", "Canada", "Nigeria", "South Korea"],
  },
  {
    name: "Group C",
    teams: ["Brazil", "France", "Germany", "Australia"],
  },
  {
    name: "Group D",
    teams: ["England", "Spain", "Uruguay", "Ghana"],
  },
] as const;

export const WORLD_CUP_NEWS = [
  {
    title: "2026 World Cup build-up starts with expanded format planning",
    tag: "Analysis",
    summary:
      "The tournament expands to 48 teams, creating a broader group-stage picture and a longer path to the knockout rounds.",
  },
  {
    title: "Host city prep ramps up across North America",
    tag: "News",
    summary:
      "Venue upgrades, training facilities, and broadcast logistics are expected to drive the first major waves of coverage.",
  },
  {
    title: "Player watchlist forms around emerging breakout talents",
    tag: "Preview",
    summary:
      "The next year will shape who enters the tournament as a breakout contender versus a household name.",
  },
  {
    title: "Draw watch: how early group-stage pairings could shape the bracket",
    tag: "Breakdown",
    summary:
      "Because the API is not connected yet, this panel previews the kind of editorial analysis that will land here.",
  },
] as const;

export const WORLD_CUP_SCORE_PLACEHOLDERS = [
  {
    matchup: "United States vs Mexico",
    status: "Upcoming",
    time: "Group Stage · TBD",
  },
  {
    matchup: "Argentina vs Canada",
    status: "Upcoming",
    time: "Group Stage · TBD",
  },
  {
    matchup: "Brazil vs France",
    status: "Upcoming",
    time: "Group Stage · TBD",
  },
] as const;

export const WORLD_CUP_PLAYER_STATS = [
  { player: "TBD Forward", team: "Group Stage", stat: "Goals", value: "-" },
  { player: "TBD Midfielder", team: "Group Stage", stat: "Assists", value: "-" },
  { player: "TBD Goalkeeper", team: "Group Stage", stat: "Clean Sheets", value: "-" },
  { player: "TBD Defender", team: "Group Stage", stat: "Clearances", value: "-" },
] as const;
