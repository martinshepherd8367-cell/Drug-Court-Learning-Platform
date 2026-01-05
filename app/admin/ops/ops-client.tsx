"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
    ArrowLeft,
    RefreshCw,
    Search,
    UserPlus,
    MoveRight,
    Calendar,
    FileText,
    AlertCircle,
    CheckCircle2,
    Clock,
    UserMinus,
    Plus,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Props {
    participants: any[];
    programs: any[];
    enrollments: any[];
    attendance: any[];
    facilitators: any[];
    allEvents: any[];
    makeupAssignments: any[];
}

export function OpsClient({
    participants,
    programs,
    enrollments,
    attendance,
    facilitators,
    allEvents,
    makeupAssignments
}: Props) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("move");
    const [searchTerm, setSearchTerm] = useState("");
    const [busy, setBusy] = useState(false);
    const { correctAttendance } = useStore();

    // --- State for Dialogs ---
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
    const [targetProgram, setTargetProgram] = useState<string>("");
    const [targetSchedule, setTargetSchedule] = useState<any>(null);

    const [showMakeupModal, setShowMakeupModal] = useState(false);
    const [makeupData, setMakeupData] = useState({
        date: "",
        time: "10:00 AM",
        facilitatorId: ""
    });

    const [showCorrectModal, setShowCorrectModal] = useState(false);
    const [correctData, setCorrectData] = useState({
        attendanceId: "",
        status: "present" as "present" | "absent" | "excused",
        reason: ""
    });

    // --- Derived Data ---
    const filteredParticipants = useMemo(() => {
        return participants.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [participants, searchTerm]);

    const activeEnrollments = useMemo(() => {
        return enrollments.filter(e => e.status === "active");
    }, [enrollments]);

    const resolvedAttendance = useMemo(() => {
        const map = new Map<string, any>();
        [...attendance].sort((a, b) => {
            const dateA = a.correctedAt || a.completedAt || "";
            const dateB = b.correctedAt || b.completedAt || "";
            return dateA.localeCompare(dateB);
        }).forEach(a => {
            const key = `${a.participantId}-${a.sessionId}`;
            map.set(key, a);
        });
        return Array.from(map.values());
    }, [attendance]);

    const participantAbsences = useMemo(() => {
        const absencesByParticipant: Record<string, any[]> = {};
        resolvedAttendance.filter(a => a.status === "absent").forEach(a => {
            if (!absencesByParticipant[a.participantId]) absencesByParticipant[a.participantId] = [];
            absencesByParticipant[a.participantId].push(a);
        });
        return absencesByParticipant;
    }, [resolvedAttendance]);

    // --- Actions ---

    const handleMoveParticipant = async () => {
        if (!selectedParticipant || !targetProgram || !targetSchedule) return;
        setBusy(true);
        try {
            // 1. Find existing enrollment
            const currentEnr = activeEnrollments.find(e => e.participantId === selectedParticipant.id);

            // 2. Remove old (DELETE)
            if (currentEnr) {
                await fetch(`/api/admin/enrollments?id=${currentEnr.id}`, { method: "DELETE" });
            }

            // 3. Add new (POST)
            const res = await fetch("/api/admin/enrollments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    participantId: selectedParticipant.id,
                    programId: targetProgram,
                    schedule: targetSchedule,
                    status: "active",
                    startedAt: new Date().toISOString()
                })
            });

            if (!res.ok) throw new Error("Failed to add new enrollment");

            setShowMoveModal(false);
            router.refresh();
        } catch (e) {
            console.error(e);
        } finally {
            setBusy(false);
        }
    };

    const handleAssignMakeup = async () => {
        if (!selectedParticipant || !makeupData.date || !makeupData.facilitatorId) return;
        setBusy(true);
        try {
            const res = await fetch("/api/admin/makeup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    participantId: selectedParticipant.id,
                    participantName: selectedParticipant.name,
                    makeupDate: makeupData.date,
                    makeupTime: makeupData.time,
                    facilitatorId: makeupData.facilitatorId,
                    // Missed context could be added if we tracked WHICH absence this is for
                })
            });

            if (!res.ok) throw new Error("Failed to assign makeup");

            setShowMakeupModal(false);
            router.refresh();
        } catch (e) {
            console.error(e);
        } finally {
            setBusy(false);
        }
    };

    const getParticipantSummary = (participantId: string) => {
        const pEnrollments = enrollments.filter(e => e.participantId === participantId);
        const pAttendance = resolvedAttendance.filter(a => a.participantId === participantId);
        const active = pEnrollments.filter(e => e.status === "active");
        const completed = pAttendance.filter(a => a.status === "present").length;
        const absent = pAttendance.filter(a => a.status === "absent").length;

        return { active, completed, absent };
    };

    const handleCorrectAttendance = async () => {
        if (!correctData.attendanceId || !correctData.reason) return;
        setBusy(true);
        try {
            await correctAttendance(correctData.attendanceId, correctData.status, correctData.reason);
            setShowCorrectModal(false);
            router.refresh();
        } catch (e) {
            console.error(e);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Button variant="ghost" size="sm" onClick={() => router.push("/admin")} className="mb-2 -ml-2 text-gray-500">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                        </Button>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Court Oversight Surface</h1>
                        <p className="text-gray-500">Global operational controls and participant lifecycle management.</p>
                    </div>
                </div>

                <Tabs defaultValue="move" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-white border shadow-sm">
                        <TabsTrigger value="move" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                            Move Participant
                        </TabsTrigger>
                        <TabsTrigger value="makeup" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
                            Makeup Groups
                        </TabsTrigger>
                        <TabsTrigger value="absences" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700">
                            Absence Review
                        </TabsTrigger>
                        <TabsTrigger value="reports" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                            Court Reports
                        </TabsTrigger>
                    </TabsList>

                    {/* Move Participant Panel */}
                    <TabsContent value="move" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Reassign Participants</CardTitle>
                                <CardDescription>Move a participant from one program/schedule to another.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Search participant to move..."
                                            className="pl-10"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    <div className="border rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-gray-50">
                                                <TableRow>
                                                    <TableHead>Participant</TableHead>
                                                    <TableHead>Current Program</TableHead>
                                                    <TableHead>Current Schedule</TableHead>
                                                    <TableHead className="text-right">Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredParticipants.map(p => {
                                                    const enr = activeEnrollments.find(e => e.participantId === p.id);
                                                    const prog = programs.find(pr => pr.id === enr?.programId);
                                                    return (
                                                        <TableRow key={p.id}>
                                                            <TableCell className="font-medium">{p.name}</TableCell>
                                                            <TableCell>{prog?.name || "None"}</TableCell>
                                                            <TableCell>
                                                                {enr?.schedule ? `${enr.schedule.day} @ ${enr.schedule.time}` : "None"}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setSelectedParticipant(p);
                                                                        setShowMoveModal(true);
                                                                    }}
                                                                >
                                                                    <MoveRight className="h-4 w-4 mr-2" />
                                                                    Move
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Makeup Groups Panel */}
                    <TabsContent value="makeup" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Makeup Group Assignments</CardTitle>
                                <CardDescription>Designate makeup sessions for missed classes.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">Active Makeup Assignments</h3>
                                        <Button onClick={() => setShowMakeupModal(true)}>
                                            <Plus className="h-4 w-4 mr-2" /> Assign Makeup
                                        </Button>
                                    </div>

                                    <div className="border rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-gray-50">
                                                <TableRow>
                                                    <TableHead>Participant</TableHead>
                                                    <TableHead>Makeup Date</TableHead>
                                                    <TableHead>Facilitator</TableHead>
                                                    <TableHead>Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {makeupAssignments.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                                            No makeup assignments found.
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    makeupAssignments.map(a => {
                                                        const facilitator = facilitators.find(f => f.id === a.facilitatorId);
                                                        return (
                                                            <TableRow key={a.id}>
                                                                <TableCell className="font-medium">{a.participantName}</TableCell>
                                                                <TableCell>{a.makeupDate} @ {a.makeupTime}</TableCell>
                                                                <TableCell>{facilitator?.name || "Unknown"}</TableCell>
                                                                <TableCell>
                                                                    <Badge variant={a.status === "completed" ? "default" : "secondary"}>
                                                                        {a.status.toUpperCase()}
                                                                    </Badge>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Absence Review Panel */}
                    <TabsContent value="absences" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Absence Review</CardTitle>
                                <CardDescription>Identify participants with unexcused absences requiring court intervention.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(participantAbsences).map(([pid, abs]) => {
                                        const p = participants.find(part => part.id === pid);
                                        return (
                                            <Card key={pid} className="border-orange-200">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-base">{p?.name || "Unknown"}</CardTitle>
                                                    <CardDescription>{abs.length} missed sessions</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-2">
                                                        {abs.map((a, i) => (
                                                            <div key={i} className="flex items-center justify-between gap-2 text-xs text-orange-700 bg-orange-50 p-2 rounded">
                                                                <div className="flex items-center gap-2">
                                                                    <AlertCircle className="h-3 w-3" />
                                                                    <span>{a.date || a.sessionId}: {a.programId} (Session {a.sessionNumber})</span>
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-6 px-2 text-orange-600 hover:text-orange-800"
                                                                    onClick={() => {
                                                                        setCorrectData({ attendanceId: a.id, status: a.status, reason: "" });
                                                                        setShowCorrectModal(true);
                                                                    }}
                                                                >
                                                                    Correct
                                                                </Button>
                                                            </div>
                                                        ))}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full mt-2"
                                                            onClick={() => {
                                                                setSelectedParticipant(p);
                                                                setActiveTab("makeup");
                                                                setShowMakeupModal(true);
                                                            }}
                                                        >
                                                            Assign Makeup
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                    {Object.keys(participantAbsences).length === 0 && (
                                        <div className="col-span-full text-center py-12 text-gray-500">
                                            No absences found in active records.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Court Reports Panel */}
                    <TabsContent value="reports" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Participant Court Summaries</CardTitle>
                                <CardDescription>Authoritative snapshots for court hearings.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Search participant for report..."
                                            className="pl-10 text-gray-900"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {filteredParticipants.map(p => {
                                            const summary = getParticipantSummary(p.id);
                                            return (
                                                <Card key={p.id} className="hover:border-blue-300 transition-colors">
                                                    <CardHeader className="pb-2">
                                                        <CardTitle className="text-lg flex justify-between items-center">
                                                            <span>{p.name}</span>
                                                            <Badge variant="outline" className="text-xs">{p.email}</Badge>
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="grid md:grid-cols-3 gap-6">
                                                        <div className="space-y-1 border-r pr-4">
                                                            <Label className="text-[10px] uppercase text-gray-500">Active Enrollments</Label>
                                                            <div className="text-sm font-medium">
                                                                {summary.active.map(e => {
                                                                    const prog = programs.find(pr => pr.id === e.programId);
                                                                    return <div key={e.id}>{prog?.name} (Session {e.currentSessionNumber})</div>;
                                                                })}
                                                                {summary.active.length === 0 && "No active programs"}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1 border-r pr-4">
                                                            <Label className="text-[10px] uppercase text-gray-500">Attendance Recap</Label>
                                                            <div className="flex gap-4">
                                                                <div className="text-center">
                                                                    <div className="text-lg font-bold text-green-600">{summary.completed}</div>
                                                                    <div className="text-[10px] text-gray-500">Present</div>
                                                                </div>
                                                                <div className="text-center">
                                                                    <div className="text-lg font-bold text-red-600">{summary.absent}</div>
                                                                    <div className="text-[10px] text-gray-500">Absent</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-end">
                                                            <Button variant="outline" size="sm">
                                                                <FileText className="h-4 w-4 mr-2" />
                                                                View Full Report
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Move Modal */}
            <Dialog open={showMoveModal} onOpenChange={setShowMoveModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Move Participant: {selectedParticipant?.name}</DialogTitle>
                        <DialogDescription>Assign this participant to a new program and schedule.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Program</Label>
                            <Select value={targetProgram} onValueChange={setTargetProgram}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select program" />
                                </SelectTrigger>
                                <SelectContent>
                                    {programs.map(pr => (
                                        <SelectItem key={pr.id} value={pr.id}>{pr.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Schedule (Choose from Weekly Classes)</Label>
                            <Select value={targetSchedule ? JSON.stringify(targetSchedule) : ""} onValueChange={(v) => setTargetSchedule(JSON.parse(v))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select class time" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* Ideally we filter events by the selected program */}
                                    {allEvents.filter(e => e.programId === targetProgram).map(e => (
                                        <SelectItem key={e.id} value={JSON.stringify({
                                            day: e.dayOfWeek,
                                            time: e.time,
                                            room: e.location,
                                            facilitatorId: e.facilitatorId
                                        })}>
                                            {e.dayOfWeek} @ {e.time} ({e.facilitatorName})
                                        </SelectItem>
                                    ))}
                                    {allEvents.filter(e => e.programId === targetProgram).length === 0 && (
                                        <SelectItem value="none" disabled>No classes found for this program</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowMoveModal(false)} disabled={busy}>Cancel</Button>
                        <Button onClick={handleMoveParticipant} disabled={busy || !targetProgram || !targetSchedule} className="bg-blue-600 hover:bg-blue-700">
                            {busy ? "Moving..." : "Confirm Move"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Makeup Modal */}
            <Dialog open={showMakeupModal} onOpenChange={setShowMakeupModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Assign Makeup: {selectedParticipant?.name}</DialogTitle>
                        <DialogDescription>Add participant to a makeup group roster.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Makeup Date</Label>
                            <Input type="date" value={makeupData.date} onChange={(e) => setMakeupData({ ...makeupData, date: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Facilitator</Label>
                            <Select value={makeupData.facilitatorId} onValueChange={(v) => setMakeupData({ ...makeupData, facilitatorId: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select facilitator" />
                                </SelectTrigger>
                                <SelectContent>
                                    {facilitators.map(f => (
                                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowMakeupModal(false)} disabled={busy}>Cancel</Button>
                        <Button onClick={handleAssignMakeup} disabled={busy || !makeupData.date || !makeupData.facilitatorId} className="bg-green-600 hover:bg-green-700">
                            {busy ? "Assigning..." : "Confirm Assignment"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* Correction Modal */}
            <Dialog open={showCorrectModal} onOpenChange={setShowCorrectModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Correct Attendance Record</DialogTitle>
                        <DialogDescription>
                            Create a corrective record. The original record will remain for audit purposes.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>New Status</Label>
                            <Select
                                value={correctData.status}
                                onValueChange={(v: any) => setCorrectData({ ...correctData, status: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="present">Present</SelectItem>
                                    <SelectItem value="absent">Absent</SelectItem>
                                    <SelectItem value="excused">Excused</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Correction Reason (Required)</Label>
                            <Input
                                placeholder="Explain why this correction is being made..."
                                value={correctData.reason}
                                onChange={(e) => setCorrectData({ ...correctData, reason: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCorrectModal(false)} disabled={busy}>Cancel</Button>
                        <Button
                            onClick={handleCorrectAttendance}
                            disabled={busy || !correctData.reason}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            {busy ? "Correcting..." : "Confirm Correction"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
