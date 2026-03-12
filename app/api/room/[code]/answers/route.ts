import { NextRequest, NextResponse } from "next/server"
import { getCaseById } from "@/lib/cases"
import { getRoom, getRoomCaseIds } from "@/lib/room"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const room = await getRoom(code.toUpperCase())
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 })

  const caseIds = await getRoomCaseIds(room.id)
  const answerKey = caseIds
    .map((caseId) => getCaseById(caseId))
    .filter((c): c is NonNullable<ReturnType<typeof getCaseById>> => Boolean(c))
    .map((c, index) => ({
      index: index + 1,
      question: `${c.patient_persona.age}yo ${c.patient_persona.sex} - ${c.patient_persona.chief_complaint}`,
      correctOption: c.options[c.correct_answer] ?? "Unknown",
      explanation: c.explanation,
    }))

  return NextResponse.json({ answerKey })
}
