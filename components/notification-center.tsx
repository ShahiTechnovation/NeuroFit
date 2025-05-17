"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Bell, X, Zap, Calendar, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { motion, AnimatePresence } from "framer-motion"

// Notification types
type Notification = {
  id: string
  type: "reminder" | "suggestion" | "motivation" | "achievement"
  title: string
  message: string
  time: Date
  read: boolean
  icon?: React.ReactNode
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  // Motivational quotes
  const motivationalQuotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "It does not matter how slowly you go as long as you do not stop. - Confucius",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
    "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
    "The way to get started is to quit talking and begin doing. - Walt Disney",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "The secret of getting ahead is getting started. - Mark Twain",
  ]

  // Suggestions
  const suggestions = [
    "Try to drink more water today!",
    "Take a 5-minute break to stretch every hour.",
    "Consider going for a short walk during lunch.",
    "Have you practiced mindfulness today?",
    "Try the Pomodoro technique for better focus.",
    "Remember to maintain good posture while studying.",
    "Consider reviewing your notes before bed for better retention.",
    "Try a new workout routine to challenge yourself.",
    "Set specific goals for today to stay focused.",
    "Remember to celebrate your small wins!",
  ]

  // Reminders
  const reminders = [
    "Don't forget to complete your daily tasks!",
    "Have you updated your journal today?",
    "Time to check your progress on your goals.",
    "Remember to track your water intake.",
    "It's a good time to review your weekly goals.",
    "Don't forget to take breaks between study sessions.",
    "Check if you've completed your fitness goals for the day.",
    "Time to plan your schedule for tomorrow.",
    "Have you reflected on what you learned today?",
    "Remember to get enough sleep tonight!",
  ]

  useEffect(() => {
    // Generate random notifications on first load
    const initialNotifications: Notification[] = []

    // Add a motivational quote
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    initialNotifications.push({
      id: `motivation-${Date.now()}`,
      type: "motivation",
      title: "Daily Motivation",
      message: randomQuote,
      time: new Date(),
      read: false,
      icon: <Zap className="h-4 w-4 text-yellow-500" />,
    })

    // Add a suggestion
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
    initialNotifications.push({
      id: `suggestion-${Date.now() + 1}`,
      type: "suggestion",
      title: "Wellness Suggestion",
      message: randomSuggestion,
      time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      icon: <Heart className="h-4 w-4 text-pink-500" />,
    })

    // Add a reminder
    const randomReminder = reminders[Math.floor(Math.random() * reminders.length)]
    initialNotifications.push({
      id: `reminder-${Date.now() + 2}`,
      type: "reminder",
      title: "Daily Reminder",
      message: randomReminder,
      time: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      read: false,
      icon: <Calendar className="h-4 w-4 text-blue-500" />,
    })

    setNotifications(initialNotifications)
    setUnreadCount(initialNotifications.length)
  }, [])

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
    setUnreadCount(0)
  }

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const removeNotification = (id: string) => {
    const notification = notifications.find((n) => n.id === id)
    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    } else {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          <AnimatePresence>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`relative p-4 ${notification.read ? "" : "bg-purple-50"}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {notification.icon || <Bell className="h-4 w-4 text-gray-500" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 -mr-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeNotification(notification.id)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">{notification.message}</p>
                      <p className="text-xs text-gray-400">{formatTime(notification.time)}</p>
                    </div>
                  </div>
                  <Separator className="mt-4" />
                </motion.div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p>No notifications</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </PopoverContent>
    </Popover>
  )
}
