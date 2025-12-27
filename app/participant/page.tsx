import "server-only"
import { getDb, getUsers, getScheduleEvents, getPrograms, getEnrollments } from "@/lib/firebase-admin"
import DevUserSwitcher from "@/components/dev-user-switcher"
import ParticipantClient from "./participant-client"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default async function ParticipantDashboard({ searchParams }: { searchParams: { userId?: string } }) {
  // A) Fetch Data
  const [allUsers, allEvents, allPrograms, allEnrollments] = await Promise.all([
     getUsers(),
     getScheduleEvents(),
     getPrograms(),
     getEnrollments()
  ])

  // Residents
  const participants = allUsers.filter(u => u.role === "participant")

  // B) Pick Participant
  let selectedParticipantId = searchParams.userId
  if (!selectedParticipantId && participants.length > 0) {
      selectedParticipantId = participants[0].id
  }
  
  const selectedParticipant = allUsers.find(u => u.id === selectedParticipantId)

  // C) My Enrollments
  const myEnrollments = allEnrollments.filter(e => e.userId === selectedParticipantId)
  
  // D) My Schedule
  // Filter strictly by scheduleEventId assigned in enrollment
  const myScheduleEventIds = myEnrollments
    .map(e => e.scheduleEventId)
    .filter((id): id is string => !!id)

  const rawEvents = allEvents.filter(e => myScheduleEventIds.includes(e.id))

  // Map to client format
  const myEvents = rawEvents.map(e => {
     const prog = allPrograms.find(p => p.id === e.programId)
     const enroll = myEnrollments.find(en => en.scheduleEventId === e.id)
     return {
        id: e.id,
        name: prog?.title || "Unknown Program",
        day: e.dayOfWeek,
        time: e.time,
        location: e.location,
        session: enroll?.currentSession || 1,
        facilitator: "Assigned Facilitator", // Ideally fetched from user ID, but name not always avail on event obj
        programSlug: prog?.slug || "unknown"
     }
  })

  // Sort events by day
  // const dayOrder:  Record<string, number> = { "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6, "Sunday": 7 };
  // myEvents.sort((a,b) => (dayOrder[a.day] || 99) - (dayOrder[b.day] || 99))

  return (
    <div className="min-h-screen bg-gray-50">
       <div className="bg-white border-b px-6 py-2">
           <DevUserSwitcher users={participants.map(u => ({ id: u.id, name: u.name }))} userType="Participant" />
       </div>
       <ParticipantClient scheduleEvents={myEvents} /> 
    </div>
  )
}
