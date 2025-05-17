"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Coffee, Moon, Brain, Sparkles, BookOpen, ArrowRight } from "lucide-react"

export default function IndirectCheckIn({ onComplete }) {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [responses, setResponses] = useState({
    wake_response: "",
    drink_choice: "",
    thought_response: "",
    mask_choice: "",
    title_text: "",
    selected_tag: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dailyQuote, setDailyQuote] = useState("")

  // Quotes based on overall tone
  const quotes = {
    positive: [
      "The only way to do great work is to love what you do. - Steve Jobs",
      "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
      "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    ],
    neutral: [
      "The journey of a thousand miles begins with one step. - Lao Tzu",
      "Life is what happens when you're busy making other plans. - John Lennon",
      "Every moment is a fresh beginning. - T.S. Eliot",
    ],
    challenging: [
      "Tough times never last, but tough people do. - Robert H. Schuller",
      "The gem cannot be polished without friction, nor man perfected without trials. - Chinese Proverb",
      "When everything seems to be going against you, remember that the airplane takes off against the wind. - Henry Ford",
    ],
  }

  // Get a random quote based on tone
  const getRandomQuote = (tone) => {
    const toneQuotes = quotes[tone]
    return toneQuotes[Math.floor(Math.random() * toneQuotes.length)]
  }

  const handleInputChange = (field, value) => {
    setResponses({ ...responses, [field]: value })
  }

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  // Modify the handleSubmit function to record check-in time
  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Calculate overall tone based on responses
      const tone = calculateTone(responses)

      // Set a quote based on the tone
      setDailyQuote(getRandomQuote(tone))

      // Record check-in time
      const checkInTime = new Date()

      // Save to localStorage
      const checkInHistory = JSON.parse(localStorage.getItem("checkInHistory") || "[]")
      checkInHistory.push({
        ...responses,
        date: checkInTime.toISOString(),
        tone: tone,
      })
      localStorage.setItem("checkInHistory", JSON.stringify(checkInHistory))

      // Record last check-in date for reminder logic
      localStorage.setItem("lastCheckInDate", checkInTime.toDateString())

      toast({
        title: "Check-in complete!",
        description: "Your daily reflection has been saved.",
      })

      // Move to completion step
      setStep(6)
    } catch (error) {
      console.error("Error submitting check-in:", error)
      toast({
        title: "Something went wrong",
        description: "Unable to save your check-in. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate overall tone based on responses
  const calculateTone = (responses) => {
    // Map responses to scores
    const sleepScore = mapSleepScore(responses.wake_response)
    const energyScore = mapEnergyScore(responses.drink_choice)
    const stressScore = mapStressScore(responses.thought_response)
    const moodScore = mapMoodScore(responses.mask_choice)

    // Calculate average score
    const avgScore = (sleepScore + energyScore + stressScore + moodScore) / 4

    // Determine tone based on average score
    if (avgScore >= 3.5) return "positive"
    if (avgScore >= 2.5) return "neutral"
    return "challenging"
  }

  // Mapping functions
  const mapSleepScore = (wake) => {
    const mapping = {
      "I woke up before my alarm and felt like a hero": 5,
      "I hit snooze a couple times, but made it": 4,
      "I had to drag myself out of bed": 3,
      "I blinked and it was already noon": 2,
      "Still in bed, mentally": 1,
    }
    return mapping[wake] || 3
  }

  const mapEnergyScore = (drink) => {
    const mapping = {
      "Espresso shot 🔥": 5,
      "Iced coffee ⚡": 4,
      "Warm latte ☕": 3,
      "Herbal tea 🌿": 2,
      "Just water 💧": 1,
    }
    return mapping[drink] || 3
  }

  const mapStressScore = (thought) => {
    const mapping = {
      "Let's crush today.": 5,
      "One thing at a time.": 4,
      "I hope nothing breaks.": 3,
      "I'm already behind.": 2,
      "I need a reset button.": 1,
    }
    return mapping[thought] || 3
  }

  const mapMoodScore = (mask) => {
    const mapping = {
      "😃": 5,
      "😐": 3,
      "😔": 2,
      "😤": 1,
      "😴": 2,
    }
    return mapping[mask] || 3
  }

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  }

  // Mood tags for the day quality prompt
  const moodTags = [
    "Boss Mode",
    "Cautiously Optimistic",
    "Storm Incoming",
    "Recovery Arc",
    "WTF Mode",
    "Grinding",
    "Zen State",
    "Survival Mode",
  ]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={cardVariants}
        className="w-full max-w-md mx-auto"
      >
        <Card className="border-2 border-purple-100 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Daily Reflection</CardTitle>
              <Badge variant="outline" className="text-xs">
                {step < 6 ? `${step}/5` : "Complete"}
              </Badge>
            </div>
            <CardDescription>
              {step === 1 && "Let's start with how your morning began..."}
              {step === 2 && "Now, let's talk about your energy..."}
              {step === 3 && "What's on your mind today?"}
              {step === 4 && "How are you presenting yourself to the world?"}
              {step === 5 && "If today were a chapter in your story..."}
              {step === 6 && "Thanks for checking in!"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-6">
            {/* Step 1: Sleep Quality */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Moon className="h-5 w-5 text-purple-500" />
                  <h3 className="text-lg font-medium">Which of these best matches your morning vibe?</h3>
                </div>
                <RadioGroup
                  value={responses.wake_response}
                  onValueChange={(value) => handleInputChange("wake_response", value)}
                  className="space-y-3"
                >
                  {[
                    "I woke up before my alarm and felt like a hero",
                    "I hit snooze a couple times, but made it",
                    "I had to drag myself out of bed",
                    "I blinked and it was already noon",
                    "Still in bed, mentally",
                  ].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`sleep-${option}`} />
                      <Label
                        htmlFor={`sleep-${option}`}
                        className="cursor-pointer transition-colors hover:text-purple-700"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 2: Energy Level */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Coffee className="h-5 w-5 text-purple-500" />
                  <h3 className="text-lg font-medium">Which coffee would you pick this morning?</h3>
                </div>
                <RadioGroup
                  value={responses.drink_choice}
                  onValueChange={(value) => handleInputChange("drink_choice", value)}
                  className="space-y-3"
                >
                  {["Espresso shot 🔥", "Iced coffee ⚡", "Warm latte ☕", "Herbal tea 🌿", "Just water 💧"].map(
                    (option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`drink-${option}`} />
                        <Label
                          htmlFor={`drink-${option}`}
                          className="cursor-pointer transition-colors hover:text-purple-700"
                        >
                          {option}
                        </Label>
                      </div>
                    ),
                  )}
                </RadioGroup>
              </div>
            )}

            {/* Step 3: Stress Level */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <h3 className="text-lg font-medium">Pick the thought that's loudest in your head right now.</h3>
                </div>
                <RadioGroup
                  value={responses.thought_response}
                  onValueChange={(value) => handleInputChange("thought_response", value)}
                  className="space-y-3"
                >
                  {[
                    "Let's crush today.",
                    "One thing at a time.",
                    "I hope nothing breaks.",
                    "I'm already behind.",
                    "I need a reset button.",
                  ].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`thought-${option}`} />
                      <Label
                        htmlFor={`thought-${option}`}
                        className="cursor-pointer transition-colors hover:text-purple-700"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 4: Mood */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <h3 className="text-lg font-medium">Which mask would you wear today?</h3>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  {["😃", "😐", "😔", "😤", "😴"].map((emoji) => (
                    <motion.div
                      key={emoji}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleInputChange("mask_choice", emoji)}
                      className={`flex items-center justify-center text-4xl p-4 rounded-lg cursor-pointer transition-all ${
                        responses.mask_choice === emoji
                          ? "bg-purple-100 ring-2 ring-purple-500"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      {emoji}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Day Quality */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="h-5 w-5 text-purple-500" />
                  <h3 className="text-lg font-medium">What would you title today's chapter in your story?</h3>
                </div>
                <Input
                  placeholder="Enter a title for today..."
                  value={responses.title_text}
                  onChange={(e) => handleInputChange("title_text", e.target.value)}
                  className="mb-4"
                />
                <div className="space-y-2">
                  <Label>Or pick a mood tag:</Label>
                  <div className="flex flex-wrap gap-2">
                    {moodTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={responses.selected_tag === tag ? "default" : "outline"}
                        className={`cursor-pointer ${
                          responses.selected_tag === tag ? "bg-purple-500 hover:bg-purple-600" : "hover:bg-purple-100"
                        }`}
                        onClick={() => {
                          handleInputChange("selected_tag", tag)
                          handleInputChange("title_text", tag)
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Completion */}
            {step === 6 && (
              <div className="space-y-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center"
                >
                  <Sparkles className="h-8 w-8 text-green-600" />
                </motion.div>
                <h3 className="text-xl font-medium">Reflection Complete!</h3>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="italic text-gray-700">{dailyQuote}</p>
                </div>
                <p className="text-gray-600">
                  Your daily reflection has been saved. Come back tomorrow for another check-in!
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            {step < 6 ? (
              <>
                <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !responses.wake_response) ||
                    (step === 2 && !responses.drink_choice) ||
                    (step === 3 && !responses.thought_response) ||
                    (step === 4 && !responses.mask_choice) ||
                    (step === 5 && !responses.title_text) ||
                    isSubmitting
                  }
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {step === 5 ? (
                    isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Complete"
                    )
                  ) : (
                    <>
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={onComplete} className="w-full bg-purple-600 hover:bg-purple-700">
                Continue to Dashboard
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
