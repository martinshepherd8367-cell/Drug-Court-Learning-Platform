"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { AIAssistantButton } from "@/components/ai-assistant"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label" // Import Label component
import { Input } from "@/components/ui/input" // Import Input component
import {
  BookOpen,
  Users,
  ChevronRight,
  Lock,
  MessageSquare,
  ClipboardCheck,
  BookMarked,
  Bell,
  Settings,
  LogOut,
  Eye,
  Send,
  Check,
  X,
  Calendar,
  Play,
  ChevronLeft,
  Clock,
  AlertTriangle,
  QrCode,
  CheckCircle,
  MapPin,
  Video,
} from "lucide-react"
import type { HomeworkSubmission, User, Program, Session, Message, JournalEntry, Enrollment, UserRole, MakeupAssignment } from "@/lib/types"

export default function FacilitatorDashboard() {
  const router = useRouter()
  const {
    programs,
    enrollments,
    users,
    messages,
    journalEntries,
    homeworkSubmissions,
    participantResponses,
    makeupAssignments,
    currentUser,
    assignMakeupWork,
    addMessage,
    generateClassQRCode,
    completedSessions,
  } = useStore()

  // Modal states
  const [showViewParticipants, setShowViewParticipants] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [showHomework, setShowHomework] = useState(false)
  const [showJournals, setShowJournals] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showClassDetail, setShowClassDetail] = useState(false)
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null)
  const [showMessageCompose, setShowMessageCompose] = useState(false)
  const [composeToId, setComposeToId] = useState("")
  const [composeToRole, setComposeToRole] = useState<UserRole | "">("")
  const [composeSearch, setComposeSearch] = useState("")
  const [messageText, setMessageText] = useState("")
  const [messageRecipient, setMessageRecipient] = useState("")
  const [notificationsViewed, setNotificationsViewed] = useState(false)
  const [selectedClassForParticipants, setSelectedClassForParticipants] = useState<string | null>(null)
  const [selectedHomework, setSelectedHomework] = useState<any | null>(null)
  const [feedbackText, setFeedbackText] = useState("")
  const [showStartClass, setShowStartClass] = useState(false)
  const [messageError, setMessageError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)

  const [showMakeupAssignments, setShowMakeupAssignments] = useState(false)
  const [selectedMakeupParticipant, setSelectedMakeupParticipant] = useState<MakeupAssignment | null>(null)
  const [makeupWorksheets, setMakeupWorksheets] = useState<string[]>([])
  const [makeupReadings, setMakeupReadings] = useState<string[]>([])
  const [makeupInstructions, setMakeupInstructions] = useState("")

  const [homeworkList, setHomeworkList] = useState<any[]>([])
  const [pendingRevisions, setPendingRevisions] = useState<any[]>([])
  const [showPendingRevisions, setShowPendingRevisions] = useState(false)
  const [processedHomework, setProcessedHomework] = useState<Record<string, "approved" | "revision">>({})

  // New state for button state
  const [makeupAssignButtonState, setMakeupAssignButtonState] = useState<Record<string, boolean>>({})


  // Derived schedule classes
  const scheduleClasses = useMemo(() => {
    const classMap: Record<string, any> = {};
    enrollments.forEach(e => {
      if (!e.schedule || e.status !== 'active') return;
      if (currentUser?.role === 'facilitator' && e.schedule.facilitatorId !== currentUser.id) return;

      // Group by day/time/room/program to form a "class"
      const key = `${e.programId}-${e.schedule.day}-${e.schedule.time}-${e.schedule.room}`;

      if (!classMap[key]) {
        const prog = programs.find(p => p.id === e.programId);
        const fac = users.find(u => u.id === e.schedule!.facilitatorId);
        const isCompleted = completedSessions.some(cs =>
          cs.classId === key &&
          cs.programId === e.programId &&
          cs.sessionNumber === e.currentSessionNumber
        );

        classMap[key] = {
          id: key,
          name: prog?.name || "Unknown Program",
          day: e.schedule.day,
          time: e.schedule.time,
          program: prog?.name || "Unknown Program",
          session: e.currentSessionNumber,
          location: e.schedule.room,
          facilitator: fac?.name || "Unknown Facilitator",
          programId: e.programId,
          enrolled: 0,
          participants: [],
          isCompleted
        };
      }
      classMap[key].participants.push(e);
      classMap[key].enrolled = classMap[key].participants.length;
    });
    return Object.values(classMap);
  }, [enrollments, programs, users]);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
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
  ]

  // Authoritative list of participants for this facilitator
  const myParticipantIds = useMemo(() => {
    return enrollments
      .filter(e => e.status === 'active' && e.schedule?.facilitatorId === currentUser?.id)
      .map(e => e.participantId);
  }, [enrollments, currentUser]);

  const facilitatorMessages = useMemo(() => {
    if (!currentUser) return [];
    return messages
      .filter(m => m.recipientId === currentUser.id || m.senderId === currentUser.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [messages, currentUser]);

  const journalSubmissions = useMemo(() => {
    return (journalEntries || [])
      .filter(entry => myParticipantIds.includes(entry.participantId))
      .map((entry: JournalEntry) => {
        const user = users.find((u: User) => u.id === entry.participantId);
        return {
          id: entry.id,
          participant: user?.name || "Unknown",
          participantId: entry.participantId,
          date: new Date(entry.submittedAt),
          content: entry.content,
          late: false, // Simple fallback
        };
      });
  }, [journalEntries, users, myParticipantIds]);

  useEffect(() => {
    const list = (homeworkSubmissions || [])
      .filter(sub => myParticipantIds.includes(sub.participantId))
      .map((sub: HomeworkSubmission) => {
        const user = users.find((u: User) => u.id === sub.participantId);
        // HomeworkSubmission might not have programId anymore, try to find it via session
        let prog: Program | undefined;
        let sess: Session | undefined;

        for (const p of programs) {
          const s = p.sessions.find(s => s.id === sub.sessionId);
          if (s) {
            prog = p;
            sess = s;
            break;
          }
        }

        return {
          id: sub.id,
          participant: user?.name || "Unknown",
          participantId: sub.participantId,
          session: prog ? `${prog.name} - Session ${sess?.sessionNumber || "?"}` : "Unknown Session",
          title: sess?.title || "Homework",
          submitted: new Date(sub.submittedAt),
          status: sub.status === "revision_requested" ? "revision" : sub.status,
        } as any;
      });
    setHomeworkList(list);
  }, [homeworkSubmissions, users, programs, myParticipantIds]);

  const handleApproveHomework = (hw: (typeof homeworkSubmissions)[0]) => {
    setProcessedHomework((prev) => ({ ...prev, [hw.id]: "approved" }))
    // Remove from list after a brief delay to show the blue state
    setTimeout(() => {
      setHomeworkList((prev) => prev.filter((h) => h.id !== hw.id))
      setSelectedHomework(null)
      setFeedbackText("")
    }, 500)
  }

  const handleRequestRevision = (hw: (typeof homeworkSubmissions)[0]) => {
    setProcessedHomework((prev) => ({ ...prev, [hw.id]: "revision" }))
    setPendingRevisions((prev) => [...prev, { ...hw, status: "revision" as const, feedback: feedbackText }])
    // Remove from list after a brief delay to show the blue state
    setTimeout(() => {
      setHomeworkList((prev) => prev.filter((h) => h.id !== hw.id))
      setSelectedHomework(null)
      setFeedbackText("")
    }, 500)
  }


  // Get participants enrolled in a program
  const getParticipantsInProgram = (programId: string) => {
    const programEnrollments = enrollments.filter((e: Enrollment) => e.programId === programId && e.status === "active" && e.schedule?.facilitatorId === currentUser?.id)
    return programEnrollments.map((e: Enrollment) => {
      const user = users.find((u: User) => u.id === e.participantId)
      return { ...e, user }
    })
  }

  const unreadMessagesCount = facilitatorMessages.filter((m) => !m.readAt && m.recipientId === currentUser?.id).length
  // const pendingHomework = homeworkSubmissions.filter((h) => h.status === "pending").length // Replaced by homeworkList state
  const pendingHomework = homeworkList.filter((h) => h.status === "pending").length
  const pendingJournals = journalSubmissions.filter((j) => !j.late).length
  const totalNotifications = notificationsViewed ? 0 : unreadMessagesCount + pendingHomework

  const pendingMakeupAssignments = makeupAssignments.filter((a) => a.status === "pending" && !a.facilitatorAssigned)

  // Available worksheets and readings for makeup work
  const availableWorksheets = [
    "Thinking Errors Worksheet",
    "Self-Assessment Checklist",
    "Trigger Identification Form",
    "Coping Skills Inventory",
    "Goal Setting Worksheet",
    "Relapse Prevention Plan",
    "Communication Skills Exercise",
    "Emotional Regulation Diary",
  ]

  const availableReadings = [
    "Chapter 1: Understanding Addiction",
    "Chapter 2: The Change Process",
    "Chapter 3: Identifying Triggers",
    "Chapter 4: Building Support",
    "Chapter 5: Cognitive Restructuring",
    "Chapter 6: Healthy Coping",
    "Chapter 7: Relapse Prevention",
    "Chapter 8: Moving Forward",
  ]

  const getClassForSlot = (day: string, time: string) => {
    return scheduleClasses.find((c) => c.day === day && c.time === time)
  }

  const setSelectedScheduleClass = (classInfo: any) => {
    setSelectedClass(classInfo)
    setShowClassDetail(true)
  }

  const commonReplies = [
    "Thank you for your message. I'll get back to you shortly.",
    "Please see me after our next session to discuss this.",
    "Great progress! Keep up the good work.",
    "Remember to complete your homework before next session.",
    "I've noted your concern and will address it in our next meeting.",
  ]

  const commonFeedbackReplies = [
    "Great work! Your insights show real growth.",
    "Good effort. Please expand on your thoughts about triggers.",
    "Please provide more specific examples from your week.",
    "Excellent reflection on your behavior patterns.",
    "Consider how this connects to your recovery goals.",
    "Please redo - missing key components of the assignment.",
    "Good start, but please go deeper on the emotional impact.",
    "Well done identifying your thinking errors!",
  ]

  const handleAssignMakeupWork = () => {
    if (selectedMakeupParticipant && makeupInstructions) {
      assignMakeupWork(selectedMakeupParticipant.id, makeupWorksheets, makeupReadings, makeupInstructions)
      // Mark button as clicked (blue)
      setMakeupAssignButtonState((prev) => ({ ...prev, [selectedMakeupParticipant.id]: true }))
      // Close dialog and reset form
      setShowMakeupAssignments(false)
      setSelectedMakeupParticipant(null)
      setMakeupWorksheets([])
      setMakeupReadings([])
      setMakeupInstructions("")
    }
  }



  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200/50 header-transparent sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Classes</h1>
              <p className="text-sm text-gray-600">Welcome, {currentUser?.name || "Facilitator"}</p>
            </div>

            <div className="flex items-center gap-2">
              <AIAssistantButton role="facilitator" />

              {/* View Participants Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowViewParticipants(true)}
                className="gap-2 bg-white/80"
              >
                <Eye className="h-4 w-4" />
                View Participants
              </Button>


              {/* Notification Bell */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowNotifications(true)
                  setNotificationsViewed(true)
                }}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                {totalNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalNotifications}
                  </span>
                )}
              </Button>

              {/* Settings */}
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
                <Settings className="h-5 w-5" />
              </Button>

              {/* Sign Out */}
              <Button variant="outline" size="sm" onClick={() => router.push("/")} className="gap-2 bg-white/80">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6 flex-1">
        {pendingMakeupAssignments.length > 0 && (
          <Card className="card-transparent border-red-300 bg-red-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base text-red-800">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Makeup Work Needed
                </span>
                <Badge className="bg-red-600">{pendingMakeupAssignments.length} pending</Badge>
              </CardTitle>
              <CardDescription className="text-red-700">
                These participants need work assigned for the upcoming makeup group
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pendingMakeupAssignments.map((assignment) => (
                  <button
                    key={assignment.id}
                    className={`w-full p-3 bg-white rounded-lg border text-left hover:bg-red-50 transition-colors ${makeupAssignButtonState[assignment.id] ? "border-blue-500 bg-blue-50" : "border-red-200"
                      }`}
                    onClick={() => {
                      setSelectedMakeupParticipant(assignment)
                      setShowMakeupAssignments(true)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{assignment.participantName}</div>
                        <div className="text-sm text-gray-600">
                          Missed: {assignment.missedProgramName} - Session {assignment.missedSessionNumber}
                        </div>
                        <div className="text-xs text-gray-500">
                          Makeup Date: {new Date(assignment.makeupDate).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge className={makeupAssignButtonState[assignment.id] ? "bg-blue-600" : "bg-red-600"}>
                        {makeupAssignButtonState[assignment.id] ? "Assigned" : "Assign Work"}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weekly Schedule Grid */}
        <Card className="card-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              My Active Classes
            </CardTitle>
            <CardDescription>Select a class instance to manage attendance and session details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="origin-top-left scale-[0.65]" style={{ width: "154%" }}>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-gray-400 bg-gray-100/80 p-2 text-sm font-semibold">Time</th>
                      {days.map((day) => (
                        <th key={day} className="border border-gray-400 bg-gray-100/80 p-2 text-sm font-semibold">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((time) => (
                      <tr key={time}>
                        <td className="border border-gray-400 bg-gray-50/80 p-2 text-sm font-medium text-center">
                          {time}
                        </td>
                        {days.map((day) => {
                          const cls = getClassForSlot(day, time)
                          return (
                            <td
                              key={`${day}-${time}`}
                              className={`border border-gray-400 p-1 min-h-[60px] ${cls
                                ? cls.isCompleted
                                  ? "bg-gray-100/90 cursor-not-allowed"
                                  : "bg-green-100/90 cursor-pointer hover:bg-green-200/90"
                                : "bg-white/60"
                                }`}
                              onClick={() => cls && !cls.isCompleted && setSelectedScheduleClass(cls)}
                            >
                              {cls && (
                                <div className="text-xs">
                                  <div className={`font-bold ${cls.isCompleted ? "text-gray-500" : "text-green-800"}`}>{cls.name}</div>
                                  <div className={cls.isCompleted ? "text-gray-400" : "text-green-600"}>Session {cls.session}</div>
                                  <div className="text-gray-600 flex items-center justify-between">
                                    <span>{cls.location}</span>
                                    {cls.isCompleted ? (
                                      <Badge variant="outline" className="text-[10px] h-4 px-1 bg-gray-50">Completed</Badge>
                                    ) : (
                                      <span className="opacity-70 italic text-[10px]">
                                        {cls.location.toLowerCase().includes("virtual") || cls.location.toLowerCase().includes("zoom") ? "Virtual" : "In-person"}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages, Homework, Journals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Messages Card */}
          <Card
            className="cursor-pointer hover:border-green-500 transition-colors card-transparent"
            onClick={() => setShowMessages(true)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  Messages
                </span>
                {unreadMessagesCount > 0 && <Badge className="bg-red-500">{unreadMessagesCount} new</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {facilitatorMessages.slice(0, 2).map((msg) => (
                  <div
                    key={msg.id}
                    className={`text-sm p-2 rounded ${msg.readAt ? "bg-gray-50" : "bg-green-50 border-l-2 border-green-500"}`}
                  >
                    <div className="font-medium">{msg.fromName}</div>
                    <div className="text-gray-600 text-xs truncate">{msg.content}</div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="text-green-600 p-0 mt-2 text-sm">
                View all messages →
              </Button>
            </CardContent>
          </Card>

          {/* Homework Review */}
          <Card className="card-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                Homework Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pendingRevisions.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full mb-2 border-amber-500 text-amber-600 hover:bg-amber-50 bg-transparent"
                    onClick={() => setShowPendingRevisions(true)}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Awaiting Revision ({pendingRevisions.length})
                  </Button>
                )}
                {homeworkList
                  .filter((h) => h.status === "pending")
                  .slice(0, 3)
                  .map((hw) => (
                    <div
                      key={hw.id}
                      className="flex items-center justify-between p-2 bg-gray-50/50 rounded cursor-pointer hover:bg-gray-100/50"
                      onClick={() => {
                        setSelectedHomework(hw)
                        setShowHomework(true)
                      }}
                    >
                      <div>
                        <div className="font-medium text-sm">{hw.participant}</div>
                        <div className="text-xs text-gray-500">{hw.session}</div>
                        <div className="text-sm font-medium text-green-700">{hw.title}</div>
                      </div>
                      <Badge className="bg-green-600 text-xs">Review</Badge>
                    </div>
                  ))}
                {homeworkList.filter((h) => h.status === "pending").length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">No homework pending review</p>
                )}
              </div>
              <Button className="w-full mt-3 bg-green-600 hover:bg-green-700" onClick={() => setShowHomework(true)}>
                View All ({homeworkList.filter((h) => h.status === "pending").length})
              </Button>
            </CardContent>
          </Card>

          {/* Daily Journals Card */}
          <Card
            className="cursor-pointer hover:border-green-500 transition-colors card-transparent"
            onClick={() => setShowJournals(true)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <BookMarked className="h-5 w-5 text-green-600" />
                  Daily Journals
                </span>
                <Badge variant="outline">{journalSubmissions.length} entries</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {journalSubmissions.slice(0, 2).map((journal) => (
                  <div
                    key={journal.id}
                    className={`text-sm p-2 rounded ${journal.late ? "bg-red-50 border-l-2 border-red-500" : "bg-gray-50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{journal.participant}</span>
                      {journal.late && (
                        <Badge variant="destructive" className="text-xs">
                          Late
                        </Badge>
                      )}
                    </div>
                    <div className="text-gray-600 text-xs truncate">{journal.content}</div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="text-green-600 p-0 mt-2 text-sm">
                View all journals →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Programs List */}
        <Card className="card-transparent">
          <CardHeader>
            <CardTitle>Program Curriculum</CardTitle>
            <CardDescription>View session materials and session guides for each program</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {programs.filter(p => getParticipantsInProgram(p.id).length > 0).map((program) => {
                const participants = getParticipantsInProgram(program.id)
                return (
                  <Card
                    key={program.id}
                    className={`cursor-pointer transition-all hover:border-green-500 hover:shadow-md ${program.isLocked ? "opacity-60" : ""
                      } card-transparent`}
                    onClick={() => {
                      if (!program.isLocked || program.sessions.length > 0) {
                        router.push(`/facilitator/programs/${program.slug}`)
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold">{program.name}</h3>
                            {program.isLocked && (
                              <Badge variant="secondary" className="gap-1 text-xs">
                                <Lock className="h-3 w-3" />
                                Locked
                              </Badge>
                            )}
                            {!program.isLocked && program.sessions.length > 0 && (
                              <Badge className="bg-green-600 text-xs">Active</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{program.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {program.totalSessions} Sessions
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {participants.length} Participant{participants.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* View Participants Modal */}
      <Dialog
        open={showViewParticipants}
        onOpenChange={(open) => {
          setShowViewParticipants(open)
          if (!open) setSelectedClassForParticipants(null)
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto card-transparent">
          <DialogHeader>
            <DialogTitle>
              {selectedClassForParticipants ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedClassForParticipants(null)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {programs.find((p) => p.id === selectedClassForParticipants)?.name} - Participants
                </div>
              ) : (
                "Select a Class"
              )}
            </DialogTitle>
          </DialogHeader>

          {!selectedClassForParticipants ? (
            // Show list of classes first
            <div className="space-y-2">
              {programs
                .filter((p) => !p.isLocked && getParticipantsInProgram(p.id).length > 0)
                .map((program) => {
                  const participants = getParticipantsInProgram(program.id)
                  return (
                    <Card
                      key={program.id}
                      className="cursor-pointer hover:border-green-500 transition-colors card-transparent"
                      onClick={() => setSelectedClassForParticipants(program.id)}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <div className="font-medium">{program.name}</div>
                          <div className="text-sm text-gray-500">
                            {participants.length > 0
                              ? `${participants.length} participants enrolled`
                              : "Participants not yet enrolled"}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          ) : (
            // Show participants in selected class
            <div className="space-y-2">
              {(() => {
                const program = programs.find((p) => p.id === selectedClassForParticipants)
                const participants = getParticipantsInProgram(selectedClassForParticipants)

                if (participants.length === 0) {
                  return (
                    <p className="text-sm text-gray-500 text-center py-4">No participants enrolled in this class yet</p>
                  )
                }

                return (
                  <>
                    <div className="flex justify-end mb-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 bg-transparent"
                        onClick={() => {
                          setMessageRecipient(`class-${selectedClassForParticipants}`)
                          setShowMessageCompose(true)
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message All
                      </Button>
                    </div>
                    {participants.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div>
                          <div className="font-medium">{p.user?.name || "Unknown"}</div>
                          <div className="text-sm text-gray-500">
                            Session {p.currentSessionNumber} of {program?.totalSessions || 16}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedParticipant(p)
                              setMessageRecipient(p.user?.id || "")
                              setShowMessageCompose(true)
                            }}
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    ))}
                  </>
                )
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Messages Modal */}
      <Dialog open={showMessages} onOpenChange={setShowMessages}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto card-transparent">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Messages from Participants</span>
              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => setShowMessageCompose(true)}>
                <Send className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {facilitatorMessages.map((msg) => (
              <Card key={msg.id} className={msg.readAt ? "card-transparent" : "border-green-500 bg-green-50"}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{msg.fromName}</span>
                        {!msg.readAt && <Badge className="bg-green-600 text-xs">New</Badge>}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{msg.content}</p>
                      <p className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleString()}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const sender = users.find(u => u.id === msg.senderId);
                        setComposeToRole(msg.senderRole);
                        setComposeToId(msg.senderId);
                        setShowMessageCompose(true);
                      }}
                    >
                      Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Homework Review Modal */}
      <Dialog
        open={showHomework}
        onOpenChange={(open) => {
          setShowHomework(open)
          if (!open) {
            setSelectedHomework(null)
            setFeedbackText("")
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col card-transparent">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>
              {selectedHomework ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedHomework(null)} className="p-1 h-auto">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  {selectedHomework.participant}'s Homework
                </div>
              ) : (
                "Homework Submissions"
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedHomework ? (
            // Individual Homework View
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600 mb-1">{selectedHomework.session}</div>
                  <div className="font-medium text-green-700 mb-2">{selectedHomework.title}</div>
                  <Badge className={selectedHomework.status === "pending" ? "bg-green-600" : "bg-gray-500"}>
                    {selectedHomework.status === "pending" ? "Pending Review" : "Approved"}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Submitted Work:</h4>
                  <div className="bg-white border rounded p-4 text-sm">
                    <p className="mb-3">
                      This week I worked on identifying my thinking errors. I noticed that I often engage in "victim
                      stance" thinking, especially when things don't go my way at work. For example, when my supervisor
                      gave me feedback on my project, my first thought was "they're just picking on me" instead of
                      considering the feedback objectively.
                    </p>
                    <p className="mb-3">
                      I also caught myself using "justifying" when I was late to my appointment. I told myself it wasn't
                      my fault because of traffic, but I could have left earlier.
                    </p>
                    <p>
                      My goal for next week is to pause before reacting and ask myself "What thinking error might I be
                      using right now?"
                    </p>
                  </div>
                </div>

                {selectedHomework.status === "pending" && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Provide Feedback:</h4>

                    <Select onValueChange={(value) => setFeedbackText(value)}>
                      <SelectTrigger className="mb-2">
                        <SelectValue placeholder="Select a common response..." />
                      </SelectTrigger>
                      <SelectContent>
                        {commonFeedbackReplies.map((reply, idx) => (
                          <SelectItem key={idx} value={reply}>
                            {reply.length > 50 ? reply.substring(0, 50) + "..." : reply}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Textarea
                      placeholder="Add personalized feedback..."
                      className="mb-3"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      rows={3}
                    />

                    <div className="flex gap-2">
                      <Button
                        className={
                          processedHomework[selectedHomework.id] === "approved"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-green-600 hover:bg-green-700"
                        }
                        onClick={() => handleApproveHomework(selectedHomework)}
                        disabled={!!processedHomework[selectedHomework.id]}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        {processedHomework[selectedHomework.id] === "approved" ? "Approved!" : "Approve"}
                      </Button>
                      <Button
                        variant="outline"
                        className={
                          processedHomework[selectedHomework.id] === "revision"
                            ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                            : ""
                        }
                        onClick={() => handleRequestRevision(selectedHomework)}
                        disabled={!!processedHomework[selectedHomework.id]}
                      >
                        <X className="h-4 w-4 mr-1" />
                        {processedHomework[selectedHomework.id] === "revision" ? "Revision Sent!" : "Request Revision"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Homework List View
            <div className="flex-1 overflow-y-auto space-y-3">
              {homeworkList
                .filter((h) => h.status === "pending")
                .map((hw) => (
                  <Card
                    key={hw.id}
                    className="cursor-pointer hover:bg-gray-50 border-green-500 card-transparent"
                    onClick={() => setSelectedHomework(hw)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">{hw.participant}</div>
                          <div className="text-sm text-gray-600">{hw.session}</div>
                          <div className="text-sm font-medium text-green-700">{hw.title}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-600">Review</Badge>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Daily Journals Modal */}
      <Dialog open={showJournals} onOpenChange={setShowJournals}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto card-transparent">
          <DialogHeader>
            <DialogTitle>Daily Journal Entries</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {journalSubmissions.map((journal) => (
              <Card key={journal.id} className={journal.late ? "border-red-300 card-transparent" : "card-transparent"}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium">{journal.participant}</span>
                      <span className="text-sm text-gray-500 ml-2">{journal.date.toLocaleDateString()}</span>
                    </div>
                    {journal.late && <Badge variant="destructive">Late</Badge>}
                  </div>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{journal.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Modal */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto card-transparent">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {facilitatorMessages
              .filter((m) => !m.readAt)
              .map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-start gap-3 p-3 bg-green-50 rounded border-l-2 border-green-500"
                >
                  <MessageSquare className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">New message from {msg.fromName}</div>
                    <div className="text-xs text-gray-600 truncate">{msg.content}</div>
                  </div>
                </div>
              ))}
            {homeworkList
              .filter((h) => h.status === "pending")
              .map((hw) => (
                <div key={hw.id} className="flex items-start gap-3 p-3 bg-blue-50 rounded border-l-2 border-blue-500">
                  <ClipboardCheck className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Homework submitted by {hw.participant}</div>
                    <div className="text-xs text-gray-600">{hw.title}</div>
                  </div>
                </div>
              ))}
            {totalNotifications === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>No new notifications</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-lg card-transparent max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-gray-600">martin@dmsclinicalservices.com</p>
            </div>
            <div>
              <label className="text-sm font-medium">Change Password</label>
              <Button variant="outline" className="w-full mt-2 bg-transparent">
                Update Password
              </Button>
            </div>

          </div>
        </DialogContent>
      </Dialog>


      {/* Class Detail Modal */}
      <Dialog open={showClassDetail} onOpenChange={setShowClassDetail}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto card-transparent">
          <DialogHeader>
            <DialogTitle>
              {selectedClass?.program} - Session {selectedClass?.session}
            </DialogTitle>
          </DialogHeader>
          {selectedClass && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Day:</span>
                  <span className="ml-2 font-medium">{selectedClass.day}</span>
                </div>
                <div>
                  <span className="text-gray-500">Time:</span>
                  <span className="ml-2 font-medium">{selectedClass.time}</span>
                </div>
                <div>
                  <span className="text-gray-500">Location:</span>
                  <span className="ml-2 font-medium">{selectedClass.location}</span>
                </div>
                <div>
                  <span className="text-gray-500">Enrolled:</span>
                  <span className="ml-2 font-medium">{selectedClass.enrolled} participants</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Enrolled Participants</h4>
                <div className="space-y-2">
                  {selectedClass.participants.length > 0 ? (
                    selectedClass.participants.map((enrollment: Enrollment, i: number) => {
                      const participantUser = users.find(u => u.id === enrollment.participantId);
                      return (
                        <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium text-sm">{participantUser?.name || "Unknown Participant"}</div>
                            <div className="text-xs text-gray-500">Session {enrollment.currentSessionNumber} of {programs.find(p => p.id === enrollment.programId)?.totalSessions || 16}</div>
                          </div>
                          <Badge className={enrollment.status === 'active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                            {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                          </Badge>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-sm text-gray-500 italic">No participants enrolled in this class.</p>
                  )}
                </div>
              </div>

              {/* Start Class Button Section */}
              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    const programSlug = programs.find(p => p.id === selectedClass.programId)?.slug;
                    if (programSlug) {
                      router.push(`/facilitator/programs/${programSlug}/sessions/${selectedClass.session}?classId=${selectedClass.id}`);
                    }
                  }}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start In-Person Class
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    const programSlug = programs.find(p => p.id === selectedClass.programId)?.slug;
                    if (programSlug) {
                      router.push(`/facilitator/programs/${programSlug}/sessions/${selectedClass.session}?classId=${selectedClass.id}&isVirtual=true`);
                    }
                  }}
                >
                  <Video className="mr-2 h-4 w-4" />
                  Start Virtual Session
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Compose Message Modal */}
      <Dialog open={showMessageCompose} onOpenChange={setShowMessageCompose}>
        <DialogContent className="max-w-md card-transparent">
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Common Replies</label>
              <Select onValueChange={(value) => setMessageText(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a quick reply..." />
                </SelectTrigger>
                <SelectContent>
                  {commonReplies.map((reply, i) => (
                    <SelectItem key={i} value={reply}>
                      {reply.substring(0, 50)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">To (Select Role):</label>
              <Select value={composeToRole} onValueChange={(val: any) => { setComposeToRole(val); setComposeToId(""); setComposeSearch(""); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="facilitator">Facilitator</SelectItem>
                  <SelectItem value="participant">Participant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {composeToRole && (
              <div>
                <label className="text-sm font-medium mb-2 block">Search {composeToRole}:</label>
                <Input
                  className="mb-2"
                  placeholder="Type name to filter..."
                  value={composeSearch}
                  onChange={(e) => setComposeSearch(e.target.value)}
                />
                <Select value={composeToId} onValueChange={setComposeToId}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${composeToRole}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .filter((u: any) => u.role === composeToRole && u.id !== currentUser?.id)
                      .filter((u: any) => u.name.toLowerCase().includes(composeSearch.toLowerCase()))
                      .map((u: any) => (
                        <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            )}

            {messageError && (
              <p className="text-sm text-red-600 font-medium">{messageError}</p>
            )}
            <Button
              className="bg-green-600 hover:bg-green-700 w-full"
              onClick={async () => {
                if (!messageText.trim() || !composeToId || !currentUser) return

                setIsSending(true)
                setMessageError(null)

                try {
                  await addMessage({
                    senderId: currentUser.id,
                    senderRole: currentUser.role,
                    recipientId: composeToId,
                    recipientRole: composeToRole as UserRole,
                    title: "Message from Facilitator",
                    content: messageText,
                    fromName: currentUser.name,
                    readAt: null,
                    createdAt: new Date().toISOString()
                  })

                  setShowMessageCompose(false)
                  setMessageText("")
                  setComposeToId("")
                  setComposeToRole("")
                  setComposeSearch("")
                } catch (e) {
                  setMessageError("Message could not be sent")
                } finally {
                  setIsSending(false)
                }
              }}
              disabled={!composeToId || !messageText.trim() || isSending}
            >
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pending Revisions Modal */}
      <Dialog open={showPendingRevisions} onOpenChange={setShowPendingRevisions}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col card-transparent">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              Homework Awaiting Revision
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-3">
            {pendingRevisions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No homework awaiting revision</p>
            ) : (
              pendingRevisions.map((hw: any) => (
                <Card key={hw.id} className="card-transparent">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{hw.participant}</div>
                        <div className="text-sm text-gray-600">{hw.session}</div>
                        <div className="text-sm font-medium text-green-700">{hw.title}</div>
                        <div className="text-xs text-gray-400 mt-1">Sent back: {new Date().toLocaleDateString()}</div>
                      </div>
                      <Badge className="bg-amber-500">Awaiting Revision</Badge>
                    </div>
                    {hw.feedback && (
                      <div className="mt-2 p-2 bg-amber-50 rounded text-sm">
                        <span className="font-medium text-amber-700">Your feedback: </span>
                        {hw.feedback}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showMakeupAssignments} onOpenChange={setShowMakeupAssignments}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto card-transparent">
          <DialogHeader>
            <DialogTitle>Assign Makeup Work - {selectedMakeupParticipant?.participantName}</DialogTitle>
          </DialogHeader>
          {selectedMakeupParticipant && (
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h4 className="font-semibold text-amber-800">Missed Class Information</h4>
                <p className="text-sm mt-1">
                  <strong>Program:</strong> {selectedMakeupParticipant.missedProgramName}
                </p>
                <p className="text-sm">
                  <strong>Session:</strong> {selectedMakeupParticipant.missedSessionNumber}
                </p>
                <p className="text-sm">
                  <strong>Missed Date:</strong> {new Date(selectedMakeupParticipant.missedDate).toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Select Worksheets</Label>
                <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto border rounded p-2">
                  {availableWorksheets.map((worksheet) => (
                    <label
                      key={worksheet}
                      className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={makeupWorksheets.includes(worksheet)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setMakeupWorksheets([...makeupWorksheets, worksheet])
                          } else {
                            setMakeupWorksheets(makeupWorksheets.filter((w) => w !== worksheet))
                          }
                        }}
                        className="rounded"
                      />
                      {worksheet}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Select Readings</Label>
                <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto border rounded p-2">
                  {availableReadings.map((reading) => (
                    <label
                      key={reading}
                      className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={makeupReadings.includes(reading)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setMakeupReadings([...makeupReadings, reading])
                          } else {
                            setMakeupReadings(makeupReadings.filter((r) => r !== reading))
                          }
                        }}
                        className="rounded"
                      />
                      {reading}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Instructions for Participant</Label>
                <Textarea
                  placeholder="Enter specific instructions for what the participant should focus on during the makeup group..."
                  value={makeupInstructions}
                  onChange={(e) => setMakeupInstructions(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setSelectedMakeupParticipant(null)
                    setShowMakeupAssignments(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleAssignMakeupWork}
                  disabled={(makeupWorksheets.length === 0 && makeupReadings.length === 0) || !makeupInstructions}
                >
                  Assign Work
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 py-4 mt-8 footer-transparent">
        <div className="container mx-auto px-6 text-center text-sm text-gray-600">
          © 2025 DMS Clinical Services. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
