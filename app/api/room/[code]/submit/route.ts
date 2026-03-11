import { NextRequest, NextResponse } from "next/server"
import { getGuestIdFromRequest } from "@/lib/identity"
import { submitRoomAnswer } from "@/lib/room"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const guestId = getGuestIdFromRequest(req)
  if (!guestId) return NextResponse.json({ error: "No identity" }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { questionIndex, answer, responseTimeMs } = body as {
    questionIndex?: number
    answer?: number
    responseTimeMs?: number
  }

  if (questionIndex === undefined || answer === undefined || !responseTimeMs) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const result = await submitRoomAnswer(code.toUpperCase(), guestId, questionIndex, answer, responseTimeMs)
  if (!result) return NextResponse.json({ error: "Could not submit — already answered or time expired" }, { status: 409 })

  return NextResponse.json(result)
}
