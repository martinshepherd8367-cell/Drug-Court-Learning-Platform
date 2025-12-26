"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Video, User as UserIcon } from "lucide-react"

interface ScheduleEvent {
  id: string
  programId: string
  facilitatorId: string
  programName?: string
  facilitatorName?: string
  dayOfWeek: string
  time: string
  location: string
  active: boolean
}

export default function ScheduleClient({ events, loadError }: { events: ScheduleEvent[], loadError?: string | null }) {
  if (loadError) {
     return (
        <div className="p-8">
           <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
               <p className="font-bold">Error Loading Schedule</p>
               <p className="text-sm">{loadError}</p>
           </div>
        </div>
     )
  }

  // Simple sort by Day
  const dayOrder:  Record<string, number> = { "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6, "Sunday": 7 };
  const sortedEvents = [...events].sort((a, b) => {
    return (dayOrder[a.dayOfWeek] || 99) - (dayOrder[b.dayOfWeek] || 99);
  })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-2xl font-bold">Program Schedule</h1>
           <p className="text-gray-500 mt-1">Weekly class sessions and locations</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedEvents.length === 0 ? (
           <p className="col-span-3 text-center text-gray-500 py-10">No active schedule events found.</p>
        ) : (
           sortedEvents.map((event) => (
             <Card key={event.id} className="border-l-4 border-l-blue-500">
               <CardHeader className="pb-2">
                 <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                        {event.dayOfWeek}
                    </CardTitle>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {event.active ? 'Active' : 'Inactive'}
                    </span>
                 </div>
                 <CardDescription className="flex items-center gap-2 font-mono text-blue-700">
                    <Clock className="w-4 h-4" /> {event.time}
                 </CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="space-y-3">
                     <div className="flex items-start gap-2 text-sm text-gray-800 font-medium">
                        {/* Program Name */}
                        <div className="flex-1">{event.programName || "Program Program"}</div>
                     </div>
                     
                     <div className="bg-gray-50 p-3 rounded-md space-y-2 mt-2">
                         <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{event.location}</span>
                         </div>
                         <div className="flex items-center gap-2 text-sm text-gray-600">
                            <UserIcon className="w-4 h-4 text-gray-400" />
                            <span>{event.facilitatorName || "Facilitator"}</span>
                         </div>
                     </div>
                  </div>
               </CardContent>
             </Card>
           ))
        )}
      </div>
    </div>
  )
}
