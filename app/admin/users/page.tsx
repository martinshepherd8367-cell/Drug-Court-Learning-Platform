import "server-only"
import { getUsers } from "@/lib/firebase-admin"
import UsersClient from "./users-client"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default async function UsersPage() {
  let users: any[] = []
  let errorMsg = null

  try {
     users = await getUsers()
     // Ensure serialization safety
     users = users.map(u => ({
         id: u.id,
         name: u.name || "Unknown",
         email: u.email || "",
         role: u.role || "participant",
         // Safely handle optional fields that might be undefined in Firestore
         createdAt: u.createdAt || null,
         demographics: u.demographics || {},
     }))
  } catch (e: any) {
    console.error("Failed to load users:", e)
    errorMsg = e.message
  }
  
  return <UsersClient initialUsers={users} loadError={errorMsg} />
}
