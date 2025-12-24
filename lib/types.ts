// Core types for the Accountability Court Platform

export type UserRole = "admin" | "facilitator" | "participant"

export interface User {
  id: string
  role: UserRole
  name: string
  email: string
  phone?: string
  dateOfBirth?: string
  address?: string
  emergencyContact?: string
  emergencyPhone?: string
  caseNumber?: string
  referralSource?: string
  startDate?: string
  probationOfficer?: string
  notes?: string
}

export interface Program {
  id: string
  slug: string
  name: string
  description: string
  totalSessions: number
  isLocked: boolean
  sessions: Session[]
}

export interface Session {
  id: string
  programId: string
  sessionNumber: number
  title: string
  purpose: string
  objectives: string[]
  facilitatorPrompts: FacilitatorPrompt[]
  activityTemplates: ActivityTemplate[]
  homeworkTemplate: HomeworkTemplate | null
  journalTemplateId: string | null
  caseworxNoteTemplate: string
}

export interface FacilitatorPrompt {
  id: string
  section: "overview" | "opening" | "review" | "teach" | "activity" | "wrapup"
  content: string
  suggestedPacing?: string
}

export interface ActivityTemplate {
  id: string
  type: "prompt" | "worksheet" | "poll"
  title: string
  instructions: string
  questions: ActivityQuestion[]
}

export interface ActivityQuestion {
  id: string
  text: string
  type: "text" | "multiple_choice" | "scale"
  options?: string[]
}

export interface HomeworkTemplate {
  id: string
  title: string
  steps: string[]
  dueDescription: string
}

export interface Enrollment {
  id: string
  participantId: string
  programId: string
  currentSessionNumber: number
  status: "active" | "completed" | "paused"
  startedAt: string
}

export interface Attendance {
  id: string
  participantId: string
  sessionId: string
  attended: boolean
  completedAt: string | null
}

export interface ActivityRun {
  id: string
  sessionId: string
  activityTemplateId: string
  status: "draft" | "live" | "closed"
  startedAt: string | null
  closedAt: string | null
}

export interface ParticipantResponse {
  id: string
  activityRunId: string
  participantId: string
  answers: Record<string, string>
  submittedAt: string
}

export interface JournalEntry {
  id: string
  participantId: string
  programId: string
  sessionNumber: number
  content: string
  submittedAt: string
}

export interface HomeworkSubmission {
  id: string
  participantId: string
  sessionId: string
  content: string
  status: "pending" | "approved" | "revision_requested"
  submittedAt: string
  reviewedAt: string | null
  feedback: string | null
}

export interface FacilitatorNote {
  id: string
  facilitatorId: string
  sessionId: string
  content: string
  createdAt: string
}

export interface QuickNote {
  id: string
  facilitatorId: string
  sessionId: string
  content: string
  createdAt: string
}

export interface Message {
  id: string
  participantId: string
  title: string
  content: string
  fromName: string
  readAt: string | null
  createdAt: string
  isUrgent?: boolean // Added urgent flag for makeup group notifications
}

export interface MakeupAssignment {
  id: string
  participantId: string
  participantName: string
  missedSessionId: string
  missedProgramId: string
  missedProgramName: string
  missedSessionNumber: number
  missedDate: string
  makeupDate: string
  makeupTime: string
  facilitatorId: string
  facilitatorAssigned: boolean // Has the facilitator assigned work?
  assignedWorksheets: string[]
  assignedReadings: string[]
  assignedInstructions: string
  assignedAt?: string // Added for CP5 admin assignment
  status: "pending" | "assigned" | "work_assigned" | "completed"
  checkedIn: boolean
}

export interface MakeupGroup {
  id: string
  date: string // e.g., "2025-01-04" (first Saturday)
  time: string // e.g., "10:00 AM"
  facilitatorId: string
  facilitatorName: string
  room: string
  qrCode: string
  participants: string[] // participant IDs
}

export interface ClassQRCode {
  id: string
  facilitatorId: string
  programId: string
  programName: string
  sessionNumber: number
  day: string
  time: string
  room: string
  isVirtual: boolean
  virtualLink?: string
  gpsLatitude: number | null
  gpsLongitude: number | null
  gpsRadius: number // meters - how close participant must be
  generatedAt: string
  expiresAt: string // QR codes expire after class time
  code: string // unique code embedded in QR
}

export interface CheckIn {
  id: string
  participantId: string
  qrCodeId: string
  sessionId: string
  checkedInAt: string
  gpsLatitude: number | null
  gpsLongitude: number | null
  wasVirtual: boolean
  verified: boolean
}

export interface AttendanceRecord {
  id: string
  participantId: string
  programId: string
  sessionNumber: number
  checkInAt: string // ISO timestamp
  isVirtual: boolean // mapped from wasVirtual
  gpsLat?: number // mapped from gpsLatitude
  gpsLng?: number // mapped from gpsLongitude
  verified: boolean
  qrCodeId?: string
}

export interface TakeawaySubmission {
  id: string
  participantId: string
  programId: string
  sessionNumber: number
  submittedAt: string // ISO timestamp
  text: string
}
