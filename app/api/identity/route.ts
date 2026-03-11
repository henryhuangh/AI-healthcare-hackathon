import { NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import {
  createGuestId,
  getGuestIdFromRequest,
  buildSetCookieHeader,
  isValidDisplayName,
  isValidAvatarColor,
  AVATAR_COLORS,
} from "@/lib/identity"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { displayName, avatarColor } = body as { displayName?: string; avatarColor?: string }

  if (!displayName || !isValidDisplayName(displayName)) {
    return NextResponse.json({ error: "Display name must be 2–24 characters" }, { status: 400 })
  }

  const color = avatarColor && isValidAvatarColor(avatarColor) ? avatarColor : AVATAR_COLORS[0]
  const trimmed = displayName.trim()

  // Reuse existing guestId if already set
  let guestId = getGuestIdFromRequest(req)
  if (!guestId) {
    guestId = createGuestId()
  }

  // Store in Redis (7 day TTL — refreshed on each login)
  await redis.set(
    `guest:${guestId}`,
    JSON.stringify({ display_name: trimmed, avatar_color: color, created_at: Date.now() }),
    "EX",
    7 * 24 * 60 * 60
  )

  const res = NextResponse.json({ guestId, displayName: trimmed, avatarColor: color })
  res.headers.set("Set-Cookie", buildSetCookieHeader(guestId))
  return res
}

export async function GET(req: NextRequest) {
  const guestId = getGuestIdFromRequest(req)
  if (!guestId) return NextResponse.json({ error: "No identity" }, { status: 401 })

  const raw = await redis.get(`guest:${guestId}`)
  if (!raw) return NextResponse.json({ error: "Guest not found" }, { status: 404 })

  const data = JSON.parse(raw)
  return NextResponse.json({ guestId, ...data })
}
