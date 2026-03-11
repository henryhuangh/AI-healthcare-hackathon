import { NextRequest, NextResponse } from "next/server"
import { getGuestIdFromRequest } from "@/lib/identity"
import { startGame } from "@/lib/room"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const guestId = getGuestIdFromRequest(req)
  if (!guestId) return NextResponse.json({ error: "No identity" }, { status: 401 })

  const room = await startGame(code.toUpperCase(), guestId)
  if (!room) return NextResponse.json({ error: "Cannot start: not host, already started, or room not found" }, { status: 403 })

  return NextResponse.json({ ok: true, room })
}
