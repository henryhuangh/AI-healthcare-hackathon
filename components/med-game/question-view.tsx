"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  X,
  Clock,
  User,
  Activity,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Lightbulb
} from "lucide-react"
import type { GameSession } from "@/app/page"

interface QuestionViewProps {
  session: GameSession
  setSession: React.Dispatch<React.SetStateAction<GameSession | null>>
  onEndGame: () => void
  onExit: () => void
}

const sampleQuestions = [
  {
    id: 1,
    patient: {
      age: 67,
      sex: "Male",
      chiefComplaint: "Severe chest pain radiating to left arm",
      history: "Hypertension, Type 2 Diabetes, Former smoker"
    },
    vitals: {
      bp: "158/95",
      hr: 110,
      temp: "37.2°C",
      rr: 22,
      spo2: 94
    },
    symptoms: ["Diaphoresis", "Nausea", "Shortness of breath", "Chest tightness"],
    labHighlights: ["Troponin I: 2.4 ng/mL (elevated)", "ECG: ST elevation V1-V4"],
    question: "What is the most likely diagnosis?",
    options: [
      "Acute Myocardial Infarction (STEMI)",
      "Unstable Angina",
      "Pulmonary Embolism",
      "Aortic Dissection"
    ],
    correctAnswer: 0,
    explanation: "The combination of chest pain radiating to the left arm, ST elevation on ECG, and elevated troponin levels strongly indicates a STEMI. The patient's risk factors (hypertension, diabetes, smoking history) further support this diagnosis."
  },
  {
    id: 2,
    patient: {
      age: 34,
      sex: "Female",
      chiefComplaint: "Progressive fatigue and weight gain",
      history: "No significant past medical history"
    },
    vitals: {
      bp: "105/68",
      hr: 58,
      temp: "36.1°C",
      rr: 14,
      spo2: 99
    },
    symptoms: ["Cold intolerance", "Constipation", "Dry skin", "Hair loss"],
    labHighlights: ["TSH: 12.5 mIU/L (elevated)", "Free T4: 0.5 ng/dL (low)"],
    question: "What is the most likely diagnosis?",
    options: [
      "Major Depressive Disorder",
      "Hypothyroidism",
      "Iron Deficiency Anemia",
      "Chronic Fatigue Syndrome"
    ],
    correctAnswer: 1,
    explanation: "The constellation of fatigue, weight gain, cold intolerance, bradycardia, and constipation combined with elevated TSH and low T4 is classic for primary hypothyroidism."
  },
  {
    id: 3,
    patient: {
      age: 45,
      sex: "Male",
      chiefComplaint: "Sudden severe headache 'worst of my life'",
      history: "Smoker, occasional alcohol use"
    },
    vitals: {
      bp: "175/100",
      hr: 88,
      temp: "37.0°C",
      rr: 18,
      spo2: 98
    },
    symptoms: ["Photophobia", "Neck stiffness", "Nausea/vomiting", "Brief loss of consciousness"],
    labHighlights: ["CT Head: Hyperdense material in subarachnoid space"],
    question: "What is the most likely diagnosis?",
    options: [
      "Migraine with aura",
      "Subarachnoid Hemorrhage",
      "Bacterial Meningitis",
      "Hypertensive Emergency"
    ],
    correctAnswer: 1,
    explanation: "The sudden onset 'thunderclap' headache, meningeal signs (photophobia, neck stiffness), and CT findings of hyperdense material in the subarachnoid space are diagnostic of subarachnoid hemorrhage."
  },
  {
    id: 4,
    patient: {
      age: 28,
      sex: "Female",
      chiefComplaint: "Palpitations and tremor",
      history: "Recent weight loss despite increased appetite"
    },
    vitals: {
      bp: "140/80",
      hr: 115,
      temp: "37.5°C",
      rr: 20,
      spo2: 99
    },
    symptoms: ["Heat intolerance", "Anxiety", "Diarrhea", "Eye prominence"],
    labHighlights: ["TSH: 0.05 mIU/L (low)", "Free T4: 4.2 ng/dL (elevated)"],
    question: "What is the most likely diagnosis?",
    options: [
      "Graves' Disease",
      "Panic Disorder",
      "Pheochromocytoma",
      "Thyroid Storm"
    ],
    correctAnswer: 0,
    explanation: "The symptoms of heat intolerance, weight loss despite increased appetite, tachycardia, tremor, and exophthalmos with suppressed TSH and elevated T4 are classic for Graves' disease."
  },
  {
    id: 5,
    patient: {
      age: 72,
      sex: "Female",
      chiefComplaint: "Confusion and decreased urine output",
      history: "Congestive heart failure, on diuretics"
    },
    vitals: {
      bp: "95/60",
      hr: 102,
      temp: "36.8°C",
      rr: 22,
      spo2: 93
    },
    symptoms: ["Dry mucous membranes", "Poor skin turgor", "Orthostatic dizziness", "Lethargy"],
    labHighlights: ["BUN: 45 mg/dL", "Creatinine: 2.8 mg/dL", "Na: 148 mEq/L"],
    question: "What is the most likely diagnosis?",
    options: [
      "Acute Kidney Injury (Prerenal)",
      "Urinary Tract Infection",
      "Hypernatremic Dehydration",
      "Heart Failure Exacerbation"
    ],
    correctAnswer: 0,
    explanation: "The clinical picture of hypotension, tachycardia, poor skin turgor, elevated BUN/Cr ratio, and hypernatremia in a patient on diuretics strongly suggests prerenal AKI due to volume depletion."
  }
]

export function QuestionView({ session, setSession, onEndGame, onExit }: QuestionViewProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  
  const currentQuestion = sampleQuestions[(session.currentQuestion - 1) % sampleQuestions.length]
  const isPracticeMode = session.mode === "practice"
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer

  // Timer logic
  useEffect(() => {
    if (session.mode === "practice" || showResult) return

    const interval = setInterval(() => {
      setSession(prev => {
        if (!prev) return prev
        const newTime = prev.timeRemaining - 1
        if (newTime <= 0) {
          onEndGame()
          return prev
        }
        return { ...prev, timeRemaining: newTime }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [session.mode, showResult, setSession, onEndGame])

  // Track time for this question
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 100)
    }, 100)
    return () => clearInterval(interval)
  }, [session.currentQuestion])

  const handleSubmit = () => {
    if (selectedAnswer === null) return
    
    // Calculate score
    const basePoints = session.difficulty === "easy" ? 100 : session.difficulty === "standard" ? 200 : 400
    const speedBonus = Math.max(0, 1 - (timeElapsed / 60000)) // Bonus for answering quickly
    const points = isCorrect ? Math.round(basePoints * (1 + speedBonus * 0.5)) : 0

    setSession(prev => {
      if (!prev) return prev
      return {
        ...prev,
        score: prev.score + points,
        answers: [...prev.answers, { 
          questionId: currentQuestion.id, 
          correct: isCorrect, 
          timeMs: timeElapsed 
        }]
      }
    })

    // In competitive/blitz mode, move to next question immediately
    if (!isPracticeMode) {
      if (session.currentQuestion >= session.totalQuestions) {
        onEndGame()
      } else {
        setSession(prev => {
          if (!prev) return prev
          return { ...prev, currentQuestion: prev.currentQuestion + 1 }
        })
        setSelectedAnswer(null)
        setTimeElapsed(0)
      }
    } else {
      // In practice mode, show result and explanation
      setShowResult(true)
    }
  }

  const handleNext = () => {
    if (session.currentQuestion >= session.totalQuestions) {
      onEndGame()
    } else {
      setSession(prev => {
        if (!prev) return prev
        return { ...prev, currentQuestion: prev.currentQuestion + 1 }
      })
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeElapsed(0)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button variant="ghost" size="icon" onClick={onExit}>
            <X className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">
              {session.currentQuestion}/{session.totalQuestions}
            </span>
            
            {session.mode !== "practice" && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                session.timeRemaining <= 60 ? "bg-destructive/10 text-destructive" : "bg-muted"
              }`}>
                <Clock className="w-4 h-4" />
                <span className="text-sm font-mono font-medium">
                  {formatTime(session.timeRemaining)}
                </span>
              </div>
            )}
          </div>
          
          <div className="text-sm font-semibold text-primary">
            {session.score} pts
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="max-w-4xl mx-auto mt-3">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(session.currentQuestion / session.totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        {/* Patient Card */}
        <Card className="p-4 mb-4 border-0 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {currentQuestion.patient.age}yo {currentQuestion.patient.sex}
              </h3>
              <p className="text-sm text-muted-foreground">{currentQuestion.patient.chiefComplaint}</p>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground mb-3">
            <span className="font-medium">History:</span> {currentQuestion.patient.history}
          </div>

          {/* Vitals */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted rounded-lg shrink-0">
              <Activity className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium">{currentQuestion.vitals.bp}</span>
            </div>
            <div className="px-2.5 py-1.5 bg-muted rounded-lg text-xs font-medium shrink-0">
              HR: {currentQuestion.vitals.hr}
            </div>
            <div className="px-2.5 py-1.5 bg-muted rounded-lg text-xs font-medium shrink-0">
              {currentQuestion.vitals.temp}
            </div>
            <div className="px-2.5 py-1.5 bg-muted rounded-lg text-xs font-medium shrink-0">
              SpO2: {currentQuestion.vitals.spo2}%
            </div>
          </div>

          {/* Symptoms */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Presenting Symptoms</h4>
            <div className="flex flex-wrap gap-2">
              {currentQuestion.symptoms.map((symptom) => (
                <span key={symptom} className="text-xs px-2 py-1 bg-secondary rounded-md text-secondary-foreground">
                  {symptom}
                </span>
              ))}
            </div>
          </div>

          {/* Lab Highlights */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Key Findings</h4>
            <div className="space-y-1">
              {currentQuestion.labHighlights.map((lab) => (
                <p key={lab} className="text-xs text-foreground font-mono bg-muted/50 px-2 py-1 rounded">
                  {lab}
                </p>
              ))}
            </div>
          </div>
        </Card>

        {/* Question */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">{currentQuestion.question}</h2>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrectAnswer = index === currentQuestion.correctAnswer
            
            let cardClass = "border-0 shadow-sm cursor-pointer transition-all"
            if (showResult) {
              if (isCorrectAnswer) {
                cardClass += " bg-accent/10 border-2 border-accent"
              } else if (isSelected && !isCorrectAnswer) {
                cardClass += " bg-destructive/10 border-2 border-destructive"
              }
            } else if (isSelected) {
              cardClass += " border-2 border-primary bg-primary/5"
            }
            
            return (
              <Card 
                key={index}
                className={`p-4 ${cardClass}`}
                onClick={() => !showResult && setSelectedAnswer(index)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-medium ${
                    showResult && isCorrectAnswer 
                      ? "bg-accent text-accent-foreground" 
                      : showResult && isSelected && !isCorrectAnswer
                      ? "bg-destructive text-destructive-foreground"
                      : isSelected 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {showResult && isCorrectAnswer ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : showResult && isSelected && !isCorrectAnswer ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground">{option}</span>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Explanation (Practice Mode) */}
        {showResult && isPracticeMode && (
          <Card className="p-4 mb-6 border-0 shadow-sm bg-accent/5">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Explanation</h4>
                <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Action Button */}
        {!showResult ? (
          <Button 
            onClick={handleSubmit} 
            disabled={selectedAnswer === null}
            className="w-full h-12"
            size="lg"
          >
            Submit Answer
          </Button>
        ) : isPracticeMode && (
          <Button 
            onClick={handleNext}
            className="w-full h-12"
            size="lg"
          >
            {session.currentQuestion >= session.totalQuestions ? "See Results" : "Next Question"}
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        )}
      </div>
    </div>
  )
}
