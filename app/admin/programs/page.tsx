"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { CANONICAL_CLASSES } from "@/lib/constants"
import { RoleNav } from "@/components/role-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Plus,
  BookOpen,
  Users,
  Calendar,
  Clock,
  ChevronRight,
  AlertCircle,
} from "lucide-react"

export default function ProgramManagement() {
  const router = useRouter()
  const { users, programInstances, createProgramInstance, updateProgramInstance, addMessage } = useStore()

  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null)
  const [showCreateProgram, setShowCreateProgram] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [newInstance, setNewInstance] = useState({
    classId: "",
    className: "",
    facilitatorId: "",
    facilitatorName: "",
    scheduleDay: "Monday",
    scheduleTime: "",
    scheduleMeridiem: "PM" as "AM" | "PM",
  })

  // Filter facilitators based on authorized classes
  const availableFacilitators = useMemo(() => {
    if (!newInstance.classId) return []
    return users.filter(u =>
      u.role === "facilitator" &&
      u.authorizedPrograms?.includes(newInstance.classId)
    )
  }, [users, newInstance.classId])

  const handleCreateInstance = async () => {
    if (!newInstance.classId || !newInstance.facilitatorId || !newInstance.scheduleTime) {
      setError("All fields are required.")
      return
    }

    setBusy(true)
    setError(null)
    try {
      await createProgramInstance(newInstance)
      setShowCreateProgram(false)
      setNewInstance({
        classId: "",
        className: "",
        facilitatorId: "",
        facilitatorName: "",
        scheduleDay: "Monday",
        scheduleTime: "",
        scheduleMeridiem: "PM",
      })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const activeInstances = useMemo(() => {
    return programInstances.filter(i => i.status === "ACTIVE")
  }, [programInstances])

  const selectedInstance = useMemo(() => {
    return programInstances.find(i => i.id === selectedInstanceId)
  }, [programInstances, selectedInstanceId])

  const availableFacilitatorsForSelected = useMemo(() => {
    if (!selectedInstance) return []
    return users.filter(u =>
      u.role === "facilitator" &&
      u.authorizedPrograms?.includes(selectedInstance.classId)
    )
  }, [users, selectedInstance])

  const handleUpdateStatus = async (status: "ACTIVE" | "COMPLETED" | "PAUSED") => {
    if (!selectedInstanceId) return
    await updateProgramInstance(selectedInstanceId, { status })
  }

  const handleUpdateSchedule = async (day: string, time: string, meridiem: "AM" | "PM") => {
    if (!selectedInstance || !selectedInstanceId) return
    const oldSchedule = `${selectedInstance.scheduleDay} at ${selectedInstance.scheduleTime} ${selectedInstance.scheduleMeridiem}`
    const newSchedule = `${day} at ${time} ${meridiem}`

    await updateProgramInstance(selectedInstanceId, {
      scheduleDay: day,
      scheduleTime: time,
      scheduleMeridiem: meridiem
    })

    // Notifications
    const content = `Schedule for ${selectedInstance.className} has changed from ${oldSchedule} to ${newSchedule}.`

    // Notify Facilitator
    addMessage({
      senderId: "admin",
      senderRole: "admin",
      recipientId: selectedInstance.facilitatorId,
      recipientRole: "facilitator",
      title: "Schedule Change",
      content,
      fromName: "Administrator",
      readAt: null,
      createdAt: new Date().toISOString()
    })

    // Notify Participants
    selectedInstance.participantIds.forEach(pId => {
      addMessage({
        senderId: "admin",
        senderRole: "admin",
        recipientId: pId,
        recipientRole: "participant",
        title: "Schedule Change",
        content,
        fromName: "Administrator",
        readAt: null,
        createdAt: new Date().toISOString()
      })
    })
  }

  const handleUpdateFacilitator = async (facId: string) => {
    if (!selectedInstance || !selectedInstanceId) return
    const facilitator = users.find(u => u.id === facId)
    if (!facilitator) return

    await updateProgramInstance(selectedInstanceId, {
      facilitatorId: facId,
      facilitatorName: facilitator.name
    })

    // Notifications
    const content = `Facilitator for ${selectedInstance.className} has been updated to ${facilitator.name}.`

    // Notify New Facilitator
    addMessage({
      senderId: "admin",
      senderRole: "admin",
      recipientId: facId,
      recipientRole: "facilitator",
      title: "Class Assignment",
      content: `You have been assigned to facilitate ${selectedInstance.className} (${selectedInstance.scheduleDay} at ${selectedInstance.scheduleTime} ${selectedInstance.scheduleMeridiem}).`,
      fromName: "Administrator",
      readAt: null,
      createdAt: new Date().toISOString()
    })

    // Notify Participants
    selectedInstance.participantIds.forEach(pId => {
      addMessage({
        senderId: "admin",
        senderRole: "admin",
        recipientId: pId,
        recipientRole: "participant",
        title: "Facilitator Update",
        content,
        fromName: "Administrator",
        readAt: null,
        createdAt: new Date().toISOString()
      })
    })
  }

  const handleAddParticipant = async (participantId: string) => {
    if (!selectedInstance || !selectedInstanceId) return
    if (selectedInstance.participantIds.includes(participantId)) return

    const newParticipantIds = [...selectedInstance.participantIds, participantId]
    await updateProgramInstance(selectedInstanceId, {
      participantIds: newParticipantIds,
      participantCount: newParticipantIds.length
    })

    // Notify Facilitator Only
    const participant = users.find(u => u.id === participantId)
    addMessage({
      senderId: "admin",
      senderRole: "admin",
      recipientId: selectedInstance.facilitatorId,
      recipientRole: "facilitator",
      title: "Roster Update",
      content: `${participant?.name || "A new participant"} has been added to your ${selectedInstance.className} class.`,
      fromName: "Administrator",
      readAt: null,
      createdAt: new Date().toISOString()
    })
  }

  const handleRemoveParticipant = async (participantId: string) => {
    if (!selectedInstance || !selectedInstanceId) return

    const newParticipantIds = selectedInstance.participantIds.filter(id => id !== participantId)
    await updateProgramInstance(selectedInstanceId, {
      participantIds: newParticipantIds,
      participantCount: newParticipantIds.length
    })

    // Notify Facilitator Only
    const participant = users.find(u => u.id === participantId)
    addMessage({
      senderId: "admin",
      senderRole: "admin",
      recipientId: selectedInstance.facilitatorId,
      recipientRole: "facilitator",
      title: "Roster Update",
      content: `${participant?.name || "A participant"} has been removed from your ${selectedInstance.className} class.`,
      fromName: "Administrator",
      readAt: null,
      createdAt: new Date().toISOString()
    })
  }

  return (
    <div className="min-h-screen">
      <RoleNav />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => selectedInstanceId ? setSelectedInstanceId(null) : router.push("/admin")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {selectedInstanceId ? "Back to Programs List" : "Back to Dashboard"}
          </Button>

          {!selectedInstanceId ? (
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Program Management Hub</h1>
                <p className="text-gray-600 mt-1">Manage active class instances and schedules</p>
              </div>
              <Button onClick={() => setShowCreateProgram(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Program
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">{selectedInstance?.className}</h1>
                  <Select
                    value={selectedInstance?.status}
                    onValueChange={(val) => handleUpdateStatus(val as any)}
                  >
                    <SelectTrigger className="w-[130px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                      <SelectItem value="PAUSED">PAUSED</SelectItem>
                      <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-gray-600 mt-1">Instance Management: {selectedInstanceId}</p>
              </div>
            </div>
          )}
        </div>

        {selectedInstanceId && selectedInstance ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Controls Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    Instance Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Schedule Edit */}
                    <div className="space-y-4">
                      <Label className="text-sm font-bold">Schedule Settings</Label>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label className="text-[10px] text-gray-500">Day of Week</Label>
                          <Select
                            value={selectedInstance.scheduleDay}
                            onValueChange={(val) => handleUpdateSchedule(val, selectedInstance.scheduleTime, selectedInstance.scheduleMeridiem)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                                <SelectItem key={day} value={day}>{day}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-[10px] text-gray-500">Time</Label>
                            <Input
                              defaultValue={selectedInstance.scheduleTime}
                              onBlur={(e) => {
                                if (e.target.value !== selectedInstance.scheduleTime) {
                                  handleUpdateSchedule(selectedInstance.scheduleDay, e.target.value, selectedInstance.scheduleMeridiem)
                                }
                              }}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] text-gray-500">AM/PM</Label>
                            <Select
                              value={selectedInstance.scheduleMeridiem}
                              onValueChange={(val) => handleUpdateSchedule(selectedInstance.scheduleDay, selectedInstance.scheduleTime, val as "AM" | "PM")}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="AM">AM</SelectItem>
                                <SelectItem value="PM">PM</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Facilitator Edit */}
                    <div className="space-y-4">
                      <Label className="text-sm font-bold">Facilitator Assignment</Label>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label className="text-[10px] text-gray-500">Facilitator</Label>
                          <Select
                            value={selectedInstance.facilitatorId}
                            onValueChange={(val) => handleUpdateFacilitator(val)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {availableFacilitatorsForSelected.map(f => (
                                <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-[10px] text-gray-500 italic mt-1 font-medium">
                            Only authorized facilitators for "{selectedInstance.classId}" are shown. Resolve this by editing the facilitator's authorized classes in User Management.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Roster Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-gray-500" />
                      Class Roster
                    </CardTitle>
                    <CardDescription>{selectedInstance.participantIds.length} participants enrolled</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="divide-y">
                      {selectedInstance.participantIds.length > 0 ? (
                        selectedInstance.participantIds.map(pId => {
                          const p = users.find(u => u.id === pId)
                          return (
                            <div key={pId} className="p-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                              <div>
                                <div className="font-medium text-sm">{p?.name || "Unknown Participant"}</div>
                                <div className="text-[10px] text-gray-500">{p?.email || "No email"}</div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                                onClick={() => handleRemoveParticipant(pId)}
                              >
                                Remove
                              </Button>
                            </div>
                          )
                        })
                      ) : (
                        <div className="p-8 text-center text-gray-500 text-sm italic bg-gray-50/50">
                          No participants enrolled in this instance yet.
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Controls */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Add to Roster</CardTitle>
                  <CardDescription className="text-[10px]">Enroll existing participants</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select onValueChange={(val) => handleAddParticipant(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Search users..." />
                    </SelectTrigger>
                    <SelectContent>
                      {users
                        .filter(u => u.role === "participant" && !selectedInstance.participantIds.includes(u.id))
                        .map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="flex gap-2 text-blue-700">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <div className="text-[10px] leading-relaxed italic">
                        Enrolling a participant will notify the facilitator. The participant will see this class in their dashboard immediately.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-50/80">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <Clock className="h-3 w-3" />
                    Instance Info
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Created:</span>
                      <span className="font-medium">{new Date(selectedInstance.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Sessions:</span>
                      <span className="font-medium">{selectedInstance.sessionsCompleted} completed</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Status:</span>
                      <Badge variant="outline" className={
                        selectedInstance.status === "ACTIVE" ? "border-green-600 text-green-700 bg-green-50" :
                          selectedInstance.status === "PAUSED" ? "border-amber-600 text-amber-700 bg-amber-50" :
                            "border-gray-400 text-gray-600 bg-gray-100"
                      }>
                        {selectedInstance.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Active Program Instances List */
          <Card className="card-transparent">
            <CardHeader>
              <CardTitle>Active Programs</CardTitle>
              <CardDescription>Running class instances for this term</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeInstances.map((instance) => (
                  <Card
                    key={instance.id}
                    className="cursor-pointer hover:border-green-500 hover:shadow-md transition-all bg-white/80"
                    onClick={() => setSelectedInstanceId(instance.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-green-100 rounded-lg text-green-700 font-bold">
                            {instance.className.slice(0, 3).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{instance.className}</h3>
                              <Badge className={
                                instance.status === "ACTIVE" ? "bg-green-600" :
                                  instance.status === "PAUSED" ? "bg-amber-600" :
                                    "bg-gray-600"
                              }>{instance.status}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {instance.facilitatorName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {instance.scheduleDay} at {instance.scheduleTime} {instance.scheduleMeridiem}
                              </span>
                              <span className="flex items-center gap-1 font-medium text-blue-600">
                                {instance.participantCount} Participants
                              </span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {activeInstances.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No active program instances.</p>
                    <p className="text-sm">Create a new program instance to begin.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Create Program Instance Dialog */}
      <Dialog
        open={showCreateProgram}
        onOpenChange={(open) => {
          setShowCreateProgram(open)
          if (!open) {
            setError(null)
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Program Instance</DialogTitle>
            <DialogDescription>Initialize a new running class with a facilitator and schedule.</DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Class (Curriculum Type)</Label>
              <Select
                onValueChange={(val) => setNewInstance({ ...newInstance, classId: val, className: val, facilitatorId: "", facilitatorName: "" })}
                value={newInstance.classId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class curriculum" />
                </SelectTrigger>
                <SelectContent>
                  {CANONICAL_CLASSES.map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Facilitator</Label>
              <Select
                onValueChange={(val) => {
                  const fac = availableFacilitators.find(f => f.id === val)
                  setNewInstance({ ...newInstance, facilitatorId: val, facilitatorName: fac?.name || "" })
                }}
                disabled={!newInstance.classId}
                value={newInstance.facilitatorId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={newInstance.classId ? "Select authorized facilitator" : "Select a class first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableFacilitators.map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {newInstance.classId && (
                <p className="text-[10px] text-gray-500 italic mt-1 font-medium">
                  Only authorized facilitators for "{newInstance.classId}" are shown. Resolve this by editing the facilitator's authorized classes in User Management.
                </p>
              )}
              {!newInstance.classId && (
                <p className="text-[10px] text-gray-500 italic">Select a class to see authorized facilitators.</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Day of Week</Label>
                <Select
                  onValueChange={(val) => setNewInstance({ ...newInstance, scheduleDay: val })}
                  value={newInstance.scheduleDay}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. 6:00"
                    value={newInstance.scheduleTime}
                    onChange={(e) => setNewInstance({ ...newInstance, scheduleTime: e.target.value })}
                  />
                  <Select
                    onValueChange={(val) => setNewInstance({ ...newInstance, scheduleMeridiem: val as "AM" | "PM" })}
                    value={newInstance.scheduleMeridiem}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateProgram(false)}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateInstance}
              className="bg-green-600 hover:bg-green-700"
              disabled={busy || !newInstance.classId || !newInstance.facilitatorId || !newInstance.scheduleTime}
            >
              {busy ? "Saving..." : "Create Program Instance"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="footer-transparent border-t border-gray-200 py-4 mt-8">
        <div className="container mx-auto px-6 text-center text-sm text-gray-700">
          © 2026 DMS Clinical Services. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
