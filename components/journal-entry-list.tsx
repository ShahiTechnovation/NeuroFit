"use client"

import { format, subDays, isAfter } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays } from "lucide-react"

export default function JournalEntryList({ entries, onSelectDate }) {
  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort((a, b) => b.date - a.date)

  // Get entries from the last 7 days
  const oneWeekAgo = subDays(new Date(), 7)
  const recentEntries = sortedEntries.filter((entry) => isAfter(entry.date, oneWeekAgo))

  if (recentEntries.length === 0) {
    return (
      <div className="text-center py-8">
        <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No recent entries</h3>
        <p className="text-gray-500 mb-4">Start journaling to see your entries here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recentEntries.map((entry) => (
        <Card key={entry.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="bg-purple-50 p-4 md:w-48 flex flex-col justify-center items-center md:items-start">
                <div className="text-sm text-gray-500">{format(entry.date, "EEEE")}</div>
                <div className="text-xl font-bold">{format(entry.date, "MMMM d, yyyy")}</div>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => onSelectDate(new Date(entry.date))}>
                  View & Edit
                </Button>
              </div>
              <div className="p-4 flex-1">
                <p className="text-gray-700 line-clamp-3">{entry.content}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
