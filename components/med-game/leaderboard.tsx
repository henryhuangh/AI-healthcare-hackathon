"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft,
  Trophy,
  Medal,
  Crown
} from "lucide-react"

interface LeaderboardProps {
  onBack: () => void
}

type LeaderboardType = "competitive" | "blitz"

const leaderboardData = {
  competitive: [
    { rank: 1, name: "DrNeuro_23", institution: "Johns Hopkins", score: 24850, avatar: "👨‍⚕️" },
    { rank: 2, name: "CardioQueen", institution: "Mayo Clinic", score: 23420, avatar: "👩‍⚕️" },
    { rank: 3, name: "PathMaster", institution: "Stanford", score: 22180, avatar: "🧑‍⚕️" },
    { rank: 4, name: "SurgicalStrike", institution: "Mass General", score: 21650, avatar: "👨‍⚕️" },
    { rank: 5, name: "ERDoc", institution: "UCLA", score: 20890, avatar: "👩‍⚕️" },
    { rank: 6, name: "PedsProdigy", institution: "CHOP", score: 19750, avatar: "🧑‍⚕️" },
    { rank: 7, name: "OncologyAce", institution: "MD Anderson", score: 18920, avatar: "👨‍⚕️" },
    { rank: 8, name: "NephrNinja", institution: "Cleveland Clinic", score: 18450, avatar: "👩‍⚕️" },
    { rank: 9, name: "RadResident", institution: "UCSF", score: 17890, avatar: "🧑‍⚕️" },
    { rank: 10, name: "GIGenius", institution: "NYU", score: 17320, avatar: "👨‍⚕️" },
  ],
  blitz: [
    { rank: 1, name: "SpeedDx", institution: "Duke", score: 31200, avatar: "⚡" },
    { rank: 2, name: "BlitzDoc", institution: "Penn", score: 29850, avatar: "🚀" },
    { rank: 3, name: "RapidRx", institution: "Northwestern", score: 28400, avatar: "💨" },
    { rank: 4, name: "QuickDiag", institution: "Emory", score: 27150, avatar: "🎯" },
    { rank: 5, name: "FastTrack", institution: "Vanderbilt", score: 26200, avatar: "⏱️" },
  ]
}

export function Leaderboard({ onBack }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<LeaderboardType>("competitive")
  const data = leaderboardData[activeTab]
  
  // Current user's position
  const userPosition = { rank: 156, score: 8420 }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 -ml-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Monthly rankings reset in 12 days</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button 
          variant={activeTab === "competitive" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("competitive")}
          className="flex-1"
        >
          Competitive
        </Button>
        <Button 
          variant={activeTab === "blitz" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("blitz")}
          className="flex-1"
        >
          Blitz
        </Button>
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-2 mb-8">
        {/* 2nd Place */}
        <div className="flex-1 max-w-[100px]">
          <Card className="p-3 border-0 shadow-sm text-center bg-secondary">
            <div className="text-3xl mb-1">{data[1].avatar}</div>
            <Medal className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
            <p className="text-xs font-medium text-foreground truncate">{data[1].name}</p>
            <p className="text-xs text-muted-foreground">{data[1].score.toLocaleString()}</p>
          </Card>
        </div>
        
        {/* 1st Place */}
        <div className="flex-1 max-w-[120px]">
          <Card className="p-4 border-0 shadow-lg text-center bg-chart-3/10 relative">
            <Crown className="w-6 h-6 text-chart-3 mx-auto mb-1" />
            <div className="text-4xl mb-1">{data[0].avatar}</div>
            <p className="text-sm font-semibold text-foreground truncate">{data[0].name}</p>
            <p className="text-xs text-muted-foreground">{data[0].score.toLocaleString()}</p>
          </Card>
        </div>
        
        {/* 3rd Place */}
        <div className="flex-1 max-w-[100px]">
          <Card className="p-3 border-0 shadow-sm text-center bg-secondary">
            <div className="text-3xl mb-1">{data[2].avatar}</div>
            <Trophy className="w-5 h-5 text-chart-3/60 mx-auto mb-1" />
            <p className="text-xs font-medium text-foreground truncate">{data[2].name}</p>
            <p className="text-xs text-muted-foreground">{data[2].score.toLocaleString()}</p>
          </Card>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2 mb-6">
        {data.slice(3).map((player) => (
          <Card key={player.rank} className="p-3 border-0 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-8 text-center font-bold text-muted-foreground">
                {player.rank}
              </span>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                {player.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{player.name}</p>
                <p className="text-xs text-muted-foreground truncate">{player.institution}</p>
              </div>
              <span className="font-semibold text-foreground">
                {player.score.toLocaleString()}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Current User Position */}
      <Card className="p-4 border-2 border-primary shadow-sm sticky bottom-24 md:bottom-4">
        <div className="flex items-center gap-3">
          <span className="w-8 text-center font-bold text-primary">
            {userPosition.rank}
          </span>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
            🧑‍⚕️
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground">You</p>
            <p className="text-xs text-muted-foreground">Top 15%</p>
          </div>
          <span className="font-semibold text-primary">
            {userPosition.score.toLocaleString()}
          </span>
        </div>
      </Card>
    </div>
  )
}
