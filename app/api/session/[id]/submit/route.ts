import { NextRequest, NextResponse } from "next/server"
import { getGuestIdFromRequest } from "@/lib/identity"
import { getSession, submitAnswer } from "@/lib/session"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const guestId = getGuestIdFromRequest(req)
  if (!guestId) return NextResponse.json({ error: "No identity" }, { status: 401 })

  const session = await getSession(id)
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 })
  if (session.guest_id !== guestId) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const body = await req.json().catch(() => ({}))
  const { caseId, answer, responseTimeMs } = body as {
    caseId?: string
    answer?: number
    responseTimeMs?: number
  }

  if (!caseId || answer === undefined || !responseTimeMs) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  // Check competitive time limit
  if (session.mode === "competitive" && session.time_limit_ms) {
    const elapsed = Date.now() - session.started_at
    if (elapsed > session.time_limit_ms) {
      return NextResponse.json({ error: "Time expired" }, { status: 410 })
    }
  }

  const result = await submitAnswer(id, caseId, answer, responseTimeMs)
  if (!result) return NextResponse.json({ error: "Already answered or invalid case" }, { status: 409 })

  // Only reveal explanation in practice mode
  const isPractice = session.mode === "practice"

  return NextResponse.json({
    isCorrect: result.isCorrect,
    scoreAwarded: result.scoreAwarded,
    correctAnswer: isPractice ? result.correctAnswer : null,
    explanation: isPractice ? result.explanation : null,
  })
}
