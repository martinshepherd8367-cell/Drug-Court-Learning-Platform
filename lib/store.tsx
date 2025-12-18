"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
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

  // CRUD helpers
  addEnrollment: (enrollment: Omit<Enrollment, "id">) => void
  updateEnrollment: (id: string, updates: Partial<Enrollment>) => void
  addJournalEntry: (entry: Omit<JournalEntry, "id">) => void
  addHomeworkSubmission: (submission: Omit<HomeworkSubmission, "id">) => void
  updateHomeworkSubmission: (id: string, updates: Partial<HomeworkSubmission>) => void
  addFacilitatorNote: (note: Omit<FacilitatorNote, "id">) => void
  addQuickNote: (note: Omit<QuickNote, "id">) => void

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
}

const StoreContext = createContext<StoreState | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [users] = useState<User[]>(mockUsers)
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
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[3])

  // Added makeup group state
  const [makeupGroup, setMakeupGroup] = useState<MakeupGroup>(initialMakeupGroup)
  const [makeupAssignments, setMakeupAssignments] = useState<MakeupAssignment[]>(initialMakeupAssignments)

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

  const endSession = useCallback((sessionId: string, participantId: string) => {
    const newAttendance: Attendance = {
      id: `att-${Date.now()}`,
      participantId,
      sessionId,
      attended: true,
      completedAt: new Date().toISOString(),
    }
    setAttendance((prev) => [...prev, newAttendance])
  }, [])

  const copyCaseworx = useCallback(
    (sessionId: string): string => {
      const program = programs.find((p) => p.sessions.some((s) => s.id === sessionId))
      const session = program?.sessions.find((s) => s.id === sessionId)
      return session?.caseworxNoteTemplate || ""
    },
    [programs],
  )

  const addEnrollment = useCallback((enrollment: Omit<Enrollment, "id">) => {
    setEnrollments((prev) => [...prev, { ...enrollment, id: `enr-${Date.now()}` }])
  }, [])

  const updateEnrollment = useCallback((id: string, updates: Partial<Enrollment>) => {
    setEnrollments((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)))
  }, [])

  const addJournalEntry = useCallback((entry: Omit<JournalEntry, "id">) => {
    setJournalEntries((prev) => [...prev, { ...entry, id: `je-${Date.now()}` }])
  }, [])

  const addHomeworkSubmission = useCallback((submission: Omit<HomeworkSubmission, "id">) => {
    setHomeworkSubmissions((prev) => [...prev, { ...submission, id: `hs-${Date.now()}` }])
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

  const markMessageRead = useCallback((messageId: string) => {
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, readAt: new Date().toISOString() } : m)))
  }, [])

  const addMessage = useCallback((message: Omit<Message, "id">) => {
    setMessages((prev) => [...prev, { ...message, id: `msg-${Date.now()}` }])
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
        .filter((m) => m.participantId === participantId)
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
      const participantMessage: Message = {
        id: `msg-${Date.now()}`,
        participantId,
        title: "MAKEUP GROUP REQUIRED",
        content: `You missed ${programName} Session ${sessionNumber}. You are scheduled for the Makeup Group on ${new Date(makeupGroup.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at ${makeupGroup.time} in ${makeupGroup.room}. Please arrive on time with your phone ready to scan the QR code.`,
        fromName: "Administration",
        readAt: null,
        createdAt: new Date().toISOString(),
        isUrgent: true,
      }
      setMessages((prev) => [...prev, participantMessage])

      // Send message to facilitator
      const facilitatorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        participantId: makeupGroup.facilitatorId,
        title: `Makeup Work Needed: ${participantName}`,
        content: `${participantName} missed ${programName} Session ${sessionNumber} and has been assigned to your Makeup Group on ${new Date(makeupGroup.date).toLocaleDateString()}. Please assign makeup work for this participant.`,
        fromName: "Administration",
        readAt: null,
        createdAt: new Date().toISOString(),
        isUrgent: false,
      }
      setMessages((prev) => [...prev, facilitatorMessage])
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
        currentUser,
        setCurrentUser,
        launchActivity,
        closeActivity,
        submitResponse,
        endSession,
        copyCaseworx,
        markMessageRead,
        addMessage,
        addEnrollment,
        updateEnrollment,
        addJournalEntry,
        addHomeworkSubmission,
        updateHomeworkSubmission,
        addFacilitatorNote,
        addQuickNote,
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
        addProgram,
        updateProgram,
        deleteProgram,
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
