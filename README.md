# The Athlete Insider

Sports media web app built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, and Redis caching.

This project combines a polished editorial-style frontend (NBA/NFL/MLB pages, scores, standings, fantasy, community) with lightweight backend APIs that fetch and cache live NBA data from RapidAPI.

## Table of Contents

1. Project Overview
2. Tech Stack
3. Features
4. Architecture and Data Flow
5. Project Structure
6. Routes and Pages
7. API Endpoints
8. Data Sources
9. Caching Strategy (Redis)
10. Database and Prisma
11. Environment Variables
12. Local Development Setup
13. Scripts
14. Deployment Notes
15. Current Gaps and Roadmap
16. Troubleshooting

## 1. Project Overview

The Athlete Insider is a multi-league sports content platform focused on:

- Editorial storytelling (articles, featured content)
- League experiences (NBA/NFL/MLB hubs)
- Dynamic score and standings views
- Community interaction modules (trivia, debates, pulse, leaderboards)
- Fantasy guidance sections

At present, the most live-backed integration is for NBA standings and team logos through internal API routes and Redis caching. Many other views are powered by rich mock data, allowing UI iteration while backend integrations are expanded.

## 2. Tech Stack

- Framework: `Next.js 16` (App Router)
- Language: `TypeScript` (`strict: true` in `tsconfig.json`)
- UI: `React 19`, Tailwind CSS, `lucide-react`
- Component tooling: `shadcn/ui` config (`components.json`)
- Data and ORM: `Prisma` + PostgreSQL
- Cache: `ioredis`
- Tooling: `tsx`, PostCSS, Tailwind plugins

Key config files:

- `next.config.mjs`
- `tsconfig.json`
- `tailwind.config.ts`
- `prisma.config.ts`

## 3. Features

- Homepage with live score strip, featured stories, trending module, newsletter CTA
- League hubs: NBA, NFL, MLB
- Subpages for scores, standings, stats, playoffs (varies by league)
- Article detail route: `app/article/[id]/page.tsx`
- Community page with tabbed interactive modules
- Fantasy page with recommendation filters and helper cards
- NBA playoff bracket and NFL playoff bracket UI components
- Internal API routes for NBA standings and team lists
- Redis-backed cache layer for expensive/external fetches
- Prisma schema and seed script for team datasets

## 4. Architecture and Data Flow

Primary runtime flow for live NBA standings:

1. Frontend page requests `GET /api/standings?league=NBA`
2. Route handler (`app/api/standings/route.ts`) calls `getCachedNBAStandings()`
3. Cache helper checks Redis for key `NBA:standings:current`
4. On cache miss, app fetches RapidAPI standings in `lib/sportsApi.ts`
5. Response is cached with TTL and returned to frontend
6. Frontend maps API structure into local UI types for standings tables

NBA logos flow is similar via `GET /api/teams` and cache key `NBA:teams:list`.

Fallback strategy in UI:

- If logo requests fail, components use `TeamBadge` fallback avatars.
- Many non-NBA pages currently rely on `lib/mock-data.ts`.

## 5. Project Structure

Top-level folders and purpose:

- `app/`: Next.js App Router pages and API route handlers
- `components/`: Reusable UI and feature components
- `lib/`: Shared utilities, mock datasets, external fetch functions, cache helpers
- `services/`: Redis client and cache service wrapper
- `prisma/`: Prisma schema, migrations, seed script
- `scripts/`: Developer test scripts for external API and Redis
- `public/`: Static assets/logos/images
- `styles/`: Additional global style resources

Important note:

- There is also a nested `theAthleteInsider/` directory containing another scaffold and older README. The active app described here is the repository root project.

## 6. Routes and Pages

### Core pages

- `/` Home (`app/page.tsx`)
- `/article/[id]` Article details from mock article collection
- `/community` Community experience (trivia, debates, pulse, leaderboard)
- `/fantasy` Fantasy recommendations and analysis widgets
- `/betting` Betting page
- `/scores` Global scores page

### League pages

- `/nba`, `/nfl`, `/mlb`
- NBA subpages:
	- `/nba/scores`
	- `/nba/standings`
	- `/nba/stats`
	- `/nba/playoffs`
- NFL subpages:
	- `/nfl/scores`
	- `/nfl/standings`
	- `/nfl/stats`
	- `/nfl/playoffs`
- MLB subpages:
	- `/mlb/scores`
	- `/mlb/standings`
	- `/mlb/stats`

Behavior snapshot:

- NBA standings/scores/stats pages call internal API routes for team logos and standings.
- NFL and MLB experiences are currently mostly mock-data driven in UI.

## 7. API Endpoints

All endpoints are under `app/api`.

### `GET /api/standings?league=NBA`

- File: `app/api/standings/route.ts`
- Returns: `{ teams: [...] }`
- Supported now: `NBA` only
- Invalid league returns `400` with error message

### `GET /api/teams`

- File: `app/api/teams/route.ts`
- Returns: `{ teams: [...] }` (NBA team list + logos)
- Data is cached via Redis-backed helper

### `GET /api/debug-standings`

- File: `app/api/debug-standings/route.ts`
- Debug endpoint for RapidAPI env checks and response shape introspection

### `GET /api/test-cache`

- File: `app/api/test-cache/route.ts`
- Demonstrates cache behavior with synthetic expensive data fetch

## 8. Data Sources

### External (live)

- RapidAPI NBA endpoints in `lib/sportsApi.ts`:
	- `nbastandings`
	- `nbateamlist`

### Internal/static

- `lib/mock-data.ts` provides articles, games, standings, polls, fantasy data, stat leaders
- `lib/nba-playoff-data.ts` and `lib/nfl-playoff-data.ts` provide bracket structures
- `lib/team-colors.ts` provides color mappings used by badges/components

## 9. Caching Strategy (Redis)

Redis integration is centralized in:

- `services/cacheService.ts`
- `lib/cache-helper.ts`
- `lib/redis.ts`

Pattern:

- `withCache`/`getCached` wrappers attempt cache read first
- On miss, they call fetchers and set TTL-based cache entries
- On cache errors, code falls back to fresh fetch (graceful degradation)

Current notable TTLs:

- Live scores: 30s
- Standings: 1h
- Player stats: 30m
- Schedule: 2h
- NBA team list cache in `cachedSportsData`: 24h

## 10. Database and Prisma

Prisma schema is in `prisma/schema.prisma` with generated client output at `lib/generated/prisma`.

Current models include:

- `NBAConferenceStandings`
- `NBAPowerRankings`
- `NBATeam`
- `MLBTeam`
- `NFLTeam`

Migrations live in `prisma/migrations/`.

Seed script:

- `prisma/seed.ts` populates NBA, MLB, and NFL team metadata and branding fields.

## 11. Environment Variables

Create `.env.local` (for Next.js runtime) and ensure DB vars are available where Prisma runs.

Required for NBA API routes:

- `RAPIDAPI_KEY`
- `RAPIDAPI_HOST_NBA`

Required for Prisma/database:

- `DATABASE_URL`

Redis options (choose URL or host/port mode):

- `REDIS_URL`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`
- `REDIS_TLS` (`true` or `false`)

Example:

```bash
RAPIDAPI_KEY=your_key_here
RAPIDAPI_HOST_NBA=example-rapidapi-host
DATABASE_URL=postgresql://user:password@localhost:5432/athlete_insider

# Redis (option A)
REDIS_URL=redis://localhost:6379

# Redis (option B)
# REDIS_HOST=127.0.0.1
# REDIS_PORT=6379
# REDIS_PASSWORD=
# REDIS_TLS=false
```

## 12. Local Development Setup

### Prerequisites

- Node.js `20+` recommended
- `pnpm` (preferred, lockfile is `pnpm-lock.yaml`)
- PostgreSQL
- Redis

### Install and run

```bash
pnpm install
pnpm dev
```

App runs at `http://localhost:3000` by default.

### Database workflow

```bash
# Create/apply migrations in development
pnpm prisma migrate dev

# Generate Prisma client
pnpm prisma generate

# Seed database
pnpm db:seed
```

If `pnpm prisma ...` is unavailable in your shell, use:

```bash
npx prisma migrate dev
npx prisma generate
```

## 13. Scripts

From `package.json`:

- `pnpm dev` - Start Next.js dev server
- `pnpm build` - Production build
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:seed` - Run Prisma seed script
- `pnpm test:redis` - Redis connectivity and helper validation
- `pnpm test:nba-api` - RapidAPI NBA connectivity and response sanity checks

## 14. Deployment Notes

- `next.config.mjs` currently sets `typescript.ignoreBuildErrors = true`.
- This allows builds to pass with TypeScript errors, which is convenient during rapid iteration but risky for production quality.
- Consider turning that off in production CI once the codebase stabilizes.

Also configured:

- `images.unoptimized = true` (static image optimization disabled)
- Turbopack root uses `process.cwd()`

## 15. Current Gaps and Roadmap

Current implementation gaps:

- Live APIs are mainly wired for NBA data.
- Some pages still consume mock datasets only.
- API route for standings has placeholder comments for NFL/MLB expansion.
- The `Quizzes` model in Prisma schema is currently empty and should be completed or removed.

Suggested next steps:

1. Add NFL/MLB live standings/scores API integrations.
2. Persist article/community/fantasy modules in database models.
3. Add auth/user profiles if community personalization is planned.
4. Add integration tests for API routes and cache behavior.
5. Tighten production build gates (TS and lint in CI).

## 16. Troubleshooting

### API routes return 500

- Verify `RAPIDAPI_KEY` and `RAPIDAPI_HOST_NBA`.
- Call `GET /api/debug-standings` for quick env/status diagnostics.

### Redis errors or no cache effect

- Confirm Redis is running and reachable.
- Run `pnpm test:redis`.
- Verify either `REDIS_URL` or host/port vars are correctly set.

### Standings UI shows fallback/empty states

- Check browser/network call to `/api/standings?league=NBA`.
- Confirm API response contains `teams` array.

### Prisma seed/migration issues

- Confirm `DATABASE_URL` is valid.
- Ensure database exists and user has create/alter permissions.

---

For implementation details, start with:

- `app/nba/standings/page.tsx`
- `app/api/standings/route.ts`
- `lib/sportsApi.ts`
- `lib/cache-helper.ts`
- `services/cacheService.ts`
- `prisma/schema.prisma`
