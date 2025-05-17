"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

// Define task type
export type Task = {
  id: number
  title: string
  description: string
  field: string
  dueDate: string
  priority: "high" | "medium" | "low"
  completed: boolean
  xp: number
}

// Define context type
type TaskContextType = {
  tasks: Task[]
  addTask: (task: Omit<Task, "id">) => void
  updateTask: (taskId: number, updates: Partial<Task>) => void
  deleteTask: (taskId: number) => void
  toggleTaskCompletion: (taskId: number) => void
  completionPopup: {
    isVisible: boolean
    xp: number
  }
  hideCompletionPopup: () => void
}

// Create context
const TaskContext = createContext<TaskContextType | undefined>(undefined)

// Initial tasks data
const initialTasks: Task[] = [
  {
    id: 1,
    title: "Complete Physics Module 3",
    description: "Study chapters 5-7 and solve practice problems",
    field: "JEE Preparation",
    dueDate: "2025-05-20",
    priority: "high",
    completed: false,
    xp: 50,
  },
  {
    id: 2,
    title: "30 minutes cardio workout",
    description: "Running or cycling at moderate intensity",
    field: "Fitness",
    dueDate: "2025-05-16",
    priority: "medium",
    completed: false,
    xp: 40,
  },
  {
    id: 3,
    title: "Solve 10 practice problems",
    description: "Focus on integration and differentiation",
    field: "JEE Preparation",
    dueDate: "2025-05-17",
    priority: "medium",
    completed: false,
    xp: 30,
  },
  {
    id: 4,
    title: "Meditation session",
    description: "15 minutes of mindfulness meditation",
    field: "Mindfulness",
    dueDate: "2025-05-16",
    priority: "low",
    completed: true,
    xp: 20,
  },
  {
    id: 5,
    title: "Read chapter on algorithms",
    description: "Focus on sorting algorithms and time complexity",
    field: "Coding",
    dueDate: "2025-05-18",
    priority: "high",
    completed: false,
    xp: 45,
  },
  {
    id: 6,
    title: "Strength training session",
    description: "Focus on upper body exercises",
    field: "Fitness",
    dueDate: "2025-05-17",
    priority: "medium",
    completed: true,
    xp: 35,
  },
]

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [completionPopup, setCompletionPopup] = useState({
    isVisible: false,
    xp: 0,
  })
  const { toast } = useToast()

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = (task: Omit<Task, "id">) => {
    const newTask = {
      ...task,
      id: Date.now(),
    }
    setTasks([...tasks, newTask])
  }

  const updateTask = (taskId: number, updates: Partial<Task>) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)))
  }

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const toggleTaskCompletion = (taskId: number) => {
    const taskIndex = tasks.findIndex((task) => task.id === taskId)

    if (taskIndex !== -1) {
      const task = tasks[taskIndex]
      const wasCompleted = task.completed

      // Update the task
      const updatedTasks = [...tasks]
      updatedTasks[taskIndex] = { ...task, completed: !wasCompleted }
      setTasks(updatedTasks)

      // Show completion notification if task was just completed
      if (!wasCompleted) {
        toast({
          title: "Task Completed!",
          description: `You earned +${task.xp} XP for completing "${task.title}"`,
        })

        // Show completion popup
        setCompletionPopup({
          isVisible: true,
          xp: task.xp,
        })

        // Hide popup after 3 seconds
        setTimeout(() => {
          setCompletionPopup({
            isVisible: false,
            xp: 0,
          })
        }, 3000)
      }
    }
  }

  const hideCompletionPopup = () => {
    setCompletionPopup({
      isVisible: false,
      xp: 0,
    })
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        completionPopup,
        hideCompletionPopup,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}
