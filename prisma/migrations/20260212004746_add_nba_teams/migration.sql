-- CreateTable
CREATE TABLE "NBAConferenceStandings" (
    "id" SERIAL NOT NULL,
    "team" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "conference" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "wins" INTEGER NOT NULL,
    "losses" INTEGER NOT NULL,
    "pct" TEXT NOT NULL,
    "gb" TEXT NOT NULL,
    "streak" TEXT,

    CONSTRAINT "NBAConferenceStandings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NBAPowerRankings" (
    "id" SERIAL NOT NULL,
    "rank" INTEGER NOT NULL,
    "team" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "record" TEXT NOT NULL,
    "lastWeek" INTEGER NOT NULL,
    "trend" TEXT NOT NULL,
    "summary" TEXT NOT NULL,

    CONSTRAINT "NBAPowerRankings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NBATeam" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "conference" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NBATeam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NBAConferenceStandings_abbreviation_key" ON "NBAConferenceStandings"("abbreviation");

-- CreateIndex
CREATE INDEX "NBAConferenceStandings_conference_idx" ON "NBAConferenceStandings"("conference");

-- CreateIndex
CREATE INDEX "NBAConferenceStandings_division_idx" ON "NBAConferenceStandings"("division");

-- CreateIndex
CREATE UNIQUE INDEX "NBAPowerRankings_abbreviation_key" ON "NBAPowerRankings"("abbreviation");

-- CreateIndex
CREATE INDEX "NBAPowerRankings_rank_idx" ON "NBAPowerRankings"("rank");

-- CreateIndex
CREATE UNIQUE INDEX "NBATeam_abbreviation_key" ON "NBATeam"("abbreviation");

-- CreateIndex
CREATE INDEX "NBATeam_conference_idx" ON "NBATeam"("conference");

-- CreateIndex
CREATE INDEX "NBATeam_division_idx" ON "NBATeam"("division");

-- CreateIndex
CREATE INDEX "NBATeam_abbreviation_idx" ON "NBATeam"("abbreviation");
