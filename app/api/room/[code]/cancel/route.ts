import { NextRequest, NextResponse } from "next/server"
import { getGuestIdFromRequest } from "@/lib/identity"
import { getRoom, cancelRoom } from "@/lib/room"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const guestId = getGuestIdFromRequest(req)
  if (!guestId) return NextResponse.json({ error: "No identity" }, { status: 401 })

  const room = await getRoom(code.toUpperCase())
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 })
  if (room.host_guest_id !== guestId) return NextResponse.json({ error: "Not the host" }, { status: 403 })
  if (room.status !== "lobby") return NextResponse.json({ error: "Already started" }, { status: 410 })

  await cancelRoom(room.id)
  return NextResponse.json({ ok: true })
}
