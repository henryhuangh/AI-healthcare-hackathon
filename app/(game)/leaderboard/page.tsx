"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Crown, Medal, RefreshCw } from "lucide-react"
import type { LeaderboardEntry } from "@/lib/types"

interface LeaderboardData {
  mode: string
  weekKey: string
  entries: LeaderboardEntry[]
  playerRank: { rank: number; score: number } | null
  msUntilReset: number
}

function formatCountdown(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const days = Math.floor(totalSec / 86400)
  const hours = Math.floor((totalSec % 86400) / 3600)
  const mins = Math.floor((totalSec % 3600) / 60)
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m`
}

function Avatar({ color, name, size = "md" }: { color: string; name: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg" }
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white shrink-0`}
      style={{ backgroundColor: color }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export default function LeaderboardPage() {
  const [mode, setMode] = useState<"competitive" | "blitz">("competitive")
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(0)

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/leaderboard?mode=${mode}`)
      if (res.ok) {
        const json = await res.json() as LeaderboardData
        setData(json)
        setCountdown(json.msUntilReset)
      }
    } finally {
      setLoading(false)
    }
  }, [mode])

  useEffect(() => { fetchLeaderboard() }, [fetchLeaderboard])

  // Countdown tick
  useEffect(() => {
    if (!countdown) return
    const interval = setInterval(() => setCountdown((c) => Math.max(0, c - 1000)), 1000)
    return () => clearInterval(interval)
  }, [countdown])

  const top3 = data?.entries.slice(0, 3) ?? []
  const rest = data?.entries.slice(3) ?? []

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
          <Button variant="ghost" size="icon" onClick={fetchLeaderboard} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          Resets in <span className="font-medium text-foreground">{formatCountdown(countdown)}</span>
          {data?.weekKey && <span className="ml-2 text-xs opacity-60">({data.weekKey})</span>}
        </p>
      </header>

      {/* Mode tabs */}
      <div className="flex gap-2 mb-6">
        {(["competitive", "blitz"] as const).map((m) => (
          <Button
            key={m}
            variant={mode === m ? "default" : "outline"}
            size="sm"
            onClick={() => setMode(m)}
            className="flex-1 capitalize"
          >
            {m}
          </Button>
        ))}
      </div>

      {loading && !data && (
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Loading…</p>
        </div>
      )}

      {data && data.entries.length === 0 && (
        <Card className="p-8 border-0 shadow-sm text-center">
          <Trophy className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-1">No scores yet</h3>
          <p className="text-sm text-muted-foreground">Be the first to play {mode} this week!</p>
          <Button className="mt-4" onClick={() => window.location.href = "/play"}>Play Now</Button>
        </Card>
      )}

      {data && data.entries.length > 0 && (
        <>
          {/* Top 3 podium */}
          {top3.length >= 3 && (
            <div className="flex items-end justify-center gap-3 mb-8">
              {/* 2nd */}
              <div className="flex-1 max-w-[110px] text-center">
                <Avatar color={top3[1].avatar_color} name={top3[1].display_name} size="md" />
                <div className="mt-2 p-3 rounded-xl bg-muted/60">
                  <Medal className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs font-semibold text-foreground truncate">{top3[1].display_name}</p>
                  <p className="text-xs text-muted-foreground">{top3[1].score.toLocaleString()}</p>
                </div>
              </div>

              {/* 1st */}
              <div className="flex-1 max-w-[130px] text-center">
                <Avatar color={top3[0].avatar_color} name={top3[0].display_name} size="lg" />
                <div className="mt-2 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <Crown className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                  <p className="text-sm font-bold text-foreground truncate">{top3[0].display_name}</p>
                  <p className="text-xs text-muted-foreground">{top3[0].score.toLocaleString()}</p>
                </div>
              </div>

              {/* 3rd */}
              <div className="flex-1 max-w-[110px] text-center">
                <Avatar color={top3[2].avatar_color} name={top3[2].display_name} size="md" />
                <div className="mt-2 p-3 rounded-xl bg-muted/60">
                  <Trophy className="w-4 h-4 text-amber-600/50 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-foreground truncate">{top3[2].display_name}</p>
                  <p className="text-xs text-muted-foreground">{top3[2].score.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Rest of list */}
          {rest.length > 0 && (
            <div className="space-y-2 mb-4">
              {rest.map((entry) => (
                <Card key={entry.guest_id} className="p-3 border-0 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-center text-sm font-bold text-muted-foreground">
                      {entry.rank}
                    </span>
                    <Avatar color={entry.avatar_color} name={entry.display_name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{entry.display_name}</p>
                    </div>
                    <span className="font-semibold text-foreground text-sm">
                      {entry.score.toLocaleString()}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Player's own rank */}
          {data.playerRank && (
            <Card className="p-4 border-2 border-primary shadow-sm sticky bottom-20 md:bottom-4">
              <div className="flex items-center gap-3">
                <span className="w-8 text-center font-bold text-primary text-sm">
                  #{data.playerRank.rank}
                </span>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  You
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Your rank</p>
                </div>
                <span className="font-semibold text-primary">{data.playerRank.score.toLocaleString()}</span>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Identity notice */}
      <p className="text-center text-xs text-muted-foreground mt-6">
        Leaderboard entries are tied to this browser. Clearing cookies resets your identity.
      </p>
    </div>
  )
}
