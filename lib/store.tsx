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
}

const StoreContext = createContext<StoreState | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [users] = useState<User[]>(mockUsers)
  const [programs] = useState<Program[]>(mockPrograms)
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
        addEnrollment,
        updateEnrollment,
        addJournalEntry,
        addHomeworkSubmission,
        updateHomeworkSubmission,
        addFacilitatorNote,
        addQuickNote,
        markMessageRead,
        addMessage,
        getProgramBySlug,
        getSessionByNumber,
        getEnrollmentsByParticipant,
        getEnrollmentsByProgram,
        getActiveActivityRun,
        getResponsesForActivity,
        getMessagesForParticipant,
        getHomeworkForParticipant,
        getJournalEntriesForParticipant,
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
