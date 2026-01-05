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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, FileBarChart, User, BookOpen, Copy, CheckCircle, X, Scale, Sparkles, Save, History, AlertCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

export default function ReportsPage() {
  const router = useRouter()
  const { users, programs, enrollments, attendance, courts } = useStore()

  const [reportType, setReportType] = useState<"participant" | "program" | "court_prep">("participant")
  const [selectedParticipant, setSelectedParticipant] = useState("")
  const [selectedProgram, setSelectedProgram] = useState("")
  const [selectedCourt, setSelectedCourt] = useState("")
  const [copiedNotes, setCopiedNotes] = useState<string[]>([])

  const [isGenerating, setIsGenerating] = useState(false)
  const [pendingSnapshot, setPendingSnapshot] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const participants = users.filter((u) => u.role === "participant")

  // Generate participant report data
  const getParticipantReport = () => {
    if (!selectedParticipant) return null

    const participantEnrollments = enrollments.filter((e) => e.participantId === selectedParticipant)
    const participantAttendance = attendance.filter((a) => a.participantId === selectedParticipant)

    return {
      enrollments: participantEnrollments.map((e) => {
        const program = programs.find((p) => p.id === e.programId)
        const sessions = program?.sessions || []
        const attendedSessions = participantAttendance.filter((a) =>
          sessions.some((s) => s.id === a.sessionId && a.attended),
        )

        return {
          program: program?.name || "Unknown",
          currentSession: e.currentSessionNumber,
          totalSessions: program?.totalSessions || 0,
          attended: attendedSessions.length,
          status: e.status,
          sessions: sessions.slice(0, e.currentSessionNumber).map((s) => {
            const att = participantAttendance.find((a) => a.sessionId === s.id)
            return {
              number: s.sessionNumber,
              title: s.title,
              attended: att?.attended || false,
              caseworxNote: s.caseworxNoteTemplate,
            }
          }),
        }
      }),
    }
  }

  // Generate program report data
  const getProgramReport = () => {
    if (!selectedProgram) return null

    const program = programs.find((p) => p.id === selectedProgram)
    if (!program) return null

    const programEnrollments = enrollments.filter((e) => e.programId === selectedProgram)

    return {
      name: program.name,
      totalSessions: program.totalSessions,
      enrolledCount: programEnrollments.length,
      activeCount: programEnrollments.filter((e) => e.status === "active").length,
      completedCount: programEnrollments.filter((e) => e.status === "completed").length,
      avgProgress:
        programEnrollments.length > 0
          ? programEnrollments.reduce((sum, e) => sum + e.currentSessionNumber, 0) / programEnrollments.length
          : 0,
    }
  }

  const handleCopyNote = (sessionId: string, note: string) => {
    navigator.clipboard.writeText(note)
    setCopiedNotes([...copiedNotes, sessionId])
    setTimeout(() => {
      setCopiedNotes(copiedNotes.filter((id) => id !== sessionId))
    }, 2000)
  }

  const handleGenerateSnapshot = async () => {
    if (!selectedCourt) return
    setIsGenerating(true)
    setSaveSuccess(false)
    try {
      const res = await fetch("/api/admin/reports/prep/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courtId: selectedCourt })
      })
      const data = await res.json()
      if (res.ok) {
        setPendingSnapshot(data)
      } else {
        alert(data.error || "Generation failed")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveSnapshot = async () => {
    if (!pendingSnapshot) return
    setIsSaving(true)
    try {
      const res = await fetch("/api/admin/reports/prep/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingSnapshot)
      })
      if (res.ok) {
        setSaveSuccess(true)
        setPendingSnapshot(null)
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        const data = await res.json()
        alert(data.error || "Save failed")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSaving(false)
    }
  }

  const updateApprovedContent = (participantId: string, field: string, value: string) => {
    if (!pendingSnapshot) return
    setPendingSnapshot({
      ...pendingSnapshot,
      approvedContent: {
        ...pendingSnapshot.approvedContent,
        [participantId]: {
          ...pendingSnapshot.approvedContent[participantId],
          [field]: value
        }
      }
    })
  }

  const participantReport = getParticipantReport()
  const programReport = getProgramReport()

  return (
    <div className="min-h-screen bg-gray-50">
      <RoleNav />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/admin")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate participant and program reports</p>
        </div>

        {/* Report Type Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
            <CardDescription>Select report type and filters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select value={reportType} onValueChange={(v: any) => setReportType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="participant">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Participant Report
                      </div>
                    </SelectItem>
                    <SelectItem value="program">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Program Delivery Report
                      </div>
                    </SelectItem>
                    <SelectItem value="court_prep">
                      <div className="flex items-center gap-2">
                        <Scale className="h-4 w-4" />
                        Court Prep Snapshot
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {reportType === "participant" && (
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
              )}

              {reportType === "program" && (
                <div className="space-y-2">
                  <Label>Program</Label>
                  <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {reportType === "court_prep" && (
                <div className="space-y-2">
                  <Label>Court</Label>
                  <div className="flex gap-2">
                    <Select value={selectedCourt} onValueChange={setSelectedCourt}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select court" />
                      </SelectTrigger>
                      <SelectContent>
                        {courts.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleGenerateSnapshot} disabled={!selectedCourt || isGenerating}>
                      {isGenerating ? "Processing..." : "Generate"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Participant Report */}
        {reportType === "participant" && participantReport && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Participant Report: {participants.find((p) => p.id === selectedParticipant)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {participantReport.enrollments.length > 0 ? (
                <div className="space-y-6">
                  {participantReport.enrollments.map((enrollment, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{enrollment.program}</h3>
                          <p className="text-sm text-gray-600">
                            Session {enrollment.currentSession} of {enrollment.totalSessions} • {enrollment.attended}{" "}
                            attended
                          </p>
                        </div>
                        <Badge
                          className={
                            enrollment.status === "active"
                              ? "bg-green-600"
                              : enrollment.status === "completed"
                                ? "bg-blue-600"
                                : ""
                          }
                        >
                          {enrollment.status}
                        </Badge>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-16">#</TableHead>
                            <TableHead>Session</TableHead>
                            <TableHead>Attendance</TableHead>
                            <TableHead className="text-right">CaseWorx Note</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {enrollment.sessions.map((session) => (
                            <TableRow key={session.number}>
                              <TableCell>{session.number}</TableCell>
                              <TableCell>{session.title}</TableCell>
                              <TableCell>
                                {session.attended ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                  <X className="h-5 w-5 text-red-500" />
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCopyNote(`${idx}-${session.number}`, session.caseworxNote)}
                                >
                                  <Copy className="h-4 w-4 mr-1" />
                                  {copiedNotes.includes(`${idx}-${session.number}`) ? "Copied!" : "Copy"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No enrollments found for this participant.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Program Report */}
        {reportType === "program" && programReport && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Program Delivery Report: {programReport.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-gray-900">{programReport.totalSessions}</p>
                  <p className="text-sm text-gray-600">Total Sessions</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">{programReport.activeCount}</p>
                  <p className="text-sm text-gray-600">Active Enrollments</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">{programReport.completedCount}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">{programReport.avgProgress.toFixed(1)}</p>
                  <p className="text-sm text-gray-600">Avg. Session Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Court Prep Snapshot Preview */}
        {reportType === "court_prep" && pendingSnapshot && (
          <div className="space-y-6">
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2 text-blue-900">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    Court Prep Preview: {courts.find(c => c.id === selectedCourt)?.name}
                  </CardTitle>
                  <CardDescription className="text-blue-700/80">
                    Snapshot retrieval period: Since last snapshot. Review and edit recommendations before saving.
                  </CardDescription>
                </div>
                <Button onClick={handleSaveSnapshot} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                  {isSaving ? "Saving..." : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Immutable Snapshot
                    </>
                  )}
                </Button>
              </CardHeader>
            </Card>

            <div className="grid gap-6">
              {pendingSnapshot.snapshotData.participants.map((p: any) => {
                const content = pendingSnapshot.approvedContent[p.id];
                const attendance = pendingSnapshot.snapshotData.activity.attendance.filter((a: any) => a.participantId === p.id);
                const absences = attendance.filter((a: any) => a.status === "absent").length;

                return (
                  <Card key={p.id} className="overflow-hidden">
                    <div className="flex">
                      <div className="w-1/3 border-r bg-gray-50/50 p-6 space-y-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{p.name}</h3>
                          <p className="text-xs text-gray-500">{p.email}</p>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase text-gray-400 font-bold">Activity Since Last Snapshot</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white p-2 border rounded text-center">
                              <div className="text-lg font-bold text-blue-600">{attendance.length}</div>
                              <div className="text-[10px] text-gray-500">Events</div>
                            </div>
                            <div className="bg-white p-2 border rounded text-center">
                              <div className="text-lg font-bold text-red-600">{absences}</div>
                              <div className="text-[10px] text-gray-500">Absences</div>
                            </div>
                          </div>
                        </div>

                        {attendance.length > 0 && (
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-gray-400 font-bold">Latest Attendance</Label>
                            <div className="space-y-1">
                              {attendance.slice(-3).map((a: any, i: number) => (
                                <div key={i} className="flex items-center justify-between text-[10px] p-1 bg-white rounded border">
                                  <span className="truncate max-w-[80px]">{a.sessionId}</span>
                                  <Badge variant={a.status === 'present' ? 'default' : 'outline'} className="text-[8px] h-4 py-0">
                                    {(a.status || 'ABSENT').toUpperCase()}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 p-6 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-bold flex items-center gap-1 text-gray-700">
                                <Sparkles className="h-3 w-3 text-blue-500" />
                                Suggested Takeaway
                              </Label>
                            </div>
                            <Textarea
                              value={content?.suggestedTakeaway || ""}
                              onChange={(e) => updateApprovedContent(p.id, 'suggestedTakeaway', e.target.value)}
                              className="text-sm min-h-[80px] bg-blue-50/10 border-blue-100"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-bold flex items-center gap-1 text-gray-700">
                                <Sparkles className="h-3 w-3 text-purple-500" />
                                Suggested Judge Question
                              </Label>
                            </div>
                            <Textarea
                              value={content?.suggestedJudgeQuestion || ""}
                              onChange={(e) => updateApprovedContent(p.id, 'suggestedJudgeQuestion', e.target.value)}
                              className="text-sm min-h-[80px] bg-purple-50/10 border-purple-100"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-gray-700">Admin Internal Notes</Label>
                          <Textarea
                            placeholder="Confidential notes for court records..."
                            value={content?.adminNote || ""}
                            onChange={(e) => updateApprovedContent(p.id, 'adminNote', e.target.value)}
                            className="text-sm border-gray-200"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            <div className="flex justify-end pb-12">
              <Button onClick={handleSaveSnapshot} disabled={isSaving} size="lg" className="bg-blue-600 hover:bg-blue-700 px-12">
                {isSaving ? "Finalizing Snapshot..." : "Approve & Save Court Prep Snapshot"}
              </Button>
            </div>
          </div>
        )}

        {saveSuccess && (
          <div className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-lg shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-4">
            <CheckCircle className="h-5 w-5" />
            <span>Court Prep Snapshot saved to immutable records.</span>
          </div>
        )}

        {/* Empty State */}
        {((reportType === "participant" && !selectedParticipant) || (reportType === "program" && !selectedProgram)) && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <FileBarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a {reportType.replace('_', ' ')} to generate a report</p>
              </div>
            </CardContent>
          </Card>
        )}
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
