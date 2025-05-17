"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Coffee, Moon, Brain, Sparkles, BookOpen } from "lucide-react"

export default function JournalCheckInCard({ hasCheckedInToday = false }) {
  const router = useRouter()

  // Animation variants
  const iconVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: (custom) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: custom * 0.1, duration: 0.3 },
    }),
    hover: { scale: 1.1, transition: { duration: 0.2 } },
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>Daily Reflection</CardTitle>
        <CardDescription>
          {hasCheckedInToday
            ? "You've already reflected today. Great job!"
            : "Take a moment to reflect on your day in a fun way"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center space-x-4 py-4">
          {[
            { icon: <Moon className="h-5 w-5" />, color: "bg-blue-100 text-blue-600" },
            { icon: <Coffee className="h-5 w-5" />, color: "bg-amber-100 text-amber-600" },
            { icon: <Brain className="h-5 w-5" />, color: "bg-purple-100 text-purple-600" },
            { icon: <Sparkles className="h-5 w-5" />, color: "bg-green-100 text-green-600" },
            { icon: <BookOpen className="h-5 w-5" />, color: "bg-pink-100 text-pink-600" },
          ].map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="initial"
              animate="animate"
              whileHover="hover"
              variants={iconVariants}
              className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center`}
            >
              {item.icon}
            </motion.div>
          ))}
        </div>

        <p className="text-center text-gray-600 mt-2">
          {hasCheckedInToday
            ? "Your reflection helps us understand your wellness patterns"
            : "A quick, fun way to track your wellness without direct questions"}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => router.push("/journal/indirect-check-in")}
          disabled={hasCheckedInToday}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {hasCheckedInToday ? "Already Completed Today" : "Start Daily Reflection"}
        </Button>
      </CardFooter>
    </Card>
  )
}
