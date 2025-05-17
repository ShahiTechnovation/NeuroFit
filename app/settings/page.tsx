"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Shield, Moon, Sun, Upload, Save } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"

export default function SettingsPage() {
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    bio: "JEE aspirant and fitness enthusiast. Working on improving my physics and building muscle.",
    avatar: "/placeholder.svg?height=100&width=100",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    taskReminders: true,
    achievementUnlocks: true,
    dailyDigest: false,
    weeklyReport: true,
    emailNotifications: true,
    pushNotifications: true,
  })

  const [appSettings, setAppSettings] = useState({
    theme: "light",
    language: "english",
    autoStartTimer: true,
    showCompletedTasks: true,
    defaultView: "dashboard",
  })

  const [characterSettings, setCharacterSettings] = useState({
    character: "cyberpunk",
    animations: true,
    showXpNotifications: true,
  })

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData({ ...profileData, [name]: value })
  }

  const handleNotificationToggle = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    })
  }

  const handleAppSettingChange = (setting, value) => {
    setAppSettings({
      ...appSettings,
      [setting]: value,
    })
  }

  const handleCharacterSettingChange = (setting, value) => {
    setCharacterSettings({
      ...characterSettings,
      [setting]: value,
    })
  }

  const handleSaveSettings = () => {
    // In a real app, you would save the settings to your backend
    console.log("Saving settings:", {
      profile: profileData,
      notifications: notificationSettings,
      app: appSettings,
      character: characterSettings,
    })
  }

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Settings</h1>
            <Button onClick={handleSaveSettings} className="bg-purple-600 hover:bg-purple-700">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" /> Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="mr-2 h-4 w-4" /> Notifications
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center">
                <Moon className="mr-2 h-4 w-4" /> Appearance
              </TabsTrigger>
              <TabsTrigger value="character" className="flex items-center">
                <Shield className="mr-2 h-4 w-4" /> Character
              </TabsTrigger>
            </TabsList>

            {/* Profile Settings */}
            <TabsContent value="profile">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" value={profileData.name} onChange={handleProfileChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" name="bio" value={profileData.bio} onChange={handleProfileChange} rows={4} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>Update your profile image</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt={profileData.name} />
                        <AvatarFallback>AJ</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" className="w-full">
                        <Upload className="mr-2 h-4 w-4" /> Upload New Image
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>Manage your account security settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">Change Password</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Notification Types</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="task-reminders">Task Reminders</Label>
                          <p className="text-sm text-gray-500">Receive reminders for upcoming tasks</p>
                        </div>
                        <Switch
                          id="task-reminders"
                          checked={notificationSettings.taskReminders}
                          onCheckedChange={() => handleNotificationToggle("taskReminders")}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="achievement-unlocks">Achievement Unlocks</Label>
                          <p className="text-sm text-gray-500">Get notified when you unlock achievements</p>
                        </div>
                        <Switch
                          id="achievement-unlocks"
                          checked={notificationSettings.achievementUnlocks}
                          onCheckedChange={() => handleNotificationToggle("achievementUnlocks")}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="daily-digest">Daily Digest</Label>
                          <p className="text-sm text-gray-500">Receive a summary of your daily progress</p>
                        </div>
                        <Switch
                          id="daily-digest"
                          checked={notificationSettings.dailyDigest}
                          onCheckedChange={() => handleNotificationToggle("dailyDigest")}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="weekly-report">Weekly Report</Label>
                          <p className="text-sm text-gray-500">Get a weekly summary of your progress</p>
                        </div>
                        <Switch
                          id="weekly-report"
                          checked={notificationSettings.weeklyReport}
                          onCheckedChange={() => handleNotificationToggle("weeklyReport")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Notification Channels</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-gray-500">Receive notifications via email</p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={() => handleNotificationToggle("emailNotifications")}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-notifications">Push Notifications</Label>
                          <p className="text-sm text-gray-500">Receive notifications on your device</p>
                        </div>
                        <Switch
                          id="push-notifications"
                          checked={notificationSettings.pushNotifications}
                          onCheckedChange={() => handleNotificationToggle("pushNotifications")}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Theme</CardTitle>
                    <CardDescription>Customize the appearance of the application</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Color Theme</Label>
                      <RadioGroup
                        value={appSettings.theme}
                        onValueChange={(value) => handleAppSettingChange("theme", value)}
                        className="flex space-x-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="light" id="theme-light" />
                          <Label htmlFor="theme-light" className="flex items-center">
                            <Sun className="mr-2 h-4 w-4" /> Light
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dark" id="theme-dark" />
                          <Label htmlFor="theme-dark" className="flex items-center">
                            <Moon className="mr-2 h-4 w-4" /> Dark
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="system" id="theme-system" />
                          <Label htmlFor="theme-system">System</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={appSettings.language}
                        onValueChange={(value) => handleAppSettingChange("language", value)}
                      >
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="hindi">Hindi</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>App Behavior</CardTitle>
                    <CardDescription>Customize how the application works</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-start-timer">Auto-start Timer</Label>
                        <p className="text-sm text-gray-500">Automatically start timer when beginning a task</p>
                      </div>
                      <Switch
                        id="auto-start-timer"
                        checked={appSettings.autoStartTimer}
                        onCheckedChange={(checked) => handleAppSettingChange("autoStartTimer", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-completed-tasks">Show Completed Tasks</Label>
                        <p className="text-sm text-gray-500">Display completed tasks in the task list</p>
                      </div>
                      <Switch
                        id="show-completed-tasks"
                        checked={appSettings.showCompletedTasks}
                        onCheckedChange={(checked) => handleAppSettingChange("showCompletedTasks", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="default-view">Default View</Label>
                      <Select
                        value={appSettings.defaultView}
                        onValueChange={(value) => handleAppSettingChange("defaultView", value)}
                      >
                        <SelectTrigger id="default-view">
                          <SelectValue placeholder="Select default view" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dashboard">Dashboard</SelectItem>
                          <SelectItem value="tasks">Tasks</SelectItem>
                          <SelectItem value="schedule">Schedule</SelectItem>
                          <SelectItem value="achievements">Achievements</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Character Settings */}
            <TabsContent value="character">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Character Selection</CardTitle>
                    <CardDescription>Choose your character type</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup
                      value={characterSettings.character}
                      onValueChange={(value) => handleCharacterSettingChange("character", value)}
                      className="grid grid-cols-2 gap-4"
                    >
                      {[
                        { id: "bgmi", name: "BGMI Warrior" },
                        { id: "cyberpunk", name: "Cyberpunk Rebel" },
                        { id: "doodle", name: "Doodle Hero" },
                        { id: "solo-leveling", name: "Solo Leveling Hunter" },
                      ].map((character) => (
                        <div key={character.id} className="relative">
                          <RadioGroupItem value={character.id} id={`character-${character.id}`} className="sr-only" />
                          <Label htmlFor={`character-${character.id}`} className="cursor-pointer">
                            <Card
                              className={`overflow-hidden transition-all ${
                                characterSettings.character === character.id
                                  ? "ring-2 ring-purple-600 shadow-md"
                                  : "hover:shadow-md"
                              }`}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                    {character.id === "bgmi" && <Shield className="h-5 w-5 text-blue-500" />}
                                    {character.id === "cyberpunk" && <Shield className="h-5 w-5 text-purple-500" />}
                                    {character.id === "doodle" && <Shield className="h-5 w-5 text-amber-500" />}
                                    {character.id === "solo-leveling" && <Shield className="h-5 w-5 text-red-500" />}
                                  </div>
                                  <div>
                                    <h3 className="font-medium">{character.name}</h3>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Character Appearance</CardTitle>
                    <CardDescription>Customize your character's appearance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="animations">Character Animations</Label>
                        <p className="text-sm text-gray-500">Enable character animations</p>
                      </div>
                      <Switch
                        id="animations"
                        checked={characterSettings.animations}
                        onCheckedChange={(checked) => handleCharacterSettingChange("animations", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="xp-notifications">XP Notifications</Label>
                        <p className="text-sm text-gray-500">Show XP gain notifications on character</p>
                      </div>
                      <Switch
                        id="xp-notifications"
                        checked={characterSettings.showXpNotifications}
                        onCheckedChange={(checked) => handleCharacterSettingChange("showXpNotifications", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Current Level</Label>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-purple-600">Level 5</Badge>
                        <span className="text-sm text-gray-500">Next level at 100 XP</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Account Data</CardTitle>
                    <CardDescription>Manage your account data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Export Data</h3>
                      <p className="text-sm text-gray-500">
                        Download all your data including tasks, achievements, and progress.
                      </p>
                      <Button variant="outline">Export Data</Button>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-red-500">Danger Zone</h3>
                      <p className="text-sm text-gray-500">Permanently delete your account and all associated data.</p>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </DashboardLayout>
  )
}
