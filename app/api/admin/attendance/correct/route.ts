
import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";

export async function POST(req: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { attendanceId, status, reason } = body;

        if (!attendanceId || !status || !reason) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const db = getDb();
        const attendanceRef = db.collectionGroup("attendance");

        // We need to find the specific attendance doc. 
        // Note: collectionGroup requires finding which subcollection it belongs to if we don't have the path.
        // But our bootstrap uses collectionGroup("attendance"), so they might be nested.
        // If we have just ID, we might need a query or better yet, the caller provides the full path or we assume a collection.
        // The project has used both. Let's try to find it.

        // Strategy: find by id among all attendance.
        const attendanceSnap = await db.collectionGroup("attendance").get();
        const attendanceDoc = attendanceSnap.docs.find(d => d.id === attendanceId);

        if (!attendanceDoc) {
            return NextResponse.json({ error: "Attendance record not found" }, { status: 404 });
        }

        const originalData = attendanceDoc.data();
        if (!originalData) {
            return NextResponse.json({ error: "Data missing" }, { status: 404 });
        }

        // Verify session is closed
        const completedSessionSnap = await db.collection("completed_sessions")
            .where("sessionId", "==", originalData.sessionId)
            .where("classId", "==", originalData.classId)
            .limit(1)
            .get();

        if (completedSessionSnap.empty) {
            return NextResponse.json({ error: "Session is not closed" }, { status: 403 });
        }

        // Create new corrective record
        // The new record should be in the SAME collection as the original for consistency.
        const newAttendance = {
            ...originalData,
            status,
            attended: status === "present",
            isCorrection: true,
            originalRecordId: attendanceId,
            correctionReason: reason,
            correctedBy: user.uid,
            correctedAt: new Date().toISOString(),
        };
        // Remove 'id' if it exists in data
        delete (newAttendance as any).id;

        const result = await attendanceDoc.ref.parent.add(newAttendance);

        return NextResponse.json({
            message: "Attendance corrected",
            id: result.id,
            originalRecordId: attendanceId,
            newRecord: { id: result.id, ...newAttendance }
        });

    } catch (error: any) {
        console.error("Attendance correction failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
