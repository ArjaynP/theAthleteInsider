import { NextResponse } from "next/server";
import { getCachedNBATeamsList } from "@/lib/cachedSportsData";

export async function GET() {
  try {
    const teams = await getCachedNBATeamsList();
    return NextResponse.json({ teams });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch NBA teams",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}