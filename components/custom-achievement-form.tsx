"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Trophy, Target, Dumbbell, BookOpen, Code, Brain, Zap } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export type CustomAchievement = {
  id: string
  title: string
  description: string
  category: string
  targetValue: number
  currentValue: number
  icon: string
  createdAt: Date
  completed: boolean
  xpReward: number
}

type CustomAchievementFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (achievement: Omit<CustomAchievement, "id" | "createdAt" | "completed">) => void
}

export default function CustomAchievementForm({ open, onOpenChange, onSave }: CustomAchievementFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    targetValue: 100,
    currentValue: 0,
    icon: "trophy",
    xpReward: 200,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData({ ...formData, [name]: value[0] })
  }

  const handleSubmit = () => {
    onSave(formData)
    setFormData({
      title: "",
      description: "",
      category: "general",
      targetValue: 100,
      currentValue: 0,
      icon: "trophy",
      xpReward: 200,
    })
    onOpenChange(false)
  }

  const iconOptions = [
    { value: "trophy", label: "Trophy", icon: <Trophy className="h-4 w-4" /> },
    { value: "target", label: "Target", icon: <Target className="h-4 w-4" /> },
    { value: "dumbbell", label: "Fitness", icon: <Dumbbell className="h-4 w-4" /> },
    { value: "book", label: "Study", icon: <BookOpen className="h-4 w-4" /> },
    { value: "code", label: "Coding", icon: <Code className="h-4 w-4" /> },
    { value: "brain", label: "Mindfulness", icon: <Brain className="h-4 w-4" /> },
    { value: "calendar", label: "Streak", icon: <Calendar className="h-4 w-4" /> },
    { value: "zap", label: "Energy", icon: <Zap className="h-4 w-4" /> },
  ]

  const getIconComponent = (iconName: string) => {
    const option = iconOptions.find((option) => option.value === iconName)
    return option ? option.icon : <Trophy className="h-4 w-4" />
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Custom Achievement</DialogTitle>
          <DialogDescription>
            Define your own achievement to track your progress toward personal goals.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Achievement Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Marathon Runner"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="e.g., Run a total of 100 kilometers"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="coding">Coding</SelectItem>
                  <SelectItem value="mindfulness">Mindfulness</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="icon">Icon</Label>
              <Select value={formData.icon} onValueChange={(value) => handleSelectChange("icon", value)}>
                <SelectTrigger id="icon">
                  <SelectValue placeholder="Select icon">
                    <div className="flex items-center gap-2">
                      {getIconComponent(formData.icon)}
                      <span>{iconOptions.find((option) => option.value === formData.icon)?.label}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {option.icon}
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="targetValue">Target Value (Progress Goal)</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="targetValue"
                min={1}
                max={1000}
                step={1}
                value={[formData.targetValue]}
                onValueChange={(value) => handleSliderChange("targetValue", value)}
                className="flex-1"
              />
              <Input
                type="number"
                name="targetValue"
                value={formData.targetValue}
                onChange={handleInputChange}
                className="w-20"
                min={1}
                max={1000}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="xpReward">XP Reward</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="xpReward"
                min={50}
                max={500}
                step={10}
                value={[formData.xpReward]}
                onValueChange={(value) => handleSliderChange("xpReward", value)}
                className="flex-1"
              />
              <Input
                type="number"
                name="xpReward"
                value={formData.xpReward}
                onChange={handleInputChange}
                className="w-20"
                min={50}
                max={500}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.title || !formData.description}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Create Achievement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
