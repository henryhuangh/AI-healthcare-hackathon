import { NextRequest, NextResponse } from "next/server"
import { getGuestIdFromRequest } from "@/lib/identity"
import { getTopEntries, getPlayerRank, msUntilNextMonday, weekKey } from "@/lib/leaderboard"
import type { GameMode } from "@/lib/types"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = (searchParams.get("mode") ?? "competitive") as Exclude<GameMode, "practice">

  if (!["competitive", "blitz"].includes(mode)) {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 })
  }

  const guestId = getGuestIdFromRequest(req)

  const [entries, playerRank] = await Promise.all([
    getTopEntries(mode, 50),
    guestId ? getPlayerRank(mode, guestId) : null,
  ])

  return NextResponse.json({
    mode,
    weekKey: weekKey(),
    entries,
    playerRank,
    msUntilReset: msUntilNextMonday(),
  })
}
