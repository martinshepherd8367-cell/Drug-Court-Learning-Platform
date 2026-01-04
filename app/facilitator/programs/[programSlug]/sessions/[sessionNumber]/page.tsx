"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { RoleNav } from "@/components/role-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Play,
  Square,
  Clock,
  Users,
  CheckCircle,
  Circle,
  Copy,
  FileText,
  MessageSquare,
  Rocket,
  ChevronRight,
  ChevronLeft,
  StickyNote,
  Send,
} from "lucide-react"

const SECTIONS = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "opening", label: "Opening", icon: Play },
  { id: "review", label: "Review", icon: CheckCircle },
  { id: "teach", label: "Teach", icon: FileText },
  { id: "activity", label: "Activity", icon: Rocket },
  { id: "responses", label: "Responses", icon: MessageSquare },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "caseworx", label: "CaseWorx", icon: Copy },
  { id: "wrapup", label: "Wrap-up", icon: CheckCircle },
] as const

type SectionId = (typeof SECTIONS)[number]["id"]

export default function FacilitatorSessionView() {
  const params = useParams()
  const router = useRouter()
  const {
    getProgramBySlug,
    getSessionByNumber,
    getEnrollmentsByProgram,
    getActiveActivityRun,
    getResponsesForActivity,
    launchActivity,
    closeActivity,
    users,
    copyCaseworx,
  } = useStore()

  const programSlug = params.programSlug as string
  const sessionNumber = Number.parseInt(params.sessionNumber as string)

  const program = getProgramBySlug(programSlug)
  const session = getSessionByNumber(programSlug, sessionNumber)

  // State
  const [activeSection, setActiveSection] = useState<SectionId>("overview")
  const [completedSections, setCompletedSections] = useState<Set<SectionId>>(new Set())
  const [sessionStarted, setSessionStarted] = useState(false)
  const [sessionEnded, setSessionEnded] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [facilitatorNotes, setFacilitatorNotes] = useState("")
  const [quickNotes, setQuickNotes] = useState<string[]>([])
  const [newQuickNote, setNewQuickNote] = useState("")
  const [showActivityLauncher, setShowActivityLauncher] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
  const [copiedCaseworx, setCopiedCaseworx] = useState(false)
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false)

  // Get enrollments for this program
  const enrollments = program ? getEnrollmentsByProgram(program.id) : []
  const activeEnrollments = enrollments.filter((e) => e.status === "active")
  const participants = activeEnrollments.map((e) => users.find((u) => u.id === e.participantId)).filter(Boolean)

  // Get active activity run
  const activeActivityRun = session ? getActiveActivityRun(session.id) : undefined
  const activityResponses = activeActivityRun ? getResponsesForActivity(activeActivityRun.id) : []

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (sessionStarted && !sessionEnded) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [sessionStarted, sessionEnded])

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (!program || !session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <RoleNav />
        <main className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Session Not Found</h1>
            <p className="text-gray-600 mb-4">The session you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/facilitator")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    )
  }

  // Get prompts for current section
  const getSectionPrompts = (sectionId: SectionId) => {
    return session.facilitatorPrompts.filter((p) => p.section === sectionId)
  }

  // Toggle section completion
  const toggleSectionComplete = (sectionId: SectionId) => {
    const newCompleted = new Set(completedSections)
    if (newCompleted.has(sectionId)) {
      newCompleted.delete(sectionId)
    } else {
      newCompleted.add(sectionId)
    }
    setCompletedSections(newCompleted)
  }

  // Calculate progress
  const progressPercent = (completedSections.size / SECTIONS.length) * 100

  // Handle activity launch
  const handleLaunchActivity = (activityId: string) => {
    launchActivity(session.id, activityId)
    setShowActivityLauncher(false)
    setSelectedActivity(null)
  }

  // Handle copy caseworx
  const handleCopyCaseworx = () => {
    const template = copyCaseworx(session.id)
    const notesInserted = template.replace("[INSERT NOTES]", facilitatorNotes || "No notes recorded")
    navigator.clipboard.writeText(notesInserted)
    setCopiedCaseworx(true)
    setTimeout(() => setCopiedCaseworx(false), 2000)
  }

  // Add quick note
  const addQuickNote = () => {
    if (newQuickNote.trim()) {
      setQuickNotes([...quickNotes, newQuickNote.trim()])
      setNewQuickNote("")
    }
  }

  // Navigate to next/prev session
  const goToSession = (num: number) => {
    router.push(`/facilitator/programs/${programSlug}/sessions/${num}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <RoleNav />

      {/* Session Header - Zone A */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push(`/facilitator/programs/${programSlug}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="border-l border-gray-300 pl-4">
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-gray-900">
                  Session {sessionNumber} of {program.totalSessions}
                </h1>
                <Badge variant="outline">{program.name}</Badge>
              </div>
              <p className="text-sm text-gray-600">{session.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Progress:</span>
              <Progress value={progressPercent} className="w-24 h-2" />
              <span className="text-sm font-medium">{Math.round(progressPercent)}%</span>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="font-mono text-sm">{formatTime(elapsedTime)}</span>
            </div>

            {/* Session Controls */}
            {!sessionStarted ? (
              <Button onClick={() => setSessionStarted(true)} className="bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                Start Session
              </Button>
            ) : !sessionEnded ? (
              <Button onClick={() => setSessionEnded(true)} variant="destructive">
                <Square className="h-4 w-4 mr-2" />
                End Session
              </Button>
            ) : (
              <Badge className="bg-gray-600">Session Ended</Badge>
            )}

            {/* Navigation */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                disabled={sessionNumber <= 1}
                onClick={() => goToSession(sessionNumber - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={sessionNumber >= program.totalSessions}
                onClick={() => goToSession(sessionNumber + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Navigation Spine - Zone B */}
        <div className={`bg-white border-r border-gray-200 transition-all ${leftPanelCollapsed ? "w-12" : "w-64"}`}>
          <div className="p-3 border-b border-gray-200 flex items-center justify-between">
            {!leftPanelCollapsed && <span className="font-medium text-sm">Sections</span>}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            >
              {leftPanelCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="p-2 space-y-1">
              {SECTIONS.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id
                const isComplete = completedSections.has(section.id)
                const prompts = getSectionPrompts(section.id)
                const pacing = prompts[0]?.suggestedPacing

                return (
                  <div
                    key={section.id}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                      isActive ? "bg-green-100 border border-green-300" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <Checkbox
                      checked={isComplete}
                      onCheckedChange={() => toggleSectionComplete(section.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {!leftPanelCollapsed && (
                      <>
                        <Icon className={`h-4 w-4 ${isActive ? "text-green-700" : "text-gray-500"}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isActive ? "text-green-700" : ""}`}>
                            {section.label}
                          </p>
                          {pacing && <p className="text-xs text-gray-500">{pacing}</p>}
                        </div>
                        {isComplete && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        {/* CENTER: Active Content - Zone C */}
        <div className="flex-1 overflow-auto">
          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="p-6">
              {/* Overview Section */}
              {activeSection === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-2">Session Overview</h2>
                    <p className="text-gray-600">{session.purpose}</p>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Objectives</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {session.objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Opening Section */}
              {activeSection === "opening" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">Opening</h2>
                  {getSectionPrompts("opening").map((prompt) => (
                    <Card key={prompt.id} className="border-l-4 border-l-green-600">
                      <CardContent className="pt-6">
                        <p className="text-gray-700">{prompt.content}</p>
                        {prompt.suggestedPacing && (
                          <p className="text-sm text-gray-500 mt-2">
                            <Clock className="h-4 w-4 inline mr-1" />
                            {prompt.suggestedPacing}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Review Section */}
              {activeSection === "review" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">Homework Review</h2>
                  {getSectionPrompts("review").map((prompt) => (
                    <Card key={prompt.id} className="border-l-4 border-l-blue-600">
                      <CardContent className="pt-6">
                        <p className="text-gray-700">{prompt.content}</p>
                        {prompt.suggestedPacing && (
                          <p className="text-sm text-gray-500 mt-2">
                            <Clock className="h-4 w-4 inline mr-1" />
                            {prompt.suggestedPacing}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Teach Section */}
              {activeSection === "teach" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">Teaching Points</h2>
                  {getSectionPrompts("teach").map((prompt) => (
                    <Card key={prompt.id} className="border-l-4 border-l-purple-600">
                      <CardContent className="pt-6">
                        <p className="text-gray-700 whitespace-pre-wrap">{prompt.content}</p>
                        {prompt.suggestedPacing && (
                          <p className="text-sm text-gray-500 mt-2">
                            <Clock className="h-4 w-4 inline mr-1" />
                            {prompt.suggestedPacing}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Activity Section */}
              {activeSection === "activity" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Activity</h2>
                    <Button
                      onClick={() => setShowActivityLauncher(true)}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={!sessionStarted || sessionEnded}
                    >
                      <Rocket className="h-4 w-4 mr-2" />
                      Launch Activity
                    </Button>
                  </div>

                  {getSectionPrompts("activity").map((prompt) => (
                    <Card key={prompt.id} className="border-l-4 border-l-orange-600">
                      <CardContent className="pt-6">
                        <p className="text-gray-700">{prompt.content}</p>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Activity Templates */}
                  {session.activityTemplates.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Available Activities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {session.activityTemplates.map((activity) => (
                            <div
                              key={activity.id}
                              className="p-4 border rounded-lg hover:border-green-500 cursor-pointer"
                              onClick={() => {
                                setSelectedActivity(activity.id)
                                setShowActivityLauncher(true)
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">{activity.title}</h4>
                                  <p className="text-sm text-gray-600">{activity.instructions}</p>
                                  <Badge variant="secondary" className="mt-2">
                                    {activity.type}
                                  </Badge>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Active Activity Status */}
                  {activeActivityRun && (
                    <Card className="border-green-500 border-2">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            Activity Live
                          </CardTitle>
                          <Button variant="destructive" size="sm" onClick={() => closeActivity(activeActivityRun.id)}>
                            Close Activity
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{activityResponses.length} responses received</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Responses Section */}
              {activeSection === "responses" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">Participant Responses</h2>

                  {activityResponses.length > 0 ? (
                    <div className="space-y-4">
                      {activityResponses.map((response) => {
                        const participant = users.find((u) => u.id === response.participantId)
                        return (
                          <Card key={response.id}>
                            <CardHeader>
                              <CardTitle className="text-base">{participant?.name || "Unknown"}</CardTitle>
                              <CardDescription>
                                Submitted {new Date(response.submittedAt).toLocaleString()}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {Object.entries(response.answers).map(([key, value]) => (
                                <div key={key} className="mb-2">
                                  <p className="text-sm font-medium text-gray-600">{key}</p>
                                  <p className="text-gray-900">{value}</p>
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No responses yet.</p>
                      <p className="text-sm">Launch an activity to collect participant responses.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Notes Section */}
              {activeSection === "notes" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">Facilitator Notes</h2>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Session Notes</CardTitle>
                      <CardDescription>
                        Record your observations, participant engagement, and follow-up items
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={facilitatorNotes}
                        onChange={(e) => setFacilitatorNotes(e.target.value)}
                        placeholder="Enter your session notes here..."
                        className="min-h-[200px]"
                      />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* CaseWorx Section */}
              {activeSection === "caseworx" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">CaseWorx Export</h2>
                    <Button onClick={handleCopyCaseworx} className="bg-green-600 hover:bg-green-700">
                      <Copy className="h-4 w-4 mr-2" />
                      {copiedCaseworx ? "Copied!" : "Copy to Clipboard"}
                    </Button>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Note Template</CardTitle>
                      <CardDescription>This template will be copied with your notes inserted</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap font-mono">
                        {session.caseworxNoteTemplate.replace(
                          "[INSERT NOTES]",
                          facilitatorNotes || "[Your notes will appear here]",
                        )}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Wrap-up Section */}
              {activeSection === "wrapup" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">Session Wrap-up</h2>

                  {getSectionPrompts("wrapup").map((prompt) => (
                    <Card key={prompt.id} className="border-l-4 border-l-green-600">
                      <CardContent className="pt-6">
                        <p className="text-gray-700">{prompt.content}</p>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Homework Assignment */}
                  {session.homeworkTemplate && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Homework to Assign</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <h4 className="font-medium mb-2">{session.homeworkTemplate.title}</h4>
                        <ul className="space-y-1 mb-4">
                          {session.homeworkTemplate.steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="text-green-600 font-medium">{i + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-sm text-gray-500">Due: {session.homeworkTemplate.dueDescription}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Next Session Preview */}
                  {sessionNumber < program.totalSessions && (
                    <Card className="bg-gray-50">
                      <CardHeader>
                        <CardTitle className="text-lg">Next Session Preview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          const nextSession = program.sessions.find((s) => s.sessionNumber === sessionNumber + 1)
                          return nextSession ? (
                            <div>
                              <h4 className="font-medium">
                                Session {nextSession.sessionNumber}: {nextSession.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">{nextSession.purpose}</p>
                            </div>
                          ) : (
                            <p className="text-gray-500">Next session content not available.</p>
                          )
                        })()}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* RIGHT: Live Panel */}
        <div className="w-80 bg-white border-l border-gray-200">
          <Tabs defaultValue="participants" className="h-full flex flex-col">
            <TabsList className="m-3 grid grid-cols-3">
              <TabsTrigger value="responses">Feed</TabsTrigger>
              <TabsTrigger value="participants">
                <Users className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="responses" className="flex-1 overflow-auto m-0 px-3 pb-3">
              <ScrollArea className="h-[calc(100vh-260px)]">
                {activityResponses.length > 0 ? (
                  <div className="space-y-3">
                    {activityResponses.map((response) => {
                      const participant = users.find((u) => u.id === response.participantId)
                      return (
                        <Card key={response.id} className="bg-green-50">
                          <CardContent className="p-3">
                            <p className="font-medium text-sm">{participant?.name}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(response.submittedAt).toLocaleTimeString()}
                            </p>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No responses yet</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="participants" className="flex-1 overflow-auto m-0 px-3 pb-3">
              <ScrollArea className="h-[calc(100vh-260px)]">
                <div className="space-y-2">
                  {participants.map((p) => (
                    <div key={p?.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-green-700">{p?.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p?.name}</p>
                        <p className="text-xs text-gray-500">{p?.role}</p>
                      </div>
                      <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                    </div>
                  ))}
                </div>

                {participants.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No participants enrolled</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="notes" className="flex-1 overflow-auto m-0 px-3 pb-3">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Textarea
                    value={newQuickNote}
                    onChange={(e) => setNewQuickNote(e.target.value)}
                    placeholder="Quick note..."
                    className="text-sm"
                    rows={2}
                  />
                  <Button size="icon" onClick={addQuickNote} className="bg-green-600 hover:bg-green-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <ScrollArea className="h-[calc(100vh-340px)]">
                  <div className="space-y-2">
                    {quickNotes.map((note, i) => (
                      <Card key={i} className="bg-yellow-50">
                        <CardContent className="p-3">
                          <p className="text-sm">{note}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Activity Launcher Modal */}
      <Dialog open={showActivityLauncher} onOpenChange={setShowActivityLauncher}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Launch Activity</DialogTitle>
            <DialogDescription>
              Select an activity to launch for participants. They will see this on their screens immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {session.activityTemplates.map((activity) => (
              <Card
                key={activity.id}
                className={`cursor-pointer transition-all ${
                  selectedActivity === activity.id ? "border-green-500 border-2" : "hover:border-green-300"
                }`}
                onClick={() => setSelectedActivity(activity.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{activity.title}</h4>
                    <Badge variant="secondary">{activity.type}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{activity.instructions}</p>

                  <div className="text-sm text-gray-500">
                    <p className="font-medium mb-1">Questions:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {activity.questions.map((q) => (
                        <li key={q.id}>{q.text}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActivityLauncher(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedActivity && handleLaunchActivity(selectedActivity)}
              disabled={!selectedActivity}
              className="bg-green-600 hover:bg-green-700"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Launch Live
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
