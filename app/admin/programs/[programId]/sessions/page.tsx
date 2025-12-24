"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { RoleNav } from "@/components/role-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Plus, Lock, Unlock, Edit, Eye, CheckCircle, Circle } from "lucide-react"

export default function SessionManagement() {
  const params = useParams()
  const router = useRouter()
  const { programs } = useStore()

  const programId = params.programId as string
  const program = programs.find((p) => p.id === programId)

  const [showEditSession, setShowEditSession] = useState(false)
  const [selectedSession, setSelectedSession] = useState<any>(null)
  const [editData, setEditData] = useState({
    title: "",
    purpose: "",
    objectives: "",
    caseworxNoteTemplate: "",
  })

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50">
        <RoleNav />
        <main className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Program Not Found</h1>
            <Button onClick={() => router.push("/admin/programs")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Programs
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const sortedSessions = [...program.sessions].sort((a, b) => a.sessionNumber - b.sessionNumber)

  const handleEditSession = (session: any) => {
    setSelectedSession(session)
    setEditData({
      title: session.title,
      purpose: session.purpose,
      objectives: session.objectives.join("\n"),
      caseworxNoteTemplate: session.caseworxNoteTemplate,
    })
    setShowEditSession(true)
  }

  const handleSaveSession = () => {
    // TODO: Wire to backend
    console.log("Saving session:", selectedSession?.id, editData)
    setShowEditSession(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RoleNav />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/admin/programs")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Programs
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-gray-900">{program.name}</h1>
                {program.isLocked ? (
                  <Badge variant="secondary" className="gap-1">
                    <Lock className="h-3 w-3" />
                    Locked
                  </Badge>
                ) : (
                  <Badge className="bg-green-600 gap-1">
                    <Unlock className="h-3 w-3" />
                    Open
                  </Badge>
                )}
              </div>
              <p className="text-gray-600">Manage sessions for this program</p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Session
            </Button>
          </div>
        </div>

        {/* Lock Info */}
        {program.isLocked && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800">Program is Locked</p>
                  <p className="text-sm text-amber-700">
                    Facilitators cannot open sessions beyond the current cohort progress.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sessions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Sessions</CardTitle>
            <CardDescription>
              {sortedSessions.length} of {program.totalSessions} sessions configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sortedSessions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedSessions.map((session) => {
                    const hasContent = session.facilitatorPrompts.length > 0 || session.activityTemplates.length > 0

                    return (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">{session.sessionNumber}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{session.title}</p>
                            <p className="text-sm text-gray-500 truncate max-w-md">{session.purpose}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {hasContent ? (
                            <Badge className="bg-green-600 gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1">
                              <Circle className="h-3 w-3" />
                              Draft
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Badge variant="outline">{session.facilitatorPrompts.length} prompts</Badge>
                            <Badge variant="outline">{session.activityTemplates.length} activities</Badge>
                            {session.homeworkTemplate && <Badge variant="outline">Homework</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(`/facilitator/programs/${program.slug}/sessions/${session.sessionNumber}`)
                              }
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEditSession(session)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No sessions configured yet.</p>
                <p className="text-sm">Add sessions to build this program's curriculum.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Edit Session Dialog */}
      <Dialog open={showEditSession} onOpenChange={setShowEditSession}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Session {selectedSession?.sessionNumber}</DialogTitle>
            <DialogDescription>Update session content and configuration</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Purpose</Label>
              <Textarea
                value={editData.purpose}
                onChange={(e) => setEditData({ ...editData, purpose: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Objectives (one per line)</Label>
              <Textarea
                value={editData.objectives}
                onChange={(e) => setEditData({ ...editData, objectives: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>CaseWorx Note Template</Label>
              <Textarea
                value={editData.caseworxNoteTemplate}
                onChange={(e) => setEditData({ ...editData, caseworxNoteTemplate: e.target.value })}
                rows={6}
                className="font-mono text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditSession(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSession} className="bg-green-600 hover:bg-green-700">
              Save Changes
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
