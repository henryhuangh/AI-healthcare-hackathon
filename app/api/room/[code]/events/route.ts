import { NextRequest } from "next/server"
import { getGuestIdFromRequest } from "@/lib/identity"
import { getRoom } from "@/lib/room"
import { createSSEStream } from "@/lib/sse"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const guestId = getGuestIdFromRequest(req)
  if (!guestId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const room = await getRoom(code.toUpperCase())
  if (!room) {
    return new Response("Room not found", { status: 404 })
  }

  const stream = createSSEStream(room.id)

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
