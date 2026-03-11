"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function JoinRoomPage() {
  const router = useRouter()
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  function handleChange(index: number, value: string) {
    const char = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(-1)
    const newCode = [...code]
    newCode[index] = char
    setCode(newCode)
    setError("")
    if (char && index < 5) {
      inputs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6)
    const newCode = Array(6).fill("")
    for (let i = 0; i < pasted.length; i++) newCode[i] = pasted[i]
    setCode(newCode)
    inputs.current[Math.min(pasted.length, 5)]?.focus()
  }

  async function handleJoin() {
    const joinCode = code.join("")
    if (joinCode.length < 6) { setError("Enter the full 6-character code"); return }
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/room/${joinCode}/join`, { method: "POST" })
      if (!res.ok) {
        const data = await res.json()
        const msgs: Record<string, string> = {
          not_found: "Room not found — check the code",
          already_started: "This room has already started",
          full: "This room is full (50 players max)",
          duplicate_name: "Your display name is already taken in this room. Go back to change it.",
        }
        setError(msgs[data.error] ?? data.error)
        return
      }
      router.push(`/room/${joinCode}`)
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-sm mx-auto">
      <header className="mb-8">
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="mb-4 -ml-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Join Room</h1>
        <p className="text-muted-foreground text-sm mt-1">Enter the 6-character room code</p>
      </header>

      {/* Code input boxes */}
      <div className="flex gap-2 justify-center mb-6">
        {code.map((char, i) => (
          <input
            key={i}
            ref={(el) => { inputs.current[i] = el }}
            type="text"
            inputMode="text"
            maxLength={1}
            value={char}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className="w-12 h-14 text-center text-xl font-bold border-2 border-border rounded-xl bg-background focus:border-primary focus:outline-none transition-colors uppercase"
          />
        ))}
      </div>

      {error && <p className="text-sm text-destructive text-center mb-4">{error}</p>}

      <Button
        onClick={handleJoin}
        disabled={loading || code.join("").length < 6}
        className="w-full h-12"
        size="lg"
      >
        {loading ? "Joining…" : "Join Room"}
      </Button>

      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground mb-2">Want to host instead?</p>
        <Button variant="outline" onClick={() => router.push("/room/create")}>Create a Room</Button>
      </div>
    </div>
  )
}
