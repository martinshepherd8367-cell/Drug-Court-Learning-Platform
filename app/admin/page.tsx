"use client"

import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { RoleNav } from "@/components/role-nav"
import { AIAssistantButton } from "@/components/ai-assistant"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, UserCheck, FileBarChart, ChevronRight, QrCode, Calendar, ClipboardCheck } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const { programs, users, enrollments } = useStore()

  const stats = {
    totalParticipants: users.filter((u) => u.role === "participant").length,
    activeEnrollments: enrollments.filter((e) => e.status === "active").length,
    totalPrograms: programs.length,
    completionRate: 75, // Mock
  }

  const quickLinks = [
    {
      title: "Weekly Schedule",
      description: "View all classes by day and time",
      icon: Calendar,
      href: "/admin/schedule",
      count: null,
      highlight: true,
    },
    {
      title: "Curriculum Review",
      description: "Audit programs (Pre-Audit)",
      icon: ClipboardCheck,
      href: "/admin/curriculum-review",
      count: null,
    },
    {
      title: "Programs",
      description: "Manage programs and sessions",
      icon: BookOpen,
      href: "#",
      count: stats.totalPrograms,
      disabled: true,
    },
    {
      title: "Class Schedule",
      description: "View weekly class schedule grid",
      icon: Calendar,
      href: "/admin/schedule",
      count: null,
    },
    {
      title: "Users",
      description: "Manage users and roles",
      icon: Users,
      href: "#",
      count: users.length,
      disabled: true,
    },
    {
      title: "Enrollments",
      description: "Manage participant enrollments",
      icon: UserCheck,
      href: "#",
      count: stats.activeEnrollments,
      disabled: true,
    },
    {
      title: "Reports",
      description: "View reports and analytics",
      icon: FileBarChart,
      href: "#",
      count: null,
      disabled: true,
    },
  ]

  return (
    <div className="min-h-screen">
      <RoleNav />

      <main className="container mx-auto px-8 py-10">
        {/* Header with AI Assistant button */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 drop-shadow-sm">Admin Dashboard</h1>
            <p className="text-gray-700 mt-1 drop-shadow-sm">Manage programs, users, and enrollments</p>
          </div>
          <AIAssistantButton role="admin" disabled />
        </div>

        {/* Prominent Weekly Schedule button */}
        <Card className="mb-8 border-blue-200 bg-blue-50/80 card-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/80 rounded-lg border border-blue-200">
                  <Calendar className="h-12 w-12 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-blue-800">Weekly Class Schedule</h3>
                  <p className="text-sm text-blue-700">
                    View all classes, facilitators, and enrollment status at a glance
                  </p>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/admin/schedule")}>
                <Calendar className="h-4 w-4 mr-2" />
                View Schedule
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100/80 rounded-lg">
                  <Users className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalParticipants}</p>
                  <p className="text-sm text-gray-600">Participants</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100/80 rounded-lg">
                  <UserCheck className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeEnrollments}</p>
                  <p className="text-sm text-gray-600">Active Enrollments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100/80 rounded-lg">
                  <BookOpen className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalPrograms}</p>
                  <p className="text-sm text-gray-600">Programs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-transparent">
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

        {/* Registration QR Code */}
        <Card className="mb-8 border-green-200 bg-green-50/80 card-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/80 rounded-lg border border-green-200">
                  <QrCode className="h-12 w-12 text-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-green-800">Participant Registration QR Code</h3>
                  <p className="text-sm text-green-700">Share this code for new participants to register</p>
                </div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 opacity-50 cursor-not-allowed" disabled>
                <QrCode className="h-4 w-4 mr-2" />
                View Full QR Code (V2)
              </Button>
            </div>
          </CardContent>
        </Card>

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
                return (
                  <Card
                    key={link.href}
                    className={`cursor-pointer hover:border-green-500 hover:shadow-md transition-all card-transparent ${link.highlight ? "border-blue-300 bg-blue-50/50" : ""
                      }`}
                    onClick={() => !link.disabled && router.push(link.href)}
                  >
                    <CardContent className="p-6">
                      <div className={`flex items-center justify-between ${link.disabled ? "opacity-50" : ""}`}>
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${link.highlight ? "bg-blue-100/80" : "bg-gray-100/80"}`}>
                            <Icon className={`h-6 w-6 ${link.highlight ? "text-blue-700" : "text-gray-700"}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {link.title}
                              {link.disabled && <span className="text-xs text-gray-500 ml-2">(V2)</span>}
                            </h3>
                            <p className="text-sm text-gray-600">{link.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {link.count !== null && (
                            <span className="text-2xl font-bold text-gray-400">{link.count}</span>
                          )}
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 py-4 mt-8 footer-transparent">
        <div className="container mx-auto px-6 text-center text-sm text-gray-600">
          © 2025 DMS Clinical Services. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
