"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { RoleNav } from "@/components/role-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ArrowLeft, Plus, BookOpen, Lock, Unlock, Settings, ChevronRight } from "lucide-react"

export default function ProgramManagement() {
  const router = useRouter()
  const { programs } = useStore()

  const [showCreateProgram, setShowCreateProgram] = useState(false)
  const [newProgram, setNewProgram] = useState({
    name: "",
    slug: "",
    description: "",
    totalSessions: 12,
    isLocked: false,
  })

  const handleCreateProgram = () => {
    // TODO: Wire to backend
    console.log("Creating program:", newProgram)
    setShowCreateProgram(false)
    setNewProgram({ name: "", slug: "", description: "", totalSessions: 12, isLocked: false })
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
              <h1 className="text-3xl font-bold text-gray-900">Program Management</h1>
              <p className="text-gray-600 mt-1">Create and manage curriculum programs</p>
            </div>
            <Button onClick={() => setShowCreateProgram(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Program
            </Button>
          </div>
        </div>

        {/* Programs List */}
        <Card>
          <CardHeader>
            <CardTitle>All Programs</CardTitle>
            <CardDescription>Click on a program to manage its sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {programs.map((program) => (
                <Card
                  key={program.id}
                  className="cursor-pointer hover:border-green-500 hover:shadow-md transition-all"
                  onClick={() => router.push(`/admin/programs/${program.id}/sessions`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          <BookOpen className="h-6 w-6 text-gray-700" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{program.name}</h3>
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
                          <p className="text-sm text-gray-600">{program.description}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {program.totalSessions} sessions • {program.sessions.length} configured
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            // TODO: Open edit modal
                          }}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {programs.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No programs yet.</p>
                  <p className="text-sm">Create your first program to get started.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Create Program Dialog */}
      <Dialog open={showCreateProgram} onOpenChange={setShowCreateProgram}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Program</DialogTitle>
            <DialogDescription>Add a new curriculum program to the system</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Program Name</Label>
              <Input
                value={newProgram.name}
                onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                placeholder="e.g., Prime Solutions"
              />
            </div>

            <div className="space-y-2">
              <Label>Slug (URL identifier)</Label>
              <Input
                value={newProgram.slug}
                onChange={(e) => setNewProgram({ ...newProgram, slug: e.target.value })}
                placeholder="e.g., prime-solutions"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newProgram.description}
                onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                placeholder="Brief description of the program..."
              />
            </div>

            <div className="space-y-2">
              <Label>Total Sessions</Label>
              <Input
                type="number"
                value={newProgram.totalSessions}
                onChange={(e) => setNewProgram({ ...newProgram, totalSessions: Number.parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Lock Program</Label>
                <p className="text-sm text-gray-500">Prevent facilitators from opening future sessions</p>
              </div>
              <Switch
                checked={newProgram.isLocked}
                onCheckedChange={(checked) => setNewProgram({ ...newProgram, isLocked: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateProgram(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProgram} className="bg-green-600 hover:bg-green-700">
              Create Program
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
