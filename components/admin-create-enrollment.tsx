"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

export default function AdminCreateEnrollment({ programs, participants }: { programs: any[], participants: any[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedProgram, setSelectedProgram] = useState("")

  const handleCreate = async () => {
     if(!selectedUser || !selectedProgram) return;
     setLoading(true)
     setError(null)
     
     try {
        const res = await fetch("/api/admin/enrollments", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ userId: selectedUser, programId: selectedProgram })
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
        <Button className="bg-green-600 hover:bg-green-700">
           <Plus className="h-4 w-4 mr-2" />
           Enroll Participant
        </Button>
      </DialogTrigger>
      <DialogContent>
         <DialogHeader>
            <DialogTitle>Enroll Participant</DialogTitle>
            <DialogDescription>Add a participant to a program (Active by default).</DialogDescription>
         </DialogHeader>
         
         {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

         <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Participant</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select participant" />
                </SelectTrigger>
                <SelectContent>
                  {participants.map(p => (
                     <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Program</Label>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map(p => (
                     <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
         </div>

         <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={loading || !selectedUser || !selectedProgram}>
               {loading ? "Creating..." : "Enroll"}
            </Button>
         </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
