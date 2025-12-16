"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  BookOpen,
  LogOut,
  Bell,
  User,
  MapPin,
  MessageSquare,
  FileCheck,
  X,
  Mail,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

export default function ParticipantDashboard() {
  const [notificationCount, setNotificationCount] = useState(3)
  const [showNotificationPanel, setShowNotificationPanel] = useState(false)
  const [notificationsViewed, setNotificationsViewed] = useState(false)

  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "Dr. Sarah Johnson",
      message: "Great progress on Session 1! Keep up the good work.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      from: "Dr. Sarah Johnson",
      message: "Please remember to complete your daily journal entry.",
      time: "1 day ago",
      read: false,
    },
  ])

  const [homework, setHomework] = useState([
    {
      id: 1,
      title: "My First Action Plan",
      session: 1,
      dueDate: "Today",
      status: "pending",
      description: "Complete your treatment goals and action steps",
    },
  ])

  const [dailyJournals, setDailyJournals] = useState([
    { id: 1, date: "2024-01-15", day: "Monday", completed: true, late: false },
    { id: 2, date: "2024-01-16", day: "Tuesday", completed: true, late: false },
    { id: 3, date: "2024-01-17", day: "Wednesday", completed: false, late: true },
    { id: 4, date: "2024-01-18", day: "Thursday", completed: false, late: false },
  ])

  const [selectedHomework, setSelectedHomework] = useState<number | null>(null)
  const [selectedJournal, setSelectedJournal] = useState<number | null>(null)
  const [homeworkResponse, setHomeworkResponse] = useState("")
  const [journalEntry, setJournalEntry] = useState("")

  const [showSessionViewer, setShowSessionViewer] = useState(false)
  const [currentSessionContent, setCurrentSessionContent] = useState<number>(0)

  const [sessionCompleted, setSessionCompleted] = useState(false)
  const [inLiveSession, setInLiveSession] = useState(false)

  const router = useRouter()

  const handleClassClick = (className: string, classTime: string, day: string) => {
    router.push(
      `/participant/check-in?class=${encodeURIComponent(className)}&time=${encodeURIComponent(classTime)}&day=${encodeURIComponent(day)}`,
    )
  }

  const handleNotificationClick = () => {
    setShowNotificationPanel(true)
    if (!notificationsViewed) {
      setNotificationCount(0)
      setNotificationsViewed(true)
    }
  }

  // Mock data for enrolled classes
  const enrolledClasses = [
    {
      id: 1,
      title: "Prime Solutions",
      facilitator: "Dr. Sarah Johnson",
      currentSession: 1,
      totalSessions: 16,
      nextSession: "Today, 2:00 PM",
      location: "Treatment Building",
      progress: 6,
    },
  ]

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 AM",
  ]

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const assignedMakeupClasses = [
    { date: "2025-01-18", time: "10:00 AM", class: "Makeup Group", location: "Treatment Building" },
  ]

  const scheduledClasses = {
    Monday: { "8:00 AM": { class: "Prime Solutions", location: "Treatment Building" } },
    Wednesday: { "2:00 PM": { class: "Prime Solutions", location: "Treatment Building" } },
    Friday: { "2:00 PM": { class: "Prime Solutions", location: "Treatment Building" } },
    // Dynamically add makeup classes to Saturday 10 AM slot if assigned
    ...(assignedMakeupClasses.length > 0 && {
      Saturday: { "10:00 AM": { class: "Makeup Group", location: "Treatment Building", isMakeup: true } },
    }),
  }

  const unreadMessages = messages.filter((m) => !m.read).length
  const pendingHomework = homework.filter((h) => h.status === "pending").length
  const missedJournals = dailyJournals.filter((j) => j.late && !j.completed).length

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary rounded-lg" />
              <h1 className="text-xl font-semibold text-foreground">My Learning Dashboard</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative" onClick={handleNotificationClick}>
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Welcome Back!</h2>
          <p className="text-muted-foreground text-lg">Track your progress and stay on top of your learning journey.</p>
        </div>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              My Class Schedule
            </CardTitle>
            <CardDescription>Your weekly class times (9 AM - 7 PM)</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-8 gap-px bg-border rounded-t-lg overflow-hidden">
                <div className="bg-primary text-primary-foreground p-3 font-semibold">Time</div>
                {daysOfWeek.map((day) => (
                  <div key={day} className="bg-primary text-primary-foreground p-3 font-semibold text-center">
                    {day}
                  </div>
                ))}
              </div>

              <div className="border border-border border-t-0 rounded-b-lg overflow-hidden">
                {timeSlots.map((time, timeIndex) => (
                  <div
                    key={time}
                    className={`grid grid-cols-8 gap-px bg-border ${
                      timeIndex === timeSlots.length - 1 ? "" : "border-b border-border"
                    }`}
                  >
                    <div className="bg-muted p-3 font-medium text-sm text-muted-foreground">{time}</div>
                    {daysOfWeek.map((day) => {
                      const classInfo = scheduledClasses[day as keyof typeof scheduledClasses]?.[time]
                      return (
                        <div key={`${day}-${time}`} className="bg-background p-2">
                          {classInfo && (
                            <button
                              onClick={() => handleClassClick(classInfo.class, time, day)}
                              className={`${classInfo.isMakeup ? "bg-amber-50 border border-amber-300" : "bg-primary/10 border border-primary/30"} rounded p-2 h-full w-full hover:opacity-80 transition-colors cursor-pointer`}
                            >
                              <p className="text-xs font-semibold text-foreground truncate">{classInfo.class}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{classInfo.location}</span>
                              </p>
                              {classInfo.isMakeup && (
                                <Badge variant="secondary" className="mt-1 text-[9px] bg-amber-100 text-amber-800">
                                  Makeup
                                </Badge>
                              )}
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Messages Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Messages
              </CardTitle>
              <CardDescription>From your facilitators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {messages.slice(0, 3).map((msg) => (
                  <div key={msg.id} className="p-3 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-sm">{msg.from}</p>
                      {!msg.read && (
                        <Badge variant="default" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Homework Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                Homework
              </CardTitle>
              <CardDescription>Assignments to complete</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {homework.map((hw) => (
                  <div
                    key={hw.id}
                    className="p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedHomework(hw.id)}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-sm">{hw.title}</p>
                      <Badge variant={hw.status === "pending" ? "default" : "secondary"} className="text-xs">
                        {hw.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Session {hw.session}</p>
                    <p className="text-xs text-muted-foreground mt-1">Due: {hw.dueDate}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Daily Journal Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Daily Journal
              </CardTitle>
              <CardDescription>Track your daily reflections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dailyJournals.map((journal) => (
                  <div
                    key={journal.id}
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                      journal.late && !journal.completed ? "border-red-500 bg-red-50" : "border-border"
                    }`}
                    onClick={() => setSelectedJournal(journal.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={`font-medium text-sm ${journal.late && !journal.completed ? "text-red-600" : ""}`}
                        >
                          {journal.day}
                        </p>
                        <p className="text-xs text-muted-foreground">{journal.date}</p>
                      </div>
                      {journal.completed ? (
                        <Badge variant="secondary" className="text-xs">
                          Complete
                        </Badge>
                      ) : journal.late ? (
                        <Badge variant="destructive" className="text-xs">
                          Late
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Classes */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-foreground">My Enrolled Classes</h3>

          <div className="grid gap-6">
            {enrolledClasses.map((enrolledClass) => (
              <Card key={enrolledClass.id} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-2xl">{enrolledClass.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-base">
                        <User className="h-4 w-4" />
                        Facilitator: {enrolledClass.facilitator}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Session {enrolledClass.currentSession} of {enrolledClass.totalSessions}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Overall Progress</span>
                      <span className="font-semibold text-foreground">
                        {Math.round((enrolledClass.progress / enrolledClass.totalSessions) * 100)}%
                      </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(enrolledClass.progress / enrolledClass.totalSessions) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Next Session</p>
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        {enrolledClass.nextSession}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {enrolledClass.location}
                      </p>
                    </div>
                    <Button
                      className="gap-2 bg-green-600 hover:bg-green-700"
                      onClick={() => setShowSessionViewer(true)}
                    >
                      <BookOpen className="h-4 w-4" />
                      View Sessions
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-primary">{enrolledClass.currentSession}</p>
                      <p className="text-xs text-muted-foreground">Current Session</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-primary">{enrolledClass.progress}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {enrolledClass.totalSessions - enrolledClass.progress}
                      </p>
                      <p className="text-xs text-muted-foreground">Remaining</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6 px-6 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} DMS Clinical Services. All rights reserved.</p>
        </div>
      </footer>

      {showNotificationPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl font-bold">Notifications</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowNotificationPanel(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              {unreadMessages === 0 && pendingHomework === 0 && missedJournals === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No new notifications</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages
                    .filter((m) => !m.read)
                    .map((msg) => (
                      <div
                        key={msg.id}
                        className="p-4 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100"
                        onClick={() => {
                          setShowNotificationPanel(false)
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold">New Message from {msg.from}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{msg.message}</p>
                      </div>
                    ))}

                  {homework
                    .filter((h) => h.status === "pending")
                    .map((hw) => (
                      <div
                        key={hw.id}
                        className="p-4 bg-green-50 border border-green-200 rounded-lg cursor-pointer hover:bg-green-100"
                        onClick={() => {
                          setSelectedHomework(hw.id)
                          setShowNotificationPanel(false)
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-green-600" />
                            <span className="font-semibold">Homework Due: {hw.title}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{hw.dueDate}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{hw.description}</p>
                      </div>
                    ))}

                  {dailyJournals
                    .filter((j) => j.late && !j.completed)
                    .map((journal) => (
                      <div
                        key={journal.id}
                        className="p-4 bg-red-50 border border-red-200 rounded-lg cursor-pointer hover:bg-red-100"
                        onClick={() => {
                          setSelectedJournal(journal.id)
                          setShowNotificationPanel(false)
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-red-600" />
                            <span className="font-semibold text-red-600">Late Journal Entry</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{journal.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {journal.day} - Please complete as soon as possible
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedHomework && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl font-bold">Complete Homework</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedHomework(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              {homework.find((h) => h.id === selectedHomework) && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {homework.find((h) => h.id === selectedHomework)?.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {homework.find((h) => h.id === selectedHomework)?.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        What is your most immediate treatment goal?
                      </label>
                      <Input placeholder="Enter your goal..." className="mb-4" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Some steps I will take to reach this goal are:
                      </label>
                      <Textarea
                        placeholder="List your action steps..."
                        className="min-h-[150px]"
                        value={homeworkResponse}
                        onChange={(e) => setHomeworkResponse(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedHomework(null)}>
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setHomework(homework.map((h) => (h.id === selectedHomework ? { ...h, status: "submitted" } : h)))
                  setSelectedHomework(null)
                  setHomeworkResponse("")
                }}
              >
                Submit Homework
              </Button>
            </div>
          </div>
        </div>
      )}

      {selectedJournal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl font-bold">Daily Journal Entry</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedJournal(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              {dailyJournals.find((j) => j.id === selectedJournal) && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {dailyJournals.find((j) => j.id === selectedJournal)?.day} -{" "}
                      {dailyJournals.find((j) => j.id === selectedJournal)?.date}
                    </h3>
                    {dailyJournals.find((j) => j.id === selectedJournal)?.late && (
                      <p className="text-red-600 text-sm mb-4">
                        This entry is overdue. Please complete it as soon as possible.
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">How are you feeling today?</label>
                      <Textarea placeholder="Reflect on your day..." className="min-h-[100px]" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">What challenges did you face?</label>
                      <Textarea placeholder="Describe any difficulties..." className="min-h-[100px]" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">What progress did you make?</label>
                      <Textarea
                        placeholder="Note your achievements..."
                        className="min-h-[100px]"
                        value={journalEntry}
                        onChange={(e) => setJournalEntry(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedJournal(null)}>
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setDailyJournals(dailyJournals.map((j) => (j.id === selectedJournal ? { ...j, completed: true } : j)))
                  setSelectedJournal(null)
                  setJournalEntry("")
                }}
              >
                Submit Journal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Session Viewer Modal */}
      {showSessionViewer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[95vh] flex flex-col">
            <div className="p-6 border-b flex items-center justify-between flex-shrink-0">
              <h2 className="text-2xl font-bold">Prime Solutions - Session 1</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowSessionViewer(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6 pb-6">
                {currentSessionContent === 0 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-center">Welcome to PRIME Solutions</h3>
                    <div className="prose max-w-none space-y-4">
                      <p>
                        PRIME Solutions is your program. It is designed to help you reach your goals. How much you use
                        the program is up to you. This workbook belongs to you. It is a tool to help you succeed. It is
                        both a workbook and a reference book.
                      </p>
                      <p>
                        Since people come into treatment at different times and with different needs, we will not always
                        go through the workbook in order. Write in it! Take notes! Do the activities. You will get more
                        out of the experience that way.
                      </p>
                      <p>
                        This workbook is copyrighted. You can use the materials in it, but you may not copy it for
                        others to use. Your counselor should have given you a brand new workbook. In that way your
                        counselor is respecting copyright laws and helping the nonprofit organization that developed
                        these materials continue to do its work.
                      </p>

                      <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200 my-8">
                        <h4 className="font-bold text-lg mb-4">A PRIME THOUGHT ABOUT STARTING TREATMENT</h4>
                        <p className="mb-4">
                          Think of your treatment experience as a voyage. Every voyage begins from a port.
                        </p>
                        <div className="space-y-2">
                          <label className="block font-semibold">
                            In one sentence, describe the place that you are sailing from:
                          </label>
                          <textarea
                            className="w-full p-3 border rounded-lg min-h-[80px]"
                            placeholder="I am sailing from..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentSessionContent === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold">A Quick Review of the Phases</h3>
                    <div className="space-y-6">
                      <div className="border-l-4 border-green-600 pl-4">
                        <h4 className="font-bold text-lg mb-2">Phase 1: Low-Risk Choices</h4>
                        <p>
                          People in this phase do not use illegal drugs, use prescription drugs as prescribed, and
                          follow the 0-1-2-3 low-risk guidelines for alcohol. For some people this is the 0. For others
                          it is 1-2-3.
                        </p>
                      </div>

                      <div className="border-l-4 border-yellow-600 pl-4">
                        <h4 className="font-bold text-lg mb-2">Phase 2: High-Risk Choices</h4>
                        <p>
                          People in this phase may be using drugs from time to time or may be drinking more than the
                          1-2-3 guidelines. Alcohol and drugs are pleasant from time to time, but not central to their
                          lives. Their choices put them at risk for problems. Social Dependence may begin.
                        </p>
                      </div>

                      <div className="border-l-4 border-orange-600 pl-4">
                        <h4 className="font-bold text-lg mb-2">
                          Phase 3: High-Risk Choices plus Psychological Dependence
                        </h4>
                        <p>
                          High-risk alcohol or drug choices are a major part of having fun. High-risk choices are
                          integrated into many parts of life. A person in Phase 3 may find in treatment that they have a
                          diagnosis of either Abuse or (early) Dependence. It may take significant effort to make
                          changes. People in Phase 3 may be able to drink in the low-risk range. Some do so, but others
                          decide it is just not worth the effort it takes.
                        </p>
                      </div>

                      <div className="border-l-4 border-red-600 pl-4">
                        <h4 className="font-bold text-lg mb-2">Phase 4: Addiction</h4>
                        <p>
                          In this phase people experience loss of control over their use once they begin. Some also
                          experience withdrawal when they stop using. This is advanced Dependence. In Phase 4, the only
                          low-risk choice is to stop all use of drugs or alcohol.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {currentSessionContent === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold">Which Treatment Path Are You On?</h3>
                    <div className="prose max-w-none space-y-4">
                      <blockquote className="border-l-4 border-green-600 pl-4 italic">
                        <p>"Which way should I go?" said Alice.</p>
                        <p>"That depends on where you want to end up," said the cat.</p>
                        <p className="text-sm">- Alice in Wonderland by Lewis Carol</p>
                      </blockquote>

                      <p>
                        In the story of Alice in Wonderland, Alice came to a fork in the path and did not know which way
                        to go. When she asked the Cheshire Cat for advice, the answer was simple but true. The Cat
                        replied, "That depends on where you want to end up." It is not always clear where a path will
                        take us. Yet every path goes somewhere, and when we choose a path, we are also choosing a
                        destination.
                      </p>

                      <p>
                        Treatment presents us with a fork in the path. It is a good time to think about what we want in
                        life. During treatment, we will have an opportunity to think about things like relationships,
                        jobs, legal issues, money, self-respect, and many more. For now, let's think in broad terms.
                      </p>

                      <p>
                        What do you plan to do about using alcohol and drugs during treatment? What are your hopes for
                        after treatment? Do you intend to not use at all? Do you intend to keep using? Some of us know
                        the answers to those questions right now. Others do not. Let's think of two different Treatment
                        Paths to guide us.
                      </p>
                    </div>
                  </div>
                )}

                {currentSessionContent === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold">My First Action Plan</h3>
                    <div className="prose max-w-none space-y-4">
                      <p>
                        The Treatment Plan you developed with your counselor is a "big picture" plan of what you want to
                        accomplish in treatment. It will guide your counselor in helping you reach your treatment goals.
                      </p>
                      <p>
                        An Action Plan is much simpler. It covers one goal and the things you are willing to do to help
                        reach that goal. Action Plans allow you to take your Treatment Plan and break it into
                        "bite-sized pieces."
                      </p>
                      <p>
                        Your first Action Plan is very basic. You have completed your treatment planning session, but
                        nothing can happen if you do not come back. What do you need to take care of to make sure you
                        come to your next treatment session? You might need to take care of something as basic as
                        transportation, or something more complex like staying motivated. If you have trouble with this,
                        ask your counselor to share some Action Plans, or discuss your current situation with you.
                      </p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mt-6">
                      <h4 className="font-bold mb-4">Complete Your Action Plan:</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block font-semibold mb-2">
                            Is your most immediate treatment goal coming to the next treatment session? If so, write
                            that in here. If not, write in your current goal.
                          </label>
                          <textarea
                            className="w-full p-3 border rounded-lg min-h-[80px]"
                            placeholder="My immediate goal is..."
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-2">
                            Some steps I will take to reach this goal are:
                          </label>
                          <textarea
                            className="w-full p-3 border rounded-lg min-h-[120px]"
                            placeholder="Steps I will take..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {sessionCompleted && !inLiveSession && (
              <div className="p-4 border-t bg-white flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={() => setCurrentSessionContent(Math.max(0, currentSessionContent - 1))}
                  disabled={currentSessionContent === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous Section
                </Button>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSessionContent(i)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        currentSessionContent === i ? "bg-green-600" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setCurrentSessionContent(Math.min(3, currentSessionContent + 1))}
                  disabled={currentSessionContent === 3}
                >
                  Next Section
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}

            {inLiveSession && (
              <div className="p-4 border-t bg-white flex-shrink-0 text-center">
                <p className="text-gray-600">Your facilitator will guide you through each section</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
