
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const admin = await getAuthenticatedUser();
        if (!admin || admin.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const {
            participantId,
            participantName,
            missedSessionId,
            missedProgramId,
            missedProgramName,
            missedSessionNumber,
            missedDate,
            makeupDate,
            makeupTime,
            facilitatorId
        } = body;

        if (!participantId || !makeupDate || !facilitatorId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const db = getDb();
        const newAssignment = {
            participantId,
            participantName: participantName || "Unknown",
            missedSessionId: missedSessionId || "",
            missedProgramId: missedProgramId || "",
            missedProgramName: missedProgramName || "",
            missedSessionNumber: missedSessionNumber || 0,
            missedDate: missedDate || "",
            makeupDate,
            makeupTime: makeupTime || "10:00 AM",
            facilitatorId,
            facilitatorAssigned: false,
            assignedWorksheets: [],
            assignedReadings: [],
            assignedInstructions: "",
            status: "pending",
            checkedIn: false,
            createdAt: new Date().toISOString(),
        };

        const docRef = await db.collection("makeupAssignments").add(newAssignment);

        return NextResponse.json({ id: docRef.id, ...newAssignment });
    } catch (error: any) {
        console.error("Create makeup assignment failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = getDb();
        const snap = await db.collection("makeupAssignments").get();
        const assignments = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return NextResponse.json(assignments);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
