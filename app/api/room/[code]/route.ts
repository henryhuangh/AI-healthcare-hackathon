import { NextRequest, NextResponse } from "next/server"
import { getRoom, getRoomPlayers } from "@/lib/room"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const room = await getRoom(code.toUpperCase())
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 })

  const players = await getRoomPlayers(room.id)
  return NextResponse.json({ room, players })
}
