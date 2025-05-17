"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Calendar, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardReflectionPrompt() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user has already checked in today
    const lastCheckIn = localStorage.getItem("lastCheckInDate")
    const today = new Date().toDateString()

    // If no check-in today, show prompt
    if (lastCheckIn !== today) {
      // Short delay to allow dashboard to load first
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setIsOpen(false)
  }

  const handleCheckIn = () => {
    router.push("/journal/indirect-check-in")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-2 border-purple-200 shadow-lg">
              <CardHeader className="relative pb-2">
                <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={handleDismiss}>
                  <X className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                  </div>
                  <CardTitle>Time for Your Daily Reflection</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 py-2">
                  <p>
                    Taking a moment to reflect on your day helps track your progress and improves your overall wellness.
                    Would you like to complete your daily reflection now?
                  </p>

                  <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-500 mr-3" />
                    <div>
                      <p className="font-medium">Quick 2-minute check-in</p>
                      <p className="text-sm text-gray-500">Maintain your streak and earn XP</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={handleDismiss}>
                  Remind Me Later
                </Button>
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={handleCheckIn}>
                  Check In Now
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
