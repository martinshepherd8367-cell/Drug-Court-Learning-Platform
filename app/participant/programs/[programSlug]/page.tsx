"use client"

import { useParams, useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { RoleNav } from "@/components/role-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, BookOpen, CheckCircle, Circle, Lock, ChevronRight } from "lucide-react"

export default function ParticipantProgramOverview() {
  const params = useParams()
  const router = useRouter()
  const { getProgramBySlug, currentUser, getEnrollmentsByParticipant } = useStore()

  const programSlug = params.programSlug as string
  const program = getProgramBySlug(programSlug)

  // Get enrollment for current participant
  const enrollments = currentUser ? getEnrollmentsByParticipant(currentUser.id) : []
  const enrollment = enrollments.find((e) => e.programId === program?.id)

  if (!program || !enrollment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <RoleNav />
        <main className="container mx-auto px-6 py-8 max-w-2xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Program Not Found</h1>
            <p className="text-gray-600 mb-4">You may not be enrolled in this program.</p>
            <Button onClick={() => router.push("/participant")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    )
  }

  // Sort sessions by sessionNumber
  const sortedSessions = [...program.sessions].sort((a, b) => a.sessionNumber - b.sessionNumber)

  const completedSessions = enrollment.currentSessionNumber - 1
  const progressPercent = program.totalSessions > 0 ? (completedSessions / program.totalSessions) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <RoleNav />

      <main className="container mx-auto px-6 py-8 max-w-2xl">
        {/* Back Button & Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/participant")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <h1 className="text-2xl font-bold text-gray-900">{program.name}</h1>
          <p className="text-gray-600 mt-1">{program.description}</p>
        </div>

        {/* Progress Card */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-lg font-semibold text-green-800">
                  Session {enrollment.currentSessionNumber} of {program.totalSessions}
                </p>
                <p className="text-sm text-green-700">
                  {completedSessions} session{completedSessions !== 1 ? "s" : ""} completed
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-700">{Math.round(progressPercent)}%</p>
                <p className="text-sm text-green-600">Complete</p>
              </div>
            </div>
            <Progress value={progressPercent} className="h-3" />
          </CardContent>
        </Card>

        {/* Sessions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              Sessions
            </CardTitle>
            <CardDescription>Click on your current session to view content</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedSessions.length > 0 ? (
              <div className="space-y-3">
                {sortedSessions.map((session) => {
                  const isCompleted = session.sessionNumber < enrollment.currentSessionNumber
                  const isCurrent = session.sessionNumber === enrollment.currentSessionNumber
                  const isLocked = session.sessionNumber > enrollment.currentSessionNumber

                  return (
                    <Card
                      key={session.id}
                      className={`transition-all ${
                        isLocked
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer hover:border-green-500 hover:shadow-md"
                      } ${isCurrent ? "border-green-500 border-2 bg-green-50" : ""}`}
                      onClick={() => {
                        if (!isLocked) {
                          router.push(`/participant/programs/${programSlug}/sessions/${session.sessionNumber}`)
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Status Icon */}
                          <div
                            className={`p-2 rounded-full flex-shrink-0 ${
                              isCompleted ? "bg-green-100" : isCurrent ? "bg-blue-100" : "bg-gray-100"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : isLocked ? (
                              <Lock className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Circle className={`h-5 w-5 ${isCurrent ? "text-blue-600" : "text-gray-400"}`} />
                            )}
                          </div>

                          {/* Session Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-500">Session {session.sessionNumber}</span>
                              {isCurrent && <Badge className="bg-blue-600">Current</Badge>}
                              {isCompleted && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  Done
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-semibold text-gray-900">{session.title}</h3>
                          </div>

                          {/* Arrow */}
                          {!isLocked && <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sessions available yet.</p>
              </div>
            )}
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
