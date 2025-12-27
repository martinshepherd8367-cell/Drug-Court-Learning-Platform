"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

interface Enrollment {
  id: string
  userId: string // Mapped from participantId if needed
  programId: string
  status: string
  currentSession: number // Mapped from currentSessionNumber if needed
  progress: number
  programName?: string
  participantName?: string
  totalSessions?: number
}

interface Program {
  id: string
  title: string
  totalSessions: number
  sessions?: any[]
}

interface Props {
  initialEnrollments: Enrollment[]
  allUsers: User[]
  allPrograms: Program[]
  loadError?: string | null
}

export default function EnrollmentsClient({ initialEnrollments, allUsers, allPrograms, loadError }: Props) {
  const router = useRouter()
  // const [enrollments, setEnrollments] = useState(initialEnrollments) // No mutation for now
  const enrollments = initialEnrollments;

  const [showEnroll, setShowEnroll] = useState(false)
  const [selectedParticipant, setSelectedParticipant] = useState("")
  const [selectedProgram, setSelectedProgram] = useState("")
  const [showParticipantDetail, setShowParticipantDetail] = useState(false)
  const [selectedParticipantDetail, setSelectedParticipantDetail] = useState<User | null>(null)

  const participants = allUsers.filter((u) => u.role === "participant")

  const getParticipantEnrollments = (userId: string) => {
    return enrollments.filter((e) => e.userId === userId)
  }

  const getRemainingClasses = (enrollment: Enrollment) => {
    const program = allPrograms.find((p) => p.id === enrollment.programId)
    if (!program) return []

    const remaining = []
    const current = enrollment.currentSession || 1;
    for (let i = current; i <= program.totalSessions; i++) {
      // Mock session titles if not loaded deeply
      remaining.push({
        sessionNumber: i,
        title: `Session ${i}`,
        programName: program.title,
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
     alert("Enrollment creation via Firestore is not yet implemented in this view.");
     setShowEnroll(false);
  }

  // stub actions
  const handleMoveSession = (id: string, dir: string) => {}
  const handleToggleStatus = (id: string, status: string) => {}

  if (loadError) {
     return <div className="p-8 text-red-600">Error: {loadError}</div>
  }

  return (
    <div className="min-h-screen"> 

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
                    const participant = allUsers.find((u) => u.id === enrollment.userId)
                    
                    return (
                      <TableRow key={enrollment.id}>
                        <TableCell className="font-medium">
                          <button
                            onClick={() => participant && handleParticipantClick(participant)}
                            className="text-green-700 hover:text-green-900 hover:underline font-medium text-left"
                          >
                            {enrollment.participantName || participant?.name || enrollment.userId}
                          </button>
                        </TableCell>
                        <TableCell>{enrollment.programName || enrollment.programId}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              Session {enrollment.currentSession} of {enrollment.totalSessions || "?"}
                            </span>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 bg-transparent"
                                disabled
                              >
                                <ChevronLeft className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 bg-transparent"
                                disabled
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
                            disabled
                          >
                             Updates Disabled
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
                  {allPrograms.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title} ({p.totalSessions} sessions)
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
                  {/* Reuse basic display */}
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium">{selectedParticipantDetail.email}</p>
                    </div>
                  </div>
                  {/* Assume other fields might be in user object or fallback */}
                  <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm font-medium">{selectedParticipantDetail.phone || "(555) 123-4567"}</p>
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
                      const program = allPrograms.find((p) => p.id === enrollment.programId)
                      return (
                        <div
                          key={enrollment.id}
                          className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200"
                        >
                          <div>
                            <p className="font-medium text-green-800">{program?.title || enrollment.programId}</p>
                            <p className="text-sm text-green-600">
                              Session {enrollment.currentSession} of {program?.totalSessions}
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
                      const program = allPrograms.find((p) => p.id === enrollment.programId)

                      return (
                        <div key={enrollment.id} className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">{program?.title}</p>
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

            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowParticipantDetail(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
