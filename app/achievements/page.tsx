"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Zap, Award, Target, BookOpen, Dumbbell, Code, Brain, Plus } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import CustomAchievementForm, { type CustomAchievement } from "@/components/custom-achievement-form"
import { useToast } from "@/hooks/use-toast"

export default function AchievementsPage() {
  const { toast } = useToast()
  const [filter, setFilter] = useState("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [customAchievements, setCustomAchievements] = useState<CustomAchievement[]>([])

  // Mock achievements data
  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: "First Week Streak",
      description: "Complete tasks for 7 consecutive days",
      icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      category: "general",
      progress: 100,
      completed: true,
      date: "2025-05-10",
      xpReward: 200,
    },
    {
      id: 2,
      title: "Physics Master",
      description: "Complete all physics modules",
      icon: <Zap className="h-5 w-5 text-blue-500" />,
      category: "academic",
      progress: 100,
      completed: true,
      date: "2025-05-08",
      xpReward: 300,
    },
    {
      id: 3,
      title: "Fitness Enthusiast",
      description: "Complete 10 fitness tasks",
      icon: <Dumbbell className="h-5 w-5 text-green-500" />,
      category: "fitness",
      progress: 70,
      completed: false,
      date: null,
      xpReward: 250,
    },
    {
      id: 4,
      title: "Coding Ninja",
      description: "Solve 20 coding problems",
      icon: <Code className="h-5 w-5 text-purple-500" />,
      category: "coding",
      progress: 45,
      completed: false,
      date: null,
      xpReward: 350,
    },
    {
      id: 5,
      title: "Early Bird",
      description: "Complete 5 tasks before 9 AM",
      icon: <Star className="h-5 w-5 text-amber-500" />,
      category: "general",
      progress: 60,
      completed: false,
      date: null,
      xpReward: 150,
    },
    {
      id: 6,
      title: "Math Wizard",
      description: "Score 90% or higher on all math assessments",
      icon: <BookOpen className="h-5 w-5 text-indigo-500" />,
      category: "academic",
      progress: 80,
      completed: false,
      date: null,
      xpReward: 300,
    },
    {
      id: 7,
      title: "Meditation Guru",
      description: "Complete 15 mindfulness sessions",
      icon: <Brain className="h-5 w-5 text-teal-500" />,
      category: "mindfulness",
      progress: 33,
      completed: false,
      date: null,
      xpReward: 200,
    },
    {
      id: 8,
      title: "Goal Crusher",
      description: "Achieve 5 personal goals",
      icon: <Target className="h-5 w-5 text-red-500" />,
      category: "general",
      progress: 40,
      completed: false,
      date: null,
      xpReward: 250,
    },
    {
      id: 9,
      title: "Chemistry Champion",
      description: "Complete all chemistry modules with 85% or higher",
      icon: <Award className="h-5 w-5 text-emerald-500" />,
      category: "academic",
      progress: 50,
      completed: false,
      date: null,
      xpReward: 300,
    },
    {
      id: 10,
      title: "Marathon Runner",
      description: "Log 50km of running distance",
      icon: <Dumbbell className="h-5 w-5 text-green-500" />,
      category: "fitness",
      progress: 25,
      completed: false,
      date: null,
      xpReward: 400,
    },
  ])

  // Load custom achievements from localStorage on initial render
  useEffect(() => {
    const savedAchievements = localStorage.getItem("customAchievements")
    if (savedAchievements) {
      setCustomAchievements(JSON.parse(savedAchievements))
    }
  }, [])

  // Save custom achievements to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("customAchievements", JSON.stringify(customAchievements))
  }, [customAchievements])

  const handleCreateAchievement = (achievementData: Omit<CustomAchievement, "id" | "createdAt" | "completed">) => {
    const newAchievement: CustomAchievement = {
      ...achievementData,
      id: Date.now().toString(),
      createdAt: new Date(),
      completed: false,
    }

    setCustomAchievements([...customAchievements, newAchievement])

    toast({
      title: "Achievement Created",
      description: `"${achievementData.title}" has been added to your achievements.`,
    })
  }

  const handleUpdateProgress = (id: string, newValue: number) => {
    setCustomAchievements(
      customAchievements.map((achievement) => {
        if (achievement.id === id) {
          const completed = newValue >= achievement.targetValue
          return {
            ...achievement,
            currentValue: newValue,
            completed,
          }
        }
        return achievement
      }),
    )
  }

  // Combine system and custom achievements
  const allAchievements = [
    ...achievements.map((a) => ({
      ...a,
      isCustom: false,
      id: a.id.toString(),
    })),
    ...customAchievements.map((a) => ({
      ...a,
      isCustom: true,
      progress: Math.round((a.currentValue / a.targetValue) * 100),
      icon: getIconForCustomAchievement(a.icon),
    })),
  ]

  const filteredAchievements = allAchievements.filter((achievement) => {
    if (filter === "all") return true
    if (filter === "completed") return achievement.completed
    if (filter === "in-progress") return !achievement.completed
    if (filter === "custom") return achievement.isCustom
    return achievement.category === filter
  })

  function getIconForCustomAchievement(iconName: string) {
    switch (iconName) {
      case "trophy":
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case "target":
        return <Target className="h-5 w-5 text-red-500" />
      case "dumbbell":
        return <Dumbbell className="h-5 w-5 text-green-500" />
      case "book":
        return <BookOpen className="h-5 w-5 text-indigo-500" />
      case "code":
        return <Code className="h-5 w-5 text-purple-500" />
      case "brain":
        return <Brain className="h-5 w-5 text-teal-500" />
      case "calendar":
        return <Star className="h-5 w-5 text-amber-500" />
      case "zap":
        return <Zap className="h-5 w-5 text-blue-500" />
      default:
        return <Trophy className="h-5 w-5 text-yellow-500" />
    }
  }

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Achievements</h1>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-purple-600 bg-purple-50">
                {allAchievements.filter((a) => a.completed).length} / {allAchievements.length} Unlocked
              </Badge>
              <Button onClick={() => setIsFormOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="mr-2 h-4 w-4" /> Create Achievement
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <div className="mb-6">
            <Tabs defaultValue="all" onValueChange={setFilter}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="fitness">Fitness</TabsTrigger>
                <TabsTrigger value="coding">Coding</TabsTrigger>
                <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} onUpdateProgress={handleUpdateProgress} />
            ))}
            {filteredAchievements.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No achievements found for this filter.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <CustomAchievementForm open={isFormOpen} onOpenChange={setIsFormOpen} onSave={handleCreateAchievement} />
    </DashboardLayout>
  )
}

function AchievementCard({ achievement, onUpdateProgress }) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [progressValue, setProgressValue] = useState(achievement.isCustom ? achievement.currentValue : 0)

  const handleProgressUpdate = () => {
    if (achievement.isCustom) {
      onUpdateProgress(achievement.id, progressValue)
      setIsUpdating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="stagger-item"
    >
      <Card
        className={`overflow-hidden transition-all hover:shadow-md ${
          achievement.completed ? "border-green-200 bg-green-50/30" : ""
        }`}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                {achievement.icon}
              </div>
              <div>
                <CardTitle className="text-base">{achievement.title}</CardTitle>
                <CardDescription>{achievement.description}</CardDescription>
              </div>
            </div>
            {achievement.completed && (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
            )}
            {achievement.isCustom && !achievement.completed && (
              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Custom</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>{achievement.progress}%</span>
            </div>
            <Progress value={achievement.progress} className="h-2" />

            {achievement.isCustom && !achievement.completed && (
              <div className="mt-3">
                {isUpdating ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={progressValue}
                      onChange={(e) => setProgressValue(Number(e.target.value))}
                      min={0}
                      max={achievement.targetValue}
                      className="w-20 h-8 px-2 border rounded text-sm"
                    />
                    <span className="text-xs text-gray-500">/ {achievement.targetValue}</span>
                    <Button
                      size="sm"
                      onClick={handleProgressUpdate}
                      className="ml-auto h-8 bg-purple-600 hover:bg-purple-700"
                    >
                      Update
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {achievement.currentValue} / {achievement.targetValue} completed
                    </span>
                    <Button variant="outline" size="sm" onClick={() => setIsUpdating(true)} className="h-7 text-xs">
                      Update Progress
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>Category: {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}</span>
              <span className="text-purple-600">+{achievement.xpReward} XP</span>
            </div>
            {achievement.completed && achievement.date && (
              <div className="text-xs text-gray-500 mt-1">
                Unlocked on{" "}
                {typeof achievement.date === "string"
                  ? achievement.date
                  : new Date(achievement.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
