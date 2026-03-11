"use client"

import { Home, Trophy, User, BookOpen } from "lucide-react"
import type { Screen } from "@/app/page"

interface BottomNavProps {
  currentScreen: Screen
  onNavigate: (screen: Screen) => void
}

const navItems = [
  { id: "dashboard" as Screen, icon: Home, label: "Home" },
  { id: "study" as Screen, icon: BookOpen, label: "Study" },
  { id: "leaderboard" as Screen, icon: Trophy, label: "Ranks" },
  { id: "profile" as Screen, icon: User, label: "Profile" }
]

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border md:hidden">
        <div className="flex items-center justify-around h-16 px-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentScreen === item.id || 
              (item.id === "dashboard" && currentScreen === "modes")
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Desktop Side Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 bg-background border-r border-border flex-col items-center py-6 z-50">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mb-8">
          <span className="text-primary-foreground font-bold text-sm">MG</span>
        </div>
        
        <div className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentScreen === item.id || 
              (item.id === "dashboard" && currentScreen === "modes")
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
