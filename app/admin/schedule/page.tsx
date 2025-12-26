import "server-only"
import { getScheduleEvents } from "@/lib/firebase-admin"
import ScheduleClient from "./schedule-client"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default async function SchedulePage() {
  let events: any[] = []
  let errorMsg = null

  try {
     events = await getScheduleEvents()
     // Serialize just in case
     events = events.map(e => ({
        id: e.id,
        programId: e.programId || "unknown",
        facilitatorId: e.facilitatorId || "unknown",
        dayOfWeek: e.dayOfWeek || "TBD",
        time: e.time || "TBD",
        location: e.location || "Online",
        active: e.active !== false
     }))
  } catch(e: any) {
     console.error("Failed to load schedule:", e)
     errorMsg = e.message
  }

  return <ScheduleClient events={events} loadError={errorMsg} />
}
