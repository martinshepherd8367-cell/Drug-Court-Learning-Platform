"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { RoleNav } from "@/components/role-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, User, Send, Info, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"

export default function FacilitatorProfile() {
    const router = useRouter()
    const { currentUser, facilitatorRequests } = useStore()

    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    // Request Form State
    const [requestForm, setRequestForm] = useState({
        phone: currentUser?.phone || "",
        address: currentUser?.address || "",
        credentials: currentUser?.credentials || "",
        certifications: (currentUser?.certifications || []).join('\n'),
        availabilityNotes: currentUser?.availabilityNotes || ""
    })

    const myRequests = useMemo(() => {
        return facilitatorRequests
            .filter(r => r.facilitatorId === currentUser?.id)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    }, [facilitatorRequests, currentUser])

    const pendingRequest = useMemo(() => {
        return myRequests.find(r => r.status === "pending")
    }, [myRequests])

    const handleSubmitRequest = async () => {
        if (!currentUser) return
        setBusy(true)
        setError(null)
        setSuccess(false)
        try {
            // Determine what changed
            const changes: any = {}
            if (requestForm.phone !== (currentUser.phone || "")) changes.phone = requestForm.phone
            if (requestForm.address !== (currentUser.address || "")) changes.address = requestForm.address
            if (requestForm.credentials !== (currentUser.credentials || "")) changes.credentials = requestForm.credentials

            const currentCerts = (currentUser.certifications || []).join('\n')
            if (requestForm.certifications !== currentCerts) {
                changes.certifications = requestForm.certifications.split('\n').filter(s => s.trim())
            }

            if (requestForm.availabilityNotes !== (currentUser.availabilityNotes || "")) {
                changes.availabilityNotes = requestForm.availabilityNotes
            }

            if (Object.keys(changes).length === 0) {
                throw new Error("No changes detected to submit.")
            }

            const res = await fetch("/api/facilitator/profile/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ changes })
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Submission failed")
            }

            setSuccess(true)
            // Note: Store will be updated via re-bootstrap or we could optimistically update it
            // For now, let's just show a success state
        } catch (e: any) {
            setError(e.message)
        } finally {
            setBusy(false)
        }
    }

    if (!currentUser) return null

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <RoleNav />

            <main className="container mx-auto px-6 py-8">
                <div className="mb-8">
                    <Button variant="ghost" onClick={() => router.push("/facilitator")} className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                        <p className="text-gray-600 mt-1">View and manage your professional credentials and contact information</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Profile Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Authoritative Information</CardTitle>
                                <CardDescription>
                                    This information is maintained by the Administration and appears on official reports.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <Label className="text-gray-400 uppercase text-[10px] font-bold">Full Name</Label>
                                        <div className="text-lg font-semibold">{currentUser.name}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-gray-400 uppercase text-[10px] font-bold">Email (Official)</Label>
                                        <div className="text-lg font-semibold">{currentUser.email}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-gray-400 uppercase text-[10px] font-bold">Agency</Label>
                                        <div className="text-lg font-semibold">{currentUser.agency || "None assigned"}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-gray-400 uppercase text-[10px] font-bold">Member Role</Label>
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-blue-600">Facilitator</Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-4 border-t">
                                    <Label className="text-gray-400 uppercase text-[10px] font-bold">Program Authorizations</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {currentUser.authorizedPrograms?.map(pId => (
                                            <Badge key={pId} variant="outline" className="text-xs bg-white">
                                                {pId}
                                            </Badge>
                                        )) || <div className="text-sm text-gray-500 italic">No programs authorized yet</div>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Request Profile Updates</CardTitle>
                                <CardDescription>
                                    Update your contact details or credentials. These changes require Admin approval before being applied.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {pendingRequest && (
                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 items-start mb-6">
                                        <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                                        <div className="text-sm text-amber-800">
                                            <p className="font-semibold">Review Pending</p>
                                            <p>You have a pending update request from {new Date(pendingRequest.timestamp).toLocaleDateString()}. You cannot submit new changes until the previous request is reviewed.</p>
                                        </div>
                                    </div>
                                )}

                                {success && (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3 items-start mb-6">
                                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                                        <div className="text-sm text-green-800">
                                            <p className="font-semibold">Request Submitted</p>
                                            <p>Your update request has been sent to the Administration for review. You will be notified via internal messaging once processed.</p>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-start mb-6">
                                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                                        <div className="text-sm text-red-800">
                                            <p className="font-semibold">Submission Error</p>
                                            <p>{error}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            disabled={!!pendingRequest || busy}
                                            value={requestForm.phone}
                                            onChange={(e) => setRequestForm({ ...requestForm, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="credentials">Credentials (e.g. LPC, LCSW)</Label>
                                        <Input
                                            id="credentials"
                                            disabled={!!pendingRequest || busy}
                                            value={requestForm.credentials}
                                            onChange={(e) => setRequestForm({ ...requestForm, credentials: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Mailing Address</Label>
                                    <Input
                                        id="address"
                                        disabled={!!pendingRequest || busy}
                                        value={requestForm.address}
                                        onChange={(e) => setRequestForm({ ...requestForm, address: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="certs">Certifications (One per line)</Label>
                                    <Textarea
                                        id="certs"
                                        className="h-28"
                                        disabled={!!pendingRequest || busy}
                                        placeholder="Enter certifications..."
                                        value={requestForm.certifications}
                                        onChange={(e) => setRequestForm({ ...requestForm, certifications: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Availability Notes</Label>
                                    <Textarea
                                        id="notes"
                                        className="h-24"
                                        disabled={!!pendingRequest || busy}
                                        placeholder="e.g. Not available Thursday mornings..."
                                        value={requestForm.availabilityNotes}
                                        onChange={(e) => setRequestForm({ ...requestForm, availabilityNotes: e.target.value })}
                                    />
                                </div>

                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700 h-12"
                                    disabled={!!pendingRequest || busy}
                                    onClick={handleSubmitRequest}
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    {busy ? "Submitting..." : "Submit Update Request"}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar: Status & History */}
                    <div className="space-y-8">
                        <Card>
                            <CardHeader className="pb-3 border-b">
                                <CardTitle className="text-lg">Recent Activities</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-6">
                                    {myRequests.length === 0 ? (
                                        <div className="text-center py-6 text-gray-400 italic text-sm">No recent requests</div>
                                    ) : (
                                        myRequests.slice(0, 5).map(r => (
                                            <div key={r.id} className="flex gap-3">
                                                <div className="mt-1">
                                                    {r.status === "approved" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                                    {r.status === "rejected" && <XCircle className="h-4 w-4 text-red-500" />}
                                                    {r.status === "pending" && <Clock className="h-4 w-4 text-amber-500" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                                            {r.status}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400">
                                                            {new Date(r.timestamp).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-gray-700 mt-1">
                                                        Request to update {Object.keys(r.changes).join(', ')}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-4 bg-blue-900 text-white rounded-xl shadow-lg flex items-start gap-4">
                            <div className="p-2 bg-blue-800 rounded-lg">
                                <Info className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold mb-1">Authoritative Data Policy</p>
                                <p className="text-xs text-blue-100 leading-relaxed">
                                    The Clinical Platform maintains strict data governance. All profile changes are logged in an immutable audit history and must be adjudicated by an Administrator.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
