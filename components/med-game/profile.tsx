"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft,
  Settings,
  Trophy,
  Target,
  Flame,
  BookOpen,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Download
} from "lucide-react"

interface ProfileProps {
  onBack: () => void
}

const categories = [
  { name: "Cardiovascular", accuracy: 85, trend: "up", cases: 24 },
  { name: "Pulmonary", accuracy: 72, trend: "up", cases: 18 },
  { name: "Neurological", accuracy: 65, trend: "down", cases: 12 },
  { name: "GI/Hepatic", accuracy: 78, trend: "up", cases: 15 },
  { name: "Endocrine", accuracy: 88, trend: "up", cases: 20 },
  { name: "Infectious", accuracy: 58, trend: "down", cases: 8 },
  { name: "Renal", accuracy: 70, trend: "stable", cases: 10 },
  { name: "Hematologic", accuracy: 62, trend: "up", cases: 6 }
]

const studyRecommendations = [
  { category: "Infectious Disease", reason: "Lowest accuracy", action: "Practice 10 cases" },
  { category: "Neurological", reason: "Declining trend", action: "Review fundamentals" }
]

export function Profile({ onBack }: ProfileProps) {
  const user = {
    name: "Dr. Sarah Chen",
    institution: "Stanford Medicine",
    year: "PGY-2",
    streak: 7,
    totalCases: 142,
    accuracy: 78,
    rank: 156,
    joinDate: "Jan 2024"
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      {/* Profile Card */}
      <Card className="p-6 mb-6 border-0 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
            👩‍⚕️
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.institution}</p>
            <p className="text-xs text-muted-foreground">{user.year} • Member since {user.joinDate}</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center p-2 bg-muted rounded-lg">
            <Flame className="w-4 h-4 text-warning mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{user.streak}</p>
            <p className="text-xs text-muted-foreground">Streak</p>
          </div>
          <div className="text-center p-2 bg-muted rounded-lg">
            <Target className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{user.totalCases}</p>
            <p className="text-xs text-muted-foreground">Cases</p>
          </div>
          <div className="text-center p-2 bg-muted rounded-lg">
            <TrendingUp className="w-4 h-4 text-accent mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{user.accuracy}%</p>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </div>
          <div className="text-center p-2 bg-muted rounded-lg">
            <Trophy className="w-4 h-4 text-chart-3 mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">#{user.rank}</p>
            <p className="text-xs text-muted-foreground">Rank</p>
          </div>
        </div>
      </Card>

      {/* Study Recommendations */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">Study Recommendations</h2>
          <span className="text-xs text-muted-foreground">Updated today</span>
        </div>
        
        <div className="space-y-2">
          {studyRecommendations.map((rec, index) => (
            <Card key={index} className="p-4 border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{rec.category}</p>
                    <p className="text-xs text-muted-foreground">{rec.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-primary font-medium">{rec.action}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground inline-block ml-1" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Category Performance */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">Performance by Category</h2>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
        </div>
        
        <Card className="p-4 border-0 shadow-sm">
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{category.name}</span>
                    {category.trend === "up" && <TrendingUp className="w-3 h-3 text-accent" />}
                    {category.trend === "down" && <TrendingDown className="w-3 h-3 text-destructive" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{category.cases} cases</span>
                    <span className={`text-sm font-medium ${
                      category.accuracy >= 75 ? "text-accent" : 
                      category.accuracy >= 60 ? "text-warning" : 
                      "text-destructive"
                    }`}>
                      {category.accuracy}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      category.accuracy >= 75 ? "bg-accent" : 
                      category.accuracy >= 60 ? "bg-warning" : 
                      "bg-destructive"
                    }`}
                    style={{ width: `${category.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Weekly Goal */}
      <Card className="p-4 border-0 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Weekly Goal</h3>
          <span className="text-sm text-primary font-medium">70%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
          <div className="h-full bg-primary rounded-full" style={{ width: "70%" }} />
        </div>
        <p className="text-xs text-muted-foreground">35 of 50 cases completed this week</p>
      </Card>
    </div>
  )
}
