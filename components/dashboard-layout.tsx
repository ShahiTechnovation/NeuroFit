"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Trophy, Calendar, Settings, LogOut, Menu, X, Home, BookOpen } from "lucide-react"
import { useState } from "react"
import NotificationCenter from "@/components/notification-center"

export default function DashboardLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Mock user data
  const user = {
    name: "Rounak Soniii",
    level: 5,
    xpProgress: 65,
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
      </button>

      {/* Sidebar - Desktop always visible, Mobile conditionally visible */}
      <div
        className={`
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        fixed md:static top-0 left-0 h-full z-40 w-64 flex-col bg-white border-r
      `}
      >
        <div className="flex flex-col items-center justify-center p-6 border-b">
          <Avatar className="h-20 w-20 mb-4 hover:scale-105 transition-transform duration-300">
            <AvatarImage src="/placeholder.svg?height=80&width=80" alt={user.name} />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="font-semibold">{user.name}</h2>
            <p className="text-sm text-gray-500">Level {user.level} Explorer</p>
          </div>
          <div className="w-full mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>XP: {user.xpProgress}/100</span>
              <span>Next Level</span>
            </div>
            <Progress value={user.xpProgress} className="h-2" />
          </div>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-all duration-200 hover:translate-x-1"
              >
                <Home className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/tasks"
                className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-all duration-200 hover:translate-x-1"
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Tasks
              </Link>
            </li>
            <li>
              <Link
                href="/achievements"
                className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-all duration-200 hover:translate-x-1"
              >
                <Trophy className="mr-2 h-5 w-5" />
                Achievements
              </Link>
            </li>
            <li>
              <Link
                href="/schedule"
                className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-all duration-200 hover:translate-x-1"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Schedule
              </Link>
            </li>
            {/* Journal Link */}
            <li>
              <Link
                href="/journal"
                className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-all duration-200 hover:translate-x-1"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Journal & Wellness
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-all duration-200 hover:translate-x-1"
              >
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full flex items-center justify-center">
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-0">
        {/* Add notification icon to the header */}
        <div className="fixed top-4 right-4 z-50 md:hidden">
          <NotificationCenter />
        </div>

        {children}
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  )
}
