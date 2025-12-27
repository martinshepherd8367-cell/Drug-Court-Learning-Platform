import "server-only"
import { getScheduleEvents, getUsers, getPrograms } from "@/lib/firebase-admin"
import ScheduleClient from "./schedule-client"
import AdminCreateScheduleEvent from "@/components/admin-create-schedule-event"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default async function SchedulePage() {
  let events: any[] = []
  let programs: any[] = []
  let facilitators: any[] = []
  let errorMsg = null

  try {
     const [evt, u, p] = await Promise.all([
        getScheduleEvents(),
        getUsers(),
        getPrograms()
     ])
     
     const userMap = new Map(u.map((x: any) => [x.id, x]))
     const programMap = new Map(p.map((x: any) => [x.id, x]))
     
     programs = p.map((x:any) => ({ id: x.id, title: x.title || x.slug }))
     facilitators = u.filter((x:any) => x.role === "facilitator" || x.role === "admin")
                             .map((x:any) => ({ id: x.id, name: x.name }))

     events = evt.map(e => {
        const prog = programMap.get(e.programId)
        const fac = userMap.get(e.facilitatorId)
        
        return {
           id: e.id,
           programId: e.programId, 
           facilitatorId: e.facilitatorId,
           programName: prog ? (prog.title || prog.slug) : "Program",
           facilitatorName: fac ? fac.name : "Facilitator",
           dayOfWeek: e.dayOfWeek || "TBD",
           time: e.time || "TBD",
           location: e.location || "Online",
           active: e.active !== false
        }
     })

     return (
        <div className="min-h-screen">
            <div className="container mx-auto px-6 pt-8 flex justify-end">
               <AdminCreateScheduleEvent programs={programs} facilitators={facilitators} />
            </div>
            
            <ScheduleClient events={events} loadError={errorMsg} />
        </div>
     )

  } catch(e: any) {
     console.error("Failed to load schedule:", e)
     errorMsg = e.message
     return <ScheduleClient events={[]} loadError={errorMsg} />
  }
}
