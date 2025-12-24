"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { RoleNav } from "@/components/role-nav"
import { AuditPanel } from "@/components/audit-panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Clock, CheckCircle, Send, BookOpen, FileText, Loader2 } from "lucide-react"

export default function ParticipantSessionView() {
  const params = useParams()
  const router = useRouter()
  const {
    getProgramBySlug,
    getSessionByNumber,
    currentUser,
    getEnrollmentsByParticipant,
    getActiveActivityRun,
    submitResponse,
    addJournalEntry,
    addHomeworkSubmission,
    submitTakeaways,
    getTakeaways,
  } = useStore()

  const programSlug = params.programSlug as string
  const sessionNumber = Number.parseInt(params.sessionNumber as string)

  const program = getProgramBySlug(programSlug)
  const session = getSessionByNumber(programSlug, sessionNumber)

  // Get enrollment
  const enrollments = currentUser ? getEnrollmentsByParticipant(currentUser.id) : []
  const enrollment = enrollments.find((e) => e.programId === program?.id)

  // State
  const [activityAnswers, setActivityAnswers] = useState<Record<string, string>>({})
  const [submittingActivity, setSubmittingActivity] = useState(false)
  const [activitySubmitted, setActivitySubmitted] = useState(false)
  const [homeworkContent, setHomeworkContent] = useState("")
  const [submittingHomework, setSubmittingHomework] = useState(false)
  const [homeworkSubmitted, setHomeworkSubmitted] = useState(false)
  const [journalContent, setJournalContent] = useState("")
  const [submittingJournal, setSubmittingJournal] = useState(false)
  const [journalSubmitted, setJournalSubmitted] = useState(false)
  const [takeawayContent, setTakeawayContent] = useState("")
  const [submittingTakeaway, setSubmittingTakeaway] = useState(false)
  const [takeawaySubmitted, setTakeawaySubmitted] = useState(false)
  const [lastTakeawayTime, setLastTakeawayTime] = useState<string | null>(null)

  // Load existing takeaways
  const existingTakeaways = program ? getTakeaways(program.id, sessionNumber) : []
  const myTakeaway = currentUser ? existingTakeaways.find(t => t.participantId === currentUser.id) : null

  // Load initial state
  if (myTakeaway && !takeawaySubmitted && !takeawayContent) {
    setTakeawayContent(myTakeaway.text)
    setTakeawaySubmitted(true)
    setLastTakeawayTime(myTakeaway.submittedAt)
  }

  // Get active activity run
  const activeActivityRun = session ? getActiveActivityRun(session.id) : undefined
  const activeActivity = activeActivityRun
    ? session?.activityTemplates.find((a) => a.id === activeActivityRun.activityTemplateId)
    : undefined

  if (!program || !session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <RoleNav />
        <main className="container mx-auto px-6 py-8 max-w-2xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Session Not Found</h1>
            <p className="text-gray-600 mb-4">This session does not exist.</p>
            <Button onClick={() => router.push("/participant")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true"

  // If not enrolled and NOT in dev mode, block access
  if (!enrollment && !isDev) {
    return (
      <div className="min-h-screen bg-gray-50">
        <RoleNav />
        <main className="container mx-auto px-6 py-8 max-w-2xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Not Enrolled</h1>
            <p className="text-gray-600 mb-4">You are not enrolled in this program.</p>
            <Button onClick={() => router.push("/participant")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const progressPercent = program.totalSessions > 0 ? ((sessionNumber - 1) / program.totalSessions) * 100 : 0

  // Handle activity submission
  const handleSubmitActivity = async () => {
    if (!activeActivityRun || !currentUser) return
    setSubmittingActivity(true)

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    submitResponse(activeActivityRun.id, currentUser.id, activityAnswers)
    setSubmittingActivity(false)
    setActivitySubmitted(true)
  }

  // Handle homework submission
  const handleSubmitHomework = async () => {
    if (!currentUser || !session) return
    setSubmittingHomework(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    addHomeworkSubmission({
      participantId: currentUser.id,
      sessionId: session.id,
      content: homeworkContent,
      status: "pending",
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      feedback: null,
    })
    setSubmittingHomework(false)
    setHomeworkSubmitted(true)
  }

  // Handle journal submission
  const handleSubmitJournal = async () => {
    if (!currentUser || !program) return
    setSubmittingJournal(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    addJournalEntry({
      participantId: currentUser.id,
      programId: program.id,
      sessionNumber: sessionNumber,
      content: journalContent,
      submittedAt: new Date().toISOString(),
    })
    setSubmittingJournal(false)
    setJournalSubmitted(true)
  }

  // Handle takeaway submission
  const handleSubmitTakeaway = async () => {
    if (!currentUser || !program) return
    setSubmittingTakeaway(true)
    await new Promise((resolve) => setTimeout(resolve, 500)) // fast

    submitTakeaways(currentUser.id, program.id, sessionNumber, takeawayContent)

    setSubmittingTakeaway(false)
    setTakeawaySubmitted(true)
    setLastTakeawayTime(new Date().toISOString())
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RoleNav />

      <main className="container mx-auto px-6 py-8 max-w-2xl">
        <AuditPanel program={program} session={session} />

        {/* Breadcrumb & Header */}
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push(`/participant/programs/${programSlug}`)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {program.name}
          </Button>

          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{program.name}</Badge>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">
              Session {sessionNumber} of {program.totalSessions}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">{session.title}</h1>

          <div className="mt-4">
            <Progress value={progressPercent} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">{Math.round(progressPercent)}% of program complete</p>
          </div>
        </div>

        {/* NOW Card - Activity or Waiting */}
        <Card className="mb-6 border-2 border-green-500">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              NOW
            </CardTitle>
            <CardDescription>
              {activeActivity ? "Complete the activity below" : "Your facilitator will guide you through this session"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {activeActivity && !activitySubmitted ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{activeActivity.title}</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{activeActivity.instructions}</p>
                </div>

                <div className="space-y-4">
                  {activeActivity.questions.map((question) => (
                    <div key={question.id} className="space-y-2">
                      <Label className="text-base">{question.text}</Label>

                      {question.type === "text" && (
                        <Textarea
                          value={activityAnswers[question.id] || ""}
                          onChange={(e) =>
                            setActivityAnswers({
                              ...activityAnswers,
                              [question.id]: e.target.value,
                            })
                          }
                          placeholder="Type your answer here..."
                          className="min-h-[100px]"
                        />
                      )}

                      {question.type === "multiple_choice" && question.options && (
                        <RadioGroup
                          value={activityAnswers[question.id] || ""}
                          onValueChange={(value) =>
                            setActivityAnswers({
                              ...activityAnswers,
                              [question.id]: value,
                            })
                          }
                        >
                          {question.options.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                              <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}

                      {question.type === "scale" && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={activityAnswers[question.id] || ""}
                            onChange={(e) =>
                              setActivityAnswers({
                                ...activityAnswers,
                                [question.id]: e.target.value,
                              })
                            }
                            className="w-20"
                          />
                          <span className="text-sm text-gray-500">(1-10)</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleSubmitActivity}
                  disabled={submittingActivity}
                  className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
                >
                  {submittingActivity ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Submit Activity
                    </>
                  )}
                </Button>
              </div>
            ) : activitySubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-700 mb-2">Activity Submitted!</h3>
                <p className="text-gray-600">Great job! Wait for your facilitator to continue.</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Waiting for Activity</h3>
                <p className="text-gray-600 mb-4">Your facilitator will launch an activity when ready.</p>

                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <p className="text-sm font-medium text-gray-700 mb-2">While you wait, take a breath:</p>
                  <p className="text-sm text-gray-600 italic">
                    "Recovery is a process of learning who you are and where you're headed. The first step is
                    understanding your current stage of change."
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* IN-CLASS WORK / TAKEAWAYS (V1 Requirement) */}
        <Card className="mb-6 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              In-Class Work / Takeaways
            </CardTitle>
            <CardDescription>
              Record your key takeaways or complete in-class exercises here. You can update this at any time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={takeawayContent}
                onChange={(e) => {
                  setTakeawayContent(e.target.value)
                  setTakeawaySubmitted(false) // Allow resubmit
                }}
                placeholder="Type your takeaways, notes, or answers here..."
                className="min-h-[150px]"
              />

              <div className="flex items-center justify-between">
                {lastTakeawayTime && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Submitted at {new Date(lastTakeawayTime).toLocaleTimeString()}
                  </span>
                )}
                <Button
                  onClick={handleSubmitTakeaway}
                  disabled={submittingTakeaway || !takeawayContent.trim()}
                  className="ml-auto"
                >
                  {submittingTakeaway ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Takeaways"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AFTER CLASS: Homework Card */}
        {session.homeworkTemplate && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                AFTER CLASS: Homework
              </CardTitle>
              <CardDescription>{session.homeworkTemplate.dueDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              {!homeworkSubmitted ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">{session.homeworkTemplate.title}</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                      {session.homeworkTemplate.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <Textarea
                    value={homeworkContent}
                    onChange={(e) => setHomeworkContent(e.target.value)}
                    placeholder="Write your homework response here..."
                    className="min-h-[150px]"
                  />

                  <Button
                    onClick={handleSubmitHomework}
                    disabled={submittingHomework || !homeworkContent.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {submittingHomework ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Homework
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-green-700">Homework Submitted!</h4>
                  <p className="text-sm text-gray-600">Your facilitator will review it soon.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Daily Journal Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              Daily Journal
            </CardTitle>
            <CardDescription>Reflect on today's session and your progress</CardDescription>
          </CardHeader>
          <CardContent>
            {!journalSubmitted ? (
              <div className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-3 text-sm">
                  <p className="font-medium text-purple-800 mb-1">Today's Prompt:</p>
                  <p className="text-purple-700">
                    What is one thing you learned today that you can apply to your recovery journey?
                  </p>
                </div>

                <Textarea
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  placeholder="Write your journal entry here..."
                  className="min-h-[120px]"
                />

                <Button
                  onClick={handleSubmitJournal}
                  disabled={submittingJournal || !journalContent.trim()}
                  variant="outline"
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 bg-transparent"
                >
                  {submittingJournal ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Save Journal Entry
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-purple-700">Journal Saved!</h4>
                <p className="text-sm text-gray-600">Keep up the great reflection work.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Session Objectives (collapsed reference) */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-base">Session Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {session.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{obj}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-4 mt-8">
        <div className="container mx-auto px-6 text-center text-sm text-gray-500">
          © 2025 DMS Clinical Services. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
