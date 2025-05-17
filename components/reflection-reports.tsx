"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useReflections } from "@/components/reflection-data-storage"

export default function ReflectionReports() {
  const { reflections } = useReflections()
  const [timeRange, setTimeRange] = useState("week")

  // Calculate date range based on selected time range
  const getDateRange = () => {
    const today = new Date()
    switch (timeRange) {
      case "week":
        return { start: startOfWeek(today), end: endOfWeek(today) }
      case "month":
        return { start: startOfMonth(today), end: endOfMonth(today) }
      case "3months":
        return { start: subDays(today, 90), end: today }
      default:
        return { start: startOfWeek(today), end: endOfWeek(today) }
    }
  }

  const dateRange = getDateRange()

  // Helper functions to map string values to numeric values for charts
  const mapMoodToValue = (mood?: string) => {
    if (!mood) return null

    const moodMap = {
      "very-happy": 5,
      happy: 4,
      neutral: 3,
      sad: 2,
      "very-sad": 1,
      "😃": 5,
      "😐": 3,
      "😔": 2,
      "😤": 1,
      "😴": 2,
    }

    return moodMap[mood] || null
  }

  const mapEnergyToValue = (drinkChoice?: string) => {
    if (!drinkChoice) return null

    const energyMap = {
      "Espresso shot 🔥": 5,
      "Iced coffee ⚡": 4,
      "Warm latte ☕": 3,
      "Herbal tea 🌿": 2,
      "Just water 💧": 1,
    }

    return energyMap[drinkChoice] || null
  }

  const mapStressToValue = (thought?: string) => {
    if (!thought) return null

    const stressMap = {
      "Let's crush today.": 1,
      "One thing at a time.": 2,
      "I hope nothing breaks.": 3,
      "I'm already behind.": 4,
      "I need a reset button.": 5,
    }

    return stressMap[thought] || null
  }

  const mapSleepToValue = (wakeResponse?: string) => {
    if (!wakeResponse) return null

    const sleepMap = {
      "I woke up before my alarm and felt like a hero": 8,
      "I hit snooze a couple times, but made it": 7,
      "I had to drag myself out of bed": 6,
      "I blinked and it was already noon": 9,
      "Still in bed, mentally": 5,
    }

    return sleepMap[wakeResponse] || null
  }

  // Prepare data for charts
  const prepareChartData = () => {
    const datesInRange = eachDayOfInterval({
      start: dateRange.start,
      end: dateRange.end,
    })

    return datesInRange.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd")
      const dayReflections = reflections.filter((r) => r.date.startsWith(dateStr))

      const dayData = dayReflections[0]?.responses || {}

      return {
        date: format(date, "MMM dd"),
        mood: mapMoodToValue(dayData.mood || dayData.mask_choice),
        energy: dayData.energyLevel || mapEnergyToValue(dayData.drink_choice),
        stress: dayData.stressLevel || mapStressToValue(dayData.thought_response),
        sleep: dayData.sleepHours
          ? dayData.sleepHours + (dayData.sleepMinutes || 0) / 60
          : mapSleepToValue(dayData.wake_response),
        dayRating: dayData.dayRating || 0,
        hasData: !!dayReflections.length,
      }
    })
  }

  // Calculate reflection streak
  const calculateStreak = () => {
    if (reflections.length === 0) return 0

    // Sort reflections by date (newest first)
    const sortedReflections = [...reflections].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    let streak = 0
    const currentDate = new Date()

    // Set time to beginning of day for comparison
    currentDate.setHours(0, 0, 0, 0)

    for (let i = 0; i < sortedReflections.length; i++) {
      const reflectionDate = new Date(sortedReflections[i].date)
      reflectionDate.setHours(0, 0, 0, 0)

      // If this reflection is from today, count it and move to yesterday
      if (reflectionDate.getTime() === currentDate.getTime()) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      }
      // If we missed a day, break the streak
      else if (reflectionDate.getTime() < currentDate.getTime()) {
        break
      }
      // If there are multiple reflections for the same day, skip duplicates
      else if (i > 0 && reflectionDate.getTime() === new Date(sortedReflections[i - 1].date).setHours(0, 0, 0, 0)) {
        continue
      }
    }

    return streak
  }

  const currentStreak = calculateStreak()
  const chartData = prepareChartData()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reflection Reports</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="3months">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Reflection Streak</CardTitle>
            <CardDescription>Your current daily reflection streak</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="text-6xl font-bold text-purple-600 mb-2">{currentStreak}</div>
            <p className="text-gray-500">consecutive days</p>
            {currentStreak > 0 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  {currentStreak < 3
                    ? "Great start! Keep going to build your streak."
                    : currentStreak < 7
                      ? "You're building momentum! Keep it up."
                      : "Impressive streak! You're developing a strong habit."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mood & Energy by Date</CardTitle>
            <CardDescription>Track your mood and energy levels over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData.filter((d) => d.hasData)}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="mood" stroke="#8b5cf6" name="Mood" strokeWidth={2} connectNulls />
                  <Line type="monotone" dataKey="energy" stroke="#3b82f6" name="Energy" strokeWidth={2} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sleep Duration by Date</CardTitle>
            <CardDescription>Track your sleep hours over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData.filter((d) => d.hasData)}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sleep"
                    stroke="#8b5cf6"
                    name="Sleep (hours)"
                    strokeWidth={2}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stress & Day Rating by Date</CardTitle>
            <CardDescription>Track your stress levels and day ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData.filter((d) => d.hasData)}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="stress" name="Stress Level" fill="#ef4444" />
                  <Bar dataKey="dayRating" name="Day Rating" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
