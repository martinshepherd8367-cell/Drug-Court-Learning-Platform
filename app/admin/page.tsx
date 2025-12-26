import "server-only"
import { getProgramsCount, getUsersCount, getEnrollmentsCount, getScheduleEventsCount } from "@/lib/firebase-admin"
import AdminDashboardClient from "./admin-dashboard-client"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default async function AdminDashboard() {
  const [totalPrograms, totalUsers, activeEnrollments, scheduleEvents] = await Promise.all([
    getProgramsCount(),
    getUsersCount(),
    getEnrollmentsCount(),
    getScheduleEventsCount(),
  ])
  
  const stats = {
    totalParticipants: totalUsers, // Temporary approximation until filtered count
    activeEnrollments: activeEnrollments,
    totalPrograms: totalPrograms,
    completionRate: 75, // Still mock for now
    totalUsers: totalUsers,
    scheduleEvents: scheduleEvents,
  }

  return <AdminDashboardClient stats={stats} />
}
