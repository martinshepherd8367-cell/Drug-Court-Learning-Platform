import "server-only"
import { getDb, getUsers, getScheduleEvents, getPrograms, getEnrollments } from "@/lib/firebase-admin"
import DevUserSwitcher from "@/components/dev-user-switcher"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, BookOpen } from "lucide-react"

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

  const myEvents = allEvents.filter(e => myScheduleEventIds.includes(e.id))

  // Sort events by day
  const dayOrder:  Record<string, number> = { "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6, "Sunday": 7 };
  myEvents.sort((a,b) => (dayOrder[a.dayOfWeek] || 99) - (dayOrder[b.dayOfWeek] || 99))

  return (
    <div className="min-h-screen bg-gray-50 p-8 pb-20 relative">
       <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Participant Portal</h1>
          <p className="text-gray-600 mb-8">Access your learning plan and schedule.</p>

          <DevUserSwitcher users={participants.map(u => ({ id: u.id, name: u.name }))} userType="Participant" />

          {selectedParticipant ? (
              <div className="space-y-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-semibold text-lg">Logged in as:</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                       {selectedParticipant.name}
                    </span>
                 </div>

                 {/* My Enrollments */}
                 <section>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                       <BookOpen className="w-5 h-5 text-blue-600" /> My Programs
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                       {myEnrollments.length === 0 ? (
                           <p className="text-gray-500 italic">Not enrolled in any programs yet.</p>
                       ) : (
                           myEnrollments.map(enrol => {
                               const prog = allPrograms.find(p => p.id === enrol.programId)
                               return (
                                   <Card key={enrol.id}>
                                       <CardHeader className="pb-2">
                                           <CardTitle className="text-lg">{prog?.title || "Unknown Program"}</CardTitle>
                                           <CardDescription>
                                              Status: <Badge variant="outline" className="capitalize">{enrol.status || "active"}</Badge>
                                           </CardDescription>
                                       </CardHeader>
                                       <CardContent>
                                           <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                               <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${enrol.progress || 0}%` }}></div>
                                           </div>
                                           <p className="text-xs text-gray-500 text-right">{enrol.progress || 0}% Complete</p>
                                           <p className="text-sm mt-2">Current Session: {enrol.currentSession || 1}</p>
                                       </CardContent>
                                   </Card>
                               )
                           })
                       )}
                    </div>
                 </section>

                 {/* My Schedule */}
                 <section>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                       <Calendar className="w-5 h-5 text-green-600" /> My Weekly Schedule
                    </h2>
                    <div className="space-y-3">
                       {myEvents.length === 0 ? (
                           <p className="text-gray-500 italic">No scheduled classes yet.</p>
                       ) : (
                           myEvents.map(event => {
                               const prog = allPrograms.find(p => p.id === event.programId)
                               return (
                                   <div key={event.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                                       <div>
                                           <p className="font-bold text-gray-800">{event.dayOfWeek}</p>
                                           <p className="text-blue-600 font-medium">{prog?.title}</p>
                                       </div>
                                       <div className="text-right text-sm">
                                           <p className="flex items-center justify-end gap-1 text-gray-600">
                                              <Clock className="w-3 h-3" /> {event.time}
                                           </p>
                                           <p className="flex items-center justify-end gap-1 text-gray-500 mt-1">
                                              <MapPin className="w-3 h-3" /> {event.location}
                                           </p>
                                       </div>
                                   </div>
                               )
                           })
                       )}
                    </div>
                 </section>
              </div>
          ) : (
             <p className="text-red-500">No participants found.</p>
          )}
       </div>

       {/* Build Stamp Footer */}
       <div className="fixed bottom-2 right-2 text-xs text-gray-400 bg-white/80 p-1 rounded border pointer-events-none">
          sha: {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.substring(0,7) || "dev"} | 
          built: {new Date().toISOString().substring(0,10)}
       </div>
    </div>
  )
}
