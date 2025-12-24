import type {
  Program,
  User,
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
import { curriculaPrograms } from "./curricula"

// Mock Users
export const mockUsers: User[] = [
  { id: "admin-1", role: "admin", name: "Clinical Director", email: "admin@dmsclinicalservices.com" },
  { id: "facilitator-1", role: "facilitator", name: "Martin Thompson", email: "martin@dmsclinicalservices.com" },
  { id: "facilitator-2", role: "facilitator", name: "Sarah Johnson", email: "sarah@dmsclinicalservices.com" },
  {
    id: "participant-1",
    role: "participant",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 234-5678",
    dateOfBirth: "03/15/1985",
    address: "456 Oak Street, Springfield, IL 62701",
    emergencyContact: "Mary Doe",
    emergencyPhone: "(555) 234-9999",
    caseNumber: "AC-2024-001234",
    referralSource: "Drug Court",
    startDate: "01/15/2024",
    probationOfficer: "Officer Williams",
    notes: "Responds well to group discussions. Making good progress.",
  },
  {
    id: "participant-2",
    role: "participant",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 345-6789",
    dateOfBirth: "07/22/1990",
    address: "789 Maple Ave, Springfield, IL 62702",
    emergencyContact: "Robert Smith",
    emergencyPhone: "(555) 345-8888",
    caseNumber: "AC-2024-001456",
    referralSource: "Probation",
    startDate: "02/01/2024",
    probationOfficer: "Officer Martinez",
    notes: "Excellent attendance. Very engaged in activities.",
  },
  {
    id: "participant-3",
    role: "participant",
    name: "Mike Wilson",
    email: "mike.wilson@example.com",
    phone: "(555) 456-7890",
    dateOfBirth: "11/08/1988",
    address: "321 Pine Road, Springfield, IL 62703",
    emergencyContact: "Linda Wilson",
    emergencyPhone: "(555) 456-7777",
    caseNumber: "AC-2024-001789",
    referralSource: "Drug Court",
    startDate: "01/22/2024",
    probationOfficer: "Officer Johnson",
    notes: "Working on coping skills. Some difficulty with homework completion.",
  },
  {
    id: "participant-4",
    role: "participant",
    name: "Emily Brown",
    email: "emily.brown@example.com",
    phone: "(555) 567-8901",
    dateOfBirth: "05/30/1992",
    address: "654 Elm Court, Springfield, IL 62704",
    emergencyContact: "David Brown",
    emergencyPhone: "(555) 567-6666",
    caseNumber: "AC-2024-002001",
    referralSource: "Mental Health Court",
    startDate: "02/15/2024",
    probationOfficer: "Officer Davis",
    notes: "Strong family support system. Very motivated.",
  },
]

// Mock Programs with Sessions
export const mockPrograms = curriculaPrograms

// Mock Enrollments
export const mockEnrollments: Enrollment[] = [
  {
    id: "enr-1",
    participantId: "participant-1",
    programId: "prime-solutions",
    currentSessionNumber: 3,
    status: "active",
    startedAt: "2025-01-01",
  },
  {
    id: "enr-2",
    participantId: "participant-2",
    programId: "prime-solutions",
    currentSessionNumber: 5,
    status: "active",
    startedAt: "2024-12-15",
  },
  {
    id: "enr-3",
    participantId: "participant-3",
    programId: "prime-solutions",
    currentSessionNumber: 1,
    status: "active",
    startedAt: "2025-01-10",
  },
  {
    id: "enr-4",
    participantId: "participant-4",
    programId: "prime-solutions",
    currentSessionNumber: 8,
    status: "active",
    startedAt: "2024-11-01",
  },
  // Add CAT enrollment for participant-4
  {
    id: "enr-5",
    participantId: "participant-4",
    programId: "cat",
    currentSessionNumber: 4,
    status: "active",
    startedAt: "2024-12-01",
  },
]

// Mock Attendance
export const mockAttendance: Attendance[] = [
  { id: "att-1", participantId: "participant-1", sessionId: "prime-1", attended: true, completedAt: "2025-01-08" },
  { id: "att-2", participantId: "participant-1", sessionId: "prime-2", attended: true, completedAt: "2025-01-15" },
  { id: "att-3", participantId: "participant-2", sessionId: "prime-1", attended: true, completedAt: "2024-12-20" },
  { id: "att-4", participantId: "participant-2", sessionId: "prime-2", attended: false, completedAt: null },
]

// Mock Activity Runs
export const mockActivityRuns: ActivityRun[] = []

// Mock Participant Responses
export const mockParticipantResponses: ParticipantResponse[] = []

// Mock Journal Entries
export const mockJournalEntries: JournalEntry[] = [
  {
    id: "je-1",
    participantId: "participant-1",
    programId: "prime-solutions",
    sessionNumber: 1,
    content: "Today I learned about the stages of change. I think I am in the contemplation stage.",
    submittedAt: "2025-01-08",
  },
  {
    id: "je-2",
    participantId: "participant-1",
    programId: "prime-solutions",
    sessionNumber: 2,
    content: "Working on my action plan. It is hard but I am trying.",
    submittedAt: "2025-01-15",
  },
  // Journal entries for participant-4 (Emily Brown)
  {
    id: "je-3",
    participantId: "participant-4",
    programId: "prime-solutions",
    sessionNumber: 7,
    content:
      "Today's session about building support networks really hit home. I realized I've been isolating myself and need to reach out more. Going to call my sister tonight.",
    submittedAt: "2025-01-10",
  },
  {
    id: "je-4",
    participantId: "participant-4",
    programId: "prime-solutions",
    sessionNumber: 8,
    content:
      "Feeling more confident about my recovery plan. The group discussion helped me see that I'm not alone in my struggles. Grateful for this program.",
    submittedAt: "2025-01-15",
  },
  {
    id: "je-5",
    participantId: "participant-4",
    programId: "cat",
    sessionNumber: 3,
    content:
      "Learning about thinking errors was eye-opening. I never realized how much my negative self-talk was affecting my mood and decisions.",
    submittedAt: "2025-01-14",
  },
]

// Mock Homework Submissions
export const mockHomeworkSubmissions: HomeworkSubmission[] = [
  {
    id: "hs-1",
    participantId: "participant-1",
    sessionId: "prime-1",
    content:
      "My goal is to attend all sessions. Steps: 1. Set reminders, 2. Arrange transportation, 3. Tell my sponsor",
    status: "approved",
    submittedAt: "2025-01-09",
    reviewedAt: "2025-01-10",
    feedback: "Great start!",
  },
  {
    id: "hs-2",
    participantId: "participant-2",
    sessionId: "prime-3",
    content: "I analyzed my last relapse. Trigger was stress from work.",
    status: "pending",
    submittedAt: "2025-01-12",
    reviewedAt: null,
    feedback: null,
  },
  // Homework for participant-4 (Emily Brown)
  {
    id: "hs-3",
    participantId: "participant-4",
    sessionId: "prime-7",
    content:
      "My support network includes: 1) My sister Mary - daily check-ins, 2) Sponsor Jim - weekly meetings, 3) Neighbor Carol - emergency contact. I will reach out to each of them this week to confirm their availability.",
    status: "approved",
    submittedAt: "2025-01-10",
    reviewedAt: "2025-01-11",
    feedback: "Excellent work identifying your support network! I love that you have specific plans for each person.",
  },
  {
    id: "hs-4",
    participantId: "participant-4",
    sessionId: "prime-8",
    content:
      "Working on my relapse prevention plan. Main triggers: stress at work, arguments with family, feeling isolated. Coping strategies: call sponsor, go for a walk, use breathing exercises.",
    status: "pending",
    submittedAt: "2025-01-15",
    reviewedAt: null,
    feedback: null,
  },
  {
    id: "hs-5",
    participantId: "participant-4",
    sessionId: "cat-3",
    content:
      "Thinking errors I identified: 1) All-or-nothing thinking when I make a mistake, 2) Mind reading - assuming others are judging me, 3) Catastrophizing small problems.",
    status: "revision",
    submittedAt: "2025-01-14",
    reviewedAt: "2025-01-15",
    feedback: "Good start identifying your thinking errors. Can you add specific examples from this week for each one?",
  },
]

// Mock Facilitator Notes
export const mockFacilitatorNotes: FacilitatorNote[] = []

// Mock Quick Notes
export const mockQuickNotes: QuickNote[] = []

export const mockMessages: Message[] = [
  {
    id: "msg-1",
    participantId: "participant-1",
    title: "Welcome to Prime Solutions",
    content:
      "Welcome to the Prime Solutions program! We're excited to have you join us on this journey. Please make sure to complete your first session homework before our next meeting.",
    fromName: "Martin Thompson",
    readAt: null,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-2",
    participantId: "participant-1",
    title: "Reminder: Session 2 Tomorrow",
    content:
      "Just a friendly reminder that Session 2 is tomorrow at 10 AM. We'll be discussing the Stages of Change. Please bring your completed Action Plan worksheet.",
    fromName: "Martin Thompson",
    readAt: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-3",
    participantId: "participant-1",
    title: "Great Progress!",
    content:
      "I wanted to acknowledge the great progress you've made in identifying your triggers. Keep up the excellent work!",
    fromName: "Sarah Johnson",
    readAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-4",
    participantId: "participant-2",
    title: "Welcome to the Program",
    content: "Welcome! Looking forward to working with you.",
    fromName: "Martin Thompson",
    readAt: null,
    createdAt: new Date().toISOString(),
  },
  // Messages for participant-4 (Emily Brown - current dev user)
  {
    id: "msg-5",
    participantId: "participant-4",
    title: "Welcome to Prime Solutions!",
    content:
      "Hi Emily, welcome to the Prime Solutions program! We're excited to have you join our Tuesday/Thursday group. Your first session will cover Understanding Change. Please arrive 10 minutes early to complete check-in.",
    fromName: "Martin Thompson",
    readAt: null,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-6",
    participantId: "participant-4",
    title: "Homework Feedback - Session 3",
    content:
      "Great work on your Action Plan! I can see you put a lot of thought into identifying your support network. One suggestion: consider adding a backup contact for each situation. Keep it up!",
    fromName: "Sarah Johnson",
    readAt: null,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-7",
    participantId: "participant-4",
    title: "Session 8 Tomorrow - Reminder",
    content:
      "Just a reminder that we have Session 8: Building Your Support Network tomorrow at 10:30 AM in Room 102. Please bring your completed Relapse Prevention Plan worksheet.",
    fromName: "Martin Thompson",
    readAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-8",
    participantId: "participant-4",
    title: "Court Report Submitted",
    content:
      "Your progress report has been submitted to the court. You are on track with attendance and participation. Keep up the excellent work! Let me know if you have any questions.",
    fromName: "Clinical Director",
    readAt: null,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
]
