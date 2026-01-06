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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    ArrowLeft,
    User,
    Edit,
    Search,
    ClipboardCheck,
    History,
    CheckCircle,
    XCircle,
    AlertCircle,
    ShieldCheck,
    Briefcase
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import type { User as UserType, FacilitatorProfileUpdate, FacilitatorHistoryRecord } from "@/lib/types"

export default function FacilitatorManagement() {
    const router = useRouter()
    const {
        users,
        programs,
        facilitatorHistory,
        facilitatorRequests,
        updateFacilitatorProfile,
        reviewFacilitatorRequest,
        activateUser,
        createFacilitator
    } = useStore()

    const [authStatus, setAuthStatus] = useState<{ exists: boolean, checked: boolean }>({ exists: false, checked: false })

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedFacilitator, setSelectedFacilitator] = useState<UserType | null>(null)
    const [showEditProfile, setShowEditProfile] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const [showReviewRequest, setShowReviewRequest] = useState(false)
    const [showActivateDialog, setShowActivateDialog] = useState(false)
    const [showAddFacilitator, setShowAddFacilitator] = useState(false)
    const [addForm, setAddForm] = useState({ name: "", email: "", authorizedPrograms: [] as string[] })
    const [activateInput, setActivateInput] = useState("")
    const [activeRequest, setActiveRequest] = useState<FacilitatorProfileUpdate | null>(null)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Edit Form State
    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        phone: "",
        agency: "",
        credentials: "",
        certifications: [] as string[],
        authorizedPrograms: [] as string[]
    })

    const facilitators = useMemo(() => {
        return users.filter(u => u.role === "facilitator" &&
            (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    }, [users, searchTerm])

    const pendingRequests = useMemo(() => {
        return facilitatorRequests.filter(r => r.status === "pending")
    }, [facilitatorRequests])

    const handleEditClick = (facilitator: UserType) => {
        setSelectedFacilitator(facilitator)
        setEditForm({
            name: facilitator.name || "",
            email: facilitator.email || "",
            phone: facilitator.phone || "",
            agency: facilitator.agency || "",
            credentials: facilitator.credentials || "",
            certifications: facilitator.certifications || [],
            authorizedPrograms: facilitator.authorizedPrograms || []
        })
        setShowEditProfile(true)
    }

    const handleSaveProfile = async () => {
        if (!selectedFacilitator) return
        setBusy(true)
        setError(null)
        try {
            await updateFacilitatorProfile({
                facilitatorId: selectedFacilitator.id,
                ...editForm
            })
            setShowEditProfile(false)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setBusy(false)
        }
    }

    const handleReviewClick = (request: FacilitatorProfileUpdate) => {
        setActiveRequest(request)
        setShowReviewRequest(true)
    }

    const handleReviewAction = async (action: "approve" | "reject") => {
        if (!activeRequest) return
        setBusy(true)
        setError(null)
        try {
            await reviewFacilitatorRequest(activeRequest.id, action)
            setShowReviewRequest(false)
            setActiveRequest(null)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setBusy(false)
        }
    }

    const handleHistoryClick = (facilitator: UserType) => {
        setSelectedFacilitator(facilitator)
        setShowHistory(true)
    }

    const handleAddFacilitator = async () => {
        if (!addForm.name || !addForm.email || addForm.authorizedPrograms.length === 0) return
        setBusy(true)
        setError(null)
        try {
            await createFacilitator(addForm)
            setShowAddFacilitator(false)
            setAddForm({ name: "", email: "", authorizedPrograms: [] })
        } catch (e: any) {
            setError(e.message)
        } finally {
            setBusy(false)
        }
    }

    const handleActivateClick = async (facilitator: UserType) => {
        setSelectedFacilitator(facilitator)
        setShowActivateDialog(true)
        setAuthStatus({ exists: false, checked: false })
        setBusy(true)
        setError(null)
        try {
            const res = await fetch(`/ api / admin / users / auth - status ? email = ${encodeURIComponent(facilitator.email || "")} `)
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
        if (!selectedFacilitator || !authStatus.exists) return
        setBusy(true)
        setError(null)
        try {
            await activateUser(selectedFacilitator.id)
            setShowActivateDialog(false)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setBusy(false)
        }
    }

    const getFacilitatorHistory = (facilitatorId: string) => {
        return facilitatorHistory
            .filter(h => h.facilitatorId === facilitatorId)
            .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())
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
                            <h1 className="text-3xl font-bold text-gray-900">Facilitator Management</h1>
                            <p className="text-gray-600 mt-1">Manage authoritative profiles and review update requests</p>
                        </div>
                        <Button onClick={() => setShowAddFacilitator(true)} className="bg-blue-600 hover:bg-blue-700">
                            <User className="h-4 w-4 mr-2" />
                            Add Facilitator
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="facilitators" className="space-y-6">
                    <TabsList className="bg-white border">
                        <TabsTrigger value="facilitators" className="gap-2">
                            <User className="h-4 w-4" />
                            Facilitators
                        </TabsTrigger>
                        <TabsTrigger value="requests" className="gap-2 relative">
                            <ClipboardCheck className="h-4 w-4" />
                            Review Queue
                            {pendingRequests.length > 0 && (
                                <Badge className="ml-1 bg-blue-600 text-[10px] h-4 w-4 p-0 items-center justify-center rounded-full">
                                    {pendingRequests.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="facilitators">
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    className="pl-10 bg-white border-gray-200"
                                    placeholder="Search facilitators by name or agency..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <Card>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Facilitator</TableHead>
                                                <TableHead>Agency & Credentials</TableHead>
                                                <TableHead>Authorizations</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {facilitators.map((f) => (
                                                <TableRow key={f.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="font-semibold text-gray-900">{f.name}</div>
                                                            {f.userId ? (
                                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 text-[9px] px-1 h-4 gap-1">
                                                                    <ShieldCheck className="h-2.5 w-2.5" />
                                                                    BOUND
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="text-orange-600 border-orange-200 text-[9px] px-1 h-4">
                                                                    UNBOUND
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{f.email}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm font-medium">{f.agency || "No Agency"}</div>
                                                        <div className="text-xs text-gray-500">{f.credentials || "No Credentials"}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1">
                                                            {f.authorizedPrograms && f.authorizedPrograms.length > 0 ? (
                                                                f.authorizedPrograms.map(pId => (
                                                                    <Badge key={pId} variant="outline" className="text-[10px] py-0 border-blue-100 bg-blue-50/30 text-blue-700">
                                                                        {pId}
                                                                    </Badge>
                                                                ))
                                                            ) : (
                                                                <span className="text-xs text-gray-400 italic">None</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="ghost" size="sm" onClick={() => handleHistoryClick(f)}>
                                                                <History className="h-4 w-4" />
                                                            </Button>
                                                            {!f.userId && (
                                                                <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => handleActivateClick(f)}>
                                                                    <ShieldCheck className="h-4 w-4 mr-2" />
                                                                    Authorize / Activate
                                                                </Button>
                                                            )}
                                                            <Button variant="outline" size="sm" onClick={() => handleEditClick(f)}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Edit Profile
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="requests">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pending Update Requests</CardTitle>
                                <CardDescription>Review and approve profile modifications submitted by facilitators</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {pendingRequests.length === 0 ? (
                                    <div className="text-center py-12 border-2 border-dashed rounded-lg border-gray-100">
                                        <p className="text-gray-400 italic">No pending requests at this time.</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Facilitator</TableHead>
                                                <TableHead>Changed Fields</TableHead>
                                                <TableHead>Submitted</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {pendingRequests.map((r) => {
                                                const facilitator = users.find(u => u.id === r.facilitatorId)
                                                return (
                                                    <TableRow key={r.id}>
                                                        <TableCell>
                                                            <div className="font-semibold">{facilitator?.name}</div>
                                                            <div className="text-xs text-gray-500 text-clip max-w-[150px]">{facilitator?.email}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-wrap gap-2">
                                                                {Object.keys(r.changes).map(field => (
                                                                    <Badge key={field} variant="secondary" className="text-[10px]">
                                                                        {field}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-xs text-gray-500">
                                                            {new Date(r.timestamp).toLocaleString()}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="outline" size="sm" onClick={() => handleReviewClick(r)}>
                                                                Review
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Edit Profile Dialog */}
            <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
                <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Edit Facilitator Profile</DialogTitle>
                        <DialogDescription>
                            Update authoritative details for {selectedFacilitator?.name}.
                        </DialogDescription>
                    </DialogHeader>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    <ScrollArea className="flex-1 pr-4">
                        <div className="space-y-6 py-4">
                            {/* Identity Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 pb-2 border-b">
                                    <User className="h-4 w-4" />
                                    Identity & Contact
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <Input
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone Number</Label>
                                        <Input
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Agency & Role Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 pb-2 border-b">
                                    <Briefcase className="h-4 w-4" />
                                    Professional context
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Agency</Label>
                                        <Input
                                            value={editForm.agency}
                                            onChange={(e) => setEditForm({ ...editForm, agency: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Credentials</Label>
                                        <Input
                                            value={editForm.credentials}
                                            placeholder="e.g. MSW, LCSW, LPC"
                                            onChange={(e) => setEditForm({ ...editForm, credentials: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Certifications</Label>
                                    <Textarea
                                        placeholder="Enter certifications separated by new lines"
                                        className="h-20"
                                        value={editForm.certifications.join('\n')}
                                        onChange={(e) => setEditForm({ ...editForm, certifications: e.target.value.split('\n').filter(s => s.trim()) })}
                                    />
                                </div>
                            </div>

                            {/* Authorizations Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 pb-2 border-b">
                                    <ShieldCheck className="h-4 w-4" />
                                    Authorized Classes
                                </div>
                                <div className="text-xs text-gray-500 mb-2">
                                    Grant authority to facilitate specific curriculum-based classes.
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {CANONICAL_CLASSES.map(className => (
                                        <div key={className} className="flex items-center gap-3 p-2 rounded-lg border bg-white hover:bg-gray-50">
                                            <Checkbox
                                                id={`auth - ${className} `}
                                                checked={editForm.authorizedPrograms.includes(className)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setEditForm({ ...editForm, authorizedPrograms: [...editForm.authorizedPrograms, className] })
                                                    } else {
                                                        setEditForm({ ...editForm, authorizedPrograms: editForm.authorizedPrograms.filter(id => id !== className) })
                                                    }
                                                }}
                                            />
                                            <Label htmlFor={`auth - ${className} `} className="flex-1 cursor-pointer text-xs font-medium">
                                                {className}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    <DialogFooter className="mt-4 pt-4 border-t">
                        <Button variant="outline" onClick={() => setShowEditProfile(false)} disabled={busy}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveProfile} disabled={busy} className="bg-blue-600 hover:bg-blue-700">
                            {busy ? "Saving..." : "Save Profile"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Review Request Dialog */}
            <Dialog open={showReviewRequest} onOpenChange={setShowReviewRequest}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Review Update Request</DialogTitle>
                        <DialogDescription>
                            A facilitator has requested the following changes to their profile.
                        </DialogDescription>
                    </DialogHeader>

                    {activeRequest && (
                        <div className="space-y-4 py-4">
                            <div className="p-4 bg-gray-50 rounded-lg border">
                                <div className="text-sm font-semibold mb-3 pb-2 border-b">Proposed Changes</div>
                                <div className="space-y-3">
                                    {Object.entries(activeRequest.changes).map(([field, newVal]) => {
                                        const facilitator = users.find(u => u.id === activeRequest.facilitatorId)
                                        const oldVal = facilitator ? (facilitator as any)[field] : null

                                        return (
                                            <div key={field} className="grid grid-cols-2 gap-4">
                                                <div className="text-xs">
                                                    <div className="text-gray-500 font-medium uppercase text-[10px] mb-1">{field} (Current)</div>
                                                    <div className="p-2 border rounded bg-white text-gray-400 line-through truncate">
                                                        {Array.isArray(oldVal) ? oldVal.join(', ') : (oldVal || "None")}
                                                    </div>
                                                </div>
                                                <div className="text-xs">
                                                    <div className="text-blue-600 font-medium uppercase text-[10px] mb-1">{field} (New)</div>
                                                    <div className="p-2 border border-blue-200 rounded bg-blue-50 text-blue-900 font-medium truncate">
                                                        {Array.isArray(newVal) ? newVal.join(', ') : (newVal || "None")}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {activeRequest.adminNote && (
                                <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-xs italic">
                                    Note from system: Facilitator has submitted this request via their profile page.
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleReviewAction("reject")} disabled={busy}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Request
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleReviewAction("approve")} disabled={busy}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve & Apply
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* History Dialog */}
            <Dialog open={showHistory} onOpenChange={setShowHistory}>
                <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Profile Audit History</DialogTitle>
                        <DialogDescription>
                            Immutable record of all changes to {selectedFacilitator?.name}'s profile.
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="flex-1 pr-4">
                        <div className="space-y-6 py-4">
                            {selectedFacilitator && getFacilitatorHistory(selectedFacilitator.id).length === 0 ? (
                                <div className="text-center py-10 text-gray-400 italic">No history records found for this facilitator.</div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedFacilitator && getFacilitatorHistory(selectedFacilitator.id).map((record, idx) => (
                                        <div key={record.id} className="relative pl-6 pb-6 border-l border-gray-200 last:pb-0">
                                            <div className="absolute left-[-5px] top-0 h-2.5 w-2.5 rounded-full bg-blue-500" />
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {record.type.replace(/_/g, ' ').toUpperCase()}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(record.changedAt).toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-600 mb-2">
                                                Changed by: <span className="font-medium">{users.find(u => u.id === record.changedBy)?.name || record.changedBy}</span>
                                            </div>
                                            <div className="p-3 bg-white border rounded-lg space-y-2">
                                                <div className="grid grid-cols-4 text-[10px] font-bold text-gray-400 uppercase">
                                                    <div className="col-span-1">Field</div>
                                                    <div className="col-span-3 flex gap-4">
                                                        <div className="flex-1">Old Value</div>
                                                        <div className="flex-1 text-blue-600">New Value</div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-4 text-xs gap-4 items-center border-t pt-2">
                                                    <div className="font-medium text-gray-700">{record.fieldName}</div>
                                                    <div className="col-span-3 flex gap-4 overflow-hidden">
                                                        <div className="flex-1 text-gray-400 truncate line-through italic">
                                                            {Array.isArray(record.oldValue) ? record.oldValue.join(', ') : (record.oldValue || "None")}
                                                        </div>
                                                        <div className="flex-1 text-gray-900 font-medium truncate">
                                                            {Array.isArray(record.newValue) ? record.newValue.join(', ') : (record.newValue || "None")}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowHistory(false)}>Close History</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Activate Facilitator Identity Dialog */}
            <Dialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Activate Facilitator Identity</DialogTitle>
                        <DialogDescription>
                            Bind this profile to a verified Gmail address or existing Auth UID. This enables platform access.
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
                            <div className="text-xs text-blue-800 font-medium">Verify Identity for {selectedFacilitator?.name}</div>
                            <div className="text-[11px] text-blue-700">
                                This action will bind the following email to this facilitator profile:
                                <div className="mt-1 font-mono font-bold">{selectedFacilitator?.email}</div>
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
                                <CheckCircle className="h-4 w-4" />
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

            {/* Add Facilitator Dialog */}
            <Dialog open={showAddFacilitator} onOpenChange={setShowAddFacilitator}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Facilitator Profile</DialogTitle>
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
                                value={addForm.name}
                                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                                placeholder="e.g. John Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                value={addForm.email}
                                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                                placeholder="e.g. john@gmail.com"
                                type="email"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex justify-between items-center">
                                <span>Authorized Classes (REQUIRED)</span>
                                <span className="text-[10px] text-blue-600 font-bold">
                                    {addForm.authorizedPrograms.length} selected
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
                                                id={`add - auth - ${className} `}
                                                checked={addForm.authorizedPrograms.includes(className)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setAddForm({ ...addForm, authorizedPrograms: [...addForm.authorizedPrograms, className] })
                                                    } else {
                                                        setAddForm({ ...addForm, authorizedPrograms: addForm.authorizedPrograms.filter(id => id !== className) })
                                                    }
                                                }}
                                            />
                                            <Label htmlFor={`add - auth - ${className} `} className="flex-1 cursor-pointer text-xs font-medium">
                                                {className}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                            {addForm.authorizedPrograms.length === 0 && (
                                <p className="text-[10px] text-red-500 font-bold mt-1 inline-flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    At least one class must be selected
                                </p>
                            )}
                        </div>

                        <p className="text-[10px] text-gray-500 italic">
                            Friendly reminder: This creates a profile stub. The facilitator will still need to perform a "Sign In with Google" at least once before you can bind their identity.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddFacilitator(false)} disabled={busy}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddFacilitator}
                            disabled={busy || !addForm.name || !addForm.email || addForm.authorizedPrograms.length === 0}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {busy ? "Creating..." : "Create Facilitator"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
