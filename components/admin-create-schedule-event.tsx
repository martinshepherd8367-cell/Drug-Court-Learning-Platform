"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus } from "lucide-react"

export default function AdminCreateScheduleEvent({ programs, facilitators }: { programs: any[], facilitators: any[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [programId, setProgramId] = useState("")
  const [facilitatorId, setFacilitatorId] = useState("")
  const [dayOfWeek, setDayOfWeek] = useState("Monday")
  const [time, setTime] = useState("10:00 AM")
  const [location, setLocation] = useState("Room 101")
  const [active, setActive] = useState(true)

  const handleCreate = async () => {
     if(!programId || !facilitatorId) return;
     setLoading(true)
     setError(null)
     
     try {
        const res = await fetch("/api/admin/schedule-events", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ programId, facilitatorId, dayOfWeek, time, location, active })
        })
        const data = await res.json()
        if(!res.ok || !data.ok) throw new Error(data.error || "Failed to create")
        
        setOpen(false)
        router.refresh()
     } catch(e: any) {
        setError(e.message)
     } finally {
        setLoading(false)
     }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
           <Plus className="h-4 w-4 mr-2" />
           Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
         <DialogHeader>
            <DialogTitle>Add Schedule Event</DialogTitle>
            <DialogDescription>Create a weekly class session.</DialogDescription>
         </DialogHeader>
         
         {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

         <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-2 col-span-2">
              <Label>Program</Label>
              <Select value={programId} onValueChange={setProgramId}>
                <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
                <SelectContent>
                  {programs.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label>Facilitator</Label>
              <Select value={facilitatorId} onValueChange={setFacilitatorId}>
                <SelectTrigger><SelectValue placeholder="Select facilitator" /></SelectTrigger>
                <SelectContent>
                  {facilitators.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
               <Label>Day of Week</Label>
               <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => (
                     <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
               </Select>
            </div>

            <div className="space-y-2">
               <Label>Time</Label>
               <Input value={time} onChange={e => setTime(e.target.value)} placeholder="e.g. 10:00 AM" />
            </div>

            <div className="space-y-2">
               <Label>Location</Label>
               <Input value={location} onChange={e => setLocation(e.target.value)} />
            </div>

            <div className="space-y-2 flex items-center gap-2 pt-8">
               <Checkbox id="active" checked={active} onCheckedChange={(c) => setActive(!!c)} />
               <Label htmlFor="active">Active</Label>
            </div>
         </div>

         <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={loading || !programId || !facilitatorId}>
               {loading ? "Creating..." : "Create Event"}
            </Button>
         </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
