import "server-only"
import { getScheduleEvents, getUsers, getPrograms } from "@/lib/firebase-admin"
import ScheduleClient from "./schedule-client"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default async function SchedulePage() {
  let events: any[] = []
  let errorMsg = null

  try {
     const [evt, u, p] = await Promise.all([
        getScheduleEvents(),
        getUsers(),
        getPrograms()
     ])
     
     const userMap = new Map(u.map((x: any) => [x.id, x]))
     const programMap = new Map(p.map((x: any) => [x.id, x]))

     events = evt.map(e => {
        const prog = programMap.get(e.programId)
        const fac = userMap.get(e.facilitatorId)
        
        return {
           id: e.id,
           programId: e.programId, // Keep for robustness but client will hide it
           facilitatorId: e.facilitatorId,
           programName: prog ? (prog.title || prog.slug) : "Program",
           facilitatorName: fac ? fac.name : "Facilitator",
           dayOfWeek: e.dayOfWeek || "TBD",
           time: e.time || "TBD",
           location: e.location || "Online",
           active: e.active !== false
        }
     })
  } catch(e: any) {
     console.error("Failed to load schedule:", e)
     errorMsg = e.message
  }

  return <ScheduleClient events={events} loadError={errorMsg} />
}
