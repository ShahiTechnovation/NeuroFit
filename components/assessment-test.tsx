"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import confetti from "canvas-confetti"

// Mock assessment questions for different fields
const assessmentQuestions = {
  jee: [
    {
      id: "jee-q1",
      question: "Which of the following is Newton's First Law of Motion?",
      options: [
        { id: "a", text: "F = ma" },
        { id: "b", text: "Every action has an equal and opposite reaction" },
        { id: "c", text: "An object at rest stays at rest unless acted upon by an external force" },
        { id: "d", text: "Energy can neither be created nor destroyed" },
      ],
      correctAnswer: "c",
      difficulty: "basic",
    },
    {
      id: "jee-q2",
      question: "What is the derivative of sin(x)?",
      options: [
        { id: "a", text: "cos(x)" },
        { id: "b", text: "-sin(x)" },
        { id: "c", text: "tan(x)" },
        { id: "d", text: "-cos(x)" },
      ],
      correctAnswer: "a",
      difficulty: "basic",
    },
    {
      id: "jee-q3",
      question: "Which of the following is an example of a vector quantity?",
      options: [
        { id: "a", text: "Temperature" },
        { id: "b", text: "Mass" },
        { id: "c", text: "Velocity" },
        { id: "d", text: "Time" },
      ],
      correctAnswer: "c",
      difficulty: "intermediate",
    },
  ],
  fitness: [
    {
      id: "fitness-q1",
      question: "How many days per week should you aim to be physically active?",
      options: [
        { id: "a", text: "1-2 days" },
        { id: "b", text: "3-4 days" },
        { id: "c", text: "5+ days" },
        { id: "d", text: "Only on weekends" },
      ],
      correctAnswer: "c",
      difficulty: "basic",
    },
    {
      id: "fitness-q2",
      question: "Which of these is considered a compound exercise?",
      options: [
        { id: "a", text: "Bicep curls" },
        { id: "b", text: "Squats" },
        { id: "c", text: "Lateral raises" },
        { id: "d", text: "Calf raises" },
      ],
      correctAnswer: "b",
      difficulty: "intermediate",
    },
    {
      id: "fitness-q3",
      question: "What is the recommended daily water intake for an average adult?",
      options: [
        { id: "a", text: "1-2 liters" },
        { id: "b", text: "2-3 liters" },
        { id: "c", text: "4-5 liters" },
        { id: "d", text: "0.5-1 liter" },
      ],
      correctAnswer: "b",
      difficulty: "basic",
    },
  ],
  coding: [
    {
      id: "coding-q1",
      question: "Which of the following is not a programming language?",
      options: [
        { id: "a", text: "Java" },
        { id: "b", text: "Python" },
        { id: "c", text: "HTML" },
        { id: "d", text: "Microsoft" },
      ],
      correctAnswer: "d",
      difficulty: "basic",
    },
    {
      id: "coding-q2",
      question: "What does CSS stand for?",
      options: [
        { id: "a", text: "Computer Style Sheets" },
        { id: "b", text: "Creative Style System" },
        { id: "c", text: "Cascading Style Sheets" },
        { id: "d", text: "Colorful Style Sheets" },
      ],
      correctAnswer: "c",
      difficulty: "basic",
    },
    {
      id: "coding-q3",
      question: "Which data structure operates on a LIFO principle?",
      options: [
        { id: "a", text: "Queue" },
        { id: "b", text: "Stack" },
        { id: "c", text: "Linked List" },
        { id: "d", text: "Tree" },
      ],
      correctAnswer: "b",
      difficulty: "intermediate",
    },
  ],
}

export default function AssessmentTest({ selectedFields, onComplete }) {
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [results, setResults] = useState({})

  useEffect(() => {
    if (isCompleted) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }, [isCompleted])

  // Get questions for the current field
  const currentField = selectedFields[currentFieldIndex]
  const questions = currentField ? assessmentQuestions[currentField] || [] : []
  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswer = (answerId) => {
    setAnswers({
      ...answers,
      [`${currentField}-${currentQuestionIndex}`]: answerId,
    })
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (currentFieldIndex < selectedFields.length - 1) {
      setCurrentFieldIndex(currentFieldIndex + 1)
      setCurrentQuestionIndex(0)
    } else {
      // Calculate results
      const fieldResults = {}

      selectedFields.forEach((field) => {
        const fieldQuestions = assessmentQuestions[field] || []
        let correctCount = 0

        fieldQuestions.forEach((question, index) => {
          const userAnswer = answers[`${field}-${index}`]
          if (userAnswer === question.correctAnswer) {
            correctCount++
          }
        })

        const percentage = fieldQuestions.length > 0 ? Math.round((correctCount / fieldQuestions.length) * 100) : 0

        let level = "beginner"
        if (percentage >= 80) level = "advanced"
        else if (percentage >= 50) level = "intermediate"

        fieldResults[field] = {
          score: correctCount,
          total: fieldQuestions.length,
          percentage,
          level,
        }
      })

      setResults(fieldResults)
      setIsCompleted(true)
      onComplete(fieldResults)
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    } else if (currentFieldIndex > 0) {
      setCurrentFieldIndex(currentFieldIndex - 1)
      const prevFieldQuestions = assessmentQuestions[selectedFields[currentFieldIndex - 1]] || []
      setCurrentQuestionIndex(prevFieldQuestions.length - 1)
    }
  }

  // Calculate progress
  const totalQuestions = selectedFields.reduce((total, field) => {
    return total + (assessmentQuestions[field]?.length || 0)
  }, 0)

  const answeredQuestions = Object.keys(answers).length
  const progressPercentage = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0

  if (selectedFields.length === 0) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-bold mb-2">No Fields Selected</h2>
        <p className="text-gray-500">Please go back and select at least one field to continue.</p>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4 animate-bounce">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold">Assessment Completed!</h2>
          <p className="text-gray-500">We've analyzed your skill levels in each field</p>
        </div>

        <div className="space-y-4">
          {selectedFields.map((field, index) => {
            const fieldResult = results[field] || { percentage: 0, level: "beginner" }
            const fieldName = assessmentQuestions[field]?.[0]?.options?.[0]?.text
              ? field.charAt(0).toUpperCase() + field.slice(1)
              : field

            return (
              <Card
                key={field}
                className="overflow-hidden transition-all duration-500"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animation: "slideIn 0.5s ease-out forwards",
                }}
              >
                <style jsx>{`
                  @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{fieldName}</CardTitle>
                  <CardDescription>
                    Score: {fieldResult.score}/{fieldResult.total} ({fieldResult.percentage}%)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Beginner</span>
                      <span>Intermediate</span>
                      <span>Advanced</span>
                    </div>
                    <Progress
                      value={fieldResult.percentage}
                      className="h-2 bg-gray-100"
                      indicatorClassName={`transition-all duration-1000 ease-out ${
                        fieldResult.level === "beginner"
                          ? "bg-blue-500"
                          : fieldResult.level === "intermediate"
                            ? "bg-purple-500"
                            : "bg-pink-500"
                      }`}
                    />
                    <div className="mt-2">
                      <p className="text-sm font-medium">
                        Your level:{" "}
                        <span
                          className={`capitalize ${
                            fieldResult.level === "beginner"
                              ? "text-blue-600"
                              : fieldResult.level === "intermediate"
                                ? "text-purple-600"
                                : "text-pink-600"
                          }`}
                        >
                          {fieldResult.level}
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium capitalize">{currentField} Assessment</h3>
          <p className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Field {currentFieldIndex + 1} of {selectedFields.length}
        </div>
      </div>

      <Progress value={progressPercentage} className="h-2" />

      {currentQuestion ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[`${currentField}-${currentQuestionIndex}`]}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                  <Label htmlFor={`option-${option.id}`}>{option.text}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0 && currentFieldIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button
              onClick={nextQuestion}
              disabled={!answers[`${currentField}-${currentQuestionIndex}`]}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {currentQuestionIndex < questions.length - 1 || currentFieldIndex < selectedFields.length - 1
                ? "Next"
                : "Complete Assessment"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="text-center p-6">
          <p>No questions available for this field.</p>
        </div>
      )}
    </div>
  )
}
