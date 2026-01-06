"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { RoleNav } from "@/components/role-nav"
import { AIAssistantButton } from "@/components/ai-assistant"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, UserCheck, FileBarChart, ChevronRight, QrCode, Calendar, Activity, Mail, Send, Search, UserPlus, Scale } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { User, Enrollment, UserRole, Message } from "@/lib/types"

export default function AdminDashboard() {
  const router = useRouter()
  const { programs, users, enrollments, messages, currentUser, addMessage, markMessageRead } = useStore()

  const [showMessageCompose, setShowMessageCompose] = useState(false)
  const [composeToRole, setComposeToRole] = useState<UserRole | "">("")
  const [composeToId, setComposeToId] = useState("")
  const [composeSearch, setComposeSearch] = useState("")
  const [messageText, setMessageText] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [messageError, setMessageError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [showUserRoleModal, setShowUserRoleModal] = useState(false)

  const stats = {
    totalParticipants: users.filter((u: User) => u.role === "participant").length,
    activeEnrollments: enrollments.filter((e: Enrollment) => e.status === "active").length,
    totalPrograms: programs.length,
    completionRate: 75, // Mock
  }

  const navigationTiles = [
    {
      title: "Add User",
      description: "Add a new facilitator or participant",
      icon: UserPlus,
      href: "/admin/users",
    },
    {
      title: "Programs",
      description: "Manage programs and sessions",
      icon: BookOpen,
      href: "/admin/programs",
      count: stats.totalPrograms,
    },
    {
      title: "Courts",
      description: "Manage court types and assignments",
      icon: Scale,
      href: "/admin/courts",
    },
    {
      title: "Users",
      description: "Manage users and roles",
      icon: Users,
      href: "#",
      onClick: () => setShowUserRoleModal(true),
      count: users.length,
    },
    {
      title: "Enrollments",
      description: "Manage participant enrollments",
      icon: UserCheck,
      href: "/admin/enrollments",
      count: stats.activeEnrollments,
    },
    {
      title: "Reports",
      description: "View reports and court summaries",
      icon: FileBarChart,
      href: "/admin/reports",
    },
    {
      title: "Facilitators",
      description: "Manage facilitator profiles and requests",
      icon: UserCheck,
      href: "/admin/facilitators",
      count: users.filter(u => u.role === 'facilitator').length,
    },
    {
      title: "Messages",
      description: "View and send system messages",
      icon: Mail,
      href: "#",
      onClick: () => setShowMessageCompose(true),
      count: messages.filter((m: Message) => !m.readAt && (m.recipientId === currentUser?.id || currentUser?.role === "admin")).length,
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
          <AIAssistantButton role="admin" />
        </div>

        {/* Debug Badge */}
        <div className="mb-4 flex items-center gap-2">
          <div className={`px-2 py-1 rounded text-xs font-mono font-bold ${users.length > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            Users: {users.length}
          </div>
          <div className={`px-2 py-1 rounded text-xs font-mono font-bold ${enrollments.length > 20 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            Enrollments: {enrollments.length}
          </div>
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

        {/* Quick Access Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {navigationTiles.map((item) => (
              <Card
                key={item.title}
                className="cursor-pointer hover:border-green-500 transition-all hover:shadow-md card-transparent group"
                onClick={() => {
                  if (item.onClick) item.onClick()
                  else router.push(item.href)
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-green-100 transition-colors">
                      <item.icon className="h-5 w-5 text-gray-600 group-hover:text-green-600" />
                    </div>
                    {item.count !== undefined && item.count !== null && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                        {item.count}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-3">
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                  <h3 className="font-semibold text-lg text-green-800">Court Intake QR Code</h3>
                  <p className="text-sm text-green-700">Scan at intake to register new participants</p>
                </div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <QrCode className="h-4 w-4 mr-2" />
                View Full QR Code
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card className="card-transparent mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>All system messages (Admin View)</CardDescription>
            </div>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowMessageCompose(true)}>
              <Mail className="h-4 w-4 mr-2" />
              Compose
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No messages found</p>
              ) : (
                messages
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5)
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-lg border transition-all cursor-pointer hover:bg-gray-50 ${!msg.readAt && (msg.recipientId === currentUser?.id) ? "border-green-200 bg-green-50/30" : "border-gray-200"
                        }`}
                      onClick={() => setSelectedMessage(msg)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{msg.fromName}</span>
                          <Badge variant="outline" className="text-[10px] uppercase">
                            {msg.senderRole}
                          </Badge>
                          {msg.isUrgent && (
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm text-gray-800">{msg.title}</h4>
                      <p className="text-xs text-gray-600 line-clamp-1 mt-1">{msg.content}</p>
                    </div>
                  ))
              )}
              {messages.length > 5 && (
                <Button variant="ghost" className="w-full text-gray-500 text-sm">
                  View All Messages
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Compose Modal */}
        <Dialog open={showMessageCompose} onOpenChange={setShowMessageCompose}>
          <DialogContent className="max-w-md card-transparent">
            <DialogHeader>
              <DialogTitle>Compose Message</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">To (Select Role):</label>
                <Select value={composeToRole} onValueChange={(val: any) => { setComposeToRole(val); setComposeToId(""); setComposeSearch(""); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="facilitator">Facilitator</SelectItem>
                    <SelectItem value="participant">Participant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {composeToRole && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Search {composeToRole}:</label>
                  <div className="relative mb-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-8"
                      placeholder="Type name to filter..."
                      value={composeSearch}
                      onChange={(e) => setComposeSearch(e.target.value)}
                    />
                  </div>
                  <Select value={composeToId} onValueChange={setComposeToId}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${composeToRole}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {users
                        .filter((u: any) => u.role === (composeToRole as UserRole) && u.id !== currentUser?.id)
                        .filter((u: any) => u.name.toLowerCase().includes(composeSearch.toLowerCase()))
                        .map((u: any) => (
                          <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  rows={4}
                />
              </div>
              {messageError && (
                <p className="text-sm text-red-600 font-medium">{messageError}</p>
              )}
              <Button
                className="bg-green-600 hover:bg-green-700 w-full"
                onClick={async () => {
                  if (!messageText.trim() || !composeToId || !currentUser) return

                  setIsSending(true)
                  setMessageError(null)

                  try {
                    await addMessage({
                      senderId: currentUser.id,
                      senderRole: currentUser.role,
                      recipientId: composeToId,
                      recipientRole: composeToRole as UserRole,
                      title: "Message from Admin",
                      content: messageText,
                      fromName: currentUser.name,
                      readAt: null,
                      createdAt: new Date().toISOString()
                    })

                    setShowMessageCompose(false)
                    setMessageText("")
                    setComposeToId("")
                    setComposeToRole("")
                    setComposeSearch("")
                  } catch (e) {
                    setMessageError("Message could not be sent")
                  } finally {
                    setIsSending(false)
                  }
                }}
                disabled={!composeToId || !messageText.trim() || isSending}
              >
                {isSending ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Message View Modal */}
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="max-w-md card-transparent">
            {selectedMessage && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedMessage.title}</DialogTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">From: {selectedMessage.fromName}</span>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {selectedMessage.senderRole}
                    </Badge>
                  </div>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
                <div className="flex justify-end gap-2">
                  {!selectedMessage.readAt && selectedMessage.recipientId === currentUser?.id && (
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        markMessageRead(selectedMessage.id)
                        setSelectedMessage(null)
                      }}
                    >
                      Mark as Read
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                    Close
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
        {/* User Role Management Modal */}
        <Dialog open={showUserRoleModal} onOpenChange={setShowUserRoleModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Manage Users</DialogTitle>
              <DialogDescription>Choose a role to manage existing profiles.</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 py-6">
              <Button
                variant="outline"
                className="h-32 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50"
                onClick={() => {
                  router.push("/admin/facilitators")
                  setShowUserRoleModal(false)
                }}
              >
                <UserCheck className="h-8 w-8 text-blue-600" />
                <div className="font-bold">Manage Facilitators</div>
              </Button>
              <Button
                variant="outline"
                className="h-32 flex flex-col items-center justify-center gap-2 hover:border-green-500 hover:bg-green-50"
                onClick={() => {
                  router.push("/admin/users")
                  setShowUserRoleModal(false)
                }}
              >
                <Users className="h-8 w-8 text-green-600" />
                <div className="font-bold">Manage Participants</div>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
