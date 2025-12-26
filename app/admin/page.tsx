import "server-only"
import { getProgramsCount, getUsersCount, getEnrollmentsCount } from "@/lib/firebase-admin"
import AdminDashboardClient from "./admin-dashboard-client"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const [totalPrograms, totalUsers, activeEnrollments] = await Promise.all([
    getProgramsCount(),
    getUsersCount(),
    getEnrollmentsCount(),
  ])
  
  const stats = {
    totalParticipants: totalUsers, // Approximation
    activeEnrollments: activeEnrollments,
    totalPrograms: totalPrograms,
    completionRate: 75, // Stub
    totalUsers: totalUsers,
  }

  return <AdminDashboardClient stats={stats} />
}
