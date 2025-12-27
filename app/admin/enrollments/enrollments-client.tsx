"use client"

import AdminCreateEnrollment from "@/components/admin-create-enrollment"
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
            <div>
               <AdminCreateEnrollment onEnrollmentCreated={console.log} />
            </div>
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
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Next Session</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell className="font-medium">
                        <button 
                          onClick={() => handleParticipantClick({ id: enrollment.userId, name: enrollment.participantName || "Unknown", email: "user@example.com", role: "participant", createdAt: new Date(), lastLogin: new Date() } as any)} 
                          className="hover:underline text-left"
                        >
                          {enrollment.participantName || enrollment.userId}
                        </button>
                      </TableCell>
                      <TableCell>{enrollment.programName || enrollment.programId}</TableCell>
                      <TableCell>{getStatusBadge(enrollment.status)}</TableCell>
                      <TableCell>
                        <div className="w-[100px]">
                          <div className="flex justify-between mb-1 text-xs">
                            <span>{enrollment.progress}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{enrollment.currentSession}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {enrollment.status === "active" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(enrollment.id, "paused")}
                            >
                              <Pause className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(enrollment.id, "active")}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          {/* More actions can go here */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
    </div>
  )
}
