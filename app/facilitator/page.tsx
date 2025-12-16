"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  Calendar,
  Clock,
  Settings,
  FileText,
  BarChart3,
  LogOut,
  Bell,
  X,
  Send,
  CheckCircle,
  Plus,
  Bot,
  MapPin,
  Play,
  BookOpen,
  Upload,
  Video,
  MessageSquare,
  FileCheck,
  AlertCircle,
  User,
  Mail,
  ChevronRight,
  QrCode,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function FacilitatorDashboard() {
  const router = useRouter()
  const [showParticipantsModal, setShowParticipantsModal] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [showAddProgramModal, setShowAddProgramModal] = useState(false)
  const [showSessionsModal, setShowSessionsModal] = useState(false)
  const [showVideoUploadModal, setShowVideoUploadModal] = useState(false)
  const [showMessagesModal, setShowMessagesModal] = useState(false)
  const [showMessagesHistoryModal, setShowMessagesHistoryModal] = useState(false)
  const [showMessagesHistoryClassSelect, setShowMessagesHistoryClassSelect] = useState(false)
  const [showMessagesHistoryParticipantList, setShowMessagesHistoryParticipantList] = useState(false)
  const [showHomeworkModal, setShowHomeworkModal] = useState(false)
  const [showHomeworkHistoryModal, setShowHomeworkHistoryModal] = useState(false)
  const [showHomeworkHistoryClassSelect, setShowHomeworkHistoryClassSelect] = useState(false)
  const [showHomeworkHistoryParticipantList, setShowHomeworkHistoryParticipantList] = useState(false)
  const [showHomeworkReviewModal, setShowHomeworkReviewModal] = useState(false)
  const [showSendMessageModal, setShowSendMessageModal] = useState(false)
  const [selectedHomework, setSelectedHomework] = useState<number | null>(null)
  const [selectedParticipantForMessage, setSelectedParticipantForMessage] = useState<number | null>(null)
  const [selectedClass, setSelectedClass] = useState<number | null>(null)
  const [selectedClassForHistory, setSelectedClassForHistory] = useState<number | null>(null)
  const [selectedParticipantForHistory, setSelectedParticipantForHistory] = useState<number | null>(null)
  const [selectedSession, setSelectedSession] = useState<number | null>(null)
  const [message, setMessage] = useState("")
  const [aiMessage, setAiMessage] = useState("")
  const [homeworkFeedback, setHomeworkFeedback] = useState("")
  const [participantMessage, setParticipantMessage] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [aiChatHistory, setAiChatHistory] = useState([
    { role: "assistant", message: "Hello! I'm your AI assistant. How can I help you with your classes today?" },
  ])

  const [reviewedHomework, setReviewedHomework] = useState<number[]>([])
  const [readMessages, setReadMessages] = useState<number[]>([]) // Added
  const [showClassRecordsModal, setShowClassRecordsModal] = useState(false)
  const [showParticipantRecordsModal, setShowParticipantRecordsModal] = useState(false)
  const [selectedParticipantForRecords, setSelectedParticipantForRecords] = useState<number | null>(null)

  // Added for Notifications Modal
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<any>(null) // To store selected message for notification

  const [showSessionContentModal, setShowSessionContentModal] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [showStartClass, setShowStartClass] = useState(false) // Added for Start Class Modal

  const [homeworkAssigned, setHomeworkAssigned] = useState(false)
  const [selectedSessionSection, setSelectedSessionSection] = useState<number | null>(null)

  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [selectedClassForQR, setSelectedClassForQR] = useState<number | null>(null)
  const [qrCodeData, setQrCodeData] = useState("")

  // Added for Daily Journals
  const [showJournalsModal, setShowJournalsModal] = useState(false)
  const [participantJournals, setParticipantJournals] = useState([
    {
      id: 1,
      participantName: "John D.",
      date: "2024-01-17",
      day: "Wednesday",
      status: "late",
      submittedAt: "Just now",
    },
    {
      id: 2,
      participantName: "Sarah M.",
      date: "2024-01-18",
      day: "Thursday",
      status: "on-time",
      submittedAt: "2 hours ago",
    },
  ])

  const sessionSections = [
    {
      title: "Opening Framing – Every Voyage Begins Somewhere",
      duration: "10 minutes",
      content: `Purpose: Introduce treatment as a journey that begins with self-awareness.

Facilitator Script: "Recovery is a process of learning who you are and where you're headed. The first step is understanding your current stage of change."

Discussion Prompts:
• "What brought you to treatment?"
• "What does 'change' mean to you right now?"
• "What do you hope to be different by the end of this program?"`,
    },
    {
      title: "Reading & Reflection – The Port You Leave Behind",
      duration: "10 minutes",
      content: `Read participant section: My First Action Plan

A PRIME THOUGHT ABOUT STARTING TREATMENT

Think of your treatment experience as a voyage. Every voyage begins from a port.

In one sentence, describe the place that you are sailing from.

Discussion:
• "What habits or thoughts are holding you back?"
• "What does leaving those behind look like?"`,
    },
    {
      title: "Quick Review of the Phases",
      duration: "15 minutes",
      content: `Phase 1: Low-Risk Choices
People in this phase do not use illegal drugs, use prescription drugs as prescribed, and follow the 0-1-2-3 low-risk guidelines for alcohol. For some people this is the 0. For others it is 1-2-3.

Phase 2: High-Risk Choices
People in this phase may be using drugs from time to time or may be drinking more than the 1-2-3 guidelines. Alcohol and drugs are pleasant from time to time, but not central to their lives. Their choices put them at risk for problems. Social Dependence may begin.

Phase 3: High-Risk Choices plus Psychological Dependence
High-risk alcohol or drug choices are a major part of having fun. High-risk choices are integrated into many parts of life. A person in Phase 3 may find in treatment that they have a diagnosis of either Abuse or (early) Dependence. It may take significant effort to make changes. People in Phase 3 may be able to drink in the low-risk range. Some do so, but others decide it is just not worth the effort it takes.

Phase 4: Addiction
In this phase people experience loss of control over their use once they begin. Some also experience withdrawal when they stop using. This is advanced Dependence. In Phase 4, the only low-risk choice is to stop all use of drugs or alcohol.`,
    },
    {
      title: "Activity – Mapping Motivation",
      duration: "20 minutes",
      content: `Participants complete a short self-assessment identifying their stage of change (Precontemplation → Maintenance).

Group shares examples of what progress might look like at each stage.

WHICH TREATMENT PATH ARE YOU ON?

"Which way should I go?" said Alice.
"That depends on where you want to end up," said the cat.
- Alice in Wonderland by Lewis Carol

In the story of Alice in Wonderland, Alice came to a fork in the path and did not know which way to go. When she asked the Cheshire Cat for advice, the answer was simple but true. The Cat replied, "That depends on where you want to end up." It is not always clear where a path will take us. Yet every path goes somewhere, and when we choose a path, we are also choosing a destination.

Treatment presents us with a fork in the path. It is a good time to think about what we want in life. During treatment, we will have an opportunity to think about things like relationships, jobs, legal issues, money, self-respect, and many more. For now, let's think in broad terms.

What do you plan to do about using alcohol and drugs during treatment? What are your hopes for after treatment? Do you intend to not use at all? Do you intend to keep using? Some of us know the answers to those questions right now. Others do not. Let's think of two different Treatment Paths to guide us.`,
    },
    {
      title: "Application Exercise – Building an Action Plan",
      duration: "15 minutes",
      content: `Use the My First Action Plan worksheet. Have participants name one immediate goal and one longer-term aspiration.

My First Action Plan

The Treatment Plan you developed with your counselor is a "big picture" plan of what you want to accomplish in treatment. It will guide your counselor in helping you reach your treatment goals.

An Action Plan is much simpler. It covers one goal and the things you are willing to do to help reach that goal. Action Plans allow you to take your Treatment Plan and break it into "bite-sized pieces."

Your first Action Plan is very basic. You have completed your treatment planning session, but nothing can happen if you do not come back. What do you need to take care of to make sure you come to your next treatment session? You might need to take care of something as basic as transportation, or something more complex like staying motivated. If you have trouble with this, ask your counselor to share some Action Plans, or discuss your current situation with you.

Is your most immediate treatment goal coming to the next treatment session? If so, write that in here. If not, write in your current goal.

Some steps I will take to reach this goal are:`,
    },
    {
      title: "Cognitive Restructuring – Shifting from Fear to Curiosity",
      duration: "10 minutes",
      content: `Discuss how fear can block progress and curiosity can open new possibilities.

Prompt: "What would you try if you weren't afraid to fail?"`,
    },
    {
      title: "Planning – Daily Practice of Change",
      duration: "15 minutes",
      content: `Encourage participants to name one daily habit that supports their goal (e.g., journaling, attending meetings, walking).

Discussion:
• What small action can you take every day?
• How will you track your progress?
• Who can support you in this practice?`,
    },
    {
      title: "Closing Reflection – Where You're Headed",
      duration: "10 minutes",
      content: `Facilitator Script: "It doesn't matter where you start—what matters is that you've started."

Homework: Write a short statement beginning with "My change begins with…"

This homework will appear on the participant's dashboard and must be completed before the next session.`,
    },
  ]

  // Mock data for homework history
  const homeworkHistory = {
    1: [
      { id: 1, homework: "My First Action Plan", status: "Approved", date: "2024-03-15", feedback: "Great work!" },
      {
        id: 2,
        homework: "Hey, I've Done This Before!",
        status: "Revision Requested",
        date: "2024-03-18",
        feedback: "Please provide more detail in section 2.",
      },
      { id: 3, homework: "Rewinding My Game Tape", status: "Approved", date: "2024-03-20", feedback: "" },
    ],
    2: [{ id: 1, homework: "My First Action Plan", status: "Approved", date: "2024-03-16", feedback: "Excellent!" }],
  }

  const facilitatorMessageHistory = {
    1: [
      { date: "2024-03-19", message: "Please review the feedback on your homework and resubmit." },
      { date: "2024-03-21", message: "Great progress! Keep up the good work." },
    ],
    2: [{ date: "2024-03-17", message: "Welcome to the program!" }],
  }

  // Mock data for classes and participants, needed for participant records
  const classes = [
    {
      id: 1,
      title: "Prime Solutions",
      participants: [
        { id: 1, name: "John D.", status: "active", lastActive: "2 hours ago", progress: 1 },
        { id: 2, name: "Sarah M.", status: "active", lastActive: "5 hours ago", progress: 2 },
        { id: 3, name: "Michael R.", status: "pending", lastActive: "1 day ago", progress: 3 },
      ],
    },
  ]

  const participantMessages = [
    {
      id: 1,
      participantName: "John D.",
      message: "I have a question about today's session",
      time: "10 min ago",
      unread: true,
    },
    {
      id: 2,
      participantName: "Sarah M.",
      message: "Can I reschedule my homework submission?",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      participantName: "Michael R.",
      message: "Thank you for the feedback!",
      time: "3 hours ago",
      unread: false,
    },
  ]

  const homeworkSubmissions = [
    {
      id: 1,
      participantName: "John D.",
      sessionTitle: "Prime Solutions - Session 1",
      homework: "My First Action Plan",
      submittedAt: "2 hours ago",
      status: "review", // Changed status from "pending" to "review"
      content:
        "I plan to attend all sessions regularly and work on my sobriety goals. My main action steps are: 1) Attend weekly meetings, 2) Check in with my sponsor daily, 3) Practice mindfulness for 10 minutes each day.",
    },
    {
      id: 2,
      participantName: "Sarah M.",
      sessionTitle: "Prime Solutions - Session 2",
      homework: "Hey, I've Done This Before!",
      submittedAt: "5 hours ago",
      status: "review", // Changed status from "pending" to "review"
      content:
        "In the past, I successfully stayed sober for 6 months by attending meetings and staying connected with my support group. I learned that having accountability partners really helps me stay on track.",
    },
  ]

  const messageTemplates = [
    "Great work on your homework! Keep up the excellent progress.",
    "Please make sure to complete your homework before the next session.",
    "I noticed you missed the last session. Is everything okay?",
    "Your participation in class has been outstanding. Thank you!",
    "Please remember to arrive on time for our next session.",
    "If you need any help, don't hesitate to reach out.",
  ]

  const unreadMessagesCount = participantMessages.filter((m) => m.unread && !readMessages.includes(m.id)).length
  const pendingHomeworkCount = homeworkSubmissions.filter(
    (h) => h.status === "review" && !reviewedHomework.includes(h.id),
  ).length

  const activeSessions = [
    {
      id: 1,
      title: "Prime Solutions",
      session: 1,
      date: "Today, 2:00 PM",
      participants: 12,
      status: "upcoming",
      totalSessions: 16,
    },
  ]

  const classParticipants = {
    1: [
      { id: 1, name: "John D.", status: "active", lastActive: "2 hours ago" },
      { id: 2, name: "Sarah M.", status: "active", lastActive: "5 hours ago" },
      { id: 3, name: "Michael R.", status: "pending", lastActive: "1 day ago" },
    ],
  }

  const programLibrary = [
    { id: 101, title: "Prime Solutions", duration: "16 weeks", sessions: 16 },
    { id: 102, title: "Cognitive Behavioral Therapy Basics", duration: "6 weeks", sessions: 12 },
    { id: 103, title: "Relapse Prevention Strategies", duration: "4 weeks", sessions: 8 },
    { id: 104, title: "Life Skills Development", duration: "8 weeks", sessions: 16 },
    { id: 105, title: "Anger Management", duration: "5 weeks", sessions: 10 },
  ]

  const recentParticipants = [
    { name: "John D.", lastActive: "2 hours ago", progress: 75 },
    { name: "Sarah M.", lastActive: "5 hours ago", progress: 60 },
    { name: "Michael R.", lastActive: "1 day ago", progress: 85 },
    { name: "Emily K.", lastActive: "1 day ago", progress: 45 },
  ]

  const allSessions = [
    {
      number: 1,
      title: "Introduction: Understanding Change & Treatment Goals",
      description:
        "Introduce Prime Solutions model (phases 1–4: Low Risk → Addiction). Identify personal goals for treatment. Discuss readiness for change.",
      activity: "My First Action Plan (p. 17)",
      hasVideo: false,
    },
    {
      number: 2,
      title: "How People Make Changes: The Stages of Change",
      description:
        "Review 'No Way, Not Now → The New Me' stages (pp. 18–20). Identify personal stage of change. Discuss ambivalence and resistance.",
      activity: "Hey, I've Done This Before! (p. 21)",
      hasVideo: false,
    },
    {
      number: 3,
      title: "Learning from the Past",
      description:
        "Analyze past relapse or failure experiences. Identify barriers and supports. Reframe setbacks as learning opportunities.",
      activity: "Rewinding My Game Tape (p. 24)",
      hasVideo: false,
    },
    {
      number: 4,
      title: "Staging My Treatment Plan",
      description:
        "Connect goals to the stage model. Explore multiple domains: substance use, legal, social. Use readiness rating scales (1–10).",
      activity: "Two Points in Time (p. 34)",
      hasVideo: false,
    },
    {
      number: 5,
      title: "Values and Identity: This Is Who I Am",
      description:
        "Identify personal values and self-definitions (p. 41–45). Explore dissonance between beliefs and behavior. Create 'I am…' statements.",
      activity: "This Is Who I Am Action Plan",
      hasVideo: false,
    },
    {
      number: 6,
      title: "Happiness and Gratitude",
      description: "Explore positive reinforcement through gratitude. Discuss happiness as an outcome of right action.",
      activity: "Five Things I'm Grateful For (p. 46)",
      hasVideo: false,
    },
    {
      number: 7,
      title: "Managing Ambivalence: Getting Off the Seesaw",
      description: "Define ambivalence and internal conflict. Teach cognitive balancing.",
      activity: "Getting Off the Seesaw Worksheet (p. 50)",
      hasVideo: false,
    },
    {
      number: 8,
      title: "Cravings and Triggers: Listening for the Wolf",
      description: "Identify emotional and situational relapse cues. Develop mindfulness-based awareness of cravings.",
      activity: "Craving Log (p. 68)",
      hasVideo: false,
    },
    {
      number: 9,
      title: "High-Risk Thinking: Top Ten List",
      description: "Identify relapse-justifying thoughts. Explore balancing thoughts and self-talk patterns.",
      activity: "Top Ten Things I Say to Myself When I Want to Use",
      hasVideo: false,
    },
    {
      number: 10,
      title: "Tools for Change: Living with Temptation",
      description:
        "Apply the 'See–Feel–Think–Do' model. Practice coping and problem-solving. Role-play relapse prevention scenarios.",
      activity: "Role-play exercises",
      hasVideo: false,
    },
    {
      number: 11,
      title: "Support Systems: 3-2-1-0 Tool",
      description: "Identify supportive people and groups. Strengthen accountability and connection.",
      activity: "Create a 3-2-1-0 Support Plan",
      hasVideo: false,
    },
    {
      number: 12,
      title: "Courage and Responsibility: Never Again",
      description: "Discuss personal courage and humility. Examine relapse prevention through surrender.",
      activity: "Never Again Worksheet (p. 89)",
      hasVideo: false,
    },
    {
      number: 13,
      title: "Session 13 Content",
      description: "Continuing the Prime Solutions program with advanced concepts and practical application.",
      activity: "TBD",
      hasVideo: false,
    },
    {
      number: 14,
      title: "Staying Consistent: Short-Term to Long-Term Goals",
      description:
        "Identify relapse risks over time. Plan for ongoing self-monitoring. Create long-term personal goals.",
      activity: "Goal-setting exercises",
      hasVideo: false,
    },
    {
      number: 15,
      title: "Relapse Prevention: See–Feel–Think–Do Integration",
      description:
        "Synthesize emotional, cognitive, and behavioral tools. Conduct group role-plays for crisis prevention. Develop a final recovery plan.",
      activity: "Crisis prevention role-plays",
      hasVideo: false,
    },
    {
      number: 16,
      title: "Celebration and Reflection",
      description:
        "Review progress and growth. Revisit early action plans. Share affirmations and personal reflections. Award certificates and close the course.",
      activity: "Graduation ceremony",
      hasVideo: false,
    },
  ]

  const activeClasses = [
    {
      id: 1,
      title: "Prime Solutions",
      session: 1,
      totalSessions: 16,
      time: "2:00 PM",
      location: "Treatment Building",
      roomCoordinates: { lat: 39.7392, lng: -104.9903 }, // Example coordinates
    },
  ]

  const handleSendMessage = () => {
    if (message.trim() && selectedClass) {
      console.log(`Sending message to class ${selectedClass}:`, message)
      setMessage("")
      // In real implementation, this would send the message to all participants
    }
  }

  const handleRemoveParticipant = (participantId: number) => {
    console.log(`Removing participant ${participantId}`)
    // In real implementation, this would remove the participant from the class
  }

  const handleAcceptParticipant = (participantId: number) => {
    console.log(`Accepting participant ${participantId}`)
    // In real implementation, this would accept/acknowledge the participant
  }

  const handleSendAIMessage = () => {
    if (aiMessage.trim()) {
      setAiChatHistory([...aiChatHistory, { role: "user", message: aiMessage }])
      setAiMessage("")
      // Simulate AI response
      setTimeout(() => {
        setAiChatHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            message:
              "I understand your question. As an AI assistant for drug court programs, I can help you with session planning, participant management, and program recommendations. What specific aspect would you like help with?",
          },
        ])
      }, 1000)
    }
  }

  const handleAddProgram = (programId: number) => {
    console.log(`Adding program ${programId} to active classes`)
    // In real implementation, this would add the program to the facilitator's active classes
  }

  const handleOpenSession = (sessionNumber: number) => {
    setSelectedSession(sessionNumber)
    setShowVideoUploadModal(true)
  }

  const handleVideoUpload = () => {
    console.log(`Uploading video for session ${selectedSession}`)
    setShowVideoUploadModal(false)
  }

  const handleApproveHomework = () => {
    if (selectedHomework) {
      setReviewedHomework([...reviewedHomework, selectedHomework])
    }
    setShowHomeworkReviewModal(false)
    setHomeworkFeedback("")
  }

  const handleRequestRevision = () => {
    if (!homeworkFeedback.trim()) {
      alert("Please provide feedback for revision")
      return
    }
    if (selectedHomework) {
      setReviewedHomework([...reviewedHomework, selectedHomework])
    }
    setShowHomeworkReviewModal(false)
    setHomeworkFeedback("")
  }

  const handleSendParticipantMessage = () => {
    if (participantMessage.trim() && selectedParticipantForMessage) {
      console.log(`Sending message to participant ${selectedParticipantForMessage}:`, participantMessage)
      // Mark message as read/responded
      setReadMessages([...readMessages, selectedParticipantForMessage])
      setParticipantMessage("")
      setSelectedTemplate("")
      setShowSendMessageModal(false)
    }
  }

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template)
    setParticipantMessage(template)
  }

  const handleSignOut = () => {
    router.push("/")
  }

  // Added QR code generation function
  const generateQRCode = (classId: number) => {
    const classData = activeClasses.find((c) => c.id === classId)
    if (classData) {
      const qrData = JSON.stringify({
        classId: classData.id,
        className: classData.title,
        session: classData.session,
        timestamp: Date.now(),
        location: classData.roomCoordinates,
      })
      setQrCodeData(qrData)
      setSelectedClassForQR(classId)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Facilitator Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, Martin</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setShowParticipantsModal(true)} className="bg-primary hover:bg-primary/90">
                <Users className="h-4 w-4 mr-2" />
                View Participants
              </Button>
              <Button onClick={() => setShowAIModal(true)} className="bg-primary hover:bg-primary/90">
                <Bot className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
              <Button onClick={() => setShowAddProgramModal(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Program
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowSettingsModal(true)}>
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => {
                  setShowNotifications(true)
                  // Mark all as viewed when opening
                  setReadMessages([
                    ...readMessages,
                    ...participantMessages.filter((m) => m.unread && !readMessages.includes(m.id)).map((m) => m.id),
                  ])
                  setReviewedHomework([
                    ...reviewedHomework,
                    ...homeworkSubmissions
                      .filter((h) => h.status === "review" && !reviewedHomework.includes(h.id))
                      .map((h) => h.id),
                  ])
                }}
              >
                <Bell className="h-5 w-5" />
                {unreadMessagesCount + pendingHomeworkCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadMessagesCount + pendingHomeworkCount}
                  </span>
                )}
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Next Class Card */}
        <Card className="mb-6 border-2 border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">Next Class</CardTitle>
                <h3 className="text-xl font-semibold mb-1">Prime Solutions - Session 1 of 16</h3>
                <CardDescription className="text-base">
                  Introduction: Understanding Change & Treatment Goals
                </CardDescription>
              </div>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => setShowStartClass(true)} // Changed to open Start Class Modal
              >
                <Play className="h-5 w-5 mr-2" />
                Start Class
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              An evidence-based program designed to help participants develop problem-solving skills, personal
              accountability, and healthy decision-making strategies.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span>Today, 2:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span>Treatment Building</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                <span>12 enrolled</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Messages from Participants */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Messages from Participants
                </CardTitle>
                <CardDescription>Recent messages</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowMessagesHistoryClassSelect(true)}>
                View History
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {participantMessages
                  .filter((msg) => !readMessages.includes(msg.id))
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className="p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        setSelectedParticipantForMessage(msg.id)
                        setShowSendMessageModal(true)
                      }}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-medium text-foreground text-sm">{msg.participantName}</p>
                        {!readMessages.includes(msg.id) && (
                          <Badge variant="default" className="text-xs bg-primary">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
                    </div>
                  ))}
                {participantMessages.filter((msg) => !readMessages.includes(msg.id)).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No new messages</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Homework Submissions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-primary" />
                  Homework Submissions
                </CardTitle>
                <CardDescription>Ready for review</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowHomeworkHistoryClassSelect(true)}>
                View History
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {homeworkSubmissions
                  .filter((hw) => !reviewedHomework.includes(hw.id))
                  .map((hw) => (
                    <div
                      key={hw.id}
                      className="p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        setSelectedHomework(hw.id)
                        setShowHomeworkReviewModal(true)
                      }}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-medium text-foreground text-sm">{hw.participantName}</p>
                        {!reviewedHomework.includes(hw.id) && (
                          <Badge className="text-xs bg-green-600 hover:bg-green-700">Review</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{hw.homework}</p>
                      <p className="text-xs text-muted-foreground mt-1">{hw.submittedAt}</p>
                    </div>
                  ))}
                {homeworkSubmissions.filter((hw) => !reviewedHomework.includes(hw.id)).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No pending homework</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Daily Journals
                </CardTitle>
                <CardDescription>Recent journal submissions</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowJournalsModal(true)}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {participantJournals.map((journal) => (
                  <div key={journal.id} className="p-3 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-foreground text-sm">{journal.participantName}</p>
                      <Badge variant={journal.status === "late" ? "destructive" : "secondary"} className="text-xs">
                        {journal.status === "late" ? "Late" : "On Time"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {journal.day} - {journal.date}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{journal.submittedAt}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-green-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground">Active Sessions</CardTitle>
              <Calendar className="h-3.5 w-3.5 text-green-600" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-bold">1</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground">Total Participants</CardTitle>
              <Users className="h-3.5 w-3.5 text-green-600" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground">Avg. Attendance</CardTitle>
              <BarChart3 className="h-3.5 w-3.5 text-green-600" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-bold">87%</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground">Hours Facilitated</CardTitle>
              <Clock className="h-3.5 w-3.5 text-green-600" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-bold">24</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Classes */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Classes</CardTitle>
                <CardDescription>Programs you are currently facilitating</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {activeSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{session.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.totalSessions} sessions • {session.participants} participants
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setSelectedClass(session.id)
                    setShowSessionsModal(true)
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  View All Sessions
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your scheduled classes</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Prime Solutions - Session 1</p>
                  <p className="text-sm text-muted-foreground">Today, 2:00 PM</p>
                </div>
                <Badge>12 enrolled</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Prime Solutions - Session 2</p>
                  <p className="text-sm text-muted-foreground">Next Week, 2:00 PM</p>
                </div>
                <Badge>12 enrolled</Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Prime Solutions - Session 3</p>
                  <p className="text-sm text-muted-foreground">In 2 weeks, 2:00 PM</p>
                </div>
                <Badge>12 enrolled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Participants */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Participants</CardTitle>
            <CardDescription>Recently active learners</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentParticipants.map((participant, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium text-foreground">
                      {participant.name.split(" ")[0][0]}
                      {participant.name.split(" ")[1][0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{participant.name}</p>
                    <p className="text-xs text-muted-foreground">{participant.lastActive}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{participant.progress}%</p>
                  <p className="text-xs text-muted-foreground">Progress</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>

      {showMessagesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Messages from Participants</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowMessagesModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {participantMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                      msg.unread ? "bg-primary/5" : ""
                    }`}
                    onClick={() => {
                      setSelectedParticipantForMessage(msg.id)
                      setShowMessagesModal(false)
                      setShowSendMessageModal(true)
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-foreground">{msg.participantName}</p>
                        <p className="text-xs text-muted-foreground">{msg.time}</p>
                      </div>
                      {msg.unread && <Badge variant="default">New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{msg.message}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedParticipantForMessage(msg.id)
                        setShowMessagesModal(false)
                        setShowSendMessageModal(true)
                      }}
                    >
                      Reply
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {showHomeworkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <FileCheck className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Homework Submissions</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowHomeworkModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {homeworkSubmissions.map((hw) => (
                  <div
                    key={hw.id}
                    className="p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setSelectedHomework(hw.id)
                      setShowHomeworkModal(false)
                      setShowHomeworkReviewModal(true)
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-foreground">{hw.participantName}</p>
                        <p className="text-sm text-muted-foreground">{hw.sessionTitle}</p>
                        <p className="text-xs text-muted-foreground mt-1">{hw.submittedAt}</p>
                      </div>
                      {!reviewedHomework.includes(hw.id) ? (
                        <Badge className="bg-green-600 hover:bg-green-700">Review</Badge>
                      ) : (
                        <Badge variant="outline">Reviewed</Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground mt-2">Assignment: {hw.homework}</p>
                    <Button
                      variant={!reviewedHomework.includes(hw.id) ? "default" : "outline"}
                      size="sm"
                      className={`mt-3 ${!reviewedHomework.includes(hw.id) ? "bg-green-600 hover:bg-green-700" : "bg-transparent"}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedHomework(hw.id)
                        setShowHomeworkModal(false)
                        setShowHomeworkReviewModal(true)
                      }}
                    >
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {showHomeworkReviewModal && selectedHomework && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Review Homework</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {homeworkSubmissions.find((h) => h.id === selectedHomework)?.participantName}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowHomeworkReviewModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-6 max-h-[calc(90vh-200px)]">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assignment</p>
                  <p className="text-base text-foreground mt-1">
                    {homeworkSubmissions.find((h) => h.id === selectedHomework)?.homework}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Session</p>
                  <p className="text-base text-foreground mt-1">
                    {homeworkSubmissions.find((h) => h.id === selectedHomework)?.sessionTitle}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submission</p>
                  <div className="mt-2 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {homeworkSubmissions.find((h) => h.id === selectedHomework)?.content}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Feedback (optional for approval, required for revision)
                  </p>
                  <Textarea
                    placeholder="Provide feedback or request specific changes..."
                    value={homeworkFeedback}
                    onChange={(e) => setHomeworkFeedback(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </ScrollArea>
            <div className="p-6 border-t border-border flex gap-3">
              <Button onClick={handleApproveHomework} className="flex-1 bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="outline"
                onClick={handleRequestRevision}
                className="flex-1 bg-transparent"
                disabled={!homeworkFeedback.trim()}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Request Revision
              </Button>
            </div>
          </div>
        </div>
      )}

      {showSendMessageModal && selectedParticipantForMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Send Message</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  To: {participantMessages.find((m) => m.id === selectedParticipantForMessage)?.participantName}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowSendMessageModal(false)
                  setParticipantMessage("")
                  setSelectedTemplate("")
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Original Message:</p>
                  <p className="text-sm text-foreground">
                    {participantMessages.find((m) => m.id === selectedParticipantForMessage)?.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {participantMessages.find((m) => m.id === selectedParticipantForMessage)?.time}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Use a Template (Optional)</label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a frequently used message..." />
                    </SelectTrigger>
                    <SelectContent>
                      {messageTemplates.map((template, index) => (
                        <SelectItem key={index} value={template}>
                          {template}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Your Reply</label>
                  <Textarea
                    placeholder="Type your message here..."
                    value={participantMessage}
                    onChange={(e) => setParticipantMessage(e.target.value)}
                    className="min-h-[150px]"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSendMessageModal(false)
                  setParticipantMessage("")
                  setSelectedTemplate("")
                }}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button onClick={handleSendParticipantMessage} className="flex-1 bg-green-600 hover:bg-green-700">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Participants Modal */}
      {showParticipantsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Participant Roster</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowParticipantsModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {classes[0].participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setSelectedParticipantForRecords(participant.id)
                      setShowParticipantsModal(false)
                      setShowParticipantRecordsModal(true)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{participant.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Session {participant.progress} of 16 • {participant.status}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        View Records
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* AI Assistant Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">AI Assistant</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowAIModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {aiChatHistory.map((chat, index) => (
                  <div key={index} className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        chat.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm">{chat.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-6 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything about your classes..."
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendAIMessage()}
                />
                <Button onClick={handleSendAIMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Program Modal */}
      {showAddProgramModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-semibold text-foreground">Program Library</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowAddProgramModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <p className="text-muted-foreground mb-6">Select a program to add to your active classes:</p>
              <div className="space-y-4">
                {programLibrary.map((program) => (
                  <div
                    key={program.id}
                    className="p-4 border border-border rounded-lg hover:border-primary transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">{program.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {program.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {program.sessions} sessions
                          </span>
                        </div>
                      </div>
                      <Button onClick={() => handleAddProgram(program.id)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add to My Classes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View All Sessions Modal */}
      {showSessionsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold">Prime Solutions - All Sessions</h2>
                <p className="text-sm text-muted-foreground">Manage videos and content for each session</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowSessionsModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {allSessions.map((session) => (
                  <Card key={session.number} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-green-600 text-white">Session {session.number}</Badge>
                            {session.hasVideo && (
                              <Badge variant="outline" className="border-green-600 text-green-600">
                                <Video className="h-3 w-3 mr-1" />
                                Video Added
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg">{session.title}</CardTitle>
                          <CardDescription className="mt-2">{session.description}</CardDescription>
                          <p className="text-sm text-muted-foreground mt-2">
                            <span className="font-medium">Activity:</span> {session.activity}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleOpenSession(session.number)}
                          className="bg-green-600 hover:bg-green-700 text-white ml-4"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {session.hasVideo ? "Manage Video" : "Add Video"}
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Upload Modal */}
      {showVideoUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold">Add Video to Session {selectedSession}</h2>
                <p className="text-sm text-muted-foreground">
                  {allSessions.find((s) => s.number === selectedSession)?.title}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowVideoUploadModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Video URL</label>
                <Input placeholder="Enter video URL (YouTube, Vimeo, or direct link)" className="border-gray-300" />
              </div>
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-2">Or upload a video file</p>
                <Button variant="outline" className="bg-white">
                  Choose File
                </Button>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Video Description (Optional)</label>
                <Textarea
                  placeholder="Add notes or instructions for participants..."
                  className="border-gray-300"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <Button variant="outline" onClick={() => setShowVideoUploadModal(false)} className="bg-white">
                Cancel
              </Button>
              <Button onClick={handleVideoUpload} className="bg-green-600 hover:bg-green-700 text-white">
                <Video className="h-4 w-4 mr-2" />
                Save Video
              </Button>
            </div>
          </div>
        </div>
      )}

      {showClassRecordsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Class Records</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowClassRecordsModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                <div
                  className="p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    setSelectedClass(1)
                    setShowClassRecordsModal(false)
                    setShowParticipantsModal(true)
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">Prime Solutions</p>
                      <p className="text-sm text-muted-foreground">16 Sessions • 12 Active Participants</p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      View Roster
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {showParticipantRecordsModal && selectedParticipantForRecords && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Participant Records</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {classes[0].participants.find((p) => p.id === selectedParticipantForRecords)?.name}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowParticipantRecordsModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {/* Homework History */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-primary" />
                    Homework History
                  </h3>
                  <div className="space-y-3">
                    {(homeworkHistory[selectedParticipantForRecords as keyof typeof homeworkHistory] || []).map(
                      (hw) => (
                        <div key={hw.id} className="p-4 border border-border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-foreground">{hw.homework}</p>
                              <p className="text-xs text-muted-foreground">{hw.date}</p>
                            </div>
                            <Badge
                              className={
                                hw.status === "Approved"
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "bg-yellow-600 hover:bg-yellow-700"
                              }
                            >
                              {hw.status}
                            </Badge>
                          </div>
                          {hw.feedback && (
                            <div className="mt-2 p-3 bg-muted rounded text-sm">
                              <p className="text-xs font-medium text-muted-foreground">Feedback:</p>
                              <p className="text-foreground">{hw.feedback}</p>
                            </div>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Message History */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Messages Sent by Facilitator
                  </h3>
                  <div className="space-y-3">
                    {(
                      facilitatorMessageHistory[
                        selectedParticipantForRecords as keyof typeof facilitatorMessageHistory
                      ] || []
                    ).map((msg, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg">
                        <p className="text-xs text-muted-foreground mb-2">{msg.date}</p>
                        <p className="text-sm text-foreground">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="p-6 border-t border-border">
              <Button
                onClick={() => setShowParticipantRecordsModal(false)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {showMessagesHistoryClassSelect && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Select Class - Message History</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowMessagesHistoryClassSelect(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-3">
                {classes.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setSelectedClassForHistory(classItem.id)
                      setShowMessagesHistoryClassSelect(false)
                      setShowMessagesHistoryParticipantList(true)
                    }}
                  >
                    <h3 className="font-medium text-foreground">{classItem.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{classItem.participants.length} participants</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {showMessagesHistoryParticipantList && selectedClassForHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Select Participant</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowMessagesHistoryParticipantList(false)
                  setSelectedClassForHistory(null)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-3">
                {classes
                  .find((c) => c.id === selectedClassForHistory)
                  ?.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        setSelectedParticipantForHistory(participant.id)
                        setShowMessagesHistoryParticipantList(false)
                        setShowMessagesHistoryModal(true)
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">{participant.name}</h3>
                          <p className="text-sm text-muted-foreground">Session {participant.progress}</p>
                        </div>
                        <Badge
                          variant={participant.status === "active" ? "default" : "secondary"}
                          className={participant.status === "active" ? "bg-green-600" : ""}
                        >
                          {participant.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {showMessagesHistoryModal && selectedParticipantForHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">
                  Message History -{" "}
                  {
                    classes
                      .find((c) => c.id === selectedClassForHistory)
                      ?.participants.find((p) => p.id === selectedParticipantForHistory)?.name
                  }
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowMessagesHistoryModal(false)
                  setSelectedParticipantForHistory(null)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Messages Sent by Facilitator</h3>
                {facilitatorMessageHistory[selectedParticipantForHistory]?.length > 0 ? (
                  facilitatorMessageHistory[selectedParticipantForHistory].map((msg, idx) => (
                    <div key={idx} className="p-4 border border-border rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-2">{msg.date}</p>
                      <p className="text-sm text-foreground">{msg.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No messages sent yet</p>
                )}

                <h3 className="font-semibold text-foreground mt-6">Participant Messages (Responded)</h3>
                {participantMessages
                  .filter((msg) => msg.id === selectedParticipantForHistory && readMessages.includes(msg.id))
                  .map((msg) => (
                    <div key={msg.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-xs text-muted-foreground">{msg.time}</p>
                        </div>
                        <Badge variant="outline">Responded</Badge>
                      </div>
                      <p className="text-sm text-foreground">{msg.message}</p>
                    </div>
                  ))}
                {!participantMessages.some(
                  (msg) => msg.id === selectedParticipantForHistory && readMessages.includes(msg.id),
                ) && <p className="text-sm text-muted-foreground">No responded messages yet</p>}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {showHomeworkHistoryClassSelect && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <FileCheck className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Select Class - Homework History</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowHomeworkHistoryClassSelect(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-3">
                {classes.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setSelectedClassForHistory(classItem.id)
                      setShowHomeworkHistoryClassSelect(false)
                      setShowHomeworkHistoryParticipantList(true)
                    }}
                  >
                    <h3 className="font-medium text-foreground">{classItem.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{classItem.participants.length} participants</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {showHomeworkHistoryParticipantList && selectedClassForHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Select Participant</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowHomeworkHistoryParticipantList(false)
                  setSelectedClassForHistory(null)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-3">
                {classes
                  .find((c) => c.id === selectedClassForHistory)
                  ?.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        setSelectedParticipantForHistory(participant.id)
                        setShowHomeworkHistoryParticipantList(false)
                        setShowHomeworkHistoryModal(true)
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">{participant.name}</h3>
                          <p className="text-sm text-muted-foreground">Session {participant.progress}</p>
                        </div>
                        <Badge
                          variant={participant.status === "active" ? "default" : "secondary"}
                          className={participant.status === "active" ? "bg-green-600" : ""}
                        >
                          {participant.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {showHomeworkHistoryModal && selectedParticipantForHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <FileCheck className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">
                  Homework History -{" "}
                  {
                    classes
                      .find((c) => c.id === selectedClassForHistory)
                      ?.participants.find((p) => p.id === selectedParticipantForHistory)?.name
                  }
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowHomeworkHistoryModal(false)
                  setSelectedParticipantForHistory(null)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {homeworkHistory[selectedParticipantForHistory]?.length > 0 ? (
                  homeworkHistory[selectedParticipantForHistory].map((hw) => (
                    <div key={hw.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-foreground">{hw.homework}</p>
                          <p className="text-xs text-muted-foreground mt-1">{hw.date}</p>
                        </div>
                        <Badge
                          variant={hw.status === "Approved" ? "default" : "secondary"}
                          className={hw.status === "Approved" ? "bg-green-600" : "bg-yellow-600"}
                        >
                          {hw.status}
                        </Badge>
                      </div>
                      {hw.feedback && (
                        <div className="mt-2 p-2 bg-muted/50 rounded">
                          <p className="text-xs font-medium text-muted-foreground">Feedback:</p>
                          <p className="text-sm text-foreground">{hw.feedback}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No homework history yet</p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowNotifications(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              {unreadMessagesCount === 0 && pendingHomeworkCount === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No new notifications</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {participantMessages
                    .filter((m) => m.unread)
                    .map((message) => (
                      <div
                        key={message.id}
                        className="p-4 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100"
                        onClick={() => {
                          setSelectedMessage(message) // This needs to be set to a proper state variable
                          setShowNotifications(false)
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-gray-900">
                              New Message from {message.participantName}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                        <p className="text-sm text-gray-700">{message.message.substring(0, 100)}...</p>
                      </div>
                    ))}

                  {homeworkSubmissions
                    .filter((h) => h.status === "review")
                    .map((homework) => (
                      <div
                        key={homework.id}
                        className="p-4 bg-green-50 border border-green-200 rounded-lg cursor-pointer hover:bg-green-100"
                        onClick={() => {
                          setSelectedHomework(homework.id) // Ensure this state variable is used correctly
                          setShowNotifications(false)
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-gray-900">
                              Homework Submitted: {homework.participantName}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">{homework.submittedAt}</span>
                        </div>
                        <p className="text-sm text-gray-700">{homework.sessionTitle}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6 bg-card">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} DMS Clinical Services. All rights reserved.</p>
        </div>
      </footer>

      {/* Start Class Session Modal */}
      {showStartClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold">Session 1: Understanding Change & Treatment Goals</h2>
                <p className="text-sm text-muted-foreground">Duration: 60-90 minutes</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowStartClass(false)
                  setSelectedSessionSection(null)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {selectedSessionSection === null ? (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Session Overview</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Participants explore what motivates them to change and define their personal goals for treatment.
                    This opening session introduces the stages of change and encourages self-assessment.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Objectives</h4>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                      <li>Recognize change as a process, not an event</li>
                      <li>Identify their readiness for change</li>
                      <li>Define one short-term and one long-term goal for recovery</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-4">Session Sections</h3>
                <div className="space-y-3">
                  {sessionSections.map((section, idx) => (
                    <Card
                      key={idx}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedSessionSection(idx)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <Badge className="bg-green-600 text-white">Section {idx + 1}</Badge>
                              <Badge variant="outline">{section.duration}</Badge>
                            </div>
                            <CardTitle className="text-base">{section.title}</CardTitle>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t flex items-center justify-between">
                  <Button
                    className={homeworkAssigned ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}
                    onClick={() => setHomeworkAssigned(true)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {homeworkAssigned ? "Homework Assigned ✓" : "Assign Homework to All Participants"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowStartClass(false)}>
                    End Session
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-4">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedSessionSection(null)} className="mb-4">
                    <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                    Back to All Sections
                  </Button>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-green-600 text-white">Section {selectedSessionSection + 1}</Badge>
                    <Badge variant="outline">{sessionSections[selectedSessionSection].duration}</Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-6">{sessionSections[selectedSessionSection].title}</h3>
                </div>

                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {sessionSections[selectedSessionSection].content}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t flex gap-3">
                  {selectedSessionSection > 0 && (
                    <Button variant="outline" onClick={() => setSelectedSessionSection(selectedSessionSection - 1)}>
                      <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                      Previous Section
                    </Button>
                  )}
                  {selectedSessionSection < sessionSections.length - 1 && (
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => setSelectedSessionSection(selectedSessionSection + 1)}
                    >
                      Next Section
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                  {selectedSessionSection === sessionSections.length - 1 && (
                    <Button variant="outline" onClick={() => setSelectedSessionSection(null)}>
                      Return to Overview
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle>Settings</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowSettingsModal(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-6">
              {/* QR Code Generation Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Class Check-In QR Codes</h3>
                <p className="text-sm text-muted-foreground">
                  Generate QR codes for participants to scan during check-in. Display the QR code in your classroom for
                  attendance verification.
                </p>

                <div className="space-y-3">
                  {activeClasses.map((classItem) => (
                    <Card key={classItem.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-semibold">{classItem.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Session {classItem.session} • {classItem.time} • {classItem.location}
                            </p>
                          </div>
                          <Button onClick={() => generateQRCode(classItem.id)} className="gap-2">
                            <QrCode className="h-4 w-4" />
                            Generate QR Code
                          </Button>
                        </div>

                        {selectedClassForQR === classItem.id && qrCodeData && (
                          <div className="mt-4 p-4 bg-background border rounded-lg text-center">
                            <div className="mb-3">
                              <div className="inline-block p-4 bg-white rounded-lg">
                                {/* QR Code placeholder - in production, use a QR code library */}
                                <div className="w-48 h-48 bg-black/10 flex items-center justify-center rounded">
                                  <QrCode className="h-32 w-32 text-muted-foreground" />
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Display this QR code in your classroom for participants to scan
                            </p>
                            <p className="text-xs font-mono bg-muted p-2 rounded break-all">{qrCodeData}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Account Settings */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-semibold">Account Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email</label>
                    <Input type="email" defaultValue="martin@dmsclinicalservices.com" disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Change Password</label>
                    <Button variant="outline" className="w-full bg-transparent">
                      Update Password
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showJournalsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl font-bold">Daily Journal Submissions</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowJournalsModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <div className="space-y-4">
                {participantJournals.map((journal) => (
                  <div key={journal.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{journal.participantName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {journal.day} - {journal.date}
                        </p>
                      </div>
                      <Badge variant={journal.status === "late" ? "destructive" : "secondary"}>
                        {journal.status === "late" ? "Late Submission" : "On Time"}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">Journal content would appear here...</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">Submitted: {journal.submittedAt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
