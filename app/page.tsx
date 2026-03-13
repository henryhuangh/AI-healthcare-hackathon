"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AVATAR_COLORS } from "@/lib/identity"

export default function LandingPage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState("")
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [roomCodeFromQr, setRoomCodeFromQr] = useState<string | null>(null)
  const joinRoomPath = roomCodeFromQr?.length === 6 ? `/room/${roomCodeFromQr}` : null

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const joinCode = params
      .get("joinCode")
      ?.toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6)
    const reason = params.get("error")

    setRoomCodeFromQr(joinCode ?? null)
    if (reason === "duplicate_name") {
      setError("That display name is already taken in this room. Choose a different name to join.")
    }
  }, [])

  async function handleEnter() {
    const trimmed = displayName.trim()
    if (trimmed.length < 2 || trimmed.length > 24) {
      setError("Name must be 2–24 characters")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/identity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: trimmed, avatarColor }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Something went wrong")
        return
      }
      const data = await res.json()
      // Store for client-side use
      localStorage.setItem("rxarena_identity", JSON.stringify({
        guestId: data.guestId,
        displayName: data.displayName,
        avatarColor: data.avatarColor,
      }))
      router.push(joinRoomPath ?? "/dashboard")
    } catch {
      setError("Network error — please try again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <span className="text-primary-foreground font-black text-2xl tracking-tight">RX</span>
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">RXArena</h1>
          <p className="text-muted-foreground text-sm mt-1">Clinical diagnosis. Real competition.</p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {joinRoomPath && (
            <p className="text-xs text-center text-muted-foreground">
              You will join room <span className="font-semibold text-foreground">{roomCodeFromQr}</span> after entering.
            </p>
          )}
          {/* Display name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Your name</label>
            <Input
              placeholder="e.g. DrSarah"
              value={displayName}
              onChange={(e) => { setDisplayName(e.target.value); setError("") }}
              onKeyDown={(e) => e.key === "Enter" && handleEnter()}
              maxLength={24}
              autoFocus
              className="h-12 text-base"
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          {/* Avatar color picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Pick a color</label>
            <div className="flex gap-2 flex-wrap">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setAvatarColor(color)}
                  className="w-9 h-9 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none"
                  style={{
                    backgroundColor: color,
                    borderColor: avatarColor === color ? "white" : "transparent",
                    boxShadow: avatarColor === color ? `0 0 0 2px ${color}` : "none",
                  }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0"
              style={{ backgroundColor: avatarColor }}
            >
              {displayName.trim().charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{displayName.trim() || "Your name here"}</p>
              <p className="text-xs text-muted-foreground">Guest player</p>
            </div>
          </div>

          <Button
            onClick={handleEnter}
            disabled={loading || displayName.trim().length < 2}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {loading ? "Entering…" : "Enter the Arena"}
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          No account needed. Your progress is saved to this browser.
        </p>
      </div>
    </div>
  )
}
