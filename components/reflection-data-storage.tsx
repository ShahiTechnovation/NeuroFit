"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define the reflection data type
export type ReflectionEntry = {
  id: string
  date: string
  timestamp: string
  responses: {
    wake_response?: string
    drink_choice?: string
    thought_response?: string
    mask_choice?: string
    title_text?: string
    selected_tag?: string
    mood?: string
    sleepHours?: number
    sleepMinutes?: number
    didWorkout?: boolean
    dayRating?: number
    energyLevel?: number
    stressLevel?: number
    notes?: string
  }
  tone?: string
}

// Define the context type
type ReflectionContextType = {
  reflections: ReflectionEntry[]
  addReflection: (reflection: Omit<ReflectionEntry, "id">) => void
  getReflectionsByDateRange: (startDate: Date, endDate: Date) => ReflectionEntry[]
  getLatestReflection: () => ReflectionEntry | null
  hasReflectedToday: boolean
}

// Create the context
const ReflectionContext = createContext<ReflectionContextType | undefined>(undefined)

// Provider component
export function ReflectionProvider({ children }: { children: ReactNode }) {
  const [reflections, setReflections] = useState<ReflectionEntry[]>([])
  const [hasReflectedToday, setHasReflectedToday] = useState(false)

  // Load reflections from localStorage on initial render
  useEffect(() => {
    const savedReflections = localStorage.getItem("reflectionEntries")
    if (savedReflections) {
      const parsedReflections = JSON.parse(savedReflections)
      setReflections(parsedReflections)

      // Check if user has reflected today
      const today = new Date().toDateString()
      const reflectedToday = parsedReflections.some(
        (reflection: ReflectionEntry) => new Date(reflection.date).toDateString() === today,
      )
      setHasReflectedToday(reflectedToday)
    }
  }, [])

  // Save reflections to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("reflectionEntries", JSON.stringify(reflections))
  }, [reflections])

  // Add a new reflection
  const addReflection = (reflection: Omit<ReflectionEntry, "id">) => {
    const newReflection = {
      ...reflection,
      id: Date.now().toString(),
    }

    setReflections([...reflections, newReflection])

    // Update hasReflectedToday
    const today = new Date().toDateString()
    if (new Date(reflection.date).toDateString() === today) {
      setHasReflectedToday(true)
    }
  }

  // Get reflections within a date range
  const getReflectionsByDateRange = (startDate: Date, endDate: Date) => {
    return reflections.filter((reflection) => {
      const reflectionDate = new Date(reflection.date)
      return reflectionDate >= startDate && reflectionDate <= endDate
    })
  }

  // Get the latest reflection
  const getLatestReflection = () => {
    if (reflections.length === 0) return null

    return reflections.reduce((latest, current) => {
      return new Date(current.date) > new Date(latest.date) ? current : latest
    })
  }

  return (
    <ReflectionContext.Provider
      value={{
        reflections,
        addReflection,
        getReflectionsByDateRange,
        getLatestReflection,
        hasReflectedToday,
      }}
    >
      {children}
    </ReflectionContext.Provider>
  )
}

// Custom hook to use the reflection context
export function useReflections() {
  const context = useContext(ReflectionContext)
  if (context === undefined) {
    throw new Error("useReflections must be used within a ReflectionProvider")
  }
  return context
}
