"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageCircle } from "lucide-react"
import CharacterViewer from "@/components/character-viewer"
// Add the ReflectionReminder component to the home page
import ReflectionReminder from "@/components/reflection-reminder"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 animate-gradient">
                    Level Up Your Life
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Transform your fitness journey and personal development into an epic adventure. Choose your
                    character, set your goals, and watch yourself level up in real life.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
                      Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="outline" className="transition-all duration-300 transform hover:scale-105">
                      Learn More
                    </Button>
                  </Link>
                </div>
                <div className="mt-4">
                  <a
                    href="https://t.me/Neuro3Fit_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Join Our Telegram Bot
                  </a>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-[400px] lg:h-[500px] rounded-lg overflow-hidden bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 shadow-lg transform transition-all duration-500 hover:scale-[1.02]">
                  <CharacterViewer character="cyberpunk" level={5} />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm text-purple-600">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Your Personal Development, Gamified</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Combine fitness, education, and personal growth in one platform with game-like progression and
                  rewards.
                </p>
              </div>
            </div>
            <style jsx>{`
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  .float-animation {
    animation: float 3s ease-in-out infinite;
  }
`}</style>

            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {[
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  ),
                  title: "Character Selection",
                  description:
                    "Choose from BGMI, Cyberpunk, Doodle, or Solo Leveling inspired characters to represent your journey.",
                  delay: "0s",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  ),
                  title: "Personalized Plans",
                  description:
                    "Get customized schedules for JEE, UPSC, NEET, coding, fitness, and more based on your skill level.",
                  delay: "0.2s",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
                    </svg>
                  ),
                  title: "Level Up System",
                  description:
                    "Earn XP by completing daily tasks and watch your character evolve as you progress in real life.",
                  delay: "0.4s",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-center space-y-4 float-animation"
                  style={{ animationDelay: feature.delay }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                    {feature.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Multiple Development Paths</h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed">
                    Choose from various fields and combine them to create your unique development journey.
                  </p>
                </div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-purple-600"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Academic Preparation (JEE, UPSC, NEET)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-purple-600"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Fitness & Physical Development</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-purple-600"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Coding & Technical Skills</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-purple-600"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Mental Health & Mindfulness</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-40 rounded-lg bg-gradient-to-r from-purple-200 to-purple-300 flex items-center justify-center">
                    <span className="font-medium text-purple-800">JEE</span>
                  </div>
                  <div className="h-40 rounded-lg bg-gradient-to-r from-pink-200 to-pink-300 flex items-center justify-center">
                    <span className="font-medium text-pink-800">UPSC</span>
                  </div>
                  <div className="h-40 rounded-lg bg-gradient-to-r from-blue-200 to-blue-300 flex items-center justify-center">
                    <span className="font-medium text-blue-800">Fitness</span>
                  </div>
                  <div className="h-40 rounded-lg bg-gradient-to-r from-green-200 to-green-300 flex items-center justify-center">
                    <span className="font-medium text-green-800">Coding</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-white border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
            <p className="text-center text-sm text-gray-500 md:text-left">© 2025 Fitness Quest. All rights reserved.</p>
            <nav className="flex gap-4 sm:gap-6">
              <Link className="text-sm font-medium hover:underline" href="#">
                Terms
              </Link>
              <Link className="text-sm font-medium hover:underline" href="#">
                Privacy
              </Link>
              <Link className="text-sm font-medium hover:underline" href="#">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </footer>
      <ReflectionReminder />
    </div>
  )
}
