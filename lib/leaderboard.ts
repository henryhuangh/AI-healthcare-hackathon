import { redis } from "@/lib/redis"
import type { GameMode, LeaderboardEntry } from "@/lib/types"

const LEADERBOARD_TTL_SECONDS = 8 * 24 * 60 * 60 // 8 days

/**
 * Returns ISO week key like "2026-W11".
 * Week starts on Monday 00:00 UTC.
 */
export function weekKey(): string {
  const now = new Date()
  // Get Thursday of the current week (ISO week standard)
  const thursday = new Date(now)
  const day = now.getUTCDay() // 0=Sun, 1=Mon ... 6=Sat
  const daysToThursday = day === 0 ? 3 : 4 - day
  thursday.setUTCDate(now.getUTCDate() + daysToThursday)
  const year = thursday.getUTCFullYear()
  // Week number
  const firstThursday = new Date(Date.UTC(year, 0, 4))
  const firstDay = firstThursday.getUTCDay()
  const firstMonday = new Date(firstThursday)
  firstMonday.setUTCDate(firstThursday.getUTCDate() - (firstDay === 0 ? 6 : firstDay - 1))
  const weekNum = Math.floor((thursday.getTime() - firstMonday.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1
  return `${year}-W${String(weekNum).padStart(2, "0")}`
}

export function msUntilNextMonday(): number {
  const now = new Date()
  const day = now.getUTCDay() // 0=Sun
  const daysUntilMonday = day === 0 ? 1 : 8 - day
  const nextMonday = new Date(now)
  nextMonday.setUTCDate(now.getUTCDate() + daysUntilMonday)
  nextMonday.setUTCHours(0, 0, 0, 0)
  return nextMonday.getTime() - now.getTime()
}

function scoreKey(mode: Exclude<GameMode, "practice">): string {
  return `leaderboard:${mode}:${weekKey()}`
}

function namesKey(): string {
  return `leaderboard:names:${weekKey()}`
}

function avatarKey(): string {
  return `leaderboard:avatars:${weekKey()}`
}

/**
 * Update a player's best score for the current week.
 * Only replaces if the new score is higher.
 */
export async function updateBestScore(
  mode: Exclude<GameMode, "practice">,
  guestId: string,
  displayName: string,
  avatarColor: string,
  score: number
): Promise<void> {
  const sk = scoreKey(mode)
  const nk = namesKey()
  const ak = avatarKey()

  // ZADD with GT (greater-than) — only updates if new score is higher
  // Redis ZADD GT NX doesn't exist; we use a Lua script for atomic best-score update
  const lua = `
    local sk = KEYS[1]
    local guestId = ARGV[1]
    local newScore = tonumber(ARGV[2])
    local current = redis.call('ZSCORE', sk, guestId)
    if current == false or tonumber(current) < newScore then
      redis.call('ZADD', sk, newScore, guestId)
      return 1
    end
    return 0
  `
  await redis.eval(lua, 1, sk, guestId, score)
  await redis.expire(sk, LEADERBOARD_TTL_SECONDS)

  // Store display name and avatar for rendering
  await redis.hset(nk, guestId, displayName)
  await redis.hset(ak, guestId, avatarColor)
  await redis.expire(nk, LEADERBOARD_TTL_SECONDS)
  await redis.expire(ak, LEADERBOARD_TTL_SECONDS)
}

export async function getTopEntries(
  mode: Exclude<GameMode, "practice">,
  limit = 50
): Promise<LeaderboardEntry[]> {
  const sk = scoreKey(mode)
  const nk = namesKey()
  const ak = avatarKey()

  // ZREVRANGE with scores, highest first
  const raw = await redis.zrevrange(sk, 0, limit - 1, "WITHSCORES")
  if (raw.length === 0) return []

  const guestIds: string[] = []
  const scores: number[] = []
  for (let i = 0; i < raw.length; i += 2) {
    guestIds.push(raw[i])
    scores.push(Number(raw[i + 1]))
  }

  const names = await redis.hmget(nk, ...guestIds)
  const avatars = await redis.hmget(ak, ...guestIds)

  return guestIds.map((guestId, i) => ({
    rank: i + 1,
    guest_id: guestId,
    display_name: names[i] ?? "Unknown",
    avatar_color: avatars[i] ?? "#6366f1",
    score: scores[i],
  }))
}

export async function getPlayerRank(
  mode: Exclude<GameMode, "practice">,
  guestId: string
): Promise<{ rank: number; score: number } | null> {
  const sk = scoreKey(mode)
  const [rank, score] = await Promise.all([
    redis.zrevrank(sk, guestId),
    redis.zscore(sk, guestId),
  ])
  if (rank === null || score === null) return null
  return { rank: rank + 1, score: Number(score) }
}
