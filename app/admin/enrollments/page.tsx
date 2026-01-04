"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { RoleNav } from "@/components/role-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  Plus,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  CheckCircle,
  UserIcon,
  BookOpen,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
} from "lucide-react"
import type { User } from "@/lib/types"

export default function EnrollmentManagement() {
  const router = useRouter()
  const { users, programs, enrollments, updateEnrollment, addEnrollment, addMessage } = useStore()

  const [showEnroll, setShowEnroll] = useState(false)
  const [selectedParticipant, setSelectedParticipant] = useState("")
  const [selectedProgram, setSelectedProgram] = useState("")
  const [showParticipantDetail, setShowParticipantDetail] = useState(false)
  const [selectedParticipantDetail, setSelectedParticipantDetail] = useState<User | null>(null)

  const participants = users.filter((u) => u.role === "participant")

  const getParticipantEnrollments = (participantId: string) => {
    return enrollments.filter((e) => e.participantId === participantId)
  }

  const getRemainingClasses = (enrollment: (typeof enrollments)[0]) => {
    const program = programs.find((p) => p.id === enrollment.programId)
    if (!program) return []

    const remaining = []
    for (let i = enrollment.currentSessionNumber; i <= program.totalSessions; i++) {
      const session = program.sessions.find((s) => s.sessionNumber === i)
      remaining.push({
        sessionNumber: i,
        title: session?.title || `Session ${i}`,
        programName: program.name,
      })
    }
    return remaining
  }

  const handleParticipantClick = (participant: User) => {
    setSelectedParticipantDetail(participant)
    setShowParticipantDetail(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-600 gap-1">
            <Play className="h-3 w-3" />
            Active
          </Badge>
        )
      case "paused":
        return (
          <Badge variant="secondary" className="gap-1">
            <Pause className="h-3 w-3" />
            Paused
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-blue-600 gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleEnroll = () => {
    if (selectedParticipant && selectedProgram) {
      const program = programs.find((p) => p.id === selectedProgram)
      const participant = users.find((u) => u.id === selectedParticipant)

      // Mock class schedule info (in real app, this would come from a schedule database)
      const classSchedule = {
        day: "Monday",
        time: "10:00 AM",
        facilitator: "Sarah Johnson",
        room: "A101",
      }

      // Create enrollment
      addEnrollment({
        participantId: selectedParticipant,
        programId: selectedProgram,
        currentSessionNumber: 1,
        status: "active",
        startedAt: new Date().toISOString(),
      })

      addMessage({
        participantId: selectedParticipant,
        title: `Welcome to ${program?.name}!`,
        content: `You have been enrolled in ${program?.name}.\n\nClass Details:\n- Day: ${classSchedule.day}\n- Time: ${classSchedule.time}\n- Facilitator: ${classSchedule.facilitator}\n- Room: ${classSchedule.room}\n\nYour first session starts soon. Check your calendar for the full schedule. Good luck!`,
        fromName: "Admin",
        readAt: null,
        createdAt: new Date().toISOString(),
      })

      setShowEnroll(false)
      setSelectedParticipant("")
      setSelectedProgram("")
    }
  }

  const handleMoveSession = (enrollmentId: string, direction: "forward" | "back") => {
    const enrollment = enrollments.find((e) => e.id === enrollmentId)
    if (!enrollment) return

    const program = programs.find((p) => p.id === enrollment.programId)
    if (!program) return

    const newSession =
      direction === "forward"
        ? Math.min(enrollment.currentSessionNumber + 1, program.totalSessions)
        : Math.max(enrollment.currentSessionNumber - 1, 1)

    updateEnrollment(enrollmentId, { currentSessionNumber: newSession })
  }

  const handleToggleStatus = (enrollmentId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active"
    updateEnrollment(enrollmentId, { status: newStatus as any })
  }

  return (
    <div className="min-h-screen">
      <RoleNav />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/admin")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Enrollment Management</h1>
              <p className="text-gray-600 mt-1">Manage participant enrollments and progress</p>
            </div>
            <Button onClick={() => setShowEnroll(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Enroll Participant
            </Button>
          </div>
        </div>

        {/* Enrollments Table */}
        <Card className="card-transparent">
          <CardHeader>
            <CardTitle>All Enrollments</CardTitle>
            <CardDescription>{enrollments.length} total enrollments</CardDescription>
          </CardHeader>
          <CardContent>
            {enrollments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.map((enrollment) => {
                    const participant = users.find((u) => u.id === enrollment.participantId)
                    const program = programs.find((p) => p.id === enrollment.programId)

                    return (
                      <TableRow key={enrollment.id}>
                        <TableCell className="font-medium">
                          <button
                            onClick={() => participant && handleParticipantClick(participant)}
                            className="text-green-700 hover:text-green-900 hover:underline font-medium text-left"
                          >
                            {participant?.name || "Unknown"}
                          </button>
                        </TableCell>
                        <TableCell>{program?.name || "Unknown"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              Session {enrollment.currentSessionNumber} of {program?.totalSessions || "?"}
                            </span>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 bg-transparent"
                                onClick={() => handleMoveSession(enrollment.id, "back")}
                                disabled={enrollment.currentSessionNumber <= 1}
                              >
                                <ChevronLeft className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 bg-transparent"
                                onClick={() => handleMoveSession(enrollment.id, "forward")}
                                disabled={enrollment.currentSessionNumber >= (program?.totalSessions || 1)}
                              >
                                <ChevronRight className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(enrollment.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(enrollment.id, enrollment.status)}
                          >
                            {enrollment.status === "active" ? (
                              <>
                                <Pause className="h-4 w-4 mr-1" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-1" />
                                Resume
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No enrollments yet.</p>
                <p className="text-sm">Enroll participants in programs to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Enroll Dialog */}
      <Dialog open={showEnroll} onOpenChange={setShowEnroll}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enroll Participant</DialogTitle>
            <DialogDescription>Add a participant to a program</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Participant</Label>
              <Select value={selectedParticipant} onValueChange={setSelectedParticipant}>
                <SelectTrigger>
                  <SelectValue placeholder="Select participant" />
                </SelectTrigger>
                <SelectContent>
                  {participants.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Program</Label>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.totalSessions} sessions)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEnroll(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEnroll}
              disabled={!selectedParticipant || !selectedProgram}
              className="bg-green-600 hover:bg-green-700"
            >
              Enroll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showParticipantDetail} onOpenChange={setShowParticipantDetail}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-green-600" />
              {selectedParticipantDetail?.name}
            </DialogTitle>
            <DialogDescription>Participant profile and enrollment details</DialogDescription>
          </DialogHeader>

          {selectedParticipantDetail && (
            <div className="space-y-6 py-4">
              {/* Demographics Section */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Demographic Information
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium">{selectedParticipantDetail.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium">{selectedParticipantDetail.phone || "(555) 123-4567"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Date of Birth</p>
                      <p className="text-sm font-medium">{selectedParticipantDetail.dateOfBirth || "01/15/1990"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-sm font-medium">
                        {selectedParticipantDetail.address || "123 Main St, City, ST 12345"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Emergency Contact</p>
                      <p className="text-sm font-medium">{selectedParticipantDetail.emergencyContact || "Jane Doe"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Emergency Phone</p>
                      <p className="text-sm font-medium">
                        {selectedParticipantDetail.emergencyPhone || "(555) 987-6543"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Case Number</p>
                      <p className="text-sm font-medium">{selectedParticipantDetail.caseNumber || "AC-2024-001234"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Probation Officer</p>
                      <p className="text-sm font-medium">
                        {selectedParticipantDetail.probationOfficer || "Officer Smith"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Enrollments Section */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Currently Enrolled Classes
                </h3>
                <div className="space-y-2">
                  {getParticipantEnrollments(selectedParticipantDetail.id).length > 0 ? (
                    getParticipantEnrollments(selectedParticipantDetail.id).map((enrollment) => {
                      const program = programs.find((p) => p.id === enrollment.programId)
                      return (
                        <div
                          key={enrollment.id}
                          className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200"
                        >
                          <div>
                            <p className="font-medium text-green-800">{program?.name}</p>
                            <p className="text-sm text-green-600">
                              Session {enrollment.currentSessionNumber} of {program?.totalSessions}
                            </p>
                          </div>
                          {getStatusBadge(enrollment.status)}
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-gray-500 text-sm italic">Not currently enrolled in any classes</p>
                  )}
                </div>
              </div>

              {/* Remaining Classes Section */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Classes Remaining to Complete Program
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {getParticipantEnrollments(selectedParticipantDetail.id).length > 0 ? (
                    getParticipantEnrollments(selectedParticipantDetail.id).map((enrollment) => {
                      const remaining = getRemainingClasses(enrollment)
                      const program = programs.find((p) => p.id === enrollment.programId)

                      return (
                        <div key={enrollment.id} className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">{program?.name}</p>
                          {remaining.length > 0 ? (
                            <div className="grid grid-cols-1 gap-1">
                              {remaining.map((session, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 bg-amber-50 p-2 rounded border border-amber-200"
                                >
                                  <span className="bg-amber-200 text-amber-800 text-xs font-medium px-2 py-0.5 rounded">
                                    {session.sessionNumber}
                                  </span>
                                  <span className="text-sm text-gray-700">{session.title}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-green-600 text-sm font-medium">Program Completed!</p>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-gray-500 text-sm italic">No active enrollments</p>
                  )}
                </div>
              </div>

              {/* Notes Section */}
              {selectedParticipantDetail.notes && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedParticipantDetail.notes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowParticipantDetail(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="footer-transparent border-t border-gray-200 py-4 mt-8">
        <div className="container mx-auto px-6 text-center text-sm text-gray-700">
          © 2025 DMS Clinical Services. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
