"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DevUserSwitcher({ 
  users, 
  userType 
}: { 
  users: { id: string; name: string }[];
  userType: string;
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const currentUserId = searchParams.get('userId') || (users.length > 0 ? users[0].id : "")

  const handleValueChange = (val: string) => {
     const params = new URLSearchParams(searchParams)
     params.set('userId', val)
     router.replace(`${pathname}?${params.toString()}`)
  }

  if (users.length === 0) return null

  return (
    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
       <label className="block text-sm font-medium text-yellow-800 mb-2">
         Dev: Switch {userType}
       </label>
       <Select value={currentUserId} onValueChange={handleValueChange}>
         <SelectTrigger className="w-[300px] bg-white">
            <SelectValue placeholder="Select user" />
         </SelectTrigger>
         <SelectContent>
            {users.map(u => (
               <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
            ))}
         </SelectContent>
       </Select>
    </div>
  )
}
