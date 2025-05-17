"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Save, BookOpen, CheckSquare, BarChart, Sparkles } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import JournalEntryList from "@/components/journal-entry-list"
import DailyCheckInForm from "@/components/daily-check-in-form"
import JournalCheckInCard from "@/components/journal-check-in-card"
import { motion } from "framer-motion"
import { useReflections } from "@/components/reflection-data-storage"
import ReflectionReports from "@/components/reflection-reports"

export default function JournalPage() {
  const { toast } = useToast()
  const { reflections, addReflection, hasReflectedToday } = useReflections()
  const [activeTab, setActiveTab] = useState("journal")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [journalEntry, setJournalEntry] = useState("")
  const [journalEntries, setJournalEntries] = useState([])
  const [datesWithEntries, setDatesWithEntries] = useState([])

  // Mock data for initial state
  useEffect(() => {
    // Simulate loading data from a database
    const mockJournalEntries = [
      {
        id: 1,
        date: new Date(Date.now() - 86400000 * 2), // 2 days ago
        content:
          "Today was a productive day. I completed my physics assignment and had a great workout session. Feeling motivated to keep going!",
      },
      {
        id: 2,
        date: new Date(Date.now() - 86400000), // 1 day ago
        content:
          "Struggled a bit with calculus today, but I'm not giving up. My workout was shorter than planned, but at least I did something. Tomorrow will be better.",
      },
    ]

    setJournalEntries(mockJournalEntries)

    // Set dates with entries for calendar highlighting
    const entryDates = mockJournalEntries.map((entry) => new Date(entry.date))
    setDatesWithEntries(entryDates)

    // Check if there's a tab parameter in the URL
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get("tab")
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [])

  // Load journal entry for selected date
  useEffect(() => {
    const selectedDateStart = new Date(selectedDate).setHours(0, 0, 0, 0)
    const selectedDateEnd = new Date(selectedDate).setHours(23, 59, 59, 999)

    const entry = journalEntries.find(
      (entry) => entry.date >= new Date(selectedDateStart) && entry.date <= new Date(selectedDateEnd),
    )

    if (entry) {
      setJournalEntry(entry.content)
    } else {
      setJournalEntry("")
    }
  }, [selectedDate, journalEntries])

  const handleSaveJournal = () => {
    if (!journalEntry.trim()) {
      toast({
        title: "Entry cannot be empty",
        description: "Please write something before saving.",
        variant: "destructive",
      })
      return
    }

    const selectedDateStart = new Date(selectedDate).setHours(0, 0, 0, 0)
    const selectedDateEnd = new Date(selectedDate).setHours(23, 59, 59, 999)

    const existingEntryIndex = journalEntries.findIndex(
      (entry) => entry.date >= new Date(selectedDateStart) && entry.date <= new Date(selectedDateEnd),
    )

    if (existingEntryIndex >= 0) {
      // Update existing entry
      const updatedEntries = [...journalEntries]
      updatedEntries[existingEntryIndex] = {
        ...updatedEntries[existingEntryIndex],
        content: journalEntry,
      }
      setJournalEntries(updatedEntries)
    } else {
      // Create new entry
      const newEntry = {
        id: Date.now(),
        date: new Date(selectedDate),
        content: journalEntry,
      }
      setJournalEntries([...journalEntries, newEntry])

      // Update dates with entries
      setDatesWithEntries([...datesWithEntries, new Date(selectedDate)])
    }

    toast({
      title: "Journal entry saved",
      description: `Your entry for ${format(selectedDate, "MMMM d, yyyy")} has been saved.`,
    })
  }

  // Update the handleCheckInSubmit function to record check-in time and add to reflections
  const handleCheckInSubmit = (data) => {
    const timestamp = new Date().toISOString()

    // Add to reflections context
    addReflection({
      date: new Date().toISOString(),
      timestamp,
      responses: data,
    })

    toast({
      title: "Check-in complete",
      description: "Your daily check-in has been recorded.",
    })
  }

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Journal & Wellness</h1>
            <div className="flex items-center space-x-2">
              {activeTab === "journal" && (
                <Button onClick={handleSaveJournal} className="bg-purple-600 hover:bg-purple-700">
                  <Save className="mr-2 h-4 w-4" /> Save Entry
                </Button>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <Tabs defaultValue="journal" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
              <TabsTrigger value="journal" className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" /> Journal
              </TabsTrigger>
              <TabsTrigger value="check-in" className="flex items-center">
                <CheckSquare className="mr-2 h-4 w-4" /> Daily Check-in
              </TabsTrigger>
              <TabsTrigger value="reflection" className="flex items-center">
                <Sparkles className="mr-2 h-4 w-4" /> Reflection
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center">
                <BarChart className="mr-2 h-4 w-4" /> Reports
              </TabsTrigger>
            </TabsList>

            {/* Journal Tab */}
            <TabsContent value="journal">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid gap-6 md:grid-cols-3"
              >
                {/* Calendar card */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <Card className="md:col-span-1">
                    <CardHeader>
                      <CardTitle>Calendar</CardTitle>
                      <CardDescription>Select a date to view or create an entry</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                        modifiers={{
                          hasEntry: datesWithEntries,
                        }}
                        modifiersStyles={{
                          hasEntry: {
                            backgroundColor: "#f3e8ff",
                            borderRadius: "50%",
                          },
                        }}
                      />
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-center text-xs text-gray-500">
                        <div className="w-3 h-3 rounded-full bg-purple-100 mr-2"></div>
                        <span>Dates with journal entries</span>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>

                {/* Journal entry card */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Journal Entry</CardTitle>
                      <CardDescription>
                        {format(selectedDate, "EEEE, MMMM d, yyyy")}
                        {selectedDate.toDateString() === new Date().toDateString() && (
                          <Badge className="ml-2 bg-green-100 text-green-800">Today</Badge>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Write your thoughts, reflections, and experiences for the day..."
                        className="min-h-[300px]"
                        value={journalEntry}
                        onChange={(e) => setJournalEntry(e.target.value)}
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Recent entries card */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <Card className="md:col-span-3">
                    <CardHeader>
                      <CardTitle>Recent Entries</CardTitle>
                      <CardDescription>Your journal entries from the past week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <JournalEntryList entries={journalEntries} onSelectDate={setSelectedDate} />
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* Daily Check-in Tab */}
            <TabsContent value="check-in">
              {hasReflectedToday ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Check-in Complete</CardTitle>
                    <CardDescription>You've already completed your check-in for today</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                      <CheckSquare className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Thank you for checking in!</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Your daily wellness data has been recorded. Come back tomorrow for your next check-in.
                    </p>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Button variant="outline" onClick={() => (window.location.href = "/journal/indirect-check-in")}>
                      Check in again anyway
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <DailyCheckInForm onSubmit={handleCheckInSubmit} />
              )}
            </TabsContent>

            {/* Reflection Tab */}
            <TabsContent value="reflection">
              <div className="max-w-md mx-auto">
                <JournalCheckInCard hasCheckedInToday={hasReflectedToday} />
              </div>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports">
              <ReflectionReports />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </DashboardLayout>
  )
}
