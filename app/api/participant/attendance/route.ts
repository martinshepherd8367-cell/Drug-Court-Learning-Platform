import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/api-guards";
import { AttendanceRepo } from "@/lib/firestore/repos/attendance";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const user = await requireRole(["participant", "facilitator", "admin"]);
        const searchParams = req.nextUrl.searchParams;
        const participantId = searchParams.get("participantId") || user.uid;

        if (user.role === "participant" && participantId !== user.uid) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const attendance = await AttendanceRepo.listForParticipant(participantId);
        return NextResponse.json(attendance);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await requireRole(["participant", "facilitator"]);
        const body = await req.json();
        const { sessionId, date, status, isVirtual, verified, participantId } = body;

        // If participant is recording their own check-in
        const targetParticipantId = (user.role === "participant") ? user.uid : (participantId || user.uid);

        if (!sessionId) {
            return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
        }

        const id = await AttendanceRepo.recordAttendance({
            participantId: targetParticipantId,
            sessionId,
            date: date || new Date().toISOString().split('T')[0],
            status: status || "present",
            attended: (status === "present" || status === "late"),
            timestamp: new Date().toISOString(),
            isVirtual: !!isVirtual,
            verified: !!verified
        });

        return NextResponse.json({ success: true, id });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
