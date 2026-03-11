"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Play, 
  Trophy, 
  TrendingUp, 
  Target,
  Flame,
  ChevronRight,
  Stethoscope
} from "lucide-react"
import type { Screen } from "@/app/page"

interface DashboardProps {
  onStartGame: () => void
  onHostGame: () => void
  onNavigate: (screen: Screen) => void
}

export function Dashboard({ onStartGame, onHostGame, onNavigate }: DashboardProps) {
  const stats = {
    streak: 7,
    totalCases: 142,
    accuracy: 78,
    rank: 156
  }

  const recentCategories = [
    { name: "Cardiovascular", accuracy: 85, cases: 24 },
    { name: "Pulmonary", accuracy: 72, cases: 18 },
    { name: "Neurological", accuracy: 65, cases: 12 }
  ]

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">MedGame</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Good morning, Dr. Sarah
        </p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-warning" />
            <span className="text-xs text-muted-foreground font-medium">Streak</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.streak}</p>
          <p className="text-xs text-muted-foreground">days</p>
        </Card>
        
        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">Cases</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.totalCases}</p>
          <p className="text-xs text-muted-foreground">completed</p>
        </Card>
        
        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted-foreground font-medium">Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.accuracy}%</p>
          <p className="text-xs text-muted-foreground">overall</p>
        </Card>
        
        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-chart-3" />
            <span className="text-xs text-muted-foreground font-medium">Rank</span>
          </div>
          <p className="text-2xl font-bold text-foreground">#{stats.rank}</p>
          <p className="text-xs text-muted-foreground">global</p>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <Button 
          onClick={onStartGame}
          className="flex-1 h-14 text-base font-medium shadow-lg shadow-primary/20"
          size="lg"
        >
          <Play className="w-5 h-5 mr-2 fill-current" />
          Play
        </Button>
        <Button 
          variant="outline"
          className="flex-1 h-14 text-base font-medium"
          size="lg"
          onClick={onHostGame}
        >
          Host Game
        </Button>
      </div>

      {/* Study Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Your Progress</h2>
          <Button variant="ghost" size="sm" className="text-muted-foreground text-xs" onClick={() => onNavigate("profile")}>
            View All <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {recentCategories.map((category) => (
            <Card key={category.name} className="p-4 border-0 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-foreground">{category.name}</span>
                <span className="text-sm text-muted-foreground">{category.cases} cases</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${category.accuracy}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-foreground w-12 text-right">
                  {category.accuracy}%
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Leaderboard Preview */}
      <Card className="p-4 border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate("leaderboard")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-chart-3/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-chart-3" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Weekly Leaderboard</h3>
              <p className="text-xs text-muted-foreground">You&apos;re in the top 15%</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </Card>
    </div>
  )
}
