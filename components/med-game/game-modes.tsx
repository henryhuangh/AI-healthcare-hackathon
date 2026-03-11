"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft,
  BookOpen,
  Swords,
  Zap,
  ChevronRight,
  Clock,
  Target,
  Brain
} from "lucide-react"
import type { GameMode, Difficulty } from "@/app/page"

interface GameModesProps {
  onSelectMode: (mode: GameMode, difficulty: Difficulty) => void
  onBack: () => void
}

const modes = [
  {
    id: "practice" as GameMode,
    name: "Practice",
    description: "Learn at your own pace with full explanations",
    icon: BookOpen,
    features: ["No time limit", "Detailed feedback", "Hints available"],
    color: "bg-accent text-accent-foreground"
  },
  {
    id: "competitive" as GameMode,
    name: "Competitive",
    description: "5 questions in 5 minutes. Climb the ranks!",
    icon: Swords,
    features: ["5 minute timer", "Global ranking", "Speed bonus"],
    color: "bg-primary text-primary-foreground"
  },
  {
    id: "blitz" as GameMode,
    name: "Blitz",
    description: "Fast-paced pattern recognition challenge",
    icon: Zap,
    features: ["Per-question timer", "Rapid fire", "Separate leaderboard"],
    color: "bg-chart-3 text-foreground"
  }
]

const difficulties = [
  { 
    id: "easy" as Difficulty, 
    name: "Easy", 
    points: "100 pts",
    description: "Single-system, textbook presentations"
  },
  { 
    id: "standard" as Difficulty, 
    name: "Standard", 
    points: "200 pts",
    description: "Multi-system with moderate ambiguity"
  },
  { 
    id: "hard" as Difficulty, 
    name: "Hard", 
    points: "400 pts",
    description: "Rare conditions, subtle findings"
  }
]

export function GameModes({ onSelectMode, onBack }: GameModesProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null)

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={selectedMode ? () => setSelectedMode(null) : onBack}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {selectedMode ? "Back to Modes" : "Back"}
        </Button>
        {selectedMode ? (
          <>
            <h1 className="text-2xl font-bold text-foreground capitalize">{selectedMode} Mode</h1>
            <p className="text-muted-foreground text-sm mt-1">Select difficulty</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-foreground">Choose Game Mode</h1>
            <p className="text-muted-foreground text-sm mt-1">Pick your challenge style</p>
          </>
        )}
      </header>

      {!selectedMode ? (
        /* Game Modes */
        <div className="space-y-4">
          {modes.map((mode) => {
            const Icon = mode.icon
            return (
              <Card 
                key={mode.id}
                className="p-5 border-0 shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
                onClick={() => setSelectedMode(mode.id)}
              >
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-xl ${mode.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">{mode.name}</h3>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">{mode.description}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        /* Difficulty Selection */
        <div className="space-y-4">
          {difficulties.map((diff) => (
            <Card 
              key={diff.id}
              className="p-5 border-0 shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
              onClick={() => onSelectMode(selectedMode, diff.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    diff.id === "easy" ? "bg-accent/10" : 
                    diff.id === "standard" ? "bg-primary/10" : 
                    "bg-destructive/10"
                  }`}>
                    {diff.id === "easy" && <Target className="w-5 h-5 text-accent" />}
                    {diff.id === "standard" && <Brain className="w-5 h-5 text-primary" />}
                    {diff.id === "hard" && <Clock className="w-5 h-5 text-destructive" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{diff.name}</h3>
                    <p className="text-xs text-muted-foreground">{diff.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${
                    diff.id === "easy" ? "text-accent" : 
                    diff.id === "standard" ? "text-primary" : 
                    "text-destructive"
                  }`}>
                    {diff.points}
                  </span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground inline-block ml-2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
