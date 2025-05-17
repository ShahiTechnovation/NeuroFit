"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, CalendarIcon, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

export default function SchedulePage() {
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    field: "",
    startTime: "09:00",
    endTime: "10:00",
    date: new Date().toISOString().split("T")[0],
  })
  const [scheduleEvents, setScheduleEvents] = useState([
    {
      id: 1,
      title: "Physics Study Session",
      description: "Focus on mechanics and thermodynamics",
      field: "JEE Preparation",
      date: "2025-05-16",
      startTime: "09:00",
      endTime: "11:00",
    },
    {
      id: 2,
      title: "Cardio Workout",
      description: "30 minutes of running or cycling",
      field: "Fitness",
      date: "2025-05-16",
      startTime: "17:00",
      endTime: "17:30",
    },
    {
      id: 3,
      title: "Meditation",
      description: "Mindfulness practice",
      field: "Mindfulness",
      date: "2025-05-16",
      startTime: "20:00",
      endTime: "20:15",
    },
    {
      id: 4,
      title: "Math Problem Solving",
      description: "Practice calculus problems",
      field: "JEE Preparation",
      date: "2025-05-17",
      startTime: "10:00",
      endTime: "12:00",
    },
    {
      id: 5,
      title: "Coding Practice",
      description: "Work on algorithm challenges",
      field: "Coding",
      date: "2025-05-17",
      startTime: "14:00",
      endTime: "16:00",
    },
    {
      id: 6,
      title: "Strength Training",
      description: "Focus on upper body",
      field: "Fitness",
      date: "2025-05-18",
      startTime: "18:00",
      endTime: "19:00",
    },
  ])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewEvent({ ...newEvent, [name]: value })
  }

  const handleSelectChange = (name, value) => {
    setNewEvent({ ...newEvent, [name]: value })
  }

  const handleAddEvent = () => {
    const newEventWithId = {
      ...newEvent,
      id: Date.now(),
    }

    setScheduleEvents([...scheduleEvents, newEventWithId])
    setIsAddEventDialogOpen(false)

    toast({
      title: "Event added",
      description: `${newEvent.title} has been added to your schedule.`,
    })

    // Reset form
    setNewEvent({
      title: "",
      description: "",
      field: "",
      startTime: "09:00",
      endTime: "10:00",
      date: new Date().toISOString().split("T")[0],
    })
  }

  const handleDeleteEvent = (eventId) => {
    setScheduleEvents(scheduleEvents.filter((event) => event.id !== eventId))

    toast({
      title: "Event deleted",
      description: "The event has been removed from your schedule.",
    })
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${ampm}`
  }

  const getFieldColor = (field) => {
    switch (field) {
      case "JEE Preparation":
        return "bg-blue-100 text-blue-800"
      case "Fitness":
        return "bg-green-100 text-green-800"
      case "Coding":
        return "bg-purple-100 text-purple-800"
      case "Mindfulness":
        return "bg-teal-100 text-teal-800"
      case "UPSC":
        return "bg-amber-100 text-amber-800"
      case "NEET":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get events for the selected date
  const selectedDateStr = selectedDate.toISOString().split("T")[0]
  const eventsForSelectedDate = scheduleEvents.filter((event) => event.date === selectedDateStr)

  // Get dates with events for highlighting in calendar
  const datesWithEvents = scheduleEvents.map((event) => new Date(event.date))

  // Format the selected date for display
  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Navigation for date
  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate)
    prevDay.setDate(prevDay.getDate() - 1)
    setSelectedDate(prevDay)
  }

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate)
    nextDay.setDate(nextDay.getDate() + 1)
    setSelectedDate(nextDay)
  }

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Schedule</h1>
            <div className="flex items-center space-x-2">
              <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                    <DialogDescription>Schedule a new event for your personal development journey.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Event Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={newEvent.title}
                        onChange={handleInputChange}
                        placeholder="Enter event title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={newEvent.description}
                        onChange={handleInputChange}
                        placeholder="Enter event description"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="field">Field</Label>
                      <Select
                        onValueChange={(value) => handleSelectChange("field", value)}
                        defaultValue={newEvent.field}
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
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" name="date" type="date" value={newEvent.date} onChange={handleInputChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                          id="startTime"
                          name="startTime"
                          type="time"
                          value={newEvent.startTime}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                          id="endTime"
                          name="endTime"
                          type="time"
                          value={newEvent.endTime}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddEventDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddEvent}
                      disabled={
                        !newEvent.title || !newEvent.field || !newEvent.date || !newEvent.startTime || !newEvent.endTime
                      }
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Add Event
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Calendar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>Select a date to view your schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    modifiers={{
                      hasEvent: datesWithEvents,
                    }}
                    modifiersStyles={{
                      hasEvent: {
                        backgroundColor: "#f3e8ff",
                        borderRadius: "50%",
                      },
                    }}
                  />
                </CardContent>
                <CardFooter>
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="w-3 h-3 rounded-full bg-purple-100 mr-2"></div>
                    <span>Dates with scheduled events</span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Daily Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Daily Schedule</CardTitle>
                      <CardDescription>
                        <div className="flex items-center mt-1">
                          <Button variant="ghost" size="icon" onClick={goToPreviousDay}>
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <span>{formattedDate}</span>
                          <Button variant="ghost" size="icon" onClick={goToNextDay}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNewEvent({ ...newEvent, date: selectedDateStr })
                        setIsAddEventDialogOpen(true)
                      }}
                    >
                      <Plus className="mr-2 h-3 w-3" /> Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <AnimatePresence>
                      {eventsForSelectedDate.length > 0 ? (
                        eventsForSelectedDate
                          .sort((a, b) => a.startTime.localeCompare(b.startTime))
                          .map((event) => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.3 }}
                              className="flex items-start space-x-4 p-3 rounded-lg border hover:shadow-md transition-shadow"
                            >
                              <div className="flex-shrink-0 flex flex-col items-center justify-center">
                                <div className="text-sm font-medium">{formatTime(event.startTime)}</div>
                                <div className="h-14 w-0.5 bg-gray-200 my-1"></div>
                                <div className="text-sm font-medium">{formatTime(event.endTime)}</div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-medium">{event.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge className={getFieldColor(event.field)}>{event.field}</Badge>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-gray-400 hover:text-red-500"
                                      onClick={() => handleDeleteEvent(event.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))
                      ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                          <CalendarIcon className="mx-auto h-12 w-12 text-gray-300" />
                          <p className="mt-2 text-gray-500">No events scheduled for this day.</p>
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => {
                              setNewEvent({ ...newEvent, date: selectedDateStr })
                              setIsAddEventDialogOpen(true)
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" /> Add Event
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Weekly Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="md:col-span-3"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Overview</CardTitle>
                  <CardDescription>Your schedule for the week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 7 }).map((_, index) => {
                      const date = new Date(selectedDate)
                      date.setDate(date.getDate() - date.getDay() + index)
                      const dateStr = date.toISOString().split("T")[0]
                      const eventsForDay = scheduleEvents.filter((event) => event.date === dateStr)
                      const isToday = new Date().toISOString().split("T")[0] === dateStr
                      const isSelected = selectedDate.toISOString().split("T")[0] === dateStr

                      return (
                        <div
                          key={index}
                          className={`p-2 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                            isToday ? "bg-purple-50 border-purple-200" : ""
                          } ${isSelected ? "ring-2 ring-purple-500" : ""}`}
                          onClick={() => setSelectedDate(new Date(date))}
                        >
                          <div className="text-center mb-2">
                            <div className="text-xs text-gray-500">
                              {date.toLocaleDateString("en-US", { weekday: "short" })}
                            </div>
                            <div className={`text-sm font-medium ${isToday ? "text-purple-600" : ""}`}>
                              {date.getDate()}
                            </div>
                          </div>
                          <div className="space-y-1">
                            {eventsForDay.slice(0, 2).map((event) => (
                              <div key={event.id} className="text-xs p-1 rounded bg-gray-50 truncate">
                                <div className="flex items-center">
                                  <div className={`w-2 h-2 rounded-full mr-1 ${getFieldColor(event.field)}`}></div>
                                  <span className="truncate">{event.title}</span>
                                </div>
                              </div>
                            ))}
                            {eventsForDay.length > 2 && (
                              <div className="text-xs text-center text-gray-500">+{eventsForDay.length - 2} more</div>
                            )}
                            {eventsForDay.length === 0 && (
                              <div className="text-xs text-center text-gray-400 py-1">No events</div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  )
}
