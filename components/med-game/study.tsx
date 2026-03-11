"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  Heart, 
  Brain, 
  Stethoscope,
  Baby,
  Bone,
  Eye,
  ChevronRight,
  BookmarkCheck,
  Clock,
  ArrowLeft
} from "lucide-react"

interface StudyProps {
  onBack: () => void
}

const categories = [
  { id: "cardiology", name: "Cardiology", icon: Heart, cases: 48, color: "text-red-500 bg-red-500/10" },
  { id: "neurology", name: "Neurology", icon: Brain, cases: 36, color: "text-blue-500 bg-blue-500/10" },
  { id: "internal", name: "Internal Medicine", icon: Stethoscope, cases: 64, color: "text-emerald-500 bg-emerald-500/10" },
  { id: "pediatrics", name: "Pediatrics", icon: Baby, cases: 32, color: "text-amber-500 bg-amber-500/10" },
  { id: "orthopedics", name: "Orthopedics", icon: Bone, cases: 28, color: "text-purple-500 bg-purple-500/10" },
  { id: "ophthalmology", name: "Ophthalmology", icon: Eye, cases: 24, color: "text-cyan-500 bg-cyan-500/10" },
]

const recentStudy = [
  { id: 1, category: "Cardiology", topic: "Arrhythmias", progress: 65, lastStudied: "2h ago" },
  { id: 2, category: "Neurology", topic: "Stroke Management", progress: 40, lastStudied: "1d ago" },
  { id: 3, category: "Internal Medicine", topic: "Diabetes", progress: 80, lastStudied: "3d ago" },
]

const savedCases = [
  { id: 1, title: "Acute MI with STEMI", category: "Cardiology", difficulty: "Hard" },
  { id: 2, title: "Pediatric Seizure", category: "Neurology", difficulty: "Standard" },
]

export function Study({ onBack }: StudyProps) {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6 md:pl-20">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <header className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Study</h1>
            <p className="text-muted-foreground text-sm">Review cases and master concepts</p>
          </div>
        </header>

        {/* Continue Studying */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Continue Studying</h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              See all
            </Button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {recentStudy.map((item) => (
              <Card 
                key={item.id}
                className="flex-shrink-0 w-56 p-4 border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{item.lastStudied}</span>
                </div>
                <p className="font-medium text-foreground text-sm mb-1">{item.topic}</p>
                <p className="text-xs text-muted-foreground mb-3">{item.category}</p>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{item.progress}% complete</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-8">
          <h2 className="font-semibold text-foreground mb-4">Categories</h2>
          <div className="space-y-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Card 
                  key={category.id}
                  className="p-4 border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${category.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{category.name}</p>
                      <p className="text-sm text-muted-foreground">{category.cases} cases</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Saved Cases */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4" />
              Saved Cases
            </h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              See all
            </Button>
          </div>
          <div className="space-y-2">
            {savedCases.map((caseItem) => (
              <Card 
                key={caseItem.id}
                className="p-4 border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">{caseItem.title}</p>
                    <p className="text-xs text-muted-foreground">{caseItem.category} • {caseItem.difficulty}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
