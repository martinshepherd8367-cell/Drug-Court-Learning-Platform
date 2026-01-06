"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Users, Calendar, Clock, MapPin, Plus, Settings, QrCode, CheckCircle, Edit, AlertCircle } from "lucide-react"
import { useStore } from "@/lib/store"
import { CANONICAL_CLASSES } from "@/lib/constants"
import { RoleNav } from "@/components/role-nav"

export default function AdminSchedulePage() {
  const router = useRouter()
  const { users, programs, enrollments, makeupGroup, makeupAssignments, updateMakeupGroup, completedSessions, scheduleEvents, updateScheduleEvent, programInstances } = useStore()

  const [showClassDetail, setShowClassDetail] = useState(false)
  const [showParticipantList, setShowParticipantList] = useState(false)
  const [showParticipantDetail, setShowParticipantDetail] = useState(false)
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null)
  const [showAddSaturdayGroup, setShowAddSaturdayGroup] = useState(false)
  const [showMakeupSettings, setShowMakeupSettings] = useState(false)
  const [makeupDate, setMakeupDate] = useState(makeupGroup.date)
  const [makeupTime, setMakeupTime] = useState(makeupGroup.time)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const makeupParticipants = makeupAssignments.filter((a) => a.status !== "completed")

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const morningSlots = ["9:00 AM", "10:30 AM"]
  const afternoonSlots = ["12:00 PM", "1:00 PM", "4:00 PM", "5:30 PM", "7:00 PM"]

  // ... existing mock data and functions ...

  const getParticipantDetails = (participantId: string) => {
    return users.find((u) => u.id === participantId)
  }

  const getProgressColor = (current: number, total: number) => {
    const percent = (current / total) * 100
    if (percent <= 25) return "bg-green-200 border-green-400 text-green-900"
    if (percent <= 50) return "bg-blue-200 border-blue-400 text-blue-900"
    if (percent <= 75) return "bg-yellow-200 border-yellow-400 text-yellow-900"
    return "bg-red-200 border-red-400 text-red-900"
  }

  const handleSaveMakeupSettings = () => {
    updateMakeupGroup({
      date: makeupDate,
      time: makeupTime,
    })
    setShowMakeupSettings(false)
  }

  // Derived Schedule Data - Primary source: scheduleEvents
  const derivedScheduleData = useMemo(() => {
    const acc: Record<string, Record<string, any[]>> = {};

    scheduleEvents.forEach(event => {
      const { dayOfWeek: day, time, location: room, programId, id: eventId, date } = event;
      if (!day || !time) return;

      const program = programs.find(p => p.id === programId);
      const facilitator = users.find(u => u.id === event.facilitatorId);

      if (!acc[day]) acc[day] = {};
      if (!acc[day][time]) acc[day][time] = [];

      acc[day][time].push({
        eventId,
        programId,
        program: program?.name || event.programName || "Unknown Program",
        facilitator: facilitator?.name || event.facilitatorName || "Unknown Facilitator",
        facilitatorId: event.facilitatorId,
        room,
        day,
        time,
        date,
        participants: [],
        enrolled: 0,
        session: 1,
        totalSessions: program?.totalSessions || 0,
        isCompleted: false
      });
    });

    // Attach instances from Program Management Hub
    programInstances.forEach(instance => {
      if (instance.status !== "ACTIVE") return;
      const day = instance.scheduleDay;
      const time = `${instance.scheduleTime} ${instance.scheduleMeridiem}`;

      if (!acc[day]) acc[day] = {};
      if (!acc[day][time]) acc[day][time] = [];

      // Avoid duplicates if scheduleEvents already has this (by matching id or name/time)
      const isDuplicate = acc[day][time].some(e => e.programId === instance.classId && e.facilitatorId === instance.facilitatorId);
      if (isDuplicate) return;

      acc[day][time].push({
        eventId: instance.id,
        programId: instance.classId,
        program: instance.className,
        facilitator: instance.facilitatorName,
        facilitatorId: instance.facilitatorId,
        room: "Main Hall", // Default
        day,
        time,
        date: new Date().toISOString().split('T')[0],
        participants: instance.participantIds,
        enrolled: instance.participantIds.length,
        session: instance.sessionsCompleted + 1,
        totalSessions: 12,
        isCompleted: false
      });
    });

    // Attach participation data from enrollments
    const getSlotKey = (e: any) => {
      if (!e.schedule) return "";
      const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const safeId = (text: string) => slugify(text) || "unknown";
      return `evt-${e.schedule.day}-${safeId(e.schedule.time)}-${e.programId}`;
    };

    // Flatten acc for easier lookup by ID
    const eventLookup: Record<string, any> = {};
    Object.values(acc).forEach(dayMap => {
      Object.values(dayMap).forEach((slots: any[]) => {
        slots.forEach(s => {
          eventLookup[s.eventId] = s;
        });
      });
    });

    enrollments.forEach(enrollment => {
      if (!enrollment.schedule || enrollment.status !== "active") return;

      const slotKey = getSlotKey(enrollment);
      const entry = eventLookup[slotKey];

      if (entry) {
        entry.participants.push(enrollment.participantId);
        entry.enrolled = entry.participants.length;
        entry.session = Math.max(entry.session, enrollment.currentSessionNumber);

        const isCompleted = completedSessions.some(cs =>
          cs.classId === entry.eventId &&
          cs.programId === enrollment.programId &&
          cs.sessionNumber === enrollment.currentSessionNumber
        );
        if (isCompleted) entry.isCompleted = true;
      }
    });

    return acc;
  }, [scheduleEvents, enrollments, programs, users, completedSessions]);

  const getClassesForSlot = (day: string, time: string) => {
    return derivedScheduleData[day]?.[time] || []
  }

  // Get participants for selected class
  const getSelectedClassParticipants = () => {
    if (!selectedClass || !selectedClass.participants) return [];
    return selectedClass.participants.map((pid: string) => {
      const user = users.find(u => u.id === pid);
      const enrollment = enrollments.find(e => e.participantId === pid && e.programId === selectedClass.programId);
      return {
        id: pid,
        name: user?.name || "Unknown",
        session: enrollment?.currentSessionNumber || 1,
        totalSessions: selectedClass.totalSessions,
        phone: user?.phone,
        dob: user?.dateOfBirth,
        address: user?.address,
        emergencyContact: user?.emergencyContact,
        emergencyPhone: user?.emergencyPhone,
        caseNumber: user?.caseNumber,
        probationOfficer: user?.probationOfficer
      };
    });
  }

  const isFutureEvent = (dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) return true;
    const now = new Date();
    try {
      const [time, meridian] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (meridian === "PM" && hours < 12) hours += 12;
      if (meridian === "AM" && hours === 12) hours = 0;
      const eventTime = new Date(`${dateStr}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);
      return eventTime.getTime() > now.getTime();
    } catch (e) {
      return true;
    }
  };

  const handleEditClick = () => {
    setEditData({
      programId: selectedClass.programId,
      facilitatorId: selectedClass.facilitatorId,
      time: selectedClass.time,
      room: selectedClass.room
    });
    setIsEditing(true);
    setError(null);
  };

  const handleSaveEdit = async () => {
    if (!selectedClass?.eventId) return;
    setBusy(true);
    setError(null);
    try {
      await updateScheduleEvent(selectedClass.eventId, {
        programId: editData.programId,
        facilitatorId: editData.facilitatorId,
        time: editData.time,
        location: editData.room
      });
      setIsEditing(false);
      setShowClassDetail(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200/50 header-transparent sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Weekly Class Schedule</h1>
              <p className="text-sm text-gray-600">View all classes and manage enrollment</p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Morning Schedule */}
        <Card className="card-transparent">
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-lg">Morning Classes (9:00 AM - 12:00 PM)</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="grid grid-cols-6 gap-1">
              {/* Header */}
              <div className="p-2 bg-gray-100/80 border border-gray-400 font-semibold text-sm text-center">Time</div>
              {days.map((day) => (
                <div key={day} className="p-2 bg-gray-100/80 border border-gray-400 font-semibold text-sm text-center">
                  {day}
                </div>
              ))}

              {/* Morning Time Slots */}
              {morningSlots.map((time) => (
                <>
                  <div
                    key={`time-${time}`}
                    className="p-2 bg-gray-50/80 border border-gray-400 text-sm font-medium text-center"
                  >
                    {time}
                  </div>
                  {days.map((day) => {
                    const classes = getClassesForSlot(day, time)
                    return (
                      <div key={`${day}-${time}`} className="border border-gray-400 p-1 min-h-[140px] bg-white/60">
                        <div className="flex flex-col gap-1">
                          {classes.map((cls, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setSelectedClass({ ...cls, day, time, room: cls.room })
                                setShowClassDetail(true)
                              }}
                              className={`p-1 rounded text-left text-xs border-2 hover:opacity-80 transition-opacity ${cls.isCompleted ? "bg-gray-100 border-gray-300 text-gray-500" : getProgressColor(cls.session, cls.totalSessions)}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="font-semibold truncate">{cls.program}</div>
                                {cls.isCompleted && <CheckCircle className="h-3 w-3" />}
                              </div>
                              <div className="truncate">{cls.facilitator.split(" ")[0]}</div>
                              <div className="flex items-center justify-between">
                                <span>{cls.enrolled} enrolled</span>
                                {cls.isCompleted && <span className="text-[10px] uppercase font-bold">Done</span>}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Afternoon Schedule */}
        <Card className="card-transparent">
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-lg">Afternoon Classes (12:00 PM - 7:00 PM)</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="grid grid-cols-6 gap-1">
              {/* Header */}
              <div className="p-2 bg-gray-100/80 border border-gray-400 font-semibold text-sm text-center">Time</div>
              {days.map((day) => (
                <div key={day} className="p-2 bg-gray-100/80 border border-gray-400 font-semibold text-sm text-center">
                  {day}
                </div>
              ))}

              {/* Afternoon Time Slots */}
              {afternoonSlots.map((time) => (
                <>
                  <div
                    key={`time-${time}`}
                    className="p-2 bg-gray-50/80 border border-gray-400 text-sm font-medium text-center"
                  >
                    {time}
                  </div>
                  {days.map((day) => {
                    const classes = getClassesForSlot(day, time)
                    return (
                      <div key={`${day}-${time}`} className="border border-gray-400 p-1 min-h-[140px] bg-white/60">
                        <div className="flex flex-col gap-1">
                          {classes.map((cls, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setSelectedClass({ ...cls, day, time, room: cls.room })
                                setShowClassDetail(true)
                              }}
                              className={`p-1 rounded text-left text-xs border-2 hover:opacity-80 transition-opacity ${cls.isCompleted ? "bg-gray-100 border-gray-300 text-gray-500" : getProgressColor(cls.session, cls.totalSessions)}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="font-semibold truncate">{cls.program}</div>
                                {cls.isCompleted && <CheckCircle className="h-3 w-3" />}
                              </div>
                              <div className="truncate">{cls.facilitator.split(" ")[0]}</div>
                              <div className="flex items-center justify-between">
                                <span>{cls.enrolled} enrolled</span>
                                {cls.isCompleted && <span className="text-[10px] uppercase font-bold">Done</span>}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-transparent">
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Saturday - Makeup Group
              <Button size="sm" variant="outline" onClick={() => setShowMakeupSettings(true)}>
                <Settings className="h-3 w-3 mr-1" />
                Settings
              </Button>
            </CardTitle>
            <CardDescription>Monthly makeup class for participants who missed a session</CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex flex-wrap gap-3">
              {/* Makeup Group Card */}
              <button
                onClick={() => {
                  setSelectedClass({
                    program: "Makeup Group",
                    facilitator: makeupGroup.facilitatorName,
                    day: "Saturday",
                    time: makeupGroup.time,
                    room: makeupGroup.room,
                    enrolled: makeupParticipants.length,
                    session: 1,
                    totalSessions: 1,
                    isMakeup: true,
                  })
                  setShowClassDetail(true)
                }}
                className="p-4 rounded-lg bg-amber-200 border-2 border-amber-400 text-amber-900 hover:opacity-80 transition-opacity min-w-[200px]"
              >
                <div className="font-semibold text-lg">Makeup Group</div>
                <div className="text-sm">
                  {new Date(makeupGroup.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="text-sm">
                  {makeupGroup.time} - {makeupGroup.room}
                </div>
                <div className="text-sm">{makeupGroup.facilitatorName}</div>
                <div className="text-sm mt-2 font-semibold">{makeupParticipants.length} assigned</div>
                <div className="flex gap-1 mt-2">
                  {makeupParticipants.map((p) => (
                    <div
                      key={p.id}
                      className={`w-3 h-3 rounded-full ${p.facilitatorAssigned ? "bg-green-500" : "bg-red-500"}`}
                      title={`${p.participantName}: ${p.facilitatorAssigned ? "Work Assigned" : "Needs Work"}`}
                    />
                  ))}
                </div>
              </button>

              {/* Add Saturday Group Button */}
              <button
                onClick={() => setShowAddSaturdayGroup(true)}
                className="p-4 rounded-lg border-2 border-dashed border-gray-400 text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors min-w-[150px] flex flex-col items-center justify-center"
              >
                <Plus className="h-6 w-6 mb-1" />
                <span className="text-sm">Add Saturday Group</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="card-transparent">
          <CardContent className="p-3">
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="font-semibold">Progress Legend:</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-green-200 border border-green-400" />
                <span>0-25%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-blue-200 border border-blue-400" />
                <span>25-50%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-yellow-200 border border-yellow-400" />
                <span>50-75%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-red-200 border border-red-400" />
                <span>75-100%</span>
              </div>
              <span className="ml-4 font-semibold">Makeup Status:</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                <span>Needs Work</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <span>Work Assigned</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Class Detail Modal */}
      <Dialog open={showClassDetail} onOpenChange={(open) => {
        setShowClassDetail(open);
        if (!open) setIsEditing(false);
      }}>
        <DialogContent className="max-w-md card-transparent">
          <DialogHeader>
            <div className="flex items-center justify-between pr-6">
              <DialogTitle>{isEditing ? "Edit Class Schedule" : selectedClass?.program}</DialogTitle>
              {!isEditing && selectedClass && isFutureEvent(selectedClass.date, selectedClass.time) && (
                <Button variant="ghost" size="sm" onClick={handleEditClick} className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DialogHeader>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 font-bold" />
              {error}
            </div>
          )}

          {selectedClass && (
            <div className="space-y-4">
              {isEditing ? (
                <div className="space-y-3 py-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Program (Class)</Label>
                    <Select value={editData.programId} onValueChange={(val) => setEditData({ ...editData, programId: val })}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Facilitator</Label>
                    <Select value={editData.facilitatorId} onValueChange={(val) => setEditData({ ...editData, facilitatorId: val })}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {users.filter(u =>
                          u.role === 'facilitator' &&
                          (CANONICAL_CLASSES as unknown as string[]).includes(editData.programId) &&
                          u.authorizedPrograms?.includes(editData.programId)
                        ).map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                        {users.filter(u =>
                          u.role === 'facilitator' &&
                          !u.authorizedPrograms?.includes(editData.programId)
                        ).length === 0 && <div className="p-2 text-xs text-gray-500 italic">No authorized facilitators</div>}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Time</Label>
                      <Select value={editData.time} onValueChange={(val) => setEditData({ ...editData, time: val })}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[...morningSlots, ...afternoonSlots].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Location (Room)</Label>
                      <Input
                        value={editData.room}
                        onChange={(e) => setEditData({ ...editData, room: e.target.value })}
                        className="h-9"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)} disabled={busy}>
                      Cancel
                    </Button>
                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleSaveEdit} disabled={busy}>
                      {busy ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{selectedClass.day}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{selectedClass.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{selectedClass.facilitator}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{selectedClass.room}</span>
                    </div>
                  </div>

                  {!selectedClass.isMakeup && (
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-sm text-gray-600">Session Progress</div>
                      <div className="text-lg font-semibold">
                        Session {selectedClass.session} of {selectedClass.totalSessions}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${(selectedClass.session / selectedClass.totalSessions) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{selectedClass.enrolled} Participants Enrolled</span>
                    <Badge className={selectedClass.isCompleted ? "bg-gray-400" : "bg-green-600"}>
                      {selectedClass.isCompleted ? "Completed" : "Active"}
                    </Badge>
                  </div>

                  {!isEditing && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setShowClassDetail(false)
                        setShowParticipantList(true)
                      }}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      View Participant List
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showParticipantList} onOpenChange={setShowParticipantList}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto card-transparent">
          <DialogHeader>
            <DialogTitle>
              {selectedClass?.isMakeup ? "Makeup Group Participants" : `${selectedClass?.program} - Participants`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {selectedClass?.isMakeup ? (
              // Show makeup group participants
              makeupParticipants.length > 0 ? (
                makeupParticipants.map((participant) => (
                  <button
                    key={participant.id}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${participant.facilitatorAssigned
                      ? "bg-green-50 border-green-300 hover:bg-green-100"
                      : "bg-red-50 border-red-300 hover:bg-red-100"
                      }`}
                    onClick={() => {
                      setSelectedParticipant({
                        ...participant,
                        ...getParticipantDetails(participant.participantId),
                      })
                      setShowParticipantList(false)
                      setShowParticipantDetail(true)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{participant.participantName}</div>
                        <div className="text-sm text-gray-600">
                          Missed: {participant.missedProgramName} - Session {participant.missedSessionNumber}
                        </div>
                      </div>
                      <Badge className={participant.facilitatorAssigned ? "bg-green-600" : "bg-red-600"}>
                        {participant.facilitatorAssigned ? "Work Assigned" : "Needs Work"}
                      </Badge>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No participants assigned to this makeup group</p>
              )
            ) : (
              // Show regular class participants
              getSelectedClassParticipants().map((participant: any) => (
                <button
                  key={participant.id}
                  className="w-full p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 text-left transition-colors"
                  onClick={() => {
                    setSelectedParticipant(participant)
                    setShowParticipantList(false)
                    setShowParticipantDetail(true)
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{participant.name}</div>
                      <div className="text-sm text-gray-600">
                        Session {participant.session} of {participant.totalSessions}
                      </div>
                    </div>
                    <Badge variant="outline">View Details</Badge>
                  </div>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Participant Detail Modal */}
      <Dialog open={showParticipantDetail} onOpenChange={setShowParticipantDetail}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto card-transparent">
          <DialogHeader>
            <DialogTitle>{selectedParticipant?.name || selectedParticipant?.participantName}</DialogTitle>
          </DialogHeader>
          {selectedParticipant && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold text-sm text-gray-700">Demographic Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <span className="ml-2">{selectedParticipant.phone || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">DOB:</span>
                    <span className="ml-2">{selectedParticipant.dob || selectedParticipant.dateOfBirth || "N/A"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Address:</span>
                    <span className="ml-2">{selectedParticipant.address || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Emergency:</span>
                    <span className="ml-2">{selectedParticipant.emergencyContact || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Emergency Phone:</span>
                    <span className="ml-2">{selectedParticipant.emergencyPhone || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Case #:</span>
                    <span className="ml-2">{selectedParticipant.caseNumber || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">PO:</span>
                    <span className="ml-2">{selectedParticipant.probationOfficer || "N/A"}</span>
                  </div>
                </div>
              </div>

              {selectedParticipant.missedProgramName && (
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-sm text-amber-800">Makeup Group Assignment</h4>
                  <p className="text-sm mt-1">
                    Missed: {selectedParticipant.missedProgramName} - Session {selectedParticipant.missedSessionNumber}
                  </p>
                  <p className="text-sm">
                    Scheduled: {new Date(selectedParticipant.makeupDate).toLocaleDateString()} at{" "}
                    {selectedParticipant.makeupTime}
                  </p>
                  <Badge className={selectedParticipant.facilitatorAssigned ? "bg-green-600 mt-2" : "bg-red-600 mt-2"}>
                    {selectedParticipant.facilitatorAssigned ? "Work Assigned" : "Awaiting Work Assignment"}
                  </Badge>
                </div>
              )}

              {selectedParticipant.session && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-sm text-green-800">Current Progress</h4>
                  <p className="text-sm mt-1">
                    Session {selectedParticipant.session} of {selectedParticipant.totalSessions}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${(selectedParticipant.session / selectedParticipant.totalSessions) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-sm mt-2">
                    {selectedParticipant.totalSessions - selectedParticipant.session} sessions remaining
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showMakeupSettings} onOpenChange={setShowMakeupSettings}>
        <DialogContent className="max-w-md card-transparent">
          <DialogHeader>
            <DialogTitle>Makeup Group Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Date (Next Saturday)</Label>
              <Input type="date" value={makeupDate} onChange={(e) => setMakeupDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Select value={makeupTime} onValueChange={setMakeupTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                  <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                  <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Facilitator</Label>
              <Select defaultValue={makeupGroup.facilitatorId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {users
                    .filter((u) => u.role === "facilitator" && (
                      (u.authorizedPrograms?.includes(editData?.programId) && (CANONICAL_CLASSES as unknown as string[]).includes(editData?.programId)) ||
                      u.authorizedPrograms?.includes("makeup") ||
                      u.authorizedPrograms?.includes("Makeup Group")
                    ))
                    .map((fac) => (
                      <SelectItem key={fac.id} value={fac.id}>
                        {fac.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-600 mb-2">QR Code for Check-In</div>
              <div className="bg-white p-4 rounded border flex items-center justify-center">
                <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">Code: {makeupGroup.qrCode}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMakeupSettings(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveMakeupSettings}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Saturday Group Modal */}
      <Dialog open={showAddSaturdayGroup} onOpenChange={setShowAddSaturdayGroup}>
        <DialogContent className="max-w-md card-transparent">
          <DialogHeader>
            <DialogTitle>Add Saturday Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Group Name</Label>
              <Input placeholder="e.g., Special Workshop" />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                  <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                  <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                  <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Facilitator</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select facilitator" />
                </SelectTrigger>
                <SelectContent>
                  {users
                    .filter((u) => u.role === "facilitator" && (
                      (u.authorizedPrograms?.includes(editData?.programId) && (CANONICAL_CLASSES as unknown as string[]).includes(editData?.programId)) ||
                      u.authorizedPrograms?.includes("makeup") ||
                      u.authorizedPrograms?.includes("Makeup Group")
                    ))
                    .map((fac) => (
                      <SelectItem key={fac.id} value={fac.id}>
                        {fac.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSaturdayGroup(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">Add Group</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
