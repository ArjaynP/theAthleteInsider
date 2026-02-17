-- CreateTable
CREATE TABLE "MLBTeam" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "league" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MLBTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NFLTeam" (
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

    CONSTRAINT "NFLTeam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MLBTeam_abbreviation_key" ON "MLBTeam"("abbreviation");

-- CreateIndex
CREATE INDEX "MLBTeam_league_idx" ON "MLBTeam"("league");

-- CreateIndex
CREATE INDEX "MLBTeam_division_idx" ON "MLBTeam"("division");

-- CreateIndex
CREATE INDEX "MLBTeam_abbreviation_idx" ON "MLBTeam"("abbreviation");

-- CreateIndex
CREATE UNIQUE INDEX "NFLTeam_abbreviation_key" ON "NFLTeam"("abbreviation");

-- CreateIndex
CREATE INDEX "NFLTeam_conference_idx" ON "NFLTeam"("conference");

-- CreateIndex
CREATE INDEX "NFLTeam_division_idx" ON "NFLTeam"("division");

-- CreateIndex
CREATE INDEX "NFLTeam_abbreviation_idx" ON "NFLTeam"("abbreviation");
