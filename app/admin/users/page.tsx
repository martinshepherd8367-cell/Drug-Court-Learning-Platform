"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { CANONICAL_CLASSES } from "@/lib/constants"
import { RoleNav } from "@/components/role-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Plus, User, Shield, Users, Edit, Search, AlertCircle, Pause, Play, CheckCircle as CheckCircleIcon } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { UserRole, User as UserType } from "@/lib/types"

export default function UserManagement() {
  const router = useRouter()
  const { users, setUsers, courts, programs, createFacilitator, activateUser } = useStore()
  const [showActivateDialog, setShowActivateDialog] = useState(false)
  const [authStatus, setAuthStatus] = useState<{ exists: boolean, checked: boolean }>({ exists: false, checked: false })

  const [searchTerm, setSearchTerm] = useState("")
  const [showAddUser, setShowAddUser] = useState(false)
  const [showEditUser, setShowEditUser] = useState(false)
  const [showPauseDialog, setShowPauseDialog] = useState(false)
  const [showReactivateDialog, setShowReactivateDialog] = useState(false)
  const [pausingUser, setPausingUser] = useState<UserType | null>(null)
  const [reactivatingUser, setReactivatingUser] = useState<UserType | null>(null)
  const [pauseData, setPauseData] = useState({
    reason: "",
    date: new Date().toISOString().split('T')[0],
    returnDate: "",
  })
  const [reactivationPath, setReactivationPath] = useState<"resume" | "revised">("resume")
  const [revisedConfig, setRevisedConfig] = useState<Record<string, "retained" | "repeat">>({})
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCreationChooser, setShowCreationChooser] = useState(false)
  const [showAddFacilitator, setShowAddFacilitator] = useState(false)
  const [newFacilitator, setNewFacilitator] = useState({
    name: "",
    email: "",
    authorizedPrograms: [] as string[]
  })

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "participant" as UserRole,
    status: "active" as "active" | "inactive" | "paused",
    courtId: "",
    county: "",
  })

  const filteredUsers = useMemo(() => {
    return users.filter(u =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [users, searchTerm])

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-red-600 gap-1 text-white">
            <Shield className="h-3 w-3" />
            Admin
          </Badge>
        )
      case "facilitator":
        return (
          <Badge className="bg-blue-600 gap-1 text-white">
            <User className="h-3 w-3" />
            Facilitator
          </Badge>
        )
      case "participant":
        return (
          <Badge variant="secondary" className="gap-1">
            <Users className="h-3 w-3" />
            Participant
          </Badge>
        )
    }
  }

  const getStatusBadge = (user: any) => {
    switch (user.status) {
      case "active":
        return <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
      case "paused":
        return <Badge variant="outline" className="text-amber-600 border-amber-600">Paused</Badge>
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>
      default:
        return <Badge variant="outline">{user.status || "Active"}</Badge>
    }
  }

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })
      if (!res.ok) throw new Error(await res.text())
      const savedUser = await res.json()
      setUsers([...users, savedUser])
      setShowAddUser(false)
      setNewUser({ name: "", email: "", role: "participant", status: "active", courtId: "", county: "" })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const handleAddFacilitator = async () => {
    if (!newFacilitator.name || !newFacilitator.email || newFacilitator.authorizedPrograms.length === 0) return
    setBusy(true)
    setError(null)
    try {
      await createFacilitator(newFacilitator)
      setShowAddFacilitator(false)
      setNewFacilitator({ name: "", email: "", authorizedPrograms: [] })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const handleEditUser = (user: any) => {
    setSelectedUser({ ...user })
    setShowEditUser(true)
  }

  const handleSaveUser = async () => {
    if (!selectedUser) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedUser),
      })
      if (!res.ok) throw new Error(await res.text())
      const updatedUser = await res.json()
      setUsers(users.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u))
      setShowEditUser(false)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const handlePauseClick = (user: UserType) => {
    setPausingUser(user)
    setShowPauseDialog(true)
  }

  const handlePauseSubmit = async () => {
    if (!pausingUser) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/users/pause", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId: pausingUser.id,
          pauseReason: pauseData.reason,
          pauseDate: pauseData.date,
          expectedReturnDate: pauseData.returnDate,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to pause participant")
      }

      const updatedUsers = users.map(u =>
        u.id === pausingUser.id
          ? {
            ...u,
            status: "paused" as const,
            pauseReason: pauseData.reason,
            pauseDate: pauseData.date,
            expectedReturnDate: pauseData.returnDate
          }
          : u
      )
      setUsers(updatedUsers)
      setShowPauseDialog(false)
      setPausingUser(null)
      setPauseData({ reason: "", date: new Date().toISOString().split('T')[0], returnDate: "" })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const handleReactivateClick = (user: UserType) => {
    setReactivatingUser(user)
    setReactivationPath("resume")
    // Build initial config for all programs
    const initialConfig: Record<string, "retained" | "repeat"> = {}
    programs.forEach(p => {
      initialConfig[p.id] = "retained"
    })
    setRevisedConfig(initialConfig)
    setShowReactivateDialog(true)
  }

  const handleReactivateSubmit = async () => {
    if (!reactivatingUser) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/users/reactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId: reactivatingUser.id,
          reactivationPath,
          revisedTreatmentConfig: reactivationPath === "revised" ? revisedConfig : null,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to reactivate participant")
      }

      const resData = await res.json()
      const updatedUsers = users.map(u =>
        u.id === reactivatingUser.id
          ? {
            ...u,
            ...resData.data
          }
          : u
      )
      setUsers(updatedUsers)
      setShowReactivateDialog(false)
      setReactivatingUser(null)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const handleActivateClick = async (user: UserType) => {
    setSelectedUser(user)
    setShowActivateDialog(true)
    setAuthStatus({ exists: false, checked: false })
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/users/auth-status?email=${encodeURIComponent(user.email || "")}`)
      if (res.ok) {
        const data = await res.json()
        setAuthStatus({ exists: data.exists, checked: true })
      }
    } catch (e) {
      console.error("Failed to check auth status", e)
    } finally {
      setBusy(false)
    }
  }

  const handleActivateSubmit = async () => {
    if (!selectedUser || !authStatus.exists) return
    setBusy(true)
    setError(null)
    try {
      await activateUser(selectedUser.id)
      setShowActivateDialog(false)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <RoleNav />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/admin")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-1">Manage platform access and roles</p>
            </div>
            <Button onClick={() => setShowCreationChooser(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add User profile
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10 bg-white"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Users</CardTitle>
            <CardDescription>{users.length} total profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Court / CM</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-gray-900">{user.name}</div>
                        {user.userId ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 text-[9px] px-1 h-4 gap-1">
                            <Shield className="h-2.5 w-2.5" />
                            BOUND
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-orange-600 border-orange-200 text-[9px] px-1 h-4">
                            UNBOUND
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      {user.role === "participant" && (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-700">
                            {user.courtId ? (courts.find(c => c.id === user.courtId)?.name || user.courtId) : "No Court"}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            CM: {users.find(u => u.id === user.caseManagerId)?.name || "Unassigned"}
                          </div>
                        </div>
                      )}
                      {user.role === "case_manager" && (
                        <div className="text-xs text-gray-500">
                          {courts.filter(c => c.caseManagerIds.includes(user.id)).map(c => c.name).join(", ")}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(user)}</TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      {!user.userId && (user.role === "participant" || user.role === "facilitator") && (
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => handleActivateClick(user)}>
                          <Shield className="h-4 w-4 mr-2" />
                          Authorize / Activate
                        </Button>
                      )}
                      {user.role === "participant" && user.status === "active" && (
                        <Button variant="outline" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50" onClick={() => handlePauseClick(user)}>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </Button>
                      )}
                      {user.role === "participant" && user.status === "paused" && (
                        <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleReactivateClick(user)}>
                          <Play className="h-4 w-4 mr-2" />
                          Reactivate
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Add User Dialog */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create User Profile</DialogTitle>
            <DialogDescription>Add a new profile to the system. Authentication must be completed separately.</DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="user@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={newUser.role} onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="participant">Participant</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="case_manager">Case Manager</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-gray-500 italic mt-1">
                To create a Facilitator profile, please use the dedicated{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => {
                    setShowAddUser(false)
                    router.push("/admin/facilitators")
                  }}
                >
                  Facilitator Management
                </button>{" "}
                workflow.
              </p>
            </div>

            {newUser.role === "participant" && (
              <>
                <div className="space-y-2">
                  <Label>Court</Label>
                  <Select
                    value={newUser.courtId}
                    onValueChange={(value) => setNewUser({ ...newUser, courtId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a court" />
                    </SelectTrigger>
                    <SelectContent>
                      {courts.map((court) => (
                        <SelectItem key={court.id} value={court.id}>
                          {court.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>County of Origin</Label>
                  <Input
                    value={newUser.county}
                    onChange={(e) => setNewUser({ ...newUser, county: e.target.value })}
                    placeholder="e.g. Banks, Hall, etc."
                  />
                  <p className="text-[10px] text-gray-500 italic">
                    Note: Case Manager will be assigned automatically based on clinical load-balancing rules.
                  </p>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUser(false)} disabled={busy}>
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              disabled={
                busy ||
                !newUser.name ||
                !newUser.email ||
                (newUser.role === "participant" && (!newUser.courtId || !newUser.county))
              }
              className="bg-green-600 hover:bg-green-700"
            >
              {busy ? "Creating..." : "Create Profile"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Creation Chooser Modal */}
      <Dialog open={showCreationChooser} onOpenChange={setShowCreationChooser}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Profile</DialogTitle>
            <DialogDescription>Which type of profile would you like to create?</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant="outline"
              className="h-32 flex flex-col items-center justify-center gap-2 hover:border-green-500 hover:bg-green-50"
              onClick={() => {
                setShowCreationChooser(false)
                setShowAddUser(true)
              }}
            >
              <Users className="h-8 w-8 text-green-600" />
              <div className="font-bold">Participant</div>
              <div className="text-[10px] text-gray-500 text-center">Treatment path & enrollment</div>
            </Button>
            <Button
              variant="outline"
              className="h-32 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50"
              onClick={() => {
                setShowCreationChooser(false)
                setShowAddFacilitator(true)
              }}
            >
              <User className="h-8 w-8 text-blue-600" />
              <div className="font-bold">Facilitator</div>
              <div className="text-[10px] text-gray-500 text-center">Authored classes & schedules</div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Facilitator Dialog */}
      <Dialog open={showAddFacilitator} onOpenChange={setShowAddFacilitator}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Facilitator Profile</DialogTitle>
            <DialogDescription>
              Create a new canonical facilitator entry. Authentication is completed separately via Google Sign-In.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={newFacilitator.name}
                onChange={(e) => setNewFacilitator({ ...newFacilitator, name: e.target.value })}
                placeholder="e.g. John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={newFacilitator.email}
                onChange={(e) => setNewFacilitator({ ...newFacilitator, email: e.target.value })}
                placeholder="e.g. john@gmail.com"
                type="email"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex justify-between items-center">
                <span>Authorized Classes (REQUIRED)</span>
                <span className="text-[10px] text-blue-600 font-bold">
                  {newFacilitator.authorizedPrograms.length} selected
                </span>
              </Label>
              <div className="text-[10px] text-gray-500 mb-2">
                Grant authority to facilitate specific curriculum-based classes.
              </div>
              <ScrollArea className="h-48 border rounded-lg p-3 bg-gray-50/50">
                <div className="grid grid-cols-1 gap-2">
                  {CANONICAL_CLASSES.map(className => (
                    <div key={className} className="flex items-center gap-3 p-2 rounded-lg border bg-white hover:bg-gray-50">
                      <Checkbox
                        id={`add-auth-${className}`}
                        checked={newFacilitator.authorizedPrograms.includes(className)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewFacilitator({ ...newFacilitator, authorizedPrograms: [...newFacilitator.authorizedPrograms, className] })
                          } else {
                            setNewFacilitator({ ...newFacilitator, authorizedPrograms: newFacilitator.authorizedPrograms.filter(id => id !== className) })
                          }
                        }}
                      />
                      <Label htmlFor={`add-auth-${className}`} className="flex-1 cursor-pointer text-xs font-medium">
                        {className}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              {newFacilitator.authorizedPrograms.length === 0 && (
                <p className="text-[10px] text-red-500 font-bold mt-1 inline-flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  At least one class must be selected
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddFacilitator(false)} disabled={busy}>
              Cancel
            </Button>
            <Button
              onClick={handleAddFacilitator}
              disabled={busy || !newFacilitator.name || !newFacilitator.email || newFacilitator.authorizedPrograms.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {busy ? "Creating..." : "Create Facilitator"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>Update user details, role, or status.</DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={selectedUser.email}
                  disabled={selectedUser.role !== "participant" || !!selectedUser.userId}
                  className={selectedUser.role !== "participant" || !!selectedUser.userId ? "bg-gray-50" : ""}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
                {selectedUser.role === "participant" && !selectedUser.userId && (
                  <p className="text-[10px] text-blue-600 italic">
                    Note: Email can be corrected while profile is UNBOUND.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value: UserRole) => setSelectedUser({ ...selectedUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="participant">Participant</SelectItem>
                    <SelectItem value="facilitator">Facilitator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Service Status</Label>
                <Select
                  value={selectedUser.status || "active"}
                  onValueChange={(value: any) => setSelectedUser({ ...selectedUser, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive (Access Denied)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedUser.role === "facilitator" && (
                <div className="space-y-2">
                  <Label>Class Assignments</Label>
                  <p className="text-sm text-gray-500">
                    Manage class assignments and schedules in the{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:underline font-medium"
                      onClick={() => {
                        setShowEditUser(false)
                        router.push("/admin/schedule")
                      }}
                    >
                      Schedule Manager
                    </button>
                    .
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditUser(false)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser} disabled={busy} className="bg-green-600 hover:bg-green-700">
              {busy ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-4 mt-8">
        <div className="container mx-auto px-6 text-center text-sm text-gray-500">
          © 2025 DMS Clinical Services. All rights reserved.
        </div>
      </footer>
      {/* Pause Participant Dialog */}
      <Dialog open={showPauseDialog} onOpenChange={setShowPauseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pause Participant</DialogTitle>
            <DialogDescription>
              Record the reason and dates for pausing this participant.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Pause Reason</Label>
              <Input
                value={pauseData.reason}
                onChange={(e) => setPauseData({ ...pauseData, reason: e.target.value })}
                placeholder="e.g. Medical leave, Employment conflict"
              />
            </div>

            <div className="space-y-2">
              <Label>Pause Start Date</Label>
              <Input
                type="date"
                value={pauseData.date}
                onChange={(e) => setPauseData({ ...pauseData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Expected Return Date (Optional)</Label>
              <Input
                type="date"
                value={pauseData.returnDate}
                onChange={(e) => setPauseData({ ...pauseData, returnDate: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPauseDialog(false)} disabled={busy}>
              Cancel
            </Button>
            <Button
              onClick={handlePauseSubmit}
              disabled={busy || !pauseData.reason || !pauseData.date}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {busy ? "Pausing..." : "Pause Participant"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reactivate Participant Dialog */}
      <Dialog open={showReactivateDialog} onOpenChange={setShowReactivateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Reactivate Participant</DialogTitle>
            <DialogDescription>
              Select a reactivation path and configure treatment eligibility if necessary.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="flex-1 overflow-y-auto py-4 space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-900">Choose Reactivation Path</Label>
              <RadioGroup
                value={reactivationPath}
                onValueChange={(v: any) => setReactivationPath(v)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className={`p-4 border rounded-lg cursor-pointer transition-colors ${reactivationPath === "resume" ? "border-green-600 bg-green-50" : "border-gray-200 hover:border-gray-300"}`} onClick={() => setReactivationPath("resume")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="resume" id="resume" />
                    <Label htmlFor="resume" className="font-bold cursor-pointer">Resume Prior Track</Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 ml-6">
                    Preserves all prior treatment eligibility rules and progress exactly as-is.
                  </p>
                </div>

                <div className={`p-4 border rounded-lg cursor-pointer transition-colors ${reactivationPath === "revised" ? "border-green-600 bg-green-50" : "border-gray-200 hover:border-gray-300"}`} onClick={() => setReactivationPath("revised")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="revised" id="revised" />
                    <Label htmlFor="revised" className="font-bold cursor-pointer">Revised Treatment Plan</Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 ml-6">
                    Manually configure which program credits are retained or must be repeated.
                  </p>
                </div>
              </RadioGroup>
            </div>

            {reactivationPath === "revised" && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Treatment Class Catalog</h3>
                  <Badge variant="outline" className="text-xs">Audit Mandatory</Badge>
                </div>
                <p className="text-sm text-gray-500">
                  Mark each program to define the participant's eligibility upon reactivation.
                </p>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {programs.map((program) => (
                    <div key={program.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{program.name}</div>
                        <div className="text-[10px] text-gray-500">{program.totalSessions} sessions</div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`retain-${program.id}`}
                            checked={revisedConfig[program.id] === "retained"}
                            onCheckedChange={() => setRevisedConfig({ ...revisedConfig, [program.id]: "retained" })}
                          />
                          <Label htmlFor={`retain-${program.id}`} className="text-xs font-medium cursor-pointer">Credit Retained</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`repeat-${program.id}`}
                            checked={revisedConfig[program.id] === "repeat"}
                            onCheckedChange={() => setRevisedConfig({ ...revisedConfig, [program.id]: "repeat" })}
                          />
                          <Label htmlFor={`repeat-${program.id}`} className="text-xs font-medium cursor-pointer text-orange-700">Must Repeat</Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Important:</p>
                <p>Upon reactivation, the participant will be unenrolled from all programs. No new enrollments will be created automatically.</p>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setShowReactivateDialog(false)} disabled={busy}>
              Cancel
            </Button>
            <Button
              onClick={handleReactivateSubmit}
              disabled={busy}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {busy ? "Reactivating..." : "Confirm Reactivation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Activation Dialog */}
      <Dialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Activate User Identity</DialogTitle>
            <DialogDescription>
              Bind this local profile to an authenticated Google account.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="space-y-4 py-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg space-y-2">
              <div className="text-xs text-blue-800 font-medium">Verify Identity for {selectedUser?.name}</div>
              <div className="text-[11px] text-blue-700">
                This action will bind the following email to this profile:
                <div className="mt-1 font-mono font-bold">{selectedUser?.email}</div>
              </div>
            </div>

            {authStatus.checked && !authStatus.exists && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>This user must sign in once using Google or Email before an administrator can activate their account.</span>
              </div>
            )}

            {authStatus.checked && authStatus.exists && (
              <div className="p-3 bg-green-50 text-green-700 rounded-lg text-xs flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Authenticated account found. Ready to bind.</span>
              </div>
            )}

            {!authStatus.checked && busy && (
              <div className="text-xs text-gray-400 italic">Checking authentication status...</div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActivateDialog(false)} disabled={busy}>
              Cancel
            </Button>
            <Button
              onClick={handleActivateSubmit}
              disabled={busy || !authStatus.exists}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {busy ? "Activating..." : "Authorize / Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
