import "server-only"
import { getDb, getUsers, getScheduleEvents, getPrograms, getEnrollments } from "@/lib/firebase-admin"
import DevUserSwitcher from "@/components/dev-user-switcher"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Users } from "lucide-react"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default async function FacilitatorDashboard({ searchParams }: { searchParams: { userId?: string } }) {
  // A) Fetch All Data
  const [allUsers, allEvents, allPrograms, allEnrollments] = await Promise.all([
     getUsers(),
     getScheduleEvents(),
     getPrograms(),
     getEnrollments()
  ])

  // Filter facilitators
  const facilitators = allUsers.filter(u => u.role === "facilitator" || u.role === "admin") // admins can facilitate too
  
  // B) Pick Active Facilitator
  let selectedFacilitatorId = searchParams.userId
  if (!selectedFacilitatorId && facilitators.length > 0) {
      selectedFacilitatorId = facilitators[0].id
  }

  const selectedFacilitator = allUsers.find(u => u.id === selectedFacilitatorId)

  // C) Filter Events
  const myEvents = allEvents.filter(e => e.facilitatorId === selectedFacilitatorId)

  // D) Render
  return (
    <div className="min-h-screen bg-gray-50 p-8 pb-20 relative">
       <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Facilitator Dashboard</h1>
          <p className="text-gray-600 mb-8">Manage your classes and view schedule.</p>
          
          <DevUserSwitcher users={facilitators.map(u => ({ id: u.id, name: u.name }))} userType="Facilitator" />
          
          {selectedFacilitator ? (
             <div className="space-y-6">
                 <div className="flex items-center gap-2 mb-4">
                    <span className="font-semibold text-lg">Viewing as:</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                       {selectedFacilitator.name}
                    </span>
                 </div>

                 <h2 className="text-xl font-semibold mt-8 mb-4">My Weekly Schedule</h2>
                 {myEvents.length === 0 ? (
                    <Card>
                       <CardContent className="p-8 text-center text-gray-500">
                          No classes scheduled for you.
                       </CardContent>
                    </Card>
                 ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                       {myEvents.map(event => {
                          const program = allPrograms.find(p => p.id === event.programId)
                          const enrolledCount = allEnrollments.filter(e => e.programId === event.programId && e.status === 'active').length
                          
                          return (
                             <Card key={event.id} className="border-l-4 border-l-blue-600">
                                <CardHeader className="pb-2">
                                   <CardTitle className="flex justify-between">
                                      {event.dayOfWeek}
                                      {/* Active badge */}
                                      {event.active !== false && (
                                         <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-normal">Active</span>
                                      )}
                                   </CardTitle>
                                   <CardDescription className="flex items-center gap-2">
                                      <Clock className="w-4 h-4" /> {event.time}
                                   </CardDescription>
                                </CardHeader>
                                <CardContent>
                                   <h3 className="font-semibold text-lg mb-1">{program?.title || "Unknown Program"}</h3>
                                   <div className="text-sm text-gray-600 space-y-1">
                                      <div className="flex items-center gap-2">
                                         <MapPin className="w-4 h-4" /> {event.location}
                                      </div>
                                      <div className="flex items-center gap-2">
                                         <Users className="w-4 h-4" /> {enrolledCount} Participants
                                      </div>
                                   </div>
                                </CardContent>
                             </Card>
                          )
                       })}
                    </div>
                 )}
             </div>
          ) : (
             <p className="text-red-500">No facilitators found to select.</p>
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
