"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Trophy,
  Target,
  Clock,
  TrendingUp,
  RotateCcw,
  Home,
  Share2,
  CheckCircle2,
  XCircle
} from "lucide-react"
import type { GameSession } from "@/app/page"

interface GameResultsProps {
  session: GameSession
  onContinue: () => void
  onPlayAgain: () => void
}

export function GameResults({ session, onContinue, onPlayAgain }: GameResultsProps) {
  const correctAnswers = session.answers.filter(a => a.correct).length
  const accuracy = Math.round((correctAnswers / session.totalQuestions) * 100)
  const avgTime = Math.round(session.answers.reduce((sum, a) => sum + a.timeMs, 0) / session.answers.length / 1000)

  const getPerformanceMessage = () => {
    if (accuracy >= 80) return { emoji: "🎉", text: "Excellent work!", subtext: "You're on fire!" }
    if (accuracy >= 60) return { emoji: "👍", text: "Good job!", subtext: "Keep practicing!" }
    if (accuracy >= 40) return { emoji: "💪", text: "Not bad!", subtext: "Room for improvement" }
    return { emoji: "📚", text: "Keep learning!", subtext: "Practice makes perfect" }
  }

  const performance = getPerformanceMessage()

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-md mx-auto pt-8">
        {/* Performance Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{performance.emoji}</div>
          <h1 className="text-2xl font-bold text-foreground mb-1">{performance.text}</h1>
          <p className="text-muted-foreground">{performance.subtext}</p>
        </div>

        {/* Score Card */}
        <Card className="p-6 mb-6 border-0 shadow-lg bg-primary text-primary-foreground">
          <div className="text-center">
            <p className="text-sm opacity-80 mb-1">Total Score</p>
            <p className="text-5xl font-bold mb-2">{session.score}</p>
            <p className="text-sm opacity-80 capitalize">{session.mode} • {session.difficulty}</p>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-4 border-0 shadow-sm text-center">
            <Target className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{accuracy}%</p>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </Card>
          
          <Card className="p-4 border-0 shadow-sm text-center">
            <Trophy className="w-5 h-5 text-chart-3 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{correctAnswers}/{session.totalQuestions}</p>
            <p className="text-xs text-muted-foreground">Correct</p>
          </Card>
          
          <Card className="p-4 border-0 shadow-sm text-center">
            <Clock className="w-5 h-5 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{avgTime}s</p>
            <p className="text-xs text-muted-foreground">Avg Time</p>
          </Card>
        </div>

        {/* Answer Summary */}
        <Card className="p-4 mb-6 border-0 shadow-sm">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Question Summary
          </h3>
          <div className="flex gap-2">
            {session.answers.map((answer, index) => (
              <div 
                key={index}
                className={`flex-1 h-10 rounded-lg flex items-center justify-center ${
                  answer.correct 
                    ? "bg-accent/10 text-accent" 
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {answer.correct ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Rank Update (for competitive modes) */}
        {session.mode !== "practice" && (
          <Card className="p-4 mb-6 border-0 shadow-sm bg-chart-3/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-chart-3/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-chart-3" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Rank Updated</p>
                  <p className="text-sm text-muted-foreground">You moved up 3 spots!</p>
                </div>
              </div>
              <span className="text-lg font-bold text-chart-3">#153</span>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button onClick={onPlayAgain} className="w-full h-12" size="lg">
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={onContinue} className="h-12">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button variant="outline" className="h-12">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
