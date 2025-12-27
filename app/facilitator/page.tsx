import "server-only"
import { getDb, getUsers, getScheduleEvents, getPrograms, getEnrollments } from "@/lib/firebase-admin"
import DevUserSwitcher from "@/components/dev-user-switcher"
import FacilitatorClient from "./facilitator-client"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default async function FacilitatorDashboardPage({ searchParams }: { searchParams: { userId?: string } }) {
  // A) Fetch All Data
  const [allUsers, allEvents, allPrograms, allEnrollments] = await Promise.all([
     getUsers(),
     getScheduleEvents(),
     getPrograms(),
     getEnrollments()
  ])

  // Filter facilitators
  const facilitators = allUsers.filter(u => u.role === "facilitator" || u.role === "admin")
  
  // B) Pick Active Facilitator
  let selectedFacilitatorId = searchParams.userId
  if (!selectedFacilitatorId && facilitators.length > 0) {
      selectedFacilitatorId = facilitators[0].id
  }

  const selectedFacilitator = allUsers.find(u => u.id === selectedFacilitatorId)

  // C) Filter Events
  let myEvents: any[] = []
  if (selectedFacilitatorId) {
    const rawEvents = allEvents.filter(e => e.facilitatorId === selectedFacilitatorId)

    // D) Prepare events with roster
    myEvents = rawEvents.map(event => {
       const program = allPrograms.find(p => p.id === event.programId)
       
       // Filter participants strictly by scheduleEventId
       const eventEnrollments = allEnrollments.filter(e => e.scheduleEventId === event.id)
       
       const roster = eventEnrollments.map(e => {
           const user = allUsers.find(u => u.id === e.userId)
           return {
             name: user ? user.name : "Unknown User",
             status: e.status || "active",
             userId: e.userId
           }
       })

       return {
          id: event.id,
          name: program?.title || "Unknown Program", 
          day: event.dayOfWeek,
          time: event.time,
          program: program?.title,
          session: 1, 
          location: event.location,
          facilitator: selectedFacilitator?.name,
          enrolled: roster.length, 
          roster: roster
       }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
       <div className="bg-white border-b px-6 py-2">
          <DevUserSwitcher users={facilitators.map(u => ({ id: u.id, name: u.name }))} userType="Facilitator" />
       </div>
       <FacilitatorClient scheduleEvents={myEvents} /> 
    </div>
  )
}
