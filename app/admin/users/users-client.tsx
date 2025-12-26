"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
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
import { ArrowLeft, Plus, User, Shield, Users, Edit, Trash2 } from "lucide-react"
import type { UserRole } from "@/lib/types"

export default function UserManagement() {
  const router = useRouter()
  // const {  users, programs  } = useStore()
  const [users, setUsers] = useState(initialUsers)

  const [showAddUser, setShowAddUser] = useState(false)
  const [showEditUser, setShowEditUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "participant" as UserRole,
  })

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-red-600 gap-1">
            <Shield className="h-3 w-3" />
            Admin
          </Badge>
        )
      case "facilitator":
        return (
          <Badge className="bg-blue-600 gap-1">
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

  const handleAddUser = () => {
    // TODO: Wire to backend
    console.log("Adding user:", newUser)
    setShowAddUser(false)
    setNewUser({ name: "", email: "", role: "participant" })
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setShowEditUser(true)
  }

  const handleSaveUser = () => {
    // TODO: Wire to backend
    console.log("Saving user:", selectedUser)
    setShowEditUser(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              <p className="text-gray-600 mt-1">Manage users and assign roles</p>
            </div>
            <Button onClick={() => setShowAddUser(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Shield className="h-6 w-6 text-red-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</p>
                  <p className="text-sm text-gray-600">Admins</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <User className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.filter((u) => u.role === "facilitator").length}</p>
                  <p className="text-sm text-gray-600">Facilitators</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Users className="h-6 w-6 text-gray-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.filter((u) => u.role === "participant").length}</p>
                  <p className="text-sm text-gray-600">Participants</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>{users.length} total users</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Enter name"
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
                  <SelectItem value="facilitator">Facilitator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUser(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} className="bg-green-600 hover:bg-green-700">
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details and role</DialogDescription>
          </DialogHeader>

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
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
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

              {selectedUser.role === "facilitator" && (
                <div className="space-y-2">
                  <Label>Assign to Programs</Label>
                  <p className="text-sm text-gray-500">TODO: Multi-select program assignment</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditUser(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser} className="bg-green-600 hover:bg-green-700">
              Save Changes
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
    </div>
  )
}
