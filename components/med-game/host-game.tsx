"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft,
  Swords,
  Zap,
  Copy,
  Check,
  Users,
  Crown,
  Play
} from "lucide-react"
import type { GameMode, Difficulty } from "@/app/page"
import QRCode from "react-qr-code"

interface HostGameProps {
  onStartHostedGame: (mode: GameMode, difficulty: Difficulty) => void
  onBack: () => void
}

type HostStep = "select-mode" | "select-difficulty" | "lobby"

interface Player {
  id: string
  name: string
  avatar: string
  isHost: boolean
}

const gameModes = [
  {
    id: "competitive" as GameMode,
    name: "Competitive",
    description: "Race against each other for the highest score",
    icon: Swords,
    color: "bg-primary text-primary-foreground"
  },
  {
    id: "blitz" as GameMode,
    name: "Blitz",
    description: "Fast-paced quick fire rounds",
    icon: Zap,
    color: "bg-chart-3 text-foreground"
  }
]

const difficulties = [
  { id: "easy" as Difficulty, name: "Easy", description: "Foundational cases", multiplier: "1x" },
  { id: "standard" as Difficulty, name: "Standard", description: "Clinical reasoning", multiplier: "2x" },
  { id: "hard" as Difficulty, name: "Hard", description: "Complex diagnostics", multiplier: "4x" }
]

export function HostGame({ onStartHostedGame, onBack }: HostGameProps) {
  const [step, setStep] = useState<HostStep>("select-mode")
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null)
  const [copied, setCopied] = useState(false)
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "Dr. Sarah", avatar: "S", isHost: true }
  ])

  // Generate a random 6-character join code
  const [joinCode] = useState(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  })

  const joinUrl = `medgame.app/join/${joinCode}`

  // Simulate players joining
  useEffect(() => {
    if (step !== "lobby") return

    const mockPlayers = [
      { id: "2", name: "Dr. James", avatar: "J", isHost: false },
      { id: "3", name: "Dr. Chen", avatar: "C", isHost: false },
      { id: "4", name: "Dr. Patel", avatar: "P", isHost: false }
    ]

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < mockPlayers.length) {
        const playerToAdd = mockPlayers[currentIndex]
        setPlayers(prev => [...prev, playerToAdd])
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [step])

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(joinCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSelectMode = (mode: GameMode) => {
    setSelectedMode(mode)
    setStep("select-difficulty")
  }

  const handleSelectDifficulty = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty)
    setStep("lobby")
  }

  const handleBack = () => {
    if (step === "lobby") {
      setStep("select-difficulty")
    } else if (step === "select-difficulty") {
      setStep("select-mode")
      setSelectedMode(null)
    } else {
      onBack()
    }
  }

  const handleStartGame = () => {
    if (selectedMode && selectedDifficulty) {
      onStartHostedGame(selectedMode, selectedDifficulty)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          {step === "select-mode" && (
            <div>
              <h1 className="text-2xl font-bold text-foreground">Host Game</h1>
              <p className="text-muted-foreground text-sm mt-1">Select game mode</p>
            </div>
          )}
          {step === "select-difficulty" && selectedMode && (
            <div>
              <h1 className="text-2xl font-bold text-foreground capitalize">{selectedMode} Mode</h1>
              <p className="text-muted-foreground text-sm mt-1">Select difficulty</p>
            </div>
          )}
          {step === "lobby" && (
            <div>
              <h1 className="text-2xl font-bold text-foreground">Game Lobby</h1>
              <p className="text-muted-foreground text-sm mt-1">Waiting for players</p>
            </div>
          )}
        </header>

        {/* Mode Selection */}
        {step === "select-mode" && (
          <div className="space-y-3">
            {gameModes.map((mode) => {
              const Icon = mode.icon
              return (
                <Card
                  key={mode.id}
                  className="p-4 border-0 shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                  onClick={() => handleSelectMode(mode.id)}
                >
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl ${mode.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{mode.name}</h3>
                      <p className="text-sm text-muted-foreground">{mode.description}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {/* Difficulty Selection */}
        {step === "select-difficulty" && (
          <div className="space-y-3">
            {difficulties.map((difficulty) => (
              <Card
                key={difficulty.id}
                className="p-4 border-0 shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                onClick={() => handleSelectDifficulty(difficulty.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{difficulty.name}</h3>
                    <p className="text-sm text-muted-foreground">{difficulty.description}</p>
                  </div>
                  <span className="text-sm font-medium text-primary">{difficulty.multiplier} points</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Lobby */}
        {step === "lobby" && (
          <div className="space-y-6">
            {/* Join Code Section */}
            <Card className="p-6 border-0 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <p className="text-sm text-muted-foreground mb-2">Join Code</p>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl font-bold tracking-widest text-foreground">{joinCode}</span>
                  <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                    {copied ? (
                      <Check className="w-5 h-5 text-accent" />
                    ) : (
                      <Copy className="w-5 h-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                
                {/* QR Code */}
                <div className="bg-card p-4 rounded-xl border">
                  <QRCode
                    value={`https://${joinUrl}`}
                    size={160}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    bgColor="transparent"
                    fgColor="currentColor"
                    className="text-foreground"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-3">{joinUrl}</p>
              </div>
            </Card>

            {/* Players List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Players
                </h3>
                <span className="text-sm text-muted-foreground">{players.length} joined</span>
              </div>
              
              <Card className="border-0 shadow-sm divide-y divide-border">
                {players.map((player) => (
                  <div key={player.id} className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">{player.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{player.name}</p>
                      {player.isHost && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Crown className="w-3 h-3 text-chart-3" /> Host
                        </span>
                      )}
                    </div>
                    {player.isHost && (
                      <span className="text-xs bg-chart-3/10 text-chart-3 px-2 py-1 rounded-full font-medium">You</span>
                    )}
                  </div>
                ))}
              </Card>
            </div>

            {/* Start Game Button */}
            <Button 
              onClick={handleStartGame}
              className="w-full h-14 text-base font-medium shadow-lg shadow-primary/20"
              size="lg"
              disabled={players.length < 2}
            >
              <Play className="w-5 h-5 mr-2 fill-current" />
              Start Game ({players.length} players)
            </Button>
            
            {players.length < 2 && (
              <p className="text-center text-sm text-muted-foreground">
                Waiting for at least 1 more player to join...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
