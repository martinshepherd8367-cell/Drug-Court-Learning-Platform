"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { RoleNav } from "@/components/role-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
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
  Trash2,
  MessageSquare,
  AlertCircle
} from "lucide-react"
import type { User } from "@/lib/types"

export default function EnrollmentManagement() {
  const router = useRouter()
  const { currentUser, users, programs, enrollments, attendance, takeaways, updateEnrollment, removeEnrollment, addMessage, setEnrollments } = useStore()

  const [showEnroll, setShowEnroll] = useState(false)
  const [selectedParticipant, setSelectedParticipant] = useState("")
  const [selectedProgram, setSelectedProgram] = useState("")
  const [showParticipantDetail, setShowParticipantDetail] = useState(false)
  const [selectedParticipantDetail, setSelectedParticipantDetail] = useState<User | null>(null)
  const [selectedDay, setSelectedDay] = useState("Monday")
  const [selectedTime, setSelectedTime] = useState("10:00 AM")
  const [selectedFacilitator, setSelectedFacilitator] = useState("")
  const [selectedRoom, setSelectedRoom] = useState("A101")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const participants = users.filter((u) => u.role === "participant" && u.status === "active")

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

  const handleEnroll = async () => {
    if (selectedParticipant && selectedProgram && selectedFacilitator) {
      setBusy(true)
      setError(null)
      try {
        const program = programs.find((p) => p.id === selectedProgram)
        const facilitator = users.find((u) => u.id === selectedFacilitator)

        const classSchedule = {
          day: selectedDay,
          time: selectedTime,
          facilitatorId: selectedFacilitator,
          room: selectedRoom,
        }

        const res = await fetch("/api/admin/enrollments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            participantId: selectedParticipant,
            programId: selectedProgram,
            schedule: classSchedule,
            status: "active"
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Failed to enroll participant")
        }

        const newEnrollment = await res.json()
        setEnrollments([...enrollments, newEnrollment])

        if (newEnrollment.warning) {
          alert(newEnrollment.warning)
        }

        addMessage({
          senderId: currentUser?.id || "system",
          senderRole: currentUser?.role || "admin",
          recipientId: selectedParticipant,
          recipientRole: "participant",
          title: `Welcome to ${program?.name}!`,
          content: `You have been enrolled in ${program?.name}.\n\nClass Details:\n- Day: ${classSchedule.day}\n- Time: ${classSchedule.time}\n- Facilitator: ${facilitator?.name || "Facilitator"}\n- Room: ${classSchedule.room}\n\nYour first session starts soon. Check your calendar for the full schedule. Good luck!`,
          fromName: currentUser?.name || "Admin",
          readAt: null,
          createdAt: new Date().toISOString(),
        })

        setShowEnroll(false)
        setSelectedParticipant("")
        setSelectedProgram("")
        setSelectedFacilitator("")
      } catch (e: any) {
        setError(e.message)
      } finally {
        setBusy(false)
      }
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
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              if (confirm("Are you sure you want to unenroll this participant?")) {
                                removeEnrollment(enrollment.id)
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
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

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Day</Label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["9:00 AM", "10:00 AM", "10:30 AM", "1:00 PM", "4:00 PM", "5:30 PM", "6:00 PM", "7:00 PM"].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Facilitator</Label>
              <Select value={selectedFacilitator} onValueChange={setSelectedFacilitator}>
                <SelectTrigger>
                  <SelectValue placeholder="Select facilitator" />
                </SelectTrigger>
                <SelectContent>
                  {users.filter(u => u.role === 'facilitator').map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Room</Label>
              <Input value={selectedRoom} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedRoom(e.target.value)} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEnroll(false)} disabled={busy}>
              Cancel
            </Button>
            <Button
              onClick={handleEnroll}
              disabled={busy || !selectedParticipant || !selectedProgram || !selectedFacilitator}
              className="bg-green-600 hover:bg-green-700"
            >
              {busy ? "Enrolling..." : "Enroll"}
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

              {/* Attendance History Section */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Attendance History
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(() => {
                    const myAttendance = attendance.filter(a => a.participantId === selectedParticipantDetail.id);
                    if (myAttendance.length === 0) return <p className="text-gray-500 text-sm italic">No attendance records found</p>;

                    return myAttendance.sort((a, b) => b.sessionId.localeCompare(a.sessionId)).map((record) => {
                      const prog = programs.find(p => record.sessionId.startsWith(p.id));
                      return (
                        <div key={record.id} className="flex items-center justify-between bg-white border p-2 rounded text-sm">
                          <div>
                            <span className="font-medium">{prog?.name || "Program"}</span>
                            <span className="text-gray-500 ml-2">Session {record.sessionId.split('-').pop()}</span>
                          </div>
                          <Badge variant={record.status === "present" ? "default" : "outline"}
                            className={record.status === "present" ? "bg-green-600" : record.status === "absent" ? "text-red-600 border-red-600" : "text-amber-600 border-amber-600"}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </Badge>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Takeaways Section */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Facilitator Takeaways
                </h3>
                <div className="space-y-2">
                  {(() => {
                    const myTakeaways = takeaways.filter(t => t.participantId === selectedParticipantDetail.id);
                    if (myTakeaways.length === 0) return <p className="text-gray-500 text-sm italic">No takeaways found</p>;

                    return myTakeaways.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((takeaway) => {
                      const creator = users.find(u => u.id === takeaway.createdBy);
                      return (
                        <div key={takeaway.id} className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                          <p className="text-sm text-gray-800 mb-1">{takeaway.content}</p>
                          <div className="flex justify-between items-center text-[10px] text-gray-500">
                            <span>From: {creator?.name || "Facilitator"}</span>
                            <span>{new Date(takeaway.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      );
                    });
                  })()}
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
