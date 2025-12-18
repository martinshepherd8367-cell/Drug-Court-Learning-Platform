"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { RoleNav } from "@/components/role-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Calendar, Mail, ClipboardList, Circle, ChevronRight, Send, Trophy, Star, Award, Flame } from "lucide-react"
import React from "react"

export default function ParticipantDashboard() {
  const router = useRouter()
  const {
    programs,
    enrollments,
    journalEntries,
    addJournalEntry,
    currentUser,
    messages,
    markMessageRead,
    addMessage,
    responses,
  } = useStore()

  const [selectedMessage, setSelectedMessage] = useState<{
    id: string
    subject: string
    content: string
    fromName: string
    sentAt: string
    read: boolean
    fromId: string
  } | null>(null)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showComposeModal, setShowComposeModal] = useState(false)
  const [composeTo, setComposeTo] = useState("")
  const [composeSubject, setComposeSubject] = useState("")
  const [composeBody, setComposeBody] = useState("")
  const [journalText, setJournalText] = useState("")
  const [selectedClass, setSelectedClass] = useState<{
    day: string
    time: string
    program: string
    facilitator: string
    room: string
    session: number
    programSlug: string
  } | null>(null)
  const [replyTo, setReplyTo] = useState<{
    id: string
    subject: string
    content: string
    fromName: string
    sentAt: string
    read: boolean
    fromId: string
  } | null>(null)

  // Get data for current participant
  const myEnrollments = enrollments.filter((e) => e.participantId === currentUser?.id)
  const activeEnrollments = myEnrollments.filter((e) => e.status === "active")
  const unreadMessages = messages.filter((m) => !m.read)
  const pendingHomework = myEnrollments.flatMap((enrollment) => {
    const program = programs.find((p) => p.id === enrollment.programId)
    return enrollment.sessions
      .filter((session) => session.homeworkTemplate && !session.homework)
      .map((session) => ({
        programName: program?.name || "Unknown Program",
        programSlug: program?.slug || "#",
        sessionNumber: session.sessionNumber,
        homeworkTemplateTitle: session.homeworkTemplate?.title || "Unknown Homework",
      }))
  })

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
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
  ]

  // Mock participant's scheduled classes based on enrollments
  const participantSchedule: Record<
    string,
    Record<string, { program: string; facilitator: string; room: string; session: number; programSlug: string }>
  > = {}

  // Add scheduled classes based on active enrollments
  activeEnrollments.forEach((enrollment, index) => {
    const program = programs.find((p) => p.id === enrollment.programId)
    if (program) {
      // Assign different time slots for different programs
      const dayIndex = (index % 5) + 1 // Mon-Fri
      const timeIndex = index % 3 // Spread across morning times
      const day = days[dayIndex]
      const time = timeSlots[timeIndex]

      if (!participantSchedule[day]) participantSchedule[day] = {}
      participantSchedule[day][time] = {
        program: program.name,
        facilitator: "Ms. Thompson", // Mock facilitator
        room: "Room " + (101 + index), // Mock room
        session: enrollment.currentSession,
        programSlug: program.slug,
      }
    }
  })

  const getClassForSlot = (day: string, time: string) => {
    return participantSchedule[day]?.[time]
  }

  // Mock awards and progress - replace with actual logic
  const completedSessions = activeEnrollments.reduce((acc, e) => acc + e.currentSession, 0)
  const sobrietyDays = 47 // Mock - would come from user profile

  const awards = [
    { id: 1, name: "First Session", icon: Star, earned: completedSessions >= 1, color: "text-yellow-500" },
    { id: 2, name: "5 Sessions", icon: Award, earned: completedSessions >= 5, color: "text-blue-500" },
    { id: 3, name: "10 Sessions", icon: Trophy, earned: completedSessions >= 10, color: "text-purple-500" },
    { id: 4, name: "7 Days Sober", icon: Flame, earned: sobrietyDays >= 7, color: "text-orange-500" },
    { id: 5, name: "30 Days Sober", icon: Flame, earned: sobrietyDays >= 30, color: "text-red-500" },
    {
      id: 6,
      name: "Program Complete",
      icon: Trophy,
      earned: myEnrollments.some((e) => e.status === "completed"),
      color: "text-green-500",
    },
  ]

  const earnedAwards = awards.filter((a) => a.earned)

  // Calculate next award and progress
  let nextAward = null
  if (completedSessions < 5) {
    nextAward = {
      name: "5 Sessions",
      progress: (completedSessions / 5) * 100,
      remaining: `${5 - completedSessions} more sessions`,
    }
  } else if (completedSessions < 10) {
    nextAward = {
      name: "10 Sessions",
      progress: (completedSessions / 10) * 100,
      remaining: `${10 - completedSessions} more sessions`,
    }
  } else if (sobrietyDays < 30) {
    nextAward = {
      name: "30 Days Sober",
      progress: (sobrietyDays / 30) * 100,
      remaining: `${30 - sobrietyDays} more days`,
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200/50 header-transparent sticky top-0 z-40">
        <RoleNav />
      </header>

      <main className="container mx-auto px-4 sm:px-8 py-6 sm:py-10 max-w-6xl">
        <div className="mb-4 sm:mb-8 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 drop-shadow-sm">
            Welcome, {currentUser?.name || "Participant"}
          </h1>
          <p className="text-sm sm:text-base text-gray-700 mt-1 drop-shadow-sm">Your Learning Dashboard</p>
        </div>

        {earnedAwards.length > 0 && (
          <Card className="mb-4 sm:mb-6 overflow-hidden card-transparent">
            <CardHeader className="pb-2 px-3 sm:px-6 bg-gradient-to-r from-amber-50/80 to-yellow-50/80">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                My Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 bg-gradient-to-r from-amber-50/80 to-yellow-50/80">
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                {earnedAwards.map((award, index) => {
                  const Icon = award.icon
                  return (
                    <div
                      key={award.id}
                      className="flex flex-col items-center gap-1 group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div
                        className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-full ${award.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                      >
                        <div className="absolute inset-0 rounded-full animate-pulse opacity-50 bg-white/30"></div>
                        <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white animate-bounce-slow drop-shadow-md" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-sparkle"></div>
                        <div
                          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none group-hover:animate-shine"
                          style={{
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                          }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-center text-gray-700 max-w-[80px]">{award.name}</span>
                    </div>
                  )
                })}
              </div>

              {nextAward && (
                <div className="mt-4 p-3 bg-white/60 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Star className="h-4 w-4 text-amber-400" />
                    <span>Next: {nextAward.name}</span>
                  </div>
                  <Progress value={nextAward.progress} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">{nextAward.remaining}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Weekly Schedule */}
        <Card className="mb-4 sm:mb-6 card-transparent">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              My Weekly Schedule
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Scroll to view • Tap a class for details</CardDescription>
          </CardHeader>
          <CardContent className="p-1 sm:p-2">
            <div className="w-full overflow-x-auto -mx-1 px-1 touch-pan-x">
              <div className="min-w-[700px] sm:min-w-[900px]">
                <div className="grid grid-cols-8">
                  {/* Header Row */}
                  <div className="p-1 sm:p-2 font-semibold text-center bg-gray-100/80 border border-gray-400 text-xs sm:text-sm">
                    Time
                  </div>
                  {days.map((day) => (
                    <div
                      key={day}
                      className="p-1 sm:p-2 font-semibold text-center bg-gray-100/80 border border-gray-400 text-xs sm:text-sm"
                    >
                      <span className="hidden sm:inline">{day}</span>
                      <span className="sm:hidden">{day.slice(0, 3)}</span>
                    </div>
                  ))}

                  {/* Time Slots */}
                  {timeSlots.map((time) => (
                    <React.Fragment key={time}>
                      <div className="p-1 sm:p-2 text-center bg-gray-50/80 border border-gray-400 text-xs sm:text-sm font-medium">
                        {time}
                      </div>
                      {days.map((day) => {
                        const classInfo = getClassForSlot(day, time)
                        return (
                          <div
                            key={`${day}-${time}`}
                            className={`p-1 border border-gray-400 min-h-[40px] sm:min-h-[50px] ${
                              classInfo ? "bg-green-100/90 cursor-pointer hover:bg-green-200/90" : "bg-white/60"
                            }`}
                            onClick={() => classInfo && setSelectedClass(classInfo)}
                          >
                            {classInfo && (
                              <div className="text-xs">
                                <div className="font-semibold text-green-800 truncate">{classInfo.program}</div>
                                <div className="text-green-600 hidden sm:block">Session {classInfo.session}</div>
                                <div className="text-gray-600 text-[10px] hidden sm:block">{classInfo.room}</div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Messages Card */}
          <Card className="card-transparent">
            <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  Messages
                </span>
                <div className="flex items-center gap-2">
                  {unreadMessages.length > 0 && <Badge className="bg-red-500">{unreadMessages.length} new</Badge>}
                  <Button
                    size="sm"
                    onClick={() => setShowComposeModal(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">New</span>
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              {messages.length > 0 ? (
                <div className="space-y-2">
                  {messages.slice(0, 3).map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-colors ${
                        !msg.read ? "bg-green-50/80 border-l-4 border-green-500" : "bg-gray-50/80 hover:bg-gray-100/80"
                      }`}
                      onClick={() => {
                        setSelectedMessage(msg)
                        setShowMessageModal(true)
                        if (!msg.read) markMessageRead(msg.id)
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{msg.fromName}</span>
                        <span className="text-xs text-gray-500">{new Date(msg.sentAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{msg.subject}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No messages yet</p>
              )}
            </CardContent>
          </Card>

          {/* Homework Card */}
          <Card className="card-transparent">
            <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                Homework
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              {pendingHomework.length > 0 ? (
                <div className="space-y-2">
                  {pendingHomework.slice(0, 3).map((hw, idx) => (
                    <div
                      key={idx}
                      className="p-2 sm:p-3 bg-amber-50/80 rounded-lg border border-amber-200 cursor-pointer hover:bg-amber-100/80"
                      onClick={() =>
                        router.push(`/participant/programs/${hw.programSlug}/sessions/${hw.sessionNumber}`)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{hw.programName}</span>
                        <Badge variant="outline" className="text-amber-600 border-amber-300">
                          Pending
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">Session {hw.sessionNumber} Homework</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Circle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">All caught up!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Journal Card */}
          <Card className="card-transparent">
            <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <span className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  Daily Journal
                </span>
                <Button size="sm" variant="outline" onClick={() => router.push("/participant/journal")}>
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <Textarea
                placeholder="How are you feeling today? Write a quick reflection..."
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                className="mb-2 text-sm bg-white/80"
                rows={3}
              />
              <Button
                size="sm"
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => {
                  if (journalText.trim()) {
                    addJournalEntry({
                      odCd: currentUser?.id || "p1",
                      odProgram: myEnrollments[0]?.programId || "prime-solutions",
                      content: journalText,
                      mood: "neutral",
                      isPrivate: false,
                    })
                    setJournalText("")
                  }
                }}
              >
                Save Entry
              </Button>
            </CardContent>
          </Card>

          {/* My Programs Card */}
          <Card className="card-transparent">
            <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                My Programs
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              {myEnrollments.length > 0 ? (
                <div className="space-y-2">
                  {myEnrollments.map((enrollment) => {
                    const program = programs.find((p) => p.id === enrollment.programId)
                    if (!program) return null
                    const progress = Math.round((enrollment.currentSession / program.totalSessions) * 100)
                    return (
                      <div
                        key={enrollment.id}
                        className="p-2 sm:p-3 bg-gray-50/80 rounded-lg cursor-pointer hover:bg-gray-100/80"
                        onClick={() => router.push(`/participant/programs/${program.slug}`)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{program.name}</span>
                          <span className="text-xs text-gray-500">
                            {enrollment.currentSession}/{program.totalSessions}
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No programs enrolled</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 py-3 sm:py-4 footer-transparent">
        <div className="container mx-auto px-3 sm:px-6 text-center text-xs sm:text-sm text-gray-600">
          © 2025 DMS Clinical Services. All rights reserved.
        </div>
      </footer>

      {/* Message Detail Modal */}
      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
        <DialogContent className="card-transparent">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>From: {selectedMessage.fromName}</span>
                <span>{new Date(selectedMessage.sentAt).toLocaleString()}</span>
              </div>
              <div className="p-4 bg-gray-50/80 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{selectedMessage.content}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setShowMessageModal(false)
                    setReplyTo(selectedMessage)
                    setShowComposeModal(true)
                  }}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Reply
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Compose Message Modal */}
      <Dialog open={showComposeModal} onOpenChange={setShowComposeModal}>
        <DialogContent className="card-transparent">
          <DialogHeader>
            <DialogTitle>{replyTo ? `Reply to: ${replyTo.subject}` : "New Message"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!replyTo && (
              <div>
                <label className="text-sm font-medium">To:</label>
                <select
                  className="w-full mt-1 p-2 border rounded-lg bg-white/80"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                >
                  <option value="">Select recipient...</option>
                  <option value="facilitator">My Facilitator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
            <div>
              <label className="text-sm font-medium">Subject:</label>
              <Input
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                placeholder="Enter subject..."
                className="mt-1 bg-white/80"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Message:</label>
              <Textarea
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                placeholder="Type your message..."
                rows={5}
                className="mt-1 bg-white/80"
              />
            </div>
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => {
                if ((composeTo || replyTo) && composeSubject && composeBody) {
                  addMessage({
                    fromId: currentUser?.id || "p1",
                    fromName: currentUser?.name || "Participant",
                    toId: replyTo?.fromId || composeTo,
                    toName: replyTo?.fromName || (composeTo === "facilitator" ? "Facilitator" : "Admin"),
                    subject: composeSubject,
                    content: composeBody,
                    read: false,
                  })
                  setShowComposeModal(false)
                  setReplyTo(null)
                  setComposeTo("")
                  setComposeSubject("")
                  setComposeBody("")
                }
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Class Detail Modal */}
      <Dialog open={!!selectedClass} onOpenChange={() => setSelectedClass(null)}>
        <DialogContent className="card-transparent">
          <DialogHeader>
            <DialogTitle>{selectedClass?.program}</DialogTitle>
          </DialogHeader>
          {selectedClass && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Day:</span>
                  <p className="font-medium">{selectedClass.day}</p>
                </div>
                <div>
                  <span className="text-gray-500">Time:</span>
                  <p className="font-medium">{selectedClass.time}</p>
                </div>
                <div>
                  <span className="text-gray-500">Facilitator:</span>
                  <p className="font-medium">{selectedClass.facilitator}</p>
                </div>
                <div>
                  <span className="text-gray-500">Location:</span>
                  <p className="font-medium">{selectedClass.room}</p>
                </div>
                <div>
                  <span className="text-gray-500">Session:</span>
                  <p className="font-medium">{selectedClass.session}</p>
                </div>
              </div>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setSelectedClass(null)
                  router.push(`/participant/programs/${selectedClass.programSlug}`)
                }}
              >
                Go to Program
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
