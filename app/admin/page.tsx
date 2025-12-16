"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Settings,
  LogOut,
  Bell,
  X,
  QrCode,
  Users,
  BookOpen,
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  FileText,
  Upload,
  FileUp,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminDashboard() {
  const router = useRouter()
  const [showAddCurriculumModal, setShowAddCurriculumModal] = useState(false)
  const [showQRCodeModal, setShowQRCodeModal] = useState(false)
  const [showAddFacilitatorModal, setShowAddFacilitatorModal] = useState(false)
  const [showRemoveFacilitatorModal, setShowRemoveFacilitatorModal] = useState(false)
  const [showAbsencesModal, setShowAbsencesModal] = useState(false)
  const [showAssignMakeupModal, setShowAssignMakeupModal] = useState(false)
  const [selectedAbsentParticipants, setSelectedAbsentParticipants] = useState<number[]>([])
  const [makeupGroups, setMakeupGroups] = useState([
    { id: 1, date: "2025-01-18", facilitator: "Dr. Sarah Johnson", participants: [] as string[], completed: false },
    { id: 2, date: "2025-02-15", facilitator: "Dr. Michael Chen", participants: [] as string[], completed: false },
  ])
  const [selectedFacilitator, setSelectedFacilitator] = useState<number | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState("week")
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [showClassDetails, setShowClassDetails] = useState(false)
  const [curriculumJson, setCurriculumJson] = useState("")
  const [curriculumPreview, setCurriculumPreview] = useState<any>(null)
  const [jsonError, setJsonError] = useState("")
  const [aiMessages, setAiMessages] = useState<any[]>([]) // This seems unused in the provided context, might be legacy
  const [isDragging, setIsDragging] = useState(false)

  // New state for AI chat
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  // const [aiChatInput, setAiChatInput] = useState("") // Replaced by aiMessage
  const [aiMessage, setAiMessage] = useState("") // Renamed from aiChatInput
  const [isAIThinking, setIsAIThinking] = useState(false) // Renamed from isAiProcessing
  const [isParsing, setIsParsing] = useState(false) // New state for parsing
  // const [uploadedFileContent, setUploadedFileContent] = useState("") // This is replaced by uploadedFiles

  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; content: string }>>([])

  // Mock data
  const classScheduleGrid = [
    {
      id: 1,
      className: "Prime Solutions",
      facilitator: "Dr. Sarah Johnson",
      day: "Monday",
      time: "2:00 PM",
      location: "Treatment Building - Room A",
      enrolled: 12,
    },
    {
      id: 2,
      className: "Prime Solutions",
      facilitator: "Dr. Sarah Johnson",
      day: "Wednesday",
      time: "2:00 PM",
      location: "Treatment Building - Room A",
      enrolled: 12,
    },
    {
      id: 3,
      className: "Prime Solutions",
      facilitator: "Dr. Sarah Johnson",
      day: "Friday",
      time: "2:00 PM",
      location: "Treatment Building - Room A",
      enrolled: 12,
    },
    {
      id: 4,
      className: "CBT Basics",
      facilitator: "Dr. Michael Chen",
      day: "Tuesday",
      time: "10:00 AM",
      location: "Treatment Building - Room B",
      enrolled: 8,
    },
    {
      id: 5,
      className: "CBT Basics",
      facilitator: "Dr. Michael Chen",
      day: "Thursday",
      time: "10:00 AM",
      location: "Treatment Building - Room B",
      enrolled: 8,
    },
  ]

  const facilitators = [
    { id: 1, name: "Dr. Sarah Johnson", email: "sarah@dmsclinical.com", activeClasses: 1, totalParticipants: 12 },
    { id: 2, name: "Dr. Michael Chen", email: "michael@dmsclinical.com", activeClasses: 1, totalParticipants: 8 },
    { id: 3, name: "Jennifer Martinez", email: "jennifer@dmsclinical.com", activeClasses: 1, totalParticipants: 15 },
  ]

  const recentAbsences = [
    {
      id: 1,
      participant: "John D.",
      class: "Prime Solutions",
      date: "Today",
      facilitator: "Dr. Sarah Johnson",
      assignedToMakeup: false,
    },
    {
      id: 2,
      participant: "Sarah M.",
      class: "CBT Basics",
      date: "Today",
      facilitator: "Dr. Michael Chen",
      assignedToMakeup: false,
    },
    {
      id: 3,
      participant: "Michael R.",
      class: "Life Skills",
      date: "Yesterday",
      facilitator: "Jennifer Martinez",
      assignedToMakeup: false,
    },
  ]

  const curriculumLibrary = [
    { id: 1, title: "Prime Solutions", sessions: 16, category: "Substance Abuse" },
    { id: 2, title: "Cognitive Behavioral Therapy Basics", sessions: 12, category: "Mental Health" },
    { id: 3, title: "Relapse Prevention Strategies", sessions: 8, category: "Recovery" },
    { id: 4, title: "Life Skills Development", sessions: 16, category: "Life Skills" },
    { id: 5, title: "Anger Management", sessions: 10, category: "Behavioral" },
  ]

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
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

  // Mock participant data for class details
  const classParticipants = [
    { id: 1, name: "John Smith", sessionsCompleted: 3, attendance: "95%" },
    { id: 2, name: "Maria Garcia", sessionsCompleted: 3, attendance: "100%" },
    { id: 3, name: "David Lee", sessionsCompleted: 2, attendance: "85%" },
    { id: 4, name: "Sarah Williams", sessionsCompleted: 3, attendance: "100%" },
    { id: 5, name: "Michael Brown", sessionsCompleted: 1, attendance: "70%" },
    { id: 6, name: "Jennifer Davis", sessionsCompleted: 3, attendance: "95%" },
    { id: 7, name: "Robert Johnson", sessionsCompleted: 2, attendance: "90%" },
    { id: 8, name: "Lisa Anderson", sessionsCompleted: 3, attendance: "100%" },
  ]

  // Helper function to find class at specific day and time
  const getClassAtTime = (day: string, time: string) => {
    return classScheduleGrid.find((classItem) => classItem.day === day && classItem.time === time)
  }

  // Function to handle AI messages
  const handleAiMessage = (message: any) => {
    setAiMessages([...aiMessages, message])
  }

  // --- New Functions for Curriculum Modal ---

  const handleFileUpload = (files: File[]) => {
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setUploadedFiles((prev) => [...prev, { name: file.name, content }])
        setAiChatMessages((prev) => [
          ...prev,
          {
            role: "user",
            content: `I uploaded: ${file.name}`,
          },
          {
            role: "assistant",
            content: `File "${file.name}" received! ${
              files.length > 1 ? "Upload all files, then click" : "Click"
            } "Parse with AI" to begin.`,
          },
        ])
      }
      reader.readAsText(file)
    })
  }

  const handleParseWithAI = async () => {
    if (uploadedFiles.length === 0) return
    setIsParsing(true)
    setAiChatMessages((prev) => [...prev, { role: "user", content: "Parse these files into curriculum JSON" }])

    console.log("[v0] Starting parse with", uploadedFiles.length, "files")

    try {
      const combinedContent = uploadedFiles.map((f) => `=== ${f.name} ===\n${f.content}`).join("\n\n")

      console.log("[v0] Combined content length:", combinedContent.length)

      const response = await fetch("/api/parse-curriculum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: combinedContent }),
      })

      console.log("[v0] Response status:", response.status)

      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        const textResponse = await response.text()
        console.error("[v0] Failed to parse response as JSON:", textResponse.substring(0, 200))
        throw new Error(
          `Server returned invalid response (${response.status}). Check that OPENAI_API_KEY is set in environment variables.`,
        )
      }

      console.log("[v0] Response data:", data)

      if (data.success) {
        setCurriculumJson(JSON.stringify(data.curriculum, null, 2))
        setCurriculumPreview(data.curriculum)
        setJsonError("")
        setAiChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Successfully parsed curriculum! Found " +
              (data.curriculum?.totalSessions ?? 0) +
              " sessions. Review the preview on the right.",
          },
        ])
      } else {
        const errorMsg = data.error || "Unknown error occurred"
        console.error("[v0] Parse error:", errorMsg)
        setAiChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${errorMsg}${data.details ? "\n" + data.details : ""}` },
        ])
        setJsonError(errorMsg)
      }
    } catch (error) {
      console.error("[v0] Parse exception:", error)
      const errorMsg = error instanceof Error ? error.message : "Error processing file. Please try again."
      setAiChatMessages((prev) => [...prev, { role: "assistant", content: errorMsg }])
      setJsonError(errorMsg)
    }
    setIsParsing(false)
  }

  const handleAIChat = async () => {
    if (!aiMessage.trim()) return

    setIsAIThinking(true)
    setAiChatMessages((prev) => [...prev, { role: "user", content: aiMessage }])

    try {
      const response = await fetch("/api/parse-curriculum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentJson: curriculumJson,
          userMessage: aiMessage,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setCurriculumJson(data.rawJson)
        setCurriculumPreview(data.curriculum)
        setJsonError("")
        setAiChatMessages((prev) => [...prev, { role: "assistant", content: "Updated! Check the preview." }])
      } else {
        setAiChatMessages((prev) => [...prev, { role: "assistant", content: `Error: ${data.error}` }])
      }
    } catch (error) {
      setAiChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error processing request. Please try again." },
      ])
    }

    setAiMessage("")
    setIsAIThinking(false)
  }

  const handleAddToLibrary = () => {
    if (!curriculumPreview) {
      alert("Please upload or paste a curriculum first")
      return
    }
    alert(`"${curriculumPreview.title}" has been added to the curriculum library!`)
    setShowAddCurriculumModal(false)
    resetCurriculumModalState()
  }

  const resetCurriculumModalState = () => {
    setCurriculumJson("")
    setCurriculumPreview(null)
    setJsonError("")
    setAiChatMessages([])
    setAiMessage("")
    setUploadedFiles([])
    setIsAIThinking(false)
    setIsParsing(false)
    setIsDragging(false)
  }

  // --- End New Functions ---

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary rounded-lg" />
              <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
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
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-foreground">Welcome, Admin</h2>
            <p className="text-muted-foreground text-lg">Manage your learning platform</p>
          </div>
          <Button onClick={() => setShowQRCodeModal(true)} className="bg-primary hover:bg-primary/90 gap-2" size="lg">
            <QrCode className="h-5 w-5" />
            Participant Sign-In QR Code
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Button
            onClick={() => setShowAddCurriculumModal(true)}
            variant="outline"
            className="h-auto py-6 justify-start gap-3 border-2 hover:border-primary hover:bg-primary/5"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Add Curriculum</p>
              <p className="text-sm text-muted-foreground">Add programs to library</p>
            </div>
          </Button>

          <Button
            onClick={() => setShowAddFacilitatorModal(true)}
            variant="outline"
            className="h-auto py-6 justify-start gap-3 border-2 hover:border-primary hover:bg-primary/5"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Add Facilitator</p>
              <p className="text-sm text-muted-foreground">Create new facilitator account</p>
            </div>
          </Button>

          <Button
            onClick={() => setShowAbsencesModal(true)}
            variant="outline"
            className="h-auto py-6 justify-start gap-3 border-2 hover:border-primary hover:bg-primary/5"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold">View All Absences</p>
              <p className="text-sm text-muted-foreground">Track participant attendance</p>
            </div>
          </Button>
        </div>

        {/* Class Schedule Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Class Schedule Overview
            </CardTitle>
            <CardDescription>Weekly view of all classes and facilitators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-8 gap-px bg-border">
                  {/* Header Row */}
                  <div className="bg-background p-1.5 font-medium text-xs">Time</div>
                  {daysOfWeek.map((day) => (
                    <div key={day} className="bg-background p-1.5 text-center font-medium text-xs">
                      {day}
                    </div>
                  ))}

                  {/* Time Slots */}
                  {timeSlots.map((time) => (
                    <>
                      <div key={time} className="bg-background p-1.5 text-xs text-muted-foreground">
                        {time}
                      </div>
                      {daysOfWeek.map((day) => {
                        const classItem = getClassAtTime(day, time)
                        return (
                          <div key={`${day}-${time}`} className="bg-background p-0.5 min-h-[40px]">
                            {classItem && (
                              <button
                                onClick={() => {
                                  setSelectedClass(classItem)
                                  setShowClassDetails(true)
                                }}
                                className="w-full bg-primary/10 hover:bg-primary/20 border-l-2 border-primary rounded p-1 h-full transition-colors text-left"
                              >
                                <div className="text-[10px] font-medium text-foreground leading-tight">
                                  {classItem.className}
                                </div>
                                <div className="text-[9px] text-muted-foreground mt-0.5 leading-tight">
                                  {classItem.facilitator}
                                </div>
                                <div className="text-[9px] text-primary font-medium mt-0.5 leading-tight">
                                  {classItem.enrolled}
                                </div>
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Facilitators Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Facilitators
                </CardTitle>
                <Button onClick={() => setShowRemoveFacilitatorModal(true)} variant="ghost" size="sm">
                  Manage
                </Button>
              </div>
              <CardDescription>Active facilitators on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {facilitators.map((facilitator) => (
                  <div
                    key={facilitator.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">{facilitator.name}</p>
                      <p className="text-sm text-muted-foreground">{facilitator.email}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{facilitator.activeClasses} active classes</span>
                        <span>•</span>
                        <span>{facilitator.totalParticipants} participants</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Absences */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Recent Absences
                </CardTitle>
                <Button onClick={() => setShowAbsencesModal(true)} variant="ghost" size="sm">
                  View All
                </Button>
              </div>
              <CardDescription>Participants who missed recent classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAbsences.slice(0, 3).map((absence) => (
                  <div key={absence.id} className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-foreground">{absence.participant}</p>
                      <Badge variant="secondary" className="text-xs">
                        {absence.date}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{absence.class}</p>
                    <p className="text-xs text-muted-foreground mt-1">Facilitator: {absence.facilitator}</p>
                    {!absence.assignedToMakeup && (
                      <Button
                        onClick={() => {
                          setSelectedAbsentParticipants([absence.id])
                          setShowAssignMakeupModal(true)
                        }}
                        size="sm"
                        className="mt-2 w-full"
                      >
                        Assign to Makeup Group
                      </Button>
                    )}
                    {absence.assignedToMakeup && (
                      <Badge variant="outline" className="mt-2 w-full justify-center">
                        Assigned to Makeup
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Curriculum Library */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Curriculum Library
                </CardTitle>
                <CardDescription>Available programs for facilitators to use</CardDescription>
              </div>
              <Button onClick={() => setShowAddCurriculumModal(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Program
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {curriculumLibrary.map((curriculum) => (
                <div
                  key={curriculum.id}
                  className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{curriculum.title}</h3>
                    <Badge variant="outline">{curriculum.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{curriculum.sessions} sessions</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} DMS Clinical Services. All rights reserved.</p>
        </div>
      </footer>

      {/* QR Code Modal */}
      {showQRCodeModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Participant Sign-In QR Code</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowQRCodeModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Participants scan this QR code to create their account and access their dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="p-8 bg-background border-2 border-primary/20 rounded-lg">
                  <QrCode className="h-48 w-48 text-foreground" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium mb-1">System-Wide Participant Registration</p>
                  <p className="text-xs text-muted-foreground">
                    This QR code allows new participants to register and access the learning platform
                  </p>
                </div>
                <div className="flex gap-2 w-full">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Download QR Code
                  </Button>
                  <Button className="flex-1">Print QR Code</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Curriculum Modal */}
      {showAddCurriculumModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden">
            <CardHeader className="flex-shrink-0 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Upload Curriculum</CardTitle>
                  <CardDescription>Drag and drop your curriculum files or paste JSON content</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowAddCurriculumModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6">
              <div className="flex gap-4">
                {/* Left: Upload & Editor */}
                <div className="flex-1 flex flex-col gap-4">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setIsDragging(false)
                      const files = Array.from(e.dataTransfer.files)
                      handleFileUpload(files)
                    }}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragging ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <FileUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm font-medium mb-2">Drop curriculum files here</p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Upload structure document and workbook (PDF, Word, Text, JSON)
                    </p>
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.json"
                      onChange={(e) => handleFileUpload(Array.from(e.target.files || []))}
                      className="hidden"
                    />
                    <Button variant="outline" size="sm" onClick={() => document.getElementById("file-upload")?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                    </Button>
                  </div>

                  {/* Uploaded Files List */}
                  {uploadedFiles.length > 0 && (
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold text-sm mb-3">Uploaded Files ({uploadedFiles.length})</h3>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{file.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx))}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Parse Button */}
                  {uploadedFiles.length > 0 && (
                    <Button onClick={handleParseWithAI} disabled={isParsing} className="bg-primary hover:bg-primary/90">
                      {isParsing ? "Parsing..." : "Parse with AI"}
                    </Button>
                  )}

                  {/* AI Chat Assistant */}
                  <div className="border rounded-lg flex flex-col h-[400px]">
                    <div className="p-3 border-b bg-muted/50 flex-shrink-0">
                      <h3 className="font-semibold text-sm">AI Assistant</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Chat with AI to fix curriculum structure or content
                      </p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                      {aiChatMessages.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          Upload a file above, then chat with AI to parse it into curriculum format
                        </p>
                      )}
                      {aiChatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg text-sm ${
                            msg.role === "user" ? "bg-primary text-primary-foreground ml-8" : "bg-muted mr-8"
                          }`}
                        >
                          {msg.content}
                        </div>
                      ))}
                      {isAIThinking && (
                        <div className="bg-muted p-3 rounded-lg text-sm mr-8">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                            <div
                              className="h-2 w-2 bg-primary rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="h-2 w-2 bg-primary rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3 border-t flex gap-2 flex-shrink-0">
                      <Input
                        placeholder="Ask AI to fix or modify curriculum..."
                        value={aiMessage}
                        onChange={(e) => setAiMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleAIChat()
                          }
                        }}
                        className="flex-1"
                      />
                      <Button onClick={handleAIChat} disabled={!aiMessage.trim() || isAIThinking} size="sm">
                        Send
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right: Live Preview */}
                <div className="flex-1 border border-border rounded-lg flex flex-col min-h-[600px]">
                  <div className="p-3 border-b border-border bg-muted/50 flex-shrink-0">
                    <h3 className="font-semibold text-sm">Live Preview</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    {curriculumPreview ? (
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-xl font-bold text-foreground">{curriculumPreview.title}</h2>
                          <p className="text-sm text-muted-foreground">by {curriculumPreview.publisher}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge>{curriculumPreview.category}</Badge>
                            <Badge variant="outline">{curriculumPreview.totalSessions} Sessions</Badge>
                          </div>
                          <p className="mt-3 text-sm">{curriculumPreview.description}</p>
                        </div>

                        <div className="border-t border-border pt-4">
                          <h3 className="font-semibold mb-3">Sessions Overview</h3>
                          <div className="space-y-2">
                            {curriculumPreview.sessions?.map((session: any) => (
                              <div key={session.number} className="p-3 border border-border rounded-lg">
                                <p className="font-semibold text-sm">
                                  Session {session.number}: {session.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {session.sections?.length || 0} sections
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                        <div>
                          <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>Drag and drop files to see preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="flex-shrink-0 border-t p-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddCurriculumModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddToLibrary}
                disabled={!curriculumPreview}
                className="bg-primary hover:bg-primary/90"
              >
                Add to Library
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Facilitator Modal */}
      {showAddFacilitatorModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add New Facilitator</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowAddFacilitatorModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Create a new facilitator account with assigned email</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facilitator-name">Full Name</Label>
                  <Input id="facilitator-name" placeholder="Dr. Jane Smith" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facilitator-email">Assigned Email</Label>
                  <Input id="facilitator-email" type="email" placeholder="jane@dmsclinical.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facilitator-temp-password">Temporary Password</Label>
                  <Input id="facilitator-temp-password" type="password" placeholder="Temporary password" />
                  <p className="text-xs text-muted-foreground">
                    Facilitator can change this password after first login
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAddFacilitatorModal(false)}
                  className="flex-1 bg-transparent"
                >
                  Cancel
                </Button>
                <Button className="flex-1">Create Facilitator</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Remove Facilitator Modal */}
      {showRemoveFacilitatorModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Manage Facilitators</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowRemoveFacilitatorModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Remove or edit facilitator accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[400px]">
                <div className="space-y-2">
                  {facilitators.map((facilitator) => (
                    <div
                      key={facilitator.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">{facilitator.name}</p>
                        <p className="text-sm text-muted-foreground">{facilitator.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {/* All Absences Modal */}
      {showAbsencesModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Participant Absences</CardTitle>
                  <CardDescription>Track missed classes by timeframe</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowAbsencesModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="timeframe" className="text-sm font-medium">
                    View:
                  </Label>
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => setShowAssignMakeupModal(true)}
                    disabled={selectedAbsentParticipants.length === 0}
                    className="ml-auto"
                  >
                    Assign Selected to Makeup ({selectedAbsentParticipants.length})
                  </Button>
                </div>
                <ScrollArea className="max-h-[400px]">
                  <div className="space-y-2">
                    {recentAbsences.concat(recentAbsences).map((absence, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <input
                          type="checkbox"
                          checked={selectedAbsentParticipants.includes(absence.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAbsentParticipants([...selectedAbsentParticipants, absence.id])
                            } else {
                              setSelectedAbsentParticipants(
                                selectedAbsentParticipants.filter((id) => id !== absence.id),
                              )
                            }
                          }}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{absence.participant}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span>{absence.class}</span>
                            <span>•</span>
                            <span>{absence.facilitator}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{absence.date}</Badge>
                          {absence.assignedToMakeup && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Makeup Assigned
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showAssignMakeupModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Assign to Makeup Group</CardTitle>
                  <CardDescription>Select a makeup group for the participant(s)</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowAssignMakeupModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Participants to Assign:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedAbsentParticipants.map((id) => {
                    const absence = recentAbsences.find((a) => a.id === id)
                    return absence ? (
                      <Badge key={id} variant="secondary">
                        {absence.participant}
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Available Makeup Groups (Saturdays at 10:00 AM)</Label>
                {makeupGroups
                  .filter((g) => !g.completed)
                  .map((group) => (
                    <div
                      key={group.id}
                      className="p-4 border border-border rounded-lg hover:border-primary cursor-pointer transition-colors"
                      onClick={() => {
                        // Assign participants to this makeup group
                        const updatedGroups = makeupGroups.map((g) => {
                          if (g.id === group.id) {
                            const newParticipants = selectedAbsentParticipants
                              .map((id) => {
                                const absence = recentAbsences.find((a) => a.id === id)
                                return absence?.participant || ""
                              })
                              .filter(Boolean)
                            return { ...g, participants: [...g.participants, ...newParticipants] }
                          }
                          return g
                        })
                        setMakeupGroups(updatedGroups)
                        setShowAssignMakeupModal(false)
                        setSelectedAbsentParticipants([])
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">
                            {new Date(group.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">10:00 AM - Treatment Building</p>
                          <p className="text-sm text-muted-foreground">Facilitator: {group.facilitator}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{group.participants.length} enrolled</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={() => {
                    // Add new makeup group for next month
                    const lastDate = new Date(makeupGroups[makeupGroups.length - 1].date)
                    lastDate.setMonth(lastDate.getMonth() + 1)
                    const newGroup = {
                      id: makeupGroups.length + 1,
                      date: lastDate.toISOString().split("T")[0],
                      facilitator: "Dr. Sarah Johnson",
                      participants: [] as string[],
                      completed: false,
                    }
                    setMakeupGroups([...makeupGroups, newGroup])
                  }}
                  variant="outline"
                  className="w-full"
                >
                  + Schedule New Makeup Group
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Class Details Modal */}
      {showClassDetails && selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="border-b p-6 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">{selectedClass.className}</h2>
                  <p className="text-muted-foreground mt-1">
                    {selectedClass.day}s at {selectedClass.time}
                  </p>
                </div>
                <button
                  onClick={() => setShowClassDetails(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Class Overview Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Facilitator</div>
                  <div className="font-medium mt-1">{selectedClass.facilitator}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-medium mt-1">{selectedClass.location}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Enrolled</div>
                  <div className="font-medium mt-1">{selectedClass.enrolled} participants</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Sessions</div>
                  <div className="font-medium mt-1">3 of 16 completed</div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="font-semibold text-lg mb-4">Enrolled Participants</h3>

              <div className="space-y-2">
                {classParticipants.map((participant) => (
                  <div key={participant.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{participant.name}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Sessions Completed: {participant.sessionsCompleted} of 16
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Attendance</div>
                        <div className="font-semibold text-primary">{participant.attendance}</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${(participant.sessionsCompleted / 16) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4 flex-shrink-0 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowClassDetails(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
