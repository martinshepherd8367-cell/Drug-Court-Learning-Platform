import "server-only"
import { getEnrollments, getUsers, getPrograms } from "@/lib/firebase-admin"
import EnrollmentsClient from "./enrollments-client"
import AdminCreateEnrollment from "@/components/admin-create-enrollment"

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
     
     const participants = users.filter(u => u.role === "participant")

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
           participantName: user ? user.name : null,
           programName: program ? program.title : null,
           totalSessions: program ? program.totalSessions : null
        }
     })
     
     return (
        <div className="min-h-screen">
           {/* Wrap client parts with data */}
           <div className="container mx-auto px-6 pt-8 flex justify-end">
              <AdminCreateEnrollment programs={programs} participants={participants} />
           </div>
           
           <EnrollmentsClient 
              initialEnrollments={enrollments} 
              allUsers={users} 
              allPrograms={programs} 
              loadError={errorMsg} 
           />
        </div>
     )
  } catch (e: any) {
    console.error("Failed to load enrollments data:", e)
    return <EnrollmentsClient initialEnrollments={[]} allUsers={[]} allPrograms={[]} loadError={e.message} />
  }
}
