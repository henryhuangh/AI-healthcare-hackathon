import casesData from "@/data/cases.json"
import type { Case, Difficulty, Specialty } from "@/lib/types"

const allCases = casesData as Case[]

export function getCases(opts: {
  difficulty?: Difficulty
  specialty?: Specialty | "mixed"
  count: number
}): Case[] {
  let pool = allCases

  if (opts.difficulty) {
    pool = pool.filter((c) => c.difficulty === opts.difficulty)
  }

  if (opts.specialty && opts.specialty !== "mixed") {
    pool = pool.filter((c) => c.specialty === opts.specialty)
  }

  // Fisher-Yates shuffle then slice
  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, Math.min(opts.count, shuffled.length))
}

export function getCaseById(id: string): Case | undefined {
  return allCases.find((c) => c.id === id)
}

export function getCasesByIds(ids: string[]): Case[] {
  return ids.map((id) => allCases.find((c) => c.id === id)).filter(Boolean) as Case[]
}

export function stripAnswers(
  c: Case
): Omit<Case, "correct_answer" | "accepted_synonyms" | "explanation" | "distractors"> {
  const { correct_answer: _ca, accepted_synonyms: _as, explanation: _ex, distractors: _d, ...safe } = c
  return safe
}

export { allCases }
