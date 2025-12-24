"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Play,
  Pause,
  Square,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Eye,
  EyeOff,
  Clock,
  Users,
} from "lucide-react"
import { primeSolutionsProgram } from "@/data/prime-solutions-program"
import type { CurriculumSection, SessionStatus, ParticipantSubmission } from "@/types/curriculum"
import { buildCaseWorxNote } from "@/lib/casewrox-export"

// Timer hook
function useTimer(isRunning: boolean) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const remainingSecs = secs % 60
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`
  }

  return { seconds, formatted: formatTime(seconds), reset: () => setSeconds(0) }
}

// Keyboard shortcuts hook
function useHotkeys(handlers: Record<string, () => void>) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (handlers[e.key]) {
        e.preventDefault()
        handlers[e.key]()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [handlers])
}

export default function LiveSessionPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string

  // Find the session
  const session = primeSolutionsProgram.sessions.find((s) => s.id === sessionId) || primeSolutionsProgram.sessions[0]

  // State
  const [status, setStatus] = useState<SessionStatus>("live")
  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [openSectionContent, setOpenSectionContent] = useState<CurriculumSection | null>(null)
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())
  const [facilitatorNote, setFacilitatorNote] = useState("")
  const [showFacilitatorOnly, setShowFacilitatorOnly] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [homeworkAssigned, setHomeworkAssigned] = useState(false)

  // Timer
  const timer = useTimer(status === "live")

  // Mock participant submissions
  const [submissions] = useState<ParticipantSubmission[]>([
    {
      id: "1",
      participantName: "John D.",
      promptId: "s1-p1",
      response: "I'm sailing from a place of uncertainty and broken relationships.",
      submittedAt: new Date(),
    },
    {
      id: "2",
      participantName: "Sarah M.",
      promptId: "s1-p2",
      response: "Stay clean for 30 days.",
      submittedAt: new Date(),
    },
    {
      id: "3",
      participantName: "Mike R.",
      promptId: "s1-p1",
      response: "Starting from rock bottom, but ready to climb.",
      submittedAt: new Date(),
    },
  ])

  const activeSection = session.sections[activeSectionIndex]

  // Navigation
  const goToNextSection = useCallback(() => {
    if (activeSectionIndex < session.sections.length - 1) {
      setActiveSectionIndex((prev) => prev + 1)
    }
  }, [activeSectionIndex, session.sections.length])

  const goToPrevSection = useCallback(() => {
    if (activeSectionIndex > 0) {
      setActiveSectionIndex((prev) => prev - 1)
    }
  }, [activeSectionIndex])

  const copyCurrentSection = useCallback(() => {
    if (activeSection) {
      const text = activeSection.blocks
        .filter((b) => !b.facilitatorOnly || showFacilitatorOnly)
        .map((b) => (Array.isArray(b.content) ? b.content.join("\n") : b.content))
        .join("\n\n")
      navigator.clipboard.writeText(text)
      setCopiedId(activeSection.id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }, [activeSection, showFacilitatorOnly])

  // Keyboard shortcuts
  useHotkeys({
    n: goToNextSection,
    p: goToPrevSection,
    c: copyCurrentSection,
  })

  const markSectionComplete = (sectionId: string) => {
    setCompletedSections((prev) => new Set([...prev, sectionId]))
  }

  const copyBlock = (content: string | string[], blockId: string) => {
    const text = Array.isArray(content) ? content.join("\n") : content
    navigator.clipboard.writeText(text)
    setCopiedId(blockId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const endSession = () => {
    setStatus("completed")
    setShowSummary(true)
  }

  const copyCaseWorxNote = () => {
    const note = buildCaseWorxNote(session, facilitatorNote, submissions)
    navigator.clipboard.writeText(note)
    setCopiedId("casewrox")
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getSectionStatus = (section: CurriculumSection, index: number) => {
    if (completedSections.has(section.id)) return "completed"
    if (index === activeSectionIndex) return "active"
    return "notStarted"
  }

  const getStatusBadge = (sectionStatus: string) => {
    switch (sectionStatus) {
      case "completed":
        return <Badge className="bg-emerald-600 text-white text-[10px]">Done</Badge>
      case "active":
        return <Badge className="bg-blue-600 text-white text-[10px]">Active</Badge>
      default:
        return (
          <Badge variant="outline" className="text-[10px]">
            Pending
          </Badge>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ZONE A - Session Control Header */}
      <header className="sticky top-0 z-50 bg-white border-b-2 border-gray-300 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/facilitator")} className="text-gray-600">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div>
                <p className="text-sm text-gray-500">Prime Solutions</p>
                <h1 className="text-lg font-bold">
                  Session {session.number} of 16: {session.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status Badge */}
              <Badge
                className={
                  status === "live"
                    ? "bg-red-600 text-white animate-pulse"
                    : status === "paused"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-500 text-white"
                }
              >
                {status === "live" ? "LIVE" : status === "paused" ? "PAUSED" : "COMPLETED"}
              </Badge>

              {/* Timer */}
              <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-md">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-mono text-lg">{timer.formatted}</span>
              </div>

              {/* Controls */}
              {status !== "completed" && (
                <>
                  <Button
                    size="sm"
                    variant={status === "live" ? "outline" : "default"}
                    onClick={() => setStatus(status === "live" ? "paused" : "live")}
                    className={status === "live" ? "" : "bg-emerald-600 hover:bg-emerald-700"}
                  >
                    {status === "live" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={endSession}>
                    <Square className="h-4 w-4 mr-1" />
                    End Session
                  </Button>
                </>
              )}

              <Button size="sm" variant="outline" onClick={copyCaseWorxNote}>
                {copiedId === "casewrox" ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                Copy to CaseWorx
              </Button>

              <Button size="sm" variant="outline" onClick={() => setShowSummary(true)}>
                <FileText className="h-4 w-4 mr-1" />
                Summary
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ZONE B - Navigation Spine */}
      <div className="sticky top-[73px] z-40 bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          <Button size="sm" variant="outline" onClick={goToPrevSection} disabled={activeSectionIndex === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {session.sections.map((section, idx) => {
            const sectionStatus = getSectionStatus(section, idx)
            return (
              <button
                key={section.id}
                onClick={() => setActiveSectionIndex(idx)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors
                  ${
                    idx === activeSectionIndex
                      ? "bg-emerald-600 text-white"
                      : sectionStatus === "completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-white border border-gray-200 hover:bg-gray-50"
                  }
                `}
              >
                <span className="font-medium">{section.title.split(":")[0]}</span>
                {getStatusBadge(sectionStatus)}
              </button>
            )
          })}

          <Button
            size="sm"
            variant="outline"
            onClick={goToNextSection}
            disabled={activeSectionIndex === session.sections.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-2" />

          <Button
            size="sm"
            variant={showFacilitatorOnly ? "default" : "outline"}
            onClick={() => setShowFacilitatorOnly(!showFacilitatorOnly)}
            className={showFacilitatorOnly ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            {showFacilitatorOnly ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
            Facilitator View
          </Button>
        </div>
      </div>

      {/* ZONE C - Active Content Workspace */}
      <main className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{activeSection.title}</h2>
              <p className="text-sm text-gray-500">Duration: {activeSection.duration} minutes</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={copyCurrentSection}>
                {copiedId === activeSection.id ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                Copy Section
              </Button>
              <Button
                size="sm"
                className={
                  completedSections.has(activeSection.id) ? "bg-blue-600" : "bg-emerald-600 hover:bg-emerald-700"
                }
                onClick={() => markSectionComplete(activeSection.id)}
                disabled={completedSections.has(activeSection.id)}
              >
                {completedSections.has(activeSection.id) ? "Completed" : "Mark Complete"}
              </Button>
            </div>
          </div>

          {/* Content Blocks */}
          <div className="space-y-3">
            {activeSection.blocks
              .filter((block) => !block.facilitatorOnly || showFacilitatorOnly)
              .map((block) => (
                <Card
                  key={block.id}
                  className={`
                    ${block.facilitatorOnly ? "border-l-4 border-l-purple-500 bg-purple-50" : ""}
                    cursor-pointer hover:shadow-md transition-shadow
                  `}
                  onClick={() => setOpenSectionContent(activeSection)}
                >
                  <CardHeader className="py-2 px-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {block.facilitatorOnly && (
                          <Badge variant="outline" className="text-purple-600 border-purple-300 text-xs">
                            Facilitator Only
                          </Badge>
                        )}
                        {block.label && <span className="font-semibold text-sm">{block.label}</span>}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          copyBlock(block.content, block.id)
                        }}
                      >
                        {copiedId === block.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2 px-4">
                    {block.type === "paragraph" || block.type === "script" ? (
                      <p className={`text-sm ${block.type === "script" ? "italic" : ""}`}>{block.content as string}</p>
                    ) : block.type === "bullets" || block.type === "steps" ? (
                      <ul
                        className={`text-sm space-y-1 ${block.type === "steps" ? "list-decimal" : "list-disc"} list-inside`}
                      >
                        {(block.content as string[]).map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : block.type === "callout" ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                        {Array.isArray(block.content) ? (
                          <ul className="text-sm space-y-1 list-disc list-inside">
                            {block.content.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm">{block.content}</p>
                        )}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Assign Homework Button (on last section) */}
          {activeSection.type === "wrapUp" && (
            <Card className="border-2 border-dashed border-emerald-300 bg-emerald-50">
              <CardContent className="py-4 text-center">
                <Button
                  className={homeworkAssigned ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"}
                  onClick={() => setHomeworkAssigned(true)}
                  disabled={homeworkAssigned}
                >
                  {homeworkAssigned ? "Homework Assigned" : "Assign Homework to Participants"}
                </Button>
                <p className="text-sm text-gray-500 mt-2">{session.homework}</p>
              </CardContent>
            </Card>
          )}

          {/* Participant Input Feed */}
          <Card className="mt-6">
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Participant Responses
                </CardTitle>
                <Badge className="bg-emerald-600">{submissions.length} responses</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {submissions.slice(0, 3).map((sub) => (
                <div key={sub.id} className="bg-gray-50 rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{sub.participantName}</span>
                    <span className="text-xs text-gray-400">{sub.submittedAt.toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm mt-1 text-gray-700">"{sub.response}"</p>
                </div>
              ))}
              {submissions.length > 3 && (
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View All {submissions.length} Responses
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Facilitator Notes */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-lg">Session Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter your session notes here..."
                value={facilitatorNote}
                onChange={(e) => setFacilitatorNote(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Section Content Modal */}
      <Dialog open={!!openSectionContent} onOpenChange={() => setOpenSectionContent(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{openSectionContent?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {openSectionContent?.blocks
              .filter((block) => !block.facilitatorOnly || showFacilitatorOnly)
              .map((block) => (
                <div
                  key={block.id}
                  className={`p-4 rounded-lg ${block.facilitatorOnly ? "bg-purple-50 border-l-4 border-purple-500" : "bg-gray-50"}`}
                >
                  {block.label && <h4 className="font-semibold mb-2">{block.label}</h4>}
                  {block.type === "paragraph" || block.type === "script" ? (
                    <p className={block.type === "script" ? "italic" : ""}>{block.content as string}</p>
                  ) : (
                    <ul className={`space-y-1 ${block.type === "steps" ? "list-decimal" : "list-disc"} list-inside`}>
                      {(block.content as string[]).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenSectionContent(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Session Summary Modal */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Session {session.number} Summary</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            <Card>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Facilitator Notes</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(facilitatorNote)
                      setCopiedId("fac-note")
                      setTimeout(() => setCopiedId(null), 2000)
                    }}
                  >
                    {copiedId === "fac-note" ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                    Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{facilitatorNote || "No notes entered"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Participant Takeaways ({submissions.length})</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const text = submissions.map((s) => `${s.participantName}: ${s.response}`).join("\n")
                      navigator.clipboard.writeText(text)
                      setCopiedId("all-takeaways")
                      setTimeout(() => setCopiedId(null), 2000)
                    }}
                  >
                    {copiedId === "all-takeaways" ? (
                      <Check className="h-3 w-3 mr-1" />
                    ) : (
                      <Copy className="h-3 w-3 mr-1" />
                    )}
                    Copy All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {submissions.map((sub) => (
                  <div key={sub.id} className="flex items-start justify-between bg-gray-50 p-3 rounded-md">
                    <div>
                      <span className="font-medium text-sm">{sub.participantName}</span>
                      <p className="text-sm text-gray-700 mt-1">"{sub.response}"</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(`${sub.participantName}: ${sub.response}`)
                        setCopiedId(sub.id)
                        setTimeout(() => setCopiedId(null), 2000)
                      }}
                    >
                      {copiedId === sub.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={copyCaseWorxNote}>
              {copiedId === "casewrox" ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
              Copy Full Note to CaseWorx
            </Button>
            <Button variant="outline" onClick={() => setShowSummary(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-2 text-center">
        <p className="text-xs text-gray-500">© 2025 DMS Clinical Services. All rights reserved.</p>
      </footer>
    </div>
  )
}
