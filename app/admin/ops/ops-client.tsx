"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ClipboardCopy, ArrowLeft, RefreshCw, AlertCircle, CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface Props {
    initialDate: string;
    events: any[];
    enrollments: any[];
    users: any[];
    attendance: any[];
    takeaways: any[];
}

export function OpsClient({ initialDate, events, enrollments, users, attendance, takeaways }: Props) {
    const router = useRouter();
    // Ensure we work with local date string correctly
    const [dateStr, setDateStr] = useState<string>(initialDate);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDateStr = e.target.value;
        setDateStr(newDateStr);
        router.push(`/admin/ops?date=${newDateStr}`);
    };

    // --- Derived State ---

    // 1. Map participants for quick lookup
    const userMap = useMemo(() => {
        return users.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
        }, {} as Record<string, any>);
    }, [users]);

    // 2. Process Events and attach rosters
    const processedEvents = useMemo(() => {
        return events.map(event => {
            // Find active enrollments for this program
            // Prefer scheduleEventId if present, fallback to programId
            const programEnrollments = enrollments.filter(e => {
                if (e.scheduleEventId && event.id) {
                    return e.scheduleEventId === event.id;
                }
                return e.programId === event.programId;
            });

            const roster = programEnrollments.map(enr => {
                const user = userMap[enr.participantId] || { name: "Unknown", email: "N/A" };

                // Find attendance record
                // Matching by participantId AND (scheduleEventId OR sessionId)
                // Adjust logic based on actual data shape found/assumed
                const att = attendance.find(a =>
                    a.participantId === user.id &&
                    (a.scheduleEventId === event.id || (a.sessionId === event.sessionId && a.date === initialDate))
                );

                // Find takeaway
                const takeaway = takeaways.find(t =>
                    t.participantId === user.id &&
                    t.sessionId === event.sessionId
                );

                // Determine Bucket
                let status = "not-scanned";
                if (att) {
                    status = att.status || (att.attended ? "present" : "absent"); // Fallback if status not explicit
                }

                // Needs Action Logic
                // e.g. Absent/Late/Pending without some "adminReviewed" flag?
                // simple heuristic: Absent or Pending implies action needed
                const needsAction = ["absent", "pending", "late"].includes(status);

                return {
                    participantId: user.id,
                    name: user.name,
                    email: user.email,
                    status, // present, late, absent, pending, not-scanned
                    takeawayStatus: takeaway ? takeaway.status : "missing", // received, approved, missing
                    takeawayContent: takeaway?.content,
                    needsAction,
                    attRecord: att
                };
            });

            // Sort roster: Needs Action first
            roster.sort((a, b) => (Number(b.needsAction) - Number(a.needsAction)));

            return {
                ...event,
                roster
            };
        });
    }, [events, enrollments, attendance, takeaways, userMap, initialDate]);

    // --- Clipboard Logic ---
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add toast here
    };

    const generateReport = (type: "needs-action" | "pending" | "missing-takeaways" | "summary") => {
        let report = `Daily Ops Report - ${initialDate}\nType: ${type.toUpperCase()}\n\n`;

        processedEvents.forEach(event => {
            report += `Event: ${event.programName || event.programId} (${event.time})\n`;
            let count = 0;

            event.roster.forEach((p: any) => {
                let include = false;
                if (type === "summary") include = true;
                if (type === "needs-action" && p.needsAction) include = true;
                if (type === "pending" && p.status === "pending") include = true;
                if (type === "missing-takeaways" && p.takeawayStatus === "missing") include = true;

                if (include) {
                    report += `- ${p.name}: [Att: ${p.status.toUpperCase()}] [HW: ${p.takeawayStatus.toUpperCase()}]\n`;
                    count++;
                }
            });
            if (count === 0) report += `(None)\n`;
            report += "\n";
        });

        copyToClipboard(report);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Button variant="ghost" size="sm" onClick={() => router.push("/admin")} className="mb-2 -ml-2 text-gray-500">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Daily Ops Cockpit</h1>
                    <p className="text-gray-500">Manage attendance and critical items for the day.</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-lg border shadow-sm">
                    <CalendarIcon className="h-4 w-4 text-gray-500 ml-2" />
                    <Input
                        type="date"
                        value={dateStr}
                        onChange={handleDateChange}
                        className="border-0 focus-visible:ring-0 w-auto"
                    />
                    <Button variant="ghost" size="icon" onClick={() => router.refresh()}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="rosters">Class Rosters</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Export Cards */}
                        <Card className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => generateReport("needs-action")}>
                            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Needs Action</CardTitle>
                                <ClipboardCopy className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold">
                                    {processedEvents.reduce((acc, e) => acc + e.roster.filter((r: any) => r.needsAction).length, 0)}
                                </div>
                                <p className="text-xs text-muted-foreground">Absent, Late, or Pending</p>
                            </CardContent>
                        </Card>
                        <Card className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => generateReport("pending")}>
                            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Check-Ins</CardTitle>
                                <ClipboardCopy className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold">
                                    {processedEvents.reduce((acc, e) => acc + e.roster.filter((r: any) => r.status === 'pending').length, 0)}
                                </div>
                                <p className="text-xs text-muted-foreground">Requires verification</p>
                            </CardContent>
                        </Card>
                        <Card className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => generateReport("missing-takeaways")}>
                            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Missing Takeaways</CardTitle>
                                <ClipboardCopy className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold">
                                    {processedEvents.reduce((acc, e) => acc + e.roster.filter((r: any) => r.takeawayStatus === 'missing').length, 0)}
                                </div>
                                <p className="text-xs text-muted-foreground">For today's sessions</p>
                            </CardContent>
                        </Card>
                        <Card className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => generateReport("summary")}>
                            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Daily Summary</CardTitle>
                                <ClipboardCopy className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold">
                                    {processedEvents.length} Classes
                                </div>
                                <p className="text-xs text-muted-foreground">Scheduled for today</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="rosters" className="space-y-6">
                    {processedEvents.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No events scheduled for this date.
                        </div>
                    ) : (
                        processedEvents.map(event => (
                            <Card key={event.id} className="overflow-hidden">
                                <CardHeader className="bg-gray-50/50 border-b pb-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle>{event.programName || "Program Data Missing"}</CardTitle>
                                            <CardDescription>
                                                Session {event.sessionNumber} • {event.time} • Facilitator: {event.facilitatorName || "Unassigned"}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="outline" className="bg-white">
                                            {event.roster.length} Enrolled
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <ScrollArea className="h-[300px] w-full">
                                        <div className="divide-y">
                                            {event.roster.map((p: any) => (
                                                <div key={p.participantId} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                                    <div className="flex items-center gap-3">
                                                        {/* Status Icon */}
                                                        {p.status === 'present' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                                        {p.status === 'absent' && <XCircle className="w-5 h-5 text-red-500" />}
                                                        {p.status === 'late' && <Clock className="w-5 h-5 text-amber-500" />}
                                                        {p.status === 'pending' && <AlertCircle className="w-5 h-5 text-blue-500" />}
                                                        {p.status === 'not-scanned' && <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}

                                                        <div>
                                                            <p className="font-medium text-sm text-gray-900">{p.name}</p>
                                                            <div className="flex gap-2 text-xs text-muted-foreground">
                                                                <span>HW: {p.takeawayStatus}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant={p.status === 'present' ? 'default' : 'secondary'}
                                                            className={cn(
                                                                p.status === 'absent' && "bg-red-100 text-red-700 hover:bg-red-200",
                                                                p.status === 'late' && "bg-amber-100 text-amber-700 hover:bg-amber-200",
                                                                p.status === 'not-scanned' && "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                            )}
                                                        >
                                                            {p.status.toUpperCase().replace("-", " ")}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
