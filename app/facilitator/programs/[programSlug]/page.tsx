"use client"

import { useParams, useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { RoleNav } from "@/components/role-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, BookOpen, Users, CheckCircle, Circle, Lock, ChevronRight } from "lucide-react"

export default function ProgramOverview() {
  const params = useParams()
  const router = useRouter()
  const { getProgramBySlug, getEnrollmentsByProgram, users } = useStore()

  const programSlug = params.programSlug as string
  const program = getProgramBySlug(programSlug)

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50">
        <RoleNav />
        <main className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Program Not Found</h1>
            <p className="text-gray-600 mb-4">The program you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/facilitator")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const enrollments = getEnrollmentsByProgram(program.id)
  const activeEnrollments = enrollments.filter((e) => e.status === "active")

  // Sort sessions by sessionNumber
  const sortedSessions = [...program.sessions].sort((a, b) => a.sessionNumber - b.sessionNumber)

  // Find current cohort session (lowest currentSessionNumber among active enrollments)
  const cohortCurrentSession =
    activeEnrollments.length > 0 ? Math.min(...activeEnrollments.map((e) => e.currentSessionNumber)) : 1

  const completedSessions = cohortCurrentSession - 1
  const progressPercent = program.totalSessions > 0 ? (completedSessions / program.totalSessions) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <RoleNav />

      <main className="container mx-auto px-6 py-8">
        {/* Back Button & Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/facilitator")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Programs
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{program.name}</h1>
              <p className="text-gray-600 mt-1">{program.description}</p>
            </div>
            {program.isLocked && (
              <Badge variant="secondary" className="gap-1">
                <Lock className="h-3 w-3" />
                Program Locked
              </Badge>
            )}
          </div>
        </div>

        {/* Progress Summary */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{program.totalSessions}</p>
                  <p className="text-sm text-gray-600">Total Sessions</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeEnrollments.length}</p>
                  <p className="text-sm text-gray-600">Active Participants</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedSessions}</p>
                  <p className="text-sm text-gray-600">Completed Sessions</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Program Progress</span>
                  <span className="font-medium">{Math.round(progressPercent)}%</span>
                </div>
                <Progress value={progressPercent} className="h-3" />
                <p className="text-xs text-gray-500 mt-1">
                  Session {cohortCurrentSession} of {program.totalSessions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sessions List */}
        <Card>
          <CardHeader>
            <CardTitle>Sessions</CardTitle>
            <CardDescription>
              Click on a session to open the facilitation console. Sessions are ordered by number.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sortedSessions.length > 0 ? (
              <div className="space-y-3">
                {sortedSessions.map((session) => {
                  const isCompleted = session.sessionNumber < cohortCurrentSession
                  const isCurrent = session.sessionNumber === cohortCurrentSession
                  const isLocked = program.isLocked && session.sessionNumber > cohortCurrentSession

                  return (
                    <Card
                      key={session.id}
                      className={`cursor-pointer transition-all ${
                        isLocked ? "opacity-50 cursor-not-allowed" : "hover:border-green-500 hover:shadow-md"
                      } ${isCurrent ? "border-green-500 border-2" : ""}`}
                      onClick={() => {
                        if (!isLocked) {
                          router.push(`/facilitator/programs/${programSlug}/sessions/${session.sessionNumber}`)
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Status Icon */}
                          <div
                            className={`p-2 rounded-full ${
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
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-500">Session {session.sessionNumber}</span>
                              {isCurrent && <Badge className="bg-blue-600">Current</Badge>}
                              {isCompleted && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  Completed
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-semibold text-gray-900">{session.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{session.purpose}</p>
                          </div>

                          {/* Arrow */}
                          {!isLocked && <ChevronRight className="h-5 w-5 text-gray-400" />}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sessions configured yet.</p>
                <p className="text-sm">Contact admin to set up session content.</p>
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
