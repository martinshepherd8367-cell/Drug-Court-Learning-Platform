# Drug Court Learning Platform

A role-based web application designed to support accountability court participants and facilitators during structured psychoeducational programs. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Table of Contents

1. [Core Architecture](#core-architecture)
2. [Current Status](#current-status-build-phase)
3. [User Roles](#user-roles)
4. [File Structure](#file-structure)
5. [Data Models](#data-models)
6. [Feature Documentation](#feature-documentation)
7. [Adding New Curricula](#adding-new-curricula)
8. [AI Assistant Integration](#ai-assistant-integration)
9. [Makeup Group System](#makeup-group-system)
10. [Class Check-In System](#class-check-in-system)
11. [Development Mode](#development-mode)
12. [Integration Points (TODO)](#integration-points-todo)

---

## Core Architecture

### Design Principles

- **Program templates and sessions rendered differently by role** - One curriculum source, three role-specific views (Admin manages, Facilitator delivers, Participant receives)
- **Curriculum sessions are ordered by sessionNumber and have no time** - Sessions are sequenced content units, not calendar events
- **Schedule calendar is separate and stores real meeting dates/times** - May reference `programSlug` + `sessionNumber` but is its own entity
- **Minimal cognitive load** for participants
- **Facilitator-first content design**
- **Three-zone facilitation console** for session delivery

### Curriculum vs Schedule (Important Distinction)

| Aspect | Curriculum | Schedule Calendar |
|--------|-----------|-------------------|
| Purpose | Ordered content delivery | Real-world meeting events |
| Time | No dates/times, only `sessionNumber` | Specific day, time, location |
| Storage | `Program.sessions[]` | `Enrollment.schedule` (temporary) → TODO: separate `ScheduleEvent` entity |
| Example | "Session 3: Cognitive Distortions" | "Monday 10:30 AM, Room 101" |

### Two-Layer Editing Governance (Planned for Antigravity)

- **Deep Layer (Admin/Dev Only)**: New programs, session structures, journal templates, dashboard configurations. Changes are versioned and require publishing approval.
- **Shallow Layer (Easy Edits)**: One-off worksheet/homework/video add-ons per session. Can be approved and published by facilitators with admin oversight.

### Technology Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Context for state management (TODO: Replace with database)
- shadcn/ui components

---

## Current Status (Build Phase)

- UI scaffolding implemented for Admin/Facilitator/Participant dashboards and schedule grid.
- DEV_MODE bypass exists for build/testing and **MUST be removed before production**.
- Curriculum is currently mock/seed data; database + versioning will be implemented in Antigravity.
- CaseWorx export is manual copy/paste today; automation is future work.

---

## User Roles

### Admin (`/admin`)
- Full system oversight and configuration
- User management (create/edit/delete facilitators and participants)
- Program management (view programs; curriculum editing via versioned publish workflow planned)
- Enrollment management (assign participants to programs)
- Schedule management (weekly grid calendar)
- Makeup group configuration
- Reports and CaseWorx integration
- AI Assistant for schedule optimization (Planned - TODO)

### Facilitator (`/facilitator`)
- Program and session delivery
- Three-zone session console (header controls, navigation spine, content workspace)
- Participant management (view by class)
- Homework review and feedback
- Daily journal review
- Makeup work assignment
- Messaging to participants
- CaseWorx note copying
- QR code generation (in-person with GPS or virtual)
- AI Assistant for session guidance (Planned - TODO)

### Participant (`/participant`)
- Simplified, task-focused interface
- Weekly schedule grid with enrolled classes
- Messages from facilitators/admin
- Homework submissions
- Daily journal entries
- Achievement badges (animated)
- Makeup group sessions
- Class check-in via QR scan
- AI Assistant for term definitions (restricted from homework answers) (Planned - TODO)

---

## File Structure

```
├── app/
│   ├── page.tsx                    # Landing page with role selection and sign-in
│   ├── layout.tsx                  # Root layout with StoreProvider
│   ├── globals.css                 # Global styles, animations, transparency settings
│   │
│   ├── admin/
│   │   ├── page.tsx                # Admin dashboard
│   │   ├── programs/
│   │   │   ├── page.tsx            # Program management (create/import curricula)
│   │   │   └── [programId]/
│   │   │       └── sessions/
│   │   │           └── page.tsx    # Session management for a program
│   │   ├── users/
│   │   │   └── page.tsx            # User management
│   │   ├── enrollments/
│   │   │   └── page.tsx            # Enrollment management with participant details
│   │   ├── schedule/
│   │   │   └── page.tsx            # Weekly schedule grid (Mon-Fri + Saturday specials)
│   │   └── reports/
│   │       └── page.tsx            # Reports and CaseWorx export
│   │
│   ├── facilitator/
│   │   ├── page.tsx                # Facilitator dashboard
│   │   └── programs/
│   │       └── [programSlug]/
│   │           ├── page.tsx        # Program overview
│   │           └── sessions/
│   │               └── [sessionNumber]/
│   │                   └── page.tsx # Three-zone session console
│   │
│   └── participant/
│       ├── page.tsx                # Participant dashboard
│       ├── check-in/
│       │   └── page.tsx            # Class check-in with QR scan and GPS
│       ├── journal/
│       │   └── page.tsx            # Journal archive
│       ├── makeup/
│       │   └── page.tsx            # Makeup group session interface
│       └── programs/
│           └── [programSlug]/
│               ├── page.tsx        # Program overview
│               └── sessions/
│                   └── [sessionNumber]/
│                       └── page.tsx # Participant session view
│
├── components/
│   ├── ai-assistant.tsx            # AI Assistant component (role-aware)
│   ├── role-nav.tsx                # Role-based navigation component
│   └── ui/                         # shadcn/ui components
│
├── lib/
│   ├── types.ts                    # TypeScript type definitions
│   ├── store.tsx                   # React Context store with all state management
│   └── mock-data.ts                # Mock data for development
│
└── public/
    └── images/
        └── image.png               # Background image (mountain scene)
```

---

## Data Models

### Core Types (lib/types.ts)

```typescript
// User with demographics
interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'facilitator' | 'participant'
  demographics?: {
    phone, dateOfBirth, address, city, state, zip,
    emergencyContact, emergencyPhone, caseNumber, probationOfficer
  }
}

// Program (curriculum template - no dates/times)
interface Program {
  id: string
  slug: string
  title: string
  description: string
  totalSessions: number
  sessions: Session[]
  locked: boolean
}

// Session within a program (ordered by sessionNumber, no time)
interface Session {
  id: string
  programId: string
  sessionNumber: number  // Ordering only, not a calendar event
  title: string
  objectives: string[]
  sections: CurriculumSection[]
  facilitatorPrompt?: string
  participantPrompt?: string
  homeworkTemplate?: HomeworkTemplate
  caseworxNoteTemplate?: string
}

// Curriculum section (facilitator vs participant content)
interface CurriculumSection {
  id: string
  title: string
  type: 'intro' | 'content' | 'activity' | 'discussion' | 'homework' | 'wrapup'
  facilitatorContent: ContentBlock[]
  participantContent: ContentBlock[]
  duration?: number
}

// Content block
interface ContentBlock {
  type: 'text' | 'prompt' | 'script' | 'list' | 'worksheet' | 'video' | 'reading'
  content: string
  items?: string[]
}

// Enrollment (links participant to program with schedule)
// TODO: Schedule should eventually be its own entity (ScheduleEvent) instead of living inside Enrollment
interface Enrollment {
  id: string
  participantId: string  // Fixed typo from "odipantId"
  programId: string
  currentSession: number
  status: 'active' | 'paused' | 'completed'
  startDate: string
  schedule: { day, time, room, facilitatorId }  // Real-world meeting info
}

// Class QR Code (for check-in)
interface ClassQRCode {
  id: string
  sessionId: string
  facilitatorId: string
  code: string
  isVirtual: boolean
  gpsLat?: number
  gpsLng?: number
  virtualMeetingLink?: string
  createdAt: string
  expiresAt: string
}

// Check-In Record
interface CheckIn {
  id: string
  participantId: string
  sessionId: string
  qrCodeId: string
  timestamp: string
  gpsLat?: number
  gpsLng?: number
  isVirtual: boolean
  verified: boolean
}

// Makeup Assignment
interface MakeupAssignment {
  id: string
  participantId: string
  missedSessionId: string
  programId: string
  assignedDate: string
  makeupGroupId: string
  status: 'pending' | 'assigned' | 'completed'
  assignedWork?: {
    worksheets: string[]
    readings: string[]
    instructions: string
  }
}

// Message
interface Message {
  id: string
  participantId: string
  title: string
  content: string
  fromName: string
  readAt: string | null
  createdAt: string
  isUrgent?: boolean
}
```

---

## Feature Documentation

### Sign-In Page (`/`)

- Three role cards: Admin, Facilitator, Participant
- Admin/Facilitator: Email + password authentication **(Planned - not yet wired)**
- Participant: QR code scan + email verification **(Planned - not yet wired)**
- **DEV_MODE bypass**: Set `DEV_MODE = true` at top of file for development
  - **WARNING: MUST REMOVE BEFORE PROD** - This bypasses all authentication

### Admin Dashboard

- Stats cards (total participants, active programs, sessions this week, completion rate)
- Registration QR code display
- Quick links to all admin sections
- AI Assistant button (purple gradient) **(Planned - TODO)**

### Admin Schedule (`/admin/schedule`)

- Weekly grid: Monday-Friday
- Time slots: Morning (9:00 AM, 10:30 AM), Afternoon (12:00 PM, 1:00 PM, 4:00 PM, 5:30 PM, 7:00 PM)
- Color-coded progress: Green (0-25%), Blue (25-50%), Yellow (50-75%), Red (75-100%)
- Click class to see details, participants, demographics
- Saturday Special Groups section at bottom
- Makeup Group with editable date/time
- Participant status: Red (needs work assigned), Green (work assigned)

### Facilitator Dashboard

- Weekly schedule grid (scaled 65%)
- Quick access buttons: "In-Person QR" and "Virtual Class" in header
- View Participants button (grouped by class, then list)
- Copy to CaseWorx button (pending exports)
- Messages section with reply
- Homework Review with common feedback dropdown (Approve/Request Revision buttons turn blue when clicked)
- Daily Journals section
- Makeup Work Needed section (assign worksheets/readings)
- Awaiting Revision button (shows homework sent back)
- Notifications with badge clearing
- Settings with QR code generation

### Participant Dashboard

- Weekly schedule grid (mobile-responsive, horizontal scroll on small screens)
- Messages card (unread indicator, compose new, reply)
- Homework card (pending assignments)
- Journal card (quick entry, archive link)
- My Programs card (progress bars)
- Achievements section (last 3 shown, click to see all with locked/earned status)
- Makeup Group notice (red urgent card when assigned)
- AI Assistant button **(Planned - restricted from homework answers)**

### Three-Zone Facilitation Console

- **Zone A (Header)**: Session title, timer, progress bar, participant count, controls
- **Zone B (Navigation Spine)**: Collapsible sections with checkboxes, completion tracking
- **Zone C (Content Workspace)**: Active section content, facilitator scripts, activities

---

## Adding New Curricula

### Method 1: Direct Code Addition / Seed Scripts (Primary Method for Production)

This is the recommended method for initial production builds until Antigravity wiring is complete.

1. Create new file in `lib/` (e.g., `anger-management-program.ts`)
2. Follow the Program/Session/CurriculumSection structure (see below)
3. Export the program object
4. Import in `lib/mock-data.ts` and add to `mockPrograms` array

### Method 2: Admin UI Import (Planned - Phase 2)

**Note: This method is not reliable until Antigravity wiring is complete.**

1. Navigate to `/admin/programs`
2. Click "Create Program"
3. Select "Import from Code" tab
4. Paste JSON or TypeScript curriculum code
5. Click "Parse & Preview"
6. Verify structure, click "Import Program"

### Curriculum JSON Structure

```json
{
  "id": "program-id",
  "slug": "program-slug",
  "title": "Program Title",
  "description": "Description",
  "totalSessions": 16,
  "locked": false,
  "sessions": [
    {
      "id": "session-1",
      "programId": "program-id",
      "sessionNumber": 1,
      "title": "Session Title",
      "objectives": ["Objective 1", "Objective 2"],
      "sections": [
        {
          "id": "section-1",
          "title": "Introduction",
          "type": "intro",
          "duration": 10,
          "facilitatorContent": [
            { "type": "script", "content": "Facilitator speaking notes..." },
            { "type": "list", "content": "Key Points:", "items": ["Point 1", "Point 2"] }
          ],
          "participantContent": [
            { "type": "text", "content": "What participants see..." }
          ]
        }
      ],
      "homeworkTemplate": {
        "title": "Homework Title",
        "instructions": "Instructions...",
        "questions": ["Question 1?", "Question 2?"]
      },
      "caseworxNoteTemplate": "{{participant}} attended Session {{sessionNumber}}..."
    }
  ]
}
```

### Content Block Types

- `text`: Plain text content
- `prompt`: Discussion or reflection prompt
- `script`: Facilitator speaking notes (facilitator only)
- `list`: Bulleted list with items array
- `worksheet`: Interactive worksheet
- `video`: Video embed reference
- `reading`: Reading material reference

---

## AI Assistant Integration

**Status: UI component present; API route not implemented yet.**

### Component: `components/ai-assistant.tsx`

### Role-Specific Behavior

#### Participant AI (`role="participant"`) - Planned (TODO)
- **Purpose**: Help understand recovery terminology
- **Restrictions**: Cannot answer homework questions
- **Sample prompts**: "What is a trigger?", "What does co-occurring mean?", "What is CBT?"

#### Facilitator AI (`role="facilitator"`) - Planned (TODO)
- **Purpose**: Session guidance and support
- **Capabilities**: Session tips, participant engagement strategies, content clarification

#### Admin AI (`role="admin"`) - Planned (TODO)
- **Purpose**: Schedule optimization and curriculum adherence
- **Capabilities**: 
  - Optimize participant schedules
  - Ensure curriculum adherence
  - Flag attendance issues
  - Suggest makeup group assignments

### Wiring Instructions (TODO)

```typescript
// In components/ai-assistant.tsx, replace handleSend function:

const handleSend = async () => {
  // 1. Build context based on role
  const systemPrompt = buildSystemPrompt(role)
  
  // 2. Add content filtering for participants
  if (role === 'participant') {
    const isHomeworkQuestion = await checkHomeworkRelated(input)
    if (isHomeworkQuestion) {
      // Return restriction message
      return
    }
  }
  
  // 3. Call OpenAI API
  const response = await fetch('/api/ai-chat', {
    method: 'POST',
    body: JSON.stringify({
      messages: [...messages, { role: 'user', content: input }],
      systemPrompt,
      role
    })
  })
  
  // 4. Stream response to UI
}
```

### API Route (TODO: Create `/api/ai-chat/route.ts`)

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const { messages, systemPrompt, role } = await req.json()
  
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ]
  })
  
  return Response.json({ message: completion.choices[0].message })
}
```

---

## Makeup Group System

### Flow Overview

1. **Absence Detection**: When facilitator marks participant absent
2. **Auto-Assignment**: System adds participant to next makeup group
3. **Notifications**: 
   - Participant receives urgent (red) message
   - Facilitator receives work assignment request
4. **Work Assignment**: Facilitator assigns worksheets/readings for missed content
5. **Status Update**: Participant card turns green (work assigned)
6. **Makeup Session**: Participant scans QR at Saturday group, completes assigned work
7. **Completion**: Facilitator marks makeup complete, credit given

### Admin Configuration (`/admin/schedule`)

- Set makeup group date (defaults to 1st Saturday of month)
- Set makeup group time (defaults to 10:00 AM)
- View assigned participants
- See work assignment status (red/green indicators)

### Facilitator Workflow

- "Makeup Work Needed" section shows pending assignments
- Click participant to see missed session
- Select worksheets and readings
- Add custom instructions
- Click "Assign Work" (button turns blue, card disappears after delay)

### Participant Experience

- Red urgent message appears in Messages
- Makeup session appears on Saturday in schedule
- `/participant/makeup` page for session day:
  - QR code scanner for check-in
  - Assigned materials (readings, worksheets)
  - Interactive worksheet completion
  - Mark session complete

### Store Functions

```typescript
addMakeupAssignment(assignment: MakeupAssignment)
assignMakeupWork(assignmentId: string, work: AssignedWork)
completeMakeupAssignment(assignmentId: string)
getMakeupAssignmentsByParticipant(participantId: string)
getPendingMakeupAssignments()
```

---

## Class Check-In System

**Status: UI scaffolding present; validation + persistence planned for Antigravity.**

### Overview

Participants must scan a QR code to check into each class session. The system supports both in-person (with GPS verification) and virtual classes.

### Facilitator QR Code Generation

Located in facilitator dashboard header:
- **"In-Person QR" button**: Opens QR generator with GPS requirement
- **"Virtual Class" button**: Opens QR generator pre-configured for virtual

#### In-Person Classes
- Facilitator must capture GPS location when generating QR code
- Warning displayed: "GPS location is required for in-person classes"
- QR code contains session ID, GPS coordinates, and expiration time

#### Virtual Classes
- Toggle "Virtual Session" switch
- No GPS required
- Enter virtual meeting link
- QR code contains session ID and virtual flag

### Participant Check-In (`/participant/check-in`)

1. Participant scans QR code displayed in classroom (or sent for virtual)
2. System validates:
   - QR code is valid and not expired
   - For in-person: GPS location within 50 meters of classroom
   - Participant is enrolled in the session
3. On success: Attendance recorded, participant proceeds to session
4. On failure: Error message displayed with reason

### GPS Verification - Optional/Experimental

**Note**: GPS verification should only be enabled if legally and clinically approved for your jurisdiction. The 50-meter radius validation uses the Haversine formula for distance calculation.

### Store Functions

```typescript
generateClassQRCode(sessionId: string, facilitatorId: string, isVirtual: boolean, gps?: {lat, lng}, virtualLink?: string)
validateCheckIn(qrCode: string, participantGps?: {lat, lng}): { valid: boolean, error?: string }
recordCheckIn(participantId: string, sessionId: string, qrCodeId: string, gps?: {lat, lng}, isVirtual: boolean)
markAbsentAfterClass(sessionId: string)  // Auto-triggers makeup assignment
```

---

## Development Mode

### DEV_MODE Bypass

In `app/page.tsx`, set at top of file:

```typescript
// **WARNING: MUST REMOVE BEFORE PROD**
const DEV_MODE = true  // Set to false for production
```

When `DEV_MODE = true`:
- Orange "[DEV] Skip Sign In" buttons appear on all role cards
- Clicking bypasses all authentication
- Participant bypass skips both QR scan AND email verification
- Direct access to any dashboard for testing

### Mock Data

Located in `lib/mock-data.ts`:
- 4 mock users (1 admin, 1 facilitator, 2 participants with full demographics)
- 6 programs (Prime Solutions fully populated, others placeholder)
- Sample enrollments, messages, homework, journal entries
- Makeup assignments for testing

### Current User

In `lib/store.tsx`, the default user is set:
```typescript
currentUser: mockUsers[3]  // participant-4 (Emily Brown)
```

Change index to test different roles:
- `mockUsers[0]` - Admin
- `mockUsers[1]` - Facilitator
- `mockUsers[2]` - Participant (John Doe)
- `mockUsers[3]` - Participant (Emily Brown)

---

## Integration Points (TODO)

### Authentication
- [ ] Replace DEV_MODE bypass with real authentication
- [ ] Implement secure login for Admin/Facilitator (Planned)
- [ ] Implement QR + email verification for Participants (Planned)
- [ ] Add session management and token refresh

### Database
- [ ] Replace React Context store with database (Supabase recommended)
- [ ] Migrate mock data to database tables
- [ ] Implement real-time updates for attendance, messages
- [ ] Create separate `ScheduleEvent` entity (currently embedded in Enrollment)

### AI Integration
- [ ] Wire OpenAI API to AI Assistant component
- [ ] Implement content filtering for participant restrictions
- [ ] Build admin AI for schedule optimization
- [ ] Add context injection for session guidance

### File Storage
- [ ] Store curriculum JSON/code in database or file system
- [ ] Handle worksheet uploads and storage
- [ ] Manage reading material attachments

### QR Code System
- [ ] Generate unique QR codes per session/class
- [ ] Implement QR scanning with camera access
- [ ] Validate QR codes against session schedule
- [ ] GPS verification (Optional/Experimental - only if legally/clinically approved)

### CaseWorx Integration
- [ ] Investigate CaseWorx API availability
- [ ] Current behavior: Manual copy/paste of formatted notes
- [ ] Future: Direct API push if API access is available

### Notifications
- [ ] Implement push notifications for urgent messages
- [ ] Add email notifications for makeup assignments
- [ ] Build reminder system for upcoming sessions

### Reports
- [ ] Build comprehensive attendance reports
- [ ] Add progress tracking exports
- [ ] Implement court-ready documentation generation

---

## Visual Design

### Background
- Serene mountain/forest scene (calming for recovery context)
- Fixed position, covers viewport
- Cards use 55% opacity white backgrounds with backdrop blur

### Color Coding
- **Green**: Positive/complete/approved
- **Blue**: In progress/info
- **Yellow**: Warning/attention needed
- **Red**: Urgent/incomplete/revision needed
- **Amber**: Special (makeup groups)

### Animations
- Achievement badges: `bounce-slow`, `shine`, `sparkle`
- Smooth transitions on all interactive elements
- Loading states for async operations

---

## Support

For issues or questions about this build, refer to the conversation history in v0 or contact the development team.

**Built with v0 by Vercel**
**Copyright DMS Clinical Services**
