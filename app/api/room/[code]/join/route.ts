import { NextRequest, NextResponse } from "next/server"
import { getGuestIdFromRequest } from "@/lib/identity"
import { redis } from "@/lib/redis"
import { joinRoom } from "@/lib/room"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const guestId = getGuestIdFromRequest(req)
  if (!guestId) return NextResponse.json({ error: "No identity" }, { status: 401 })

  const raw = await redis.get(`guest:${guestId}`)
  if (!raw) return NextResponse.json({ error: "Guest not found" }, { status: 401 })
  const guest = JSON.parse(raw)

  const result = await joinRoom(code.toUpperCase(), {
    guest_id: guestId,
    display_name: guest.display_name,
    avatar_color: guest.avatar_color,
  })

  if ("error" in result) {
    const status = result.error === "not_found" ? 404
      : result.error === "full" ? 403
      : result.error === "duplicate_name" ? 409
      : 410
    return NextResponse.json({ error: result.error }, { status })
  }

  return NextResponse.json({ room: result.room, players: result.players })
}
