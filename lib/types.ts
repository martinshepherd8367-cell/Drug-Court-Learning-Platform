// Core types for the Accountability Court Platform

export type UserRole = "admin" | "facilitator" | "participant" | "case_manager"

export interface User {
  id: string
  role: UserRole
  name: string
  email: string
  phone?: string
  status?: "active" | "inactive" | "paused"
  isProfileOnly?: boolean
  dateOfBirth?: string
  address?: string
  emergencyContact?: string
  emergencyPhone?: string
  caseNumber?: string
  referralSource?: string
  startDate?: string
  probationOfficer?: string
  notes?: string
  courtId?: string
  county?: string
  caseManagerId?: string
  pauseReason?: string
  pauseDate?: string
  expectedReturnDate?: string
  // Facilitator Specific
  agency?: string
  credentials?: string
  certifications?: string[]
  authorizedPrograms?: string[] // program IDs
  availabilityNotes?: string
}

export interface FacilitatorProfileUpdate {
  id: string
  facilitatorId: string
  changes: {
    phone?: string
    email?: string
    address?: string
    credentials?: string
    certifications?: string[]
    availabilityNotes?: string
  }
  status: "pending" | "approved" | "rejected"
  timestamp: string // Matches 'submittedAt' but renamed for implementation consistency
  reviewedAt?: string
  reviewedBy?: string
  adminNote?: string
}

export interface FacilitatorHistoryRecord {
  id: string
  facilitatorId: string
  fieldName: string
  oldValue: any
  newValue: any
  changedBy: string
  changedAt: string
  type: string
  reason?: string
}

export interface Court {
  id: string
  name: string
  caseManagerIds: string[]
}

export interface CaseManager {
  id: string
  name: string
  email: string
  courtIds: string[]
  participantCount: number
}

export interface Program {
  id: string
  slug: string
  name: string
  description: string
  totalSessions: number
  type: string
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
  schedule?: {
    day: string
    time: string
    room: string
    facilitatorId: string
  }
}

export interface Attendance {
  id: string
  participantId: string
  sessionId: string
  classId: string
  attended: boolean
  status: "present" | "absent" | "excused"
  completedAt: string | null
  isCorrection?: boolean
  originalRecordId?: string
  correctionReason?: string
  correctedBy?: string
  correctedAt?: string
}

export interface CompletedSession {
  id: string
  classId: string
  programId: string
  sessionNumber: number
  facilitatorId: string
  completedAt: string
  attendeeIds: string[]
  absenteeIds: string[]
  excusedIds: string[]
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

export interface Takeaway {
  id: string
  participantId: string
  sessionId: string
  classId: string
  content: string
  createdBy: string
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
  senderId: string
  senderRole: UserRole
  recipientId: string
  recipientRole: UserRole
  title: string
  content: string
  fromName: string
  readAt: string | null
  createdAt: string
  isUrgent?: boolean
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
  status: "pending" | "work_assigned" | "completed"
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
  wasVirtual: boolean
  verified: boolean
}

export interface ScheduleEvent {
  id: string
  programId: string
  programName: string
  facilitatorId: string
  facilitatorName: string
  date: string
  dayOfWeek: string
  time: string
  location: string
  active: boolean
  sessionId: string
  sessionNumber: number
}
export interface CourtPrepSnapshot {
  id: string
  courtId: string
  snapshotGeneratedAt: string
  generatedBy: string
  snapshotData: {
    participants: any[]
    activity: {
      completions: any[]
      attendance: any[]
      takeaways: any[]
    }
  }
  approvedContent: Record<string, {
    suggestedTakeaway: string
    suggestedJudgeQuestion: string
    adminNote?: string
  }>
}
