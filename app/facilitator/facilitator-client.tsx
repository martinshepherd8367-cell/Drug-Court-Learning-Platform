"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect } from "react"
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
} from "lucide-react"

export default function FacilitatorDashboard({ scheduleEvents }: { scheduleEvents: any[] }) {
  const router = useRouter()
  const {
    programs,
    enrollments,
    users,
    messages,
    journalEntries,
    participantResponses,
    makeupAssignments,
    assignMakeupWork,
  } = useStore()

  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [showClassDetail, setShowClassDetail] = useState(false)

  // Logic helpers
  const [activeTab, setActiveTab] = useState("overview")
  const [showMakeupAssignments, setShowMakeupAssignments] = useState(false)
  const [selectedMakeupParticipant, setSelectedMakeupParticipant] = useState<string | null>(null)
  const [makeupInstructions, setMakeupInstructions] = useState("")
  const [makeupWorksheets, setMakeupWorksheets] = useState<string[]>([])
  const [makeupReadings, setMakeupReadings] = useState<string[]>([])
  const [showMessages, setShowMessages] = useState(false)
  const [showViewParticipants, setShowViewParticipants] = useState(false)
  const [selectedClassForParticipants, setSelectedClassForParticipants] = useState<string | null>(null)
  const [messageRecipient, setMessageRecipient] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")

  const [homeworkList, setHomeworkList] = useState<typeof homeworkSubmissions>([])
  const [pendingRevisions, setPendingRevisions] = useState<typeof homeworkSubmissions>([])
  const [showPendingRevisions, setShowPendingRevisions] = useState(false)
  const [processedHomework, setProcessedHomework] = useState<Record<string, "approved" | "revision">>({})

  // New state for button state
  const [makeupAssignButtonState, setMakeupAssignButtonState] = useState<Record<string, boolean>>({})

  // Use passed schedule events

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

  // Mock messages for facilitator
  const facilitatorMessages = [
    {
      id: "1",
      from: "John Smith",
      participantId: "p1",
      content: "I have a question about the homework from Session 2",
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: "2",
      from: "Sarah Johnson",
      participantId: "p2",
      content: "Will there be a makeup session this week?",
      timestamp: new Date(Date.now() - 7200000),
      read: false,
    },
    {
      id: "3",
      from: "Mike Davis",
      participantId: "p3",
      content: "Thank you for the extra help yesterday",
      timestamp: new Date(Date.now() - 86400000),
      read: true,
    },
  ]

  // Mock homework submissions
  const homeworkSubmissions = [
    {
      id: "1",
      participant: "John Smith",
      session: "Prime Solutions - Session 2",
      title: "My First Action Plan",
      submitted: new Date(Date.now() - 3600000),
      status: "pending",
    },
    {
      id: "2",
      participant: "Sarah Johnson",
      session: "Prime Solutions - Session 3",
      title: "Stages of Change Reflection",
      submitted: new Date(Date.now() - 7200000),
      status: "pending",
    },
    {
      id: "3",
      participant: "Mike Davis",
      session: "Prime Solutions - Session 1",
      title: "Treatment Goals",
      submitted: new Date(Date.now() - 86400000),
      status: "pending",
    },
    {
      id: "4",
      participant: "Lisa Brown",
      session: "Prime Solutions - Session 4",
      title: "Trigger Identification",
      submitted: new Date(Date.now() - 172800000),
      status: "pending",
    },
  ]

  useEffect(() => {
    setHomeworkList(homeworkSubmissions)
  }, [])

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

  // Mock journal entries for review
  const journalSubmissions = [
    {
      id: "1",
      participant: "John Smith",
      date: new Date(),
      content: "Today I focused on identifying my triggers...",
      late: false,
    },
    {
      id: "2",
      participant: "Sarah Johnson",
      date: new Date(Date.now() - 86400000),
      content: "I practiced the breathing exercises we learned...",
      late: false,
    },
    {
      id: "3",
      participant: "Mike Davis",
      date: new Date(Date.now() - 172800000),
      content: "Missed yesterday but catching up today...",
      late: true,
    },
  ]

  // Get participants enrolled in a program
  const getParticipantsInProgram = (programId: string) => {
    const programEnrollments = enrollments.filter((e) => e.programId === programId && e.status === "active")
    return programEnrollments.map((e) => {
      const user = users.find((u) => u.id === e.userId)
      return { ...e, user }
    })
  }

  const unreadMessages = facilitatorMessages.filter((m) => !m.read).length
  // const pendingHomework = homeworkSubmissions.filter((h) => h.status === "pending").length // Replaced by homeworkList state
  const pendingHomework = homeworkList.filter((h) => h.status === "pending").length
  const pendingJournals = journalSubmissions.filter((j) => !j.late).length
  const totalNotifications = notificationsViewed ? 0 : unreadMessages + pendingHomework

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
       <div className="p-8 text-center text-gray-500">
           Dashboard content goes here (Restoration in progress)
       </div>
    </div>
  )
}
