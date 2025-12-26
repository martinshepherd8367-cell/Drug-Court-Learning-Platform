"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Video } from "lucide-react"

interface ScheduleEvent {
  id: string
  programId: string
  facilitatorId: string
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

  // Simple sort by Day?
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
                 <CardTitle className="text-lg flex justify-between items-center">
                    {event.dayOfWeek}
                    <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {event.active ? 'Active' : 'Inactive'}
                    </span>
                 </CardTitle>
                 <CardDescription className="flex items-center gap-2 font-mono text-blue-700">
                    <Clock className="w-4 h-4" /> {event.time}
                 </CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="space-y-3">
                     <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mt-0.5" />
                        <span>{event.location}</span>
                     </div>
                     <div className="text-xs text-gray-400 pt-2 border-t">
                        <span className="font-medium">Program ID:</span> {event.programId} <br/>
                        <span className="font-medium">Facilitator ID:</span> {event.facilitatorId}
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
