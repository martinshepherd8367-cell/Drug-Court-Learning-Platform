// TypeScript types for the curriculum system

export type SectionType =
  | "objectives"
  | "coreConcept"
  | "facilitatorTalkingPoints"
  | "exercises"
  | "participantTakeaways"
  | "wrapUp"

export interface ContentBlock {
  id: string
  type: "paragraph" | "bullets" | "steps" | "callout" | "script"
  label?: string
  content: string | string[]
  facilitatorOnly?: boolean
}

export interface CurriculumSection {
  id: string
  type: SectionType
  title: string
  duration: number // in minutes
  blocks: ContentBlock[]
  completed: boolean
}

export interface ParticipantPrompt {
  id: string
  prompt: string
  type: "reflection" | "action" | "homework"
}

export interface ParticipantSubmission {
  id: string
  participantName: string
  promptId: string
  response: string
  submittedAt: Date
}

export interface Session {
  id: string
  number: number
  title: string
  overview: string
  totalDuration: number // in minutes
  sections: CurriculumSection[]
  participantPrompts: ParticipantPrompt[]
  homework: string
  workbookPages: string
}

export interface Program {
  id: string
  name: string
  description: string
  totalSessions: number
  sessions: Session[]
}

export type SessionStatus = "notStarted" | "live" | "paused" | "completed"
