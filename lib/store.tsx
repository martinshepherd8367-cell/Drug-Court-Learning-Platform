"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type {
  User,
  Program,
  Session,
  Enrollment,
  Attendance,
  ActivityRun,
  ParticipantResponse,
  JournalEntry,
  HomeworkSubmission,
  FacilitatorNote,
  QuickNote,
  Message,
  MakeupAssignment,
  MakeupGroup,
  ScheduleEvent,
  CompletedSession,
  Takeaway,
  ClassQRCode,
  CheckIn,
} from "./types"
import {
  mockUsers,
  mockPrograms,
  mockEnrollments,
  mockAttendance,
  mockActivityRuns,
  mockParticipantResponses,
  mockJournalEntries,
  mockHomeworkSubmissions,
  mockFacilitatorNotes,
  mockQuickNotes,
  mockMessages,
} from "./mock-data"

const initialMakeupGroup: MakeupGroup = {
  id: "makeup-1",
  date: "2025-01-04",
  time: "10:00 AM",
  facilitatorId: "fac-1",
  facilitatorName: "Sarah Johnson",
  room: "Room 101",
  qrCode: "MAKEUP-GROUP-2025-01",
  participants: [],
}

const initialMakeupAssignments: MakeupAssignment[] = [
  {
    id: "ma-1",
    participantId: "part-1",
    participantName: "John Smith",
    missedSessionId: "ps-3",
    missedProgramId: "prime-solutions",
    missedProgramName: "Prime Solutions",
    missedSessionNumber: 3,
    missedDate: "2024-12-16",
    makeupDate: "2025-01-04",
    makeupTime: "10:00 AM",
    facilitatorId: "fac-1",
    facilitatorAssigned: false,
    assignedWorksheets: [],
    assignedReadings: [],
    assignedInstructions: "",
    status: "pending",
    checkedIn: false,
  },
  {
    id: "ma-2",
    participantId: "part-2",
    participantName: "Sarah Johnson",
    missedSessionId: "ps-5",
    missedProgramId: "prime-solutions",
    missedProgramName: "Prime Solutions",
    missedSessionNumber: 5,
    missedDate: "2024-12-17",
    makeupDate: "2025-01-04",
    makeupTime: "10:00 AM",
    facilitatorId: "fac-1",
    facilitatorAssigned: true,
    assignedWorksheets: ["Thinking Errors Worksheet", "Self-Assessment"],
    assignedReadings: ["Chapter 5: Cognitive Restructuring"],
    assignedInstructions: "Complete the thinking errors worksheet and reflect on three situations from the past week.",
    status: "work_assigned",
    checkedIn: false,
  },
]

interface StoreState {
  // Data
  users: User[]
  programs: Program[]
  enrollments: Enrollment[]
  attendance: Attendance[]
  activityRuns: ActivityRun[]
  participantResponses: ParticipantResponse[]
  journalEntries: JournalEntry[]
  homeworkSubmissions: HomeworkSubmission[]
  facilitatorNotes: FacilitatorNote[]
  quickNotes: QuickNote[]
  messages: Message[]
  classQRCodes: ClassQRCode[]
  checkIns: CheckIn[]
  completedSessions: CompletedSession[]
  takeaways: Takeaway[]

  // Current user (for demo)
  currentUser: User | null
  setCurrentUser: (user: User | null) => void

  // Actions
  launchActivity: (sessionId: string, activityTemplateId: string) => ActivityRun
  closeActivity: (activityRunId: string) => void
  submitResponse: (activityRunId: string, participantId: string, answers: Record<string, string>) => void
  endSession: (sessionId: string, participantId: string) => void
  copyCaseworx: (sessionId: string) => string
  markMessageRead: (messageId: string) => void
  addMessage: (message: Omit<Message, "id">) => void
  completeSession: (data: {
    classId: string,
    programId: string,
    sessionNumber: number,
    facilitatorId: string,
    attendance: Record<string, "present" | "absent" | "excused">,
    takeaways?: { participantId: string, content: string }[]
  }) => Promise<any>

  // CRUD helpers
  addEnrollment: (enrollment: Omit<Enrollment, "id">) => void
  updateEnrollment: (id: string, updates: Partial<Enrollment>) => void
  removeEnrollment: (id: string) => void
  addJournalEntry: (entry: Omit<JournalEntry, "id">) => void
  addHomeworkSubmission: (submission: Omit<HomeworkSubmission, "id">) => void
  updateHomeworkSubmission: (id: string, updates: Partial<HomeworkSubmission>) => void
  addFacilitatorNote: (note: Omit<FacilitatorNote, "id">) => void
  addQuickNote: (note: Omit<QuickNote, "id">) => void
  addTakeaway: (takeaway: Omit<Takeaway, "id">) => Promise<void>

  // Program management functions
  addProgram: (program: Omit<Program, "id">) => void
  updateProgram: (id: string, updates: Partial<Program>) => void
  deleteProgram: (id: string) => void

  // Getters
  getProgramBySlug: (slug: string) => Program | undefined
  getSessionByNumber: (programSlug: string, sessionNumber: number) => Session | undefined
  getEnrollmentsByParticipant: (participantId: string) => Enrollment[]
  getEnrollmentsByProgram: (programId: string) => Enrollment[]
  getActiveActivityRun: (sessionId: string) => ActivityRun | undefined
  getResponsesForActivity: (activityRunId: string) => ParticipantResponse[]
  getMessagesForParticipant: (participantId: string) => Message[]
  getHomeworkForParticipant: (
    participantId: string,
  ) => { program: Program; session: Session; homework: HomeworkSubmission | null }[]
  getJournalEntriesForParticipant: (participantId: string) => JournalEntry[]

  // Makeup group state and actions
  makeupGroup: MakeupGroup
  makeupAssignments: MakeupAssignment[]
  updateMakeupGroup: (updates: Partial<MakeupGroup>) => void
  addMakeupAssignment: (assignment: Omit<MakeupAssignment, "id">) => void
  updateMakeupAssignment: (id: string, updates: Partial<MakeupAssignment>) => void
  markParticipantAbsent: (
    participantId: string,
    participantName: string,
    sessionId: string,
    programId: string,
    programName: string,
    sessionNumber: number,
  ) => void
  assignMakeupWork: (assignmentId: string, worksheets: string[], readings: string[], instructions: string) => void
  checkInToMakeup: (assignmentId: string) => void
  completeMakeupAssignment: (assignmentId: string) => void
  getMakeupAssignmentsForFacilitator: (facilitatorId: string) => MakeupAssignment[]
  getMakeupAssignmentsForParticipant: (participantId: string) => MakeupAssignment[]
  getPendingMakeupAssignments: () => MakeupAssignment[]

  // QR Code and Check-in functions
  generateClassQRCode: (qrCode: Omit<ClassQRCode, "id" | "code" | "generatedAt">) => ClassQRCode
  getQRCodeForClass: (programId: string, sessionNumber: number, day: string, time: string) => ClassQRCode | undefined
  validateCheckIn: (
    participantId: string,
    qrCode: string,
    gpsLat: number | null,
    gpsLng: number | null,
  ) => { success: boolean; error?: string; isVirtual?: boolean }
  recordCheckIn: (checkIn: Omit<CheckIn, "id">) => void
  getCheckInsForSession: (sessionId: string) => CheckIn[]
  markAbsentAfterClass: (sessionId: string, programId: string, programName: string, sessionNumber: number) => void
  isHydrated: boolean
}

const StoreContext = createContext<StoreState | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [programs, setPrograms] = useState<Program[]>(mockPrograms)
  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockEnrollments)
  const [attendance, setAttendance] = useState<Attendance[]>(mockAttendance)
  const [activityRuns, setActivityRuns] = useState<ActivityRun[]>(mockActivityRuns)
  const [participantResponses, setParticipantResponses] = useState<ParticipantResponse[]>(mockParticipantResponses)
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(mockJournalEntries)
  const [homeworkSubmissions, setHomeworkSubmissions] = useState<HomeworkSubmission[]>(mockHomeworkSubmissions)
  const [facilitatorNotes, setFacilitatorNotes] = useState<FacilitatorNote[]>(mockFacilitatorNotes)
  const [quickNotes, setQuickNotes] = useState<QuickNote[]>(mockQuickNotes)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Added makeup group state
  const [makeupGroup, setMakeupGroup] = useState<MakeupGroup>(initialMakeupGroup)
  const [makeupAssignments, setMakeupAssignments] = useState<MakeupAssignment[]>(initialMakeupAssignments)

  const [classQRCodes, setClassQRCodes] = useState<ClassQRCode[]>([])
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [completedSessions, setCompletedSessions] = useState<CompletedSession[]>([])
  const [takeaways, setTakeaways] = useState<Takeaway[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from Server

  useEffect(() => {
    async function hydrate() {
      try {
        console.log("Hydrating from server...");
        const res = await fetch("/api/system/bootstrap");
        if (!res.ok) throw new Error("Failed to fetch bootstrap data");
        const data = await res.json();

        if (data.users?.length) setUsers(data.users);
        if (data.programs?.length) setPrograms(data.programs);
        if (data.enrollments?.length) setEnrollments(data.enrollments);
        if (data.journalEntries?.length) setJournalEntries(data.journalEntries);
        if (data.homeworkSubmissions?.length) setHomeworkSubmissions(data.homeworkSubmissions);
        if (data.attendance?.length) setAttendance(data.attendance);
        if (data.messages?.length) setMessages(data.messages);
        if (data.completedSessions?.length) setCompletedSessions(data.completedSessions);
        if (data.takeaways?.length) setTakeaways(data.takeaways);

        console.log(`Hydrated: ${data.users?.length} users, ${data.messages?.length} messages, ${data.completedSessions?.length} completed sessions, ${data.takeaways?.length} takeaways, ${data.attendance?.length} attendance records`);
        setIsHydrated(true);
      } catch (e) {
        console.error("Hydration failed, falling back to mock:", e);
        setIsHydrated(true);
      }
    }
    hydrate();
  }, [])

  const launchActivity = useCallback((sessionId: string, activityTemplateId: string): ActivityRun => {
    const newRun: ActivityRun = {
      id: `run-${Date.now()}`,
      sessionId,
      activityTemplateId,
      status: "live",
      startedAt: new Date().toISOString(),
      closedAt: null,
    }
    setActivityRuns((prev) => [...prev, newRun])
    return newRun
  }, [])

  const closeActivity = useCallback((activityRunId: string) => {
    setActivityRuns((prev) =>
      prev.map((run) =>
        run.id === activityRunId ? { ...run, status: "closed" as const, closedAt: new Date().toISOString() } : run,
      ),
    )
  }, [])

  const submitResponse = useCallback(
    (activityRunId: string, participantId: string, answers: Record<string, string>) => {
      const newResponse: ParticipantResponse = {
        id: `resp-${Date.now()}`,
        activityRunId,
        participantId,
        answers,
        submittedAt: new Date().toISOString(),
      }
      setParticipantResponses((prev) => [...prev, newResponse])
    },
    [],
  )

  const endSession = useCallback(async (sessionId: string, participantId: string) => {
    // Optimistic local update
    const newAttendance: Attendance = {
      id: `att-${Date.now()}`,
      participantId,
      sessionId,
      classId: "individual", // Default for individual endSession
      attended: true,
      status: "present",
      completedAt: new Date().toISOString(),
    }
    setAttendance((prev) => [...prev, newAttendance])

    // Persist to server
    try {
      await fetch("/api/participant/attendance", {
        method: "POST",
        body: JSON.stringify({
          sessionId,
          status: "present",
          verified: true
        })
      });
    } catch (e) {
      console.error("Failed to record attendance:", e);
    }
  }, [])

  const completeSession = useCallback(async (data: {
    classId: string,
    programId: string,
    sessionNumber: number,
    facilitatorId: string,
    attendance: Record<string, "present" | "absent" | "excused">,
    takeaways?: { participantId: string, content: string }[]
  }) => {
    try {
      const res = await fetch("/api/facilitator/session/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        // Only update local state if backend confirms success
        const sessionId = `${data.programId}-${data.sessionNumber}`;
        const newCompleted: CompletedSession = {
          id: result.id,
          classId: data.classId,
          programId: data.programId,
          sessionNumber: data.sessionNumber,
          facilitatorId: data.facilitatorId,
          completedAt: new Date().toISOString(),
          attendeeIds: Object.entries(data.attendance).filter(([_, s]) => s === "present").map(([id]) => id),
          absenteeIds: Object.entries(data.attendance).filter(([_, s]) => s === "absent").map(([id]) => id),
          excusedIds: Object.entries(data.attendance).filter(([_, s]) => s === "excused").map(([id]) => id),
        };
        setCompletedSessions(prev => [...prev, newCompleted]);

        // attendance update
        setAttendance(prev => {
          const newRecords: Attendance[] = Object.entries(data.attendance).map(([pId, status]) => ({
            id: `att-${Date.now()}-${pId}`,
            participantId: pId,
            sessionId: sessionId,
            classId: data.classId,
            attended: status === "present",
            status: status as any,
            completedAt: new Date().toISOString()
          }));
          return [...prev, ...newRecords];
        });

        // takeaways update
        if (data.takeaways) {
          setTakeaways(prev => {
            const newTs: Takeaway[] = data.takeaways!.map((t, idx) => ({
              id: `tk-${Date.now()}-${idx}`,
              participantId: t.participantId,
              sessionId: sessionId,
              classId: data.classId,
              content: t.content,
              createdBy: data.facilitatorId,
              createdAt: new Date().toISOString()
            }));
            return [...prev, ...newTs];
          });
        }
      }
      return result;
    } catch (e) {
      console.error("Failed to complete session:", e);
      throw e;
    }
  }, [])

  const copyCaseworx = useCallback(
    (sessionId: string): string => {
      const program = programs.find((p) => p.sessions.some((s) => s.id === sessionId))
      const session = program?.sessions.find((s) => s.id === sessionId)
      return session?.caseworxNoteTemplate || ""
    },
    [programs],
  )

  const addEnrollment = useCallback(async (enrollment: Omit<Enrollment, "id">) => {
    // Optimistic local update
    const tempId = `enr-${Date.now()}`;
    setEnrollments((prev) => [...prev, { ...enrollment, id: tempId }])

    // Persist to server
    try {
      const res = await fetch("/api/admin/enrollments", {
        method: "POST",
        body: JSON.stringify(enrollment)
      });
      const data = await res.json();
      if (data.id) {
        setEnrollments(prev => prev.map(e => e.id === tempId ? { ...e, id: data.id } : e));
      }
    } catch (e) {
      console.error("Failed to persist enrollment:", e);
    }
  }, [])

  const updateEnrollment = useCallback(async (id: string, updates: Partial<Enrollment>) => {
    // Optimistic update
    setEnrollments((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)))

    // Persist
    try {
      await fetch("/api/admin/enrollments", {
        method: "PATCH",
        body: JSON.stringify({ id, ...updates })
      });
    } catch (e) {
      console.error("Failed to update enrollment on server:", e);
    }
  }, [])

  const removeEnrollment = useCallback(async (id: string) => {
    // Optimistic update
    setEnrollments((prev) => prev.filter((e) => e.id !== id))

    // Persist
    try {
      await fetch(`/api/admin/enrollments?id=${id}`, {
        method: "DELETE"
      });
    } catch (e) {
      console.error("Failed to delete enrollment on server:", e);
    }
  }, [])

  const addJournalEntry = useCallback(async (entry: Omit<JournalEntry, "id">) => {
    // Optimistic local update
    const tempId = `je-${Date.now()}`;
    setJournalEntries((prev) => [...prev, { ...entry, id: tempId }])

    // Persist to server
    try {
      const res = await fetch("/api/participant/journals", {
        method: "POST",
        body: JSON.stringify(entry)
      });
      const data = await res.json();
      if (data.id) {
        // Update temporary ID with real ID
        setJournalEntries(prev => prev.map(j => j.id === tempId ? { ...j, id: data.id } : j));
      }
    } catch (e) {
      console.error("Failed to persist journal entry:", e);
    }
  }, [])

  const addHomeworkSubmission = useCallback(async (submission: Omit<HomeworkSubmission, "id">) => {
    // Optimistic update
    const tempId = `hs-${Date.now()}`;
    setHomeworkSubmissions((prev) => [...prev, { ...submission, id: tempId }])

    // Persist
    try {
      const res = await fetch("/api/participant/homework", {
        method: "POST",
        body: JSON.stringify(submission)
      });
      const data = await res.json();
      if (data.id) {
        setHomeworkSubmissions(prev => prev.map(s => s.id === tempId ? { ...s, id: data.id } : s));
      }
    } catch (e) {
      console.error("Failed to persist homework:", e);
    }
  }, [])

  const updateHomeworkSubmission = useCallback((id: string, updates: Partial<HomeworkSubmission>) => {
    setHomeworkSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }, [])

  const addFacilitatorNote = useCallback((note: Omit<FacilitatorNote, "id">) => {
    setFacilitatorNotes((prev) => [...prev, { ...note, id: `fn-${Date.now()}` }])
  }, [])

  const addQuickNote = useCallback((note: Omit<QuickNote, "id">) => {
    setQuickNotes((prev) => [...prev, { ...note, id: `qn-${Date.now()}` }])
  }, [])

  const addTakeaway = useCallback(async (takeaway: Omit<Takeaway, "id">) => {
    // Optimistic update
    const tempId = `tk-${Date.now()}`;
    setTakeaways((prev) => [...prev, { ...takeaway, id: tempId }])

    // Persist
    try {
      const res = await fetch("/api/participant/takeaways", {
        method: "POST",
        body: JSON.stringify(takeaway)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to persist takeaway");
      }
      const data = await res.json();
      if (data.id) {
        setTakeaways(prev => prev.map(t => t.id === tempId ? { ...t, id: data.id } : t));
      }
    } catch (e) {
      console.error("Failed to persist takeaway:", e);
      // Rollback
      setTakeaways(prev => prev.filter(t => t.id !== tempId));
      throw e;
    }
  }, [])

  const markMessageRead = useCallback(async (messageId: string) => {
    // Optimistic update
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, readAt: new Date().toISOString() } : m)))

    // Persist
    try {
      const res = await fetch("/api/messages", {
        method: "PATCH",
        body: JSON.stringify({ messageId })
      });
      if (!res.ok) {
        throw new Error("Failed to mark message as read");
      }
    } catch (e) {
      console.error("Failed to mark message read:", e);
      // Rollback
      setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, readAt: null } : m)))
    }
  }, [])

  const addMessage = useCallback(async (message: Omit<Message, "id">) => {
    // Optimistic update
    const tempId = `msg-${Date.now()}`;
    setMessages((prev) => [...prev, { ...message, id: tempId }])

    // Persist
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({
          recipientId: message.recipientId,
          recipientRole: message.recipientRole,
          title: message.title,
          content: message.content,
          isUrgent: message.isUrgent
        })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send message");
      }
      const data = await res.json();
      if (data.id) {
        setMessages(prev => prev.map(m => m.id === tempId ? { ...m, id: data.id } : m));
      }
    } catch (e) {
      console.error("Failed to send message:", e);
      // Rollback
      setMessages(prev => prev.filter(m => m.id !== tempId));
      throw e;
    }
  }, [])

  const getProgramBySlug = useCallback(
    (slug: string) => {
      return programs.find((p) => p.slug === slug)
    },
    [programs],
  )

  const getSessionByNumber = useCallback(
    (programSlug: string, sessionNumber: number) => {
      const program = programs.find((p) => p.slug === programSlug)
      return program?.sessions.find((s) => s.sessionNumber === sessionNumber)
    },
    [programs],
  )

  const getEnrollmentsByParticipant = useCallback(
    (participantId: string) => {
      return enrollments.filter((e) => e.participantId === participantId)
    },
    [enrollments],
  )

  const getEnrollmentsByProgram = useCallback(
    (programId: string) => {
      return enrollments.filter((e) => e.programId === programId)
    },
    [enrollments],
  )

  const getActiveActivityRun = useCallback(
    (sessionId: string) => {
      return activityRuns.find((r) => r.sessionId === sessionId && r.status === "live")
    },
    [activityRuns],
  )

  const getResponsesForActivity = useCallback(
    (activityRunId: string) => {
      return participantResponses.filter((r) => r.activityRunId === activityRunId)
    },
    [participantResponses],
  )

  const getMessagesForParticipant = useCallback(
    (participantId: string) => {
      return messages
        .filter((m) => m.recipientId === participantId || m.senderId === participantId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    },
    [messages],
  )

  const getHomeworkForParticipant = useCallback(
    (participantId: string) => {
      const participantEnrollments = enrollments.filter(
        (e) => e.participantId === participantId && e.status === "active",
      )

      return participantEnrollments
        .map((enrollment) => {
          const program = programs.find((p) => p.id === enrollment.programId)
          const currentSession = program?.sessions.find((s) => s.sessionNumber === enrollment.currentSessionNumber)
          const submission = homeworkSubmissions.find(
            (hs) => hs.participantId === participantId && hs.sessionId === currentSession?.id,
          )

          return {
            program: program!,
            session: currentSession!,
            homework: submission || null,
          }
        })
        .filter((item) => item.program && item.session && item.session.homeworkTemplate)
    },
    [enrollments, programs, homeworkSubmissions],
  )

  const getJournalEntriesForParticipant = useCallback(
    (participantId: string) => {
      return journalEntries
        .filter((j) => j.participantId === participantId)
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    },
    [journalEntries],
  )

  const updateMakeupGroup = useCallback((updates: Partial<MakeupGroup>) => {
    setMakeupGroup((prev) => ({ ...prev, ...updates }))
  }, [])

  const addMakeupAssignment = useCallback((assignment: Omit<MakeupAssignment, "id">) => {
    const newAssignment: MakeupAssignment = {
      ...assignment,
      id: `ma-${Date.now()}`,
    }
    setMakeupAssignments((prev) => [...prev, newAssignment])
    setMakeupGroup((prev) => ({
      ...prev,
      participants: [...prev.participants, assignment.participantId],
    }))
  }, [])

  const updateMakeupAssignment = useCallback((id: string, updates: Partial<MakeupAssignment>) => {
    setMakeupAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)))
  }, [])

  const markParticipantAbsent = useCallback(
    (
      participantId: string,
      participantName: string,
      sessionId: string,
      programId: string,
      programName: string,
      sessionNumber: number,
    ) => {
      // Create makeup assignment
      const newAssignment: MakeupAssignment = {
        id: `ma-${Date.now()}`,
        participantId,
        participantName,
        missedSessionId: sessionId,
        missedProgramId: programId,
        missedProgramName: programName,
        missedSessionNumber: sessionNumber,
        missedDate: new Date().toISOString(),
        makeupDate: makeupGroup.date,
        makeupTime: makeupGroup.time,
        facilitatorId: makeupGroup.facilitatorId,
        facilitatorAssigned: false,
        assignedWorksheets: [],
        assignedReadings: [],
        assignedInstructions: "",
        status: "pending",
        checkedIn: false,
      }

      setMakeupAssignments((prev) => [...prev, newAssignment])
      setMakeupGroup((prev) => ({
        ...prev,
        participants: [...prev.participants, participantId],
      }))

      // Send urgent message to participant
      const participantMessage: Omit<Message, "id"> = {
        senderId: "system",
        senderRole: "admin",
        recipientId: participantId,
        recipientRole: "participant",
        title: "MAKEUP GROUP REQUIRED",
        content: `You missed ${programName} Session ${sessionNumber}. You are scheduled for the Makeup Group on ${new Date(makeupGroup.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at ${makeupGroup.time} in ${makeupGroup.room}. Please arrive on time with your phone ready to scan the QR code.`,
        fromName: "Administration",
        readAt: null,
        createdAt: new Date().toISOString(),
        isUrgent: true,
      }
      addMessage(participantMessage)

      // Send message to facilitator
      const facilitatorMessage: Omit<Message, "id"> = {
        senderId: "system",
        senderRole: "admin",
        recipientId: makeupGroup.facilitatorId,
        recipientRole: "facilitator",
        title: `Makeup Work Needed: ${participantName}`,
        content: `${participantName} missed ${programName} Session ${sessionNumber} and has been assigned to your Makeup Group on ${new Date(makeupGroup.date).toLocaleDateString()}. Please assign makeup work for this participant.`,
        fromName: "Administration",
        readAt: null,
        createdAt: new Date().toISOString(),
        isUrgent: false,
      }
      addMessage(facilitatorMessage)
    },
    [makeupGroup],
  )

  const assignMakeupWork = useCallback(
    (assignmentId: string, worksheets: string[], readings: string[], instructions: string) => {
      setMakeupAssignments((prev) =>
        prev.map((a) =>
          a.id === assignmentId
            ? {
              ...a,
              assignedWorksheets: worksheets,
              assignedReadings: readings,
              assignedInstructions: instructions,
              facilitatorAssigned: true,
              status: "work_assigned" as const,
            }
            : a,
        ),
      )
    },
    [],
  )

  const checkInToMakeup = useCallback((assignmentId: string) => {
    setMakeupAssignments((prev) => prev.map((a) => (a.id === assignmentId ? { ...a, checkedIn: true } : a)))
  }, [])

  const completeMakeupAssignment = useCallback((assignmentId: string) => {
    setMakeupAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, status: "completed" as const } : a)),
    )
  }, [])

  const getMakeupAssignmentsForFacilitator = useCallback(
    (facilitatorId: string) => {
      return makeupAssignments.filter((a) => a.facilitatorId === facilitatorId && a.status !== "completed")
    },
    [makeupAssignments],
  )

  const getMakeupAssignmentsForParticipant = useCallback(
    (participantId: string) => {
      return makeupAssignments.filter((a) => a.participantId === participantId && a.status !== "completed")
    },
    [makeupAssignments],
  )

  const getPendingMakeupAssignments = useCallback(() => {
    return makeupAssignments.filter((a) => a.status === "pending")
  }, [makeupAssignments])

  const addProgram = useCallback((program: Omit<Program, "id">) => {
    const newProgram: Program = {
      ...program,
      id: program.slug || `prog-${Date.now()}`,
    }
    setPrograms((prev) => [...prev, newProgram])
  }, [])

  const updateProgram = useCallback((id: string, updates: Partial<Program>) => {
    setPrograms((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }, [])

  const deleteProgram = useCallback((id: string) => {
    setPrograms((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const generateClassQRCode = useCallback(
    (qrCodeData: Omit<ClassQRCode, "id" | "code" | "generatedAt">): ClassQRCode => {
      const code = `CLASS-${qrCodeData.programId}-${qrCodeData.sessionNumber}-${Date.now()}`
      const newQRCode: ClassQRCode = {
        ...qrCodeData,
        id: `qr-${Date.now()}`,
        code,
        generatedAt: new Date().toISOString(),
      }
      setClassQRCodes((prev) => [...prev, newQRCode])
      return newQRCode
    },
    [],
  )

  const getQRCodeForClass = useCallback(
    (programId: string, sessionNumber: number, day: string, time: string) => {
      return classQRCodes.find(
        (qr) =>
          qr.programId === programId &&
          qr.sessionNumber === sessionNumber &&
          qr.day === day &&
          qr.time === time &&
          new Date(qr.expiresAt) > new Date(),
      )
    },
    [classQRCodes],
  )

  const validateCheckIn = useCallback(
    (
      participantId: string,
      qrCode: string,
      gpsLat: number | null,
      gpsLng: number | null,
    ): { success: boolean; error?: string; isVirtual?: boolean } => {
      const qrCodeRecord = classQRCodes.find((qr) => qr.code === qrCode)

      if (!qrCodeRecord) {
        return { success: false, error: "Invalid QR code. Please scan the correct code for this class." }
      }

      if (new Date(qrCodeRecord.expiresAt) < new Date()) {
        return { success: false, error: "This QR code has expired. Please ask your facilitator for a new code." }
      }

      // Virtual class - no GPS check needed
      if (qrCodeRecord.isVirtual) {
        return { success: true, isVirtual: true }
      }

      // In-person class - GPS validation required
      if (!gpsLat || !gpsLng) {
        return { success: false, error: "Location access is required. Please enable GPS and try again." }
      }

      if (!qrCodeRecord.gpsLatitude || !qrCodeRecord.gpsLongitude) {
        return { success: false, error: "This class location has not been set. Please contact your facilitator." }
      }

      // Calculate distance using Haversine formula
      const R = 6371e3 // Earth's radius in meters
      const φ1 = (gpsLat * Math.PI) / 180
      const φ2 = (qrCodeRecord.gpsLatitude * Math.PI) / 180
      const Δφ = ((qrCodeRecord.gpsLatitude - gpsLat) * Math.PI) / 180
      const Δλ = ((qrCodeRecord.gpsLongitude - gpsLng) * Math.PI) / 180

      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distance = R * c // Distance in meters

      if (distance > qrCodeRecord.gpsRadius) {
        return {
          success: false,
          error: `You are too far from the classroom (${Math.round(distance)}m away). Please move closer and try again.`,
        }
      }

      return { success: true, isVirtual: false }
    },
    [classQRCodes],
  )

  const recordCheckIn = useCallback(async (checkIn: Omit<CheckIn, "id">) => {
    const tempId = `checkin-${Date.now()}`;
    const newCheckIn: CheckIn = {
      ...checkIn,
      id: tempId,
    }
    setCheckIns((prev) => [...prev, newCheckIn])

    // Persist
    try {
      await fetch("/api/participant/attendance", {
        method: "POST",
        body: JSON.stringify({
          sessionId: checkIn.sessionId,
          participantId: checkIn.participantId,
          status: "present",
          verified: checkIn.verified,
          isVirtual: checkIn.wasVirtual
        })
      });
    } catch (e) {
      console.error("Failed to persist check-in:", e);
    }
  }, [])

  const getCheckInsForSession = useCallback(
    (sessionId: string) => {
      return checkIns.filter((c) => c.sessionId === sessionId)
    },
    [checkIns],
  )

  const markAbsentAfterClass = useCallback(
    (sessionId: string, programId: string, programName: string, sessionNumber: number) => {
      // Get all enrolled participants for this program
      const programEnrollments = enrollments.filter((e) => e.programId === programId && e.status === "active")

      // Get check-ins for this session
      const sessionCheckIns = checkIns.filter((c) => c.sessionId === sessionId)
      const checkedInParticipantIds = new Set(sessionCheckIns.map((c) => c.participantId))

      // Find participants who didn't check in
      programEnrollments.forEach((enrollment) => {
        if (!checkedInParticipantIds.has(enrollment.participantId)) {
          const participant = users.find((u) => u.id === enrollment.participantId)
          if (participant) {
            // This will create makeup assignment and send messages
            markParticipantAbsent(
              enrollment.participantId,
              participant.name,
              sessionId,
              programId,
              programName,
              sessionNumber,
            )
          }
        }
      })
    },
    [enrollments, checkIns, users, markParticipantAbsent],
  )

  return (
    <StoreContext.Provider
      value={{
        users,
        programs,
        enrollments,
        attendance,
        activityRuns,
        participantResponses,
        journalEntries,
        homeworkSubmissions,
        facilitatorNotes,
        quickNotes,
        messages,
        classQRCodes,
        checkIns,
        completedSessions,
        takeaways,
        currentUser,
        setCurrentUser,
        launchActivity,
        closeActivity,
        submitResponse,
        endSession,
        copyCaseworx,
        markMessageRead,
        addMessage,
        completeSession,
        addEnrollment,
        updateEnrollment,
        removeEnrollment,
        addJournalEntry,
        addHomeworkSubmission,
        updateHomeworkSubmission,
        addFacilitatorNote,
        addQuickNote,
        addTakeaway,
        addProgram,
        updateProgram,
        deleteProgram,
        getProgramBySlug,
        getSessionByNumber,
        getEnrollmentsByParticipant,
        getEnrollmentsByProgram,
        getActiveActivityRun,
        getResponsesForActivity,
        getMessagesForParticipant,
        getHomeworkForParticipant,
        getJournalEntriesForParticipant,
        makeupGroup,
        makeupAssignments,
        updateMakeupGroup,
        addMakeupAssignment,
        updateMakeupAssignment,
        markParticipantAbsent,
        assignMakeupWork,
        checkInToMakeup,
        completeMakeupAssignment,
        getMakeupAssignmentsForFacilitator,
        getMakeupAssignmentsForParticipant,
        getPendingMakeupAssignments,
        generateClassQRCode,
        getQRCodeForClass,
        validateCheckIn,
        recordCheckIn,
        getCheckInsForSession,
        markAbsentAfterClass,
        isHydrated,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
