"use client"

import { useState } from "react"
import { Dashboard } from "@/components/med-game/dashboard"
import { GameModes } from "@/components/med-game/game-modes"
import { QuestionView } from "@/components/med-game/question-view"
import { Leaderboard } from "@/components/med-game/leaderboard"
import { Profile } from "@/components/med-game/profile"
import { Study } from "@/components/med-game/study"
import { HostGame } from "@/components/med-game/host-game"
import { BottomNav } from "@/components/med-game/bottom-nav"
import { GameResults } from "@/components/med-game/game-results"

export type Screen = "dashboard" | "modes" | "question" | "leaderboard" | "profile" | "results" | "study" | "host"
export type GameMode = "practice" | "competitive" | "blitz"
export type Difficulty = "easy" | "standard" | "hard"

export interface GameSession {
  mode: GameMode
  difficulty: Difficulty
  currentQuestion: number
  totalQuestions: number
  score: number
  timeRemaining: number
  answers: { questionId: number; correct: boolean; timeMs: number }[]
}

export default function MedGame() {
  const [screen, setScreen] = useState<Screen>("dashboard")
  const [gameSession, setGameSession] = useState<GameSession | null>(null)

  const startGame = (mode: GameMode, difficulty: Difficulty) => {
    const totalQuestions = mode === "blitz" ? 10 : 5
    const totalTime = mode === "competitive" ? 300 : mode === "blitz" ? 
      (difficulty === "easy" ? 100 : difficulty === "standard" ? 200 : 300) : 0

    setGameSession({
      mode,
      difficulty,
      currentQuestion: 1,
      totalQuestions,
      score: 0,
      timeRemaining: totalTime,
      answers: []
    })
    setScreen("question")
  }

  const endGame = () => {
    setScreen("results")
  }

  const exitToHome = () => {
    setGameSession(null)
    setScreen("dashboard")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pb-20 md:pb-0 md:pl-20">
        {screen === "dashboard" && (
          <Dashboard onStartGame={() => setScreen("modes")} onHostGame={() => setScreen("host")} onNavigate={setScreen} />
        )}
        {screen === "modes" && (
          <GameModes onSelectMode={startGame} onBack={() => setScreen("dashboard")} />
        )}
        {screen === "question" && gameSession && (
          <QuestionView 
            session={gameSession} 
            setSession={setGameSession}
            onEndGame={endGame}
            onExit={exitToHome}
          />
        )}
        {screen === "results" && gameSession && (
          <GameResults session={gameSession} onContinue={exitToHome} onPlayAgain={() => setScreen("modes")} />
        )}
        {screen === "leaderboard" && (
          <Leaderboard onBack={() => setScreen("dashboard")} />
        )}
        {screen === "profile" && (
          <Profile onBack={() => setScreen("dashboard")} />
        )}
        {screen === "study" && (
          <Study onBack={() => setScreen("dashboard")} />
        )}
        {screen === "host" && (
          <HostGame onStartHostedGame={startGame} onBack={() => setScreen("dashboard")} />
        )}
      </main>
      
      {screen !== "question" && screen !== "results" && screen !== "host" && (
        <BottomNav currentScreen={screen} onNavigate={setScreen} />
      )}
    </div>
  )
}
