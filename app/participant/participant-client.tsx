"use client"

import { CardDescription } from "@/components/ui/card"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { RoleNav } from "@/components/role-nav"
import { AIAssistantButton } from "@/components/ai-assistant"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Mail, ClipboardList, Circle, ChevronRight, Send, Trophy, Star, Award, Flame } from "lucide-react"
import React from "react"

interface MessageDisplay {
  id: string
  title: string
  content: string
  fromName: string
  readAt: string | null
  createdAt: string
  isUrgent?: boolean
  fromId?: string
}

export default function ParticipantDashboard() {
  const router = useRouter()
export default function ParticipantDashboard({ scheduleEvents }: { scheduleEvents: any[] }) {
  const router = useRouter()
  const {
    journalEntries,
    addJournalEntry,
    currentUser,
    messages,
    markMessageRead,
    addMessage,
    responses,
    makeupAssignments,
    getMakeupAssignmentsForParticipant,
  } = useStore()

  const [selectedMessage, setSelectedMessage] = useState<MessageDisplay | null>(null)
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
  const [replyTo, setReplyTo] = useState<MessageDisplay | null>(null)
  const [showAllAchievements, setShowAllAchievements] = useState(false)

  // Get data for current participant - use fallback for dev mode
  const participantId = currentUser?.id || "part-1"
  const myEnrollments = enrollments.filter((e) => e.participantId === participantId)
  const activeEnrollments = myEnrollments.filter((e) => e.status === "active")

  const myMessages = messages.filter((m) => m.participantId === participantId)
  const unreadMessages = myMessages.filter((m) => !m.readAt)

  // Get makeup assignments for this participant
  const myMakeupAssignments =
    makeupAssignments?.filter((a) => a.participantId === participantId && a.status !== "completed") || []

  const pendingHomework = myEnrollments.flatMap((enrollment) => {
    const program = programs.find((p) => p.id === enrollment.programId)
    if (!program) return []
    const currentSession = program.sessions.find((s) => s.sessionNumber === enrollment.currentSessionNumber)
    if (!currentSession?.homeworkTemplate) return []
    return [
      {
        programName: program.name,
        programSlug: program.slug,
        sessionNumber: currentSession.sessionNumber,
        homeworkTemplateTitle: currentSession.homeworkTemplate.title,
      },
    ]
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

  // Use real keys 
  const participantSchedule: Record<string, Record<string, any>> = {} 

  // Fill schedule from prop 
  const events = scheduleEvents || [] 
  events.forEach(e => { 
       const day = e.day 
       const time = e.time 
       if (!participantSchedule[day]) participantSchedule[day] = {} 
       participantSchedule[day][time] = { 
           program: e.name, 
           facilitator: e.facilitator, 
           room: e.location, 
           session: e.session, 
           programSlug: e.programSlug || "unknown" 
       } 
  }) 

  const getClassForSlot = (day: string, time: string) => {
    return participantSchedule[day]?.[time]
  }
      session: assignment.missedSessionNumber,
      programSlug: "makeup",
    }
  })

  const getClassForSlot = (day: string, time: string) => {
    return participantSchedule[day]?.[time]
  }

  // Mock awards and progress
  const completedSessions = activeEnrollments.reduce((acc, e) => acc + e.currentSessionNumber, 0)
  const sobrietyDays = 47

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
  const displayedAwards = earnedAwards.slice(-3)

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

  const handleSendMessage = () => {
    if (!composeSubject.trim() || !composeBody.trim() || !composeTo) return

    addMessage({
      participantId: composeTo, // Send to facilitator or admin
      title: composeSubject,
      content: composeBody,
      fromName: currentUser?.name || "Participant",
      readAt: null,
      createdAt: new Date().toISOString(),
    })

    setShowComposeModal(false)
    setComposeSubject("")
    setComposeBody("")
    setComposeTo("")
  }

  const handleReply = () => {
    if (!composeBody.trim() || !replyTo) return

    addMessage({
      participantId: replyTo.fromId || "fac-1",
      title: `Re: ${replyTo.title}`,
      content: composeBody,
      fromName: currentUser?.name || "Participant",
      readAt: null,
      createdAt: new Date().toISOString(),
    })

    setReplyTo(null)
    setComposeBody("")
    setShowMessageModal(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200/50 header-transparent sticky top-0 z-40">
        <RoleNav />
      </header>

      <main className="container mx-auto px-4 sm:px-8 py-6 sm:py-10 max-w-6xl">
        <div className="mb-4 sm:mb-8 flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 drop-shadow-sm">
              Welcome, {currentUser?.name || "Participant"}
            </h1>
            <p className="text-sm sm:text-base text-gray-700 mt-1 drop-shadow-sm">Your Learning Dashboard</p>
          </div>
          <AIAssistantButton role="participant" />
        </div>

        {/* Urgent Makeup Group Notice */}
        {myMakeupAssignments.length > 0 && (
          <Card className="mb-4 sm:mb-6 border-2 border-red-500 bg-red-50/90">
            <CardHeader className="pb-2 px-3 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-red-700">
                <Calendar className="h-5 w-5" />
                Makeup Group Required
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              {myMakeupAssignments.map((assignment) => (
                <div key={assignment.id} className="p-3 bg-white/80 rounded-lg mb-2">
                  <p className="font-medium text-red-800">
                    You missed {assignment.missedProgramName} Session {assignment.missedSessionNumber}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    Makeup Group:{" "}
                    {new Date(assignment.makeupDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    at {assignment.makeupTime}
                  </p>
                  {assignment.facilitatorAssigned && (
                    <Button
                      size="sm"
                      className="mt-2 bg-green-600 hover:bg-green-700"
                      onClick={() => router.push("/participant/makeup")}
                    >
                      View Assigned Work
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Awards Section */}
        {earnedAwards.length > 0 && (
          <Card
            className="mb-4 sm:mb-6 overflow-hidden card-transparent cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setShowAllAchievements(true)}
          >
            <CardHeader className="pb-1 px-3 sm:px-4 bg-gradient-to-r from-amber-50/80 to-yellow-50/80">
              <CardTitle className="flex items-center justify-between text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  My Achievements ({earnedAwards.length})
                </div>
                <span className="text-xs text-gray-500">Tap to view all</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-3 bg-gradient-to-r from-amber-50/80 to-yellow-50/80">
              <div className="flex gap-2 sm:gap-3 justify-center">
                {displayedAwards.map((award, index) => {
                  const Icon = award.icon
                  return (
                    <div
                      key={award.id}
                      className="flex flex-col items-center gap-1 group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div
                        className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                      >
                        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${award.color} animate-bounce-slow drop-shadow-md`} />
                      </div>
                      <span className="text-[10px] sm:text-xs font-medium text-center text-gray-700 max-w-[60px] truncate">
                        {award.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={showAllAchievements} onOpenChange={setShowAllAchievements}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                All Achievements
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Earned Awards */}
              <div>
                <h3 className="font-medium text-sm text-gray-700 mb-3">Earned ({earnedAwards.length})</h3>
                <div className="grid grid-cols-3 gap-3">
                  {earnedAwards.map((award, index) => {
                    const Icon = award.icon
                    return (
                      <div
                        key={award.id}
                        className="flex flex-col items-center gap-1 p-2 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg"
                      >
                        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center shadow-lg">
                          <div className="absolute inset-0 rounded-full animate-pulse opacity-50 bg-white/30"></div>
                          <Icon className={`h-6 w-6 ${award.color} animate-bounce-slow drop-shadow-md`} />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-sparkle"></div>
                        </div>
                        <span className="text-xs font-medium text-center text-gray-700">{award.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Locked Awards */}
              {awards.filter((a) => !a.earned).length > 0 && (
                <div>
                  <h3 className="font-medium text-sm text-gray-500 mb-3">Locked</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {awards
                      .filter((a) => !a.earned)
                      .map((award) => {
                        const Icon = award.icon
                        return (
                          <div
                            key={award.id}
                            className="flex flex-col items-center gap-1 p-2 bg-gray-100 rounded-lg opacity-50"
                          >
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <Icon className="h-6 w-6 text-gray-400" />
                            </div>
                            <span className="text-xs font-medium text-center text-gray-500">{award.name}</span>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}

              {/* Next Award Progress */}
              {nextAward && (
                <div className="p-3 bg-white/80 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Star className="h-4 w-4 text-amber-400" />
                    <span>Next: {nextAward.name}</span>
                  </div>
                  <Progress value={nextAward.progress} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">{nextAward.remaining}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Weekly Schedule */}
        <Card className="mb-4 sm:mb-6 card-transparent">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              My Weekly Schedule
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Scroll to view - Tap a class for details</CardDescription>
          </CardHeader>
          <CardContent className="p-1 sm:p-2">
            <div className="w-full overflow-x-auto -mx-1 px-1 touch-pan-x">
              <div className="min-w-[700px] sm:min-w-[900px]">
                <div className="grid grid-cols-8">
                  <div className="p-1 sm:p-2 font-semibold text-center bg-gray-100/80 border border-gray-400 text-xs sm:text-sm">
                    Time
                  </div>
                  {days.map((day) => (
                    <div
                      key={day}
                      className="p-1 sm:p-2 font-semibold text-center bg-gray-100/80 border border-gray-400 text-xs sm:text-sm"
                    >
                      {day}
                    </div>
                  ))}

                  {timeSlots.map((time) => (
                    <React.Fragment key={time}>
                      <div className="p-1 sm:p-2 text-center bg-gray-50/80 border border-gray-400 text-xs sm:text-sm font-medium">
                        {time}
                      </div>
                      {days.map((day) => {
                        const classInfo = getClassForSlot(day, time)
                        const isMakeup = classInfo?.program === "Makeup Group"
                        return (
                          <div
                            key={`${day}-${time}`}
                            className={`p-1 border border-gray-400 min-h-[40px] sm:min-h-[50px] ${
                              classInfo
                                ? isMakeup
                                  ? "bg-red-100/90 cursor-pointer hover:bg-red-200/90"
                                  : "bg-green-100/90 cursor-pointer hover:bg-green-200/90"
                                : "bg-white/60"
                            }`}
                            onClick={() => classInfo && setSelectedClass({ ...classInfo, day, time })}
                          >
                            {classInfo && (
                              <div className="text-xs">
                                <div
                                  className={`font-semibold truncate ${isMakeup ? "text-red-800" : "text-green-800"}`}
                                >
                                  {classInfo.program}
                                </div>
                                <div className={`hidden sm:block ${isMakeup ? "text-red-600" : "text-green-600"}`}>
                                  Session {classInfo.session}
                                </div>
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
              {myMessages.length > 0 ? (
                <div className="space-y-2">
                  {myMessages.slice(0, 3).map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-colors ${
                        msg.isUrgent
                          ? "bg-red-100/90 border-l-4 border-red-500"
                          : !msg.readAt
                            ? "bg-green-50/80 border-l-4 border-green-500"
                            : "bg-gray-50/80 hover:bg-gray-100/80"
                      }`}
                      onClick={() => {
                        setSelectedMessage(msg)
                        setShowMessageModal(true)
                        if (!msg.readAt) markMessageRead(msg.id)
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-medium text-sm ${msg.isUrgent ? "text-red-700" : ""}`}>
                          {msg.fromName}
                        </span>
                        <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className={`text-xs sm:text-sm truncate ${msg.isUrgent ? "text-red-600" : "text-gray-600"}`}>
                        {msg.title}
                      </p>
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
                      participantId: participantId,
                      programId: myEnrollments[0]?.programId || "prime-solutions",
                      sessionNumber: myEnrollments[0]?.currentSessionNumber || 1,
                      content: journalText,
                      submittedAt: new Date().toISOString(),
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
                    const progress = Math.round((enrollment.currentSessionNumber / program.totalSessions) * 100)
                    return (
                      <div
                        key={enrollment.id}
                        className="p-2 sm:p-3 bg-gray-50/80 rounded-lg cursor-pointer hover:bg-gray-100/80"
                        onClick={() => router.push(`/participant/programs/${program.slug}`)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{program.name}</span>
                          <span className="text-xs text-gray-500">
                            {enrollment.currentSessionNumber}/{program.totalSessions}
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
      <footer className="border-t border-gray-200/50 py-4 sm:py-6 footer-transparent">
        <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-gray-600">
          <p>&copy; 2025 DMS Clinical Services. All rights reserved.</p>
        </div>
      </footer>

      {/* Message Detail Modal */}
      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className={selectedMessage?.isUrgent ? "text-red-700" : ""}>
              {selectedMessage?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-gray-500">
              From: {selectedMessage?.fromName} -{" "}
              {selectedMessage?.createdAt && new Date(selectedMessage.createdAt).toLocaleString()}
            </div>
            <p className="text-sm whitespace-pre-wrap">{selectedMessage?.content}</p>
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setReplyTo(selectedMessage)
                  setComposeBody("")
                }}
              >
                Reply
              </Button>
              <Button variant="outline" onClick={() => setShowMessageModal(false)}>
                Close
              </Button>
            </div>

            {replyTo && (
              <div className="border-t pt-4">
                <Textarea
                  placeholder="Type your reply..."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  rows={3}
                  className="mb-2"
                />
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleReply}>
                  Send Reply
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Compose Message Modal */}
      <Dialog open={showComposeModal} onOpenChange={setShowComposeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">To:</label>
              <Select value={composeTo} onValueChange={setComposeTo}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fac-1">Facilitator</SelectItem>
                  <SelectItem value="admin-1">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Subject:</label>
              <Input
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                placeholder="Enter subject"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Message:</label>
              <Textarea
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                placeholder="Type your message..."
                rows={4}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleSendMessage}>
                Send
              </Button>
              <Button variant="outline" onClick={() => setShowComposeModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Class Detail Modal */}
      <Dialog open={!!selectedClass} onOpenChange={() => setSelectedClass(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedClass?.program}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Day:</div>
              <div className="font-medium">{selectedClass?.day}</div>
              <div className="text-gray-500">Time:</div>
              <div className="font-medium">{selectedClass?.time}</div>
              <div className="text-gray-500">Facilitator:</div>
              <div className="font-medium">{selectedClass?.facilitator}</div>
              <div className="text-gray-500">Room:</div>
              <div className="font-medium">{selectedClass?.room}</div>
              <div className="text-gray-500">Session:</div>
              <div className="font-medium">{selectedClass?.session}</div>
            </div>
            {selectedClass?.programSlug === "makeup" ? (
              <Button
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => {
                  setSelectedClass(null)
                  router.push("/participant/makeup")
                }}
              >
                View Makeup Work
              </Button>
            ) : (
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setSelectedClass(null)
                  router.push(`/participant/programs/${selectedClass?.programSlug}`)
                }}
              >
                Go to Program
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
