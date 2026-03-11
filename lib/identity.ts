import { v4 as uuidv4 } from "uuid"
import type { NextRequest } from "next/server"

export const COOKIE_NAME = "rxarena_guest"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export interface GuestIdentity {
  guestId: string
  displayName: string
  avatarColor: string
}

export function createGuestId(): string {
  return uuidv4()
}

export function getGuestIdFromRequest(req: NextRequest): string | null {
  return req.cookies.get(COOKIE_NAME)?.value ?? null
}

export function buildSetCookieHeader(guestId: string): string {
  return `${COOKIE_NAME}=${guestId}; Path=/; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; SameSite=Lax`
}

export const AVATAR_COLORS = [
  "#6366f1", // indigo
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#ef4444", // red
  "#8b5cf6", // violet
  "#14b8a6", // teal
]

export function isValidAvatarColor(color: string): boolean {
  return AVATAR_COLORS.includes(color)
}

export function isValidDisplayName(name: string): boolean {
  const trimmed = name.trim()
  return trimmed.length >= 2 && trimmed.length <= 24
}
