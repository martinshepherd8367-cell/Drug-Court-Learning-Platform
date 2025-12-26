import "server-only"
import { getEnrollments, getUsers, getPrograms } from "@/lib/firebase-admin"
import EnrollmentsClient from "./enrollments-client"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default async function EnrollmentManagement() {
  let enrollments: any[] = []
  let users: any[] = []
  let programs: any[] = []
  let errorMsg = null

  try {
     const [e, u, p] = await Promise.all([
        getEnrollments(),
        getUsers(),
        getPrograms()
     ])
     
     users = u.map(user => ({
         id: user.id,
         role: user.role,
         name: user.name,
         email: user.email,
         phone: user.phone,
         ...user 
     }))

     programs = p.map(prog => ({
         id: prog.id,
         title: prog.title || prog.slug,
         totalSessions: prog.totalSessions || 12,
         ...prog
     }))
     
     enrollments = e.map(enrol => {
        const user = users.find(u => u.id === enrol.userId)
        const program = programs.find(p => p.id === enrol.programId)
        
        return {
           id: enrol.id,
           userId: enrol.userId,
           programId: enrol.programId,
           status: enrol.status || "active",
           currentSession: enrol.currentSession || 1,
           progress: enrol.progress || 0,
           // Resolve names
           participantName: user ? user.name : null,
           programName: program ? program.title : null,
           totalSessions: program ? program.totalSessions : null
        }
     })
  } catch (e: any) {
    console.error("Failed to load enrollments data:", e)
    errorMsg = e.message
  }
  
  return <EnrollmentsClient initialEnrollments={enrollments} allUsers={users} allPrograms={programs} loadError={errorMsg} />
}
