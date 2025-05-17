"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Trophy, CalendarIcon, BookOpen, BarChart } from "lucide-react"
import CharacterViewer from "@/components/character-viewer"
import DashboardLayout from "@/components/dashboard-layout"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import TaskCompletionPopup from "@/components/task-completion-popup"
import { useTasks } from "@/components/task-context"
import DashboardReflectionPrompt from "@/components/dashboard-reflection-prompt"
import NotificationCenter from "@/components/notification-center"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [userLevel, setUserLevel] = useState(5)
  const [xpProgress, setXpProgress] = useState(65)
  const { toast } = useToast()
  const { tasks, toggleTaskCompletion, completionPopup, hideCompletionPopup } = useTasks()
  const [showMintSuccess, setShowMintSuccess] = useState(false)

  // Filter for today's tasks
  const todayTasks = tasks
    .filter((task) => {
      // Include tasks due today or overdue and not completed
      const taskDate = new Date(task.dueDate).toDateString()
      const today = new Date().toDateString()
      return taskDate === today || (new Date(task.dueDate) < new Date() && !task.completed)
    })
    .slice(0, 4) // Limit to 4 tasks for the dashboard

  // Mock user data
  const user = {
    name: "Alex Johnson",
    character: "cyberpunk",
    fields: ["JEE Preparation", "Fitness"],
    wellnessData: {
      sleep: "7h 30m",
      avgSleep: "7.2h",
      mood: "happy",
      avgMood: "positive",
      workoutStreak: 3,
      avgEnergy: 3.8,
      lastCheckIn: "Today",
    },
    achievements: [
      { id: 1, title: "First Week Streak", description: "Completed tasks for 7 consecutive days", date: "2025-05-10" },
      { id: 2, title: "Physics Master", description: "Completed all physics modules", date: "2025-05-08" },
    ],
  }

  // Update XP progress when a task is completed
  useEffect(() => {
    if (completionPopup.isVisible) {
      setXpProgress((prev) => Math.min(prev + 10, 100))
    }
  }, [completionPopup.isVisible])

  // Check if user is returning from mint page
  useEffect(() => {
    const checkMintReturn = () => {
      const mintParam = new URLSearchParams(window.location.search).get("mint")
      if (mintParam === "success") {
        setShowMintSuccess(true)
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }

    checkMintReturn()
  }, [])

  const handleMintNFT = () => {
    // Open the Magic Eden mint page in a new tab
    window.open("https://magiceden.io/mint-terminal/base/0x2f71b1e6c98a2090af07d10789348cbfc02b78d0", "_blank")

    // Show success popup after a short delay (simulating return from mint page)
    setTimeout(() => {
      setShowMintSuccess(true)
    }, 1000)
  }

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <NotificationCenter />
              </div>
              <Button variant="outline" size="sm">
                <CalendarIcon className="mr-2 h-4 w-4" /> Today
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Character Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="col-span-full lg:col-span-1 lg:row-span-2"
            >
              <Card className="overflow-hidden relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <CardHeader className="relative">
                  <div className="flex justify-between items-center">
                    <CardTitle>Your Character</CardTitle>
                    <Button
                      onClick={handleMintNFT}
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Mint NFT
                    </Button>
                  </div>
                  <CardDescription>Level {userLevel} Cyberpunk Explorer</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center relative">
                  <div className="w-full h-[300px] bg-gradient-to-b from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
                    <CharacterViewer character={user.character} level={userLevel} />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between relative">
                  <div className="w-full">
                    <p className="text-sm text-gray-500">Next reward at level {userLevel + 1}</p>
                    <Progress
                      value={xpProgress}
                      className="h-2 mt-2 bg-purple-100"
                      indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  </div>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Rest of the dashboard content remains the same */}
            {/* Daily Tasks Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="col-span-full md:col-span-1"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Today's Tasks</CardTitle>
                  <CardDescription>Complete tasks to earn XP</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {todayTasks.map((task) => (
                      <li key={task.id} className="flex items-start space-x-2">
                        <div className="pt-1">
                          <input
                            type="checkbox"
                            id={`task-${task.id}`}
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(task.id)}
                            className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                          />
                        </div>
                        <div className="flex-1">
                          <label
                            htmlFor={`task-${task.id}`}
                            className={`font-medium ${task.completed ? "line-through text-gray-400" : ""}`}
                          >
                            {task.title}
                          </label>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="text-xs">
                              {task.field}
                            </Badge>
                            <span className="ml-auto text-xs text-gray-500">+{task.xp} XP</span>
                          </div>
                        </div>
                      </li>
                    ))}
                    {todayTasks.length === 0 && (
                      <li className="text-center py-2 text-gray-500">
                        No tasks for today. Add some from the Tasks page!
                      </li>
                    )}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/tasks">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">View All Tasks</Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Wellness Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="col-span-full md:col-span-1"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Wellness Tracker</CardTitle>
                  <CardDescription>Your daily wellness summary</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-purple-50 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Avg Sleep</p>
                      <p className="text-xl font-bold text-purple-600">{user.wellnessData.avgSleep}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Workout Streak</p>
                      <p className="text-xl font-bold text-green-600">{user.wellnessData.workoutStreak} days</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Avg Mood</p>
                      <p className="text-xl font-bold text-blue-600 capitalize">{user.wellnessData.avgMood}</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Avg Energy</p>
                      <p className="text-xl font-bold text-amber-600">{user.wellnessData.avgEnergy}/5</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Link href="/journal?tab=check-in">
                      <Button variant="outline" className="w-full justify-start">
                        <CheckCircle className="mr-2 h-4 w-4" /> Daily Check-in
                      </Button>
                    </Link>
                    <Link href="/journal">
                      <Button variant="outline" className="w-full justify-start">
                        <BookOpen className="mr-2 h-4 w-4" /> Journal Entry
                      </Button>
                    </Link>
                    <Link href="/journal?tab=reports">
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart className="mr-2 h-4 w-4" /> Wellness Reports
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="col-span-full"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                  <CardDescription>Milestones you've reached on your journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {user.achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <Trophy className="h-5 w-5 text-purple-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium">{achievement.title}</h3>
                          <p className="text-sm text-gray-500">{achievement.description}</p>
                          <p className="text-xs text-gray-400 mt-1">Unlocked on {achievement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/achievements">
                    <Button variant="outline" className="w-full">
                      View All Achievements
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>

      {/* NFT Mint Success Dialog */}
      <Dialog open={showMintSuccess} onOpenChange={setShowMintSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">NFT Mint Successful!</DialogTitle>
            <DialogDescription className="text-center">
              Your character NFT has been successfully minted and added to your wallet.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <div className="flex justify-center">
            <Button onClick={() => setShowMintSuccess(false)} className="bg-purple-600 hover:bg-purple-700">
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task completion popup */}
      <TaskCompletionPopup
        isVisible={completionPopup.isVisible}
        xp={completionPopup.xp}
        onClose={hideCompletionPopup}
      />
      {/* Daily reflection prompt */}
      <DashboardReflectionPrompt />
    </DashboardLayout>
  )
}
