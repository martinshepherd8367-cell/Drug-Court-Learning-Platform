import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/api-guards";
import { SessionsRepo } from "@/lib/firestore/repos/sessions";
import { AttendanceRepo } from "@/lib/firestore/repos/attendance";

export async function POST(req: NextRequest) {
    try {
        const user = await requireRole(["facilitator", "admin"]);
        const body = await req.json();
        const { classId, programId, sessionNumber, facilitatorId, attendance } = body;

        if (!classId || !programId || (sessionNumber === undefined) || !attendance || typeof attendance !== 'object') {
            return NextResponse.json({ error: "Missing required fields or invalid attendance format" }, { status: 400 });
        }

        const attendeeIds: string[] = [];
        const absenteeIds: string[] = [];
        const excusedIds: string[] = [];

        // attendance is a map of participantId -> status
        for (const [pId, status] of Object.entries(attendance)) {
            if (status === "present") attendeeIds.push(pId);
            else if (status === "absent") absenteeIds.push(pId);
            else if (status === "excused") excusedIds.push(pId);
        }

        // 1. Mark session as completed (Idempotent)
        const completedSessionId = await SessionsRepo.markCompleted({
            classId,
            programId,
            sessionNumber,
            facilitatorId: facilitatorId || user.uid,
            completedAt: new Date().toISOString(),
            attendeeIds,
            absenteeIds,
            excusedIds
        });

        // 2. Record attendance for each participant
        const attendancePromises = Object.entries(attendance).map(([pId, status]) => {
            return AttendanceRepo.recordAttendance({
                participantId: pId,
                sessionId: `${programId}-${sessionNumber}`,
                classId: classId,
                date: new Date().toISOString().split('T')[0],
                status: status as any,
                attended: status === "present",
                timestamp: new Date().toISOString(),
                verified: true
            });
        });

        await Promise.all(attendancePromises);

        return NextResponse.json({ success: true, id: completedSessionId });
    } catch (e: any) {
        console.error("Error completing session:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
