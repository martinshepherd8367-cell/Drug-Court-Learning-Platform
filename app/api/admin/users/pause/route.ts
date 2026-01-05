
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
        const { participantId, pauseReason, pauseDate, expectedReturnDate } = body;

        if (!participantId || !pauseReason || !pauseDate) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const db = getDb();
        const userRef = db.collection("users").doc(participantId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return NextResponse.json({ error: "Participant not found" }, { status: 404 });
        }

        const userData = userDoc.data();
        if (userData?.role !== "participant") {
            return NextResponse.json({ error: "User is not a participant" }, { status: 400 });
        }

        // 1. Set participant status = Paused and record metadata (Immutable Audit)
        await userRef.update({
            status: "paused",
            pauseReason,
            pauseDate,
            expectedReturnDate: expectedReturnDate || null,
            pausedBy: admin.uid,
            pausedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        // 2. Unenroll participant from all active programs
        // We do this by setting enrollment status to "paused" (as per preserves history)
        const enrollmentsSnap = await db.collection("enrollments")
            .where("participantId", "==", participantId)
            .where("status", "==", "active")
            .get();

        const batch = db.batch();
        enrollmentsSnap.forEach(doc => {
            batch.update(doc.ref, {
                status: "paused",
                updatedAt: new Date().toISOString()
            });
        });

        await batch.commit();

        return NextResponse.json({
            success: true,
            message: `Participant ${participantId} has been paused and enrollments updated.`
        });

    } catch (error: any) {
        console.error("Pause participant failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
