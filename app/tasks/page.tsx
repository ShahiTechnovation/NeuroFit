"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Calendar, Filter, ArrowUpDown } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { useTasks } from "@/components/task-context"

export default function TasksPage() {
  const { tasks, addTask, toggleTaskCompletion, completionPopup, hideCompletionPopup } = useTasks()
  const [filterField, setFilterField] = useState("all")
  const [sortBy, setSortBy] = useState("dueDate")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    field: "",
    dueDate: "",
    priority: "medium",
    duration: 30, // in minutes
  })

  const { toast } = useToast()

  const calculateXP = (priority, duration) => {
    // Base XP values by priority
    const baseXP = {
      high: 50,
      medium: 30,
      low: 20,
    }

    // Calculate XP based on duration (longer tasks give more XP)
    // Every 30 minutes adds a percentage of the base XP
    const durationMultiplier = 1 + (Math.min(duration, 240) / 30) * 0.1

    return Math.round(baseXP[priority] * durationMultiplier)
  }

  const handleAddTask = () => {
    const calculatedXP = calculateXP(newTask.priority, newTask.duration)

    const newTaskData = {
      ...newTask,
      completed: false,
      xp: calculatedXP,
    }

    addTask(newTaskData)
    setNewTask({
      title: "",
      description: "",
      field: "",
      dueDate: "",
      priority: "medium",
      duration: 30,
    })

    setIsDialogOpen(false)

    toast({
      title: "Task added",
      description: `${newTask.title} has been added to your tasks.`,
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewTask({ ...newTask, [name]: value })
  }

  const handleSelectChange = (name, value) => {
    setNewTask({ ...newTask, [name]: value })
  }

  const filteredTasks = tasks.filter((task) => {
    if (filterField === "all") return true
    return task.field === filterField
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      return new Date(a.dueDate) - new Date(b.dueDate)
    } else if (sortBy === "priority") {
      const priorityOrder = { high: 1, medium: 2, low: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    } else if (sortBy === "xp") {
      return b.xp - a.xp
    }
    return 0
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-50"
      case "medium":
        return "text-amber-500 bg-amber-50"
      case "low":
        return "text-green-500 bg-green-50"
      default:
        return "text-gray-500 bg-gray-50"
    }
  }

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Tasks</h1>
            <div className="flex items-center space-x-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>Create a new task to track your progress and earn XP.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Task Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={newTask.title}
                        onChange={handleInputChange}
                        placeholder="Enter task title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={newTask.description}
                        onChange={handleInputChange}
                        placeholder="Enter task description"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="field">Field</Label>
                        <Select
                          onValueChange={(value) => handleSelectChange("field", value)}
                          defaultValue={newTask.field}
                        >
                          <SelectTrigger id="field">
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="JEE Preparation">JEE Preparation</SelectItem>
                            <SelectItem value="Fitness">Fitness</SelectItem>
                            <SelectItem value="Coding">Coding</SelectItem>
                            <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                            <SelectItem value="UPSC">UPSC</SelectItem>
                            <SelectItem value="NEET">NEET</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          onValueChange={(value) => handleSelectChange("priority", value)}
                          defaultValue={newTask.priority}
                        >
                          <SelectTrigger id="priority">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          name="dueDate"
                          type="date"
                          value={newTask.dueDate}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          name="duration"
                          type="number"
                          value={newTask.duration}
                          onChange={handleInputChange}
                          min={5}
                          max={480}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddTask}
                      disabled={!newTask.title || !newTask.field || !newTask.dueDate}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Add Task
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Select onValueChange={setFilterField} defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  <SelectItem value="JEE Preparation">JEE Preparation</SelectItem>
                  <SelectItem value="Fitness">Fitness</SelectItem>
                  <SelectItem value="Coding">Coding</SelectItem>
                  <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                  <SelectItem value="UPSC">UPSC</SelectItem>
                  <SelectItem value="NEET">NEET</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setSortBy} defaultValue="dueDate">
                <SelectTrigger className="w-[180px]">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="xp">XP Reward</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {tasks.filter((t) => t.completed).length} of {tasks.length} tasks completed
              </span>
            </div>
          </div>

          <Tabs defaultValue="active">
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <div className="grid gap-4">
                {sortedTasks
                  .filter((task) => !task.completed)
                  .map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={toggleTaskCompletion}
                      priorityColor={getPriorityColor(task.priority)}
                    />
                  ))}
                {sortedTasks.filter((task) => !task.completed).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No active tasks. Great job!</p>
                    <Button onClick={() => setIsDialogOpen(true)} variant="outline" className="mt-4">
                      <Plus className="mr-2 h-4 w-4" /> Add a new task
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="grid gap-4">
                {sortedTasks
                  .filter((task) => task.completed)
                  .map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={toggleTaskCompletion}
                      priorityColor={getPriorityColor(task.priority)}
                    />
                  ))}
                {sortedTasks.filter((task) => task.completed).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No completed tasks yet. Start by completing a task!</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="all">
              <div className="grid gap-4">
                {sortedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={toggleTaskCompletion}
                    priorityColor={getPriorityColor(task.priority)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      {/* Task completion popup */}
      <TaskCompletionPopup
        isVisible={completionPopup.isVisible}
        xp={completionPopup.xp}
        onClose={hideCompletionPopup}
      />
    </DashboardLayout>
  )
}

// Update the TaskCard component to use the shared toggleTaskCompletion function
function TaskCard({ task, onToggle, priorityColor }) {
  const formattedDate = new Date(task.dueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const isOverdue = !task.completed && new Date(task.dueDate) < new Date()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="stagger-item"
    >
      <Card className={`overflow-hidden transition-all ${task.completed ? "bg-gray-50" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <div className="pt-1">
              <input
                type="checkbox"
                id={`task-${task.id}`}
                checked={task.completed}
                onChange={() => onToggle(task.id)}
                className={task.completed ? "text-green-500" : ""}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`font-medium ${task.completed ? "line-through text-gray-400" : ""}`}>{task.title}</h3>
                  <p className={`text-sm mt-1 ${task.completed ? "text-gray-400" : "text-gray-500"}`}>
                    {task.description}
                  </p>
                </div>
                <Badge className={`ml-2 ${priorityColor}`}>{task.priority}</Badge>
              </div>
              <div className="flex items-center mt-3 text-xs">
                <Badge variant="outline">{task.field}</Badge>
                <div className="ml-auto flex items-center space-x-3">
                  <div className={`flex items-center ${isOverdue ? "text-red-500" : "text-gray-500"}`}>
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>
                      {isOverdue ? "Overdue: " : ""}
                      {formattedDate}
                    </span>
                  </div>
                  <div className="flex items-center text-purple-600">
                    <span>+{task.xp} XP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function TaskCompletionPopup({ isVisible, xp, onClose }) {
  if (!isVisible) return null

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Task Completed!</DialogTitle>
          <DialogDescription>You've earned +{xp} XP for completing this task.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
