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
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Play, Pause, CheckCircle } from "lucide-react"

export default function EnrollmentManagement() {
  const router = useRouter()
  const { users, programs, enrollments, updateEnrollment, addEnrollment } = useStore()

  const [showEnroll, setShowEnroll] = useState(false)
  const [selectedParticipant, setSelectedParticipant] = useState("")
  const [selectedProgram, setSelectedProgram] = useState("")

  const participants = users.filter((u) => u.role === "participant")

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
      addEnrollment({
        participantId: selectedParticipant,
        programId: selectedProgram,
        currentSessionNumber: 1,
        status: "active",
        startedAt: new Date().toISOString(),
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
    <div className="min-h-screen bg-gray-50">
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
        <Card>
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
                        <TableCell className="font-medium">{participant?.name || "Unknown"}</TableCell>
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

      {/* Footer */}
      <footer className="border-t border-gray-200 py-4 mt-8">
        <div className="container mx-auto px-6 text-center text-sm text-gray-500">
          © 2025 DMS Clinical Services. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
