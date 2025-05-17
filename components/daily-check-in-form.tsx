"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { SmilePlus, Smile, Meh, Frown, FrownIcon as FrownPlus, Moon, Dumbbell, Battery, Gauge } from "lucide-react"

export default function DailyCheckInForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    sleepHours: 7,
    sleepMinutes: 0,
    mood: "neutral",
    didWorkout: false,
    dayRating: 3,
    energyLevel: 3,
    stressLevel: 3,
    notes: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSwitchChange = (name, checked) => {
    setFormData({ ...formData, [name]: checked })
  }

  const handleSliderChange = (name, value) => {
    setFormData({ ...formData, [name]: value[0] })
  }

  const handleRadioChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Add timestamp to the form data
    const submissionData = {
      ...formData,
      timestamp: new Date().toISOString(),
    }

    // Record last check-in date for reminder logic
    localStorage.setItem("lastCheckInDate", new Date().toDateString())

    onSubmit(submissionData)
  }

  const moodIcons = {
    "very-happy": <SmilePlus className="h-6 w-6 text-green-500" />,
    happy: <Smile className="h-6 w-6 text-green-400" />,
    neutral: <Meh className="h-6 w-6 text-amber-400" />,
    sad: <Frown className="h-6 w-6 text-red-400" />,
    "very-sad": <FrownPlus className="h-6 w-6 text-red-500" />,
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sleep & Physical Wellness</CardTitle>
            <CardDescription>Tell us about your sleep and physical activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <Moon className="mr-2 h-5 w-5 text-purple-500" />
                <Label className="text-base font-medium">Last Night's Sleep</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sleepHours">Hours</Label>
                  <Input
                    id="sleepHours"
                    name="sleepHours"
                    type="number"
                    min="0"
                    max="24"
                    value={formData.sleepHours}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sleepMinutes">Minutes</Label>
                  <Input
                    id="sleepMinutes"
                    name="sleepMinutes"
                    type="number"
                    min="0"
                    max="59"
                    value={formData.sleepMinutes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Total: {formData.sleepHours} hours {formData.sleepMinutes} minutes
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center">
                <Dumbbell className="mr-2 h-5 w-5 text-green-500" />
                <Label className="text-base font-medium">Physical Activity</Label>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="didWorkout" className="text-base">
                  Did you workout today?
                </Label>
                <Switch
                  id="didWorkout"
                  checked={formData.didWorkout}
                  onCheckedChange={(checked) => handleSwitchChange("didWorkout", checked)}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center">
                <Battery className="mr-2 h-5 w-5 text-blue-500" />
                <Label className="text-base font-medium">Energy Level</Label>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
                <Slider
                  defaultValue={[formData.energyLevel]}
                  max={5}
                  step={1}
                  onValueChange={(value) => handleSliderChange("energyLevel", value)}
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mental Wellness</CardTitle>
            <CardDescription>Share how you're feeling today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">Current Mood</Label>
              <RadioGroup
                value={formData.mood}
                onValueChange={(value) => handleRadioChange("mood", value)}
                className="flex justify-between"
              >
                {Object.entries(moodIcons).map(([mood, icon]) => (
                  <div key={mood} className="flex flex-col items-center space-y-1">
                    <RadioGroupItem value={mood} id={`mood-${mood}`} className="sr-only" />
                    <Label
                      htmlFor={`mood-${mood}`}
                      className={`cursor-pointer p-2 rounded-full ${
                        formData.mood === mood ? "bg-purple-100 ring-2 ring-purple-500" : "hover:bg-gray-100"
                      }`}
                    >
                      {icon}
                    </Label>
                    <span className="text-xs capitalize">{mood.replace("-", " ")}</span>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center">
                <Gauge className="mr-2 h-5 w-5 text-red-500" />
                <Label className="text-base font-medium">Stress Level</Label>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
                <Slider
                  defaultValue={[formData.stressLevel]}
                  max={5}
                  step={1}
                  onValueChange={(value) => handleSliderChange("stressLevel", value)}
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-base font-medium">Overall Day Rating</Label>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Poor</span>
                  <span>Average</span>
                  <span>Excellent</span>
                </div>
                <Slider
                  defaultValue={[formData.dayRating]}
                  max={5}
                  step={1}
                  onValueChange={(value) => handleSliderChange("dayRating", value)}
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
            <CardDescription>Any other thoughts or observations about your day</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Share any additional details about your day, health, or wellness..."
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              Complete Daily Check-in
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}
