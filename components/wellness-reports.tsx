"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, subDays, eachDayOfInterval, startOfDay, endOfDay } from "date-fns"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function WellnessReports({ checkInData }) {
  const [timeRange, setTimeRange] = useState("week")

  // Calculate date range based on selected time range
  const getDateRange = () => {
    const today = new Date()
    switch (timeRange) {
      case "week":
        return { start: subDays(today, 7), end: today }
      case "month":
        return { start: subDays(today, 30), end: today }
      case "3months":
        return { start: subDays(today, 90), end: today }
      default:
        return { start: subDays(today, 7), end: today }
    }
  }

  const dateRange = getDateRange()

  // Generate array of dates in the selected range
  const datesInRange = eachDayOfInterval({
    start: dateRange.start,
    end: dateRange.end,
  })

  // Prepare data for charts
  const prepareChartData = () => {
    return datesInRange.map((date) => {
      const dayStart = startOfDay(date)
      const dayEnd = endOfDay(date)

      // Find check-in data for this date
      const dayData = checkInData.find((data) => data.date >= dayStart && data.date <= dayEnd)

      return {
        date: format(date, "MMM dd"),
        sleepHours: dayData ? dayData.sleepHours + dayData.sleepMinutes / 60 : null,
        mood: dayData ? dayData.mood : null,
        didWorkout: dayData ? dayData.didWorkout : false,
        dayRating: dayData ? dayData.dayRating : null,
        energyLevel: dayData ? dayData.energyLevel : null,
        stressLevel: dayData ? dayData.stressLevel : null,
      }
    })
  }

  const chartData = prepareChartData()

  // Calculate workout statistics
  const workoutStats = () => {
    const workoutDays = checkInData.filter((data) => data.didWorkout).length
    const totalDays = checkInData.length

    return [
      { name: "Workout Days", value: workoutDays },
      { name: "Rest Days", value: totalDays - workoutDays },
    ]
  }

  // Calculate mood distribution
  const moodDistribution = () => {
    const moodCounts = checkInData.reduce((acc, data) => {
      acc[data.mood] = (acc[data.mood] || 0) + 1
      return acc
    }, {})

    return Object.entries(moodCounts).map(([mood, count]) => ({
      name: mood.replace("-", " "),
      value: count,
    }))
  }

  // Colors for charts
  const COLORS = ["#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"]
  const MOOD_COLORS = {
    "very-happy": "#10b981",
    happy: "#34d399",
    neutral: "#f59e0b",
    sad: "#f87171",
    "very-sad": "#ef4444",
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Wellness Reports</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
            <SelectItem value="3months">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="sleep">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="mood">Mood & Energy</TabsTrigger>
          <TabsTrigger value="workout">Workouts</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        {/* Sleep Tab */}
        <TabsContent value="sleep">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Patterns</CardTitle>
              <CardDescription>Track your sleep duration over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 12]} label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={(value) => [`${value.toFixed(1)} hours`, "Sleep Duration"]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sleepHours"
                      stroke="#8b5cf6"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                      name="Sleep Duration"
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-500">Average Sleep</p>
                  <p className="text-xl font-bold text-purple-600">
                    {chartData.filter((d) => d.sleepHours !== null).reduce((sum, d) => sum + d.sleepHours, 0) /
                      chartData.filter((d) => d.sleepHours !== null).length || 0}
                    h
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-500">Most Sleep</p>
                  <p className="text-xl font-bold text-purple-600">
                    {Math.max(...(chartData.filter((d) => d.sleepHours !== null).map((d) => d.sleepHours) || [0]))}h
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-500">Least Sleep</p>
                  <p className="text-xl font-bold text-purple-600">
                    {Math.min(
                      ...(chartData
                        .filter((d) => d.sleepHours !== null && d.sleepHours > 0)
                        .map((d) => d.sleepHours) || [0]),
                    )}
                    h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mood Tab */}
        <TabsContent value="mood">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Mood Trends</CardTitle>
                <CardDescription>Track your mood changes over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
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
                      <Bar dataKey="dayRating" name="Day Rating" fill="#8b5cf6" />
                      <Bar dataKey="energyLevel" name="Energy Level" fill="#3b82f6" />
                      <Bar dataKey="stressLevel" name="Stress Level" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mood Distribution</CardTitle>
                <CardDescription>How your mood has been distributed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={moodDistribution()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {moodDistribution().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={MOOD_COLORS[entry.name.replace(" ", "-")] || COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} days`, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Workout Tab */}
        <TabsContent value="workout">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Workout Frequency</CardTitle>
                <CardDescription>Days with workouts vs rest days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={workoutStats()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#f59e0b" />
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} days`, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workout Timeline</CardTitle>
                <CardDescription>Days when you worked out</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 1]} ticks={[0, 1]} />
                      <Tooltip formatter={(value) => [value ? "Yes" : "No", "Workout"]} />
                      <Legend />
                      <Bar dataKey="didWorkout" name="Workout" fill="#10b981">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.didWorkout ? "#10b981" : "#f3f4f6"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Wellness Overview</CardTitle>
              <CardDescription>Comprehensive view of your wellness metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
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
                      dataKey="sleepHours"
                      stroke="#8b5cf6"
                      name="Sleep (hours)"
                      strokeWidth={2}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="dayRating"
                      stroke="#ec4899"
                      name="Day Rating"
                      strokeWidth={2}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="energyLevel"
                      stroke="#3b82f6"
                      name="Energy Level"
                      strokeWidth={2}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="stressLevel"
                      stroke="#ef4444"
                      name="Stress Level"
                      strokeWidth={2}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-500">Avg Sleep</p>
                  <p className="text-xl font-bold text-purple-600">
                    {(
                      chartData.filter((d) => d.sleepHours !== null).reduce((sum, d) => sum + d.sleepHours, 0) /
                        chartData.filter((d) => d.sleepHours !== null).length || 0
                    ).toFixed(1)}
                    h
                  </p>
                </div>
                <div className="p-3 bg-pink-50 rounded-lg">
                  <p className="text-sm text-gray-500">Avg Day Rating</p>
                  <p className="text-xl font-bold text-pink-600">
                    {(
                      chartData.filter((d) => d.dayRating !== null).reduce((sum, d) => sum + d.dayRating, 0) /
                        chartData.filter((d) => d.dayRating !== null).length || 0
                    ).toFixed(1)}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-500">Avg Energy</p>
                  <p className="text-xl font-bold text-blue-600">
                    {(
                      chartData.filter((d) => d.energyLevel !== null).reduce((sum, d) => sum + d.energyLevel, 0) /
                        chartData.filter((d) => d.energyLevel !== null).length || 0
                    ).toFixed(1)}
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-500">Avg Stress</p>
                  <p className="text-xl font-bold text-red-600">
                    {(
                      chartData.filter((d) => d.stressLevel !== null).reduce((sum, d) => sum + d.stressLevel, 0) /
                        chartData.filter((d) => d.stressLevel !== null).length || 0
                    ).toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
