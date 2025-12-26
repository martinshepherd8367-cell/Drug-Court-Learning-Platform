"use client"

import {
  Users,
  BookOpen,
  Calendar,
  FileBarChart,
  Settings,
  ShieldAlert,
  GraduationCap,
  ClipboardCheck,
  QrCode,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { RoleNav } from "@/components/role-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DashboardStats {
  totalParticipants: number;
  activeEnrollments: number;
  totalPrograms: number;
  completionRate: number;
  totalUsers: number;
  scheduleEvents?: number;
}

export default function AdminDashboardClient({ stats }: { stats: DashboardStats }) {

  const quickLinks = [
    {
      title: "Programs",
      description: "Manage programs and sessions",
      icon: BookOpen,
      href: "/admin/programs",
      count: stats.totalPrograms,
      highlight: true
    },
    {
      title: "Users",
      description: "Manage users and roles",
      icon: Users,
      href: "/admin/users",
      count: stats.totalUsers,
    },
    {
      title: "Enrollments",
      description: "View active enrollments",
      icon: GraduationCap,
      href: "/admin/enrollments", // Updated (Phase 2 fix)
      count: stats.activeEnrollments, 
    },
    {
      title: "Schedule",
      description: "Manage class schedule",
      icon: Calendar,
      href: "/admin/schedule",
      count: stats.scheduleEvents ?? null,
    },
    {
      title: "Curriculum Review",
      description: "Audit curriculum content",
      icon: ClipboardCheck,
      href: "/admin/curriculum-review",
      count: null,
    },
    {
      title: "Reports",
      description: "View reports and analytics",
      icon: FileBarChart,
      href: "/admin/reports",
      count: null,
      disabled: true,
    },
  ]

  return (
    <div className="min-h-screen font-sans bg-transparent relative">
      {/* Background with explicit click-through safety */}
      <div className="absolute inset-0 z-0 opacity-40 bg-[radial-gradient(#2563eb_0.5px,transparent_0.5px)] [background-size:16px_16px] pointer-events-none" />

      <RoleNav role="admin" />

      {/* Main Content with pointer-events-auto */}
      <main className="relative z-10 container mx-auto px-8 py-10 pointer-events-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your organization's programs and users</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
              <ShieldAlert className="h-4 w-4" />
              Audit Log
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-blue-200 bg-blue-50/50 card-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100/80 rounded-lg">
                  <Users className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalParticipants}</p>
                  <p className="text-sm text-gray-600">Total Participants</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/50 card-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100/80 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeEnrollments}</p>
                  <p className="text-sm text-gray-600">Active Enrollments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/50 card-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100/80 rounded-lg">
                  <BookOpen className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalPrograms}</p>
                  <p className="text-sm text-gray-600">Active Programs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50/50 card-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100/80 rounded-lg">
                  <FileBarChart className="h-6 w-6 text-orange-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completionRate}%</p>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <Card className="card-transparent">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Navigate to different management areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickLinks.map((link) => {
                const Icon = link.icon
                const isClickable = !link.disabled

                // Render content
                const content = (
                  <CardContent className="p-6">
                    <div className={`flex items-center justify-between ${link.disabled ? "opacity-50" : ""}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${link.highlight ? "bg-blue-100/80" : "bg-gray-100/80"}`}>
                          <Icon className={`h-6 w-6 ${link.highlight ? "text-blue-700" : "text-gray-700"}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {link.title}
                            {link.disabled && <span className="text-xs text-gray-500 ml-2">(Coming Soon)</span>}
                          </h3>
                          <p className="text-sm text-gray-600">{link.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {link.count !== null && (
                          <span className="text-2xl font-bold text-gray-400">{link.count}</span>
                        )}
                        {isClickable && <ChevronRight className="h-5 w-5 text-gray-400" />}
                      </div>
                    </div>
                  </CardContent>
                )

                // If clickable, wrap in Link; otherwise just Card
                if (isClickable) {
                  return (
                    <Link key={link.href} href={link.href} className="block group">
                      <Card
                        className={`transition-all card-transparent group-hover:border-green-500 group-hover:shadow-md ${link.highlight ? "border-blue-300 bg-blue-50/50" : ""
                          }`}
                      >
                        {content}
                      </Card>
                    </Link>
                  )
                }

                return (
                  <Card
                    key={link.title}
                    className={`cursor-not-allowed card-transparent bg-gray-50/50`}
                  >
                    {content}
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 py-4 mt-8 footer-transparent relative">
        <div className="container mx-auto px-6 text-center text-sm text-gray-600">
          © 2025 DMS Clinical Services. All rights reserved.
        </div>
        <div className="fixed bottom-2 right-2 text-[10px] text-gray-300 pointer-events-none select-none z-50">
          sha: {process.env.NEXT_PUBLIC_BUILD_SHA?.substring(0, 7)} • built: {process.env.NEXT_PUBLIC_BUILD_TIME}
        </div>
      </footer>
    </div>
  )
}
